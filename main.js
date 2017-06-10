const express = require('express');
const config = {
  PORT: 3000,
};

const app = express();
app.set('view engine', 'pug');
app.use(express.static(`${__dirname}/public`));
app.use('/bower_components', express.static(`${__dirname}/bower_components`));

app.get('/', (req, res) => { 
  res.render('index.pug');
});

app.listen(config.PORT, () => {
  console.log(`Squamish Trail Mix listening on port ${config.PORT}!`);
});
