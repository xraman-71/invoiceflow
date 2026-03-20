export const calculateLineTotal = (qty, price, tax = 0) => {
  const quantity = parseFloat(qty) || 0;
  const unitPrice = parseFloat(price) || 0;
  const taxRate = parseFloat(tax) || 0;
  return quantity * unitPrice * (1 + taxRate / 100);
};

export const calculateTotals = (items, globalTax = 0, discount = 0) => {
  let subtotal = 0;
  let totalTax = 0;
  
  const hasItemSpecificTax = items.some(item => (parseFloat(item.tax) || 0) > 0);

  items.forEach(item => {
    const qty = parseFloat(item.qty) || 0;
    const price = parseFloat(item.price) || 0;
    const itemTax = parseFloat(item.tax) || 0;
    
    subtotal += qty * price;
    if (hasItemSpecificTax) {
      totalTax += qty * price * (itemTax / 100);
    }
  });

  if (!hasItemSpecificTax) {
    totalTax = subtotal * (parseFloat(globalTax) || 0) / 100;
  }

  const discountAmount = parseFloat(discount) || 0;
  const grandTotal = Math.max(0, subtotal + totalTax - discountAmount);

  return {
    subtotal,
    tax: totalTax,
    discount: discountAmount,
    total: grandTotal,
  };
};

export const formatCurrency = (amount, symbol = '$') => {
  return `${symbol}${parseFloat(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};
