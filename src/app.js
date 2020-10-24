import elt from './elt';
import { infer } from './infer';
import indexTemplate from './index.handlebars';

document.body.innerHTML = indexTemplate();

document.getElementById('infer-input').addEventListener('input', async e => {
  const str = e.target.value;
  const inferred = window.inferred = await infer(str);
  document.getElementById('results').textContent = Object.keys(inferred).join(', ');
})

window.infer = infer;

