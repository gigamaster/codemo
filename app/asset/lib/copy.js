import {
  common,
  createStarryNight
}
from 'https://esm.sh/@wooorm/starry-night@3?bundle'
//from 'https://cdn.jsdelivr.net/npm/@wooorm/starry-night@3.4.0/+esm'
import {toDom} from 'https://esm.sh/hast-util-to-dom@4?bundle'

const starryNight = await createStarryNight(common)
const prefix = 'language-'

const nodes = Array.from(document.body.querySelectorAll('code'))

for (const node of nodes) {
  const className = Array.from(node.classList).find(function (d) {
    return d.startsWith(prefix)
  })
  if (!className) continue
  const scope = starryNight.flagToScope(className.slice(prefix.length))
  if (!scope) continue
  const tree = starryNight.highlight(node.textContent, scope)
  node.replaceChildren(toDom(tree, {fragment: true}))
}

// ----------------------------------------------
// Copy content in a <pre> tag to the Clipboard with JavaScript
// @author: Rezaul H Reza
// @source: https://rezaulhreza.co.uk/blog/how-to-copy-text-wrapped-in-a-pre-tag-to-the-clipboard-using-javascript
// ----------------------------------------------
function copyContent() {
    // get the pre element containing the text to be copied
    let codeBlock = this.nextSibling;
    
    // get the text to be copied
    let text = codeBlock.textContent;
    
    // copy the text to the clipboard using the clipboard API
    navigator.clipboard.writeText(text).then(function() {
        // display a message indicating that the text was copied successfully
        // alert('Text copied to clipboard');
    }, function(err) {
        // display an error message if there was a problem copying the text
        console.error('There was an error copying the text: ', err);
    });
}

// get all pre elements in the body
let codeBlocks = document.body.querySelectorAll('pre');

// add a copy button to just before each pre element
codeBlocks.forEach(function(codeBlock) {
    // create a button element
    let button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('data-btn', 'ghost');
    button.setAttribute('tabindex', '0');
    button.classList.add('absolute','top-0.5','right-1', 'dark:active:text-sky-500');
    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg><span data-label>Copy</span>';
    button.onclick = copyContent;
    
    // add the button just before the pre element
    codeBlock.parentNode.insertBefore(button, codeBlock);
});