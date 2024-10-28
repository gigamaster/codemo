// export const BASE_URL =
  export const BASE_URL ='https://api.iconify.design';
  const iconset = 'tabler';
  const iconH = '16';
  const cache = {};
/**
 * iconify options
 * https://iconify.design/docs/usage/svg/no-code/
 */
/**
 * @param {HTMLElement} el
 */
export function AppIcon(el) {
  if (el.children.length > 0) return;

  const id = el.dataset.id;
  let promise = cache[id];

  if (!promise) {
    promise = cache[id] = fetch(`${BASE_URL}/${iconset}/${id}.svg?height=${iconH}`).then((r) => r.text());
  }

  promise.then((svg) => {
    el.innerHTML = el.classList.contains('-double') ? svg + svg : svg;
  });
}
