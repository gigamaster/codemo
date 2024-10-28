import { AppIcon } from './AppIcon.js';

/**
 * @param {HTMLElement} el
 */
export function TodoItemInput(el) {
  let saveOnBlur = true;

  el.innerHTML = /* html */ `
    <input type="text" class="input use-focus-other" aria-label="Label">
    <button class="app-button save" title="Save">
      <i class="app-icon" data-id="plus"></i>
    </button>
  `;

  const inputEl = el.querySelector('.input');
  const saveEl = el.querySelector('.save');

  el.querySelectorAll('.app-icon').forEach(AppIcon);

  inputEl.addEventListener('keyup', (e) => {
    switch (e.keyCode) {
      case 13: // Enter
        save();
        break;
      case 27: // Escape
        clear();
        break;
    }
  });

  inputEl.addEventListener('blur', () => {
    if (saveOnBlur) save();
    saveOnBlur = true;
  });

  inputEl.addEventListener('focusOther', save);

  saveEl.addEventListener('mousedown', () => {
    saveOnBlur = false;
  });

  saveEl.addEventListener('click', () => {
    save();
    inputEl.focus();
  });

  function save() {
    const label = inputEl.value.trim();

    if (label === '') return;

    inputEl.value = '';

    el.dispatchEvent(
      new CustomEvent('addTodoItem', {
        detail: { label },
        bubbles: true,
      }),
    );
  }

  function clear() {
    inputEl.value = '';
    inputEl.blur();
  }
}
