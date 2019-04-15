import '../sass/main.scss'; // to inject and process my scss
require("../index.html"); // to use the file-loader for my pages / content

//////////// POLYFILLS ///////////////////////
import svgxuse from 'svgxuse';
import elementClosest from 'element-closest';

//////////// LIBRARYS /////////////////////// 
// axios - used in ./models/Recipe && ./models/Search

//////////// IMPORTS FROM MODULES ////////////
// This is how you import a default, you can name it whatever you want
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
// This is how you import everything, when you have many variables etc... The name becomes an object
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
// This is how you import specific variables etc.. if you do not want to import them all
import { DOMelement, renderLoader, clearLoader } from './views/base';
import Likes from './models/Likes';



//////////////////////////////////
////////// STATE CONTROLLER //////
//////////////////////////////////

// Global state of the app
// * - Search object
// * - Current recipe object
// * - Shopping list opbject
// * - Liked recipes
const state = {
    search: { // just being explicit
        query: '',
        result: [],
    },
    recipe: { // just being explicit
        id: -1,
        result: {},
        title: '',
        author: '',
        img: '',
        url: '',
        ingredients: {}
    },
    list: { // just being explicit
        items: []
    },
};

//////////////////////////////////
/////////// MAIN CONTROLLER //////
//////////////////////////////////

// we must make this an async function so that we can use await to await the getResults because we cannot render the results on the UI until that promise returns as "resolved"
const controlSearch = async () => {
    // 1. get query from view
    const query = searchView.getInput();

    if (query) {
        // 2. New search object and add to state
        state.search = new Search(query);

        // 3. Prepare the UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(DOMelement.searchRes);
        

        // 4. Search for recipes
        await state.search.getResults(); // returns a promise, because getResults is an asyncronous method

        // 5. Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
    }

};

DOMelement.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// EVENT DELIGATION WITH CLOSEST METHOD!
// listen for bubble up
// next page / last page PAGINATION event listener.
DOMelement.searchResPages.addEventListener('click', (e) => {
    let btn = e.target.closest(".btn-inline");

    if (btn) {
        // more info on searchView.js
        // using html5 "data" attribute to give the html button a piece of information, in this case, the page number to go to
        const goToPage = parseInt(btn.dataset.gotopage, 10); // accessing the data stored in the dataset of the button in html.
        searchView.clearResults(); // if button clicked, clear results
        searchView.renderResults(state.search.result, goToPage); // use dataset html element to use renderResults funtion to target the pagination

        // NOTE: We use "clearResults" to remove the extra buttons from the page.
    }

    // // NATIVE IE11 SUPPORT WITHOUT "closest" POLYFILL
    // function findAncestor (el, cls) {
    //     while ((el === el.parentElement) && !el.classList.contains(cls));
    //     return el;

    // }
    // let buttonClicked = findAncestor(event.target, ".btn-inline")
});

//////////////////////////////////
///////// RECIPE CONTROLLER //////
//////////////////////////////////

const controlRecipe = async () => {
    // window.location is the entire URL // we can use the .hash property on it to get the hash from it.
    const id = window.location.hash.replace('#', ''); // then remove hash from ID
    // console.log(id);

    if (id) {
        recipeView.clearRecipe();
        // prepare UI for changes
        renderLoader(DOMelement.recipe); // must pass in parent location

        // highlight selected seach item
        // console.log(state.recipe);

        if (state.recipe.result !== {}) {
            searchView.clearHighlightSelected(state.recipe.id);
        }


        if (state.search.query !== '') {
            searchView.highlightSelected(id);
        }


        // create new recipe object 
        state.recipe = new Recipe(id);

        // get recipe data by calling the method from our stored recipe in the state manager object
        await state.recipe.getRecipe(); // calls the recipe using the id
        // console.log(state.recipe.ingredients); // to see original
        state.recipe.parseIngredients();
        // calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();
        // render recipe
        clearLoader();
        recipeView.renderRecipe(state.recipe,
            state.likes.isLiked(id) // will return true or false! OK!!
            );
        // console.log(state.recipe);
        // console.log(state.recipe.ingredients);
    }
};

// // call function controlRecipe when the windows "hash" changes. Cool!
// window.addEventListener('hashchange', controlRecipe);
// // call function when the page loads
// window.addEventListener('load', controlRecipe);
// Turn the two above events into 1 line using an array and a forEach
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe)); 


//////////////////////////////////
/////////// LIST CONTROLLER //////
//////////////////////////////////

const controlList = () => {
    // create a new list if there is none yet
    if (state.list.items !== []) state.list = new List();

    // add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient); // save returned item from method to 'item'
        listView.renderItem(item);
    });
};

// handle delete and update list item events
DOMelement.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid; // grabbing the ID from the html element via closest
    // console.log(id);

    if (e.target.matches('.shopping__delete, .shopping__delete *')){ // using the id if we click the delete button
        // delete from state
        state.list.deleteItem(id);

        // delete from UI
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) { 
        // read data from interface and update in our state
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
})

//////////////////////////////////
/////////// LIKE CONTROLLER //////
//////////////////////////////////

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // user has not yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // toggle the like button
        likesView.toggleLikeBtn(true);

        // add like to the UI list
        likesView.renderLike(newLike);

    // user has liked  current recipe
    } else {
        // remove like from the state
        state.likes.deleteLike(currentID);
        // toggle the like button
        likesView.toggleLikeBtn(false);

        // remove like from the UI list
        likesView.deleteLike(currentID);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
}

// INIT ON PAGE LOAD
// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
})



// EVENT DELIGATION WITH MATCHES METHOD INSTEAD OF CLOSEST!
// handling recipe button clicks
DOMelement.recipe.addEventListener('click', e => {

    if (e.target.matches('.btn-decrease, .btn-decrease *')){ // the * here is for "any child" of btn.decrease
        // decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')){ // the * here is for "any child" of btn.decrease
    // increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // like controller
        controlLike();
    }
    // console.log(state.recipe);
});