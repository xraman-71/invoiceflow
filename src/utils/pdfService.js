import { jsPDF } from 'jspdf';
import { formatDate, formatCurrency } from './calculations';

export const generateInvoicePDF = async (data) => {
  const { 
    type, 
    fields = [],
    meta = {},
    number, 
    date, 
    dueDate, 
    from, 
    to, 
    items, 
    totals, 
    notes,
    currency = '$',
    branding = { logo: null, logoPos: 'right', logoScale: 1, logoOpacity: 1 }
  } = data;

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pw = 210;
  const ph = 297;
  const m = 20;
  const cw = pw - m * 2;
  let y = m;

  // --- Background: Fill whole page with white first ---
  doc.setFillColor('#ffffff');
  doc.rect(0, 0, pw, ph, 'F');

  // --- Branding: Logo ---
  if (branding.logo) {
    try {
      const logoWidth = 30 * branding.logoScale;
      const logoHeight = 30 * branding.logoScale;
      let lx = m;
      if (branding.logoPos === 'center') lx = (pw - logoWidth) / 2;
      if (branding.logoPos === 'right') lx = pw - m - logoWidth;
      
      // Isolate branding styles (opacity, etc.)
      const hasSaveState = typeof doc.saveGraphicsState === 'function';
      if (hasSaveState) doc.saveGraphicsState();
      
      const logoGS = new doc.GState({ opacity: branding.logoOpacity, 'fill-opacity': branding.logoOpacity });
      doc.setGState(logoGS);
      
      doc.addImage(branding.logo, 'PNG', lx, y, logoWidth, logoHeight, undefined, 'FAST');
      
      // Revert to original graphics state
      if (hasSaveState) {
        doc.restoreGraphicsState();
      } else {
        doc.setGState(new doc.GState({ opacity: 1.0, 'fill-opacity': 1.0 }));
      }
      
      y += logoHeight + 10;
    } catch (e) {
      console.warn('Logo processing failed', e);
    }
  }

  // --- Header ---

  doc.setTextColor('#111827');
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(from.name || 'Your Business', m, y + 8);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor('#6B7280');
  doc.text(type.toUpperCase(), pw - m, y + 2, { align: 'right' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#111827');
  doc.text(number || 'INV-001', pw - m, y + 10, { align: 'right' });

  y += 28;
  
  // --- Parties & Details ---
  const detailY = y;
  
  // From Section
  doc.setTextColor('#6B7280');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('FROM', m, y);
  
  y += 6;
  doc.setTextColor('#374151');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const fromLines = [from.address, from.email, from.phone].filter(Boolean);
  if (fromLines.length > 0) {
    const fromText = doc.splitTextToSize(fromLines.join('\n'), cw / 2 - 5);
    doc.text(fromText, m, y);
    y += fromText.length * 5;
  }

  // Bill To Section (on the same row)
  let by = detailY;
  doc.setTextColor('#6B7280');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO', m + cw / 2, by);
  
  by += 6;
  doc.setTextColor('#111827');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(to.name || 'Client Name', m + cw / 2, by);
  
  by += 5;
  doc.setTextColor('#374151');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  if (to.address || to.email) {
    const toLines = [to.address, to.email].filter(Boolean);
    const toText = doc.splitTextToSize(toLines.join('\n'), cw / 2 - 5);
    doc.text(toText, m + cw / 2, by);
    by += toText.length * 5;
  }

  y = Math.max(y, by) + 12;

  // --- Dates Bar ---
  doc.setDrawColor('#E5E7EB');
  doc.setLineWidth(0.2);
  doc.line(m, y, pw - m, y);
  
  y += 8;
  const colWidth = cw / 4;
  
  const drawDetail = (label, val, x) => {
    doc.setTextColor('#6B7280');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(label.toUpperCase(), x, y);
    doc.setTextColor('#111827');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(val || '-', x, y + 5);
  };

  drawDetail('Date of Issue', formatDate(date), m);
  drawDetail('Due Date', formatDate(dueDate), m + colWidth);
  drawDetail('Currency', currency, m + colWidth * 2);
  drawDetail('Balance Due', formatCurrency(totals.total, currency), m + colWidth * 3);

  y += 15;
  doc.line(m, y, pw - m, y);

  // --- Dynamic Meta Details ---
  const activeFields = fields.filter(f => meta[f.id]);
  if (activeFields.length > 0) {
    y += 10;
    const rows = Math.ceil(activeFields.length / 3);
    activeFields.forEach((field, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      const fx = m + (col * (cw / 3));
      const fy = y + (row * 12);
      
      doc.setTextColor('#9CA3AF');
      doc.setFontSize(6);
      doc.setFont('helvetica', 'bold');
      doc.text(field.label.toUpperCase(), fx, fy);
      
      doc.setTextColor('#374151');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(String(meta[field.id]), fx, fy + 4.5);
    });
    y += rows * 12 + 4;
    doc.line(m, y, pw - m, y);
  }

  y += 12;

  // --- Items Table ---
  // Header
  doc.setTextColor('#111827');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('DESCRIPTION', m, y);
  doc.text('QTY', m + 110, y, { align: 'right' });
  doc.text('PRICE', m + 140, y, { align: 'right' });
  doc.text('AMOUNT', pw - m, y, { align: 'right' });

  y += 4;
  doc.setDrawColor('#111827');
  doc.setLineWidth(0.5);
  doc.line(m, y, pw - m, y);
  
  y += 8;

  // Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setLineWidth(0.1);
  doc.setDrawColor('#F3F4F6');

  items.forEach((item, index) => {
    doc.setTextColor('#374151');
    const desc = doc.splitTextToSize(item.description || 'Item description...', 95);
    doc.text(desc, m, y);
    
    doc.text(String(item.qty || 0), m + 110, y, { align: 'right' });
    doc.text(formatCurrency(item.price, currency), m + 140, y, { align: 'right' });
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#111827');
    const lineTotal = (parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0);
    doc.text(formatCurrency(lineTotal, currency), pw - m, y, { align: 'right' });
    doc.setFont('helvetica', 'normal');

    y += desc.length * 6;
    doc.line(m, y, pw - m, y);
    y += 6;

    // Page Break Support (Simple)
    if (y > ph - 60) {
      doc.addPage();
      y = m;
    }
  });

  // --- Totals ---
  y += 4;
  const totalX = pw - m - 60;
  
  const drawTotal = (label, value, isGrand = false) => {
    doc.setTextColor('#6B7280');
    doc.setFontSize(isGrand ? 10 : 9);
    doc.setFont('helvetica', isGrand ? 'bold' : 'normal');
    doc.text(label, totalX, y);
    
    doc.setTextColor(isGrand ? '#111827' : '#374151');
    doc.text(formatCurrency(value, currency), pw - m, y, { align: 'right' });
    y += isGrand ? 10 : 6;
  };

  drawTotal('Subtotal', totals.subtotal);
  drawTotal(`Tax (${data.globalTax}%)`, totals.tax);
  if (totals.discount > 0) drawTotal('Discount', -totals.discount);
  
  y += 2;
  doc.setDrawColor('#111827');
  doc.setLineWidth(0.5);
  doc.line(totalX, y, pw - m, y);
  y += 8;
  drawTotal('Grand Total', totals.total, true);

  // --- Notes ---
  if (notes) {
    y += 10;
    doc.setTextColor('#6B7280');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('NOTES & REMARKS', m, y);
    
    y += 5;
    doc.setTextColor('#4B5563');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const noteLines = doc.splitTextToSize(notes, cw - 40);
    doc.text(noteLines, m, y);
    y += noteLines.length * 5 + 10;
  }

  // --- Signature ---
  if (branding.signature) {
    try {
      const sigWidth = 45 * (branding.signatureScale || 1);
      const sigHeight = 15 * (branding.signatureScale || 1);
      
      // Place BELOW notes with a gap
      let sigY = y + 8;
      
      // Page Break Support for Signature
      if (sigY + sigHeight > ph - 25) {
        doc.addPage();
        sigY = m;
      }

      doc.addImage(branding.signature, 'PNG', m, sigY, sigWidth, sigHeight, undefined, 'FAST');
      
      doc.setTextColor('#9CA3AF');
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text('AUTHORIZED SIGNATURE', m, sigY + sigHeight + 4);
      
      y = sigY + sigHeight + 10;
    } catch (e) {
      console.warn('Signature processing failed', e);
    }
  }

  // --- Footer ---
  doc.setTextColor('#9CA3AF');
  doc.setFontSize(7);
  doc.text(`Generated by InvoiceFlow · Premium Suite · ${number || 'INV-001'}`, m, ph - 15);
  doc.text('Page 1 of 1', pw - m, ph - 15, { align: 'right' });

  doc.save(`${number || 'invoice'}.pdf`);
};
