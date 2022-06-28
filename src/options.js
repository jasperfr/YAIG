const options = {

    save: function() {
        let $data = {};
        $data.points = player.points.toString();
        for(let entry of Object.values(player)) {
            if('onSave' in entry) {
                $data = entry.onSave($data);
            }
        }
        this.data.save($data);
        localStorage.yaigSaveGame = btoa(JSON.stringify($data));
    },

    load: function() {
        let data = localStorage.yaigSaveGame;
        if(!data) return;
        try { data = atob(data); } catch { return; }
        try { data = JSON.parse(data); } catch { return; }

        player.points = new Decimal(data.points);
        for(let entry of Object.values(player)) {
            if('onLoad' in entry) {
                entry.onLoad(data);
            }
        }
        this.data.load(data);
    },

    export: function() {
        let $data = {};
        $data.points = player.points.toString();
        for(let entry of Object.values(player)) {
            if('onSave' in entry) {
                $data = entry.onSave($data);
            }
        }
        this.data.save($data);
        navigator.clipboard.writeText(btoa(JSON.stringify($data)));
    },

    import: function() {
        let data = prompt('Paste your savegame in here.');
        if(!data) return;
        try { data = atob(data); } catch { alert('Incorrect save data (malformed Base64)!'); return; }
        try { data = JSON.parse(data); } catch { alert('Incorrect save data (malformed JSON)!'); return; }

        player.points = new Decimal(data.points);
        for(let entry of Object.values(player)) {
            if('onLoad' in entry) {
                entry.onLoad(data);
            }
        }
        this.data.load(data);
    },

    reset: function() {
        const confirmation = prompt('Are you SURE you want to reset all progress? Type "Yes" if you mean it!');
        if(confirmation !== 'Yes') return;
        delete localStorage.yaigSaveGame;
        window.location.reload();
    },

    setAutoSaveInterval: function() {
        let data = prompt('Enter a number in seconds for save interval (type 0 to disable auto saving)')
        if(!data) return;
        if(isNaN(data)) { alert('Please type a number.'); return; }
        data = parseInt(data);
        if(data < 0) { alert('Please type a number greater or equal than 0.'); return; }
        this.data.autoSaveInterval = data;
    },

    setTheme: function() {
        const themes = ['Light', 'Dark', 'Dimmed'];
        const _a = themes.slice(1).concat(themes[0]);
        this.data.theme = _a[themes.indexOf(this.data.theme)];
    },

    setNewsTickerShown: function() {
        this.data.newsTickerShown = !this.data.newsTickerShown;
    },

    setDecimalNotation: function() {
        const arr = ['Mixed Scientific', 'Scientific', 'Logarithm', 'Infinity', 'OTTFFSSENT', 'Kanji', 'Blind', 'Do I have it?'];
        const _a = arr.slice(1).concat(arr[0]);
        this.data.notation = _a[arr.indexOf(this.data.notation)];
    },

    setChallengeConfirmations: function() {
        this.data.challengeConfirm = !this.data.challengeConfirm;
    },

    setHotkeys: function() {
        this.data.hotkeys = !this.data.hotkeys;
    },

    setMusic: function() {
        const arr = ['OFF', 'Hypnothis', 'Impact Prelude', 'Shores of Avalon', 'Living Voyage'];
        const _a = arr.slice(1).concat(arr[0]);
        this.data.music = _a[arr.indexOf(this.data.music)];
    },

    data: {
        _theme: 'Dark',
        _autoSaveInterval: 10,
        _newsTickerShown: true,
        _notation: 'Scientific',
        _hotkeys: true,
        _challengeConfirm: true,
        _musicSrc: 'OFF',
        audioMusic: null,
        fnAutoSaveInterval: setInterval(this.save, this._autoSaveInterval * 1000),

        get music() {
            return this._musicSrc;
        },

        set music(value) {
            this._musicSrc = value;
            if(this.audioMusic || this.music === 'OFF') {
                this.audioMusic.pause();
                this.audioMusic.currentTime = 0;
                this.audioMusic = null;
            }
            if(this.music !== 'OFF') {
                this.audioMusic = new Audio(`mus/${this.music}.mp3`);
                document.addEventListener("mousedown", () => {
                    this.audioMusic.play();
                });
            }
            $('.btn-music').text(`Music: ${this.music}`);
        },

        get challengeConfirm() {
            return this._challengeConfirm;
        },

        set challengeConfirm(value) {
            this._challengeConfirm = value;
            $('.btn-challenge-confirm').text(`Challenge confirmations: ${this._challengeConfirm ? 'ON' : 'OFF'}`);
        },

        get hotkeys() {
            return this._hotkeys
        },

        set hotkeys(value) {
            this._hotkeys = value;
            $('.btn-hotkeys').text(`Hotkeys: ${this.hotkeys ? 'ON' : 'OFF'}`);
        },

        get notation() {
            return this._notation;
        },

        set notation(value) {
            this._notation = value;
            $('.btn-notation').text(`Notation: ${this.notation}`);
        },

        get newsTickerShown() {
            return this._newsTickerShown;
        },

        set newsTickerShown(value) {
            this._newsTickerShown = value;
            $('.btn-news').text(`News Ticker: ${this.newsTickerShown ? 'Shown' : 'Hidden'}`);
            $('.news-ticker').toggle(this.newsTickerShown);
        },

        get autoSaveInterval() {
            return this._autoSaveInterval;
        },

        set autoSaveInterval(value) {
            this._autoSaveInterval = parseInt(value);
            clearInterval(this.fnAutoSaveInterval);
            if(this.autoSaveInterval > 0) {
                this.fnAutoSaveInterval = setInterval(() => options.save(), this.autoSaveInterval * 1000);
                $('.btn-interval').text(`Auto save interval: ${this.autoSaveInterval}s`);
            } else {
                $('.btn-interval').text('Auto save interval: Disabled');
            }
        },

        get theme() {
            return this._theme;
        },

        set theme(value) {
            this._theme = value;
            switch(this._theme) {
                case 'Light':
                    $(':root').css('--bg-color', '#eee');
                    $(':root').css('--text-color', '#000');
                    $(':root').css('--infinity-color', '#d53');
                    break;
                case 'Dark':
                    $(':root').css('--bg-color', '#000');
                    $(':root').css('--text-color', '#fff');
                    $(':root').css('--infinity-color', '#09c');
                    break;
                case 'Dimmed':
                    $(':root').css('--bg-color', '#333');
                    $(':root').css('--text-color', '#eee');
                    $(':root').css('--infinity-color', '#07a');
                    break;
            }

            $('.btn-theme').text(`Current theme: ${this._theme}`);
        },

        save($data) {
            $data.options = {
                theme: this.theme,
                autoSaveInterval: this.autoSaveInterval,
                newsTickerShown: this.newsTickerShown,
                notation: this.notation,
                hotkeys: this.hotkeys,
                challengeConfirm: this.challengeConfirm,
                music: this.music
            }

            return $data;
        },

        load($data) {
            if(!'options' in $data) return;
            for(let [k, v] of Object.entries($data.options)) {
                this[k] = v;
            }
        }
    },
}

document.addEventListener('DOMContentLoaded', () => {
    options.load();
});
