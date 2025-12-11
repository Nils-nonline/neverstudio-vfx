//https://dustinpfister.github.io/2023/01/13/threejs-shader-material/


//https://medium.com/@aurelienagtn/introduction-to-shaders-with-three-js-create-an-animated-sphere-d4920fbab126


import * as THREE from '/three/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 32 / 24, 0.1, 1000);

camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(640, 480, false);

document.body.appendChild(renderer.domElement);

// ---------- ----------
// SHADER MATERIAL
// ---------- ----------


/*
vertexShader for vertices
changes ```gl_Position``` (x,y,z,?)


fragmentShader for colors
changes ```gl_FragColor``` (rgba)

in each shder the ```main```-function is called

Uniforms:
    sent to both vertex shaders and fragment shaders
    stay the same for the whole frame
    ```uniform <type> <name>```

Attributes:
    sent to vertex shader
    attributes of vertices
    ```attribute <type> <name>```
Varyings:
    sent to fragment shder from vertex shader
    declare varying in both vertex and fragment shader
    ```varying <type> <name>```

*/

const material1 = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0.0 },
        lightPos: { value: new THREE.Vector3(0, 10, 50) }
    },
    vertexShader: `
uniform float time;
varying vec3 vNormal;
varying vec3 vPos;

void main() {
    vPos = position;
    vNormal = normalize(normal);
    vec3 pos = position;

    pos.x = pos.z/pos.y;
    pos.x = pos.x/pos.y;        
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
    `,
    fragmentShader: `
uniform vec3 lightPos;
varying vec3 vNormal;
varying vec3 vPos;

void main() {
vec3 lightDir = normalize(lightPos - vPos);
    float diff = max(dot(vNormal, lightDir), 0.0);
    vec3 color = vec3(1.0, 1.0, 1.0) * diff; // White color
    gl_FragColor = vec4(color, 1.0);
}
            
        `
});

// ---------- ----------
// GEOMETRY, MESH
// ---------- ----------
const geo = new THREE.TorusGeometry( 3, 1, 100, 100);
geo.rotateX(Math.PI * 0.5);
const mesh = new THREE.Mesh(geo, material1);
mesh.position.y = 1;
scene.add(mesh);

// ---------- ----------
// RENDER
// ---------- ----------

function animate(time) {
  material1.uniforms.time.value = time * 0.005;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);