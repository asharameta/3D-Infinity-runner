import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.122/build/three.module.js';

import { math } from './math.js';

import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/FBXLoader.js';


export const background = (() => {



    class BackgroundCrap {
        constructor(params) {
            this.params_ = params;
            this.position_ = new THREE.Vector3();
            this.quaternion_ = new THREE.Quaternion();
            this.scale_ = 0.5;
            this.mesh_ = null;
            this.mesh2_ = null;

            this.LoadModel_();
            this.LoadModel2_();
        }

        LoadModel_() {
            const loader = new FBXLoader();

            loader.load('./resources/palma.fbx', (fbx) => {
                fbx.scale.setScalar(0.5);
                fbx.traverse(function(object) {
                    object.castShadow = true;
                    object.receiveShadow = false;
                });
                this.params_.scene.add(fbx);

                this.mesh_ = fbx;

            });

        }


        LoadModel2_() {

            const loader2 = new FBXLoader();

            loader2.load('./resources/palma.fbx', (fbx2) => {
                fbx2.scale.setScalar(0.5);
                fbx2.traverse(function(object) {
                    object.castShadow = true;
                    object.receiveShadow = false;
                });
                this.mesh2_ = fbx2;
                this.mesh2_.position.z = 1024;
                this.params_.scene.add(fbx2);


            });

        }

        Update(timeElapsed) {

            this.mesh_.position.x -= timeElapsed * 0.2;
            if (this.mesh_.position.x < -1300) {
                this.mesh_.position.x = math.rand_range(30, 10000);
            }
            this.mesh_.position.y = -500;
            this.mesh_.position.z = -100;

            this.mesh2_.position.x -= timeElapsed * 0.2;
            if (this.mesh2_.position.x < -300) {
                this.mesh2_.position.x = math.rand_range(30, 10000);
            }
            this.mesh2_.position.y = -500;
            this.mesh2_.position.z = 1124;


        }

    };


    class Background {
        constructor(params) {
            this.params_ = params;
            this.clouds_ = [];
            this.crap_ = [];

            this.SpawnCrap_();
        }



        SpawnCrap_() {
            for (let i = 0; i < 10; ++i) {
                const crap = new BackgroundCrap(this.params_);

                this.crap_.push(crap);
            }
        }

        Update(timeElapsed) {

            for (let c of this.crap_) {
                c.Update(timeElapsed);
            }
        }
    }

    return {
        Background: Background,
    };
})();