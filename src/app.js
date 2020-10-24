import elt from './elt';
import { infer } from './infer';
import { render } from './renderers';
import indexTemplate from './index.handlebars';

document.body.innerHTML = indexTemplate();

document.getElementById('infer-input').addEventListener('input', async e => {
  const str = e.target.value;
  const inferred = window.inferred = await infer(str);
  const resultsEl = document.getElementById('results');
  resultsEl.innerHTML = '';
  Object.keys(inferred).forEach(parser => {
    const value = inferred[parser];
    results.innerHTML += render(value, parser);
  });
})

window.infer = infer;
