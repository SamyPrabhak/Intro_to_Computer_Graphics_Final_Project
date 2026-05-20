
//Three.js and Tween.js from <script> tags in your HTML 
//They attach themselves to the window object as
const THREE_NS = window.THREE;
const TWEEN = window.TWEEN;

//SCENE + RENDERER
const scene = new THREE_NS.Scene();
const camera = new THREE_NS.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0, 4);
/*
Perspective camera 
Field of view = 45 degrees
Near clipping = 0.1;far clipping = 100
*/
const personalrenderer = new THREE_NS.WebGLRenderer({
  antialias: true,
  alpha: false
});
//This creates the WebGL drawing engine

personalrenderer.setClearColor(0x0d0d11, 1);
personalrenderer.setSize(window.innerWidth, window.innerHeight);
personalrenderer.setPixelRatio(window.devicePixelRatio || 1);
document.body.appendChild(personalrenderer.domElement);

personalrenderer.domElement.style.position = "fixed";
personalrenderer.domElement.style.top = 0;
personalrenderer.domElement.style.left = 0;
personalrenderer.outputColorSpace = THREE_NS.SRGBColorSpace;

//TEXTURES
//Hold the images
let textureBack = null;
let textureFront = null;
let textureWink = null;

const loader = new THREE_NS.TextureLoader();
let loadCount = 0;
//Used to load images asynchronously

function markLoaded() {
  loadCount++;
  if (loadCount >= 2 && cardMat.map === null) {
    cardMat.map = textureBack; // start on back
    cardMat.needsUpdate = true;
  }
}//When two textures finish loading -> show the back texture first

loader.load("assets/tarot_back.png", t => {
  t.colorSpace = THREE_NS.SRGBColorSpace;
  textureBack = t;
  markLoaded();
});

loader.load("assets/tarot_front.png", t => {
  t.colorSpace = THREE_NS.SRGBColorSpace;
  textureFront = t;
  markLoaded();
});

loader.load("assets/tarot_front_WINK.png", t => {
  t.colorSpace = THREE_NS.SRGBColorSpace;
  textureWink = t;
});

//CARD
//Creates a flat rectangle (the tarot card shape).
const cardGeometry = new THREE_NS.PlaneGeometry(2.2, 3.3);
const cardMat = new THREE_NS.MeshBasicMaterial({
  map: null,
  transparent: true,
  side: THREE_NS.DoubleSide
});

const card = new THREE_NS.Mesh(cardGeometry, cardMat); //add card to scene
scene.add(card);
let isBackSide = true;
let flipping = false;
//Which side is visible
//Checks Whether a flip is already happening so user cannot flip twice


// Gold Aura(Always Visible)
const auraGeometry = new THREE_NS.PlaneGeometry(3.6, 5.2); //Slightly bigger than the card so it glows around it
const auraCanvas = document.createElement("canvas");
auraCanvas.width = 512;
auraCanvas.height = 512;

const auraCtx = auraCanvas.getContext("2d");

const gradient = auraCtx.createRadialGradient(
  256, 256, 30,
  256, 256, 260
);

gradient.addColorStop(0, "rgba(255,220,120,0.45)");
gradient.addColorStop(0.4, "rgba(255,200,90,0.20)");
gradient.addColorStop(1, "rgba(255,180,70,0)");

auraCtx.fillStyle = gradient;
auraCtx.fillRect(0, 0, 512, 512);

const auraTexture = new THREE_NS.CanvasTexture(auraCanvas);
const auraMaterial = new THREE_NS.MeshBasicMaterial({
  map: auraTexture,
  transparent: true,
  opacity: 1.5  // ALWAYS visible
});
//Places glow slightly behind the card
const aura = new THREE_NS.Mesh(auraGeometry, auraMaterial);
aura.position.z = -0.25;
scene.add(aura);

//Horizontal glow sweep (Card Height)
const glowCanvas = document.createElement("canvas");
glowCanvas.width = 512;
glowCanvas.height = 1024; // tall gradient for full portrait
const glowCtx = glowCanvas.getContext("2d");

function drawGlowBar(xPos) {
  glowCtx.clearRect(0, 0, glowCanvas.width, glowCanvas.height);

  const g = glowCtx.createLinearGradient(xPos, 0, xPos + 120, 0);

  g.addColorStop(0, "rgba(255,255,255,0)");
  g.addColorStop(0.5, "rgba(255,255,255,0.28)");
  g.addColorStop(1, "rgba(255,255,255,0)");

  glowCtx.fillStyle = g;
  glowCtx.fillRect(0, 0, glowCanvas.width, glowCanvas.height);
}
//Creates a moving vertical bar of white glow.
drawGlowBar(-300);

const glowTexture = new THREE_NS.CanvasTexture(glowCanvas);
const glowMaterial = new THREE_NS.MeshBasicMaterial({
  map: glowTexture,
  transparent: true,
  opacity: 0
});

const glowMesh = new THREE_NS.Mesh(cardGeometry, glowMaterial);
glowMesh.position.z = 0.02; // slightly above portrait
scene.add(glowMesh);

//This animation moves the glow left -> right quickly
function runGlowSweep(callback) {
  let x = -300;
  glowMaterial.opacity = 0.7;

  function sweep() {
    x += 12; // fast sweep
    drawGlowBar(x);
    glowTexture.needsUpdate = true;

    if (x > 600) {
      glowMaterial.opacity = 0;
      if (callback) callback();
      return;
    }
    requestAnimationFrame(sweep);
  }
  sweep();
}

// Wink
//Changes to wink face -> returns to Decorative card cover side
function wink() {
  if (!textureWink) return;

  cardMat.map = textureWink;
  cardMat.needsUpdate = true;

  setTimeout(() => {
    cardMat.map = textureFront;
    cardMat.needsUpdate = true;
  }, 350);
}

// Auto Flipback
function autoFlipBack() {
  setTimeout(() => flipCard(), 900);
}

// 3D Flip logic and Shine/Glow sweep
//Uses Tween.js to animate the rotation smoothly
function flipCard() {
  if (flipping) return;
  if (!textureBack || !textureFront) return;
  flipping = true;

  const startRot = card.rotation.y;
  const endRot = startRot + Math.PI;
  let swapped = false;

  new TWEEN.Tween({ t: 0 })
    .to({ t: 1 }, 900)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(o => {
      card.rotation.y = startRot + (endRot - startRot) * o.t;

      if (!swapped && o.t >= 0.5) {
        swapped = true;
        //if it was backside → show portrait
        //glow sweep,wink,flip back
        //if it was frontside → go back to back texture

        if (isBackSide) {
          isBackSide = false;

          cardMat.map = textureFront;
          cardMat.needsUpdate = true;

          // Glow sweep -> then wink -> Then Card flip back
          setTimeout(() => {
            runGlowSweep(() => {
              wink();
              autoFlipBack();
            });
          }, 150);

        } else {
          isBackSide = true;
          cardMat.map = textureBack;
          cardMat.needsUpdate = true;
        }
      }
    })
    .onComplete(() => flipping = false)
    .start();
}
window.addEventListener("click", flipCard); //User clicks -> animation plays.

//Resize the card 
window.addEventListener("resize", () => {
  personalrenderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

//MAIN LOOP
//Runs 60 FPS,updates Tween.js animations and renders scene
function animate(t) {
  requestAnimationFrame(animate);
  TWEEN.update(t);
  personalrenderer.render(scene, camera);
}
animate();

