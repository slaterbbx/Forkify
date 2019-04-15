import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }


    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id); // finds the index of el that is = to passed in ID

        // NOTE: slice (1, 2) is start and end indexs...
            // [2,4,8].slice(1, 2) -> returns 4 and original array to [2, 4, 8]
        // NOTE: splice (1, 1) is start and how many to take...
            // [2,4,8].splice(1, 1) -> returns 4 and mutates original array to [2, 8]
        this.items.splice(index, 1); // start at position then take out 1, updates this.item array
    }

    updateCount(id, newCount) {
        // "find()" is just like findIndex, but it returns the element itself and not the index location!
        this.items.find(el => el.id === id).count = newCount; 
    }
}