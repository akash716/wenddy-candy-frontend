let offers = [];

export const getOffers = () => {
  return offers;
};

export const saveOffer = (offer) => {
  offer.id = Date.now();
  offers.push(offer);
};

export const updateOffer = (updated) => {
  offers = offers.map(o => (o.id === updated.id ? updated : o));
};

export const deleteOffer = (id) => {
  offers = offers.filter(o => o.id !== id);
};
