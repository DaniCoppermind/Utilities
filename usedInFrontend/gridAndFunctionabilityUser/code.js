const $ = (el) => document.querySelector(el);
const $$ = (el) => document.querySelectorAll(el);

const ROWS = 10;
const COLUMNS = 5;
const FIRST_CHAR_CODE = 65;

const $table = $('table');
const $head = $('thead');
const $body = $('tbody');

const range = (length) => Array.from({ length }, (_, i) => i);
const getColumn = (i) => String.fromCharCode(FIRST_CHAR_CODE + i);

let STATE = range(COLUMNS).map((i) =>
  range(ROWS).map((j) => ({ computedValue: j, value: j }))
);

const renderSpreadSheet = () => {
  const headerHTML = `<tr>
  <th></th>
  ${range(COLUMNS)
    .map((i) => `<th>${getColumn(i)}</th>`)
    .join('')}
  </tr>`;
  $head.innerHTML = headerHTML;

  const bodyHTML = range(ROWS)
    .map((row) => {
      return `<tr>
    <td>${row + 1}</td>
    ${range(COLUMNS)
      .map(
        (column) => `
      <td data-x="${column}" data-y="${row}">
      <span>${STATE[column][row].computedValue}</span>
      <input type="text" value="${STATE[column][row].value}" />
      </td>
      `
      )
      .join('')}
    </tr>`;
    })
    .join('');

  $body.innerHTML = bodyHTML;
};

function updateCell({ x, y, value }) {
  const newState = structuredClone(STATE);
  const constants = generateCellsConstans(newState);
  const cell = newState[x][y];

  cell.computedValue = computeValue(value, constants);
  cell.value = value;

  newState[x][y] = cell;

  STATE = newState;

  renderSpreadSheet();
}

function generateCellsConstans(cells) {
  return cells
    .map((rows, x) => {
      return rows
        .map((cell, y) => {
          const letter = getColumn(x); // => A
          const cellId = `${letter}${y + 1}`; // => A1
          return `const ${cellId} = ${cell.computedValue};`;
        })
        .join('\n');
    })
    .join('\n');
}

function computeValue(value, constants) {
  if (!value.startsWith('=')) return value;

  const formula = value.slice(1);

  let computedValue;
  try {
    computedValue = eval(`(() => {
      ${constants}
      return ${formula};
    })()`); // no recomendado
  } catch (e) {
    computedValue = `Error: ${e.message}`;
  }
  return computedValue;
}

$body.addEventListener('click', (event) => {
  const td = event.target.closest('td');
  if (!td) return;

  const { x, y } = td.dataset;
  const input = td.querySelector('input');
  const span = td.querySelector('span');

  const end = input.value.length;
  input.setSelectionRange(end, end);
  input.focus();

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') input.blur();
  });

  input.addEventListener(
    'blur',
    () => {
      console.log({ value: input.value, state: STATE[x][y].value });

      if (input.value === STATE[x][y].value) return;

      updateCell({ x, y, value: input.value });
    },
    { once: true }
  );
});

renderSpreadSheet();
