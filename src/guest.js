export function readGuest() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('to') || params.get('guest') || '';
  const name = raw.trim();

  if (!name) {
    return {
      name: '',
      many: true,
      greeting: 'Дорогие гости',
      ask: 'Дорогие гости',
      hello: 'Дорогие гости',
    };
  }

  const many = / и | & |,/i.test(name);
  return {
    name,
    many,
    greeting: many ? `Дорогие ${name}` : name,
    ask: name,
    hello: many ? `Дорогие ${name}` : name,
  };
}

export function inviteUrl(name) {
  const url = new URL('/', window.location.origin);
  url.searchParams.set('to', name.trim());
  return url.href;
}
