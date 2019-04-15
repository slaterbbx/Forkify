import { DOMelement } from './base';
import { limitRecipeTitle } from './searchView';

export const toggleLikeBtn = isLiked => { // we are passing in "true" or "false"

    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    // chainging the attribute based on the recipe__love clase and the use element within that, then the attribute href gets changed
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);

};

export const toggleLikeMenu = numLikes => {
    DOMelement.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
}

export const renderLike = like => {
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `;
    DOMelement.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
    const el = document.querySelector(`.likes__link[href*="#${id}"]`).parentElement;
    if (el) el.parentElement.removeChild(el);
}