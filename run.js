'use strict';

const dne = 10000;
const configuration = {
  keyPublishable: process.env.PUBLISHABLE_KEY || 'pk_test_DZkclA7Lk0U2szChf0u7RV8U',
  keySecret: process.env.SECRET_KEY || 'sk_test_JvHrW5FfszUh49X5eMW5ZKU5',
  port: process.env.PORT || 1111,
  dne,
  priceMultiplier: 1.022,
  priceAddition: 0.60,
  gst: 1.05,
  products: {
    'Almonds': {
      image: 'almonds.jpg',
      description: 'Unsalted classics. Roasted in Victora, BC.',
      price: 5.73,
      amount: 0,
    },
    'Cashews': {
      image: 'cashews.jpg',
      description: 'Unsalted halves and pieces. Roasted in Victoria, BC.',
      price: 8.99,
      amount: 0,
    },
    'Walnuts': {
      image: 'walnuts.jpg',
      description: 'Unsalted halves and pieces. Roasted in Victoria, BC.',
      price: 6.11,
      amount: 0,
    },
    'Raisins': {
      image: 'raisins.jpg',
      description: 'Certified Organic, Thompsons, oil free.',
      price: 2.86,
      amount: 0,
    },
    'Figs': {
      image: 'figs.jpg',
      description: 'Certified Organic, Turkish.',
      price: 7.27,
      amount: 0,
    },
    'Apricots': {
      image: 'apricots.jpg',
      description: 'Certified Organic, Turkish, Pitted, Unsulfured.',
      price: 7.66,
      amount: 0,
    }
  },
  prices: {
    'Competitors': [ 'Independent', 'Save On Foods', 'Nesters', 'Walmart' ],
    'Almonds': [ 13.06, 13.59, 15.86, 19.19 ],
    'Cashews': [ 11.35, 13.59, 17.50, 11.57 ],
    'Walnuts': [ 15.90, 10.41, 15.95, 9.09 ],
    'Raisins': [ 4.60, 9.05, 6.32, dne ],
    'Figs': [ dne, dne, 14.53, dne ],
    'Apricots': [ 12.86, 10.41, dne, 8.29 ],
  },
  forceHttps: process.env.FORCE_HTTPS || true,
};

const express = require('express');
const app = express();
app.set('view engine', 'pug');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const stripe = require("stripe")(configuration.keySecret);
const router = express.Router();

app.use(express.static('public'));

if (configuration.forceHttps) {
  app.all('*', function(req, res) {
    if (!req.connection.encrypted) {
      return res.redirect("https://" + req.headers["host"] + req.url);
    }
  });
}

app.get('/', function(req, res) {
    res.render('index', { configuration: JSON.stringify(configuration) });
});

app.post("/charge", (req, res) => {
  let amount = (getPriceFromProducts(configuration.products, req.body) * 100).toFixed(0);

  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken,
  })
  .then(customer =>
    stripe.charges.create({
      amount,
      currency: 'cad',
      description: 'Website Charge',
      customer: customer.id,
      metadata: req.body,
    }))
  .then(charge => {
    res.status(200);
    res.send({ });
  });
});

app.listen(configuration.port);
console.log(`Started on port: ${configuration.port}`);

function getPriceFromProducts(products, source) {
  const productNames = Object.keys(products);
  return productNames.map(p => {
    const units = source[p] || 0;
    const unitPrice = Math.ceil((products[p].price * configuration.priceMultiplier + configuration.priceAddition) * 10) / 10;
    
    return units * unitPrice;
  }).reduce((a, b) => a + b) * configuration.gst;
}
