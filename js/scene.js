(function(){
  'use strict';

  var scene,
      camera,
      renderer,
      spheres = [],
      sphereGeometry = new THREE.SphereGeometry(2, 8, 8);

  var generateRandomColor = function() {
    return Math.floor(Math.random()*0xFFFFFF);
  };

  var addSphere = function() {
    var sphereMaterial = new THREE.MeshLambertMaterial({color: generateRandomColor()});
    var sphere = new Physijs.SphereMesh(sphereGeometry, sphereMaterial);
    var randomX = Math.floor(Math.random() * 10) - 10;
    var randomZ = Math.floor(Math.random() * 10) - 10;
    sphere.position.set(randomX, 30, randomZ);
    // sphere.receiveShadow = true;
    sphere.castShadow = true;

    if (spheres.length >= 50) {
      scene.remove(spheres.pop());
    }
    spheres.unshift(sphere);
    scene.add(sphere);
  };

  Physijs.scripts.worker = '/js/physijs_worker.js';
  Physijs.scripts.ammo = '/js/ammo.js';

  scene = new Physijs.Scene();
  camera = new THREE.PerspectiveCamera(
    60,                                     //Field of View
    window.innerWidth / window.innerHeight, //aspect ratio
    0.1,                                    //near clipping plane
    1000                                    //far clipping plane
  );

  setInterval(function() {
    addSphere();
  }, 400);

  camera.position.set( 25, 20, 25 );
  camera.lookAt(new THREE.Vector3( 0, 7, 0 ));
  scene.add( camera );

  renderer = new THREE.WebGLRenderer({
    antialias: true //smooth
  });

  renderer.setClearColor(0x333333);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.shadowMapEnabled = true;
  renderer.shadowMapSoft = true;

  //ground plane
  var planeGeometry = new THREE.PlaneBufferGeometry( 100, 100, 100 );
  var planeTexture = THREE.ImageUtils.loadTexture('images/wood.jpg');
  planeTexture.wrapS = planeTexture.wrapT = THREE.RepeatWrapping;
  planeTexture.repeat.set(5, 5);
  var planeMaterial = new THREE.MeshLambertMaterial({map: planeTexture});
  var plane = new Physijs.BoxMesh( planeGeometry, planeMaterial );
  plane.rotation.x = -Math.PI/2;
  scene.add(plane);

  // //light
  // var ambientLight = new THREE.AmbientLight( 0x222222 );
  // scene.add( ambientLight );

  var directionalLight = new THREE.DirectionalLight( 0xFFFFFF );
  directionalLight.position.set( 20, 30, -5 );
  directionalLight.target.position.copy( scene.position );
  directionalLight.castShadow = true;
  directionalLight.shadowCameraLeft = -30;
  directionalLight.shadowCameraTop = -30;
  directionalLight.shadowCameraRight = 30;
  directionalLight.shadowCameraBottom = 30;
  directionalLight.shadowCameraNear = 20;
  directionalLight.shadowCameraFar = 200;
  directionalLight.shadowBias = -0.001;
  directionalLight.shadowMapWidth = directionalLight.shadowMapHeight = 2048;
  directionalLight.shadowDarkness = 0.5;
  scene.add( directionalLight );

  //shadow
  plane.receiveShadow = true;

  var render = function() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    scene.simulate();
  };

  render();

})();
