import * as THREE from '/three/build/three.module.js';

import * as nvrstd from 'neverstudio-vfx';

import { Lensflare, LensflareElement } from '/three/examples/jsm/objects/Lensflare.js'

import {EffectPass, EffectComposer, RenderPass, NormalPass, SSAOEffect, BlendFunction} from '/postprocessing/build/index.js';

const postprocessing = {EffectPass, EffectComposer, RenderPass, NormalPass, SSAOEffect, BlendFunction};

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
    let fire2;

    for(let i = 0; i< 1; i++){
        fire = new nvrstd.FireLine({"endPoints":[new THREE.Vector3(-50,0,-(i+1)*10),new THREE.Vector3(5,0,-(i+1)*10)]})
        scene.add(fire.mesh);
    }

    let rain = new nvrstd.Rain();//new nvrstd.Snow();
    scene.add(rain.mesh);
}

createScene(scene)

function render(){
    nvrstd.update();

    renderer.render(scene, camera);

    requestAnimationFrame( render );
}

requestAnimationFrame( render );