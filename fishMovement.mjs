export function moveFish(scene, counter, tankX, tankY, tankZ) {

    scene.traverse(
        function (child) {
            if (child.userData.type == "fish") {

                if (counter < child.userData.endRest) {
                    move(child, counter, tankX, tankY, tankZ);
                } else {
                    startMovement(child, counter);
                }
                
                applyDrag(child);
            }
        }
    );

}


export function applyDrag(fish) {
    fish.setLinearVelocity(fish.getLinearVelocity().multiplyScalar(0.98));
    fish.setAngularVelocity(fish.getAngularVelocity().multiplyScalar(0.98));
}


export function startMovement(fish, counter) {
    fish.userData.velocity = Math.floor(Math.random() * 10 + 5);
    fish.userData.endMovement = counter + Math.floor(Math.random() * 1000) + 120;
    fish.userData.endRest = fish.userData.endMovement + Math.floor(Math.random() * 100) + 120;


    fish.rotation.x = (Math.random()-.5) * Math.PI /6;
    fish.rotation.z = (Math.random()-.5) * Math.PI /6;
    fish.rotation.y = Math.random() * Math.PI*2;

    fish.lookAt(
        new THREE.Vector3(
            Math.random()*20-10,
            Math.random()*20-10,
            Math.random()*20-10
        )
    )
}


const maxRoll = Math.PI/180 *15;
const maxPitch = Math.PI/180 *30;

export function move(fish, counter, tankX, tankY, tankZ) {
    if (counter < fish.userData.endMovement) {

        const dir = fish.getWorldDirection(new THREE.Vector3()).normalize();
        const force = dir.multiplyScalar(fish.userData.velocity);
        fish.applyCentralForce(force);
    } else {

    }

    //this is the don't escape code

    let tempX = fish.position.x
    let tempY = fish.position.y
    let tempZ = fish.position.z

    fish.position.x = THREE.Math.clamp(fish.position.x, -tankX, tankX);
    fish.position.y = THREE.Math.clamp(fish.position.y, -tankY, tankY);
    fish.position.z = THREE.Math.clamp(fish.position.z, -tankZ, tankZ);

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
        fish.setAngularVelocity(
            new THREE.Vector3(
                0,
                fish.getAngularVelocity().y,
                fish.getAngularVelocity().z
            )
        )
    }

    if (e.z > maxRoll*1.1 || e.z < -maxRoll*1.1){
        e.z = THREE.Math.clamp(e.z, -maxRoll, maxRoll);
        fish.quaternion.setFromEuler(e);
        fish.__dirtyRotation = true;
        fish.setAngularVelocity(
            new THREE.Vector3(
                fish.getAngularVelocity().x,
                fish.getAngularVelocity().y,
                0
            )
        )
    }
    
}