const MONTHS = [
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
];

const DOW = ['дш', 'шш', 'шр', 'бш', 'жм', 'иш', 'жк'];

function mondayIndex(jsDay) {
  return (jsDay + 6) % 7;
}

export function prettyDate(iso) {
  const date = new Date(`${iso}T12:00:00`);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}-жыл`;
}

export function numericDate(iso) {
  const date = new Date(`${iso}T12:00:00`);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${date.getFullYear()}`;
}

export function renderCalendar(root, iso) {
  const date = new Date(`${iso}T12:00:00`);
  const year = date.getFullYear();
  const month = date.getMonth();
  const mark = date.getDate();
  const first = new Date(year, month, 1);
  const days = new Date(year, month + 1, 0).getDate();
  const offset = mondayIndex(first.getDay());

  const cells = [];
  for (let i = 0; i < offset; i += 1) cells.push('<span></span>');
  for (let day = 1; day <= days; day += 1) {
    const marked = day === mark;
    cells.push(
      `<span class="cal-day${marked ? ' is-mark' : ''}"><span>${day}</span>${
        marked
          ? `<svg class="heart-ring" viewBox="0 0 32 28"><path d="M16 25C6 18 2 12 2 8a6 6 0 0112-3 6 6 0 0112 3c0 4-4 10-14 17z"/></svg>`
          : ''
      }</span>`,
    );
  }

  root.innerHTML = `
    <p class="cal-month">${MONTHS[month]} ${year}-жыл</p>
    <div class="cal-grid">
      ${DOW.map((d) => `<span class="cal-dow">${d}</span>`).join('')}
      ${cells.join('')}
    </div>
  `;
}
