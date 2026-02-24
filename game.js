const URL = "https://teachablemachine.withgoogle.com/models/ncNl-zz7h/";

let model, webcam;
let lastGesture = "";

const asciiEl = document.getElementById("ascii");

const badChars = "@#$%&*+=-:/\\|{}[]<>░▒▓█";

const poems = [
`el cuerpo recuerda
antes que la máquina
el gesto abre
la señal fluye`,

`no controles
respira
la imagen
te reconoce`,

`la cámara observa
pero eres tú
quien activa
el organismo`
];

// -------- INIT --------
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  console.log("cargando modelo...");
  model = await tmImage.load(modelURL, metadataURL);
  console.log("modelo cargado");

  webcam = new tmImage.Webcam(320, 240, true);
  await webcam.setup();
  await webcam.play();

  document.body.appendChild(webcam.canvas);
  webcam.canvas.style.display = "none";

  requestAnimationFrame(loop);
}

// -------- LOOP --------
async function loop() {
  webcam.update();

  const prediction = await model.predict(webcam.canvas);

  for (let i = 0; i < prediction.length; i++) {
    console.log(
      prediction[i].className,
      prediction[i].probability.toFixed(2)
    );

    if (prediction[i].className === "mal" && prediction[i].probability > 0.9) {
    generateBrokenAscii();
    }

    if (prediction[i].className === "bien" && prediction[i].probability > 0.9) {
    generatePoem();
    }

    if (prediction[i].className === "stop" && prediction[i].probability > 0.9) {
    clearScreen();
    }

  }

  requestAnimationFrame(loop);
}



// -------- GESTOS --------
function react(gesture) {
  if (gesture === "mal") showBrokenAscii();
  if (gesture === "bien") showPoem();
  if (gesture === "stop") fadeOut();
}

// -------- VISUALES --------
function showBrokenAscii() {
  let output = "";
  const cols = Math.floor(window.innerWidth / 8);
  const rows = Math.floor(window.innerHeight / 12);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      output += badChars[Math.floor(Math.random() * badChars.length)];
    }
    output += "\n";
  }

  asciiEl.style.opacity = 1;
  asciiEl.innerText = output;
}

function showPoem() {
  const poem = poems[Math.floor(Math.random() * poems.length)];
  const repeat = Math.floor(window.innerHeight / 60);

  asciiEl.style.opacity = 1;
  asciiEl.innerText = poem.repeat(repeat);
}

function fadeOut() {
  asciiEl.style.transition = "opacity 1.2s ease";
  asciiEl.style.opacity = 0;

  setTimeout(() => {
    asciiEl.innerText = "";
    asciiEl.style.transition = "";
  }, 1200);
}

// -------- BOTÓN --------
document.getElementById("start").addEventListener("click", async () => {
  document.getElementById("start").style.display = "none";
  await init();
});



function generateBrokenAscii() {
  let output = "";
  const badChars = "@#$%&*+=-:/\\|{}[]<>";

  for (let i = 0; i < 2000; i++) {
    output += badChars.charAt(Math.floor(Math.random() * badChars.length));
    if (i % 80 === 0) output += "\n";
  }

  document.getElementById("ascii").innerText = output;
}

function generatePoem() {
  const poems = [
    "la pantalla respira\ncomo un animal lento\n",
    "datos caen\ncomo lluvia artificial\n",
    "el gesto abre\nun poema eléctrico\n"
  ];

  let poem = poems[Math.floor(Math.random() * poems.length)];
  document.getElementById("ascii").innerText = poem.repeat(30);
}

function clearScreen() {
  document.getElementById("ascii").innerText = "";
}
