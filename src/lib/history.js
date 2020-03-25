export function History() {
    this.maxItems = 10; // The max items to store in history
    this.currentIdx = -1;
    this.store = []; // Storage for the history

    // Adds an expression to the history list
    this.insert = function(expression) {
        var current = expression;
        var max = this.currentIdx+1;
    
        if (max > this.maxItems-1) {
            max = this.maxItems;
            this.currentIdx = this.maxItems;
        } else {
            this.currentIdx++;
        }

        if (max == 0)
        {
            this.store[0] = expression;
        } else {
            if (max+1 < this.maxItems - 1)
                max+=1;
            for (var i=0; i < max; i++) {
                var tmp = this.store[i];
                this.store[i] = current;
                current = tmp;
            }
        }
    }

    // Returns the history store
    this.getHistory = function() {
        return this.store;
    }

    // Sets the max number of items to be stored in history
    this.setMaxItems = function(max) {
        this.maxItems = max;
    }
}