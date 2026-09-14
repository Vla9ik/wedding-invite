import './styles.css';
import { inviteUrl } from './guest.js';

const input = document.querySelector('#guest-name');
const button = document.querySelector('#make-link');
const copyBtn = document.querySelector('#copy-link');
const result = document.querySelector('#make-result');

let lastUrl = '';

button.addEventListener('click', () => {
  const name = input.value.trim();
  if (!name) {
    input.focus();
    return;
  }

  lastUrl = inviteUrl(name);
  result.hidden = false;
  result.innerHTML = `<a href="${lastUrl}">${lastUrl}</a>`;
  copyBtn.hidden = false;
  copyBtn.textContent = 'Скопировать ссылку';
});

copyBtn.addEventListener('click', async () => {
  if (!lastUrl) return;

  try {
    await navigator.clipboard.writeText(lastUrl);
    copyBtn.textContent = 'Скопировано';
    window.setTimeout(() => {
      copyBtn.textContent = 'Скопировать ссылку';
    }, 1600);
  } catch {
    input.focus();
  }
});
