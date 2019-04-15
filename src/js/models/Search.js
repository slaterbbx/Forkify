import axios from 'axios';
import { current } from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    };

    // extra API // https://spoonacular.com/food-api
    async getResults() {
        let currentKey = current;
        try {
            let res = await axios(`https://www.food2fork.com/api/search?key=${currentKey}&q=${this.query}`)
            this.result = res.data.recipes;
        } catch (error) {
            alert(`O No! ${error}`)
        }
    };
};