import './styles.css';
import { inviteUrl } from './guest.js';

const input = document.querySelector('#guest-name');
const button = document.querySelector('#make-link');
const result = document.querySelector('#make-result');

button.addEventListener('click', async () => {
  const name = input.value.trim();
  if (!name) {
    input.focus();
    return;
  }

  const url = inviteUrl(name);
  result.hidden = false;
  result.innerHTML = `<a href="${url}">${url}</a>`;

  try {
    await navigator.clipboard.writeText(url);
    result.insertAdjacentText('beforeend', ' — скопировано');
  } catch {
    /* гость скопирует вручную */
  }
});
