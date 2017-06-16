'use strict';

const productLine = require('./public/js/productLine.js');

const configuration = {
  keyPublishable: process.env.PUBLISHABLE_KEY || 'pk_test_DZkclA7Lk0U2szChf0u7RV8U',
  keySecret: process.env.SECRET_KEY || 'sk_test_JvHrW5FfszUh49X5eMW5ZKU5',
  port: process.env.PORT || 1212,
  forceHttps: process.env.FORCE_HTTPS || false,
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
  app.use((req, res, next) => {
    if (!req.get('x-arr-ssl')) {
      return res.redirect("https://" + req.get('host') + req.url);
    }

    next();
  });
}

app.get('/', function(req, res) {
    res.render('index', { keyPublishable: configuration.keyPublishable });
});

app.post("/charge", (req, res) => {
  let amount = (getPriceFromProducts(productLine.products, req.body) * 100).toFixed(0);

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
    const unitPrice = Math.ceil((products[p].price * productLine.priceMultiplier + productLine.priceAddition) * 10) / 10;
    
    return units * unitPrice;
  }).reduce((a, b) => a + b) * productLine.gst;
}
