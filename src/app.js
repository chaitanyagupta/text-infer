import elt from './elt';
import { infer } from './infer';
import { render } from './renderers';
import indexTemplate from './index.handlebars';
import renderContainerTemplate from './renderers/container.handlebars';

function init() {
  document.body.innerHTML = indexTemplate();

  const inferInput = document.getElementById('infer-input')

  const processInput = async function() {
    const str = inferInput.value
    if (str) {
      window.location.hash = '#value=' + encodeURIComponent(str);
    } else {
      window.location.hash = '';
    }
    const inferred = window.inferred = await infer(str);
    console.log('inferred', inferred);
    window.inferred = inferred;
    const resultsEl = document.getElementById('results');
    resultsEl.innerHTML = '';
    Object.keys(inferred).forEach(parser => {
      const value = inferred[parser];
      results.innerHTML += renderContainerTemplate({ 
        parser: parser,
        rendered: render(value, parser) 
      });
    });
  }

  inferInput.addEventListener('input', processInput)

  if (window.location.hash) {
    const hashParams = new URLSearchParams(window.location.hash.slice(1))
    const inferValue = hashParams.get('value');
    if (inferValue) {
      inferInput.value = inferValue;
      processInput();
    }
  }
  inferInput.focus();
}

init();
