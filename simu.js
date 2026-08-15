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
   SIMULACROON
   VIDEO FRAGMENTATION SYSTEM
================================================== */


const fragmentVideo =
  document.getElementById("fragmentVideo");

const fragmentCanvas =
  document.getElementById("fragmentCanvas");

const fragmentFrame =
  document.getElementById("fragmentFrame");


if (
  fragmentVideo &&
  fragmentCanvas
) {


  const ctx =
    fragmentCanvas.getContext("2d");


  /* =========================
     CONFIGURACIÓN
  ========================= */

  const fragmentColumns = 5;

  const fragmentRows = 4;

  const fragmentCount =
    fragmentColumns * fragmentRows;


  /*
    intensidad de desplazamiento
  */

  const displacement = 90;


  /*
    profundidad
  */

  const depth = 1;


  /* =========================
     MOUSE
  ========================= */

  let fragmentMouseX = 0.5;

  let fragmentMouseY = 0.5;


  let smoothMouseX = 0.5;

  let smoothMouseY = 0.5;


  fragmentCanvas.addEventListener(
    "mousemove",
    (event) => {

      const rect =
        fragmentCanvas.getBoundingClientRect();


      fragmentMouseX =
        (event.clientX - rect.left) /
        rect.width;


      fragmentMouseY =
        (event.clientY - rect.top) /
        rect.height;

    }
  );


  fragmentCanvas.addEventListener(
    "mouseleave",
    () => {

      fragmentMouseX = 0.5;

      fragmentMouseY = 0.5;

    }
  );


  /* =========================
     RESIZE
  ========================= */

  function resizeFragmentCanvas() {

    const rect =
      fragmentCanvas.getBoundingClientRect();


    const dpr =
      window.devicePixelRatio || 1;


    fragmentCanvas.width =
      rect.width * dpr;


    fragmentCanvas.height =
      rect.height * dpr;


    ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );

  }


  window.addEventListener(
    "resize",
    resizeFragmentCanvas
  );


  resizeFragmentCanvas();


  /* =========================
     DRAW
  ========================= */

  function drawFragments() {


    if (
      fragmentVideo.readyState <
      2
    ) {

      requestAnimationFrame(
        drawFragments
      );

      return;

    }


    const width =
      fragmentCanvas.clientWidth;


    const height =
      fragmentCanvas.clientHeight;


    /*
      suavizar movimiento
    */

    smoothMouseX +=
      (
        fragmentMouseX -
        smoothMouseX
      ) * 0.08;


    smoothMouseY +=
      (
        fragmentMouseY -
        smoothMouseY
      ) * 0.08;


    /*
      limpiar canvas
    */

    ctx.clearRect(
      0,
      0,
      width,
      height
    );


    /*
      dimensiones de cada fragmento
    */

    const cellWidth =
      width /
      fragmentColumns;


    const cellHeight =
      height /
      fragmentRows;


    /*
      dimensiones reales del video
    */

    const videoWidth =
      fragmentVideo.videoWidth;


    const videoHeight =
      fragmentVideo.videoHeight;


    /*
      recorrer fragmentos
    */

    let fragmentIndex = 0;


    for (
      let row = 0;
      row < fragmentRows;
      row++
    ) {


      for (
        let col = 0;
        col < fragmentColumns;
        col++
      ) {


        /*
          posición original
        */

        const sourceX =
          (col / fragmentColumns) *
          videoWidth;


        const sourceY =
          (row / fragmentRows) *
          videoHeight;


        const sourceWidth =
          videoWidth /
          fragmentColumns;


        const sourceHeight =
          videoHeight /
          fragmentRows;


        /*
          posición del fragmento
        */

        const originalX =
          col *
          cellWidth;


        const originalY =
          row *
          cellHeight;


        /*
          distancia respecto al mouse
        */

        const centerX =
          col /
          (fragmentColumns - 1);


        const centerY =
          row /
          (fragmentRows - 1);


        const distanceX =
          centerX -
          smoothMouseX;


        const distanceY =
          centerY -
          smoothMouseY;


        /*
          profundidad
        */

        const force =
          1 -
          Math.sqrt(
            distanceX * distanceX +
            distanceY * distanceY
          );


        /*
          desplazamiento
        */

        const moveX =
          distanceX *
          displacement *
          force;


        const moveY =
          distanceY *
          displacement *
          force;


        /*
          pequeño movimiento adicional
        */

        const floatX =
          Math.sin(
            performance.now() * 0.0008 +
            fragmentIndex
          ) * 3;


        const floatY =
          Math.cos(
            performance.now() * 0.0007 +
            fragmentIndex
          ) * 3;


        /*
          posición final
        */

        const drawX =
          originalX +
          moveX +
          floatX;


        const drawY =
          originalY +
          moveY +
          floatY;


        /*
          dibujar fragmento
        */

        ctx.drawImage(

          fragmentVideo,

          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,

          drawX,
          drawY,

          cellWidth,
          cellHeight

        );


        /*
          líneas de separación
        */

        ctx.strokeStyle =
          "rgba(255,255,255,.15)";

        ctx.lineWidth = 1;


        ctx.strokeRect(
          drawX,
          drawY,
          cellWidth,
          cellHeight
        );


        fragmentIndex++;

      }

    }


    /*
      número de frame aproximado
    */

    const frame =
      Math.floor(
        fragmentVideo.currentTime *
        24
      );


    fragmentFrame.textContent =
      "FRAME_" +
      String(frame)
        .padStart(3, "0");


    requestAnimationFrame(
      drawFragments
    );

  }


  fragmentVideo.addEventListener(
    "loadeddata",
    () => {

      drawFragments();

    }
  );


  /*
    por si el video ya estaba cargado
  */

  if (
    fragmentVideo.readyState >= 2
  ) {

    drawFragments();

  }

}
