const fs = require('fs');
const filePath = 'c:/Users/csc/Desktop/MySite/Invoices/src/App.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const brokenMapping = `{['left', 'center', 'right'].map(pos => (
                                      </button>
                                    ))}`;

const fixedMapping = `{['left', 'center', 'right'].map(pos => (
                                      <button 
                                        key={pos}
                                        onClick={() => handleBrandingChange('logoPos', pos)}
                                        className={\`py-2 text-[9px] font-bold uppercase rounded-xl border transition-all \${invoiceData.branding.logoPos === pos ? 'bg-text-primary text-white border-text-primary shadow-lg' : 'bg-white text-text-muted border-border-light hover:border-primary/30'}\`}
                                      >
                                        {pos}
                                      </button>
                                    ))}`;

// We'll use a more flexible replacement in case indentation slightly varies
const lines = content.split('\n');
let fixedLines = [];
let found = false;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("{['left', 'center', 'right'].map(pos => (") && 
        lines[i+1] && lines[i+1].includes("</button>") && 
        lines[i+2] && lines[i+2].includes("))}") && !found) {
        
        const indent = lines[i].match(/^\s*/)[0];
        const innerIndent = indent + "  ";
        
        fixedLines.push(lines[i]);
        fixedLines.push(innerIndent + "<button ");
        fixedLines.push(innerIndent + "  key={pos}");
        fixedLines.push(innerIndent + "  onClick={() => handleBrandingChange('logoPos', pos)}");
        fixedLines.push(innerIndent + "  className={`py-2 text-[9px] font-bold uppercase rounded-xl border transition-all ${invoiceData.branding.logoPos === pos ? 'bg-text-primary text-white border-text-primary shadow-lg' : 'bg-white text-text-muted border-border-light hover:border-primary/30'}`}");
        fixedLines.push(innerIndent + ">");
        fixedLines.push(innerIndent + "  {pos}");
        fixedLines.push(innerIndent + "</button>");
        fixedLines.push(lines[i+2]);
        
        i += 2; // skip the next two lines we just replaced
        found = true;
    } else {
        fixedLines.push(lines[i]);
    }
}

if (found) {
    fs.writeFileSync(filePath, fixedLines.join('\n'), 'utf8');
    console.log("Successfully fixed branding buttons in App.jsx");
} else {
    console.log("Could not find the target code to fix.");
}
