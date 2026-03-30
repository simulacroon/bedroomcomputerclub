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


