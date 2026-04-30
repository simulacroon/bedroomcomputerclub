const canvas = document.getElementById("lienzo");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = { x: 0, y: 0 };

let hue = 0;
let historial = [];

// velocidad
let velocidad = 0;
let ultimoX = window.innerWidth / 2;
let ultimoY = window.innerHeight / 2;

// frases extra
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
    "Come Home  . ' - en mis sueños solo quiero sentirlo",
];

// detectar movimiento
function analizarMovimiento() {

    if (historial.length < 10) return "indefinido";

    let cambiosDireccion = 0;

    for (let i = 2; i < historial.length; i++) {

        let dx1 = historial[i-1].x - historial[i-2].x;
        let dy1 = historial[i-1].y - historial[i-2].y;

        let dx2 = historial[i].x - historial[i-1].x;
        let dy2 = historial[i].y - historial[i-1].y;

        // normalizar vectores
        let mag1 = Math.sqrt(dx1*dx1 + dy1*dy1);
        let mag2 = Math.sqrt(dx2*dx2 + dy2*dy2);

        if (mag1 === 0 || mag2 === 0) continue;

        let dot = (dx1 * dx2 + dy1 * dy2) / (mag1 * mag2);

        // si cambia bastante dirección
        if (dot < 0.7) {
            cambiosDireccion++;
        }
    }

    if (cambiosDireccion < 3) return "recto";
    if (cambiosDireccion < 8) return "curvo";

    return "caotico";
}

// movimiento del mouse
window.addEventListener("mousemove", (e) => {

    let dx = e.clientX - ultimoX;
    let dy = e.clientY - ultimoY;

    let nuevaVelocidad = Math.sqrt(dx * dx + dy * dy);

    // suavizado
    velocidad = velocidad * 0.8 + nuevaVelocidad * 0.2;

    ultimoX = e.clientX;
    ultimoY = e.clientY;

    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // guardar historial correctamente
    historial.push({ x: mouse.x, y: mouse.y });

    if (historial.length > 20) {
        historial.shift();
    }

    dibujar();
});

// pincel
function dibujar() {

    let size = 10;

    let saturacion = Math.min(100, 80 + velocidad);

    ctx.fillStyle = `hsl(${hue}, ${saturacion}%, 60%)`;

    ctx.fillRect(
        Math.floor(mouse.x / size) * size,
        Math.floor(mouse.y / size) * size,
        size,
        size
    );

    hue += 1;
    if (hue > 360) hue = 0;
}

// click → mensaje
window.addEventListener("click", (e) => {

    let mensaje = document.getElementById("mensaje");

    let tipo = analizarMovimiento();

    let texto = "";

    if (tipo === "recto") {
        texto = "hummmmmm";
    } 
    else if (tipo === "curvo") {
        texto = "ayyyy";
    } 
    else if (tipo === "caotico") {
        texto = "o o";
    } 
    else {
        texto = "uiii";
    }

    // añadir frase artística
    let extra = frasesExtra[Math.floor(Math.random() * frasesExtra.length)];

    mensaje.innerText = texto + " — " + extra;

    mensaje.style.left = e.clientX + "px";
    mensaje.style.top = e.clientY + "px";

    mensaje.style.opacity = 1;

    setTimeout(() => {
        mensaje.style.opacity = 0;
    }, 2000);
});

function cerrarInstrucciones() {
    document.getElementById("instrucciones").style.display = "none";
}

window.onload = () => {
    setTimeout(() => {
        let el = document.getElementById("instrucciones");
        if (el) el.style.opacity = 0;
    }, 5000);
};
