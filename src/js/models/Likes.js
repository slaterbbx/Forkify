export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);

        // persist data in local storage
        this.persistData();
        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id); // finds the index of el that is = to passed in ID

        // NOTE: slice (1, 2) is start and end indexs...
            // [2,4,8].slice(1, 2) -> returns 4 and original array to [2, 4, 8]
        // NOTE: splice (1, 1) is start and how many to take...
            // [2,4,8].splice(1, 1) -> returns 4 and mutates original array to [2, 8]
        this.likes.splice(index, 1); // start at position then take out 1, updates this.likes array

         // persist data in local storage
         this.persistData();

    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1; // checks if true
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        // using JSON to turn our array into a string to store it in local storage
        // local storage works on key: value pairs and only takes in strings.
        // one key is used for the entire string then makes 'psudo' keys for the elements
        localStorage.setItem('likes', JSON.stringify(this.likes)); // key / string
    }

    readStorage() {
        // here we can convert our JSON.stringify back to the array with JSON.parse
        const storage = JSON.parse(localStorage.getItem('likes'));
        // restoring our likes from the localstorage
        if (storage) this.likes = storage;
    }
}