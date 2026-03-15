export function moveFish(scene, counter) {

    scene.traverse(
        function (child) {
            if (child.userData.type == "fish") {
                applyDrag(child);

                if (counter < child.userData.endRest) {
                    move(child, counter);
                } else {
                    startMovement(child, counter);
                }

            }
        }
    );

}

export function applyDrag(fish) {
    fish.setLinearVelocity(fish.getLinearVelocity().multiplyScalar(0.98));
    fish.setAngularVelocity(fish.getAngularVelocity().multiplyScalar(0.98));
}

export function startMovement(fish, counter) {
    fish.userData.velocity = 10;
    fish.userData.endMovement = counter + Math.floor(Math.random() * 1000) + 120;
    fish.userData.endRest = fish.userData.endMovement + Math.floor(Math.random() * 100) + 120;
    fish.userData.rotation = new THREE.Vector3(0, 0, 0)
}

export function move(fish, counter) {
    if (counter < fish.userData.endMovement) {
        //if it is not upright make it rotate to be more upright
        //if it is swimming down make it rotate to be swimming more upright
        //if it collides with a wall make it rotate away from the wall e.g. if it collides with the positive x wall it rotates towards negative x. See fish.mjs!
        fish.setAngularVelocity(fish.userData.rotation);



        fish.setLinearVelocity(fish.getWorldDirection().multiplyScalar(fish.userData.velocity));
    } else {

    }
}