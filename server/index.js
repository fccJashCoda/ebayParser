const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fetch = require('node-fetch');
const jsdom = require('jsdom');

const app = express();
const port = process.env.PORT || 3100;
const { JSDOM } = jsdom;

app.use(cors());
app.use(morgan('tiny'));

// improving the cache:
// transform the cache in an array of objects
// eache object has a search term, a date, and results
// when a search query is done, we first check if the term is in the array and
// if the data is fresh enough not to be refetched
// if refetched, update the item in the cache array
const cache = {
  search_term: '',
  date: 0,
  body: null,
  results: null,
};

function getResults(body) {
  const dom = new JSDOM(body);
  const rows = dom.window.document.querySelectorAll('.s-item__wrapper');
  const results = [];

  rows.forEach((element) => {
    if (element) {
      let title = element.querySelector('h3.s-item__title');
      let price = element.querySelector('.s-item__price');
      let link = element.querySelector('.s-item__link');
      let image = element.querySelector('.s-item__image-img');

      if (title) {
        title = title.textContent.slice(11);
      }
      if (price) {
        price = price.textContent;
      }
      if (image) {
        image = image.src;
      }
      if (link) {
        link = link.href;
      }

      if (!title) return;

      results.push({
        title: title || '',
        price: price || '',
        image: image || '',
        link: link || '',
      });
    }
  });

  return results;
}

app.get('/', (req, res) => {
  res.json({ message: 'hello world! 👌' });
});

// https://www.ebay.com/sch/i.html?_from=R40&_nkw=humbucker&_sacat=0&LH_TitleDesc=0&_sop=10
app.get('/search/:search_term', (req, res) => {
  const { search_term } = req.params;
  const url = `https://www.ebay.com/sch/i.html?_from=R40&_nkw=${search_term}&_sacat=0&LH_TitleDesc=0&_sop=10`;

  const date = new Date().getTime();

  if (cache.search_term === search_term && date - 1200 * 1000 < cache.date) {
    console.log('serving cached data');
    res.json({ results: cache.results });
  } else {
    console.log('fetching new data');
    fetch(url)
      .then((response) => response.text())
      .then(async (body) => {
        const results = getResults(body);

        cache.search_term = search_term;
        cache.date = date;
        cache.body = body;
        cache.results = results;

        res.json({
          results,
        });
      });
  }
});

app.use((req, res, next) => {
  const error = new Error('Not Found');
  res.status(404);
  next(error);
});

app.use((error, req, res, next) => {
  res.status(res.statusCode || 500);
  res.json({
    message: error.message,
  });
});

app.listen(port, () => console.log(`Listenting on port ${port}...`));
