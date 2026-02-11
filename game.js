const URL = "https://teachablemachine.withgoogle.com/models/ncNl-zz7h/";

let model, webcam;
let currentGesture = "";

const badChars = "@#$%&*+=-:/\\|{}[]<>";

const poems = [
  "la pantalla respira\ncomo un animal lento\n",
  "datos caen\ncomo lluvia artificial\n",
  "el gesto abre\nun poema eléctrico\n"
];

async function setup() {
  noCanvas();

  await loadModel();
  await setupWebcam();
  loopPrediction();
}

async function loadModel() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";
  model = await tmImage.load(modelURL, metadataURL);
}

async function setupWebcam() {
  webcam = new tmImage.Webcam(320, 240, true);
  await webcam.setup();   // 👈 AQUÍ pide permisos
  await webcam.play();
}

async function loopPrediction() {
  webcam.update();

  const predictions = await model.predict(webcam.canvas);
  let best = predictions.reduce((a, b) => a.probability > b.probability ? a : b);

  if (best.probability > 0.85) {
    currentGesture = best.className;
    reactToGesture(currentGesture);
  }

  requestAnimationFrame(loopPrediction);
}

function reactToGesture(gesture) {
  if (gesture === "mal") {
    generateBrokenAscii();
  }

  if (gesture === "bien") {
    generatePoem();
  }

  if (gesture === "stop") {
    clearScreen();
  }
}

function generateBrokenAscii() {
  let output = "";
  for (let i = 0; i < 2000; i++) {
    output += badChars.charAt(Math.floor(Math.random() * badChars.length));
    if (i % 80 === 0) output += "\n";
  }
  document.getElementById("ascii").innerText = output;
}

function generatePoem() {
  let poem = poems[Math.floor(Math.random() * poems.length)];
  let output = poem.repeat(30);
  document.getElementById("ascii").innerText = output;
}

function clearScreen() {
  document.getElementById("ascii").innerText = "";
}
