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
    },
  },
});
