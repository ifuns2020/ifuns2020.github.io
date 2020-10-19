'use strict';

var app = null;
var installPrompt = null;
var commitUrl = 'https://api.github.com/repos/ifuns2020/ifuns2020.github.io/commits/HEAD';

window.addEventListener('load', function() {
    app = new Vue({
        el: '#app',
        data: {
            categories: [],
            informations: {},
            selectedInformation: null,
            installable: false,
            installed: true,
            lastUpdated: 'N/A',
            lastUpdatedDelta: 'N/A'
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

            this.fetchLastUpdated();
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
            },
            fetchLastUpdated: function() {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', commitUrl);
                xhr.responseType = 'json';
                xhr.addEventListener('load', (function() {
                    if (xhr.status == 200) {
                        var dateStr = xhr.response.commit.committer.date;
                        var date = new Date(dateStr);
                        this.lastUpdated = date.toString();

                        var now = new Date();
                        var delta = now.getTime() - date.getTime();
                        var deltaDays = Math.floor(delta / 86400000);
                        var deltaHours = Math.floor(delta / 3600000);
                        var deltaMins = Math.floor(delta / 60000);
                        var deltaSecs = Math.floor(delta / 1000);
                        if (deltaDays != 0) {
                            this.lastUpdatedDelta = deltaDays + ' hari';
                        } else if (deltaHours != 0) {
                            this.lastUpdatedDelta = deltaHours + ' jam';
                        } else if (deltaMins != 0) {
                            this.lastUpdatedDelta = deltaMins + ' menit';
                        } else if (deltaSecs != 0) {
                            this.lastUpdatedDelta = deltaSecs + ' detik';
                        }
                    }
                }).bind(this));
                xhr.send();
            }
        }
    });
});
