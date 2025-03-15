//https://tympanus.net/Tutorials/text-trail-effect/
// https://paveldogreat.github.io/WebGL-Fluid-Simulation/
//https://github.com/mbarker84/codrops-masked-hero
//https://tympanus.net/Tutorials/codrops-masked-hero/
//https://github.com/tamani-coding/threejs-text-example
//const gui = new dat.GUI()

const container = document.getElementById("app");
const cursor = { x: 0, y: 0 };
const sizes = {
  width: window.innerWidth, 
  height: window.innerHeight, 
}

const textureLoader = new THREE.TextureLoader()
textureLoader.setPath("https://i.ibb.co/")
const starTexture = textureLoader.load("LQCx40k/star.png")





//scene

const scene = new THREE.Scene()



//Camera
const aspect = sizes.width/sizes.height
const fov = 75;
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 3;
camera.position.y = 0
camera.position.x = 0




//Renderer
let renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});

renderer.setSize(sizes.width,sizes.height);
renderer.setClearColor(new THREE.Color("#000000"),5);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);
  
document.body.appendChild(renderer.domElement);

//Controls
const controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.enableZoom = false
console.log(controls)

//Objects

const geometry = new THREE.TorusGeometry(0.76,.2,16,106)
const material = new THREE.PointsMaterial({
    size:0.0021
})

const torus = new THREE.Points(geometry,material)

scene.add(torus)

//Particles Background

const particlesGeometry = new THREE.BufferGeometry()
const count = 5500

const positions = new Float32Array(count*3)

for(let i =0;i<count*3;i++){
    positions[i] = (Math.random()-0.5)* (Math.random()*15.5)
}
particlesGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3))

const particlesMaterial = new THREE.PointsMaterial({
    size:0.03,
    map:starTexture,
    transparent:true,
    color:"blue",
    blending:THREE.AditiveBlending,
    sizeAttenuation:true
})
const particlesMesh = new THREE.Points(particlesGeometry,particlesMaterial)

scene.add(particlesMesh)




const pointLight = new THREE.PointLight(0xffffff,2.5)
pointLight.position.x =2
pointLight.position.y =3
pointLight.position.z =4
scene.add(pointLight)

var mouse = {x:0,y:0}
var mousemove = (event)=>{
  mouse.x =(event.clientX) 
  mouse.y =(event.clientY)
}


//Recursion function
let clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  torus.rotation.x = elapsedTime*0.7

  torus.rotation.y = elapsedTime*0.7
  particlesMesh.rotation.y = -.1 * (elapsedTime*0.8)
  
  if(mouse.x>0){
      particlesMesh.rotation.x = -mouse.y * (elapsedTime*0.00038)
      particlesMesh.rotation.y = -mouse.x * (elapsedTime*0.0008)
  }

  //update controls
  controls.update();

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
  window.addEventListener("resize",onwindowResize)
  window.addEventListener("mousemove",mousemove)
};

tick();




var onwindowResize = ()=>{
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width/sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width,sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
}


// -------------------DEBUG--------------------

//gui.add()