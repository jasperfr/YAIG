const LOG10_INFINITY = 308.25471555991675;

const toggleButton = function(element, query) {
    document.querySelector(element).classList[['remove', 'add'][0 | query]]('cant');
}

const set = function(element) {
    const $el = document.querySelectorAll(element);
    $el.to = function(text) {
        this.forEach(e => e.innerText = text);
    }
    return $el;
}

const F = function(number, precision = 3, precisionHigh = 3) {
    if(number.lt(1e4)) return number.toFixed(precision);
    return number.toExponential(precisionHigh).replace('+', '');
}

function canSacrifice() {
    if(getSacrificeGain().lte(getSacrificeMultiplier())) return false;
    if(player.generators[7].lte(0)) return false;
    return true;
}

function getSacrificeMultiplier() {
    if(player.sacrifice.eq(0)) return OmegaNum(1);
    return OmegaNum.log10(player.sacrifice).div(10).plus(1)
}

function getSacrificeGain() {
    if(player.generators[0].eq(0)) return OmegaNum(1);
    return OmegaNum.log10(player.generators[0]).div(10).plus(1)
}

function sacrifice() {
    if(!canSacrifice()) return;
    player.sacrifice = player.sacrifice.plus(player.generators[0]);
    for(let i = 0; i < 6; i++) {
        player.generators[i] = OmegaNum(0);
    }
}

function boostCost() {
    return new OmegaNum(2048).times(OmegaNum.pow(4, player.boost));
}

function boostEffect(x) {
    if(x) return OmegaNum.times(0.125, x);
    return OmegaNum.times(0.125, player.boost.plus(1));
}

function buyBoost() {
    if(player.points.lt(boostCost())) return;
    player.points = player.points.minus(boostCost());
    player.boost = player.boost.plus(1);
}

const player = {
    points: new OmegaNum(4),
    generators: Array(8).fill(null).map(e => new OmegaNum(0)),
    multipliers: Array(8).fill(null).map(e => new OmegaNum(0)),
    sacrifice: new OmegaNum(0),
    cost: [
        new OmegaNum(2 ** 2),
        new OmegaNum(2 ** 4),
        new OmegaNum(2 ** 8), 
        new OmegaNum(2 ** 16),
        new OmegaNum(2 ** 24),
        new OmegaNum(2 ** 32),
        new OmegaNum(2 ** 48),
        new OmegaNum(2 ** 64)
    ],
    boost: new OmegaNum(0),
    autobuyers: {
        timer: 0,

        states: {
            'ab-1': { unlocked: false, slow: true, enabled: false },
            'ab-2': { unlocked: false, slow: true, enabled: false },
            'ab-3': { unlocked: false, slow: true, enabled: false },
            'ab-4': { unlocked: false, slow: true, enabled: false },
            'ab-5': { unlocked: false, slow: true, enabled: false },
            'ab-6': { unlocked: false, slow: true, enabled: false },
            'ab-7': { unlocked: false, slow: true, enabled: false },
            'ab-8': { unlocked: false, slow: true, enabled: false },
            'ab-b': { unlocked: false, slow: true, enabled: false },
        },

        buy(id) {
            this.states[id].unlocked = true;
            this.states[id].enabled = true;
        },

        toggle(id) {
            if(!this.states[id].unlocked) return;
            this.states[id].enabled ^= true;
        },

        tick(delta) {
            // purchase fast autobuyers
            for(let [id, state] of Object.entries(this.states)) {
                if(state.slow || !state.enabled || !state.unlocked) continue;
                switch(id) {
                    case 'ab-1': buyGenerator(1); break;
                    case 'ab-2': buyGenerator(2); break;
                    case 'ab-3': buyGenerator(3); break;
                    case 'ab-4': buyGenerator(4); break;
                    case 'ab-5': buyGenerator(5); break;
                    case 'ab-6': buyGenerator(6); break;
                    case 'ab-7': buyGenerator(7); break;
                    case 'ab-8': buyGenerator(8); break;
                    case 'ab-b': buyBoost(); break;
                }
            }

            this.timer += 1000 / delta;
            if(this.timer < 4000) return;
            this.timer = 0;

            // purchase slow autobuyers
            for(let [id, state] of Object.entries(this.states)) {
                if(!state.slow || !state.enabled || !state.unlocked) continue;
                switch(id) {
                    case 'ab-1': buyGenerator(1); break;
                    case 'ab-2': buyGenerator(2); break;
                    case 'ab-3': buyGenerator(3); break;
                    case 'ab-4': buyGenerator(4); break;
                    case 'ab-5': buyGenerator(5); break;
                    case 'ab-6': buyGenerator(6); break;
                    case 'ab-7': buyGenerator(7); break;
                    case 'ab-8': buyGenerator(8); break;
                    case 'ab-b': buyBoost(); break;
                }
            }
        },

        render() {
            for(let [id, state] of Object.entries(this.states)) {
                let $button = $(`.btn-${id}`),
                    $div    = $(`.div-${id}`),
                    $check  = $(`.chk-${id}`);
                
                $check.prop('checked', state.enabled);
                $button.toggle(!state.unlocked);
                $div.toggle(state.unlocked);
            }
        }
    }
}

function buyGenerator(generator) {
    if(player.points.lt(player.cost[generator - 1])) return;
    player.points = player.points.minus(player.cost[generator - 1]);
    player.cost[generator - 1] = player.cost[generator - 1].times(8);
    player.generators[generator - 1] = player.generators[generator - 1].plus(1);
    player.multipliers[generator - 1] = player.multipliers[generator - 1].plus(1);
}

let then;
function main() {

    function tick(now) {
        if(!then) {
            then = now;
            requestAnimationFrame(tick);
            return;
        }
        let delta = 1000 / (now - then);
        then = now;

        player.autobuyers.tick(delta);

        player.points = player.points.plus((player.generators[0].times(player.multipliers[0].times(boostEffect()).plus(1))).div(delta));
        for(let i = 7; i > 0; --i) {
            if(i == 7) {
                player.generators[i-1] = player.generators[i-1].plus((player.generators[i].times(player.multipliers[i].times(boostEffect()).times(getSacrificeMultiplier()).plus(1))).div(delta));
            } else {
                player.generators[i-1] = player.generators[i-1].plus((player.generators[i].times(player.multipliers[i].times(boostEffect()).plus(1))).div(delta));
            }
        }

        const sacrificeMultiplier = getSacrificeMultiplier();
        const sacrificeGain = getSacrificeGain();

        // render
        set('.points').to(F(player.points));
        set('.gain').to(F(player.generators[0].times(player.multipliers[0].times(boostEffect()).plus(1))));
        set('.current-boost').to(F(boostEffect(), 3));
        set('.next-boost').to(F(boostEffect(player.boost.plus(2)), 3));
        set('.boost-cost').to(F(boostCost(), 0, 3))
        toggleButton('.btn-boost', player.points.lt(boostCost()));
        
        for(let i = 0; i < 8; i++) {
            set(`.generator-${i+1}`).to(F(player.generators[i]));
            if(i == 7) {
                set(`.multiplier-${i+1}`).to('x' + F(player.multipliers[i].times(boostEffect()).times(sacrificeMultiplier).plus(1)));
            } else {
                set(`.multiplier-${i+1}`).to('x' + F(player.multipliers[i].times(boostEffect()).plus(1)));
            }
            set(`.cost-${i+1}`).to(F(player.cost[i], 0, 3));
            toggleButton(`.btn-generator-${i+1}`, player.points.lt(player.cost[i]));
        }

        set('.current-sacrifice-bonus').to(F(sacrificeMultiplier, 3) + 'x');
        set('.next-sacrifice-bonus').to(F(OmegaNum.max(sacrificeGain, sacrificeMultiplier), 3) + 'x');
        toggleButton('.btn-sacrifice', !canSacrifice());

        let percentage = OmegaNum.max(0, OmegaNum.log10(player.points).div(LOG10_INFINITY).times(100));
        set(`.infinity-percentage-label`).to(F(percentage, 2) + '% to Infinity');
        document.querySelector('.infinity-percentage-value').style.width = F(percentage, 2) + '%';

        player.autobuyers.render();

        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
}

document.addEventListener('DOMContentLoaded', main);

