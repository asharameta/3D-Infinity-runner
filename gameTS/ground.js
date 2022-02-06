import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';

export const ground = (() => {
    class Ground {
        constructor(params) {

            this.params_ = params

            this.load();


        }

        load = () => {

            const planeTexture = THREE.ImageUtils.loadTexture('./resources/grass.jpg');
            planeTexture.repeat.set(64, 32);
            planeTexture.wrapS = THREE.RepeatWrapping;
            planeTexture.wrapT = THREE.RepeatWrapping;
            planeTexture.anisotropy = 16;
            const plane = new THREE.Mesh(
                new THREE.PlaneGeometry(Math.pow(2, 16), Math.pow(2, 15)),
                new THREE.MeshStandardMaterial({
                    map: planeTexture,
                }));
            plane.rotation.x = -Math.PI / 2;
            plane.position.y -= 512;
            plane.position.z = 0 * (Math.pow(2, 15) + 1024) - Math.pow(2, 14);

            plane.castShadow = false;
            plane.receiveShadow = true;
            this.plane = plane;
            this.params_.scene.add(plane);

            const plane1 = new THREE.Mesh(
                new THREE.PlaneGeometry(Math.pow(2, 16), Math.pow(2, 15)),
                new THREE.MeshStandardMaterial({
                    map: planeTexture,
                }));
            plane1.rotation.x = -Math.PI / 2;
            plane1.position.y -= 512;
            plane1.position.z = 1 * (Math.pow(2, 15) + 1024) - Math.pow(2, 14);

            plane1.castShadow = false;
            plane1.receiveShadow = true;
            this.plane1 = plane1;
            this.params_.scene.add(plane1);

            const planeTexture2 = THREE.ImageUtils.loadTexture('./resources/stone.jpg');
            planeTexture2.repeat.set(64, 1);
            planeTexture2.wrapS = THREE.RepeatWrapping;
            planeTexture2.wrapT = THREE.RepeatWrapping;
            planeTexture2.anisotropy = 16;

            const plane2 = new THREE.Mesh(
                new THREE.PlaneGeometry(Math.pow(2, 16), 1024),
                new THREE.MeshStandardMaterial({
                    map: planeTexture2,
                }));
            plane2.rotation.x = -Math.PI / 2;
            plane2.position.y -= 512;
            plane2.position.z += 512;

            plane2.castShadow = false;
            plane2.receiveShadow = true;
            this.plane2 = plane2;
            this.params_.scene.add(plane2);

        };

        Update(timeElapsed) {
            //this.plane.position.x -= timeElapsed * 0.2;
            if (this.plane.position.x > -10000) {
                this.plane.position.x -= 3
            } else { this.plane.position.x = 3 }

            //this.plane1.position.x -= timeElapsed * 0.2;
            if (this.plane1.position.x > -10000) {
                this.plane1.position.x -= 3
            } else { this.plane1.position.x = 3 }

            //this.plane2.position.x -= timeElapsed * 0.2;
            if (this.plane2.position.x > -10000) {
                this.plane2.position.x -= 3
            } else { this.plane2.position.x = 3 }


        }

    };


    return {
        Ground: Ground
    };

})();