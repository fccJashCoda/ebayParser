const API_URL = 'http://localhost:3100/search/';
const API_TEST = 'http://localhost:3100';

const app = new Vue({
  el: '#app',
  data: {
    term: '',
    terms: [],
    activeTerm: null,
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
      fetch(API_TEST)
        .then((res) => res.json())
        .then((data) => console.log(data));
    },
  },
});
