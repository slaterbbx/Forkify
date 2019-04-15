export const DOMelement = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResultList: document.querySelector('.results__list'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')

};

const DOMelementStrings = {
    loader: 'loader',
}

// we want to pass in the parent so we can attach it to that and re use this around the page
export const renderLoader = parent => {
    const loader = `
    <div class="${DOMelementStrings.loader}">
        <svg>
            <use href="../img/icons.svg#icon-cw"></use>
        </svg>
    </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${DOMelementStrings.loader}`);
    if (loader) {
        loader.parentElement.removeChild(document.querySelector(`.${DOMelementStrings.loader}`));
    }
};