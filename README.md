# A VFX-Library for THREE.js

Do you want to easily create fire, rain or snow in your THREE.js Application?

With neverstudio-vfx, that is now easy as never before. Simply import the library, create your desired effect,  
add it to the scene and call our animation loop before rendering, neverstudio-vfx handles the rest!

## Usage
Import the library:

Add an import map with the paths to the neverstudio-vfx library and to three.js
```html
<script type="importmap">
{
  "imports": {
    "three": "/three/build/three.module.js",
    "neverstudio-vfx":"/neverstudio/index.js"
  }
}
</script>
```

Import the library in your script code (you need to set ```type="module"``` for imports)

```js
import * as nvrstd from 'neverstudio-vfx';
```

and add the following to your render loop:

```js
nvrstd.update();
```

now you can create any of the vfx-objects you like and they will be animated for you.
All objects follow the structure:

```js
let obj= new nvrstd.<Object>(config);
scene.add(obj.mesh);
```

with ```config```being a json that includes the respective config. This can always be left empty to enforce default values.

## Snow

```js
let snow = new nvrstd.Snow({"count":<numParticles>:Number, "lowerEnd":<lower-end>:Number, "upperEnd":<upper-end>:Number, "position":<position-of-center>:THREE.Vector3, "width":<width>:Number, "depth":<depth>:Number, "track":<coor-to-be-tracked>:THREE.Vector3, "speed":<falling-speed>:Number});
scene.add(snow.mesh);
```

## Rain

```js
let rain = new nvrstd.Rain({"count":<numParticles>:Number, "lowerEnd":<lower-end>:Number, "upperEnd":<upper-end>:Number,"position":<position-of-center>:THREE.Vector3, "width":<width>:Number, "depth":<depth>:Number, "track":<coor-to-be-tracked>:THREE.Vector3, "speed":<falling-speed>:Number});
scene.add(rain.mesh);
```

## CampFire

```js
let campFire = new nvrstd.CampFire({"count":<numParticles>:Number, "position":<lower-end>:THREE.Vector3, "upperEnd":<upper-end>:Number, "position":<position-of-lower-center>:THREE.Vector3, "speed":<moving-speed>:Number});
scene.add(campFire.mesh);
```

## FireLine

```js
let fireLine = new nvrstd.FireLine({"count":<numParticles>:Number, "endPoints":[<left-end-coor>:THREE.Vector3, <right-end-coor>:THREE.Vector3], "upperEnd":<upper-end>:Number, "speed":<moving-speed>:Number});
scene.add(fireLine.mesh);
```

## FireLineShader

```js
let fireLine = new nvrstd.FireLineShader({"size":<fire-size>:Number, "dim":<fire-block-dimensions>:THREE.Vector3, "position":<position>:THREE.Vector3, "speed":<moving-speed>:Number});
scene.add(fireLine.mesh);
```

## FireCircleShader

```js
let fireCircle = new nvrstd.FireLineShader({"size":<fire-size>:Number, "dim":<fire-block-dimensions>:THREE.Vector3, "position":<position>:THREE.Vector3, "speed":<moving-speed>:Number});
scene.add(fireCircle.mesh);
```

## BreakableObject

```js
let breakableObject = new nvrstd.BreakableObject({"target":<object-to-break>:THREE.Object3d, "mass":<mass-of-object>:Number,"velocity":<velocity-of-object>:THREE.Vector3,"maxRad":<max-radial-segments>:Number,"maxRand":<max-random-segments>:Number});
scene.add(breakableObject.mesh);

breakableObject.impactByPoint(<position>:THREE.Vector3, <normal>:THREE.Vector3, <strength>:Number)
//OR
breakableObject.impactByIntersect(<raycast-intersect-result>)
```
