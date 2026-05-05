const canvas = document.getElementById("lienzo");
const ctx = canvas.getContext("2d");

document.body.style.touchAction = "none";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = { x: 0, y: 0 };

let hue = 0;
let historial = [];

// velocidad
let velocidad = 0;
let ultimoX = window.innerWidth / 2;
let ultimoY = window.innerHeight / 2;

// doble tap
let ultimoTap = 0;
let delayDobleTap = 300;

// contador distorsión
let contadorDobleTap = 0;
let distorsionActiva = false;
let tiempoDistorsion = 0;

// respiración
let tiempo = 0;

// quietud
let ultimoMovimientoTiempo = Date.now();

// expansión
let modoExpansion = false;
let colorExpansion = "white";

// autónomo
let ultimoAutoMensaje = 0;
let cooldownAuto = 7000;

// audio
let musica = null;
let musicaActiva = false;
let audioCtx = null;

// frases
const frasesExtra = [
    "Glimmers of Hope . ' - cierra los ojos, la señal está en los párpados ",
    "Ultra Villain . ' - trescientas lenguas de viaje submarino en la madrugada",
    "Obsessive Compulsion . ' - no va a pasar ",
    "Dangerous Games  . ' - cuánto te vas a arriesgar?",
    "I'm The One You Want  . ' -hmmmm, hmmmm, hmmm, gurl yo soy",
    "Gloves Off . '  la ambición, la justa y sana ¿te la presto?",
    "Dirt  . ' sueño para dormir, hambre para soñar ",
    "Kiss the Ring . ' - no llores más, el viento traerá colores y luz que te harán soñar.",
    "Might Jump… . ' - ¿sabías que podías reclamar al soñador del sueño?",
    "A Moving Blur . ' - es tan difícil encontrarte, la niebla que has adquirido, te ha convertido en un mentirosx ",
    "Come Home  . ' - en mis sueños solo quiero sentirlo"
];

// =======================
// AUDIO
// =======================

function iniciarMusica() {
    if (!musica) {
        musica = new Audio("audio/track.mp3");
        musica.loop = true;
        musica.volume = 0;
    }
    musica.play();
}

function reproducirSonido() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();

    osc.frequency.value = 200 + Math.random() * 300;

    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1);
}

// =======================
// MOVIMIENTO
// =======================

function mover(x, y) {

    let dx = x - ultimoX;
    let dy = y - ultimoY;

    let nuevaVelocidad = Math.sqrt(dx * dx + dy * dy);
    velocidad = velocidad * 0.8 + nuevaVelocidad * 0.2;

    ultimoX = x;
    ultimoY = y;

    mouse.x = x;
    mouse.y = y;

    historial.push({ x, y });
    if (historial.length > 20) historial.shift();

    ultimoMovimientoTiempo = Date.now();
    modoExpansion = false;

    dibujar();
}

window.addEventListener("mousemove", (e) => {
    mover(e.clientX, e.clientY);
});

window.addEventListener("touchmove", (e) => {
    e.preventDefault();
    let t = e.touches[0];
    mover(t.clientX, t.clientY);
}, { passive: false });

// =======================
// DIBUJO
// =======================

function dibujar() {

    let baseSize = 10;

    tiempo += 0.05;

    // 🔥 DISTORSIÓN
    if (distorsionActiva) {

        if (Date.now() > tiempoDistorsion) {
            distorsionActiva = false;
        }

        let ruido = Math.sin(tiempo * 10) * 10;
        let size = baseSize + ruido;

        let offsetX = (Math.random() - 0.5) * 20;
        let offsetY = (Math.random() - 0.5) * 20;

        ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;

        ctx.fillRect(
            Math.floor((mouse.x + offsetX) / baseSize) * baseSize,
            Math.floor((mouse.y + offsetY) / baseSize) * baseSize,
            size,
            size
        );

        return;
    }

    // 🌫️ EXPANSIÓN
    if (modoExpansion) {

        let size = baseSize * 2.5;

        ctx.fillStyle = colorExpansion;

        ctx.fillRect(
            Math.floor(mouse.x / baseSize) * baseSize,
            Math.floor(mouse.y / baseSize) * baseSize,
            size,
            size
        );

        return;
    }

    // NORMAL
    let pulso = Math.sin(tiempo) * 2;
    let size = baseSize + pulso;

    ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;

    ctx.fillRect(
        Math.floor(mouse.x / baseSize) * baseSize,
        Math.floor(mouse.y / baseSize) * baseSize,
        size,
        size
    );

    hue++;
    if (hue > 360) hue = 0;
}

// =======================
// MENSAJE
// =======================

function lanzarMensaje(x, y) {

    let mensaje = document.getElementById("mensaje");

    let texto = frasesExtra[Math.floor(Math.random() * frasesExtra.length)];

    mensaje.innerText = texto;

    mensaje.style.left = x + "px";
    mensaje.style.top = y + "px";
    mensaje.style.opacity = 1;

    setTimeout(() => {
        mensaje.style.opacity = 0;
    }, 5000);
}

// =======================
// DOBLE TAP
// =======================

function detectarDobleTap(x, y) {

    let ahora = Date.now();

    if (ahora - ultimoTap < delayDobleTap) {

        contadorDobleTap++;
        lanzarMensaje(x, y);

        if (contadorDobleTap === 3) {

            distorsionActiva = true;
            tiempoDistorsion = Date.now() + 5000;

            reproducirSonido();

            contadorDobleTap = 0;
        }
    }

    if (!musica) {
        iniciarMusica();
        musica.pause();
    }

    ultimoTap = ahora;
}

window.addEventListener("click", (e) => {
    detectarDobleTap(e.clientX, e.clientY);
});

window.addEventListener("touchstart", (e) => {
    let t = e.touches[0];
    detectarDobleTap(t.clientX, t.clientY);
});

// =======================
// QUIETUD + MÚSICA
// =======================

function detectarQuietud() {

    let ahora = Date.now();
    let quieto = ahora - ultimoMovimientoTiempo;

    // expansión
    if (quieto > 2000 && !modoExpansion) {

        modoExpansion = true;

        let h = Math.random() * 360;
        colorExpansion = `hsl(${h}, 90%, 60%)`;

        setTimeout(() => {
            modoExpansion = false;
        }, 3000);
    }

    // música
    if (quieto > 2000) {

        if (!musicaActiva) {
            iniciarMusica();
            musicaActiva = true;
        }

        if (musica.volume < 0.5) musica.volume += 0.01;

    } else {

        if (musica && musica.volume > 0) musica.volume -= 0.02;

        if (musica && musica.volume <= 0) {
            musica.pause();
            musicaActiva = false;
        }
    }

    requestAnimationFrame(detectarQuietud);
}

// =======================
// INICIO
// =======================

detectarQuietud();
