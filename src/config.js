/** Все тексты и даты — правьте здесь. */

export const config = {
  bride: 'Нуржан',
  parents: 'Нурказы жана Динара',
  phone: '+996 775 225 325',
  phoneHref: 'tel:+996775225325',
  eventTitle: 'Кыз узатуу',
  weddingDate: '2026-10-11',
  weddingTime: '16:00',
  bridePhoto: '/photos/bride.jpg',
  venue: {
    title: 'Ак-Орго',
    address: 'улица Бекмамата Осмонова, 82, Манас',
    map: {
      lat: 40.944822,
      lon: 72.989005,
      zoom: 18,
      zoomMobile: 18,
      org: '70000001084034946',
      city: 'dzhalal-abad',
      link: 'https://2gis.kg/bishkek/geo/70000001084034946',
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
  if (config.venue.map.link) return config.venue.map.link;
  const { lat, lon, org, city } = config.venue.map;
  return `https://2gis.kg/${city}/firm/${org}/center/${lon},${lat}/zoom/18`;
}
