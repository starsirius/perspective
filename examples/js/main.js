var width = window.innerWidth
  , height = window.innerHeight;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);
 
var scene = new THREE.Scene;

// Room is a skybox
var floorTexture = THREE.ImageUtils.loadTexture('img/floor.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(6, 2);
var wallTexture = THREE.ImageUtils.loadTexture('img/wall.jpg');
wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(10, 10);

var materials = [];
materials.push(new THREE.MeshLambertMaterial({ map: wallTexture, side: THREE.BackSide })); // right face
materials.push(new THREE.MeshLambertMaterial({ map: wallTexture, side: THREE.BackSide })); // left face
materials.push(new THREE.MeshLambertMaterial({ map: wallTexture, side: THREE.BackSide })); // top face
materials.push(new THREE.MeshLambertMaterial({ map: floorTexture, side: THREE.BackSide })); // bottom face
materials.push(new THREE.MeshLambertMaterial({ map: wallTexture, side: THREE.BackSide })); // front face
materials.push(new THREE.MeshLambertMaterial({ map: wallTexture, side: THREE.BackSide })); // back face

var roomMaterial = new THREE.MeshFaceMaterial(materials);
var roomGeometry = new THREE.CubeGeometry(1500, 600, 800);
var room = new THREE.Mesh(roomGeometry, roomMaterial);

room.position.y = 300;
 
scene.add(room);

// Artwork
var artworkGeometry = new THREE.CubeGeometry(107, 200, 5);
var artworkTexture = new THREE.ImageUtils.loadTexture('img/artwork.jpg');
var artworkMaterial = new THREE.MeshLambertMaterial({ map: artworkTexture });
var artwork = new THREE.Mesh(artworkGeometry, artworkMaterial);

artwork.position.y = 200;
artwork.position.z = -397.5;

scene.add(artwork);

// Ambient Light
var ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add(ambientLight);

// Point Light
var pointLight = new THREE.PointLight(0xffffff, 1.2);
pointLight.position.set(0, 300, -360);
 
scene.add(pointLight);

// A cube to simulate where the point light is
var cubeGeometry = new THREE.CubeGeometry(10, 10, 10);
var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x1ec876 });
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
 
cube.position = pointLight.position;
cube.rotation.y = Math.PI * 45 / 180;

scene.add(cube);

// Bench
var loader = new THREE.JSONLoader;
loader.load('model/bench.js', function (geometry, materials) {
  var skinnedMesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
  skinnedMesh.position.y = 30;
  skinnedMesh.position.z = 0;
  skinnedMesh.scale.set(150, 150, 150);
  scene.add(skinnedMesh);
});

// Camera
var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
camera.position.y = 170;
camera.position.z = 800;
camera.lookAt(artwork.position);
scene.add(camera);

var clock = new THREE.Clock;

function render() {
  renderer.render(scene, camera);
  cube.rotation.y -= clock.getDelta();     
  requestAnimationFrame(render);
}
 
render();

// Orbit control helper
var controls = new THREE.OrbitControls(camera, renderer.domElement);
