import './style.css';
import { previewSchedule } from './schedule.js';

const form = document.querySelector('#schedule-form');
const expression = document.querySelector('#expression');
const timezone = document.querySelector('#timezone');
const count = document.querySelector('#count');
const from = document.querySelector('#from');
const runs = document.querySelector('#runs');
const status = document.querySelector('#status');

function render() {
  runs.replaceChildren();
  try {
    const result = previewSchedule(expression.value, { timezone: timezone.value, count: Number(count.value), from: from.value.trim() });
    status.className = 'status success';
    status.textContent = result.offsetChanges
      ? 'Timezone offset changes within this preview. Check execution times near DST transitions.'
      : 'Schedule validated · ' + result.runs.length + ' upcoming execution times';
    for (const [index, run] of result.runs.entries()) {
      const row = document.createElement('li');
      const number = document.createElement('span'); number.className = 'run-number'; number.textContent = String(index + 1).padStart(2, '0');
      const content = document.createElement('div'); content.className = 'run-content';
      const local = document.createElement('strong'); local.textContent = run.local;
      const utc = document.createElement('small'); utc.textContent = run.iso;
      content.append(local, utc); row.append(number, content);
      if (index && run.offset !== result.runs[index - 1].offset) {
        const badge = document.createElement('span'); badge.className = 'dst-badge'; badge.textContent = 'Offset change'; row.append(badge);
      }
      runs.append(row);
    }
  } catch (error) {
    status.className = 'status error';
    status.textContent = error instanceof Error ? error.message : 'Unable to preview this schedule.';
  }
}
form.addEventListener('submit', event => { event.preventDefault(); render(); });
document.querySelectorAll('[data-cron]').forEach(button => {
  button.addEventListener('click', () => { expression.value = button.dataset.cron; render(); });
});
render();
