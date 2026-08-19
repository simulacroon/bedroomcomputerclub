(() => {


/* =========================================================
   MUJER SALIENDO DEL PSICOANALISTA

   ENTER 01 — BRUMA
   ENTER 02 — EXPANSIÓN
   ENTER 03 — PIES / NEGRO
   ENTER 04 — ARQUITECTURA / PUERTAS
   ENTER 05 — FRAGMENTACIÓN
========================================================= */


/* =========================================================
   ELEMENTOS
========================================================= */

const sky = document.getElementById("sky");
const enterOverlay = document.getElementById("enterOverlay");
const instructions = document.getElementById("instructions");
const soundInfo = document.getElementById("soundInfo");

const mistCanvas = document.getElementById("mistCanvas");
const feet = document.getElementById("feet");
const feetMistCanvas = document.getElementById("feetMistCanvas");

const blackout = document.getElementById("blackout");
const subtitle = document.getElementById("subtitleText");


/* ARQUITECTURA */

const architectureStage =
    document.getElementById("architectureStage");

const architectureDoors =
    document.getElementById("architectureDoors");

const architectureNoise =
    document.getElementById("architectureNoise");


/* =========================================================
   ESTADO
========================================================= */

let state = 0;
let montageLocked = false;


/* =========================================================
   CANVAS
========================================================= */

const ctx = mistCanvas.getContext("2d");
const feetCtx = feetMistCanvas.getContext("2d");
   

   if (
    !sky ||
    !enterOverlay ||
    !mistCanvas ||
    !feet ||
    !feetMistCanvas ||
    !blackout ||
    !subtitle ||
    !architectureStage ||
    !architectureDoors ||
    !architectureNoise
) {

    console.warn(
        "Remedios: faltan elementos HTML necesarios."
    );

    return;
}
   


function resizeCanvas() {

    const dpr =
    Math.min(
        window.devicePixelRatio || 1,
        1.25
    );

    mistCanvas.width = innerWidth * dpr;
    mistCanvas.height = innerHeight * dpr;

    mistCanvas.style.width = innerWidth + "px";
    mistCanvas.style.height = innerHeight + "px";

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    feetMistCanvas.width = innerWidth * dpr;
    feetMistCanvas.height = innerHeight * dpr;

    feetMistCanvas.style.width = innerWidth + "px";
    feetMistCanvas.style.height = innerHeight + "px";

    feetCtx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );
}


resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);


/* =========================================================
   UTILIDADES
========================================================= */

function lerp(a, b, t) {

    return a + (b - a) * t;

}


function smooth(t) {

    return t * t * (3 - 2 * t);

}


/* =========================================================
   NIEBLA
========================================================= */

let mistDensity = 0;
let mistCoverage = .01;
let mistScale = .62;
let mistOpacity = 1;
let mistDarkness = 0;

let mistCenterX = .5;
let mistCenterY = .48;
let mistRadius = .06;


class MistCloud {

    constructor() {

        this.nx =
            -.15 +
            Math.random() * 1.3;

        this.ny =
            -.15 +
            Math.random() * 1.3;

        this.radius =
            34 +
            Math.random() * 90;

        this.stretch =
            2.2 +
            Math.random() * 3.4;

        this.vx =
            (Math.random() - .5) *
            .000035;

        this.vy =
            -(
                .000004 +
                Math.random() *
                .000018
            );

        this.phase =
            Math.random() *
            Math.PI *
            2;

        this.phaseSpeed =
            .001 +
            Math.random() *
            .0025;

        this.alpha =
            .003 +
            Math.random() *
            .008;

        this.rotation =
            (Math.random() - .5) *
            .22;
    }


    update() {

        this.phase +=
            this.phaseSpeed;

        this.nx +=
            this.vx +
            Math.sin(this.phase) *
            .000008;

        this.ny +=
            this.vy;


        if (this.nx > 1.2) {
            this.nx = -.2;
        }

        if (this.nx < -.2) {
            this.nx = 1.2;
        }

        if (this.ny < -.2) {
            this.ny = 1.2;
        }
    }


    draw() {

        if (mistDensity <= 0) {
            return;
        }


        const x =
            this.nx *
            innerWidth;

        const y =
            this.ny *
            innerHeight;


        const centerY =
            innerHeight *
            mistCenterY;


        const distanceY =
            Math.abs(
                y - centerY
            );


        const coverage =
            mistCoverage *
            innerHeight;


        const feather =
            220;


        let coverageAlpha =
            1 -
            (
                distanceY -
                coverage
            ) /
            feather;


        coverageAlpha =
            Math.max(
                0,
                Math.min(
                    1,
                    coverageAlpha
                )
            );


        coverageAlpha =
            smooth(
                coverageAlpha
            );


        const centerX =
            innerWidth *
            mistCenterX;


        const dx =
            x -
            centerX;

        const dy =
            y -
            centerY;


        const normalizedDistance =
            Math.sqrt(

                Math.pow(
                    dx / innerWidth,
                    2
                )

                +

                Math.pow(
                    dy / innerHeight,
                    2
                )

            );


        const radialFeather =
            .14;


        let radialAlpha =
            1 -
            (
                normalizedDistance -
                mistRadius
            ) /
            radialFeather;


        radialAlpha =
            Math.max(
                0,
                Math.min(
                    1,
                    radialAlpha
                )
            );


        radialAlpha =
            smooth(
                radialAlpha
            );


        if (
            coverageAlpha <= 0 ||
            radialAlpha <= 0
        ) {
            return;
        }


        const brightness =
            Math.round(
                lerp(
                    235,
                    0,
                    mistDarkness
                )
            );


        ctx.save();

        ctx.translate(
            x,
            y
        );

        ctx.rotate(
            this.rotation
        );

        ctx.filter =
            `blur(${this.radius * .38}px)`;


        ctx.fillStyle =
            `rgba(
                ${brightness},
                ${brightness},
                ${brightness},
                ${
                    this.alpha *
                    mistDensity *
                    mistOpacity *
                    coverageAlpha *
                    radialAlpha
                }
            )`;


        ctx.beginPath();

        ctx.ellipse(

            0,
            0,

            this.radius *
            this.stretch *
            mistScale,

            this.radius *
            .48 *
            mistScale,

            0,
            0,

            Math.PI * 2

        );

        ctx.fill();

        ctx.restore();
    }
}


/* =========================================================
   NUBES
========================================================= */

const mistClouds = [];


for (
    let i = 0;
    i < 220;
    i++
) {

    mistClouds.push(
        new MistCloud()
    );

}


function drawMist() {

    if (remediosActive) {

        ctx.clearRect(
            0,
            0,
            mistCanvas.clientWidth,
            mistCanvas.clientHeight
        );

        mistClouds.forEach(
            cloud => {
                cloud.update();
                cloud.draw();
            }
        );

    }

    requestAnimationFrame(drawMist);
}

drawMist();


/* =========================================================
   ANIMAR NIEBLA
========================================================= */

function animateMist(
    targetDensity,
    targetCoverage,
    targetScale,
    targetRadius,
    duration
) {

    const startDensity =
        mistDensity;

    const startCoverage =
        mistCoverage;

    const startScale =
        mistScale;

    const startRadius =
        mistRadius;

    const startTime =
        performance.now();


    function frame(now) {

        const t =
            Math.min(
                (
                    now -
                    startTime
                ) /
                duration,
                1
            );


        const e =
            smooth(t);


        mistDensity =
            lerp(
                startDensity,
                targetDensity,
                e
            );


        mistCoverage =
            lerp(
                startCoverage,
                targetCoverage,
                e
            );


        mistScale =
            lerp(
                startScale,
                targetScale,
                e
            );


        mistRadius =
            lerp(
                startRadius,
                targetRadius,
                e
            );


        if (t < 1) {

            requestAnimationFrame(
                frame
            );

        }
    }


    requestAnimationFrame(
        frame
    );
}


/* =========================================================
   EVAPORACIÓN
========================================================= */

function evaporateMist(duration) {

    const startOpacity =
        mistOpacity;

    const startScale =
        mistScale;

    const startRadius =
        mistRadius;

    const startTime =
        performance.now();


    function frame(now) {

        const t =
            Math.min(
                (
                    now -
                    startTime
                ) /
                duration,
                1
            );


        const e =
            smooth(t);


        mistOpacity =
            lerp(
                startOpacity,
                0,
                e
            );


        mistScale =
            lerp(
                startScale,
                1.55,
                e
            );


        mistRadius =
            lerp(
                startRadius,
                1.7,
                e
            );


        if (t < 1) {

            requestAnimationFrame(
                frame
            );

        }
    }


    requestAnimationFrame(
        frame
    );
}


/* =========================================================
   NIEBLA → NEGRO
========================================================= */

function darkenMist(duration) {

    const startDarkness =
        mistDarkness;

    const startOpacity =
        mistOpacity;

    const startDensity =
        mistDensity;

    const startScale =
        mistScale;

    const startRadius =
        mistRadius;

    const startCoverage =
        mistCoverage;

    const startTime =
        performance.now();


    function frame(now) {

        const t =
            Math.min(
                (
                    now -
                    startTime
                ) /
                duration,
                1
            );


        const e =
            smooth(t);


        mistDarkness =
            lerp(
                startDarkness,
                1,
                e
            );


        mistOpacity =
            lerp(
                startOpacity,
                1,
                e
            );


        mistDensity =
            lerp(
                startDensity,
                1.3,
                e
            );


        mistScale =
            lerp(
                startScale,
                1.75,
                e
            );


        mistRadius =
            lerp(
                startRadius,
                1.75,
                e
            );


        mistCoverage =
            lerp(
                startCoverage,
                1.4,
                e
            );


        if (t < 1) {

            requestAnimationFrame(
                frame
            );

        }
    }


    requestAnimationFrame(
        frame
    );
}


/* =========================================================
   NIEBLA DE PIES
========================================================= */

class FootMist {

    constructor() {
        this.reset();
    }


    reset() {

        this.x =
            innerWidth / 2 +
            (
                Math.random() -
                .5
            ) *
            170;


        this.y =
            innerHeight *
            .78 +
            (
                Math.random() -
                .5
            ) *
            120;


        this.radius =
            18 +
            Math.random() *
            46;


        this.vx =
            (
                Math.random() -
                .5
            ) *
            .18;


        this.vy =
            -(
                .07 +
                Math.random() *
                .15
            );


        this.phase =
            Math.random() *
            Math.PI *
            2;


        this.life = 0;


        this.maxLife =
            450 +
            Math.random() *
            600;
    }


    update() {

        this.life++;

        this.phase +=
            .006;

        this.x +=
            this.vx +
            Math.sin(
                this.phase
            ) *
            .1;

        this.y +=
            this.vy;

        this.radius *=
            1.001;


        if (
            this.life >
            this.maxLife
        ) {

            this.reset();

        }
    }


    draw() {

        const p =
            this.life /
            this.maxLife;


        let alpha = 1;


        if (p < .15) {

            alpha =
                p /
                .15;

        }


        if (p > .8) {

            alpha =
                1 -
                (
                    (p - .8) /
                    .2
                );

        }


        feetCtx.save();


        feetCtx.filter =
            `blur(${this.radius * .3}px)`;


        feetCtx.fillStyle =
            `rgba(
                225,
                225,
                225,
                ${alpha * .025}
            )`;


        feetCtx.beginPath();


        feetCtx.ellipse(

            this.x,
            this.y,

            this.radius *
            1.8,

            this.radius *
            .55,

            0,
            0,

            Math.PI * 2

        );


        feetCtx.fill();

        feetCtx.restore();
    }
}


const footClouds = [];


for (
    let i = 0;
    i < 110;
    i++
) {

    footClouds.push(
        new FootMist()
    );

}

function drawFeetMist() {

    if (
        remediosActive &&
        state >= 3 &&
        state < 4
    ) {

        feetCtx.clearRect(
            0,
            0,
            feetMistCanvas.clientWidth,
            feetMistCanvas.clientHeight
        );

        footClouds.forEach(
            cloud => {

                cloud.update();
                cloud.draw();

            }
        );

    }

    requestAnimationFrame(
        drawFeetMist
    );
}


drawFeetMist();



/* =========================================================
   AUDIO — SISTEMA DE CAPAS
========================================================= */

let audioContext = null;

let master = null;


/* =========================================================
   SUBGRAVE DE APOYO
========================================================= */

let subOscillator = null;
let subGain = null;


/* =========================================================
   ARCHIVOS
========================================================= */

let droneAudio = null;
let windAudio = null;

let stormAudio = null;
let thunderAudio = null;
let stereoAudio = null;


/* =========================================================
   NODOS
========================================================= */

let droneSource = null;
let droneGain = null;

let windSource = null;
let windGain = null;

let stormSource = null;
let stormGain = null;

let thunderSource = null;
let thunderGain = null;

let stereoSource = null;
let stereoGain = null;


/* =========================================================
   CREAR ELEMENTO DE AUDIO
========================================================= */

function createAudioElement(
    src,
    loop = true
) {

    const audio =
        new Audio(src);

    audio.loop =
        loop;

    audio.preload =
        "auto";

    return audio;
}


/* =========================================================
   INICIAR MOTOR DE AUDIO
========================================================= */

function startAudio() {

    /*
        Solo se crea una vez,
        después del primer gesto
        del usuario.
    */

    if (audioContext) {

        return;
    }


    audioContext =
        new (
            window.AudioContext ||
            window.webkitAudioContext
        )();


    /* =====================================================
       MASTER
    ===================================================== */

    master =
        audioContext.createGain();


    master.gain.value =
        0.75;


    master.connect(
        audioContext.destination
    );


    /* =====================================================
       SUBGRAVE
    ===================================================== */

    subOscillator =
        audioContext.createOscillator();


    subGain =
        audioContext.createGain();


    subOscillator.type =
        "sine";


    subOscillator.frequency.value =
        38;


    subGain.gain.value =
        0.0001;


    subOscillator.connect(
        subGain
    );


    subGain.connect(
        master
    );


    subOscillator.start();


    subGain.gain
        .exponentialRampToValueAtTime(
            0.018,
            audioContext.currentTime + 5
        );


    /* =====================================================
       DRONE
    ===================================================== */

    droneAudio =
        createAudioElement(
            "audio/drone.wav",
            true
        );


    droneSource =
        audioContext.createMediaElementSource(
            droneAudio
        );


    droneGain =
        audioContext.createGain();


    droneGain.gain.value =
        0.0001;


    droneSource.connect(
        droneGain
    );


    droneGain.connect(
        master
    );


    /* =====================================================
       VIENTO
    ===================================================== */

    windAudio =
        createAudioElement(
            "audio/viento.wav",
            true
        );


    windSource =
        audioContext.createMediaElementSource(
            windAudio
        );


    windGain =
        audioContext.createGain();


    windGain.gain.value =
        0.0001;


    windSource.connect(
        windGain
    );


    windGain.connect(
        master
    );


    /* =====================================================
       TORMENTA
    ===================================================== */

    stormAudio =
        createAudioElement(
            "audio/tormenta.wav",
            true
        );


    stormSource =
        audioContext.createMediaElementSource(
            stormAudio
        );


    stormGain =
        audioContext.createGain();


    stormGain.gain.value =
        0.0001;


    stormSource.connect(
        stormGain
    );


    stormGain.connect(
        master
    );


    /* =====================================================
       TRUENO

       NO LOOP
    ===================================================== */

    thunderAudio =
        createAudioElement(
            "audio/trueno.wav",
            false
        );


    thunderSource =
        audioContext.createMediaElementSource(
            thunderAudio
        );


    thunderGain =
        audioContext.createGain();


    thunderGain.gain.value =
        0.7;


    thunderSource.connect(
        thunderGain
    );


    thunderGain.connect(
        master
    );


    /* =====================================================
       ESTÉREO
    ===================================================== */

    stereoAudio =
        createAudioElement(
            "audio/estereo.wav",
            true
        );


    stereoSource =
        audioContext.createMediaElementSource(
            stereoAudio
        );


    stereoGain =
        audioContext.createGain();


    stereoGain.gain.value =
        0.0001;


    stereoSource.connect(
        stereoGain
    );


    stereoGain.connect(
        master
    );
}


/* =========================================================
   ENTER 01 — SONIDO
========================================================= */

function soundEnter01() {

    if (!audioContext) {
        return;
    }


    const now =
        audioContext.currentTime;


    /* =========================
       INICIAR ARCHIVOS
    ========================= */

    if (
        droneAudio &&
        droneAudio.paused
    ) {

        droneAudio.play();
    }


    if (
        windAudio &&
        windAudio.paused
    ) {

        windAudio.play();
    }


    /* =========================
       DRONE
    ========================= */

    droneGain.gain
        .cancelScheduledValues(
            now
        );

    droneGain.gain
        .setValueAtTime(
            Math.max(
                droneGain.gain.value,
                0.0001
            ),
            now
        );

    droneGain.gain
        .exponentialRampToValueAtTime(
            0.42,
            now + 4
        );


    /* =========================
       VIENTO
    ========================= */

    windGain.gain
        .cancelScheduledValues(
            now
        );

    windGain.gain
        .setValueAtTime(
            Math.max(
                windGain.gain.value,
                0.0001
            ),
            now
        );

    windGain.gain
        .exponentialRampToValueAtTime(
            0.22,
            now + 6
        );
}


/* =========================================================
   ENTER 02 — SONIDO

   tormenta
       ↓
   trueno
       ↓
   estéreo
========================================================= */

function soundEnter02() {

    if (!audioContext) {
        return;
    }



    const now =
        audioContext.currentTime;


    /* =========================
       1. TORMENTA
       empieza inmediatamente
    ========================= */

    if (
        stormAudio &&
        stormAudio.paused
    ) {

        stormAudio.play();
    }


    stormGain.gain
        .cancelScheduledValues(now);


    stormGain.gain
        .setValueAtTime(
            Math.max(
                stormGain.gain.value,
                0.0001
            ),
            now
        );


    stormGain.gain
        .exponentialRampToValueAtTime(
            0.52,
            now + 4.5
        );



    /* =========================
       2. VIENTO CRECE
    ========================= */

    windGain.gain
        .cancelScheduledValues(now);


    windGain.gain
        .setValueAtTime(
            Math.max(
                windGain.gain.value,
                0.0001
            ),
            now
        );


    windGain.gain
        .exponentialRampToValueAtTime(
            0.32,
            now + 4
        );



    /* =========================
       3. DRONE RETROCEDE
    ========================= */

    droneGain.gain
        .cancelScheduledValues(now);


    droneGain.gain
        .setValueAtTime(
            Math.max(
                droneGain.gain.value,
                0.0001
            ),
            now
        );


    droneGain.gain
        .exponentialRampToValueAtTime(
            0.28,
            now + 4
        );



    /* =========================
       4. TRUENO

       ocurre a los 2.2 segundos
    ========================= */

    setTimeout(() => {

        if (!thunderAudio) {
            return;
        }


        thunderAudio.currentTime = 0;

        thunderAudio.play();


        /* =========================
           5. ESTÉREO

           NO empieza con ENTER 02.

           Empieza después
           de escuchar el trueno.
        ========================= */

        setTimeout(() => {

            if (!stereoAudio) {
                return;
            }


            /*
                Lo llevamos al principio
                por si repetimos la prueba.
            */

            stereoAudio.currentTime = 0;


            stereoGain.gain
                .cancelScheduledValues(
                    audioContext.currentTime
                );


            stereoGain.gain
                .setValueAtTime(
                    0.0001,
                    audioContext.currentTime
                );


            stereoAudio.play();


            /*
                Entrada suave después
                del impacto.
            */

            stereoGain.gain
                .exponentialRampToValueAtTime(
                    0.34,
                    audioContext.currentTime + 2.8
                );


        }, 700);


    }, 2200);

}


/* =========================================================
   SUBTÍTULO
========================================================= */

function setSubtitle(text) {

    subtitle.style.opacity =
        0;


    setTimeout(
        () => {

            subtitle.textContent =
                text;

            subtitle.style.opacity =
                1;

        },
        350
    );
}


/* =========================================================
   INTERFAZ
========================================================= */

function showInterface() {

    setTimeout(
        () => {

            instructions
                .classList
                .add(
                    "visible"
                );


            soundInfo
                .classList
                .add(
                    "visible"
                );

        },
        700
    );
}


/* =========================================================
   ENTER 01 — BRUMA
========================================================= */

function enter01() {

    enterOverlay
        .classList
        .add(
            "hidden"
        );


    showInterface();

    soundEnter01();


    mistOpacity = 1;
    mistDarkness = 0;


    animateMist(

        .45,
        .025,
        .7,
        .07,

        4200

    );


    setSubtitle(
        "Todo es visible y todo es elusivo, "
    );
}


/* =========================================================
   ENTER 02 — EXPANSIÓN
========================================================= */

function enter02() {

    sky.classList.add(
        "expand"
    );

    soundEnter02();

    animateMist(

        .72,
        .55,
        1.05,
        .82,

        8500

    );


    setSubtitle(
        "todo está cerca y todo es intocable."
    );
}


/* =========================================================
   ENTER 03 — PIES / NEGRO
========================================================= */

function enter03() {

    montageLocked =
        true;


    animateMist(

        .92,
        1.35,
        1.3,
        1.5,

        6000

    );


    setTimeout(
        () => {

            sky.classList.add(
                "hide"
            );

        },
        4700
    );


    setTimeout(
        () => {

            evaporateMist(
                4200
            );

        },
        6500
    );


    setTimeout(
        () => {

            feet.classList.add(
                "reveal"
            );

        },
        9800
    );


    setTimeout(
        () => {

            mistOpacity =
                .05;

            mistDensity =
                .22;

            mistCoverage =
                1.4;

            mistScale =
                1.2;

            mistRadius =
                1.55;

            mistDarkness =
                0;


            animateMist(

                .72,
                1.4,
                1.4,
                1.6,

                4200

            );

        },
        12200
    );


    setTimeout(
        () => {

            darkenMist(
                6500
            );

        },
        14500
    );


    setTimeout(
        () => {

            blackout.classList.add(
                "active"
            );

        },
        19500
    );


    setTimeout(
        () => {

            montageLocked =
                false;

            setSubtitle(
                ""
            );

        },
        23500
    );


    setSubtitle(
        "La luz hace del muro indiferente un espectral teatro de reflejos."
    );
}


/* =========================================================
   ARQUITECTURA

   Estos recortes se usan SOLO
   para ENTER 05.

   ENTER 04 utiliza los PNG completos.
========================================================= */


/* =========================================================
   OBRA PRINCIPAL — ZONAS ARQUITECTÓNICAS
========================================================= */

const obraArchitecture = [

    {
        source: "obra.jpg",

        sourceWidth: 683,
        sourceHeight: 1200,

        x: 55,
        y: 250,

        w: 185,
        h: 480
    },

    {
        source: "obra.jpg",

        sourceWidth: 683,
        sourceHeight: 1200,

        x: 105,
        y: 360,

        w: 145,
        h: 255
    },

    {
        source: "obra.jpg",

        sourceWidth: 683,
        sourceHeight: 1200,

        x: 235,
        y: 175,

        w: 260,
        h: 160
    },

    {
        source: "obra.jpg",

        sourceWidth: 683,
        sourceHeight: 1200,

        x: 245,
        y: 235,

        w: 190,
        h: 235
    },

    {
        source: "obra.jpg",

        sourceWidth: 683,
        sourceHeight: 1200,

        x: 490,
        y: 330,

        w: 180,
        h: 430
    },

    {
        source: "obra.jpg",

        sourceWidth: 683,
        sourceHeight: 1200,

        x: 465,
        y: 250,

        w: 190,
        h: 300
    }

];


/* =========================================================
   LA DESPEDIDA — ZONAS ARQUITECTÓNICAS
========================================================= */

const despedidaArchitecture = [

    {
        source: "despedida.jpg",

        sourceWidth: 680,
        sourceHeight: 1000,

        x: 25,
        y: 60,

        w: 165,
        h: 470
    },

    {
        source: "despedida.jpg",

        sourceWidth: 680,
        sourceHeight: 1000,

        x: 175,
        y: 90,

        w: 165,
        h: 450
    },

    {
        source: "despedida.jpg",

        sourceWidth: 680,
        sourceHeight: 1000,

        x: 320,
        y: 65,

        w: 175,
        h: 490
    },

    {
        source: "despedida.jpg",

        sourceWidth: 680,
        sourceHeight: 1000,

        x: 455,
        y: 80,

        w: 180,
        h: 470
    }

];


const architectureBank = [

    ...obraArchitecture,
    ...despedidaArchitecture

];


/* =========================================================
   COMPOSICIÓN DE LAS 6 PUERTAS

   AQUÍ AJUSTAS POSICIÓN Y TAMAÑO.

   left  = horizontal
   top   = vertical
   width = tamaño
========================================================= */

const architectureDoorComposition = [

    {
        src: "img/puerta_01.png",

        left: "8%",
        top: "7%",

        width: 165
    },

    {
        src: "img/puerta_02.png",

        left: "23%",
        top: "20%",

        width: 120
    },

    {
        src: "img/puerta_03.png",

        left: "38%",
        top: "12%",

        width: 130
    },

    {
        src: "img/puerta_04.png",

        left: "52%",
        top: "11%",

        width: 125
    },

    {
        src: "img/puerta_05.png",

        left: "69%",
        top: "25%",

        width: 90
    },

    {
        src: "img/puerta_06.png",

        left: "82%",
        top: "6%",

        width: 160
    }

];


/* =========================================================
   CREAR PUERTA PNG

   Ya NO recortamos obra.jpg.

   Se introduce directamente
   el PNG transparente.
========================================================= */

function createDoor(item) {

    const door =
        document.createElement(
            "img"
        );


    door.className =
        "arch-door";


    door.src =
        item.src;


    door.alt =
        "";


    door.draggable =
        false;


    door.style.left =
        item.left;


    door.style.top =
        item.top;


    door.style.width =
        item.width +
        "px";


    /*
        No forzar altura.

        Así conserva la perspectiva
        y proporción del PNG.
    */

    door.style.height =
        "auto";


    architectureDoors
        .appendChild(
            door
        );


    return door;
}


/* =========================================================
   ENTER 04 — ARQUITECTURA

   Las seis puertas aparecen
   una a una.
========================================================= */

function enter04Architecture() {

    /*
        Limpiamos TEMPESTAD.
    */

    sky.style.display =
        "none";


    feet.style.display =
        "none";


    mistCanvas.style.display =
        "none";


    feetMistCanvas.style.display =
        "none";


    blackout.style.display =
        "none";


    /*
        Activamos arquitectura.
    */

    architectureStage
        .classList
        .add(
            "visible"
        );


    architectureDoors.innerHTML =
        "";


    architectureNoise.innerHTML =
        "";


    /*
        Crear PNG.
    */

    const doors =
        architectureDoorComposition.map(
            item =>
                createDoor(
                    item
                )
        );


    /*
        APARICIÓN UNO A UNO.
    */

    doors.forEach(
        (
            door,
            index
        ) => {

            setTimeout(
                () => {

                    door
                        .classList
                        .add(
                            "visible"
                        );

                },

                index *
                720

            );

        }
    );


    setSubtitle(
        "en el muro la sombra del fuego"
    );
}


/* =========================================================
   CREAR FRAGMENTO ARQUITECTÓNICO

   ENTER 05
========================================================= */

function createArchitectureChip(
    crop,
    index,
    total
) {

    const chip =
        document.createElement(
            "div"
        );


    chip.className =
        "arch-chip";


    const progress =
        index /
        total;


    /*
        Comienzan relativamente grandes.

        Después se vuelven
        cada vez más pequeños.
    */

    const baseSize =
        lerp(
            46,
            7,
            progress
        );


    const width =
        baseSize *
        (
            .65 +
            Math.random() *
            1.8
        );


    const height =
        baseSize *
        (
            .6 +
            Math.random() *
            1.25
        );


    chip.style.width =
        width +
        "px";


    chip.style.height =
        height +
        "px";


    /*
        Distribución por la pantalla.

        No es una cuadrícula.
        Conservamos espacios negros.
    */

    chip.style.left =
        (
            3 +
            Math.random() *
            94
        ) +
        "%";


    chip.style.top =
        (
            7 +
            Math.random() *
            84
        ) +
        "%";


    /*
        Fuente pictórica.
    */

    chip.style.backgroundImage =
        `url("${crop.source}")`;


    chip.style.backgroundSize =
        `${crop.sourceWidth}px ${crop.sourceHeight}px`;


    /*
        Elegimos únicamente una zona
        dentro del territorio
        arquitectónico permitido.
    */

    const maxX =
        Math.max(
            1,
            crop.w -
            width
        );


    const maxY =
        Math.max(
            1,
            crop.h -
            height
        );


    const fragmentX =
        crop.x +
        Math.random() *
        maxX;


    const fragmentY =
        crop.y +
        Math.random() *
        maxY;


    chip.style.backgroundPosition =
        `-${fragmentX}px -${fragmentY}px`;


    /*
        Segunda mitad:
        microfragmentos.
    */

    if (
        progress >
        .52
    ) {

        chip.classList.add(
            "micro"
        );

    }


    architectureNoise
        .appendChild(
            chip
        );


    return chip;
}


/* =========================================================
   ENTER 05 — RUIDO ARQUITECTÓNICO
========================================================= */

function enter05ArchitectureNoise() {

    architectureNoise.innerHTML =
        "";


    /*
        Las puertas completas
        comienzan a desaparecer.
    */

   architectureDoors
    .querySelectorAll(
        ".arch-door"
    )
    .forEach(
        (
            door,
            index
        ) => {

            setTimeout(
                () => {

                    door
                        .classList
                        .add(
                            "fade"
                        );

                },

                index * 110

            );

        }
    );

    /*
        Cantidad de fragmentos.

        360 = actual
        450 = más ruido
        550 = muy denso
    */

    const total =
        360;


    for (
        let i = 0;
        i < total;
        i++
    ) {

        const crop =
            architectureBank[
                Math.floor(
                    Math.random() *
                    architectureBank.length
                )
            ];


        const chip =
            createArchitectureChip(
                crop,
                i,
                total
            );


        const progress =
            i /
            total;


        /*
            La aparición se acelera.
        */

        const delay =
            Math.pow(
                progress,
                .67
            ) *
            5200;


        setTimeout(
            () => {

                chip
                    .classList
                    .add(
                        "visible"
                    );


                /*
                    Solo algunos titilan.

                    Evitamos que parezca
                    un glitch genérico.
                */

                if (
                    Math.random() >
                    .43
                ) {

                    chip.style.animationDelay =
                        (
                            Math.random() *
                            2.8
                        ) +
                        "s";


                    chip.style.animationDuration =
                        (
                            1.1 +
                            Math.random() *
                            2
                        ) +
                        "s";


                    chip
                        .classList
                        .add(
                            "flicker"
                        );

                }

            },

            delay
        );
    }


    setSubtitle(
        "en el fuego tu sombra y la mía"
    );
}


/* =========================================================
   AVANZAR MONTAJE
========================================================= */

function advanceMontage() {

    if (
        montageLocked
    ) {

        return;

    }


    if (
        state >= 5
    ) {

        return;

    }


    startAudio();


    if (
        audioContext &&
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();

    }


    state++;


    switch (state) {

        case 1:

            enter01();

            break;


        case 2:

            enter02();

            break;


        case 3:

            enter03();

            break;


        case 4:

            enter04Architecture();

            break;


        case 5:

            enter05ArchitectureNoise();

            break;
    }
}


/* =========================================================
   CLICK INICIAL
========================================================= */

if (enterOverlay) {

    enterOverlay
        .addEventListener(
            "click",
            event => {

                event.preventDefault();


                if (
                    state !== 0
                ) {

                    return;

                }


                advanceMontage();

            }
        );
}


/* =========================================================
   ACTIVACIÓN DE LA PIEZA DENTRO DE VIDEO.HTML
========================================================= */

const remediosSection =
    document.getElementById(
        "remediosSection"
    );


let remediosActive =
    false;


/*
    La pieza solamente responde
    al teclado cuando una parte
    importante de ella está visible.
*/

const remediosObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(
                entry => {

                    remediosActive =
                        entry.isIntersecting;

                }
            );

        },

        {
            threshold: .35
        }

    );


if (remediosSection) {

    remediosObserver.observe(
        remediosSection
    );

}


/* =========================================================
   TECLADO
========================================================= */

window.addEventListener(
    "keydown",
    event => {

        /*
            Si estamos fuera de la
            pieza, no hacemos nada.

            Esto evita interferir
            con Simulacroon.
        */

        if (!remediosActive) {

            return;

        }


        /* =========================
           ENTER
        ========================= */

        if (
            event.code ===
            "Enter"
        ) {

            event.preventDefault();

            advanceMontage();

        }


        /* =========================
           SPACE
        ========================= */

        if (
            event.code ===
            "Space"
        ) {

            event.preventDefault();


            if (
                !audioContext
            ) {

                return;

            }


            if (
                audioContext.state ===
                "running"
            ) {

                audioContext.suspend();

            }

            else {

                audioContext.resume();

            }

        }

    }
);


 })();
