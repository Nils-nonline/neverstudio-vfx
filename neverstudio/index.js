import * as THREE from 'three';


/*

| r11 r12 r13 tx |
| r21 r22 r23 ty |
| r31 r32 r33 tz |
|  0   0   0  1  |

THREEjs matrix4

*/
let allObjects = [];

class Snow{
    constructor(config){
        config = config || {};

        this.count = config.count ||1000;
        this.lowerEnd = config.lowerEnd || 0;
        this.upperEnd = config.upperEnd || 30;

        this.frame = 0;

        this.geometry = new THREE.IcosahedronGeometry(0.05,0);
        this.material = new THREE.MeshBasicMaterial()
        this.mesh = new THREE.InstancedMesh( this.geometry, this.material, this.count);

        this.speed = config.speed || 0.1;

        this.noise = [];

        allObjects.push(this);

        this.alignGrid();
        this.fillNoise();
    }

    fillNoise(){
        for (let i = 0; i < this.count; i++) {
            let dict = {};
            let angle = Math.random() * Math.PI * 2;

            dict["x_factor"] = Math.cos(angle);
            dict["z_factor"] = Math.sin(angle);
            dict["y_offset"] = Math.random() * Math.PI * 2;
            dict["speed"] = 0.5 + Math.random()/2;

            this.noise.push(dict);
        }
    }

    alignGrid(){
        let matrix = new THREE.Matrix4();

        for (let i = 0; i < this.count; i++) {
            matrix.setPosition(Math.random() * 100-50, this.upperEnd, Math.random() * 100-50)
            this.mesh.setMatrixAt(i, matrix)
        }

        this.mesh.instanceMatrix.needsUpdate = true;
    }

    update(){
        this.frame++;

        let matrix = new THREE.Matrix4();

        for (let i = 0; i < this.count; i++) {
            let noise = this.noise[i];

            this.mesh.getMatrixAt(i, matrix)
            let pos = new THREE.Vector3();
            let quaternion = new THREE.Quaternion();
            let scale = new THREE.Vector3();

            matrix.decompose(pos, quaternion, scale);

            if(pos.y < this.lowerEnd){
                pos.y = this.upperEnd;
            }

            matrix.setPosition(pos.x + Math.sin(this.frame/10 + noise["y_offset"])/50 * noise["x_factor"], pos.y - this.speed * noise["speed"], pos.z + Math.sin(this.frame/10 + noise["y_offset"])/50  * noise["z_factor"]);

            this.mesh.setMatrixAt(i, matrix)
        }

        this.mesh.instanceMatrix.needsUpdate = true;
    }
}


class Rain{
    constructor(config){
        config = config || {};

        this.count = config.count ||5000;
        this.lowerEnd = config.lowerEnd || 0;
        this.upperEnd = config.upperEnd || 30;

        this.frame = 0;

        this.geometry = new THREE.BoxGeometry(0.05, 0.5, 0.05)
        this.material = new THREE.MeshBasicMaterial({"transparent":true,"opacity":0.8})
        this.mesh = new THREE.InstancedMesh( this.geometry, this.material, this.count);

        this.speed = config.speed || 0.5;

        this.noise = [];

        allObjects.push(this);

        this.alignGrid();
        this.fillNoise();
    }

    fillNoise(){
        for (let i = 0; i < this.count; i++) {
            let dict = {};

            dict["speed"] = 0.5 + Math.random()/2;

            this.noise.push(dict);
        }
    }

    alignGrid(){
        let matrix = new THREE.Matrix4();

        for (let i = 0; i < this.count; i++) {
            matrix.setPosition(Math.random() * 100-50, this.upperEnd, Math.random() * 100-50)
            this.mesh.setMatrixAt(i, matrix)
            this.mesh.setColorAt(i, new THREE.Color(0.6,0.6,1))
        }

        this.mesh.instanceMatrix.needsUpdate = true;
    }

    update(){
        this.frame++;

        let matrix = new THREE.Matrix4();

        for (let i = 0; i < this.count; i++) {
            let noise = this.noise[i];

            this.mesh.getMatrixAt(i, matrix)
            let pos = new THREE.Vector3();
            let quaternion = new THREE.Quaternion();
            let scale = new THREE.Vector3();

            matrix.decompose(pos, quaternion, scale);

            if(pos.y < this.lowerEnd){
                pos.y = this.upperEnd;
            }

            matrix.setPosition(pos.x, pos.y - this.speed * noise["speed"], pos.z);

            this.mesh.setMatrixAt(i, matrix)
        }

        this.mesh.instanceMatrix.needsUpdate = true;
    }
}


class CampFire{
    constructor(config){
        config = config || {};

        this.count = config.count || 1000;

        this.position = config.position || new THREE.Vector3(0,0,-10);

        this.frame = 0;

        this.upperEnd = config.upperEnd || 3;

        this.geometry = new THREE.IcosahedronGeometry(0.15,0);
        this.material = new THREE.MeshBasicMaterial({"transparent":true,"opacity":0.8})
        this.mesh = new THREE.InstancedMesh( this.geometry, this.material, this.count);

        this.speed = config.speed || 0.01;

        this.noise = [];

        this.globalNoise = {};

        allObjects.push(this);

        this.align();
        this.fillNoise();
    }

    fillNoise(){


        for (let i = 0; i < this.count; i++) {
            let dict = {};
            let angle = Math.random() * Math.PI * 2;

            dict["speed"] = 1 + Math.random()/2;

            dict["x_factor"] = Math.cos(angle);
            dict["z_factor"] = Math.sin(angle);
            dict["y_offset"] = Math.random() * Math.PI * 2;

            dict["stream"] = Math.round(Math.random() * 3)

            this.noise.push(dict);
        }

        let angle = Math.random() * Math.PI * 2;

        this.globalNoise["streams"] = []

        for(let i = 0; i < 4; i++){
            let angle = Math.random() * Math.PI * 2;
            this.globalNoise["streams"].push(
                {
                    "x_factor": Math.cos(angle),
                    "z_factor": Math.sin(angle),
                    "y_offset": Math.random() * Math.PI * 2
                }
            )
        }

        console.log(this.globalNoise["streams"])
    }

    align(){
        let matrix = new THREE.Matrix4();

        for (let i = 0; i < this.count; i++) {
            matrix.setPosition(...this.getInitialPos())
            this.mesh.setMatrixAt(i, matrix)
            this.mesh.setColorAt(i, new THREE.Color(1,0,0))
        }

        this.mesh.instanceMatrix.needsUpdate = true;
    }

    getInitialPos(randomizeHeight = false){
        let vec = new THREE.Vector3(this.position.x + 4 * Math.random() - 2, this.position.y + Math.random() * (this.upperEnd-this.position.y), this.position.z + 4 * Math.random() - 2)
        
        return [vec.x, vec.y, vec.z]
    }

    update(){
        this.frame++;

        let matrix = new THREE.Matrix4();

        for (let i = 0; i < this.count; i++) {
            let noise = this.noise[i];

            this.mesh.getMatrixAt(i, matrix)
            let pos = new THREE.Vector3();
            let quaternion = new THREE.Quaternion();
            let scale = new THREE.Vector3();

            matrix.decompose(pos, quaternion, scale);

            pos = this.noise[i]["lastPos"] || pos;

            pos.add(new THREE.Vector3( 0, noise["speed"]*this.speed, 0));

            if(pos.y > this.upperEnd){
                pos.set(...this.getInitialPos())
            }

            this.noise[i]["lastPos"] = pos.clone();

            let change = pos.distanceTo(this.position)/3

            let x = pos.y/this.upperEnd;
            let drag = 1 - x//x*5 * Math.exp(-x*5+1)
            //(1.4 - Math.exp(((x*2 - 1)**2))/2)

            pos.set(this.position.x + (pos.x - this.position.x)*drag, pos.y , this.position.z + (pos.z - this.position.z)*drag,)

            let curStream = this.globalNoise["streams"][noise["stream"]]

            pos.add(new THREE.Vector3(Math.sin(x * 3 * Math.PI + this.frame * this.speed * 5 + curStream["y_offset"]) * curStream["x_factor"]/2 * x, 0 , Math.sin(x * 3 * Math.PI + this.frame * this.speed * 5 + curStream["y_offset"]) * curStream["z_factor"]/2 * x))

            matrix.setPosition(pos.x, pos.y, pos.z);

            this.mesh.setMatrixAt(i, matrix)

            let time = pos.y/(noise["speed"]*this.speed)
            this.mesh.setColorAt(i, new THREE.Color(1,1-0.005*time,1-0.01*time));
        }
        
        this.mesh.instanceMatrix.needsUpdate = true;
        this.mesh.instanceColor.needsUpdate = true;
    }
}

class FireLine{
    constructor(config){
        config = config || {};

        this.position = config.position || new THREE.Vector3(0,0,0);

        this.frame = 0;

        this.upperEnd = config.upperEnd || 5;

        this.endPoints = config.endPoints || [new THREE.Vector3(-5,0,0),new THREE.Vector3(5,0,0)];

        this.position = this.endPoints[1].clone().sub(this.endPoints[0]).clone().multiplyScalar(0.5);

        this.count = config.count || 80 * (this.endPoints[0].distanceTo(this.endPoints[1])) * (this.upperEnd-this.position.y);

        this.geometry = new THREE.IcosahedronGeometry(0.15,0);
        this.material = new THREE.MeshBasicMaterial({"transparent":true,"opacity":0.8})
        this.mesh = new THREE.InstancedMesh( this.geometry, this.material, this.count);

        this.speed = config.speed || 0.01;

        this.noise = [];

        this.globalNoise = {};

        allObjects.push(this);

        this.align();
        this.fillNoise();
    }

    fillNoise(){


        for (let i = 0; i < this.count; i++) {
            let dict = {};
            let angle = Math.random() * Math.PI * 2;

            dict["speed"] = 1 + Math.random()/2;

            dict["x_factor"] = Math.cos(angle);
            dict["z_factor"] = Math.sin(angle);
            dict["y_offset"] = Math.random() * Math.PI * 2;
            dict["max_height_factor"] = Math.random()/(1/0.75) + 0.25;
            dict["color_offset"] = Math.random() * 50;

            this.noise.push(dict);
        }

        let angle = Math.random() * Math.PI * 2;

        this.globalNoise["x_factor"] = Math.cos(angle);
        this.globalNoise["z_factor"] = Math.sin(angle);
        this.globalNoise["y_offset"] = Math.random() * Math.PI * 2;
    }

    align(){
        let matrix = new THREE.Matrix4();

        for (let i = 0; i < this.count; i++) {
            matrix.makeScale(1,1,1);
            matrix.setPosition(...this.getInitialPos(true));
            this.mesh.setMatrixAt(i, matrix)
            this.mesh.setColorAt(i, this.getInitialColor())
        }

        this.mesh.instanceMatrix.needsUpdate = true;
    }

    getInitialPos(randomizeHeight = false){
        let vec = this.endPoints[0].clone().add(this.endPoints[1].clone().sub(this.endPoints[0]).clone().multiplyScalar(Math.random()))
        
        let minY = Math.min(this.endPoints[0].y, this.endPoints[1].y);

        if(randomizeHeight) vec.y = minY + Math.random() * (this.upperEnd-minY)
        
        return [vec.x, vec.y, vec.z]
    }

    getInitialColor(){
        let color = new THREE.Color().setRGB(1,1,1);
        return color;
    }

    update(){
        this.frame++;

        let matrix = new THREE.Matrix4();

        for (let i = 0; i < this.count; i++) {
            let noise = this.noise[i];

            this.mesh.getMatrixAt(i, matrix)
            let pos = new THREE.Vector3();
            let quaternion = new THREE.Quaternion();
            let scale = new THREE.Vector3();

            matrix.decompose(pos, quaternion, scale);

            scale.set(1,1,1);

            scale.multiplyScalar(1.5-pos.y/this.upperEnd);//2-pos.y/this.upperEnd

            pos = this.noise[i]["lastPos"] || pos;

            pos.add(new THREE.Vector3( -0.004*Math.random(), noise["speed"]*this.speed, 0));

            if(pos.y > this.upperEnd * noise["max_height_factor"]){
                pos.set(...this.getInitialPos());
                this.mesh.setColorAt(i, this.getInitialColor());
            }

            this.noise[i]["lastPos"] = pos.clone();
            
            matrix.makeScale(scale.x, scale.y, scale.z);
            matrix.setPosition(pos.x + Math.sin(this.frame/4 + noise["y_offset"])/15 * noise["x_factor"], pos.y, pos.z + Math.sin(this.frame/4 + noise["y_offset"])/15 * noise["z_factor"]);
            

            this.mesh.setMatrixAt(i, matrix)

            let color = new THREE.Color();
            this.mesh.getColorAt(i, color);

            let time = pos.y/(noise["speed"]*this.speed) / ((this.upperEnd-this.position.y)/3) + noise["color_offset"]

            this.mesh.setColorAt(i, new THREE.Color(1,1-0.006*time,1-0.02*time));
        }
        
        this.mesh.instanceMatrix.needsUpdate = true;
        this.mesh.instanceColor.needsUpdate = true;
    }
}

function update(){
    for(let obj of allObjects){
        obj.update();
    }
}

export {Snow, Rain, FireLine, CampFire, update}