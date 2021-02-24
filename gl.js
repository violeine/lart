// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");
const eases = require("eases");

const settings = {
  dimensions: [512, 512],
  fps: 24,
  duration: 4,
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  attributes: { antialias: true },
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor("hsl(0, 0%,92%)", 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera(45, 1, 0.01, 100);
  camera.position.set(2, 2, -4);
  camera.lookAt(new THREE.Vector3());

  // Picking palettes
  const palette = random.pick(palettes);
  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const meshCount = 30 * 2;

  // Setup a material

  // Setup a mesh with geometry + material
  for (let i = 0; i < meshCount; i++) {
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({
        color: random.pick(palette),
      }),
    );
    mesh.position.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1),
    );
    mesh.scale.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1),
    );
    mesh.scale.multiplyScalar(0.5);
    scene.add(mesh);
  }

  scene.add(new THREE.AmbientLight("hsl(0, 0%, 20%)"));
  const light = new THREE.DirectionalLight("white", 1);
  light.position.set(4, 2, 0);

  scene.add(light);
  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);
      const aspect = viewportWidth / viewportHeight;
      const zoom = 1.5;
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;
      //near /far
      camera.near = -100;
      camera.far = 100;
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ playhead }) {
      const t = Math.sin(playhead * Math.PI);
      scene.rotation.z = eases.expoInOut(t);
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
