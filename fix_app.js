const fs = require('fs');
const path = 'c:/Users/csc/Desktop/MySite/Invoices/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// The problematic block in App.jsx (around line 693-699)
// We need to replace the too-many </div>s with the correct closure.
// Looking at the structure:
// <div (Grid-382)>
//   <div (Left-383)>
//     ... closed at 520
//   </div>
//   <div (Aside-522)>
//     ... branding box closed at 692
//   </div> (This is index 693)
// </div> (This is index 694 - Grid)
// </motion.div> (This is index 695 - Editor)

// The current file has several extra </div> tags.
// I'll look for the end of the motion.div branding block and fix what follows.

const brandingEnd = '                           </motion.div>\n                        )}\n                      </div>\n';
const targetClosure = '                    </div>\n                  </div>\n                </div>\n              </div>\n            </div>\n           </motion.div>\n         )}';

// Actually, I'll just use a more targeted replacement for the lines 693-699.
const lines = content.split('\n');
// We want to keep up to line 694 (0-indexed 693) and then the correct closures.
// Line 692 is Branding </div>.
// Line 693 should be Aside </div>.
// Line 694 should be Grid </div>.
// Line 695 should be motion.div closure.
// Line 696 should be View closure.

// From view_file 1565:
// 691:                       </div> (closes 602)
// 692:                     </div> (closes 597)
// 693:                   </div> (closes 522)
// 694:                 </div> (closes 382)
// 695:               </div> (extra)
// 696:             </div> (extra)
// 697:           </div> (extra)
// 698:         </motion.div> (closes 343)
// 699:         )} (closes 342)

const newLines = [
  ...lines.slice(0, 694), // Keep lines 1 to 694 (indices 0 to 693)
  '          </motion.div>',
  '        )}',
  ...lines.slice(699) // Keep everything from line 700 onwards
];

fs.writeFileSync(path, newLines.join('\n'), 'utf8');
console.log('App.jsx fixed successfully!');
