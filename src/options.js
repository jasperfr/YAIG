const options = {
    saveInterval: 10,

    save: function() {
        const jsonData = JSON.stringify({
            points: player.points.toString(),
            generators: player.generators.map(e => e.toString()),
            multipliers: player.multipliers.map(e => e.toString()),
            cost: player.cost.map(e => e.toString()),
            boost: player.boost.toString(),
            sacrifice: player.sacrifice.toString(),

            autoSaveInterval: options.saveInterval
        });
        localStorage.yaigSaveGame = btoa(jsonData);
    },

    load: function() {
        if(!localStorage.yaigSaveGame) return;
        
        try {
            let _temp = atob(localStorage.yaigSaveGame);
        } catch {
            alert('Your save file has been corrupted! The game will now restart.');
            return;
        }

        try {
            let _temp = JSON.parse(atob(localStorage.yaigSaveGame));
        } catch {
            alert('Your save file has been corrupted! The game will now restart.');
            return;
        }

        const data = JSON.parse(atob(localStorage.yaigSaveGame));
        
        player.points = new OmegaNum(data.points);
        player.generators = data.generators.map(e => new OmegaNum(e));
        player.multipliers = data.multipliers.map(e => new OmegaNum(e));
        player.cost = data.cost.map(e => new OmegaNum(e));
        player.boost = new OmegaNum(data.boost);
        player.sacrifice = new OmegaNum(data.sacrifice);

        options.saveInterval = data.autoSaveInterval;
        document.querySelector('.opt-interval').innerText =
            options.saveInterval === 0 ?
                `Auto save interval: Disabled.` :
                `Auto save interval: ${options.saveInterval}s`;
    },

    export: function() {
        const jsonData = JSON.stringify({
            points: player.points.toString(),
            generators: player.generators.map(e => e.toString()),
            multipliers: player.multipliers.map(e => e.toString()),
            cost: player.cost.map(e => e.toString()),
            boost: player.boost.toString(),
            sacrifice: player.sacrifice.toString(),
            
            autoSaveInterval: options.saveInterval
        });
        navigator.clipboard.writeText(btoa(jsonData));
    },

    import: function() {
        const data = prompt('Paste your save game here.');
        if(!data) return;
        
        try {
            let _temp = atob(data);
        } catch {
            alert('This save seems to be corrupted. (invalid Base64)');
            return;
        }

        try {
            let _temp = JSON.parse(atob(data));
        } catch {
            alert('This save seems to be corrupted. (invalid JSON)');
            return;
        }

        localStorage.yaigSaveGame = data;
        options.load();
    },

    setAutoSaveInterval: function() {
        const data = prompt('Enter a number in seconds for save interval (type 0 to disable auto saving)')
        if(!data) return;
        if(isNaN(data)) {
            alert('Please type a number.');
            return;
        }

        options.saveInterval = parseInt(data);
        document.querySelector('.opt-interval').innerText =
            options.saveInterval === 0 ?
                `Auto save interval: Disabled.` :
                `Auto save interval: ${options.saveInterval}s`;
    },

    reset: function() {
        const confirmation = prompt('Are you SURE you want to reset all progress? Type "Yes" if you mean it!');
        if(confirmation !== 'Yes') return;
        delete localStorage.yaigSaveGame;
        window.location.reload();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    options.load();
});
