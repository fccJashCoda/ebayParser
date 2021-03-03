// const API_URL = 'http://localhost:3100/search/';
const API_URL = 'http://localhost:3100/search/v2/';

const app = new Vue({
  el: '#app',
  data: {
    term: '',
    terms: [],
    activeTerm: null,
    activeResults: [],
    loading: false,
  },
  mounted() {
    if (localStorage.terms) {
      this.terms = JSON.parse(localStorage.getItem('terms'));
    }
  },
  methods: {
    addTerm() {
      if (this.term) {
        this.terms = [...this.terms, this.term];
        this.term = '';

        if (this.terms.length > 10) {
          this.terms = this.terms.splice(1);
        }

        localStorage.setItem('terms', JSON.stringify(this.terms));
      }
    },
    setActiveTerm(term) {
      this.loading = true;
      this.activeTerm = term;

      const url = `${API_URL}${term}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          this.activeResults = data.results;
          setTimeout(() => {
            this.loading = false;
          }, 500);
        });
    },
    clearTerms() {
      this.terms = this.terms.slice(-1);
      localStorage.setItem('terms', JSON.stringify(this.terms));
    },
  },
});
