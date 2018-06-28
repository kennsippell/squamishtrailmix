'use strict';

const dne = 10000;
const productLine = {
  dne,
  priceMultiplier: 1.029,
  priceAddition: 0.30,
  gst: 1.0,
  products: {
    'Squamix': {
      image: 'squamix.jpg',
      description: 'Mix of Almonds, Cashews, Walnuts, Apricots, Figs, Raisins.',
      price: 8.90,
      amount: 0,
      isMix: true,
    },
    'ChiefsNuts': {
      name: "The Chief's Nuts",
      image: 'chiefsnuts.jpg',
      description: 'Mix of Almonds, Cashews, Walnuts.',
      price: 8.90,
      amount: 0,
      isMix: true,
    },
    'Roasted Almonds': {
      image: 'almonds.jpg',
      description: 'Unsalted classics. Roasted in Victora, BC.',
      price: 5.73,
      amount: 0,
    },
    'Raw Almonds': {
      image: 'almonds.jpg',
      description: 'Unsalted classics.',
      price: 4.70,
      amount: 0,
    },
    'Cashews': {
      image: 'cashews.jpg',
      description: 'Unsalted whole. Roasted in Victoria, BC.',
      price: 8.99,
      amount: 0,
    },
    'Walnuts': {
      image: 'walnuts.jpg',
      description: 'Unsalted halves. Roasted in Victoria, BC.',
      price: 4.25,
      amount: 0,
    },
    'Apricots': {
      image: 'apricots.jpg',
      description: 'Certified Organic, Turkish, Pitted, Unsulfured.',
      price: 7.72,
      amount: 0,
      isOrganic: true,
    },
    'Figs': {
      image: 'figs.jpg',
      description: 'Certified Organic, Turkish.',
      price: 7.26,
      amount: 0,
      isOrganic: true,
    },
    'Cranberries': {
      image: 'cranberries.jpg',
      outOfStock: true,
      description: 'Certified Organic, cane juice sweetened.',
      price: 7.16,
      amount: 0,
      isOrganic: true,
    },
    'Raisins': {
      image: 'raisins.jpg',
      description: 'Certified Organic, Thompsons, oil free.',
      price: 2.86,
      amount: 0,
      isOrganic: true,
    },
  },
  prices: {
    'Competitors': [ 'Independent', 'Save On Foods', 'Nesters', 'Walmart' ],
    'Almonds': [ 7.99, 13.59, 15.86, 19.19 ],
    'Cashews': [ 11.35, 13.59, 17.50, 11.57 ],
    'Walnuts': [ 15.90, 10.41, 15.95, 9.09 ],
    'Raisins': [ 4.60, 9.05, 6.32, dne ],
    'Figs': [ 9.96, dne, 14.53, dne ],
    'Apricots': [ 6.32, 10.41, dne, 8.29 ],
    'Dates': [ 2.72, dne, dne, dne ],
  },
};

if (typeof window !== 'undefined') window.productLine = productLine;
if (typeof module !== 'undefined') module.exports = productLine;
