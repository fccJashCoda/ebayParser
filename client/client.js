const API_URL = 'http://localhost:3100/search/';
// const API_TEST = 'http://localhost:3100';

const app = new Vue({
  el: '#app',
  data: {
    term: '',
    terms: [],
    activeTerm: null,
    activeResults: [],
  },
  methods: {
    addTerm() {
      if (this.term) {
        this.terms = [...this.terms, this.term];
        this.term = '';
      }
    },
    setActiveTerm(term) {
      this.activeTerm = term;
      const url = `${API_URL}${term}`;
      console.log(url);
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          this.activeREsults = data.results;
          console.log(data.results);
        });
    },
  },
});
