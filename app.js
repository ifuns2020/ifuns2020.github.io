'use strict';

var app = null;

window.addEventListener('load', function() {
    app = new Vue({
        el: '#app',
        data: {
            categories: [],
            informations: {},
            selectedInformation: null
        },
        mounted: function() {
            this.categories = categories;

            var inf = informations;
            for (var category in inf) {
                for (var infoID in inf[category]) {
                    inf[category][infoID].category = category;
                }
            }
            this.informations = inf;
        }
    });
});

