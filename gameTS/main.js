import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';


import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

import { ground } from './ground.js';
import { enemy } from './Enemy.js';
import { background } from './background.js';



class World {
    constructor() {
        this.position_ = new THREE.Vector3(0, -480, 550);
        this.playerBox_ = new THREE.Box3();
        this.gameOver = false;
        this.speedEnemy = 200;
        this._Initialize();
    }


    _Initialize() {
        this._threejs = new THREE.WebGLRenderer({
            antialias: true,
        });


        this._threejs.shadowMap.enabled = true;
        this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
        this._threejs.setPixelRatio(window.devicePixelRatio);
        this._threejs.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(this._threejs.domElement);

        window.addEventListener('resize', () => {
            this._OnWindowResize();
        }, false);

        const fov = 60;
        const aspect = 1920 / 1080;
        const near = 1.0;
        const far = 20000.0;
        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this._camera.position.set(-1300, 500, 1200);

        this._scene = new THREE.Scene();

        var ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this._scene.add(ambientLight);

        this.time = 0;
        this._clock = new THREE.Clock();


        var light = new THREE.DirectionalLight(0xffffff);
        light.castShadow = true;
        light.position.set(0, 3000, 2000);
        light.shadow.camera.near = 1;
        light.shadow.camera.far = 10000.0;
        light.shadow.camera.right = 10000;
        light.shadow.camera.left = -10000;
        light.shadow.camera.top = 10000;
        light.shadow.camera.bottom = -10000;
        this._scene.add(light);

        //this._scene.add(new THREE.DirectionalLightHelper(light, 10));

        const controls = new OrbitControls(
            this._camera, this._threejs.domElement);
        controls.target.set(0, 0, 500);
        controls.minPolarAngle = 0;
        controls.maxPolarAngle = Math.PI * 0.5;
        controls.update();

        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            './resources/posx.jpg',
            './resources/negx.jpg',
            './resources/posy.jpg',
            './resources/negy.jpg',
            './resources/posz.jpg',
            './resources/negz.jpg',
        ]);
        this._scene.background = texture;

        //=================================

        this.ground = new ground.Ground({ scene: this._scene });
        this.background = new background.Background({ scene: this._scene });
        this.enemy = new enemy.EnemyMain({ scene: this._scene });

        this._mixers = [];
        this._previousRAF = null;

        this._LoadAnimatedModel();
        //for (let i = 0; i < 3; i++)
        //    this._LoadAnimatedZombie();
        this.InitInput_();
        this._RAF();
    }

    _LoadAnimatedZombie() {
        const loader = new FBXLoader();
        loader.setPath('./resources/');
        loader.load('zombie.fbx', (fbx) => {
            fbx.scale.setScalar(4.0);
            fbx.rotation.y = -Math.PI / 2;
            fbx.position.z = Math.random() * (924 - 100) + 100;
            fbx.position.x = Math.random() * (7000 - 2000) + 2000;
            fbx.position.y = -510;
            fbx.traverse(function(object) {
                object.castShadow = true;
                object.receiveShadow = false;
            });


            const anim = new FBXLoader();
            anim.setPath('./resources/');
            anim.load('Zombie Running.fbx', (anim) => {
                const m = new THREE.AnimationMixer(fbx);
                this._mixers.push(m);
                const idle = m.clipAction(anim.animations[0]);
                idle.play();
            });
            this._scene.add(fbx);
            this.objectsParent.add(fbx);
        });
    }

    _LoadAnimatedModel() {
        const loader = new FBXLoader();
        //loader.setPath('./resources/michelle/');
        loader.load('./resources/michelle/mark2n.fbx', (fbx) => {
            fbx.scale.setScalar(.2);
            fbx.rotation.y = Math.PI;
            fbx.position.z = 550;
            fbx.position.y = -510;
            fbx.traverse(function(object) {
                object.castShadow = true;
                object.receiveShadow = false;
            });


            const anim = new FBXLoader();
            anim.setPath('./resources/michelle/');
            anim.load('Slow Run.fbx', (anim) => {
                anim.scale.setScalar(4.0);
                const m = new THREE.AnimationMixer(fbx);
                this._mixers.push(m);
                const idle = m.clipAction(anim.animations[0]);
                //idle.play();
            });
            // this.cube2_ = new THREE.Mesh(
            //     new THREE.BoxBufferGeometry(100, 100, 100),
            //     new THREE.MeshStandardMaterial({
            //         color: 0xffffff,
            //}),
            // );
            // this.cube2_.castShadow = true;
            // this.cube2_.receiveShadow = true;
            this._scene.add(fbx);
            this.mesh_ = fbx;
            //this.mesh_.geometry.computeBoundingBox();
            //console.log(this.mesh_);
        });
    }



    _OnWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize(window.innerWidth, window.innerHeight);
    }



    _RAF() {
        requestAnimationFrame((t) => {
            if (this._previousRAF === null) {
                this._previousRAF = t;
            }

            this._RAF();

            this._threejs.render(this._scene, this._camera);
            this._Step(t - this._previousRAF);
            this._previousRAF = t;
        });
    }

    CheckCollisions_() {
        const colliders = this.enemy.GetColliders();

        this.playerBox_.setFromObject(this.mesh_);
        //console.log('player box');
        //console.log(this.playerBox_);

        for (let c of colliders) {
            const cur = c.collider;
            //console.log('enemy box');
            //console.log(cur);
            if (cur.intersectsBox(this.playerBox_)) {
                console.log('collision!!!');
                this.gameOver = true;
            }
        }
    }

    InitInput_() {
        this.keys_ = {
            spacebar: false,
        };
        this.oldKeys = {...this.keys_ };

        document.addEventListener('keydown', (e) => this.OnKeyDown_(e), false);
        document.addEventListener('keyup', (e) => this.OnKeyUp_(e), false);
    }

    OnKeyDown_(event) {
        switch (event.keyCode) {

            case 68:
                this.keys_.right = true;
                break;

            case 65:
                this.keys_.left = true;
                break;

        }
    }

    OnKeyUp_(event) {
        switch (event.keyCode) {

            case 68:
                this.keys_.right = false;
                break;

            case 65:
                this.keys_.left = false;
                break;

        }
    }



    _Step(timeElapsed) {
        if (this.gameOver_) {
            return;
        }
        const timeElapsedS = timeElapsed * 0.001;
        if (this._mixers) {
            this._mixers.map(m => m.update(timeElapsedS));
        }

        this.ground.Update(timeElapsed);
        this.enemy.Update(timeElapsed);
        this.background.Update(timeElapsed);

        if (this.keys_.right && this.position_.z < 924) {
            this.position_.z += 10;

        }
        if (this.keys_.left && this.position_.z > 100) {
            this.position_.z -= 10;
        }


        if (this.mesh_) {
            this.mesh_.position.copy(this.position_);
            this.CheckCollisions_();
        }

        if (this._controls) {
            this._controls.Update(timeElapsedS);
        }


        if (!this._scene.gameOver && this.gameOver) {
            this.gameOver_ = true;
            console.log('game over!(((');
            document.getElementById('game-over').classList.toggle('active');
        }

    }

}




let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
    _APP = new World();
});