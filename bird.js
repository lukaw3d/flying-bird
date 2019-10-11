// @ts-check
/// <reference types="lodash">

// _ = lodash
const WIDTH = 500;
const HEIGHT = 500;

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext('2d');
ctx.font = 'normal 18px sans-serif';
ctx.textAlign = 'center';


let state = generateInitialState();

function generateInitialState() {
    return {
        playing: 'dead', // or 'flying'
        bird: {
            x: 0,
            y: HEIGHT / 2,
            w: 20,
            h: 20,
            xspeed: 0.4,
            yspeed: 0,
            yaccel: 0,
        },
        map: generateMap(),
    };
}

function generateMap() {
    const H_SPACE = 400;
    const V_SPACE = 200;

    return {
        columns: _.range(3, 1000).map((i) => {
            return {
                x: (i + (Math.random() - 0.5) / 4) * H_SPACE,
                y: _.clamp(Math.random() * HEIGHT, HEIGHT * 0.2, (HEIGHT - V_SPACE) * 0.8),
                gap: V_SPACE,
                w: 60,
            };
        }).flatMap(({x, y, w, gap}) => {
            return [
                { x, y: 0, w, h: y },
                { x, y: y + gap, w, h: HEIGHT },
            ];
        }),
    };
}

const GRAVITY = 0.00007;
const SPEED_BOOST = GRAVITY * 10000;
const ACCEL_BOOST = GRAVITY / 10;

function updateState(delta) {
    if (state.playing === 'flying') {
        state.bird.yaccel = _.clamp(state.bird.yaccel + ACCEL_BOOST / 5, -ACCEL_BOOST, 0);

        state.bird.yspeed += (GRAVITY + state.bird.yaccel) * delta * delta;

        state.bird.x += state.bird.xspeed * delta;
        state.bird.y += state.bird.yspeed * delta;

        const mapCollision = state.map.columns.some((rect) => {
            return state.bird.x + state.bird.w > rect.x &&
                state.bird.x < rect.x + rect.w &&
                state.bird.y + state.bird.h > rect.y &&
                state.bird.y < rect.y + rect.h;
        });
        const floorCollision = state.bird.y + state.bird.h > HEIGHT;

        if (mapCollision || floorCollision) {
            state.playing = 'dead';
            saveScore();
        }
    }
}

function getScore() {
    return _.filter(state.map.columns, ({x, w}) => state.bird.x > x + w).length / 2;
}
function getTopScore() {
    return localStorage.topScore ? parseFloat(localStorage.topScore) : null;
}
function saveScore() {
    localStorage.topScore = Math.max(getTopScore(), getScore());
}


canvas.addEventListener('click', () => {
    if (state.playing === 'flying') {
        state.bird.yspeed -= SPEED_BOOST;
        state.bird.yaccel -= ACCEL_BOOST;
        return;
    }

    if (state.playing === 'dead') {
        state = generateInitialState();
        state.playing = 'flying';
        return;
    }
});


let lastUpdate = 0;
function draw(time) {
    updateState(time - lastUpdate);
    lastUpdate = time;

    // Draw
    ctx.fillStyle = '#6cc';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Center screen
    ctx.translate(-state.bird.x + WIDTH * 0.3, 0);
    state.map.columns.forEach(({x, y, w, h}) => {
        ctx.fillStyle = '#7b2';
        ctx.fillRect(x, y, w, h);
    });

    ctx.fillStyle = '#e81';
    ctx.fillRect(state.bird.x, state.bird.y, state.bird.w, state.bird.h);

    ctx.resetTransform();
    if (state.playing === 'flying') {
        ctx.fillStyle = '#cc6';
        ctx.fillText(`Score ${getScore()}`, WIDTH / 2, 50);
    }
    if (state.playing === 'dead') {
        ctx.fillStyle = '#dd9';
        ctx.fillRect(WIDTH / 2 - 100, 150, 200, 180);
        ctx.fillStyle = '#aa6';
        ctx.fillText(`Score ${getScore()}`, WIDTH / 2, 200);
        if (getTopScore()) ctx.fillText(`Best ${getTopScore()}`, WIDTH / 2, 280);

        ctx.fillStyle = '#666';
        ctx.fillText(`Click to restart`, WIDTH / 2, 400);
    }

    window.requestAnimationFrame(draw);
}
window.requestAnimationFrame(draw);
