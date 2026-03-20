const fs = require('fs');
const path = 'c:/Users/csc/Desktop/MySite/Invoices/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// Use a regex to find the broken branding button map
// It looks like: {['left', 'center', 'right'].map(pos => (\n  </button>\n))}
const regex = /\{\s*\[\s*'left'\s*,\s*'center'\s*,\s*'right'\s*\]\.map\(\s*pos\s*=>\s*\(\s*\r?\n\s+<\/button>\s*\)\)\}/g;

const replacement = `{['left', 'center', 'right'].map(pos => (
                                      <button 
                                        key={pos}
                                        onClick={() => handleBrandingChange('logoPos', pos)}
                                        className={\`py-2 text-[9px] font-bold uppercase rounded-xl border transition-all \${invoiceData.branding.logoPos === pos ? 'bg-text-primary text-white border-text-primary shadow-lg' : 'bg-white text-text-muted border-border-light hover:border-primary/30'}\`}
                                      >
                                        {pos}
                                      </button>
                                    ))}`;

content = content.replace(regex, replacement);

fs.writeFileSync(path, content, 'utf8');
console.log('App.jsx fixed successfully!');
