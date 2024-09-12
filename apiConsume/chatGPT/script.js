const $ = (el) => document.querySelector(el);

const $form = $('form');
const $input = $('input');
const $template = $('#message-template');
const $messages = $('ul');
const $container = $('main');
const $button = $('button');

$form.addEventListener('submit', (e) => {
  e.preventDefault();
  const messageText = $input.value.trim();

  if (messageText !== '') {
    // añadimos el mensaje en el DOM
    $input.value = '';
  }

  addMessage(messageText, 'user');
  $button.setAttribute('disabled', true);

  setTimeout(() => {
    addMessage('Ola k ase', 'bot');
    $button.removeAttribute('disabled');
  }, 2000);
});

function addMessage(text, sender) {
  // Clonamos el template
  const clonedTemplate = $template.content.cloneNode(true);
  const $newMessage = clonedTemplate.querySelector('.message');

  const $who = $newMessage.querySelector('span');
  const $text = $newMessage.querySelector('p');

  $text.textContent = text;
  $who.textContent = sender === 'bot' ? 'GPT' : 'Tú';
  $newMessage.classList.add(sender);

  $messages.appendChild($newMessage);

  // // Actualizar el scroll
  $container.scrollTop = $container.scrollHeight;
}
