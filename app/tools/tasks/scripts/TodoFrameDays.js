import { AppIcon } from './AppIcon.js';
import { TodoDay } from './TodoDay.js';
import { TodoLogic } from './TodoLogic.js';

/**
 * @param {HTMLElement} el
 */
export function TodoFrameDays(el) {
  const RANGE = 14;
  let todoData = TodoLogic.initTodoData();

  el.innerHTML = /* html */ `
    <nav class="leftcontrols">
      <p>
        <button class="app-button rounded-md -xl backward" title="Previous day">
          <i class="app-icon" data-id="chevron-left"></i>
        </button>
      </p>
      <p>
        <button class="app-button fastbackward" title="Previous week">
          <i class="app-icon -double" data-id="chevron-left"></i>
        </button>
      </p>

    </nav>
    <div class="container"></div>
    <nav class="rightcontrols">
      <p>
        <button class="app-button rounded-md -xl forward" title="Next day">
          <i class="app-icon" data-id="chevron-right"></i>
        </button>
      </p>
      <p>
        <button class="app-button fastforward" title="Next week">
          <i class="app-icon -double" data-id="chevron-right"></i>
        </button>
      </p>

    </nav>
  `;

  setTimeout(() => el.classList.add('-animated'), 200);

  el.querySelectorAll('.app-icon').forEach(AppIcon);

  el.querySelector('.backward').addEventListener('click', () =>
    el.dispatchEvent(
      new CustomEvent('seekDays', { detail: -1, bubbles: true }),
    ),
  );

  el.querySelector('.forward').addEventListener('click', () =>
    el.dispatchEvent(new CustomEvent('seekDays', { detail: 1, bubbles: true })),
  );

  el.querySelector('.fastbackward').addEventListener('click', () =>
    el.dispatchEvent(
      new CustomEvent('seekDays', { detail: -5, bubbles: true }),
    ),
  );

  el.querySelector('.fastforward').addEventListener('click', () =>
    el.dispatchEvent(new CustomEvent('seekDays', { detail: 5, bubbles: true })),
  );



  el.addEventListener('todoData', (e) => {
    todoData = e.detail;
    update();
  });

  function update() {
    const listsByDay = TodoLogic.getTodoListsByDay(todoData, RANGE);

    const container = el.querySelector('.container');
    const obsolete = new Set(container.children);
    const childrenByKey = new Map();

    obsolete.forEach((child) => childrenByKey.set(child.dataset.key, child));

    const children = listsByDay.map((day) => {
      let child = childrenByKey.get(day.id);

      if (child) {
        obsolete.delete(child);
      } else {
        child = document.createElement('div');
        child.className = 'card todo-day';
        child.dataset.key = day.id;
        TodoDay(child);
      }

      child.dispatchEvent(new CustomEvent('todoDay', { detail: day }));
      child.style.transform = `translateX(${day.position * 100}%)`;

      return child;
    });

    obsolete.forEach((child) => container.removeChild(child));

    children.forEach((child, index) => {
      if (child !== container.children[index]) {
        container.insertBefore(child, container.children[index]);
      }
    });

    updateHeight();
  }

  function updateHeight() {
    let height = 280;
    const container = el.querySelector('.container');

    for (let i = 0, l = container.children.length; i < l; ++i) {
      height = Math.max(container.children[i].offsetHeight, height);
    }

    el.style.height = `${height + 50}px`;
  }
}
