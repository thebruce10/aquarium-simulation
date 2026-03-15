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

            neonTetraPhysicsMesh.name = "neonTetra";

            neonTetraPhysicsMesh.userData.type = "fish";
            neonTetraPhysicsMesh.userData.velocity = 0;
            neonTetraPhysicsMesh.userData.endMovement = 0;
            neonTetraPhysicsMesh.userData.endRest = 0;

            neonTetraPhysicsMesh.addEventListener(
                "collision",
                (object) => {
                    if (object.userData.type == "boundary") {
                        console.log(object.userData.boundary)
                        
                        neonTetraPhysicsMesh.setAngularVelocity(0,100,0); //I don't think doing stuff to neonTetraPhysicsMesh works
                        
                    }
                }
            );

            scene.add(neonTetraPhysicsMesh);

        }
    );
}