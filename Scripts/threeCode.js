// import {
//     Scene,
//     Color,
//     PerspectiveCamera,
//     BoxBufferGeometry,
//     MeshStandardMaterial,
//     Mesh,
//     WebGLRenderer,
//     DirectionalLight,
//     HemisphereLight,
//     AmbientLight,
//     TextureLoader,
//     sRGBEncoding
//   } from "three";
//   import OrbitControls from "three-orbitcontrols";
  
//   const gpu = getGPUTier();
//   console.log(gpu);
  
  let container;
  let camera;
  let renderer;
  let scene;
  let mesh;
  let controls;
  let effect ,mixer,clips, clock, mouseX,mouseY;
  function init() {
    container = document.querySelector("#scene-container");
    document.onmousemove = handleMouseMove;
    // Creating the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color("black");

    clock = new THREE.Clock(true);
  
    createCamera();
    createLights();
    createMeshes();
    createControls();
    createRenderer();
  
    renderer.setAnimationLoop(() => {
      update();
      render();
    });
  }
  
  function createCamera() {
    const fov = 45;
    const aspect = container.clientWidth / container.clientHeight;
    const near = 0.1;
    const far = 100;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 2, 8);
  }
  
  function createLights() {
    const mainLight = new THREE.DirectionalLight(0xffffff, 5);
    mainLight.position.set(10, 10, 10);
  
    const hemisphereLight = new THREE.HemisphereLight(0xddeeff, 0x202020, 5);
    scene.add(mainLight, hemisphereLight);
  }
  
  function createMeshes() {
    const textureLoader = new THREE.TextureLoader();
    // const texture = textureLoader.load("./Assets/uv_test.png");
    // texture.encoding = THREE.sRGBEncoding;
    // texture.anisotropy = 16;
//   
    const geometry = new THREE.BoxBufferGeometry(2, 2, 2);
    // const material = new THREE.MeshStandardMaterial({ map: texture });
    const material = new THREE.MeshNormalMaterial();

    // mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);

    const loader = new THREE.GLTFLoader();
    loader.load( 'Assets/fox/source/Fox.glb', function ( gltf ) {
        model = gltf.scene;
        mesh = gltf.scene.children[0];
        mesh.scale.z =  0.05;
        mesh.scale.x =  0.05;
        mesh.scale.y =  0.05;
        mesh.rotation.y = Math.PI / 2;
        // mesh.position.z = (Math.sin(new Date() / 1000) * 5)
        // scene.add(mesh);
        scene.add( gltf.scene );
        mixer = new THREE.AnimationMixer( gltf.scene );
        // console.log(mixer)
        mixer.clipAction( gltf.animations[1] ).play();
        // gltf.animations.forEach( ( clip ) => {
          
        //     mixer.clipAction( clip ).play();
          
        // } );
        // mixer.clipAction(gltf.animations[0]).play();
        // scene.add(model);

    }, undefined, function ( error ) {
        console.error( error );
    } );
  }
  
  function createRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.gammaFactor = 2.2;
    renderer.gammaOutput = true;
    renderer.physicallyCorrectLights = true;    

    effect = new AsciiEffect( renderer,'کنمرا', { invert: false, resolution:0.15 } );
    effect.setSize(container.clientWidth, container.clientHeight);
    effect.domElement.style.color = 'white';
    effect.domElement.style.backgroundColor = 'black';
    //۱۲۳۴۵۶۷۸۹۰
    container.appendChild( effect.domElement );
    // container.appendChild(renderer.domElement);
  }
  
  function createControls() {
    // controls = new THREE.OrbitControls(camera, container);
  }
  
  function update() {

    delta = clock.getDelta();
    if(mesh){
         // mesh.rotation.x += 0.01;
        mesh.rotation.y = (mouseX - 0.5) * Math.PI / -1.2
        // mesh.rotation.z += 0.01;
        // mesh.position.z = (Math.sin(new Date() / 1000) * 5)
       
    }
    // value = (Math.sin(clock.getElapsedTime()) + 1 ) / 20 + 0.1
    if(mixer)mixer.update(delta);
   
  }
  
  function render() {
    renderer.render(scene, camera);
    effect.render( scene, camera );
  }
  
  init();
  
  function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
  
    // Update camera frustum
    camera.updateProjectionMatrix();
  
    renderer.setSize(container.clientWidth, container.clientHeight);
    effect.setSize(container.clientWidth, container.clientHeight);
  }
  window.addEventListener("resize", onWindowResize, false);
  
function handleMouseMove(event) {
    
    mouseX = event.x / window.innerWidth ;
    mouseY = event.y / window.innerHeight;
}