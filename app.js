'use strict';

var app = null;
var installPrompt = null;

window.addEventListener('load', function() {
    app = new Vue({
        el: '#app',
        data: {
            categories: [],
            informations: {},
            selectedInformation: null,
            installable: false,
            installed: true
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
            if (typeof(navigator.serviceWorker) !== 'undefined') {
                navigator.serviceWorker.register('service.js').then((function() {
                    this.installable = true;
                }).bind(this));
            }
            window.addEventListener('beforeinstallprompt', (function(e) {
                e.preventDefault();
                installPrompt = e;
                this.installed = false;
                this.installable = true;
            }).bind(this));
        },
        methods: {
            install: function() {
                if (this.installable) {
                    if (installPrompt !== null) {
                        installPrompt.prompt();
                        installPrompt.userChoice.then((function(result) {
                            if (result.outcome === 'accepted') {
                                this.installed = true;
                                window.installPrompt = null;
                            }
                        }).bind(this));
                    } else {
                        window.alert('Anda dapat menginstall aplikasi ini dengan cara mengklik \'Add to Home Screen\' atau sejenisnya. Jika sudah, abaikan saja pesan ini');
                    }
                } else {
                    window.alert('Aplikasi ini tidak dapat dipasang pada perangkat anda. Silakan untuk meng-update browser anda atau menggantinya dengan Chrome');
                }
            }
        }
    });
});
