const panels = document.querySelectorAll('.panel');
const audio = document.getElementById('sound');
const cursor = document.getElementById('cursor');

const isHome = document.body.classList.contains('home');

let index = 0;
let isScrolling = false;
let audioUnlocked = false;

/* =========================
   HOME: scroll + audio
========================= */
if (isHome && panels.length > 0) {

  function showPanel(i) {
    panels.forEach(p => p.classList.remove('active'));
    panels[i].classList.add('active');
  }

  showPanel(index);

  window.addEventListener('click', () => {
    if (!audioUnlocked) {
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
        audioUnlocked = true;
      }).catch(() => {});
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  });

  window.addEventListener('wheel', (e) => {
    if (!audioUnlocked) return;
    if (audio.paused) audio.play();
    if (isScrolling) return;

    isScrolling = true;

    if (e.deltaY > 0) {
      index = Math.min(index + 1, panels.length - 1);
    } else {
      index = Math.max(index - 1, 0);
    }

    showPanel(index);

    setTimeout(() => {
      isScrolling = false;
    }, 700);
  });

}

/* =========================
   CURSOR GLOBAL
========================= */

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let currentX = mouseX;
let currentY = mouseY;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function moveCursor() {
  if (cursor) {
    currentX += (mouseX - currentX) * 0.15;
    currentY += (mouseY - currentY) * 0.15;

    cursor.style.left = currentX + 'px';
    cursor.style.top = currentY + 'px';
  }

  requestAnimationFrame(moveCursor);
}


moveCursor();



// ===== videos circulares scroll =====

const circleVideos = document.querySelectorAll(".circle-video");

const circleObserver = new IntersectionObserver((entries)=>{

  entries.forEach(entry=>{

    const vid = entry.target;

    if(entry.isIntersecting){
      vid.classList.add("visible");
      vid.play();
    }else{
      vid.pause();
      vid.currentTime = 0;
    }

  });

},{
  threshold:0.6
});

circleVideos.forEach(v => circleObserver.observe(v));


const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
    }
  });
},{
  threshold:0.2
});

document.querySelectorAll(".reveal").forEach(el=>{
  observer.observe(el);
});



/* ==================================================
   KINKYCUIR // FLOATING ASCII AUDIO PLAYER
================================================== */

const kinkyEpisodes = [

  {
    number: "001",
    title: "Bondage y Consentimiento",
    file: "audio/cap1.m4a"
  },

  {
    number: "002",
    title: "Derecho al placer disca",
    file: "audio/cap2.m4a"
  },

  {
    number: "003",
    title: "Punto G — guía",
    file: "audio/cap3.m4a"
  }

];


const kinkyAudio = document.getElementById("kinkyAudio");
const kinkyPlayer = document.getElementById("kinkyPlayer");

const kinkyPlay = document.getElementById("kinkyPlay");
const kinkyPrev = document.getElementById("kinkyPrev");
const kinkyNext = document.getElementById("kinkyNext");

const kinkyNumber = document.getElementById("kinkyNumber");
const kinkyTitle = document.getElementById("kinkyTitle");

const kinkyIndicator = document.getElementById("kinkyIndicator");
const kinkySignal = document.getElementById("kinkySignal");
const kinkyStatus = document.getElementById("kinkyStatus");

const kinkyCurrent = document.getElementById("kinkyCurrent");
const kinkyDuration = document.getElementById("kinkyDuration");

const kinkyProgress = document.getElementById("kinkyProgress");
const kinkyProgressContainer =
  document.getElementById("kinkyProgressContainer");


let kinkyCurrentEpisode = 0;


/* ==================================================
   CARGAR CAPÍTULO
================================================== */

function loadKinkyEpisode(index) {

  const episode = kinkyEpisodes[index];

  kinkyCurrentEpisode = index;

  kinkyAudio.pause();

  kinkyAudio.src = episode.file;

  kinkyAudio.load();

  kinkyNumber.textContent = episode.number;
  kinkyTitle.textContent = episode.title;

  kinkyCurrent.textContent = "00:00";
  kinkyDuration.textContent = "00:00";

  kinkyProgress.style.width = "0%";

  kinkySignal.textContent = "░░░░░░░░░░";

  kinkyStatus.textContent = "LOADING";

  kinkyIndicator.textContent = "○";

  kinkyPlay.textContent = "PLAY";

  kinkyPlayer.classList.remove("playing");

}


/* ==================================================
   PLAY / PAUSE
================================================== */

kinkyPlay.addEventListener("click", async () => {

  if (kinkyAudio.paused) {

    try {

      await kinkyAudio.play();

    } catch (error) {

      console.error("ERROR DE AUDIO:", error);

      kinkyStatus.textContent = "ERROR";

    }

  } else {

    kinkyAudio.pause();

  }

});


/* ==================================================
   AUDIO LISTO
================================================== */

kinkyAudio.addEventListener("loadedmetadata", () => {

  kinkyDuration.textContent =
    kinkyFormatTime(kinkyAudio.duration);

  kinkyStatus.textContent = "READY";

});


/* ==================================================
   PLAY
================================================== */

kinkyAudio.addEventListener("play", () => {

  kinkyPlay.textContent = "PAUSE";

  kinkyStatus.textContent = "ONLINE";

  kinkyIndicator.textContent = "●";

  kinkyPlayer.classList.add("playing");

});


/* ==================================================
   PAUSE
================================================== */

kinkyAudio.addEventListener("pause", () => {

  kinkyPlay.textContent = "PLAY";

  kinkyStatus.textContent = "PAUSED";

  kinkyIndicator.textContent = "○";

  kinkyPlayer.classList.remove("playing");

});


/* ==================================================
   ERROR
================================================== */

kinkyAudio.addEventListener("error", () => {

  console.error(
    "No se pudo cargar:",
    kinkyAudio.src
  );

  kinkyStatus.textContent = "AUDIO ERROR";

});


/* ==================================================
   PROGRESO
================================================== */

kinkyAudio.addEventListener("timeupdate", () => {

  if (!Number.isFinite(kinkyAudio.duration)) {
    return;
  }

  const percentage =
    (kinkyAudio.currentTime /
    kinkyAudio.duration) * 100;

  kinkyProgress.style.width =
    percentage + "%";

  kinkyCurrent.textContent =
    kinkyFormatTime(kinkyAudio.currentTime);


  const totalBars = 10;

  const activeBars =
    Math.floor(percentage / 10);

  kinkySignal.textContent =
    "█".repeat(activeBars) +
    "░".repeat(totalBars - activeBars);

});


/* ==================================================
   CLICK EN BARRA
================================================== */

kinkyProgressContainer.addEventListener("click", (event) => {

  if (!Number.isFinite(kinkyAudio.duration)) {
    return;
  }

  const rect =
    kinkyProgressContainer.getBoundingClientRect();

  const position =
    event.clientX - rect.left;

  const percentage =
    position / rect.width;

  kinkyAudio.currentTime =
    percentage * kinkyAudio.duration;

});


/* ==================================================
   ANTERIOR
================================================== */

kinkyPrev.addEventListener("click", () => {

  kinkyCurrentEpisode--;

  if (kinkyCurrentEpisode < 0) {
    kinkyCurrentEpisode =
      kinkyEpisodes.length - 1;
  }

  loadKinkyEpisode(kinkyCurrentEpisode);

});


/* ==================================================
   SIGUIENTE
================================================== */

kinkyNext.addEventListener("click", () => {

  kinkyCurrentEpisode++;

  if (
    kinkyCurrentEpisode >=
    kinkyEpisodes.length
  ) {
    kinkyCurrentEpisode = 0;
  }

  loadKinkyEpisode(kinkyCurrentEpisode);

});


/* ==================================================
   FINAL DEL CAPÍTULO
================================================== */

kinkyAudio.addEventListener("ended", () => {

  kinkyStatus.textContent = "COMPLETE";

  kinkyIndicator.textContent = "○";

  kinkyPlay.textContent = "PLAY";

  kinkyPlayer.classList.remove("playing");

  kinkyProgress.style.width = "0%";

  kinkyCurrent.textContent = "00:00";

});


/* ==================================================
   FORMATO DE TIEMPO
================================================== */

function kinkyFormatTime(seconds) {

  if (!Number.isFinite(seconds)) {
    return "00:00";
  }

  const minutes =
    Math.floor(seconds / 60);

  const secondsRest =
    Math.floor(seconds % 60);

  return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(secondsRest).padStart(2, "0")
  );

}


/* ==================================================
   INICIAR
================================================== */

loadKinkyEpisode(0);


/* ==================================================
   FRAGMENTO
   SPATIAL VIDEO MEMORY
================================================== */

const fragmentoStage =
  document.getElementById("fragmentoStage");

const fragmentoVideo =
  document.getElementById("fragmentoVideo");


if (fragmentoStage && fragmentoVideo) {
   
   let fragmentoActive = false;


const fragmentoObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                entry => {

                    fragmentoActive =
                        entry.isIntersecting;

                    if (fragmentoActive) {

                        fragmentoVideo
                            .play()
                            .catch(() => {});

                    }

                    else {

                        fragmentoVideo.pause();

                    }

                }
            );

        },
        {
            threshold: 0.1
        }
    );


fragmentoObserver.observe(
    fragmentoStage
);

  /* ==================================================
     CONFIGURACIÓN
  ================================================== */

  const FRAME_COUNT = 9;

  /*
    Distancia entre las capas.

    Mientras mayor sea este número,
    más separadas estarán en profundidad.
  */

  const Z_SPACING = 55;


  /*
    Movimiento horizontal provocado
    por el mouse.
  */

  const MOUSE_X_INFLUENCE = 260;


  /*
    Movimiento vertical.
  */

  const MOUSE_Y_INFLUENCE = 130;


  /*
    Qué tan suave es el movimiento.

    0.02 = muy lento
    0.05 = suave
    0.10 = rápido
  */

  const SMOOTHNESS = 0.045;


  /*
    Separación inicial de las imágenes.
  */

  const BASE_X = 0;

  const BASE_Y = 0;


  /* ==================================================
     CREAR CANVAS
  ================================================== */

  const frames = [];


  for (let i = 0; i < FRAME_COUNT; i++) {

    const canvas =
      document.createElement("canvas");


    canvas.classList.add(
      "fragmento-frame"
    );


    canvas.width = 840;
    canvas.height = 472;


    fragmentoStage.appendChild(
      canvas
    );


    const ctx =
      canvas.getContext("2d");


    frames.push({

      canvas: canvas,

      ctx: ctx,

      index: i,

      x: 0,

      y: 0,

      z: -(i * Z_SPACING),

      targetX: 0,

      targetY: 0

    });

  }


  /* ==================================================
     MOUSE
  ================================================== */

  let mouseX = 0;

  let mouseY = 0;


  let targetMouseX = 0;

  let targetMouseY = 0;


  window.addEventListener(
    "mousemove",
    (event) => {

      targetMouseX =
        (
          event.clientX /
          window.innerWidth
        ) * 2 - 1;


      targetMouseY =
        (
          event.clientY /
          window.innerHeight
        ) * 2 - 1;

    }
  );


  /* ==================================================
     DIBUJAR VIDEO
  ================================================== */

 function drawVideo() {

    if (
        fragmentoActive &&
        fragmentoVideo.readyState >= 2 &&
        fragmentoVideo.videoWidth > 0
    ) {

        frames.forEach(
            frame => {

                frame.ctx.drawImage(
                    fragmentoVideo,
                    0,
                    0,
                    frame.canvas.width,
                    frame.canvas.height
                );

            }
        );

    }

    requestAnimationFrame(
        drawVideo
    );

}


  /* ==================================================
     ANIMACIÓN
  ================================================== */

 if (!fragmentoActive) {

    requestAnimationFrame(
        animateFragmento
    );

    return;

}
   
   function animateFragmento() {

    /*
      Suavizamos el movimiento
      del mouse.
    */

    mouseX +=
      (
        targetMouseX - mouseX
      ) * SMOOTHNESS;


    mouseY +=
      (
        targetMouseY - mouseY
      ) * SMOOTHNESS;


    frames.forEach(
      (frame) => {

        /*
          Cada frame tiene una
          sensibilidad diferente.

          Los frames del fondo
          se mueven menos.
        */

        const depthFactor =
          1 -
          (
            frame.index /
            FRAME_COUNT
          );


        /*
          Movimiento horizontal.
        */

        frame.targetX =
          BASE_X +
          (
            mouseX *
            MOUSE_X_INFLUENCE *
            depthFactor
          );


        /*
          Movimiento vertical.
        */

        frame.targetY =
          BASE_Y +
          (
            mouseY *
            MOUSE_Y_INFLUENCE *
            depthFactor
          );


        /*
          Movimiento suave.
        */

        frame.x +=
          (
            frame.targetX -
            frame.x
          ) *
          SMOOTHNESS;


        frame.y +=
          (
            frame.targetY -
            frame.y
          ) *
          SMOOTHNESS;


        /*
          Posición 3D.

          IMPORTANTE:

          No hay rotateX.
          No hay rotateY.
          No hay rotateZ.

          Las imágenes permanecen
          completamente planas.
        */

        frame.canvas.style.transform =

          `translate3d(
            calc(-50% + ${frame.x}px),
            calc(-50% + ${frame.y}px),
            ${frame.z}px
          )`;

      }
    );


    requestAnimationFrame(
      animateFragmento
    );

  }


  /* ==================================================
     INICIAR
  ================================================== */



  drawVideo();

  animateFragmento();

}



