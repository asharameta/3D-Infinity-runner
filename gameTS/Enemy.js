import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.122/build/three.module.js';

import { math } from './math.js';

import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';

export const enemy = (() => {


    class createEnemy {
        constructor(params) {
            this.params_ = params;
            this.position_ = new THREE.Vector3();
            this.quaternion_ = new THREE.Quaternion();
            this.scale_ = 10.0;
            this.collider = new THREE.Box3();
            this._mesh = null;

            this.LoadModel_();
        }

        LoadModel_() {

            // const loader = new GLTFLoader();
            // loader.setPath('./resources/');
            // loader.load('zombieN.glb', (gltf) => {
            //     gltf.traverse(function(object) {
            //         object.castShadow = true;
            //         object.receiveShadow = false;
            //     });
            //     this.params_.scene.add(gltf);
            //     this._mesh = gltf;
            // });
            // const loader = new GLTFLoader();
            // loader.load('./resources/zombieN.glb', (gltf) => {
            //     gltf.scene.traverse(c => {
            //         c.castShadow = true;
            //     });
            //     this.params_.scene.add(gltf.scene);
            // });
            // this.cube_ = new THREE.Mesh(
            //     new THREE.BoxBufferGeometry(100, 100, 100),
            //     new THREE.MeshStandardMaterial({
            //         color: 0x80FF80,
            //     }),
            // );
            // this.cube_.castShadow = true;
            // this.cube_.receiveShadow = true;
            // this.params_.scene.add(this.cube_);

            const loader = new FBXLoader();
            //loader.setPath('./resources/michelle/');
            loader.load('./resources/michelle/mark22.fbx', (fbx) => {
                fbx.scale.setScalar(.2);
                fbx.rotation.y = Math.PI;
                fbx.position.z = 550;
                fbx.position.y = -510;
                fbx.traverse(function(object) {
                    object.castShadow = true;
                    object.receiveShadow = false;
                });
                this.params_.scene.add(fbx);
                this._mesh = fbx;
                //console.log(this.mesh_);

            });

        }

        UpdateCollider_() {
            this.collider.setFromObject(this._mesh);
            //console.log(this.collider);
        }

        Update(timeElapsed) {
            if (!this._mesh) {
                return;
            }

            this.position_.x -= timeElapsed * 0.3;
            if (this.position_.x < -500) {
                this.position_.x = math.rand_range(3000, 10000);
                this.position_.z = math.rand_range(100, 924);
                this.position_.y = -510;
                //this.quaternion_.y = -Math.PI / 2;
            }
            this._mesh.position.copy(this.position_);
            this._mesh.quaternion.copy(this.quaternion_);
            //this.mesh_.scale.setScalar(this.scale_);
            this.UpdateCollider_();

        }

    };


    class EnemyMain {
        constructor(params) {
            this.params_ = params;
            this.clouds_ = [];
            this.crap_ = [];

            //console.log("im here!1");
            this.SpawnCrap_();
        }

        GetColliders() {
            return this.crap_;
        }


        SpawnCrap_() {
            for (let i = 0; i < 5; ++i) {
                let crap = new createEnemy(this.params_);
                this.crap_.push(crap);
                //console.log(this.crap_);

            }
        }

        Update(timeElapsed) {

            for (let c of this.crap_) {
                c.Update(timeElapsed);
            }
        }

    }

    return {
        EnemyMain: EnemyMain,
    };
})();