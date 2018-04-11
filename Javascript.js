//canvas (for points)
var canvas = document.getElementById("can");
var ctx = canvas.getContext("2d");
ctx.font = "20px Arial";


//renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

//camera 
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 13;
camera.position.y = 5;



//variables 
var scene = new THREE.Scene();
var width = window.innerWidth;
var height = window.innerHeight;
var keyboard = {};
var points = 0;
var ThTwOn = 3;

//scales
var boxScale = [5, 20, 5];
var sphereScale = [5,5,5];




//random integer min-max
function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

// random double/ float(with decimals)
function randomNumber(min, max){
    return Math.random() * (max - min + 1) + min;
}


//color (for background)
var color = new THREE.Color(0x72bcd4);
scene.background = color;


//start

//controls 
//controls = new THREE.OrbitControls(camera, renderer.domElement);

//self made conrols
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

function keydown(event){
	keyboard[event.keyCode] = true;
}

function keyup(event) {
	keyboard[event.keyCode] = false;
}



//collision detection 
function collisionDetection(){

	for (var i = 0; i < boxes.length; i++) {
		if(sphere.position.x - sphereScale[0]/2 < boxes[i].position.x + boxScale[0]/2 && sphere.position.x + sphereScale[0]/2 > boxes[i].position.x - boxScale[0]/2  || sphere.position.x + sphereScale[0]/2 > boxes[i].position.x - boxScale[0]/2 && sphere.position.x - sphereScale[0]/2 < boxes[i].position.x - boxScale[0]/2 || sphere.position.x - sphereScale[0]/2 < boxes[i].position.x + boxScale[0]/2 && sphere.position.x + sphereScale[0]/2 > boxes[i].position.x + boxScale[0]/2){
			if(sphere.position.z - sphereScale[2]/2 < boxes[i].position.z + boxScale[2]/2 && sphere.position.z + sphereScale[2]/2 > boxes[i].position.z - boxScale[2]/2){
					alert("GAME OVER  score: "+ points);
					sphere.position.z = 0;
					camera.position.z = 13;
					//location.reload();
			}
		}
	}
}







//geometry

//sphere(player)
var geometry = new THREE.SphereGeometry(3, 32, 32);
var material = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
var sphere = new THREE.Mesh(geometry, material);
//sphere.castShadow = true;
//sphere.scale.set(sphereScale[0], sphereScale[1], sphereScale[2]);
scene.add(sphere);

//boxes (hindernisse)
var boxgeometry = new THREE.BoxGeometry(boxScale[0], boxScale[1], boxScale[2]);
var material2 = new THREE.MeshPhongMaterial({color: 0x0ff00});
var boxes = [];
for(var i = 0; i<1000; i++){
	boxes[i] = new THREE.Mesh(boxgeometry, material2);
	boxes[i].position.set(randomInteger(-20,20), -2, randomInteger(-10000, -20));
	//boxes[i].castShadow = true
	scene.add(boxes[i]);
}
console.log(boxes[0].position.x, boxes[0].position.z);


//plane (floor)
var geometryplane = new THREE.PlaneGeometry( 100000, 10000, 10, 10);
var material3 = new THREE.MeshPhongMaterial( {color: 0x808080, side: THREE.DoubleSide} );
var plane = new THREE.Mesh( geometryplane, material3);
plane.rotation.x = Math.PI/2;
plane.position.y = -5;
plane.receiveShadow = true;
scene.add( plane );

//(walls)
var basicMaterial = new THREE.MeshBasicMaterial( {color: 0x808080, side: THREE.DoubleSide} );
var wall1 = new THREE.Mesh(geometryplane, basicMaterial);
wall1.rotation.y = Math.PI/2;
wall1.position.x = 23;
scene.add(wall1);

var wall2 = new THREE.Mesh(geometryplane, basicMaterial);
wall2.rotation.y = Math.PI/2;
wall2.position.x = -23;
scene.add(wall2);

//images
// instantiate a loader
var loader = new THREE.TextureLoader();

loader.load(
	// resource URL
	'images/landscape.png',

	function ( texture ) {
		var image = new THREE.MeshBasicMaterial( {
			map: texture
		 } );
	},
);





//point text
/*var loader = new THREE.FontLoader();

loader.load( 'helvetiker_regular.typeface.json', function ( font ) {

	var textGeometry = new THREE.TextGeometry( Have Fun, {
		font: font,
		size: 80,
		height: 5,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 10,
		bevelSize: 8,
		bevelSegments: 5
	} );

	var textMaterial = new THREE.MeshPhongMaterial( 
    { color: 0xff0000, specular: 0xffffff }
  );

  var mesh = new THREE.Mesh( textGeometry, textMaterial );
  mesh.position.set(-100, 50, -200);
  scene.add( mesh );

} );*/





//lighting

//directional light
var direcionalLight = new THREE.DirectionalLight(0xFFFFFF, 1)
direcionalLight.position.set(10,10,10);
direcionalLight.castShadow = true;
scene.add(direcionalLight);



//Game logic
var update = function(){
	//sphere.rotation.x += 0.05;
	camera.position.z = camera.position.z-0.3;
	sphere.position.z = sphere.position.z-0.3;
	//mesh.position.z = sphere.position.z-0.3;
	sphere.rotation.y += 0.2;

	//console.log(sphere.position.x);


	//controls
	if(keyboard[65]){
		sphere.position.x += -0.5;
		camera.position.x += -0.5;
	}

	if(keyboard[68]){
		sphere.position.x += 0.2;
		camera.position.x += 0.2;
	}


	//edge
	if(sphere.position.x > 20){
		sphere.position.x = 20;
		camera.position.x = 20;
	}

	if(sphere.position.x < -20){
		sphere.position.x = -20;
		camera.position.x = -20;
	}



	//collision
	collisionDetection();


	//points 
	points++;
	ctx.fillText(points,10,20);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

}

//renders everything
var render = function(){
	renderer.render(scene, camera);
}

//Gameloop (about 60 fps) 
var Gameloop = function(){
	requestAnimationFrame(Gameloop);

	update();
	render();
}
Gameloop();
