const panels = document.querySelectorAll('.panel');
const audio = document.getElementById('sound');

let index = 0;
let isScrolling = false;
let audioUnlocked = false;

function showPanel(i) {
  panels.forEach(p => p.classList.remove('active'));
  panels[i].classList.add('active');
}

showPanel(index);

// PRIMER CLICK → desbloquea audio
window.addEventListener('click', () => {
  if (!audioUnlocked) {
    audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
      audioUnlocked = true;
      console.log('Audio desbloqueado');
    }).catch(err => {
      console.log('No se pudo desbloquear audio', err);
    });
  } else {
    // si ya estaba sonando → apagar
    audio.pause();
    audio.currentTime = 0;
  }
});

// SCROLL → imagen + sonido
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

const cursor = document.getElementById('cursor');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function moveCursor() {
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
  requestAnimationFrame(moveCursor);
}

moveCursor();
