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
let umbralQuietudExpansion = 2000;
let umbralQuietudAuto = 6000;

// audio
let audioCtx = null;

// frases
const frasesExtra = [
    "cierra los ojos, la señal está en los párpados",
    "trescientas lenguas de viaje submarino",
    "no va a pasar",
    "cuánto te vas a arriesgar?",
    "yo soy lo que buscas",
    "la ambición es prestada",
    "hambre para soñar",
    "el viento traerá luz",
    "puedes reclamar el sueño",
    "la niebla te cambia",
    "vuelve a casa"
];

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

    // reset quietud
    ultimoMovimientoTiempo = Date.now();
    modoExpansion = false;

    dibujar();
}

window.addEventListener("mousemove", (e) => {
    mover(e.clientX, e.clientY);
});

window.addEventListener("touchmove", (e) => {
    e.preventDefault();
    let touch = e.touches[0];
    mover(touch.clientX, touch.clientY);
}, { passive: false });

// =======================
// DIBUJO (RESPIRA)
// =======================

function dibujar() {

    let baseSize = 10;

    tiempo += 0.05;
    let pulso = Math.sin(tiempo) * 2;

    // expansión
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

    // normal
    let size = baseSize + pulso;

    let saturacion = Math.min(100, 80 + velocidad);
    let luz = 60 + Math.sin(tiempo) * 10;

    ctx.fillStyle = `hsl(${hue}, ${saturacion}%, ${luz}%)`;

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
// MENSAJES
// =======================

function lanzarMensaje(x, y) {

    let mensaje = document.getElementById("mensaje");

    let textos = ["hummmmmm", "ayyyy", "o o", "uiii"];
    let texto = textos[Math.floor(Math.random() * textos.length)];

    let extra = frasesExtra[Math.floor(Math.random() * frasesExtra.length)];

    mensaje.innerText = texto + " — " + extra;

    mensaje.style.left = x + "px";
    mensaje.style.top = y + "px";
    mensaje.style.opacity = 1;

    setTimeout(() => {
        mensaje.style.opacity = 0;
    }, 8000);
}

// =======================
// DOBLE TAP
// =======================

function detectarDobleTap(x, y) {

    let ahora = Date.now();

    if (ahora - ultimoTap < delayDobleTap) {
        lanzarMensaje(x, y);
    }

    ultimoTap = ahora;
}

window.addEventListener("click", (e) => {
    detectarDobleTap(e.clientX, e.clientY);
});

window.addEventListener("touchstart", (e) => {
    let touch = e.touches[0];
    detectarDobleTap(touch.clientX, touch.clientY);
});

// =======================
// SONIDO
// =======================

function reproducirSonido() {

    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.value = 200 + Math.random() * 300;

    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.5);
}

// =======================
// MENSAJE AUTÓNOMO
// =======================

function mensajeAutonomo() {

    let x = Math.random() * window.innerWidth;
    let y = Math.random() * window.innerHeight;

    lanzarMensaje(x, y);
    reproducirSonido();
}

// =======================
// QUIETUD
// =======================

function detectarQuietud() {

    let ahora = Date.now();
    let tiempoQuieto = ahora - ultimoMovimientoTiempo;

    // expansión
    if (tiempoQuieto > umbralQuietudExpansion && !modoExpansion) {

        modoExpansion = true;

        let h = Math.floor(Math.random() * 360);
        colorExpansion = `hsl(${h}, 90%, 60%)`;

        setTimeout(() => {
            modoExpansion = false;
        }, 3000);
    }

    // autónomo
    if (
        tiempoQuieto > umbralQuietudAuto &&
        ahora - ultimoAutoMensaje > cooldownAuto
    ) {
        mensajeAutonomo();
        ultimoAutoMensaje = ahora;
    }

    requestAnimationFrame(detectarQuietud);
}

// =======================
// INICIO
// =======================

detectarQuietud();

window.onload = () => {
    setTimeout(() => {
        let el = document.getElementById("instrucciones");
        if (el) el.style.opacity = 0;
    }, 5000);
};

function cerrarInstrucciones() {
    document.getElementById("instrucciones").style.display = "none";
}
