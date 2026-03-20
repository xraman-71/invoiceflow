import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Download, FileText, Trash2, RotateCcw, Eye, ChevronRight, ChevronDown, LayoutGrid, Palette, Upload, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import TemplatesPage from './TemplatesPage';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Constants ---
const INVOICE_TYPES = [
  { 
    id: 'standard', 
    name: 'Standard Invoice', 
    code: 'STD', 
    desc: 'Everyday sales & services', 
    color: '#6C63FF',
    fields: []
  },
  { 
    id: 'commercial', 
    name: 'Commercial Invoice', 
    code: 'COM', 
    desc: 'Customs document for trade', 
    color: '#9A3412',
    fields: [
      { id: 'originCountry', label: 'Country of Origin', placeholder: 'e.g. United States' },
      { id: 'destCountry', label: 'Country of Destination', placeholder: 'e.g. Germany' },
      { id: 'incoterms', label: 'Incoterms', placeholder: 'e.g. FOB, CIF, EXW' },
      { id: 'shippingMethod', label: 'Shipping Method', placeholder: 'e.g. Air Freight' },
      { id: 'blNumber', label: 'B/L or AWB No.', placeholder: 'Reference Number' },
      { id: 'portLoading', label: 'Port of Loading', placeholder: 'Departure Port' },
      { id: 'portDischarge', label: 'Port of Discharge', placeholder: 'Arrival Port' }
    ]
  },
  { 
    id: 'credit', 
    name: 'Credit Note', 
    code: 'CRN', 
    desc: 'Refunds & billing corrections', 
    color: '#0F766E',
    fields: [
      { id: 'originalInvNum', label: 'Original Invoice #', placeholder: 'REF-001' },
      { id: 'originalInvDate', label: 'Original Invoice Date', type: 'date' },
      { id: 'reason', label: 'Reason for Credit', placeholder: 'e.g. Goods Returned' }
    ]
  },
  { 
    id: 'proforma', 
    name: 'Proforma Invoice', 
    code: 'PRO', 
    desc: 'Preliminary invoice before delivery', 
    color: '#1D4ED8',
    fields: []
  },
  { 
    id: 'tax', 
    name: 'Tax Invoice', 
    code: 'TAX', 
    desc: 'VAT/GST compliant billing', 
    color: '#15803D',
    fields: [
      { id: 'sellerTaxId', label: 'Seller Tax/GST ID', placeholder: 'e.g. 27AAPFU0939F1ZV' },
      { id: 'buyerTaxId', label: 'Buyer Tax/GST ID', placeholder: 'e.g. 29GGGGG1314R9Z6' },
      { id: 'taxType', label: 'Tax Type', placeholder: 'GST / VAT / IGST' },
      { id: 'hsnCode', label: 'HSN/SAC Code', placeholder: 'Accounting Code' }
    ]
  },
  { 
    id: 'debit', 
    name: 'Debit Note', 
    code: 'DBN', 
    desc: 'Additional scope & adjustments', 
    color: '#B45309',
    fields: [
      { id: 'originalInvNum', label: 'Original Invoice #', placeholder: 'REF-001' },
      { id: 'reason', label: 'Reason for Debit', placeholder: 'e.g. Underbilling' }
    ]
  },
  { 
    id: 'recurring', 
    name: 'Recurring Invoice', 
    code: 'REC', 
    desc: 'Subscriptions & retainers', 
    color: '#6D28D9',
    fields: [
      { id: 'frequency', label: 'Billing Frequency', placeholder: 'Monthly, Annual, etc.' },
      { id: 'periodStart', label: 'Period Start', type: 'date' },
      { id: 'periodEnd', label: 'Period End', type: 'date' },
      { id: 'nextInvDate', label: 'Next Invoice Date', type: 'date' },
      { id: 'contractId', label: 'Contract ID', placeholder: 'SUB-2024' }
    ]
  },
  { 
    id: 'final', 
    name: 'Final Invoice', 
    code: 'FIN', 
    desc: 'Project completion billing', 
    color: '#111827',
    fields: []
  },
];

import { calculateTotals, formatCurrency } from './utils/calculations';
import { generateInvoicePDF } from './utils/pdfService';

export default function App() {
  const [view, setView] = useState('landing'); // landing, hub, editor, templates, about, faq, features, privacy, terms
  const [selectedType, setSelectedType] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // --- Invoice State ---
  const [invoiceData, setInvoiceData] = useState({
    number: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    currency: '$',
    from: { name: '', email: '', phone: '', address: '' },
    to: { name: '', email: '', address: '' },
    items: [{ id: Date.now(), description: '', qty: 1, price: 0, tax: 0 }],
    globalTax: 0,
    discount: 0,
    notes: '',
    meta: {}, // For dynamic fields
    branding: {
      logo: null,
      logoPos: 'left', // left, center, right
      logoScale: 1,
      logoOpacity: 1,
      signature: null,
      signatureScale: 1
    }
  });

  const [totals, setTotals] = useState({ subtotal: 0, tax: 0, discount: 0, total: 0 });

  useEffect(() => {
    if (selectedType) {
      const year = new Date().getFullYear();
      setInvoiceData(prev => ({
        ...prev,
        number: `${selectedType.code}-${year}-001`,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }));
    }
  }, [selectedType]);

  useEffect(() => {
    setTotals(calculateTotals(invoiceData.items, invoiceData.globalTax, invoiceData.discount));
  }, [invoiceData.items, invoiceData.globalTax, invoiceData.discount]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const handleBrandingChange = (field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      branding: { ...prev.branding, [field]: value }
    }));
  };

  const handleInputChange = (path, value) => {
    setInvoiceData(prev => {
      const newData = { ...prev };
      const parts = path.split('.');
      if (parts.length === 2) {
        newData[parts[0]] = { ...newData[parts[0]], [parts[1]]: value };
      } else if (parts[0] === 'meta') {
        newData.meta = { ...prev.meta, [parts[1]]: value };
      } else {
        newData[path] = value;
      }
      return newData;
    });
  };

  const handleItemChange = (id, field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now(), description: '', qty: 1, price: 0, tax: 0 }]
    }));
  };

  const removeItem = (id) => {
    if (invoiceData.items.length === 1) return;
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleDownload = async () => {
    await generateInvoicePDF({
      ...invoiceData,
      type: selectedType.name,
      fields: selectedType.fields,
      totals,
    });
  };

  return (
    <div className="min-h-screen bg-bg-main selection:bg-primary/20 relative overflow-x-hidden">
      {/* Background Decor (Premium Flair) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 select-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-violet-soft/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.4] mix-blend-soft-light" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-10 h-20 flex items-center justify-between",
        (isScrolled || view !== 'landing') ? "glass shadow-sm border-b border-black/[0.05]" : "bg-transparent"
      )}>
        <div 
          className="flex items-center gap-3 group cursor-pointer" 
          onClick={() => { setView('landing'); setSelectedType(null); window.scrollTo(0,0); }}
        >
          <div className="w-10 h-10 bg-text-primary rounded-2xl flex items-center justify-center transition-all group-hover:rotate-[-12deg] group-hover:scale-110 shadow-lg shadow-primary/10">
            <FileText className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight select-none bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">InvoiceFlow</span>
        </div>
        
        <div className="hidden md:flex items-center gap-12">
          {['Features', 'How it Works', 'FAQ', 'Why Us'].map((item) => (
            <button 
              key={item}
              className="text-[13px] font-semibold text-text-muted hover:text-primary transition-all hover:translate-y-[-1px]"
              onClick={() => {
                if (item === 'Why Us') {
                  setView('why-us');
                  window.scrollTo(0, 0);
                  return;
                }
                if (view !== 'landing') setView('landing');
                setTimeout(() => {
                  const id = item.toLowerCase().replace(/\s+/g, '-');
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            className="text-sm font-bold text-text-primary hover:text-primary transition-all hidden sm:block"
            onClick={() => setView('templates')}
          >
            All Templates
          </button>
          <div className="w-px h-5 bg-border-light/50 hidden sm:block" />
          <button 
            className="group bg-text-primary text-white px-6 py-2.5 rounded-2xl font-display font-bold text-sm tracking-tight transition-all hover:bg-primary hover:shadow-[0_12px_24px_rgba(108,99,255,0.2)] hover:translate-y-[-2px] flex items-center gap-2"
            onClick={() => { setView('hub'); setSelectedType(null); }}
          >
            Get Started
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={3} />
          </button>
        </div>
      </nav>

      <main className={cn("pt-24 pb-12 px-10 max-w-7xl mx-auto", view === 'landing' && "pt-0 max-w-none px-0")}>
        <AnimatePresence mode="wait">
          {view === 'why-us' && (
             <motion.div
               key="why-us"
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 1.02 }}
               className="px-6 py-12"
             >
               <WhyUsPage onStart={() => setView('hub')} />
             </motion.div>
          )}

          {view === 'landing' && (
             <motion.div
               key="landing"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="px-6 max-w-7xl mx-auto"
             >
               <LandingPage onStart={() => setView('hub')} />
             </motion.div>
          )}

          {view === 'hub' && (
            <motion.div
              key="hub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-20"
            >
              <div className="text-center space-y-6 max-w-3xl mx-auto">
                <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="inline-flex items-center gap-2 px-4 py-1.5 bg-bg-tint border border-primary/10 rounded-2xl text-[11px] font-display font-bold text-primary tracking-widest uppercase"
                >
                   Template Hub
                </motion.div>
                 <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-text-primary tracking-tighter leading-none">
                   8 Invoice Types. <br/>Every Business Need.
                 </h2>
                <p className="text-text-muted text-base font-medium">Select a purpose-built template to start your professional billing journey.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {INVOICE_TYPES.map((type, idx) => (
                  <motion.div
                    key={type.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => { setSelectedType(type); setView('editor'); }}
                    className="group relative bg-white border border-black/[0.08] p-8 rounded-2xl cursor-pointer hover:bg-white hover:shadow-2xl hover:translate-y-[-8px] transition-all duration-500 overflow-hidden shadow-sm"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Plus className="w-4 h-4" strokeWidth={3} />
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500" style={{ backgroundColor: type.color }}>
                            <span className="font-display font-black text-sm">{type.code}</span>
                         </div>
                         <span className="text-[10px] font-display font-bold text-text-muted/40 uppercase tracking-widest italic pt-1">Type {idx < 9 ? `0${idx+1}` : idx+1}</span>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-display font-extrabold text-xl text-text-primary tracking-tight group-hover:text-primary transition-colors">{type.name}</h3>
                        <p className="text-xs text-text-muted font-medium leading-relaxed">{type.desc}</p>
                      </div>
                      <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest pt-2">
                         Explore Template <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" strokeWidth={3} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'templates' && (
            <motion.div
              key="templates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <TemplatesPage
                onSelectTemplate={(template) => {
                  setSelectedType(template.type);
                  setInvoiceData({
                    ...template.invoiceData,
                    number: `${template.type.code}-${new Date().getFullYear()}-001`,
                  });
                  setView('editor');
                }}
              />
            </motion.div>
          )}

          {view === 'editor' && selectedType && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-24"
            >
              <div className="flex items-center justify-between gap-4 flex-wrap border-b border-border-light pb-6">
                 <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setView('hub')}
                      className="w-10 h-10 rounded-2xl border border-border-light flex items-center justify-center hover:bg-bg-tint transition-colors group"
                    >
                      <LayoutGrid className="w-4 h-4 text-text-muted group-hover:text-primary" />
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-display font-extrabold text-2xl tracking-tighter text-text-primary">{selectedType.name}</h2>
                        <span className="px-1.5 py-0.5 rounded-2xl bg-text-primary text-white text-[9px] font-display font-bold uppercase">{selectedType.code}</span>
                      </div>
                      <p className="text-text-muted text-xs">Create your professional {selectedType.id} document.</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setShowPreview(true)}
                      className="px-4 py-2 border border-border-light rounded-2xl text-sm font-medium hover:bg-bg-tint transition-all flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button 
                      onClick={handleDownload}
                      className="px-4 py-2 bg-text-primary text-white rounded-2xl text-sm font-bold font-display tracking-tight hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                 </div>
              </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                 <div className="lg:col-span-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    <div className="bg-white border border-black/[0.08] rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] space-y-6">
                      <h3 className="text-[10px] font-display font-bold text-text-muted uppercase tracking-[0.2em] border-b border-border-light pb-4">Business Details</h3>
                      <div className="space-y-4">
                        <Input label="Business Name" value={invoiceData.from.name} onChange={v => handleInputChange('from.name', v)} placeholder="Your Company Ltd" />
                        <Input label="Email Address" value={invoiceData.from.email} onChange={v => handleInputChange('from.email', v)} placeholder="billing@company.com" />
                        <Input label="Address" value={invoiceData.from.address} onChange={v => handleInputChange('from.address', v)} placeholder="123 Street Name, City" />
                      </div>
                    </div>
                    
                    <div className="bg-white border border-black/[0.08] rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] space-y-6">
                      <h3 className="text-[10px] font-display font-bold text-text-muted uppercase tracking-[0.2em] border-b border-border-light pb-4">Bill To</h3>
                      <div className="space-y-4">
                        <Input label="Client Name" value={invoiceData.to.name} onChange={v => handleInputChange('to.name', v)} placeholder="Client Company" />
                        <Input label="Client Email" value={invoiceData.to.email} onChange={v => handleInputChange('to.email', v)} placeholder="client@example.com" />
                        <Input label="Billing Address" value={invoiceData.to.address} onChange={v => handleInputChange('to.address', v)} placeholder="456 Avenue Address" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-black/[0.08] rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] max-w-5xl mx-auto">
                    <h3 className="text-[10px] font-display font-bold text-text-muted uppercase tracking-[0.2em] border-b border-border-light pb-4 mb-6">Order Information</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <Input label="Invoice #" value={invoiceData.number} onChange={v => handleInputChange('number', v)} />
                      <Input label="Date" type="date" value={invoiceData.date} onChange={v => handleInputChange('date', v)} />
                      <Input label="Due Date" type="date" value={invoiceData.dueDate} onChange={v => handleInputChange('dueDate', v)} />
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-display font-bold text-text-muted uppercase tracking-wider">Currency</label>
                        <select 
                          value={invoiceData.currency}
                          onChange={e => handleInputChange('currency', e.target.value)}
                          className="w-full bg-white border border-border-light rounded-2xl px-3 py-2 text-xs font-display focus:border-primary outline-none transition-all"
                        >
                          <option value="$">USD ($)</option>
                          <option value="€">EUR (€)</option>
                          <option value="£">GBP (£)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {selectedType.fields && selectedType.fields.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-black/[0.08] rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] max-w-5xl mx-auto"
                    >
                      <h3 className="text-[10px] font-display font-bold text-text-muted uppercase tracking-[0.2em] border-b border-border-light pb-4 mb-6">{selectedType.name} Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {selectedType.fields.map(field => (
                          <Input 
                            key={field.id}
                            label={field.label} 
                            type={field.type || 'text'}
                            value={invoiceData.meta[field.id] || ''} 
                            onChange={v => handleInputChange(`meta.${field.id}`, v)} 
                            placeholder={field.placeholder}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <div className="bg-white border border-black/[0.08] rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.03)] max-w-5xl mx-auto">
                    <div className="px-8 py-5 bg-bg-section/50 border-b border-border-light/50 flex justify-between items-center text-sm font-medium">
                      <h3 className="text-[10px] font-display font-bold text-text-muted uppercase tracking-[0.2em]">Line Items</h3>
                      <span className="text-[10px] font-display text-primary bg-primary/5 px-2.5 py-1 rounded-2xl border border-primary/10">{invoiceData.items.length} positions</span>
                    </div>
                    <div className="p-0 overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead className="bg-bg-section/70 text-[10px] font-display font-bold text-text-muted/60 uppercase tracking-[0.15em] border-b border-border-light/50">
                          <tr>
                            <th className="px-8 py-4 w-16 text-center">#</th>
                            <th className="px-4 py-4 text-left min-w-[240px]">Service / Product Description</th>
                            <th className="px-4 py-4 text-right w-24">Qty</th>
                            <th className="px-4 py-4 text-right w-36">Unit Price</th>
                            <th className="px-4 py-4 text-right w-36">Line Total</th>
                            <th className="px-8 py-4 w-16"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light/50 bg-white/40">
                          {invoiceData.items.map((item, idx) => (
                            <tr key={item.id} className="group hover:bg-white/60 transition-all duration-300">
                              <td className="px-8 py-5 text-center text-[10px] font-display font-bold text-text-muted/40">{String(idx + 1).padStart(2, '0')}</td>
                              <td className="px-4 py-5">
                                <input 
                                  className="w-full bg-transparent border-none p-0 text-sm font-medium text-text-primary placeholder:text-text-muted/20 focus:ring-0 outline-none"
                                  placeholder="What are you billing for?..."
                                  value={item.description}
                                  onChange={e => handleItemChange(item.id, 'description', e.target.value)}
                                />
                              </td>
                              <td className="px-4 py-5 text-right">
                                <input 
                                  type="number"
                                  className="w-full bg-transparent border-none p-0 text-sm font-display font-bold text-right text-text-primary focus:ring-0 outline-none"
                                  style={{ color: 'var(--primary)' }}
                                  value={item.qty}
                                  onChange={e => handleItemChange(item.id, 'qty', e.target.value)}
                                />
                              </td>
                              <td className="px-4 py-5 text-right">
                                <div className="flex items-center justify-end gap-1 font-display font-bold text-text-secondary/60">
                                  <span className="text-[10px]">{invoiceData.currency}</span>
                                  <input 
                                    type="number"
                                    className="w-24 bg-transparent border-none p-0 text-sm text-right text-text-secondary focus:ring-0 outline-none"
                                    value={item.price}
                                    onChange={e => handleItemChange(item.id, 'price', e.target.value)}
                                  />
                                </div>
                              </td>
                              <td className="px-4 py-5 text-right font-display font-extrabold text-sm text-text-primary tracking-tight">
                                {formatCurrency(item.qty * item.price, invoiceData.currency)}
                              </td>
                              <td className="px-8 py-5 text-right">
                                <button 
                                  onClick={() => removeItem(item.id)}
                                  className="w-8 h-8 rounded-2xl flex items-center justify-center text-text-muted/30 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button 
                      onClick={addItem}
                      className="w-full py-5 border-t border-border-light/50 bg-white/30 text-[11px] font-display font-bold text-primary hover:text-primary-dark hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group"
                    >
                      <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                      Add Position
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                   <div className="bg-white border border-black/[0.08] rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] space-y-8">
                      <h3 className="text-[10px] font-display font-bold text-text-muted uppercase tracking-[0.2em] border-b border-border-light pb-4">Summary</h3>
                      
                      <div className="space-y-6">
                         <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-text-secondary">Subtotal</span>
                            <span className="text-sm font-display font-bold text-text-primary">{formatCurrency(totals.subtotal, invoiceData.currency)}</span>
                         </div>
                         
                         <div className="space-y-3">
                            <div className="flex justify-between items-center">
                               <span className="text-xs font-medium text-text-secondary">Tax Rate</span>
                               <div className="flex items-center gap-2 bg-bg-tint/50 border border-primary/10 rounded-2xl px-3 py-1.5">
                                 <input 
                                   type="number"
                                   className="w-10 bg-transparent border-none p-0 text-right text-xs font-display font-bold focus:ring-0 outline-none"
                                   value={invoiceData.globalTax}
                                   onChange={e => handleInputChange('globalTax', e.target.value)}
                                 />
                                 <span className="text-[10px] font-bold text-primary/40">%</span>
                               </div>
                            </div>
                         </div>

                         <div className="space-y-3">
                            <div className="flex justify-between items-center">
                               <span className="text-xs font-medium text-text-secondary">Discount</span>
                               <div className="flex items-center gap-2 bg-bg-tint/50 border border-primary/10 rounded-2xl px-3 py-1.5 focus-within:border-primary/30 transition-all">
                                 <span className="text-[10px] font-bold text-primary/40">{invoiceData.currency}</span>
                                 <input 
                                   type="number"
                                   className="w-16 bg-transparent border-none p-0 text-right text-xs font-display font-bold focus:ring-0 outline-none"
                                   value={invoiceData.discount}
                                   onChange={e => handleInputChange('discount', e.target.value)}
                                 />
                               </div>
                            </div>
                         </div>

                         <div className="pt-8 border-t border-border-light">
                            <div className="flex flex-col gap-2 items-end">
                               <span className="text-[10px] font-display font-bold text-text-muted/40 uppercase tracking-[0.2em]">Grand Total</span>
                               <span className="text-5xl font-display font-extrabold text-primary tracking-tighter drop-shadow-sm">
                                 {formatCurrency(totals.total, invoiceData.currency)}
                               </span>
                            </div>
                         </div>
                      </div>

                      <button 
                        onClick={handleDownload}
                        className="w-full bg-text-primary text-white py-5 rounded-2xl font-display font-extrabold text-sm tracking-tight hover:shadow-2xl hover:translate-y-[-4px] active:scale-[0.98] transition-all duration-500 overflow-hidden relative group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <span className="relative flex items-center justify-center gap-3">
                          <Download className="w-5 h-5" />
                          Generate HD PDF
                        </span>
                      </button>
                   </div>

                   <div className="bg-bg-tint/[0.02] border border-black/[0.08] rounded-2xl p-8 space-y-5">
                      <div className="flex items-center gap-2 text-primary">
                        <FileText className="w-4 h-4" />
                        <h3 className="text-[10px] font-display font-bold uppercase tracking-[0.2em]">Notes & Terms</h3>
                      </div>
                       <textarea 
                        className="w-full bg-white/40 border border-white/50 rounded-2xl p-5 text-sm h-36 outline-none focus:bg-white focus:border-primary focus:ring-[6px] focus:ring-primary/5 transition-all duration-300 resize-none font-medium text-text-secondary placeholder:text-text-muted/20 shadow-sm"
                        placeholder="Additional details, payment terms, or thank you note..."
                        value={invoiceData.notes}
                        onChange={e => handleInputChange('notes', e.target.value)}
                      />
                   </div>

                   <div className="bg-white border border-black/[0.08] rounded-2xl p-8 space-y-6 shadow-[0_8px_32px_rgba(0,0,0,0.03)]">
                      <div className="flex items-center gap-2 text-primary">
                        <Palette className="w-4 h-4" />
                        <h3 className="text-[10px] font-display font-bold uppercase tracking-[0.2em]">Signature Branding</h3>
                      </div>
                      
                      <div className="space-y-6">
                         <div className="space-y-3 pt-6 border-t border-border-light/50">
                            <label className="text-[9px] font-display font-bold text-text-muted uppercase tracking-wider">Digital Signature</label>
                            <div className="relative group/sig">
                               {invoiceData.branding.signature ? (
                                 <div className="relative aspect-[3/1] bg-bg-section/30 rounded-2xl overflow-hidden border border-border-light flex items-center justify-center p-4">
                                    <img 
                                      src={invoiceData.branding.signature} 
                                      alt="Signature" 
                                      className="max-w-full max-h-full transition-all mix-blend-multiply"
                                      style={{ 
                                        transform: `scale(${invoiceData.branding.signatureScale})`
                                      }}
                                    />
                                    <button 
                                      onClick={() => handleBrandingChange('signature', null)}
                                      className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-center text-red-500 shadow-sm opacity-0 group-hover/sig:opacity-100 transition-all"
                                    >
                                       <Trash2 className="w-4 h-4" />
                                    </button>
                                 </div>
                               ) : (
                                 <label className="flex flex-col items-center justify-center aspect-[3/1] bg-bg-section/30 border-2 border-dashed border-border-light rounded-2xl cursor-pointer hover:bg-bg-tint hover:border-primary/30 transition-all group/upload-sig">
                                    <Upload className="w-5 h-5 text-text-muted group-hover/upload-sig:text-primary transition-colors" />
                                    <span className="text-[10px] font-display font-bold text-text-muted mt-2">Upload Signature PNG</span>
                                    <input 
                                      type="file" 
                                      className="hidden" 
                                      accept="image/*"
                                      onChange={e => {
                                        const file = e.target.files[0];
                                        if (file) {
                                          const reader = new FileReader();
                                          reader.onload = (ev) => handleBrandingChange('signature', ev.target.result);
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                    />
                                 </label>
                               )}
                            </div>
                            
                            {invoiceData.branding.signature && (
                               <div className="space-y-3 pt-2">
                                  <div className="flex justify-between">
                                    <label className="text-[9px] font-display font-bold text-text-muted uppercase tracking-wider">Signature Size</label>
                                    <span className="text-[10px] font-bold text-primary">{Math.round(invoiceData.branding.signatureScale * 100)}%</span>
                                  </div>
                                  <input 
                                    type="range" min="0.5" max="2" step="0.1"
                                    value={invoiceData.branding.signatureScale}
                                    onChange={e => handleBrandingChange('signatureScale', parseFloat(e.target.value))}
                                    className="w-full accent-primary h-1 bg-bg-section rounded-full appearance-none cursor-pointer"
                                  />
                               </div>
                            )}
                         </div>
                       </div>
                    </div>
                 </div>
              </div>
           </motion.div>
         )}

                                       {view === 'privacy' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto px-6 py-32 space-y-20 text-left"
            >
               <div className="space-y-6">
                  <span className="text-primary font-bold text-[10px] uppercase tracking-[0.4em]">Compliance & Safety</span>
                  <h1 className="text-5xl md:text-7xl font-display font-black text-text-primary tracking-tighter leading-tight">Privacy <span className="text-primary italic">Mandate.</span></h1>
                  <p className="text-text-muted text-xl font-medium leading-relaxed italic">Your data security is our industrial priority. Handled with absolute local sovereignty. Last Updated: March 2026.</p>
               </div>

               <div className="space-y-16 font-display">
                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">01. Introduction</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">InvoiceFlow (the "Service") is a specialized professional utility provided "as-is" to assist in generating high-fidelity business documentation. This Privacy Policy outlines our commitment to transparency and our "Zero-Transmission" data architecture, ensuring your financial intelligence remains private.<br/>By accessing this platform, you acknowledge that our mission is to provide technical tools that prioritize your data sovereignty over traditional cloud-based storage models.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">02. Information We Collect</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">As a client-side utility, we do not require user registration or long-term profile maintenance. We process:<br/>
                        <ul className="mt-4 space-y-2 list-disc pl-5 opacity-80">
                           <li>Active Input Data: Business names, addresses, and line items you provide manually through our reactive interface.</li>
                           <li>Local Branding Assets: High-resolution logos or signatures uploaded specifically for industrial-grade invoice generation.</li>
                           <li>Static Technical Markers: Basic browser metadata such as viewport dimensions and language settings for optimal UI rendering.</li>
                        </ul>
                     </p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">03. How We Collect Information</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">All data collection is active and user-initiated, occurring exclusively through foreground interactions within the browser. Information is gathered through real-time input fields in the editor and professional file upload handlers used for branding assets.<br/>We do not utilize background web beacons, hidden surveillance technologies, or third-party tracking scripts to monitor your private business activities.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">04. Use of Information</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">Data is utilized exclusively for generating your high-fidelity PDF export within the local browser environment. Once the PDF is rendered, the data remains in your volatile browser memory for the duration of the active session only.<br/>We do not harvest this information for secondary analytics, commercial marketing, or research purposes by the InvoiceFlow core team or its affiliates.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">05. Cookies and Tracking Technologies</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">We utilize only strictly functional session markers (`localStorage`) to ensure your professional work isn't lost during an accidental page refresh. These markers are stored physically on your hardware and are never transmitted to external analytics servers.<br/>Please refer to our Cookie Protocol for a deep industrial breakdown of how these persistent markers operate within your local workflow.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">06. Third-Party Services</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">InvoiceFlow utilizes standard global CDN delivery (Content Delivery Networks) to serve core assets and static styling files at the highest possible speed. Our PDF rendering engine is fully integrated into the client-side bundle and does not call external APIs for document conversion.<br/>This ensures that your business intelligence remains within the boundaries of your local machine at all times during the document build.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">07. Data Sharing and Disclosure</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">We do not share, sell, or disclose your business data to any third-party entities, advertising networks, or data brokers. Because we do not store your information on our servers, there is no central database for us to provide to government agencies.<br/>Your data remains strictly your property, protected by the physical and digital security protocols of your own professional environment.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">08. Data Security</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">Your data security is limited by the security of your own hardware and the specific browser environment you choose for document generation. We recommend using modern, updated browsers and device-level encryption for maximum safety.<br/>Our Service is delivered over encrypted HTTPS (TLS 1.3) to prevent "man-in-the-middle" interceptions of our core application code during the initial load.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">09. User Rights</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">You have the absolute right to clear your data at any time by emptying your browser cache or deleting "Site Data" for this specific domain. You maintain 100% sovereignty over all documents.<br/>As we do not maintain accounts, your "Right to be Forgotten" is satisfied immediately upon the clearing of your local browser storage markers.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">10. Children’s Information</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">The Service is designed specifically for professional business use and commercial documentation. We do not knowingly collect or request information from children under the age of 18 (or the legal threshold).<br/>If you believe a minor has utilized this tool to input PII, please clear the device's browser cache to purge the data from local memory instantly.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">11. Changes to This Policy</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">We reserve the right to update this mandate to reflect changes in industrial technology or global regulatory standards. Major changes will be flagged via a versioning marker in the page header.<br/>Continued usage of the Service following these updates indicates your acknowledgement of the revised industrial privacy protocols.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">12. Contact Us</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">For inquiries regarding this Privacy Mandate or our technical data handling, please reach out to our industrial compliance team through our official digital portals.<br/>We are committed to responding to professional queries regarding data sovereignty and technical transparency within a reasonable business timeframe.</p>
                  </section>
               </div>

               <div className="pt-10 border-t border-black/[0.05]">
                  <button onClick={() => setView('landing')} className="flex items-center gap-4 text-primary font-bold text-lg group">
                    <RotateCcw className="w-5 h-5 transition-transform group-hover:rotate-[-90deg]" />
                    Return to Control Center
                  </button>
               </div>
            </motion.div>
          )}

          {view === 'terms' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto px-6 py-32 space-y-20 text-left"
            >
               <div className="space-y-6">
                  <span className="text-primary font-bold text-[10px] uppercase tracking-[0.4em]">Service Protocol</span>
                  <h1 className="text-5xl md:text-7xl font-display font-black text-text-primary tracking-tighter leading-tight">Terms of <span className="text-primary italic">Operation.</span></h1>
                  <p className="text-text-muted text-xl font-medium leading-relaxed italic">The framework for industrial-grade utility usage and professional conduct. Last Updated: March 2026.</p>
               </div>

               <div className="space-y-16 font-display">
                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">01. Introduction</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">These Terms of Operation govern your access to the InvoiceFlow platform and all associated document generation utilities. By accessing the Service, you agree to adhere to these guidelines for professional excellence.<br/>These terms constitute a binding agreement between you, the expert user, and the InvoiceFlow infrastructure team regarding the usage of our technical assets.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">02. Acceptance of Terms</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">Your use of this site signifies your unconditional acceptance of these terms and all associated privacy mandates. If you do not agree to these protocols, you must cease all usage of the platform immediately.<br/>We reserve the right to modify these terms at any time to reflect the evolving landscape of digital business tools and commercial reporting requirements.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">03. Use of Services</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">InvoiceFlow provides a free-to-use professional utility for the generation of high-fidelity commercial documents. We grant you a limited, revocable license to utilize our templates for your billing and reporting.<br/>You may use the generated exports for any legal commercial purpose, but you may not re-sell the underlying software architecture or branding elements as your own product.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">04. User Responsibilities</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">You are solely responsible for the accuracy of all data (including tax rates, totals, and business names) and for ensuring your documentation complies with local jurisdictions.<br/>It is your responsibility to verify the mathematical accuracy of each export before transmission to clients. We provide the technical canvas, but you provide the commercial intent and validity.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">05. Prohibited Activities</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">Users may not attempt to reverse engineer the industrial engine, bypass local-only storage safeguards, or use the service for fraudulent billing practices or illegal financial spoofing.<br/>Automated scraping of our template library or high-frequency automated calls to our CDN assets are strictly prohibited to ensure service stability for the entire professional network.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">06. Intellectual Property Rights</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">The InvoiceFlow brand, specialized codebase, and curated interface layout are protected industrial assets of the development team. However, you retain full ownership of all PDFs generated through the utility.<br/>You are free to apply your own branding and trade markers to the generated documents, provided you do not misrepresent the technical origin of the software itself.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">07. Account Terms</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">We do not provide user accounts or cloud storage solutions. Your "session" is maintained locally via your browser's persistence engine. You are responsible for ensuring your browser session is secure.<br/>We are not liable for the loss of unsaved invoice data resulting from the clearing of browser caches, hardware failure, or unauthorized access to your local machine by third parties.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">08. Service Availability</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">We aim for 99.9% uptime for our core assets served via global CDNs. However, we assume no liability for service interruptions, latency spikes, or data loss resulting from network outages or cache failures.<br/>We reserve the right to push technical updates or undergo maintenance cycles that may temporarily affect access to certain high-end features or specific template designs.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">09. Limitation of Liability</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">InvoiceFlow and its developers shall not be liable for any indirect or consequential damages, including tax penalties or business data loss, resulting from the use of this technical utility.<br/>The Service is provided without warranties of any kind, whether express or implied. Your use of the generated documents in a legal or tax capacity is entirely at your own professional risk.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">10. Termination</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">We reserve the right to terminate access to the Service or specific templates for any user found violating these industrial protocols, without the requirement for prior notification.<br/>Termination of access does not affect the legality or ownership of any previously generated PDFs currently stored on your local device or and shared with your intended clients.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">11. Governing Law</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">These protocols are governed by the industrial standards of the digital service landscape, with legal precedence determined by the jurisdiction of our core operational headquarters.<br/>Any disputes arising from the usage of this software will be handled through professional mediation before escalation to formal legal proceedings, according to standard industry practices.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">12. Changes to Terms</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">Terms may be updated to reflect technological or regulatory progress in the invoicing space. Continued usage of the Service indicates your acceptance of the evolved framework for professional utility use.<br/>We recommend reviewing these terms periodically to ensure your commercial interactions remain compliant with our current industrial-grade operational standards and service guidelines.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">13. Contact Information</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">For legal inquiries, industrial collaboration, or compliance reports, please use our primary digital contact portal or official communication channels listed in our support documentation.<br/>Our legal team is available for consultation regarding API usage, volume licensing of our templates, or custom enterprise-level integrations of our PDF generation engine.</p>
                  </section>
               </div>

               <div className="pt-10 border-t border-black/[0.05]">
                  <button onClick={() => setView('landing')} className="flex items-center gap-4 text-primary font-bold text-lg group">
                    <RotateCcw className="w-5 h-5 transition-transform group-hover:rotate-[-90deg]" />
                    Exit to Navigation
                  </button>
               </div>
            </motion.div>
          )}

          {view === 'cookie' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto px-6 py-32 space-y-20 text-left"
            >
               <div className="space-y-6">
                  <span className="text-primary font-bold text-[10px] uppercase tracking-[0.4em]">Session Integrity</span>
                  <h1 className="text-5xl md:text-7xl font-display font-black text-text-primary tracking-tighter leading-tight">Cookie <span className="text-primary italic">Policy.</span></h1>
                  <p className="text-text-muted text-xl font-medium leading-relaxed italic">Detailed markers for the elite workflow and session persistence. Last Updated: March 2026.</p>
               </div>

               <div className="space-y-16 font-display">
                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">01. Introduction</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">This policy provides a technical breakdown of how InvoiceFlow uses browser-level persistence markers to maintain your high-fidelity professional environment during document creation.<br/>By using the Service, you consent to the placement of these functional markers as essential technical requirements for our zero-transmission document generation architecture.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">02. What Are Cookies</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">Cookies and local storage are small data markers stored on your device that enable technical features like session persistence and professional user preferences without requiring a server backend.<br/>These markers allow our "Local-Only" architecture to recognize your active progress and maintain your customization settings across individual browser sessions within the same hardware environment.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">03. Types of Cookies We Use</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">We use "Strictly Necessary" functional markers only. Unlike traditional platforms, we do not employ performance, functional, or targeting/marketing cookies to monitor your business behavior.<br/>Our markers are strictly first-party, meaning they are generated by our application and are not shared with any third-party advertising or analytics networks at any time.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">04. How We Use Cookies</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">Our markers store temporary invoice state data, custom tax configurations, and branding preferences. This ensures your professional work survives a page refresh or unexpected browser restart.<br/>This persistence is critical for high-fidelity document generation, as it prevents data loss in the absence of a centralized cloud database, providing you with a seamless and secure experience.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">05. Third-Party Cookies</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">InvoiceFlow does not allow third-party cookies or scripts to inject tracking markers into your session. All persistent markers are strictly first-party and are handled by our own industrial logic.<br/>We prioritze your privacy over data monetization, ensuring that no external entity can track your usage of our invoice generator or gain insights into your commercial volume or activity.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">06. Managing Cookies</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">You have the absolute right to clear all markers at any time through your browser's "Clear Browsing Data" settings or "Site Data" management panel. This gives you total control.<br/>Please note that purging these markers will result in the immediate and irreversible loss of any unsaved invoice data, as we do not maintain server-side backups of your active sessions.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">07. Changes to This Policy</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">We may update this technical policy to reflect new browser standards, optimizations in our persistence engine, or changes in international data protection regulations.<br/>We encourage professional users to review this protocol occasionally to stay informed about how we utilize local storage to safeguard their industrial document creation workflow and privacy.</p>
                  </section>

                  <section className="space-y-6 border-t border-black/[0.05] pt-12">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">08. Contact Us</h3>
                     <p className="text-text-muted text-sm leading-relaxed font-medium">For technical inquiries regarding session persistence, local storage security, or our Cookie Protocol, please contact our architecture team via the official professional portal.<br/>Our technical staff is dedicated to explaining our session management logic and helping you maintain a secure and efficient high-fidelity invoicing environment across your corporate hardware.</p>
                  </section>
               </div>

               <div className="pt-10 border-t border-black/[0.05]">
                  <button onClick={() => setView('landing')} className="flex items-center gap-4 text-primary font-bold text-lg group">
                    <RotateCcw className="w-5 h-5 transition-transform group-hover:rotate-[-90deg]" />
                    Return to Terminal
                  </button>
               </div>
            </motion.div>
          )} 
          </AnimatePresence>
      </main>

      <AnimatePresence>
        {showPreview && (
          <PreviewModal 
            isOpen={showPreview} 
            onClose={() => setShowPreview(false)} 
            data={invoiceData}
            totals={totals}
            type={selectedType}
          />
        )}
      </AnimatePresence>

      <footer className="relative border-t border-black/[0.05] py-16 px-10 bg-white shadow-sm overflow-hidden">
        {/* Atmospheric Backdrops */}
        <div className="absolute inset-0 pointer-events-none select-none">
           <div className="absolute inset-0 opacity-40">
              {/* Primary Soft Blobs (Compressed Scale) */}
              <motion.div 
                animate={{ scale: [1, 1.1, 1], x: [0, 30, 0], y: [0, 20, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-12 -left-12 w-64 h-64 bg-primary/30 rounded-full blur-[120px]"
              />
              <motion.div 
                animate={{ scale: [1.1, 1, 1.1], x: [0, -20, 0], y: [0, -10, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-12 -right-12 w-48 h-48 bg-black/10 rounded-full blur-[100px]"
              />
              
              {/* Kinetic Micro-Dots (10 elements) */}
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={`dot-${i}`}
                  animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.2, 1] }}
                  transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-1 h-1 bg-primary/40 rounded-full"
                  style={{ left: `${10 + i * 9}%`, top: `${15 + (i % 4) * 20}%` }}
                />
              ))}

              {/* Kinetic Micro-Pluses (10 elements) */}
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={`plus-${i}`}
                  animate={{ rotate: 360, x: [0, i % 2 === 0 ? 20 : -20, 0] }}
                  transition={{ duration: 15 + i * 2, repeat: Infinity, ease: "linear" }}
                  className="absolute"
                  style={{ left: `${5 + i * 9}%`, top: `${30 + (i % 3) * 25}%` }}
                >
                   <Plus className="w-2.5 h-2.5 text-black/20" strokeWidth={1} />
                </motion.div>
              ))}

              {/* Micro-Dashes (5 elements) */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`dash-${i}`}
                  animate={{ y: [0, 40, 0], opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 10 + i * 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-px h-6 bg-black/10"
                  style={{ left: `${25 + i * 15}%`, top: `${i * 15}%` }}
                />
              ))}

              {/* Abstract Geometric Vectors (Compressed Scale) */}
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/4 left-1/4 w-20 h-20 border border-black/20 rounded-full" 
              />
              <motion.div 
                animate={{ rotate: -360, y: [0, 10, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-1/4 right-1/3 w-32 h-32 border border-black/10 rounded-2xl" 
              />
              <div className="absolute top-1/2 left-1/2 w-48 h-px bg-gradient-to-r from-transparent via-black/[0.05] to-transparent rotate-45" />
           </div>
        </div>

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-12">
               <div className="space-y-4 md:col-span-1">
                  <div className="flex items-center gap-3 group cursor-default">
                     <div className="w-10 h-10 bg-text-primary rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                        <FileText className="w-5 h-5 text-white" strokeWidth={2.5} />
                     </div>
                     <span className="font-display font-bold text-lg text-text-primary tracking-tight">InvoiceFlow</span>
                  </div>
                   <p className="text-text-muted text-[10px] leading-relaxed font-bold uppercase tracking-[0.05em] max-w-[240px]">
                      Architecting the future of industrial document precision. High-fidelity invoicing engineered for elite professionals.
                   </p>
               </div>

               <div className="space-y-6">
                  <h4 className="font-display font-bold text-text-primary uppercase text-xs tracking-widest">Navigation</h4>
                  <ul className="space-y-4">
                     {['Home', 'How it Works', 'FAQ', 'Features'].map(item => (
                        <li key={item}>
                           <button 
                              onClick={() => { setView('landing'); setTimeout(() => document.getElementById(item.toLowerCase().replace(/\s+/g, '-'))?.scrollIntoView({ behavior: 'smooth' }), 100); }}
                              className="text-text-muted hover:text-primary transition-colors text-[11px] font-bold uppercase tracking-[0.1em]"
                            >
                               {item}
                            </button>
                        </li>
                     ))}
                  </ul>
               </div>

               <div className="space-y-6">
                  <h4 className="font-display font-bold text-text-primary uppercase text-xs tracking-widest">Invoices</h4>
                  <ul className="space-y-4">
                     {INVOICE_TYPES.slice(0, 5).map(type => (
                        <li key={type.id}>
                           <button 
                              onClick={() => { setSelectedType(type); setView('editor'); window.scrollTo(0,0); }}
                              className="text-text-muted hover:text-primary transition-colors text-[11px] font-bold uppercase tracking-[0.1em]"
                            >
                               {type.code} · {type.name.split(' ')[0]}
                            </button>
                        </li>
                     ))}
                  </ul>
               </div>

               <div className="space-y-6">
                  <h4 className="font-display font-bold text-text-primary uppercase text-xs tracking-widest">Legal</h4>
                  <ul className="space-y-4">
                      <li><button onClick={() => setView('privacy')} className="text-text-muted hover:text-primary transition-colors text-[11px] font-bold uppercase tracking-[0.1em]">Privacy Policy</button></li>
                      <li><button onClick={() => setView('terms')} className="text-text-muted hover:text-primary transition-colors text-[11px] font-bold uppercase tracking-[0.1em]">Terms of Service</button></li>
                      <li><button onClick={() => setView('cookie')} className="text-text-muted hover:text-primary transition-colors text-[11px] font-bold uppercase tracking-[0.1em]">Cookie Policy</button></li>
                   </ul>
               </div>

               <div className="space-y-6">
                  <h4 className="font-display font-bold text-text-primary uppercase text-xs tracking-widest">Connect</h4>
                  <div className="flex flex-wrap gap-4">
                     {[
                        { name: 'Vercel', url: 'https://www.vercel.com/xraman71', icon: <svg width="18" height="18" viewBox="0 0 76 65" fill="currentColor"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z"/></svg> },
                        { name: 'Product Hunt', url: 'https://www.producthunt.com/@amanxr71', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13.56 8.32H10.56V11.32H13.56C14.39 11.32 15.06 10.65 15.06 9.82C15.06 8.99 14.39 8.32 13.56 8.32ZM13.56 12.82H10.56V16.32H9.06V6.82H13.56C15.22 6.82 16.56 8.16 16.56 9.82C16.56 11.48 15.22 12.82 13.56 12.82ZM12 0C5.38 0 0 5.38 0 12C0 18.62 5.38 24 12 24C18.62 24 24 18.62 24 12C24 5.38 18.62 0 12 0Z"/></svg> },
                        { name: 'X', url: 'https://www.x.com/xrverse71', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                        { name: 'Gumroad', url: 'https://amanxr.gumroad.com', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 18.75c-3.728 0-6.75-3.022-6.75-6.75s3.022-6.75 6.75-6.75 6.75 3.022 6.75 6.75-3.022 6.75-6.75 6.75zm1.5-6.75h-3v3H9v-6h4.5c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5z"/></svg> }
                     ].map(social => (
                        <a 
                           key={social.name}
                           href={social.url}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="w-10 h-10 bg-bg-tint rounded-xl flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary/10 transition-all hover:scale-110 active:scale-95"
                           title={social.name}
                        >
                           {social.icon}
                        </a>
                     ))}
                  </div>
               </div>
            </div>

           <div className="pt-12 border-t border-border-light/50 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-[10px] font-display text-text-muted/40 uppercase tracking-[0.2em]">© 2026 PRO INVOICE SUITE · PREMIUM EDITION · ALL RIGHTS RESERVED</p>
              <div className="flex items-center gap-8">
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-display font-bold text-text-muted/60 uppercase">System Status: Optimal</span>
                 </div>
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
}

// --- Helper Components ---
// --- Sub-components (Internal) ---

function LandingPage({ onStart }) {
  const [activeFaq, setActiveFaq] = useState(null);
  const faqItems = [
    { q: "Is InvoiceFlow truly free?", a: "Yes, our core pro-grade features are 100% free with no hidden charges or subscription gates." },
    { q: "Does InvoiceFlow store my data?", a: "Zero data is stored on our servers. All information remains on your local device for total privacy." },
    { q: "Are the exported PDFs high-quality?", a: "We use an industrial-grade vector engine to ensure HD clarity and perfect alignment at any scale." },
    { q: "Can I customize my branding?", a: "Yes, you can upload a high-resolution Digital Signature and customize its scale and positioning for each document." },
    { q: "How many templates are available?", a: "We provide a library of 50+ professionally designed, industry-specific templates that you can swap in one click." },
    { q: "Are these templates tax-compliant?", a: "Our specialized templates follow standard international billing and VAT/GST protocols for over 80 markets." },
    { q: "Is my private data secure?", a: "Since we never transmit your data—even your branding assets—to any server, it is as secure as your own hardware." },
    { q: "Does it work on tablet/mobile?", a: "Yes, our interface is fully reactive and optimized for on-the-go professional billing and invoice management." },
  ];

  return (
    <div className="space-y-32 pb-24 text-center">
      {/* Hero Section */}
      <section id="hero" className="relative pt-32 pb-24 space-y-12 animate-fade-up">
        <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-primary/[0.03] border border-black/[0.06] rounded-2xl text-[10px] font-bold text-primary tracking-widest uppercase mx-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Professional Suite 2.0 · Live
        </div>
        <h1 className="text-5xl md:text-8xl font-display font-black text-text-primary tracking-tighter leading-[0.9] max-w-5xl mx-auto">
          The Global Standard in <br/><span className="text-primary italic">Precision</span> Invoicing.
        </h1>
        <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto font-medium leading-relaxed">
          Experience industrial-grade PDF precision wrapped in a curated minimalist interface. Built for elite teams that demand excellence.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
          <button 
            onClick={onStart}
            className="w-full sm:w-auto px-12 py-5 bg-text-primary text-white rounded-2xl font-display font-black text-sm tracking-tight hover:bg-primary shadow-2xl hover:translate-y-[-4px] transition-all duration-500 border border-black/10"
          >
            Create Your First Invoice
          </button>
          <button 
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-12 py-5 bg-white border border-black/[0.1] rounded-2xl font-display font-bold text-sm tracking-normal hover:bg-bg-section transition-all"
          >
            Explore Workflow
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="space-y-20 max-w-7xl mx-auto px-6">
        <div className="space-y-6">
          <span className="text-primary font-bold text-[10px] uppercase tracking-[0.3em]">Core Architecture</span>
          <h2 className="text-4xl md:text-6xl font-display font-black text-text-primary tracking-tighter">Engineered for Impact.</h2>
          <p className="text-text-muted max-w-2xl mx-auto text-lg font-medium leading-relaxed">Global business tools, refined for the modern elite professional with zero-latency rendering.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[280px]">
          <div className="md:col-span-8 bg-white border border-black/[0.08] rounded-2xl p-10 flex flex-col justify-end text-left group hover:border-primary/20 transition-all duration-500 shadow-sm relative overflow-hidden">
             <div className="absolute top-10 right-10 w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
               <FileText className="w-8 h-8 text-primary" />
             </div>
             <div className="space-y-4">
                <h3 className="text-3xl font-display font-black text-text-primary">HD Vector Architecture</h3>
                <p className="text-text-muted max-w-md text-sm font-medium leading-relaxed">Our proprietary engine generates industrial-grade PDFs that remain crystal clear at any magnification level, ensuring 100% legal compliance and readability.</p>
             </div>
          </div>
          <div className="md:col-span-4 bg-bg-section border border-black/[0.08] rounded-2xl p-10 flex flex-col justify-between text-left hover:border-primary/20 transition-all duration-500 shadow-sm group">
             <div className="w-14 h-14 bg-white border border-black/[0.04] rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
               <RotateCcw className="w-6 h-6 text-primary group-hover:text-white" />
             </div>
             <div className="space-y-3">
                <h3 className="text-xl font-display font-bold text-text-primary">Privacy Lockdown</h3>
                <p className="text-text-muted text-xs font-medium leading-relaxed">Zero-server processing architecture. Your financial data is computed locally, stored locally, and never transmitted beyond your hardware.</p>
             </div>
          </div>
          <div className="md:col-span-5 bg-primary/[0.02] border border-black/[0.08] rounded-2xl p-10 flex flex-col justify-center text-left hover:border-primary/20 transition-all duration-500 shadow-sm relative overflow-hidden">
             <div className="space-y-6">
                <div className="flex gap-2">
                  {[1,2,3,4,5,6].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-primary/20" />)}
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-display font-bold text-text-primary">Signature Branding</h3>
                  <p className="text-text-muted text-xs font-medium leading-relaxed">Upload and scale your digital signature with precision. Our engine ensures high-fidelity rendering for legal-grade professional documents.</p>
                </div>
             </div>
          </div>
          <div className="md:col-span-7 bg-white border border-black/[0.08] rounded-2xl p-10 flex flex-col justify-center text-left group hover:border-primary/20 transition-all duration-500 shadow-sm relative overflow-hidden">
             <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-bg-section rounded-2xl flex items-center justify-center text-text-primary group-hover:bg-primary group-hover:text-white transition-all duration-700">
                   <LayoutGrid className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-display font-bold text-text-primary">50+ Industry Templates</h3>
                    <p className="text-text-muted text-sm font-medium leading-relaxed">Access a massive library of specialized designs for Freelance, Medical, Agency, and more. One click to load, zero setup required.</p>
                 </div>
             </div>
          </div>
        </div>
      </section>

      {/* For Whom / Why Us Section */}
      <section id="why-us" className="space-y-24 max-w-7xl mx-auto px-6 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div className="text-left space-y-12 order-2 lg:order-1">
              <div className="space-y-6">
                <span className="text-primary font-bold text-[10px] uppercase tracking-[0.3em]">Precision Target</span>
                <h2 className="text-4xl md:text-7xl font-display font-black text-text-primary tracking-tighter leading-[0.95]">
                  For Those Who Build <span className="text-primary">Legacies.</span>
                </h2>
                <p className="text-text-muted text-xl font-medium leading-relaxed max-w-xl">
                  InvoiceFlow is a specialized utility for the top 1% of creators, solo experts, and high-impact design-led agencies.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                 {[
                   { t: 'Freelance Experts', d: 'Solo professionals who need quick, elite exports without the database overhead.' },
                   { t: 'Creative Studios', d: 'Agencies that demand aesthetic perfection in every commercial touchpoint.' },
                   { t: 'Global Scale', d: 'International-ready templates for borderless trade and cross-jurisdictional tax compliance.' },
                   { t: 'Strategic Firms', d: 'High-impact professional structures for corporate-level billing and reporting.' }
                 ].map(item => (
                   <div key={item.t} className="space-y-3 border-l-2 border-primary/10 pl-6 hover:border-primary transition-colors group">
                      <h4 className="font-display font-bold text-text-primary group-hover:text-primary transition-colors">{item.t}</h4>
                      <p className="text-text-muted text-[13px] font-medium leading-relaxed">{item.d}</p>
                   </div>
                 ))}
              </div>
           </div>
           <div className="relative order-1 lg:order-2">
              <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full animate-pulse" />
              <div className="relative bg-white border border-black/[0.08] rounded-3xl p-1 shadow-2xl overflow-hidden">
                 <div className="aspect-[4/3] bg-bg-section flex items-center justify-center overflow-hidden group">
                    <img 
                       src="/precision-target.png" 
                       alt="Elite Invoicing Precision" 
                       className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-16 text-left border-t border-black/[0.04]">
           {[
             { t: 'Industrial Vectorizing', d: 'Our export engine uses vector-perfect math for crystal clarity at any zoom level.', icon: FileText },
             { t: 'Zero-Latency Logic', d: 'Proprietary instant-render architecture means zero lag during complex data entry.', icon: Plus },
             { t: 'Privacy Mandate', d: 'We never see your data. Everything is computed in local browser memory using WASM.', icon: RotateCcw }
           ].map(item => (
             <div key={item.t} className="space-y-5 p-10 border border-black/[0.03] rounded-3xl hover:bg-white hover:shadow-2xl transition-all group">
                <div className="w-12 h-12 bg-primary/[0.03] text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6">
                   <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-xl text-text-primary">{item.t}</h3>
                <p className="text-text-muted text-sm leading-relaxed font-medium">{item.d}</p>
             </div>
           ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="space-y-20 max-w-7xl mx-auto px-6">
        <div className="space-y-6">
          <span className="text-primary font-bold text-[10px] uppercase tracking-[0.3em]">Process & Precision</span>
          <h2 className="text-4xl md:text-6xl font-display font-black text-text-primary tracking-tighter">Workflow Optimized.</h2>
          <p className="text-text-muted max-w-2xl mx-auto text-lg font-medium leading-relaxed">Three distinct phases between you and an industrial-grade professional export.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
           {[
             { step: '01', t: 'Select Strategy', d: 'Choose from 8 pre-built commercial templates, each tuned for specific business protocols.' },
             { step: '02', t: 'Input Context', d: 'Fill your business and client details into our reactive interface with real-time math validation.' },
             { step: '03', t: 'Vector Export', d: 'Generate your high-fidelity HD PDF locally. Zero waiting, zero data leaves your hardware.' }
           ].map((item, idx) => (
             <div key={idx} className="group relative bg-white border border-black/[0.08] p-10 rounded-3xl transition-all duration-500 hover:shadow-2xl hover:translate-y-[-8px]">
                <div className="absolute top-0 right-0 p-8 text-7xl font-display font-black text-primary/[0.03] group-hover:text-primary/[0.08] transition-colors">{item.step}</div>
                <div className="space-y-6 relative z-10">
                   <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-display font-bold shadow-lg shadow-primary/20">
                      {idx + 1}
                   </div>
                   <div className="space-y-3">
                      <h3 className="text-2xl font-display font-black text-text-primary tracking-tight">{item.t}</h3>
                      <p className="text-text-muted text-sm leading-relaxed font-medium">{item.d}</p>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="space-y-20 max-w-5xl mx-auto px-6">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-6xl font-display font-black text-text-primary tracking-tighter">Knowledge Base.</h2>
          <p className="text-text-muted text-lg font-medium">Quick answers to common professional queries.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {faqItems.map((item, i) => (
            <div 
              key={i} 
              className={`group bg-white border border-black/[0.08] hover:border-black/[0.15] rounded-[1.25rem] p-6 transition-all duration-300 hover:shadow-xl cursor-pointer ${activeFaq === i ? 'ring-2 ring-primary/20 border-primary/20 bg-primary/[0.01]' : ''}`}
              onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              onMouseEnter={() => setActiveFaq(i)}
              onMouseLeave={() => setActiveFaq(null)}
            >
               <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base font-display font-bold text-text-primary flex items-center gap-4">
                    <span className="w-8 h-8 rounded-xl bg-bg-section flex items-center justify-center text-[10px] font-bold text-text-muted transition-all group-hover:bg-primary group-hover:text-white group-hover:rotate-12">{String(i + 1).padStart(2, '0')}</span>
                    {item.q}
                  </h3>
                  <ChevronDown className={`w-4 h-4 text-text-muted/40 transition-transform duration-500 ${activeFaq === i ? 'rotate-180 text-primary' : ''}`} />
               </div>
               
               <AnimatePresence>
                 {activeFaq === i && (
                   <motion.div
                     initial={{ height: 0, opacity: 0, marginTop: 0 }}
                     animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                     exit={{ height: 0, opacity: 0, marginTop: 0 }}
                     className="overflow-hidden"
                   >
                     <p className="text-text-muted text-xs leading-relaxed font-medium pl-12 border-l-2 border-primary/10">{item.a}</p>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* About Section - Redesigned full-width border-only */}
      <section id="about" className="max-w-full mx-auto px-6 pt-10">
        <div className="space-y-12 bg-transparent text-text-primary p-20 md:p-32 rounded-3xl relative overflow-hidden border border-black/[0.1] border-x-0">
           <div className="text-center max-w-4xl mx-auto space-y-10">
              <span className="text-primary font-bold text-[10px] uppercase tracking-[0.4em]">Industrial Mission</span>
              <h2 className="text-5xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] relative z-10">
                Our Mission is <span className="text-primary italic">Absolute Precision.</span>
              </h2>
              <p className="text-text-muted text-xl md:text-2xl font-medium leading-relaxed relative z-10">
                We believe professional tools should be as refined as the services they represent. InvoiceFlow was born from the need for a "zero-noise" professional billing utility that values privacy as much as aesthetic excellence. We eliminate the friction of modern invoicing without sacrificing the high-fidelity results elite teams demand.
              </p>
              <div className="pt-10 relative z-10">
                 <button onClick={onStart} className="px-14 py-6 bg-text-primary text-white rounded-2xl font-display font-black text-sm tracking-tight hover:bg-primary shadow-2xl hover:translate-y-[-4px] transition-all duration-500">
                    Join the Elite Network
                 </button>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="space-y-2 flex-1">
      <label className="text-[10px] font-display font-bold text-text-muted/60 uppercase tracking-[0.15em] ml-1">{label}</label>
      <input 
        type={type} 
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-white/50 border border-border-light/50 rounded-2xl px-5 py-3.5 text-sm font-medium focus:bg-white focus:border-primary focus:ring-[6px] focus:ring-primary/5 outline-none transition-all duration-300 placeholder:text-text-muted/20 shadow-sm"
        placeholder={placeholder}
      />
    </div>
  );
}

function PreviewModal({ isOpen, onClose, data, totals, type }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        className="bg-white w-full max-w-[850px] max-h-[90vh] overflow-y-auto rounded-none shadow-[0_32px_128px_rgba(0,0,0,0.3)] relative scrollbar-hide"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 right-0 z-10 p-6 flex justify-end pointer-events-none">
          <button 
            onClick={onClose}
            className="p-3 rounded-none bg-white/90 backdrop-blur shadow-xl border border-black/5 hover:bg-primary hover:text-white transition-all pointer-events-auto group"
          >
            <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <div className="p-12 md:p-16 space-y-16">
          {/* Header & Logo */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="space-y-6">
               {data.branding.logo && (
                 <div className={cn(
                   "flex",
                   data.branding.logoPos === 'center' ? 'justify-center' : 
                   data.branding.logoPos === 'right' ? 'justify-end' : 'justify-start'
                 )}>
                   <img 
                    src={data.branding.logo} 
                    alt="Logo" 
                    className="max-h-24 object-contain"
                    style={{ 
                      opacity: data.branding.logoOpacity,
                      transform: `scale(${data.branding.logoScale})`
                    }}
                  />
                 </div>
               )}
               <div className="space-y-1">
                 <h1 className="text-3xl font-display font-black text-text-primary tracking-tighter">
                   {data.from.name || 'YOUR BUSINESS NAME'}
                 </h1>
                 <p className="text-xs font-bold text-primary uppercase tracking-widest">{type?.name || 'INVOICE'}</p>
               </div>
            </div>
            <div className="text-right space-y-2">
               <span className="text-[10px] font-display font-black text-text-muted/30 uppercase tracking-[0.2em]">{type?.code} Document</span>
               <h2 className="text-2xl font-display font-extrabold text-text-primary tracking-tight">#{data.number || 'INV-001'}</h2>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-16 pt-8 border-t border-border-light/50">
             <div className="space-y-4">
                <h4 className="text-[10px] font-display font-bold text-text-muted uppercase tracking-widest">From</h4>
                <div className="text-sm space-y-1 text-text-secondary font-medium">
                   <p className="text-text-primary font-bold">{data.from.name}</p>
                   {data.from.address && <p className="opacity-70 whitespace-pre-line">{data.from.address}</p>}
                   {data.from.email && <p className="opacity-70">{data.from.email}</p>}
                   {data.from.phone && <p className="opacity-70">{data.from.phone}</p>}
                </div>
             </div>
             <div className="space-y-4">
                <h4 className="text-[10px] font-display font-bold text-text-muted uppercase tracking-widest">Bill To</h4>
                <div className="text-sm space-y-1 text-text-secondary font-medium">
                   <p className="text-text-primary font-bold">{data.to.name || 'Client Name'}</p>
                   {data.to.address && <p className="opacity-70 whitespace-pre-line">{data.to.address}</p>}
                   {data.to.email && <p className="opacity-70">{data.to.email}</p>}
                </div>
             </div>
          </div>

          {/* Dates Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-border-light/50 bg-bg-section/30 px-8 rounded-3xl">
             <div className="space-y-1">
                <span className="text-[9px] font-display font-bold text-text-muted uppercase tracking-wider">Date of Issue</span>
                <p className="text-xs font-bold text-text-primary">{data.date}</p>
             </div>
             <div className="space-y-1">
                <span className="text-[9px] font-display font-bold text-text-muted uppercase tracking-wider">Due Date</span>
                <p className="text-xs font-bold text-text-primary">{data.dueDate || '-'}</p>
             </div>
             <div className="space-y-1">
                <span className="text-[9px] font-display font-bold text-text-muted uppercase tracking-wider">Currency</span>
                <p className="text-xs font-bold text-text-primary">{data.currency}</p>
             </div>
             <div className="space-y-1 items-end text-right">
                <span className="text-[9px] font-display font-bold text-text-muted uppercase tracking-wider">Balance Due</span>
                <p className="text-sm font-display font-black text-primary">{formatCurrency(totals.total, data.currency)}</p>
             </div>
          </div>

          {/* Table */}
          <div className="space-y-6">
             <table className="w-full border-collapse">
                <thead>
                   <tr className="border-b-2 border-text-primary">
                      <th className="py-4 text-left text-[10px] font-display font-bold uppercase tracking-widest text-text-muted">Description</th>
                      <th className="py-4 text-right text-[10px] font-display font-bold uppercase tracking-widest text-text-muted w-24">Qty</th>
                      <th className="py-4 text-right text-[10px] font-display font-bold uppercase tracking-widest text-text-muted w-32">Price</th>
                      <th className="py-4 text-right text-[10px] font-display font-bold uppercase tracking-widest text-text-muted w-32">Total</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                   {data.items.map((item, idx) => (
                      <tr key={idx}>
                         <td className="py-6 text-sm font-medium text-text-primary">{item.description || 'No description'}</td>
                         <td className="py-6 text-right text-sm font-display font-bold text-text-secondary">{item.qty}</td>
                         <td className="py-6 text-right text-sm font-display font-bold text-text-secondary">{formatCurrency(item.price, data.currency)}</td>
                         <td className="py-6 text-right text-sm font-display font-black text-text-primary">{formatCurrency(item.qty * item.price, data.currency)}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>

          {/* Footer Section */}
          <div className="flex flex-col md:flex-row justify-between gap-12 pt-8 border-t border-border-light/50">
             <div className="flex-1 space-y-8">
                {data.notes && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-display font-bold text-text-muted uppercase tracking-widest">Notes & Remarks</h4>
                    <p className="text-xs text-text-muted leading-relaxed font-medium whitespace-pre-wrap">{data.notes}</p>
                  </div>
                )}
                
                {data.branding.signature && (
                  <div className="flex flex-col items-start space-y-2 pt-4">
                    <img 
                      src={data.branding.signature} 
                      alt="Signature" 
                      className="max-h-16 object-contain mix-blend-multiply"
                      style={{ transform: `scale(${data.branding.signatureScale})` }}
                    />
                    <span className="text-[9px] font-display font-bold text-text-muted uppercase tracking-widest border-t border-border-light pt-2 pr-8 whitespace-nowrap">Authorized Signature</span>
                  </div>
                )}
             </div>
             <div className="w-full md:w-64 space-y-4">
                <div className="space-y-3">
                   <div className="flex justify-between items-center text-sm font-medium text-text-secondary">
                      <span>Subtotal</span>
                      <span className="font-display font-bold">{formatCurrency(totals.subtotal, data.currency)}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm font-medium text-text-secondary">
                      <span>Tax ({data.globalTax}%)</span>
                      <span className="font-display font-bold">{formatCurrency(totals.tax, data.currency)}</span>
                   </div>
                   {totals.discount > 0 && (
                     <div className="flex justify-between items-center text-sm font-medium text-text-secondary">
                        <span>Discount</span>
                        <span className="font-display font-bold text-red-500">-{formatCurrency(totals.discount, data.currency)}</span>
                     </div>
                   )}
                   <div className="pt-4 border-t-2 border-text-primary flex justify-between items-center">
                      <span className="text-xs font-display font-bold uppercase">Total</span>
                      <span className="text-2xl font-display font-black text-primary tracking-tighter">
                         {formatCurrency(totals.total, data.currency)}
                      </span>
                   </div>
                </div>
             </div>
          </div>

          {/* Fine print */}
          <div className="pt-24 pb-8 flex justify-between items-center border-t border-border-light/20">
             <p className="text-[8px] font-display font-bold text-text-muted/40 uppercase tracking-[0.2em]">Generated via InvoiceFlow · Precision Invoicing Suite</p>
             <p className="text-[8px] font-display font-bold text-text-muted/40 uppercase tracking-[0.2em]">Page 01 // 01</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function WhyUsPage({ onStart }) {
  const points = [
    {
      icon: <RotateCcw className="w-6 h-6" />,
      title: "Zero-Transmission Tech",
      desc: "Unlike standard cloud platforms, your data never leaves your hardware. We've engineered a local-first architecture where every byte of business data is processed in-memory and destroyed upon session close. Total privacy by design.",
      metric: "0% Data Leakage"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "HD Vector Precision",
      desc: "Our industrial-grade rendering engine generates PDFs using mathematical vectors rather than raster pixels. This ensures your documents remain pixel-perfect and crystal clear whether printed on a standard A4 or a large-format billboard.",
      metric: "Infinite Scalability"
    },
    {
      icon: <LayoutGrid className="w-6 h-6" />,
      title: "50+ Global Templates",
      desc: "Architected for 80+ international markets, our library covers everything from Creative Freelance to heavy Industrial and Medical billing. Switch layouts in a single click without losing a single line of input data.",
      metric: "Industry Specific"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Master Signature Branding",
      desc: "Professional identity is non-negotiable. Our dedicated signature system allows you to upload, scale, and isolate your digital signature with high-fidelity transparency, ensuring a consistent corporate look across all exports.",
      metric: "Pro Identity"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-32">
       {/* Hero */}
       <section className="text-center space-y-8 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 border border-primary/10 rounded-full text-[10px] font-bold text-primary uppercase tracking-widest"
          >
            Efficiency Redefined
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-display font-black text-text-primary tracking-tighter leading-[0.9]">
            The Standard for <br/>
            <span className="text-primary italic">Modern Excellence.</span>
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto font-medium leading-relaxed">
            InvoiceFlow isn't just a tool; it's a statement. We've stripped away the overhead of traditional invoicing to give you pure, industrial-grade document power.
          </p>
       </section>

       {/* Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {points.map((point, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white border border-black/[0.06] rounded-[2rem] p-10 space-y-8 hover:border-primary/20 transition-all hover:shadow-[0_24px_64px_rgba(0,0,0,0.04)]"
            >
               <div className="flex justify-between items-start">
                  <div className="w-14 h-14 bg-bg-section/50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    {point.icon}
                  </div>
                  <span className="text-[10px] font-display font-black text-primary/40 uppercase tracking-widest">{point.metric}</span>
               </div>
               <div className="space-y-4">
                  <h3 className="text-2xl font-display font-black text-text-primary tracking-tight">{point.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed font-medium">{point.desc}</p>
               </div>
            </motion.div>
          ))}
       </div>

       {/* Detailed Comparison Table Shell */}
       <section className="bg-text-primary rounded-[3rem] p-12 md:p-20 text-white space-y-16 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[150px] pointer-events-none" />
          <div className="space-y-4 text-center">
            <h3 className="text-3xl md:text-5xl font-display font-black tracking-tighter italic">Engineered Differently.</h3>
            <p className="text-white/40 max-w-xl mx-auto text-sm font-medium">A comparison of architecture between InvoiceFlow and legacy cloud platforms.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12">
             <div className="space-y-4">
                <div className="text-primary font-bold text-xs uppercase tracking-widest">Speed</div>
                <div className="text-3xl font-display font-black tracking-tight">Instant Render</div>
                <p className="text-white/40 text-sm leading-relaxed">No server round-trips. Your PDF is generated locally in milliseconds using the client-side CPU.</p>
             </div>
             <div className="space-y-4">
                <div className="text-primary font-bold text-xs uppercase tracking-widest">Ownership</div>
                <div className="text-3xl font-display font-black tracking-tight">Total Authority</div>
                <p className="text-white/40 text-sm leading-relaxed">We don't hold your data hostage. You own every pixel, every font choice, and every document export.</p>
             </div>
             <div className="space-y-4">
                <div className="text-primary font-bold text-xs uppercase tracking-widest">Access</div>
                <div className="text-3xl font-display font-black tracking-tight">Offline Capable</div>
                <p className="text-white/40 text-sm leading-relaxed">Once loaded, our engine works 100% offline. Perfect for field work, remote sites, or secure environments.</p>
             </div>
          </div>

          <div className="pt-20 flex justify-center">
             <button 
              onClick={onStart}
              className="bg-white text-text-primary px-12 py-5 rounded-2xl font-display font-black text-sm tracking-tight hover:bg-primary hover:text-white transition-all hover:scale-105 active:scale-95 shadow-2xl"
             >
                Initialize Your Environment
             </button>
          </div>
       </section>

       {/* Final Note */}
       <div className="text-center py-12">
          <p className="text-[10px] font-display font-bold text-text-muted/40 uppercase tracking-[0.4em]">Designed for the 1% · Built for Performance</p>
       </div>
    </div>
  );
}

