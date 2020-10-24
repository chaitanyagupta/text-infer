import elt from './elt';
import { infer } from './infer';
import { html, render } from 'lit-html';
import { toBinaryString } from './utils';
import * as encoding from './encoding';


const template = (results) =>  html`
<h1>text-infer</h1>

<label for="infer-input">Enter a value</label>
<br>
<textarea id="infer-input" rows="10" cols="80"></textarea>

<div id="results">${results}</div>
`

render(template([]), document.body);

document.getElementById('infer-input').addEventListener('input', e => {
  const str = e.target.value;
  const inferred = window.inferred = infer(str);
  render(template(inferred), document.body);
})

window.infer = infer;

window.toBinaryString = toBinaryString;
