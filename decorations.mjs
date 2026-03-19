export function addCoral(scene, tankY) {
    let loader = new THREE.OBJMTLLoader();

    loader.load(
        "assets/models/coral/coral_model.obj",
        "assets/models/coral/coral_model.mtl",
        function (coralModel) {

            
            let coralMesh;
            coralModel.traverse(
                function (child){
                    if (child instanceof THREE.Mesh) {
                        coralMesh = child;
                    }
                }
            );

            


            let coralPhysicsMaterial = Physijs.createMaterial(
                coralMesh.material,
                0.4,
                0
            );

            let coralPhysicsMesh = new Physijs.ConcaveMesh(
                coralMesh.geometry,
                coralPhysicsMaterial,
                0
            );



            coralPhysicsMesh.position.copy(coralModel.position);
            coralPhysicsMesh.rotation.copy(coralModel.rotation);
            coralPhysicsMesh.scale.copy(coralModel.scale);


            coralPhysicsMesh.position.y = -tankY/2;
            coralPhysicsMesh.name = "Coral1";

            coralPhysicsMesh.userData.type = "decoration";


            scene.add(coralPhysicsMesh);

        }
    );
}

export function addSeaweed(scene, tankY) {
    let loader = new THREE.OBJMTLLoader();

    loader.load(
        "assets/models/seaweed/seaweed_model.obj",
        "assets/models/seaweed/seaweed_model.mtl",
        function (seaweedModel) {

            
            let seaweedMesh;
            seaweedModel.traverse(
                function (child){
                    if (child instanceof THREE.Mesh) {
                        seaweedMesh = child;
                    }
                }
            );

            let materialProperties = {
                color: '#2c8802',
                shininess: 100,
                side: THREE.DoubleSide
            }

            let seaweedMaterial = new THREE.MeshPhongMaterial(materialProperties);


            let seaweedPhysicsMaterial = Physijs.createMaterial(
                seaweedMaterial,
                0.4,
                0
            );

            let seaweedPhysicsMesh = new Physijs.ConcaveMesh(
                seaweedMesh.geometry,
                seaweedPhysicsMaterial,
                0
            );



            seaweedPhysicsMesh.position.copy(seaweedModel.position);
            seaweedPhysicsMesh.rotation.copy(seaweedModel.rotation);
            seaweedPhysicsMesh.scale.copy(seaweedModel.scale);


            seaweedPhysicsMesh.position.y = -tankY/2;
            seaweedPhysicsMesh.name = "Coral1";

            seaweedPhysicsMesh.userData.type = "decoration";


            scene.add(seaweedPhysicsMesh);

        }
    );
}


