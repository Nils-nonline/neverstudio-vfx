//https://dustinpfister.github.io/2023/01/13/threejs-shader-material/


//https://medium.com/@aurelienagtn/introduction-to-shaders-with-three-js-create-an-animated-sphere-d4920fbab126


import * as THREE from '/three/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 32 / 24, 0.1, 1000);

camera.position.set(0, 5, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({antialias:true});

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

in each shader the ```main```-function is called

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

const material = new THREE.ShaderMaterial({transparent:true,
    uniforms: {
		iTime: { value: 0 },
		iResolution: { value: new THREE.Vector2(window.innerWidth/2, window.innerHeight/2) }
	},
    vertexShader: `
uniform float time;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
	vUv = uv;
	vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
    `,
    fragmentShader: `
uniform float iTime;
uniform vec2 iResolution;
varying vec2 vUv;
varying vec3 vNormal;

#define voronoi 1
    
//Stackoverflow noise func
float rand(float n) {
    return fract(sin(n) * 43758.5453123);
}
//END

mediump float PI = 3.141;

//Simplex noise based on https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float simplex(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 100.0 * dot(m, g);
}

#if voronoi
const mat2 myt = mat2(.12121212, .13131313, -.13131313, .12121212);
const vec2 mys = vec2(1e4, 1e6);

vec2 rhash(vec2 uv) {
  uv *= myt;
  uv *= mys;
  return fract(fract(uv / mys) * uv);
}

vec3 hash(vec3 p) {
  return fract(sin(vec3(dot(p, vec3(1.0, 57.0, 113.0)),
                        dot(p, vec3(57.0, 113.0, 1.0)),
                        dot(p, vec3(113.0, 1.0, 57.0)))) *
               43758.5453);
}

float voronoi2d(const in vec2 point) {
  vec2 p = floor(point);
  vec2 f = fract(point);
  float res = 0.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 b = vec2(i, j);
      vec2 r = vec2(b) - f + rhash(p + b);
      res += 1. / pow(dot(r, r), 8.);
    }
  }
  return pow(1. / res, 0.0625);
}
#endif

void main()
{
	if (vNormal.y > 0.5) {
		discard;
	}
	
    mediump float time = 1.0 * iTime;
    
    mediump vec2 coor = vUv * vec2(1000.0);
    
    mediump float x = coor.x + sin(pow(coor.y,0.4)*1.2 - time*10.0) * 3.0*pow(coor.y,0.5) * simplex(vec2(coor.x/50.0,1.0+ time)/10.0);
    mediump float y = coor.y + sin(x/10.0 * sqrt(min(20.0,max(0.2,simplex(vec2(coor.x/20.0,1.0 + time * 0.1))/20.0)))) * 40.0 + rand(float(time)) * 5.0;
    
    mediump float r = 2.0 - y/280.0 + 2.0 * simplex(vec2(x*0.003,time * 0.01));
    
    mediump vec3 col = vec3(r,r * r * 0.425,0.0);
    
    #if voronoi
    col += (voronoi2d(vec2(x/60.0, y/120.0 - time * 10.0))-0.5);
    #endif
    
    if(col.x <= 0.3){
        gl_FragColor = vec4(col,col.x);
        
        if(col.x < 0.0){
            gl_FragColor = vec4(1.0,1.0,1.0,0.0);
        }
        
        return;
    }
    
    gl_FragColor = vec4(col,1.0);
}
        `
});

// ---------- ----------
// GEOMETRY, MESH
// ---------- ----------
const geo = new THREE.BoxGeometry( 2, 2, 2, 100, 100);
const mesh = new THREE.Mesh(geo, material);//[material2, material1]
mesh.position.y = 1;
scene.add(mesh);

const ge2o = new THREE.BoxGeometry( 2, 2, 2, 100, 100);
const mesh2 = new THREE.Mesh(geo, new THREE.MeshBasicMaterial()); 
mesh2.position.y = 1;
mesh2.position.z = -1;
scene.add(mesh2);


// ---------- ----------
// RENDER
// ---------- ----------

function animate(time) {
  material.uniforms.iTime.value += 0.05;;
  renderer.render(scene, camera);
  
  mesh.rotation.y += 0.01;
  
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
