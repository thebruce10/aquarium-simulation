import { addGoldfish, addNeonTetra } from "./fish.mjs";

const maxRoll = Math.PI/180 *15;
const maxPitch = Math.PI/180 *30;
const linearDragFactor = 0.98;
const angularDragFactor = 0.98;

export function moveFish(scene, counter, tankX, tankY, tankZ, neonTetraAmount, goldfishAmount) {

    let neonTetraCount = 0;
    let goldfishCount = 0;
    let fishToRemove = [];



    scene.traverse(
        function (child) {
            if (child.userData.type == "fish") {

                // add to count
                switch (child.userData.fish) {
                    case "neonTetra":
                        neonTetraCount++;

                        if (neonTetraCount > neonTetraAmount) {
                            fishToRemove.push(child);
                        }
                        break;

                    case "goldfish":
                        goldfishCount++;

                        if (goldfishCount > goldfishAmount) {
                            fishToRemove.push(child);
                        }
                        break;
                }

                

                

                if (counter < child.userData.endRest) {
                    move(child, counter, tankX, tankY, tankZ);
                } else {
                    startMovement(child, counter);
                }
                
                applyDrag(child);
            }
        }
    );


    for (let i = 0; i < fishToRemove.length; i++) {
        scene.remove(fishToRemove[i]);
    }


    if (neonTetraCount < neonTetraAmount) {
        addNeonTetra(scene);
    }

    if (goldfishCount < goldfishAmount) {
        addGoldfish(scene);
    }

}


export function applyDrag(fish) {
    fish.setLinearVelocity(fish.getLinearVelocity().multiplyScalar(linearDragFactor));
    fish.setAngularVelocity(fish.getAngularVelocity().multiplyScalar(angularDragFactor));
}


export function startMovement(fish, counter) {
    fish.userData.velocity = Math.random() * 5 * fish.userData.speed + 2.5;
    fish.userData.endMovement = counter + Math.floor(Math.random() * 1000) + 120;
    fish.userData.endRest = fish.userData.endMovement + Math.floor(Math.random() * 100) + 120;


    fish.__dirtyRotation = true;
    fish.rotation.x = (Math.random()-.5) * maxPitch*2;
    fish.rotation.z = (Math.random()-.5) * maxRoll*2;
    fish.rotation.y = Math.random() * Math.PI*2;
}

export function move(fish, counter, tankX, tankY, tankZ) {
    if (counter < fish.userData.endMovement) {
        const dir = fish.getWorldDirection(new THREE.Vector3()).normalize();
        const force = dir.multiplyScalar(fish.userData.velocity);
        fish.applyCentralForce(force);
    } else {

    }

    //this is the don't escape code

    let tempX = fish.position.x;
    let tempY = fish.position.y;
    let tempZ = fish.position.z;

    fish.position.x = THREE.Math.clamp(fish.position.x, -tankX/2, tankX/2);
    fish.position.y = THREE.Math.clamp(fish.position.y, -tankY/2, tankY/2);
    fish.position.z = THREE.Math.clamp(fish.position.z, -tankZ/2, tankZ/2);

    if (tempX !== fish.position.x || tempY !== fish.position.y || tempZ !== fish.position.z) {
        fish.__dirtyPosition = true;
    } else {
        fish.__dirtyPosition = false;
    }

    //this is the upright code

    const e = new THREE.Euler().setFromQuaternion(fish.quaternion, "YXZ");
    if (e.x > maxPitch*1.1 || e.x < -(maxPitch*1.1)) {
        e.x = THREE.Math.clamp(e.x, -maxPitch, maxPitch);
        fish.quaternion.setFromEuler(e);
        fish.__dirtyRotation = true;
    }

    if (e.z > maxRoll*1.1 || e.z < -maxRoll*1.1){
        e.z = THREE.Math.clamp(e.z, -maxRoll, maxRoll);
        fish.quaternion.setFromEuler(e);
        fish.__dirtyRotation = true;
    }
    
}