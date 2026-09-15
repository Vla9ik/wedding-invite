export function readGuest() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('to') || params.get('guest') || '';
  const name = raw.trim();

  if (!name) {
    return {
      name: '',
      many: true,
      greeting: 'Урматтуу коноктор',
      ask: 'Урматтуу коноктор',
      hello: 'Урматтуу коноктор',
    };
  }

  const many = / и | & |,/i.test(name);
  return {
    name,
    many,
    greeting: many ? `Урматтуу ${name}` : name,
    ask: name,
    hello: many ? `Урматтуу ${name}` : name,
  };
}

export function inviteUrl(name) {
  const url = new URL('/', window.location.origin);
  url.searchParams.set('to', name.trim());
  return url.href;
}
