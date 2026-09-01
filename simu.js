const panels = document.querySelectorAll(".panel");
const audio = document.getElementById("sound");
const cursor = document.getElementById("cursor");

const isHome = document.body.classList.contains("home");

let index = 0;
let isScrolling = false;
let audioUnlocked = false;
let touchStartY = 0;


/* =========================
INTRO: CALIBRACIÓN DE SEÑAL
========================= */

const intro = document.getElementById("intro");
const introSkip = document.getElementById("introSkip");
const introStatus = document.getElementById("introStatus");
const voltageValue = document.getElementById("voltageValue");
const voltageWave = document.getElementById("voltageWave");
const introProgress = document.getElementById("introProgress");

if (isHome && intro) {

  const introDuration = 3200;
  const introStart = performance.now();

  let introFinished = false;


  function finishIntro() {

    if (introFinished) return;

    introFinished = true;

    document.body.classList.remove("is-intro");
    document.body.classList.add("intro-complete");

    intro.setAttribute("aria-hidden", "true");

    setTimeout(() => {
      intro.remove();
    }, 900);

  }


  function animateIntro(now) {

    if (introFinished) return;

    const elapsed = now - introStart;

    const progress = Math.min(
      elapsed / introDuration,
      1
    );

    const voltage = (
      progress * 12 +
      Math.sin(elapsed * 0.018) *
      (1 - progress) *
      2.4
    ).toFixed(2);

    const amplitude =
      38 - progress * 23;

    const frequency =
      0.045 + progress * 0.035;

    const points = [];


    for (let x = 0; x <= 600; x += 8) {

      const y =
        60 +
        Math.sin(
          x * frequency +
          elapsed * 0.012
        ) *
        amplitude *
        (
          0.65 +
          Math.sin(x * 0.011) * 0.25
        );

      points.push(
        `${x === 0 ? "M" : "L"}${x} ${y.toFixed(2)}`
      );

    }


    voltageValue.textContent = voltage;

    voltageWave.setAttribute(
      "d",
      points.join(" ")
    );

    introProgress.style.width =
      `${progress * 100}%`;


    if (progress < 0.38) {

      introStatus.textContent =
        "iniciando voltaje";

    } else if (progress < 0.78) {

      introStatus.textContent =
        "calibrando oscilación";

    } else {

      introStatus.textContent =
        "señal estable";

    }


    if (progress < 1) {

      requestAnimationFrame(
        animateIntro
      );

    } else {

      setTimeout(
        finishIntro,
        260
      );

    }

  }


  introSkip.addEventListener(
    "click",
    finishIntro
  );

  requestAnimationFrame(
    animateIntro
  );

}


/* =========================
HOME: SCROLL + AUDIO
========================= */

if (isHome && panels.length > 0) {

  function showPanel(i) {

    panels.forEach((panel) => {
      panel.classList.remove("active");
    });

    panels[i].classList.add("active");

  }


  showPanel(index);


  window.addEventListener(
    "click",
    (event) => {

      if (
        document.body.classList.contains(
          "is-intro"
        )
      ) {
        return;
      }

      if (
        event.target.closest(
          "a, button, .pages-menu"
        )
      ) {
        return;
      }


      if (!audioUnlocked) {

        audio
          .play()
          .then(() => {

            audioUnlocked = true;

          })
          .catch(() => {});

      } else {

        if (audio.paused) {

          audio
            .play()
            .catch(() => {});

        } else {

          audio.pause();

        }

      }

    }
  );


  window.addEventListener(
    "wheel",
    (event) => {

      if (
        document.body.classList.contains(
          "is-intro"
        )
      ) {
        return;
      }

      if (!audioUnlocked) return;

      if (audio.paused) {
        audio.play();
      }

      if (isScrolling) return;

      isScrolling = true;


      if (event.deltaY > 0) {

        index = Math.min(
          index + 1,
          panels.length - 1
        );

      } else {

        index = Math.max(
          index - 1,
          0
        );

      }


      showPanel(index);


      setTimeout(() => {

        isScrolling = false;

      }, 700);

    }
  );


  function movePanel(direction) {

    if (
      isScrolling ||
      document.body.classList.contains(
        "is-intro"
      )
    ) {
      return;
    }

    isScrolling = true;

    index = Math.max(
      0,
      Math.min(
        index + direction,
        panels.length - 1
      )
    );

    showPanel(index);

    setTimeout(() => {

      isScrolling = false;

    }, 500);

  }


  /* =========================
  CONTROL TÁCTIL
  ========================= */

  window.addEventListener(
    "touchstart",
    (event) => {

      touchStartY =
        event.changedTouches[0].clientY;

    },
    {
      passive: true
    }
  );


  window.addEventListener(
    "touchend",
    (event) => {

      const distance =
        touchStartY -
        event.changedTouches[0].clientY;

      if (Math.abs(distance) < 45) {
        return;
      }


      if (!audioUnlocked) {

        audio
          .play()
          .then(() => {

            audioUnlocked = true;

          })
          .catch(() => {});

      }


      movePanel(
        distance > 0 ? 1 : -1
      );

    },
    {
      passive: true
    }
  );

}


/* =========================
DIRECTORIO DE PÁGINAS
========================= */

const pagesTrigger =
  document.getElementById(
    "pagesTrigger"
  );

const pagesMenu =
  document.getElementById(
    "pagesMenu"
  );

const pagesClose =
  document.getElementById(
    "pagesClose"
  );


if (
  pagesTrigger &&
  pagesMenu &&
  pagesClose
) {

  function setPagesMenu(open) {

    pagesMenu.classList.toggle(
      "is-open",
      open
    );

    pagesMenu.setAttribute(
      "aria-hidden",
      String(!open)
    );

    pagesTrigger.setAttribute(
      "aria-expanded",
      String(open)
    );

  }


  pagesTrigger.addEventListener(
    "click",
    () => {

      setPagesMenu(
        !pagesMenu.classList.contains(
          "is-open"
        )
      );

    }
  );


  pagesClose.addEventListener(
    "click",
    () => {

      setPagesMenu(false);

    }
  );


  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Escape") {

        setPagesMenu(false);

      }

    }
  );

}


/* =========================
CURSOR GLOBAL
========================= */

let mouseX =
  window.innerWidth / 2;

let mouseY =
  window.innerHeight / 2;

let currentX = mouseX;
let currentY = mouseY;


window.addEventListener(
  "mousemove",
  (event) => {

    mouseX = event.clientX;
    mouseY = event.clientY;

  }
);


function moveCursor() {

  if (cursor) {

    currentX +=
      (mouseX - currentX) * 0.15;

    currentY +=
      (mouseY - currentY) * 0.15;

    cursor.style.left =
      currentX + "px";

    cursor.style.top =
      currentY + "px";

  }

  requestAnimationFrame(
    moveCursor
  );

}


moveCursor();


/* =========================
VIDEOS CIRCULARES SCROLL
========================= */

const circleVideos =
  document.querySelectorAll(
    ".circle-video"
  );


const circleObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach(
        (entry) => {

          const video =
            entry.target;

          if (entry.isIntersecting) {

            video.classList.add(
              "visible"
            );

            video.play();

          } else {

            video.pause();
            video.currentTime = 0;

          }

        }
      );

    },
    {
      threshold: 0.6
    }
  );


circleVideos.forEach(
  (video) => {

    circleObserver.observe(video);

  }
);


/* =========================
REVEAL ELEMENTS
========================= */

const observer =
  new IntersectionObserver(
    (entries) => {

      entries.forEach(
        (entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "visible"
            );

          }

        }
      );

    },
    {
      threshold: 0.2
    }
  );


document
  .querySelectorAll(".reveal")
  .forEach((element) => {

    observer.observe(element);

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


const kinkyAudio =
  document.getElementById(
    "kinkyAudio"
  );

const kinkyPlayer =
  document.getElementById(
    "kinkyPlayer"
  );

const kinkyPlay =
  document.getElementById(
    "kinkyPlay"
  );

const kinkyPrev =
  document.getElementById(
    "kinkyPrev"
  );

const kinkyNext =
  document.getElementById(
    "kinkyNext"
  );

const kinkyNumber =
  document.getElementById(
    "kinkyNumber"
  );

const kinkyTitle =
  document.getElementById(
    "kinkyTitle"
  );

const kinkyIndicator =
  document.getElementById(
    "kinkyIndicator"
  );

const kinkySignal =
  document.getElementById(
    "kinkySignal"
  );

const kinkyStatus =
  document.getElementById(
    "kinkyStatus"
  );

const kinkyCurrent =
  document.getElementById(
    "kinkyCurrent"
  );

const kinkyDuration =
  document.getElementById(
    "kinkyDuration"
  );

const kinkyProgress =
  document.getElementById(
    "kinkyProgress"
  );

const kinkyProgressContainer =
  document.getElementById(
    "kinkyProgressContainer"
  );


let kinkyCurrentEpisode = 0;


if (
  kinkyAudio &&
  kinkyPlayer &&
  kinkyPlay &&
  kinkyPrev &&
  kinkyNext &&
  kinkyProgressContainer
) {

  /* ==================================================
  CARGAR CAPÍTULO
  ================================================== */

  function loadKinkyEpisode(index) {

    const episode =
      kinkyEpisodes[index];

    kinkyCurrentEpisode = index;

    kinkyAudio.pause();

    kinkyAudio.src =
      episode.file;

    kinkyAudio.load();

    kinkyNumber.textContent =
      episode.number;

    kinkyTitle.textContent =
      episode.title;

    kinkyCurrent.textContent =
      "00:00";

    kinkyDuration.textContent =
      "00:00";

    kinkyProgress.style.width =
      "0%";

    kinkySignal.textContent =
      "░░░░░░░░░░";

    kinkyStatus.textContent =
      "LOADING";

    kinkyIndicator.textContent =
      "○";

    kinkyPlay.textContent =
      "PLAY";

    kinkyPlayer.classList.remove(
      "playing"
    );

  }


  /* ==================================================
  PLAY / PAUSE
  ================================================== */

  kinkyPlay.addEventListener(
    "click",
    async () => {

      if (kinkyAudio.paused) {

        try {

          await kinkyAudio.play();

        } catch (error) {

          console.error(
            "ERROR DE AUDIO:",
            error
          );

          kinkyStatus.textContent =
            "ERROR";

        }

      } else {

        kinkyAudio.pause();

      }

    }
  );


  /* ==================================================
  AUDIO LISTO
  ================================================== */

  kinkyAudio.addEventListener(
    "loadedmetadata",
    () => {

      kinkyDuration.textContent =
        kinkyFormatTime(
          kinkyAudio.duration
        );

      kinkyStatus.textContent =
        "READY";

    }
  );


  /* ==================================================
  PLAY
  ================================================== */

  kinkyAudio.addEventListener(
    "play",
    () => {

      kinkyPlay.textContent =
        "PAUSE";

      kinkyStatus.textContent =
        "ONLINE";

      kinkyIndicator.textContent =
        "●";

      kinkyPlayer.classList.add(
        "playing"
      );

    }
  );


  /* ==================================================
  PAUSE
  ================================================== */

  kinkyAudio.addEventListener(
    "pause",
    () => {

      kinkyPlay.textContent =
        "PLAY";

      kinkyStatus.textContent =
        "PAUSED";

      kinkyIndicator.textContent =
        "○";

      kinkyPlayer.classList.remove(
        "playing"
      );

    }
  );


  /* ==================================================
  ERROR
  ================================================== */

  kinkyAudio.addEventListener(
    "error",
    () => {

      console.error(
        "No se pudo cargar:",
        kinkyAudio.src
      );

      kinkyStatus.textContent =
        "AUDIO ERROR";

    }
  );


  /* ==================================================
  PROGRESO
  ================================================== */

  kinkyAudio.addEventListener(
    "timeupdate",
    () => {

      if (
        !Number.isFinite(
          kinkyAudio.duration
        )
      ) {
        return;
      }

      const percentage =
        (
          kinkyAudio.currentTime /
          kinkyAudio.duration
        ) * 100;

      kinkyProgress.style.width =
        percentage + "%";

      kinkyCurrent.textContent =
        kinkyFormatTime(
          kinkyAudio.currentTime
        );

      const totalBars = 10;

      const activeBars =
        Math.floor(
          percentage / 10
        );

      kinkySignal.textContent =
        "█".repeat(activeBars) +
        "░".repeat(
          totalBars - activeBars
        );

    }
  );


  /* ==================================================
  CLICK EN BARRA
  ================================================== */

  kinkyProgressContainer.addEventListener(
    "click",
    (event) => {

      if (
        !Number.isFinite(
          kinkyAudio.duration
        )
      ) {
        return;
      }

      const rect =
        kinkyProgressContainer
          .getBoundingClientRect();

      const position =
        event.clientX -
        rect.left;

      const percentage =
        position /
        rect.width;

      kinkyAudio.currentTime =
        percentage *
        kinkyAudio.duration;

    }
  );


  /* ==================================================
  ANTERIOR
  ================================================== */

  kinkyPrev.addEventListener(
    "click",
    () => {

      kinkyCurrentEpisode--;

      if (
        kinkyCurrentEpisode < 0
      ) {

        kinkyCurrentEpisode =
          kinkyEpisodes.length - 1;

      }

      loadKinkyEpisode(
        kinkyCurrentEpisode
      );

    }
  );


  /* ==================================================
  SIGUIENTE
  ================================================== */

  kinkyNext.addEventListener(
    "click",
    () => {

      kinkyCurrentEpisode++;

      if (
        kinkyCurrentEpisode >=
        kinkyEpisodes.length
      ) {

        kinkyCurrentEpisode = 0;

      }

      loadKinkyEpisode(
        kinkyCurrentEpisode
      );

    }
  );


  /* ==================================================
  FINAL DEL CAPÍTULO
  ================================================== */

  kinkyAudio.addEventListener(
    "ended",
    () => {

      kinkyStatus.textContent =
        "COMPLETE";

      kinkyIndicator.textContent =
        "○";

      kinkyPlay.textContent =
        "PLAY";

      kinkyPlayer.classList.remove(
        "playing"
      );

      kinkyProgress.style.width =
        "0%";

      kinkyCurrent.textContent =
        "00:00";

    }
  );


  /* ==================================================
  FORMATO DE TIEMPO
  ================================================== */

  function kinkyFormatTime(seconds) {

    if (
      !Number.isFinite(seconds)
    ) {
      return "00:00";
    }

    const minutes =
      Math.floor(
        seconds / 60
      );

    const secondsRest =
      Math.floor(
        seconds % 60
      );

    return (
      String(minutes).padStart(
        2,
        "0"
      ) +
      ":" +
      String(secondsRest).padStart(
        2,
        "0"
      )
    );

  }


  /* ==================================================
  INICIAR
  ================================================== */

  loadKinkyEpisode(0);

}


/* ==================================================
FRAGMENTO
SPATIAL VIDEO MEMORY
================================================== */

const fragmentoStage =
  document.getElementById(
    "fragmentoStage"
  );

const fragmentoVideo =
  document.getElementById(
    "fragmentoVideo"
  );


if (
  fragmentoStage &&
  fragmentoVideo
) {

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


  for (
    let i = 0;
    i < FRAME_COUNT;
    i++
  ) {

    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.classList.add(
      "fragmento-frame"
    );

    canvas.width = 840;
    canvas.height = 472;

    fragmentoStage.appendChild(
      canvas
    );

    const context =
      canvas.getContext("2d");

    frames.push({

      canvas: canvas,

      ctx: context,

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

  let fragmentMouseX = 0;
  let fragmentMouseY = 0;

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
      fragmentoVideo.readyState >= 2 &&
      fragmentoVideo.videoWidth > 0
    ) {

      frames.forEach(
        (frame) => {

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

  function animateFragmento() {

    /*
    Suavizamos el movimiento
    del mouse.
    */

    fragmentMouseX +=
      (
        targetMouseX -
        fragmentMouseX
      ) *
      SMOOTHNESS;

    fragmentMouseY +=
      (
        targetMouseY -
        fragmentMouseY
      ) *
      SMOOTHNESS;


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
            fragmentMouseX *
            MOUSE_X_INFLUENCE *
            depthFactor
          );


        /*
        Movimiento vertical.
        */

        frame.targetY =
          BASE_Y +
          (
            fragmentMouseY *
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

  fragmentoVideo
    .play()
    .catch(() => {

      /*
      Si el navegador bloquea
      autoplay, esperamos una
      interacción del usuario.
      */

      window.addEventListener(
        "click",
        () => {

          fragmentoVideo.play();

        },
        {
          once: true
        }
      );

    });


  drawVideo();
  animateFragmento();

}




