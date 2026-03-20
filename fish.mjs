export function addNeonTetra(scene) {
    let loader = new THREE.OBJMTLLoader();

    loader.load(
        "./assets/models/neonTetra/neon_tetra_model.obj",
        "./assets/models/neonTetra/neon_tetra_model.mtl",
        function (neonTetraModel) {
            let neonTetraMesh;
            neonTetraModel.traverse(
                function (child) {
                    if (child instanceof THREE.Mesh) {
                        neonTetraMesh = child;
                    }
                }
            );

            neonTetraMesh.material.side = THREE.DoubleSide;
            neonTetraMesh.material.shininess = 15;

            let neonTetraPhysicsMaterial = Physijs.createMaterial(
                neonTetraMesh.material,
                0.4, //mass
                0.6 //restitution
            );

            let neonTetraPhysicsMesh = new Physijs.ConvexMesh(
                neonTetraMesh.geometry,
                neonTetraPhysicsMaterial,
                1
            );

            neonTetraPhysicsMesh.position.copy(neonTetraModel.position);
            neonTetraPhysicsMesh.rotation.copy(neonTetraModel.rotation);
            neonTetraPhysicsMesh.scale.copy(neonTetraModel.scale);

            neonTetraPhysicsMesh.castShadow = true;

            neonTetraPhysicsMesh.name = "neonTetra";

            neonTetraPhysicsMesh.userData.speed = 1;

            neonTetraPhysicsMesh.userData.type = "fish";
            neonTetraPhysicsMesh.userData.fish = "neonTetra";
            neonTetraPhysicsMesh.userData.velocity = 0;
            neonTetraPhysicsMesh.userData.endMovement = 0;
            neonTetraPhysicsMesh.userData.endRest = 0;


            neonTetraPhysicsMesh.scale.set(1,1,1);

            //start them in a random direction
            neonTetraPhysicsMesh.lookAt(
                new THREE.Vector3(
                    Math.random()*20-10,
                    Math.random()*20-10,
                    Math.random()*20-10
                )
            );


            scene.add(neonTetraPhysicsMesh);

        }
    );
}



export function addGoldfish(scene) {
    let loader = new THREE.OBJMTLLoader();

    loader.load(
        "./assets/models/goldfish/goldfish_model.obj",
        "./assets/models/goldfish/goldfish_model.mtl",
        function (goldfishModel) {
            let goldfishMesh;
            goldfishModel.traverse(
                function (child) {
                    if (child instanceof THREE.Mesh) {
                        goldfishMesh = child;
                    }
                }
            );

            goldfishMesh.material.side = THREE.DoubleSide;
            goldfishMesh.material.shininess = 15;

            let goldfishMaterial = Physijs.createMaterial(
                goldfishMesh.material,
                0.4, //mass
                0.6 //restitution
            );

            let goldfishPhysicsMesh = new Physijs.ConvexMesh(
                goldfishMesh.geometry,
                goldfishMaterial,
                1
            );

            goldfishPhysicsMesh.position.copy(goldfishModel.position);
            goldfishPhysicsMesh.rotation.copy(goldfishModel.rotation);
            goldfishPhysicsMesh.scale.copy(goldfishModel.scale);

            goldfishPhysicsMesh.castShadow = true;

            goldfishPhysicsMesh.name = "goldfish";

            goldfishPhysicsMesh.userData.speed = 1;

            goldfishPhysicsMesh.userData.type = "fish";
            neonTetraPhysicsMesh.userData.fish = "goldfish";
            goldfishPhysicsMesh.userData.velocity = 0;
            goldfishPhysicsMesh.userData.endMovement = 0;
            goldfishPhysicsMesh.userData.endRest = 0;


            goldfishPhysicsMesh.scale.set(1, 1, 1);

            //start them in a random direction
            goldfishPhysicsMesh.lookAt(
                new THREE.Vector3(
                    Math.random()*20-10,
                    Math.random()*20-10,
                    Math.random()*20-10
                )
            );


            scene.add(goldfishPhysicsMesh);

        }
    );
}