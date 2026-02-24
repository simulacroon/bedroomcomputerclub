function create360(containerId, videoPath) {

  const container = document.getElementById(containerId);
  if (!container) return; // 👈 evita errores si no existe

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    1,
    1100
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.rotateSpeed = -0.3; // negativo porque la esfera está invertida

  const video = document.createElement('video');
  video.src = videoPath;
  video.loop = true;
  video.muted = true;
  video.autoplay = true;
  video.playsInline = true;
  video.style.display = "none";

  video.addEventListener("loadeddata", () => {
    video.play();
  });

  const texture = new THREE.VideoTexture(video);

  const geometry = new THREE.SphereGeometry(500, 60, 40);
  geometry.scale(-1, 1, 1);

  const material = new THREE.MeshBasicMaterial({ map: texture });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  camera.position.set(0, 0, 0.1);

 function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

  animate();
}

create360("viewer360", "video/injected.mp4");
create360("viewer360b", "video/otro360.mp4");