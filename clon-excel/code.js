const $ = (el) => document.querySelector(el)
const $$ = (el) => document.querySelectorAll(el)

const ROWS = 10
const COLUMNS = 10
const FIRST_CHAR_CODE = 65

const $table = $('table')
const $head = $('thead')
const $body = $('tbody')

const range = (length) => Array.from({ length }, (_, i) => i)
const getColumn = (i) => String.fromCharCode(FIRST_CHAR_CODE + i)

let STATE = range(COLUMNS).map((i) =>
  range(ROWS).map((j) => ({ computedValue: j, value: j }))
)

const renderSpreadSheet = () => {
  const headerHTML = `<tr>
  <th></th>
  ${range(COLUMNS)
    .map((i) => `<th>${getColumn(i)}</th>`)
    .join('')}
  </tr>`
  $head.innerHTML = headerHTML

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
    </tr>`
    })
    .join('')

  $body.innerHTML = bodyHTML
}

$body.addEventListener('click', (event) => {
  const td = event.target.closest('td')
  if (!td) return

  const { x, y } = td.dataset
  const input = td.querySelector('input')
  const span = td.querySelector('span')

  const end = input.value.length
  input.setSelectionRange(end, end)
  input.focus()

  input.addEventListener(
    'blur',
    () => {
      console.log({ value: input.value, state: STATE[x][y].value })

      if (input.value === STATE[x][y].value) return

      updateCell({ x, y, value: input.value })
    },
    { once: true }
  )
})

renderSpreadSheet()
