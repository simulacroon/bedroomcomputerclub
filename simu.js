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
   SIMULACROON // AUDIO TRANSMISSION SYSTEM
================================================== */


/* =========================
   EPISODIOS
========================= */

const transmissions = [

  {
    number: "001",

    title: "memoria de un sistema",

    description:
      "registro de campo // señal desconocida",

    file:
      "audio/podcast-001.mp3"
  },


  {
    number: "002",

    title: "feudalismo digital",

    description:
      "archivo interceptado // estructuras de control",

    file:
      "audio/podcast-002.mp3"
  },


  {
    number: "003",

    title: "distantes hologramas",

    description:
      "transmisión remota // memoria digital",

    file:
      "audio/podcast-003.mp3"
  }

];


/* =========================
   ELEMENTOS
========================= */

const signalAudio =
  document.getElementById("signalAudio");

const playSignal =
  document.getElementById("playSignal");

const prevEpisode =
  document.getElementById("prevEpisode");

const nextEpisode =
  document.getElementById("nextEpisode");

const signalPlayer =
  document.getElementById("signalPlayer");

const episodeNumber =
  document.getElementById("episodeNumber");

const episodeTitle =
  document.getElementById("episodeTitle");

const episodeDescription =
  document.getElementById("episodeDescription");

const signalProgress =
  document.getElementById("signalProgress");

const signalProgressBox =
  document.getElementById("signalProgressBox");

const signalTime =
  document.getElementById("signalTime");

const signalStatus =
  document.getElementById("signalStatus");

const signalText =
  document.getElementById("signalText");

const signalIndicator =
  document.getElementById("signalIndicator");

const signalBars =
  document.getElementById("signalBars");


/* =========================
   EPISODIO ACTUAL
========================= */

let currentEpisode = 0;


/* =========================
   CARGAR EPISODIO
========================= */

function loadTransmission(index) {

  const transmission =
    transmissions[index];

  currentEpisode = index;

  signalAudio.src =
    transmission.file;

  episodeNumber.textContent =
    transmission.number;

  episodeTitle.textContent =
    transmission.title;

  episodeDescription.textContent =
    transmission.description;

  signalProgress.style.width =
    "0%";

  signalTime.textContent =
    "00:00";

  signalStatus.textContent =
    "STANDBY";

  signalText.textContent =
    "WAITING FOR SIGNAL...";

  signalIndicator.textContent =
    "○";

  playSignal.textContent =
    "▶";

  signalPlayer.classList.remove("active");

}


/* =========================
   PLAY / PAUSE
========================= */

playSignal.addEventListener("click", () => {

  if (signalAudio.paused) {

    signalAudio.play();

  } else {

    signalAudio.pause();

  }

});


/* =========================
   PLAY
========================= */

signalAudio.addEventListener("play", () => {

  playSignal.textContent =
    "Ⅱ";

  signalPlayer.classList.add("active");

  signalStatus.textContent =
    "ONLINE";

  signalText.textContent =
    "TRANSMISSION ACTIVE";

  signalIndicator.textContent =
    "●";

});


/* =========================
   PAUSE
========================= */

signalAudio.addEventListener("pause", () => {

  playSignal.textContent =
    "▶";

  signalPlayer.classList.remove("active");

  signalStatus.textContent =
    "PAUSED";

  signalText.textContent =
    "SIGNAL INTERRUPTED";

  signalIndicator.textContent =
    "○";

});


/* =========================
   TIEMPO / PROGRESO
========================= */

signalAudio.addEventListener(
  "timeupdate",
  () => {

    if (!signalAudio.duration)
      return;

    const percentage =
      (signalAudio.currentTime /
      signalAudio.duration) * 100;

    signalProgress.style.width =
      percentage + "%";

    signalTime.textContent =
      formatSignalTime(
        signalAudio.currentTime
      );

  }
);


/* =========================
   CLICK EN LA BARRA
========================= */

signalProgressBox.addEventListener(
  "click",
  (event) => {

    if (!signalAudio.duration)
      return;

    const rect =
      signalProgressBox
      .getBoundingClientRect();

    const position =
      event.clientX - rect.left;

    const percentage =
      position / rect.width;

    signalAudio.currentTime =
      percentage *
      signalAudio.duration;

  }
);


/* =========================
   ANTERIOR
========================= */

prevEpisode.addEventListener(
  "click",
  () => {

    currentEpisode--;

    if (currentEpisode < 0) {

      currentEpisode =
        transmissions.length - 1;

    }

    loadTransmission(currentEpisode);

  }
);


/* =========================
   SIGUIENTE
========================= */

nextEpisode.addEventListener(
  "click",
  () => {

    currentEpisode++;

    if (
      currentEpisode >=
      transmissions.length
    ) {

      currentEpisode = 0;

    }

    loadTransmission(currentEpisode);

  }
);


/* =========================
   CUANDO TERMINA
========================= */

signalAudio.addEventListener(
  "ended",
  () => {

    signalStatus.textContent =
      "END";

    signalText.textContent =
      "TRANSMISSION COMPLETE";

    signalIndicator.textContent =
      "○";

    signalPlayer.classList.remove(
      "active"
    );

    playSignal.textContent =
      "▶";

    signalProgress.style.width =
      "0%";

  }
);


/* =========================
   FORMATO DE TIEMPO
========================= */

function formatSignalTime(seconds) {

  const minutes =
    Math.floor(seconds / 60);

  const secs =
    Math.floor(seconds % 60);

  return (
    String(minutes)
      .padStart(2, "0")
    +
    ":" +
    String(secs)
      .padStart(2, "0")
  );

}


/* =========================
   CARGAR PRIMERA TRANSMISIÓN
========================= */

loadTransmission(0);
