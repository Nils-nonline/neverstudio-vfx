import * as THREE from '/three/build/three.module.js';

import * as nvrstd from 'neverstudio-vfx';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.y = 2;
scene.add(camera);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth-1, window.innerHeight-1 );


document.body.appendChild( renderer.domElement );

function createScene(scene){
    let planeGeo = new THREE.PlaneGeometry( 100, 100, 100, 100 );
    let planeMat = new THREE.MeshBasicMaterial( {color: 0xf0f0f0, side: THREE.DoubleSide, wireframe: true} );
    let plane = new THREE.Mesh( planeGeo, planeMat );
    plane.rotation.x = Math.PI/2;

    plane.position.set(0,0,0);

    scene.add(plane);

    let light = new THREE.AmbientLight( 0x404040 );
    scene.add(light);

    let fire;

    fire = new nvrstd.FireCircleShader({"position":new THREE.Vector3(0,0,-10), "upperEnd":3})
    scene.add(fire.mesh);

    let rain = new nvrstd.Rain();
    scene.add(rain.mesh);
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


window.addEventListener("click", onClick, false);

function onClick(event) {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const meshes = nvrstd.allObjects.map(o => o.mesh);

    const intersects = raycaster.intersectObjects(meshes, true);

    if (intersects.length > 0) {
        const hit = intersects[0];

        const obj  = new nvrstd.BreakableObject({"target":hit.object})
        obj.impactByIntersect(hit);
        
    }
}


createScene(scene)

function render(){
    nvrstd.update();

    renderer.render(scene, camera);

    requestAnimationFrame( render );
}

requestAnimationFrame( render );
