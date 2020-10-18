'use strict';

self.addEventListener('fetch', function(event) {
    return fetch(event.request).then(function(response) {
        return response;
    });
});

