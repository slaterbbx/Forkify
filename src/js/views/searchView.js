import { DOMelement } from './base';


export const getInput = () => DOMelement.searchInput.value;
export const clearInput = function(){ DOMelement.searchInput.value = ''; }; // used standard function to prevent implicit return from happening
export const clearResults = () => {
    DOMelement.searchResultList.innerHTML = '';
    // this is the div that holds the buttons for pagination, so we empty it
    DOMelement.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active'); // using css all selector for all "a" = links with #id
};

export const clearHighlightSelected = previousId => {
    if ( document.querySelector(`a[href="#${previousId}"]`) ) {
        document.querySelector(`a[href="#${previousId}"]`).classList.remove('results__link--active');    
    }
};

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        const split = title.split(' ');
      if (split[0].length > limit){
            return `${split[0]} ...`;
        }
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
        // this is an example of the accumulator
        split.reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0)
        return `${newTitle.join(' ')} ...`;
    }
    return title;
};

const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    DOMelement.searchResultList.insertAdjacentHTML('beforeend', markup);
};

// type : 'prev' or 'next'
// using html5 "data" attribute to give the html button a piece of information, in this case, the page number to go to
const createButton = function(page, type) {
    // cannot use CAPITAL letters in the data attribute for some reason if we want to call it in js
return `<div class="btn-inline results__btn--${type}" data-gotopage="${type === 'prev' ? page - 1 : page + 1}">
            <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
            </svg>
        </div>`;
}

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if (page === 1 && pages > 1) {
        // button to next page only
        button = createButton(page, 'next');
    } else if (page < pages) {
        // both buttons // using a template string to send in both
        button = `${createButton(page, 'next')}${createButton(page, 'prev')}`;
    } else if (page === pages && pages > 1) {
        // only button to go to previous page
        button = createButton(page, 'prev');
    }

    DOMelement.searchResPages.insertAdjacentHTML('afterbegin', button);
};

// This function is executed in the main controller in index.js
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    // use slice to segment up our results
    recipes.slice(start, end).forEach(renderRecipe); // this will simply use the foreach without the callback function because it will pass in the current recipe in the array.

    renderButtons(page, recipes.length, resPerPage);
};