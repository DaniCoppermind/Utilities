const $ = (el) => document.querySelector(el);

const $time = $('time');
const $paragraph = $('p');
const $input = $('input');

const INITAL_TIME = 30;

const TEXT =
  'the quick brown fox jumped over the lazy dog daniel is trying to eat his dog and finally becomes the dog that';

let words = [];
let currentTime = INITAL_TIME;

initGame();
initEvents();

function initGame() {
  words = TEXT.split(' ').slice(0, 32);
  currentTime = INITAL_TIME;

  $time.textContent = currentTime;

  $paragraph.innerHTML = words
    .map((word, index) => {
      const letters = word.split('');

      return `<word>
      ${letters.map((letter) => `<letter>${letter}</letter>`).join('')}
    </word>`;
    })
    .join('');

  const $firstWord = $paragraph.querySelector('word');
  $firstWord.classList.add('active');
  $firstWord.querySelector('letter').classList.add('active');

  const intervalId = setInterval(() => {
    currentTime--;
    $time.textContent = currentTime;

    if (currentTime === 0) {
      clearInterval(intervalId);
      gameOver();
    }
  }, 1000);
}

function initEvents() {
  document.addEventListener('keydown', () => {
    $input.focus();
  });
  $input.addEventListener('keydown', onKeyDown);
  $input.addEventListener('keyup', onKeyUp);
}

function onKeyDown() {}

function onKeyUp() {
  // recuperar los elementos actuales
  const $currentWord = $paragraph.querySelector('word.active');
  const $currentLetter = $currentWord.querySelector('letter.active');

  const currentWord = $currentWord.innerText.trim();
  $input.maxLength = currentWord.length;

  const $allLetters = $currentWord.querySelectorAll('letter');

  $allLetters.forEach(($letter) =>
    $letter.classList.remove('correct', 'incorrect')
  );

  $input.value.split('').forEach((char, index) => {
    const $letter = $allLetters[index];
    const letterToCheck = currentWord[index];

    const isCorrect = char === letterToCheck;
    const letterClass = isCorrect ? 'correct' : 'incorrect';
    $letter.classList.add(letterClass);
  });

  $currentLetter.classList.remove('active', 'is-last');
  const inputLength = $input.value.length;
  const $nextActiveLetter = $allLetters[inputLength];

  if ($nextActiveLetter) {
    $allLetters[inputLength].classList.add('active');
  } else {
    $currentLetter.classList.add('active', 'is-last');
    // TODO: gameover 
  }
}

function gameOver() {}
