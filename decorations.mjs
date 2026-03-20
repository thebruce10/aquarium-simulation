export function addCoral(scene, x, y, z) {
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


            coralPhysicsMesh.position.set(x, y, z);
            coralPhysicsMesh.name = "coral";

            coralPhysicsMesh.userData.type = "decoration";


            scene.add(coralPhysicsMesh);

        }
    );
}


export function addSeaweed(scene, x, y, z) {
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


            seaweedMesh.material = seaweedMaterial;

            seaweedMesh.position.copy(seaweedModel.position);
            seaweedMesh.rotation.copy(seaweedModel.rotation);
            seaweedMesh.scale.copy(seaweedModel.scale);


            seaweedMesh.position.set(x, y, z);
            seaweedMesh.name = "seaweed";

            seaweedMesh.userData.type = "decoration";


            scene.add(seaweedMesh);

        }
    );
}


