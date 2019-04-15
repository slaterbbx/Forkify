import axios from 'axios';
import { current } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        let currentKey = current;
        try {
            let res = await axios(`https://www.food2fork.com/api/get?key=${currentKey}&rId=${this.id}`);
            this.result = res.data.recipe;
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
            // console.log(res);
        } catch (error) {
            alert(error);
        }
    }

    calcTime() {
        // assuming that we need 15 mins for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        // we are using these to swap the array cases // plural first so we do not get s's left behind.
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        // using es6 destructuring 
        const units = [...unitsShort, 'kg', 'g'] // used for unitIndex so we can recognize kg and g also

        const newIngrediants = this.ingredients.map(el => {
            // uniform units
            // lowercase each ingredient so that we have less scenerios to deal with
            let ingredient = el.toLowerCase();
            // loop through the unitsLong and check if any of our ingredients match the unitsLong array items
            unitsLong.forEach((c, i) => {
                // if any match the unitsLong array items, replace it with the corrisponding unitsShort array element in the same index
                ingredient = ingredient.replace(c, unitsShort[i]);
            });
            // remove parantheses
            // https://regexr.com/
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // parse ingredients into count, unit and ingredient
            // first with split the ingrediants into an array by splitting the string where ever there is a space.
            const arrIng = ingredient.split(' ');
            // findIndex requires a callback function vs IndexOf which looks based on a known param / argument
            // findindex will go through our new "array" from the string and compare it to unitsShort, if we have something that matches, .inclues tells us at what index it was found.
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng; // this will be the final object that we return
            // if it was -1 then it means that it couldnt find the element, non found indexes are -1
            if (unitIndex > -1) {
                // there is a unit
                // EX 4 1/2 cups, arrCount is [4, 1/2] // innitially strings
                // EX 4 cups, arrCount is [4] // innitially strings
                const arrCount = arrIng.slice(0, unitIndex); // everything before the unit is the quantity of unit for recipe

                let count;
                if (arrCount.length === 1) {
                    // in the event that the recipe has something like 1-1/2 cups for example
                    count = eval(arrIng[0].replace('-', '+')); // if there is a - replace with a + for the evaluation to work
                } else {
                     // this will take our example above ( 4 1/2 ) and turn it into 4+1/2 and then eval() will do the math and make it 4.5
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count, // count = count
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')

                }
            } else if (parseInt(arrIng[0], 10)) { // so if the first element is a number, this will be true
                // there is no unit, but first element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ') // full array except first element / then rejoin array into string
                }
            } else if (unitIndex === -1) {
                // there is NO unit and NO number in first position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient // in es6, we can just put the variable with the same name in the key position to assign "ingrediant: ingrediant"
                }
            }

            return objIng;
        });
        this.ingredients = newIngrediants;
    }

    updateServings(type) {

        // servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1; 

        // ingredients
        this.ingredients.forEach (ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;

    }
}