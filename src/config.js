/** Все тексты и даты — правьте здесь. */

export const config = {
  bride: 'Нуржан',
  parents: 'Нурказы жана Динара',
  eventTitle: 'Кыз узатуу',
  weddingDate: '2026-10-11',
  weddingTime: '16:00',
  bridePhoto: '/photos/bride.jpg',
  venue: {
    title: 'Ресторан «Санжыра»',
    address: 'проспект Тумонбая Байзакова, 1/22',
    map: {
      lat: 40.924506,
      lon: 73.015169,
      zoom: 18,
      zoomMobile: 18,
      org: '70000001104293255',
      city: 'dzhalal-abad',
    },
  },
  letter: {
    body: 'Сиздерди кызыбыз Нуржандын кыз узатуу тоюна арналган салтанаттуу кечебизге келип, кадырлуу коногубуз болуп, ак батаңыздарды берип кетүүгө чакырабыз.',
  },
  photos: [
    { src: '/photos/child-1.png' },
    { src: '/photos/child-2.png' },
    { src: '/photos/child-3.png' },
  ],
};

export function buildVenueMapUrl() {
  const { lat, lon, zoom, zoomMobile, org, city } = config.venue.map;
  const mobile = window.matchMedia('(max-width: 480px)').matches;
  const options = {
    pos: {
      lat: lat - (mobile ? 0.00055 : 0.0004),
      lon,
      zoom: mobile ? zoomMobile : zoom,
    },
    opt: { city },
    org,
  };

  return `https://widgets.2gis.com/widget?type=firmsonmap&options=${encodeURIComponent(JSON.stringify(options))}`;
}

export function venueMapLink() {
  const { lat, lon, org, city } = config.venue.map;
  return `https://2gis.ru/${city}/firm/${org}/center/${lon},${lat}/zoom/18`;
}
