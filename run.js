'use strict';

const keyPublishable = process.env.PUBLISHABLE_KEY || 'pk_test_DZkclA7Lk0U2szChf0u7RV8U';
const keySecret = process.env.SECRET_KEY || 'sk_test_JvHrW5FfszUh49X5eMW5ZKU5';

const express = require('express');
const app = express();
app.set('view engine', 'pug');
const stripe = require("stripe")(keySecret);
const router = express.Router();

app.use(express.static('public'));
app.get('/', function(req, res) {
    res.render('index');
});

app.listen(process.env.PORT || 3000);
