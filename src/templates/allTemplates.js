const today = new Date().toISOString().split('T')[0];
const due = new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0];

const mk = (from, to, items, notes='') => ({
  date: today, dueDate: due, currency: '$', globalTax: 0, discount: 0, notes,
  from, to, items: items.map((it,i)=>({id:i+1,...it})),
  meta:{}, branding:{logo:null,logoPos:'left',logoScale:1,logoOpacity:1}
});

export const ALL_TEMPLATES = [
  // 1
  { id:1, name:'Minimal Freelance', category:'Freelance', color:'#6C63FF', accent:'#EEF2FF',
    desc:'Clean purple design for independent contractors',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#6C63FF',fields:[]},
    invoiceData: mk(
      {name:'Alex Johnson',email:'alex@studio.dev',phone:'+1 555-0101',address:'San Francisco, CA 94102'},
      {name:'Bright Digital Co.',email:'billing@brightdigital.com',address:'New York, NY 10001'},
      [{description:'UI/UX Design — Homepage Redesign',qty:1,price:2800,tax:0},{description:'Prototype & Wireframes',qty:1,price:900,tax:0},{description:'Design Revisions (x3 rounds)',qty:3,price:150,tax:0}],
      'Payment due within 30 days. Thank you for your business!'
    )
  },
  // 2
  { id:2, name:'Bold Agency', category:'Agency', color:'#111827', accent:'#F9FAFB',
    desc:'Dark, authoritative look for creative agencies',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#111827',fields:[]},
    invoiceData: mk(
      {name:'Nova Creative Agency',email:'finance@novacreative.io',phone:'+1 555-0202',address:'Austin, TX 78701'},
      {name:'Apex Corp',email:'ap@apexcorp.com',address:'Chicago, IL 60601'},
      [{description:'Brand Identity Package',qty:1,price:5500,tax:0},{description:'Social Media Kit',qty:1,price:1200,tax:0},{description:'Brand Guidelines PDF',qty:1,price:800,tax:0}],
      'All work remains property of client upon full payment.'
    )
  },
  // 3
  { id:3, name:'Tech Startup', category:'Tech', color:'#0EA5E9', accent:'#F0F9FF',
    desc:'Modern blue for SaaS & software invoices',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#0EA5E9',fields:[]},
    invoiceData: mk(
      {name:'ByteForge Labs',email:'billing@byteforge.io',phone:'+1 555-0303',address:'Seattle, WA 98101'},
      {name:'StartupXYZ Inc.',email:'finance@startupxyz.com',address:'Boston, MA 02101'},
      [{description:'Software Development — Sprint 1-3',qty:3,price:3500,tax:0},{description:'API Integration',qty:1,price:1800,tax:0},{description:'QA Testing & Documentation',qty:1,price:1200,tax:0}],
      'Milestone-based payment schedule attached.'
    )
  },
  // 4
  { id:4, name:'Elegant Consulting', category:'Consulting', color:'#8B5CF6', accent:'#F5F3FF',
    desc:'Purple prestige for management consultants',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#8B5CF6',fields:[]},
    invoiceData: mk(
      {name:'Stratex Consulting LLC',email:'invoices@stratex.com',phone:'+1 555-0404',address:'Washington, DC 20001'},
      {name:'Fortune Partners',email:'cfo@fortunepartners.com',address:'Dallas, TX 75201'},
      [{description:'Strategic Advisory — Q1 Retainer',qty:1,price:8000,tax:0},{description:'Market Research Report',qty:1,price:2500,tax:0},{description:'Workshop Facilitation (2 days)',qty:2,price:1500,tax:0}],
      'Confidentiality agreement applies. Net 30.'
    )
  },
  // 5
  { id:5, name:'Retail Store', category:'Retail', color:'#F59E0B', accent:'#FFFBEB',
    desc:'Warm amber for product-based businesses',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#F59E0B',fields:[]},
    invoiceData: mk(
      {name:'Sunshine Goods Store',email:'orders@sunshinegoods.com',phone:'+1 555-0505',address:'Miami, FL 33101'},
      {name:'GreenLeaf Markets',email:'purchasing@greenleaf.com',address:'Atlanta, GA 30301'},
      [{description:'Organic Cotton T-Shirts (Box of 24)',qty:4,price:180,tax:5},{description:'Canvas Tote Bags (Box of 50)',qty:2,price:250,tax:5},{description:'Shipping & Handling',qty:1,price:95,tax:0}],
      'Returns accepted within 14 days with receipt.'
    )
  },
  // 6
  { id:6, name:'Legal Services', category:'Legal', color:'#1E293B', accent:'#F8FAFC',
    desc:'Professional navy for law firms & attorneys',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#1E293B',fields:[]},
    invoiceData: mk(
      {name:'Mercer & Associates LLP',email:'billing@mercerassoc.law',phone:'+1 555-0606',address:'New York, NY 10005'},
      {name:'Vance Industries',email:'legal@vance.com',address:'Philadelphia, PA 19101'},
      [{description:'Legal Consultation (5 hrs @ $350/hr)',qty:5,price:350,tax:0},{description:'Contract Drafting & Review',qty:1,price:1800,tax:0},{description:'Court Filing Fees',qty:1,price:425,tax:0}],
      'All fees are non-refundable. Attorney-client privilege applies.'
    )
  },
  // 7
  { id:7, name:'Photographer', category:'Creative', color:'#EC4899', accent:'#FDF2F8',
    desc:'Pink elegance for photographers & videographers',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#EC4899',fields:[]},
    invoiceData: mk(
      {name:'Lumina Photo Studio',email:'hello@luminaphoto.com',phone:'+1 555-0707',address:'Los Angeles, CA 90001'},
      {name:'Rivera & Co. Events',email:'events@riveraco.com',address:'Beverly Hills, CA 90210'},
      [{description:'Wedding Photography — Full Day',qty:1,price:3500,tax:0},{description:'Photo Editing & Retouching (500 images)',qty:1,price:1200,tax:0},{description:'Premium USB Drive + Album',qty:1,price:450,tax:0}],
      'Delivery within 6 weeks of event date. 50% deposit required.'
    )
  },
  // 8
  { id:8, name:'Construction', category:'Construction', color:'#D97706', accent:'#FFFBEB',
    desc:'Strong orange for contractors & builders',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#D97706',fields:[]},
    invoiceData: mk(
      {name:'BuildRight Contractors',email:'billing@buildright.co',phone:'+1 555-0808',address:'Phoenix, AZ 85001'},
      {name:'Greenview Developers',email:'pm@greenviewdev.com',address:'Scottsdale, AZ 85251'},
      [{description:'Foundation & Framing Work',qty:1,price:12000,tax:0},{description:'Electrical & Plumbing Rough-In',qty:1,price:7500,tax:0},{description:'Materials — Lumber & Steel',qty:1,price:4200,tax:0},{description:'Labor (Week 1-3)',qty:3,price:2800,tax:0}],
      'Progress billing. Lien waiver upon final payment.'
    )
  },
  // 9
  { id:9, name:'Medical Practice', category:'Medical', color:'#10B981', accent:'#ECFDF5',
    desc:'Clean green for healthcare providers',
    type:{id:'tax',name:'Tax Invoice',code:'TAX',color:'#10B981',fields:[{id:'sellerTaxId',label:'Tax ID',placeholder:''},{id:'buyerTaxId',label:'Patient ID',placeholder:''},{id:'taxType',label:'Tax Type',placeholder:'VAT'},{id:'hsnCode',label:'HSN Code',placeholder:''}]},
    invoiceData: mk(
      {name:'Dr. Patel Medical Center',email:'billing@drpatel.med',phone:'+1 555-0909',address:'Houston, TX 77001'},
      {name:'John Smith',email:'j.smith@email.com',address:'Houston, TX 77002'},
      [{description:'General Consultation',qty:1,price:200,tax:0},{description:'Blood Panel (Comprehensive)',qty:1,price:350,tax:0},{description:'Prescription & Follow-Up',qty:1,price:100,tax:0}],
      'Insurance claim submitted. Patient responsible for copay balance.'
    )
  },
  // 10
  { id:10, name:'Education / Tutoring', category:'Education', color:'#3B82F6', accent:'#EFF6FF',
    desc:'Calming blue for tutors & learning centers',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#3B82F6',fields:[]},
    invoiceData: mk(
      {name:'BrightMind Tutoring',email:'admin@brightmind.edu',phone:'+1 555-1010',address:'Denver, CO 80201'},
      {name:'Thompson Family',email:'mary.thompson@email.com',address:'Denver, CO 80202'},
      [{description:'Math Tutoring — 10 Sessions',qty:10,price:65,tax:0},{description:'Science Tutoring — 5 Sessions',qty:5,price:65,tax:0},{description:'Practice Materials & Workbooks',qty:1,price:45,tax:0}],
      'Thank you for investing in education! Sessions valid for 90 days.'
    )
  },
  // 11
  { id:11, name:'Real Estate Agent', category:'Real Estate', color:'#059669', accent:'#ECFDF5',
    desc:'Professional for property & realty services',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#059669',fields:[]},
    invoiceData: mk(
      {name:'Prime Realty Group',email:'commission@primerealty.com',phone:'+1 555-1111',address:'Miami, FL 33101'},
      {name:'Williams Property Trust',email:'trust@williams.com',address:'Coral Gables, FL 33134'},
      [{description:'Seller Commission — 3% of $850,000',qty:1,price:25500,tax:0},{description:'Marketing & Photography',qty:1,price:1200,tax:0},{description:'Open House Coordination (x4)',qty:4,price:250,tax:0}],
      'Commission per signed listing agreement dated above.'
    )
  },
  // 12
  { id:12, name:'Food & Catering', category:'Food', color:'#EF4444', accent:'#FEF2F2',
    desc:'Appetizing red for restaurants & caterers',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#EF4444',fields:[]},
    invoiceData: mk(
      {name:'Bella Cucina Catering',email:'bookings@bellacucina.com',phone:'+1 555-1212',address:'Chicago, IL 60601'},
      {name:'Lakefront Events LLC',email:'events@lakefront.com',address:'Chicago, IL 60611'},
      [{description:'Corporate Dinner — 150 guests (3-course)',qty:150,price:45,tax:8},{description:'Bar Service (4 hrs)',qty:4,price:350,tax:0},{description:'Setup, Staffing & Cleanup',qty:1,price:800,tax:0}],
      'Menu finalized 2 weeks prior. 30% deposit is non-refundable.'
    )
  },
  // 13
  { id:13, name:'Marketing Agency', category:'Agency', color:'#F97316', accent:'#FFF7ED',
    desc:'Bold orange for digital marketing professionals',
    type:{id:'recurring',name:'Recurring Invoice',code:'REC',color:'#F97316',fields:[{id:'frequency',label:'Frequency',placeholder:'Monthly'},{id:'periodStart',label:'Period Start',type:'date'},{id:'periodEnd',label:'Period End',type:'date'},{id:'nextInvDate',label:'Next Invoice',type:'date'},{id:'contractId',label:'Contract ID',placeholder:''}]},
    invoiceData: mk(
      {name:'GrowthHack Agency',email:'billing@growthhack.agency',phone:'+1 555-1313',address:'New York, NY 10013'},
      {name:'TechPulse Co.',email:'marketing@techpulse.co',address:'Brooklyn, NY 11201'},
      [{description:'SEO Management — Monthly Retainer',qty:1,price:2500,tax:0},{description:'Google Ads Management',qty:1,price:1500,tax:0},{description:'Content Creation (8 articles)',qty:8,price:200,tax:0}],
      'Monthly reporting delivered by the 5th of each month.'
    )
  },
  // 14
  { id:14, name:'Interior Designer', category:'Creative', color:'#A78BFA', accent:'#F5F3FF',
    desc:'Lavender elegance for interior design studios',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#A78BFA',fields:[]},
    invoiceData: mk(
      {name:'Casa Blanche Interiors',email:'projects@casablanche.design',phone:'+1 555-1414',address:'Los Angeles, CA 90036'},
      {name:'The Harrington Family',email:'mrharrington@email.com',address:'Bel Air, CA 90077'},
      [{description:'Full Home Design Consultation',qty:1,price:500,tax:0},{description:'Design Package — Living & Dining',qty:1,price:4500,tax:0},{description:'Furniture Procurement (15% markup)',qty:1,price:3200,tax:0}],
      '50% deposit due upon signing. Final balance at project completion.'
    )
  },
  // 15
  { id:15, name:'Software Subscription', category:'Tech', color:'#2563EB', accent:'#EFF6FF',
    desc:'Clean SaaS billing with subscription details',
    type:{id:'recurring',name:'Recurring Invoice',code:'REC',color:'#2563EB',fields:[{id:'frequency',label:'Frequency',placeholder:'Monthly'},{id:'periodStart',label:'Period Start',type:'date'},{id:'periodEnd',label:'Period End',type:'date'},{id:'nextInvDate',label:'Next Invoice',type:'date'},{id:'contractId',label:'Contract ID',placeholder:''}]},
    invoiceData: mk(
      {name:'CloudDesk Software Inc.',email:'billing@clouddesk.io',phone:'+1 555-1515',address:'San Jose, CA 95101'},
      {name:'Momentum Corp',email:'it@momentumcorp.com',address:'San Francisco, CA 94105'},
      [{description:'CloudDesk Pro — Enterprise Plan (50 seats)',qty:50,price:29,tax:0},{description:'Priority Support Add-on',qty:1,price:500,tax:0},{description:'Custom Integrations Module',qty:1,price:200,tax:0}],
      'Annual billing saves 20%. Auto-renewal unless cancelled 30 days prior.'
    )
  },
  // 16
  { id:16, name:'Event Planner', category:'Events', color:'#DB2777', accent:'#FDF2F8',
    desc:'Vibrant pink for event management companies',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#DB2777',fields:[]},
    invoiceData: mk(
      {name:'Stellar Events Co.',email:'hello@stellarevents.co',phone:'+1 555-1616',address:'Las Vegas, NV 89101'},
      {name:'Goldstein Wedding',email:'sarah.goldstein@email.com',address:'Henderson, NV 89002'},
      [{description:'Full Wedding Planning Package',qty:1,price:5500,tax:0},{description:'Venue Coordination & Logistics',qty:1,price:1200,tax:0},{description:'Vendor Management (12 vendors)',qty:12,price:100,tax:0}],
      'Deposit of 40% secures your date. Balance due 7 days before event.'
    )
  },
  // 17
  { id:17, name:'Copywriter', category:'Freelance', color:'#64748B', accent:'#F8FAFC',
    desc:'Slate gray for professional writers & editors',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#64748B',fields:[]},
    invoiceData: mk(
      {name:'WordCraft by Maya Lin',email:'maya@wordcraft.pro',phone:'+1 555-1717',address:'Portland, OR 97201'},
      {name:'Velocity Brands',email:'content@velocitybrands.com',address:'Seattle, WA 98101'},
      [{description:'Website Copy — 8 Pages',qty:8,price:400,tax:0},{description:'Blog Posts (1500 words each)',qty:5,price:250,tax:0},{description:'Email Campaign Sequence (7 emails)',qty:7,price:175,tax:0}],
      'Revisions: 2 rounds included per deliverable. Net 15.'
    )
  },
  // 18
  { id:18, name:'Fitness Trainer', category:'Health', color:'#EF4444', accent:'#FFF1F2',
    desc:'Energetic red for personal trainers & gyms',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#EF4444',fields:[]},
    invoiceData: mk(
      {name:'IronFit Training',email:'train@ironfit.com',phone:'+1 555-1818',address:'Austin, TX 78702'},
      {name:'Chris Davison',email:'chris.d@email.com',address:'Austin, TX 78703'},
      [{description:'Personal Training Sessions (12 x 1hr)',qty:12,price:75,tax:0},{description:'Nutrition Plan & Meal Prep Guide',qty:1,price:200,tax:0},{description:'Body Composition Assessment',qty:1,price:50,tax:0}],
      'Sessions expire 60 days from purchase. No refunds.'
    )
  },
  // 19
  { id:19, name:'Architecture Studio', category:'Architecture', color:'#292524', accent:'#FAFAF9',
    desc:'Monochrome for architects & urban designers',
    type:{id:'proforma',name:'Proforma Invoice',code:'PRO',color:'#292524',fields:[]},
    invoiceData: mk(
      {name:'Form & Function Architecture',email:'finance@formfunctionarch.com',phone:'+1 555-1919',address:'Chicago, IL 60602'},
      {name:'Lakeside Trust Development',email:'mgmt@lakesidetrust.com',address:'Evanston, IL 60201'},
      [{description:'Schematic Design Phase',qty:1,price:15000,tax:0},{description:'Design Development Phase',qty:1,price:22000,tax:0},{description:'Construction Documents',qty:1,price:18000,tax:0}],
      'Proforma invoice for project commitment. Formal invoices per phase milestone.'
    )
  },
  // 20
  { id:20, name:'E-Commerce Store', category:'Retail', color:'#7C3AED', accent:'#F5F3FF',
    desc:'Electric purple for online sellers',
    type:{id:'commercial',name:'Commercial Invoice',code:'COM',color:'#7C3AED',fields:[{id:'originCountry',label:'Country of Origin',placeholder:''},{id:'destCountry',label:'Destination',placeholder:''},{id:'incoterms',label:'Incoterms',placeholder:''},{id:'shippingMethod',label:'Shipping',placeholder:''},{id:'blNumber',label:'Tracking No.',placeholder:''},{id:'portLoading',label:'Ship From',placeholder:''},{id:'portDischarge',label:'Ship To',placeholder:''}]},
    invoiceData: mk(
      {name:'PixelCart Online Store',email:'orders@pixelcart.shop',phone:'+1 555-2020',address:'Miami, FL 33132'},
      {name:'Global Wholesale Ltd.',email:'import@globalwholesale.co',address:'Toronto, ON M5H 2N2'},
      [{description:'Premium Wireless Earbuds (White)',qty:50,price:28,tax:0},{description:'Smart Watch — Series 3',qty:20,price:65,tax:0},{description:'USB-C Hub (7-in-1)',qty:100,price:18,tax:0}],
      'Shipped via DHL Express. ETA 5-7 business days.'
    )
  },
  // 21
  { id:21, name:'Accountant / CPA', category:'Finance', color:'#15803D', accent:'#F0FDF4',
    desc:'Trustworthy green for accountants & tax pros',
    type:{id:'tax',name:'Tax Invoice',code:'TAX',color:'#15803D',fields:[{id:'sellerTaxId',label:'CPA License #',placeholder:''},{id:'buyerTaxId',label:'Client EIN',placeholder:''},{id:'taxType',label:'Service Type',placeholder:''},{id:'hsnCode',label:'SAC Code',placeholder:''}]},
    invoiceData: mk(
      {name:'Summit CPA Group',email:'billing@summitcpa.com',phone:'+1 555-2121',address:'Denver, CO 80202'},
      {name:'Peak Mountain LLC',email:'owner@peakmtn.com',address:'Boulder, CO 80301'},
      [{description:'Annual Tax Preparation — Business',qty:1,price:1800,tax:0},{description:'Quarterly Bookkeeping (Q1)',qty:1,price:600,tax:0},{description:'Payroll Processing — March',qty:1,price:400,tax:0}],
      'All financial records kept confidential. AICPA standards apply.'
    )
  },
  // 22
  { id:22, name:'Landscaping', category:'Construction', color:'#4D7C0F', accent:'#F7FEE7',
    desc:'Fresh green for landscapers & garden services',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#4D7C0F',fields:[]},
    invoiceData: mk(
      {name:'GreenScape Landscaping',email:'quote@greenscape.biz',phone:'+1 555-2222',address:'Sacramento, CA 95814'},
      {name:'Oak Ridge HOA',email:'board@oakridgehoa.com',address:'Folsom, CA 95630'},
      [{description:'Lawn Mowing & Edging (Monthly)',qty:4,price:180,tax:0},{description:'Seasonal Planting — Spring',qty:1,price:850,tax:0},{description:'Irrigation System Maintenance',qty:1,price:320,tax:0}],
      'Service agreement renewable annually. Water usage per meter.'
    )
  },
  // 23
  { id:23, name:'Video Production', category:'Creative', color:'#1D4ED8', accent:'#EFF6FF',
    desc:'Cinematic blue for video & film professionals',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#1D4ED8',fields:[]},
    invoiceData: mk(
      {name:'FramePerfect Productions',email:'projects@frameperfect.tv',phone:'+1 555-2323',address:'Los Angeles, CA 90028'},
      {name:'Apex Fitness Brand',email:'marketing@apexfitness.com',address:'Santa Monica, CA 90401'},
      [{description:'Commercial Video Production (30s spot)',qty:1,price:8500,tax:0},{description:'Post-Production & Color Grading',qty:1,price:2200,tax:0},{description:'Motion Graphics & Music License',qty:1,price:1500,tax:0}],
      'Client owns all final deliverables upon final payment.'
    )
  },
  // 24
  { id:24, name:'Graphic Designer', category:'Creative', color:'#D946EF', accent:'#FDF4FF',
    desc:'Vibrant magenta for graphic design studios',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#D946EF',fields:[]},
    invoiceData: mk(
      {name:'PixelPress Design',email:'hello@pixelpress.design',phone:'+1 555-2424',address:'Brooklyn, NY 11217'},
      {name:'Sunrise Beverages Co.',email:'brand@sunrisebev.com',address:'Newark, NJ 07101'},
      [{description:'Logo Design & Brand Identity',qty:1,price:2200,tax:0},{description:'Packaging Design — 3 SKUs',qty:3,price:750,tax:0},{description:'Print-Ready Files & Source Files',qty:1,price:300,tax:0}],
      'All source files provided in AI and PDF format. 2 revision rounds.'
    )
  },
  // 25
  { id:25, name:'Import/Export Trader', category:'Trade', color:'#9A3412', accent:'#FFF7ED',
    desc:'Bold red-brown for international trade invoices',
    type:{id:'commercial',name:'Commercial Invoice',code:'COM',color:'#9A3412',fields:[{id:'originCountry',label:'Country of Origin',placeholder:''},{id:'destCountry',label:'Destination',placeholder:''},{id:'incoterms',label:'Incoterms',placeholder:'FOB'},{id:'shippingMethod',label:'Shipping Method',placeholder:''},{id:'blNumber',label:'B/L Number',placeholder:''},{id:'portLoading',label:'Port of Loading',placeholder:''},{id:'portDischarge',label:'Port of Discharge',placeholder:''}]},
    invoiceData: mk(
      {name:'TradeLink International',email:'export@tradelink.co',phone:'+1 555-2525',address:'Newark, NJ 07102'},
      {name:'Euro Imports GmbH',email:'import@euroimports.de',address:'Hamburg, Germany 20095'},
      [{description:'Cotton Textile (HS: 5208.21) — 500 meters',qty:500,price:4.5,tax:0},{description:'Silk Fabric (HS: 5007.20) — 200 meters',qty:200,price:12,tax:0},{description:'Freight & Insurance',qty:1,price:850,tax:0}],
      'Payment via Wire Transfer (T/T). L/C accepted.'
    )
  },
  // 26
  { id:26, name:'HR Consulting', category:'Consulting', color:'#0891B2', accent:'#ECFEFF',
    desc:'Professional teal for HR & talent firms',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#0891B2',fields:[]},
    invoiceData: mk(
      {name:'PeopleFirst HR Solutions',email:'billing@peoplefirsthr.com',phone:'+1 555-2626',address:'Atlanta, GA 30309'},
      {name:'NexGen Fintech',email:'hr@nexgenfintech.com',address:'Atlanta, GA 30308'},
      [{description:'Recruitment — Senior Dev Position',qty:1,price:6500,tax:0},{description:'HR Policy Manual Development',qty:1,price:2800,tax:0},{description:'Employee Onboarding Program',qty:1,price:1500,tax:0}],
      'Placement fee covers 90-day guarantee period.'
    )
  },
  // 27
  { id:27, name:'Auto Mechanic', category:'Automotive', color:'#374151', accent:'#F9FAFB',
    desc:'Dark gray for auto repair shops',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#374151',fields:[]},
    invoiceData: mk(
      {name:'Precision Auto Repair',email:'service@precisionauto.shop',phone:'+1 555-2727',address:'Detroit, MI 48201'},
      {name:'Robert Chen',email:'rchen@email.com',address:'Dearborn, MI 48124'},
      [{description:'Oil Change & Filter Replacement',qty:1,price:85,tax:0},{description:'Brake Pad Replacement (Front)',qty:1,price:320,tax:0},{description:'Tire Rotation & Balance',qty:1,price:60,tax:0},{description:'Parts & Materials',qty:1,price:145,tax:0}],
      'All repairs warranted for 12 months / 12,000 miles.'
    )
  },
  // 28
  { id:28, name:'Web Developer', category:'Tech', color:'#10B981', accent:'#ECFDF5',
    desc:'Fresh green for web & app developers',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#10B981',fields:[]},
    invoiceData: mk(
      {name:'CodeCraft Solutions',email:'invoice@codecraft.dev',phone:'+1 555-2828',address:'Austin, TX 78704'},
      {name:'LocalBiz Pro',email:'owner@localbizpro.com',address:'Austin, TX 78701'},
      [{description:'WordPress Website Development',qty:1,price:3200,tax:0},{description:'E-commerce Integration (WooCommerce)',qty:1,price:1800,tax:0},{description:'SEO Setup & Google Analytics',qty:1,price:650,tax:0},{description:'3-Month Hosting & Maintenance',qty:3,price:120,tax:0}],
      'Website delivered within 4 weeks of content receipt.'
    )
  },
  // 29
  { id:29, name:'Tax Return Service', category:'Finance', color:'#1E40AF', accent:'#EFF6FF',
    desc:'Trustworthy blue for tax preparation services',
    type:{id:'tax',name:'Tax Invoice',code:'TAX',color:'#1E40AF',fields:[{id:'sellerTaxId',label:'PTIN',placeholder:''},{id:'buyerTaxId',label:'Client SSN (last 4)',placeholder:''},{id:'taxType',label:'Return Type',placeholder:'1040'},{id:'hsnCode',label:'Tax Year',placeholder:'2024'}]},
    invoiceData: mk(
      {name:'TaxEase Professional Services',email:'file@taxeaseservices.com',phone:'+1 555-2929',address:'Las Vegas, NV 89109'},
      {name:'Martinez Family',email:'jmartinez@email.com',address:'Henderson, NV 89014'},
      [{description:'Federal Tax Return Preparation (1040)',qty:1,price:350,tax:0},{description:'State Tax Return — Nevada',qty:1,price:75,tax:0},{description:'Prior Year Amendment',qty:1,price:225,tax:0}],
      'Documents required: W-2, 1099s, receipts. Appointment required.'
    )
  },
  // 30
  { id:30, name:'Music Producer', category:'Creative', color:'#7C3AED', accent:'#F5F3FF',
    desc:'Deep purple for beat makers & studios',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#7C3AED',fields:[]},
    invoiceData: mk(
      {name:'SoundWave Studios',email:'beats@soundwavestudio.com',phone:'+1 555-3030',address:'Atlanta, GA 30310'},
      {name:'Apex Records',email:'ar@apexrecords.com',address:'Nashville, TN 37201'},
      [{description:'Beat Production — Full Album (10 tracks)',qty:10,price:800,tax:0},{description:'Studio Mixing & Mastering',qty:1,price:3500,tax:0},{description:'Exclusive Licensing Rights',qty:1,price:2000,tax:0}],
      'Exclusive rights transfer upon receipt of full payment.'
    )
  },
  // 31
  { id:31, name:'Financial Advisor', category:'Finance', color:'#065F46', accent:'#ECFDF5',
    desc:'Deep green for wealth management advisors',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#065F46',fields:[]},
    invoiceData: mk(
      {name:'Wealth Horizons Advisory',email:'advisor@wealthhorizons.com',phone:'+1 555-3131',address:'New York, NY 10004'},
      {name:'Morrison Family Trust',email:'trust@morrison.com',address:'Greenwich, CT 06830'},
      [{description:'Portfolio Management Fee — Q1 (1% AUM)',qty:1,price:3750,tax:0},{description:'Financial Plan Review & Update',qty:1,price:500,tax:0},{description:'Estate Planning Consultation',qty:2,price:400,tax:0}],
      'Fees calculated on assets under management as of quarter end.'
    )
  },
  // 32
  { id:32, name:'Electrician', category:'Construction', color:'#CA8A04', accent:'#FEFCE8',
    desc:'Electric yellow for electrical contractors',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#CA8A04',fields:[]},
    invoiceData: mk(
      {name:'Spark Electric Co.',email:'billing@sparkelectric.co',phone:'+1 555-3232',address:'Dallas, TX 75202'},
      {name:'Sunrise Apartments',email:'mgmt@sunriseapts.com',address:'Irving, TX 75061'},
      [{description:'Panel Upgrade — 200A Service',qty:1,price:2800,tax:0},{description:'Outlet & Light Installation (20 units)',qty:20,price:85,tax:0},{description:'EV Charger Installation',qty:2,price:650,tax:0}],
      'All work meets NEC code. Permit included. 1-yr workmanship warranty.'
    )
  },
  // 33
  { id:33, name:'Dentist Office', category:'Medical', color:'#0369A1', accent:'#F0F9FF',
    desc:'Clinical blue for dental & orthodontic practices',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#0369A1',fields:[]},
    invoiceData: mk(
      {name:'Bright Smile Dental',email:'billing@brightsmile.dental',phone:'+1 555-3333',address:'Phoenix, AZ 85010'},
      {name:'Emily Watson',email:'emily.watson@email.com',address:'Tempe, AZ 85281'},
      [{description:'Comprehensive Dental Exam',qty:1,price:150,tax:0},{description:'Professional Teeth Whitening',qty:1,price:399,tax:0},{description:'Dental Cleaning & X-Rays',qty:1,price:225,tax:0}],
      'Insurance billed separately. Patient balance due at time of service.'
    )
  },
  // 34
  { id:34, name:'Plumber', category:'Construction', color:'#0F766E', accent:'#F0FDFA',
    desc:'Teal for plumbing contractors & services',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#0F766E',fields:[]},
    invoiceData: mk(
      {name:'FlowMaster Plumbing',email:'service@flowmasterplumb.com',phone:'+1 555-3434',address:'San Diego, CA 92101'},
      {name:'Pacific Coast Properties',email:'maint@pcoastprop.com',address:'San Diego, CA 92103'},
      [{description:'Emergency Leak Repair — Unit 12B',qty:1,price:425,tax:0},{description:'Water Heater Replacement (50 gal)',qty:1,price:1100,tax:0},{description:'Pipe Inspection & Camera Service',qty:1,price:280,tax:0}],
      'Emergency callout rate applies after 5pm & weekends. Licensed & bonded.'
    )
  },
  // 35
  { id:35, name:'Social Media Manager', category:'Agency', color:'#EC4899', accent:'#FDF2F8',
    desc:'Trendy pink for social media specialists',
    type:{id:'recurring',name:'Recurring Invoice',code:'REC',color:'#EC4899',fields:[{id:'frequency',label:'Frequency',placeholder:'Monthly'},{id:'periodStart',label:'Period Start',type:'date'},{id:'periodEnd',label:'Period End',type:'date'},{id:'nextInvDate',label:'Next Invoice',type:'date'},{id:'contractId',label:'Contract ID',placeholder:''}]},
    invoiceData: mk(
      {name:'Scroll & Convert Agency',email:'billing@scrollconvert.com',phone:'+1 555-3535',address:'Miami, FL 33139'},
      {name:'FreshJuice Brand',email:'brand@freshjuice.co',address:'Fort Lauderdale, FL 33301'},
      [{description:'Social Media Management (IG + TikTok)',qty:1,price:1800,tax:0},{description:'Content Creation — 30 posts/month',qty:30,price:30,tax:0},{description:'Influencer Outreach & Collaboration',qty:1,price:800,tax:0}],
      'Monthly analytics report provided. Min. 3-month commitment.'
    )
  },
  // 36
  { id:36, name:'Moving Company', category:'Logistics', color:'#B45309', accent:'#FFFBEB',
    desc:'Warm brown for moving & storage services',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#B45309',fields:[]},
    invoiceData: mk(
      {name:'EasyMove Logistics',email:'quotes@easymove.co',phone:'+1 555-3636',address:'Houston, TX 77002'},
      {name:'David Park',email:'dpark@email.com',address:'Houston, TX 77003'},
      [{description:'Local Move — 3BR Home (6 hrs)',qty:6,price:125,tax:0},{description:'Packing Materials & Supplies',qty:1,price:180,tax:0},{description:'Piano & Specialty Item Moving',qty:1,price:350,tax:0}],
      'Payment due on delivery. Gratuity not included but appreciated.'
    )
  },
  // 37
  { id:37, name:'Security Services', category:'Consulting', color:'#1E293B', accent:'#F1F5F9',
    desc:'Dark slate for security and compliance firms',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#1E293B',fields:[]},
    invoiceData: mk(
      {name:'ShieldPro Security',email:'billing@shieldprosec.com',phone:'+1 555-3737',address:'Washington, DC 20005'},
      {name:'National Bank Corp',email:'security@nbc.com',address:'Washington, DC 20006'},
      [{description:'Security Guard Services — 30 days (24/7)',qty:30,price:480,tax:0},{description:'CCTV Monitoring — Monthly Fee',qty:1,price:850,tax:0},{description:'Incident Report & Documentation',qty:1,price:200,tax:0}],
      'All personnel are licensed and insured. Background-checked.'
    )
  },
  // 38
  { id:38, name:'Life Coach', category:'Consulting', color:'#F59E0B', accent:'#FFFBEB',
    desc:'Warm amber for coaches & wellness pros',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#F59E0B',fields:[]},
    invoiceData: mk(
      {name:'Elevate Life Coaching',email:'coach@elevatelife.co',phone:'+1 555-3838',address:'Scottsdale, AZ 85251'},
      {name:'Jennifer Mills',email:'jmills@email.com',address:'Chandler, AZ 85224'},
      [{description:'1:1 Coaching Sessions — 8 weeks',qty:8,price:225,tax:0},{description:'Personal Development Workbook',qty:1,price:75,tax:0},{description:'Group Workshop Attendance',qty:2,price:150,tax:0}],
      'Sessions are 60 minutes via Zoom or in-person. Reschedule with 24hr notice.'
    )
  },
  // 39
  { id:39, name:'Product Manufacturer', category:'Manufacturing', color:'#475569', accent:'#F8FAFC',
    desc:'Industrial gray for production & manufacturing',
    type:{id:'commercial',name:'Commercial Invoice',code:'COM',color:'#475569',fields:[{id:'originCountry',label:'Country of Origin',placeholder:''},{id:'destCountry',label:'Destination',placeholder:''},{id:'incoterms',label:'Incoterms',placeholder:''},{id:'shippingMethod',label:'Shipping',placeholder:''},{id:'blNumber',label:'PO Number',placeholder:''},{id:'portLoading',label:'Factory Address',placeholder:''},{id:'portDischarge',label:'Delivery Address',placeholder:''}]},
    invoiceData: mk(
      {name:'PrecisionParts Manufacturing',email:'sales@precisionparts.mfg',phone:'+1 555-3939',address:'Detroit, MI 48202'},
      {name:'AutoBuild Assembly Corp',email:'procurement@autobuild.com',address:'Toledo, OH 43601'},
      [{description:'Steel Bracket Assembly (Part #BR-4421)',qty:1000,price:2.85,tax:0},{description:'Aluminum Housing Unit (Part #AH-7700)',qty:500,price:8.40,tax:0},{description:'Quality Control Certification',qty:1,price:350,tax:0}],
      'Lead time: 3-4 weeks. Net 60 on approved credit. COO provided.'
    )
  },
  // 40
  { id:40, name:'Insurance Broker', category:'Finance', color:'#1E40AF', accent:'#EFF6FF',
    desc:'Professional blue for insurance & brokerage',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#1E40AF',fields:[]},
    invoiceData: mk(
      {name:'SafeGuard Insurance Brokers',email:'billing@safeguardib.com',phone:'+1 555-4040',address:'Hartford, CT 06101'},
      {name:'Riverdale Property Group',email:'risk@riverdale.com',address:'Stamford, CT 06901'},
      [{description:'Commercial Property Insurance Brokerage',qty:1,price:3200,tax:0},{description:'Liability Coverage Consultation',qty:1,price:800,tax:0},{description:'Policy Review & Risk Assessment',qty:1,price:500,tax:0}],
      'Premium binding subject to underwriter approval.'
    )
  },
  // 41
  { id:41, name:'Yoga Instructor', category:'Health', color:'#059669', accent:'#ECFDF5',
    desc:'Calm green for wellness & yoga studios',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#059669',fields:[]},
    invoiceData: mk(
      {name:'Zenith Yoga Studio',email:'studio@zenithyoga.com',phone:'+1 555-4141',address:'Portland, OR 97202'},
      {name:'Wellness Corp Program',email:'benefits@wellnesscorp.com',address:'Beaverton, OR 97005'},
      [{description:'Corporate Yoga — 12 group classes',qty:12,price:180,tax:0},{description:'Meditation & Mindfulness Workshop',qty:2,price:250,tax:0},{description:'Customized Wellness Program PDF',qty:1,price:150,tax:0}],
      'Classes suitable for all levels. Indoor/outdoor options available.'
    )
  },
  // 42
  { id:42, name:'Translator / Interpreter', category:'Freelance', color:'#0891B2', accent:'#ECFEFF',
    desc:'Clear teal for language service providers',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#0891B2',fields:[]},
    invoiceData: mk(
      {name:'LinguaBridge Services',email:'translate@linguabridge.com',phone:'+1 555-4242',address:'New York, NY 10016'},
      {name:'Global Legal Partners',email:'documents@globallegal.com',address:'New York, NY 10036'},
      [{description:'Legal Document Translation (EN→ES) — 45 pages',qty:45,price:32,tax:0},{description:'Certified Translation Certificate',qty:1,price:75,tax:0},{description:'Simultaneous Interpretation — 2hrs',qty:2,price:350,tax:0}],
      'Certified accurate. Notarization available on request (+$50).'
    )
  },
  // 43
  { id:43, name:'Drone Operator', category:'Creative', color:'#6366F1', accent:'#EEF2FF',
    desc:'Cool indigo for aerial photography & surveys',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#6366F1',fields:[]},
    invoiceData: mk(
      {name:'SkyView Aerial Solutions',email:'missions@skyviewaerial.com',phone:'+1 555-4343',address:'Denver, CO 80205'},
      {name:'Summit Land Surveyors',email:'pm@summitsurvey.com',address:'Boulder, CO 80302'},
      [{description:'Aerial Survey — 200 Acre Property',qty:1,price:2800,tax:0},{description:'LiDAR Mapping & 3D Model',qty:1,price:1500,tax:0},{description:'FAA Waiver & Flight Plan Filing',qty:1,price:300,tax:0}],
      'All flights conducted under FAA Part 107. Deliverables in GeoTIFF & KMZ.'
    )
  },
  // 44
  { id:44, name:'IT Support', category:'Tech', color:'#374151', accent:'#F9FAFB',
    desc:'Clean gray for managed IT and helpdesk',
    type:{id:'recurring',name:'Recurring Invoice',code:'REC',color:'#374151',fields:[{id:'frequency',label:'Frequency',placeholder:'Monthly'},{id:'periodStart',label:'Period Start',type:'date'},{id:'periodEnd',label:'Period End',type:'date'},{id:'nextInvDate',label:'Next Invoice',type:'date'},{id:'contractId',label:'Contract ID',placeholder:''}]},
    invoiceData: mk(
      {name:'NetGuard IT Services',email:'billing@netguardit.com',phone:'+1 555-4444',address:'San Jose, CA 95110'},
      {name:'Pacific Medical Group',email:'it@pacificmed.org',address:'San Jose, CA 95128'},
      [{description:'Managed IT Support — 25 endpoints',qty:25,price:45,tax:0},{description:'Cloud Backup & Disaster Recovery',qty:1,price:800,tax:0},{description:'Cybersecurity Monitoring (24/7)',qty:1,price:600,tax:0}],
      'SLA: 4-hr response time for Priority 1 issues. Uptime guaranteed 99.9%.'
    )
  },
  // 45
  { id:45, name:'Public Relations', category:'Agency', color:'#BE185D', accent:'#FDF2F8',
    desc:'Elegant rose for PR & communications agencies',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#BE185D',fields:[]},
    invoiceData: mk(
      {name:'Catalyst PR Group',email:'accounts@catalystpr.com',phone:'+1 555-4545',address:'New York, NY 10022'},
      {name:'Launch Pad Startups',email:'brand@launchpadstartups.io',address:'New York, NY 10013'},
      [{description:'PR Strategy & Brand Positioning',qty:1,price:4500,tax:0},{description:'Press Release Writing & Distribution',qty:4,price:750,tax:0},{description:'Media Relations & Pitching — Monthly',qty:1,price:3000,tax:0}],
      'Editorial calendar and coverage reports provided monthly.'
    )
  },
  // 46
  { id:46, name:'Veterinary Clinic', category:'Medical', color:'#16A34A', accent:'#F0FDF4',
    desc:'Friendly green for vet practices',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#16A34A',fields:[]},
    invoiceData: mk(
      {name:'Happy Paws Veterinary Clinic',email:'billing@happypaws.vet',phone:'+1 555-4646',address:'Portland, OR 97203'},
      {name:'Sarah Bennett',email:'sbennett@email.com',address:'Portland, OR 97206'},
      [{description:'Annual Wellness Exam — Max (Golden Retriever)',qty:1,price:95,tax:0},{description:'Vaccinations (Bordetella, Rabies, DHPP)',qty:1,price:145,tax:0},{description:'Flea & Tick Prevention — 6-month supply',qty:1,price:89,tax:0}],
      'Prescription items require a valid exam within 12 months.'
    )
  },
  // 47
  { id:47, name:'Recruitment Agency', category:'HR', color:'#4F46E5', accent:'#EEF2FF',
    desc:'Indigo authority for talent acquisition firms',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#4F46E5',fields:[]},
    invoiceData: mk(
      {name:'TopTalent Search Group',email:'invoices@toptalentsearch.com',phone:'+1 555-4747',address:'Chicago, IL 60604'},
      {name:'ScaleUp Ventures',email:'people@scaleupventures.com',address:'Chicago, IL 60607'},
      [{description:'Executive Search — CTO Placement',qty:1,price:18000,tax:0},{description:'Candidate Assessment & Psychometric Testing',qty:3,price:450,tax:0},{description:'Background Screening — 3 candidates',qty:3,price:200,tax:0}],
      'Placement fee: 20% first-year salary. 90-day replacement guarantee.'
    )
  },
  // 48
  { id:48, name:'Airline / Travel Agency', category:'Travel', color:'#0284C7', accent:'#F0F9FF',
    desc:'Sky blue for travel agencies & tour operators',
    type:{id:'standard',name:'Standard Invoice',code:'STD',color:'#0284C7',fields:[]},
    invoiceData: mk(
      {name:'Skybound Travel Agency',email:'bookings@skyboundtravel.com',phone:'+1 555-4848',address:'Miami, FL 33131'},
      {name:'Johnson Corporate Travel Dept',email:'travel@johnsonco.com',address:'Boca Raton, FL 33431'},
      [{description:'Business Class Flights — NYC to London (x4)',qty:4,price:3200,tax:0},{description:'5-Star Hotel — 5 nights (Claridge\'s)',qty:5,price:950,tax:0},{description:'Ground Transportation & Tours',qty:1,price:600,tax:0}],
      'All bookings subject to carrier terms. Cancellation policy applies.'
    )
  },
  // 49
  { id:49, name:'Non-Profit / NGO', category:'Non-Profit', color:'#0D9488', accent:'#F0FDFA',
    desc:'Teal grant & donation invoice for NGOs',
    type:{id:'proforma',name:'Proforma Invoice',code:'PRO',color:'#0D9488',fields:[]},
    invoiceData: mk(
      {name:'Clean Earth Foundation',email:'grants@cleanearth.org',phone:'+1 555-4949',address:'Seattle, WA 98104'},
      {name:'Wilson Foundation',email:'grants@wilsonfound.org',address:'New York, NY 10012'},
      [{description:'Community Clean-Up Program — Q2 Grant',qty:1,price:12000,tax:0},{description:'Environmental Education Workshops (x10)',qty:10,price:500,tax:0},{description:'Program Administration & Reporting',qty:1,price:2000,tax:0}],
      'EIN: 47-0001234. 501(c)(3) tax-exempt organization. Donations are tax-deductible.'
    )
  },
  // 50
  { id:50, name:'Subscription Box', category:'Retail', color:'#C026D3', accent:'#FDF4FF',
    desc:'Vibrant fuchsia for curated subscription businesses',
    type:{id:'recurring',name:'Recurring Invoice',code:'REC',color:'#C026D3',fields:[{id:'frequency',label:'Frequency',placeholder:'Monthly'},{id:'periodStart',label:'Period Start',type:'date'},{id:'periodEnd',label:'Period End',type:'date'},{id:'nextInvDate',label:'Next Invoice',type:'date'},{id:'contractId',label:'Subscription ID',placeholder:''}]},
    invoiceData: mk(
      {name:'Curate Box Co.',email:'billing@curatebox.co',phone:'+1 555-5050',address:'Brooklyn, NY 11201'},
      {name:'Fernandez Household',email:'v.fernandez@email.com',address:'Queens, NY 11101'},
      [{description:'Premium Beauty Box — Annual Plan (Monthly)',qty:12,price:39,tax:0},{description:'Welcome Gift & Loyalty Bonus',qty:1,price:25,tax:0},{description:'Shipping & Handling (Annual)',qty:12,price:5,tax:0}],
      'Auto-renews annually. Cancel anytime. Curated by industry experts.'
    )
  },
];

export const CATEGORIES = ['All', ...new Set(ALL_TEMPLATES.map(t => t.category))];
