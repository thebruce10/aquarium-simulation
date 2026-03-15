export function addBoundaries(scene, tankX, tankY, tankZ) {
    let visibility = false;

    let boundaryMaterial = new THREE.MeshNormalMaterial();
    boundaryMaterial.transparent = true;
    boundaryMaterial.opacity = 0.5;

    let boundaryPhysicsMaterial = Physijs.createMaterial(
        boundaryMaterial,
        0.1,
        0.8
    );

    //positive x
    let boundary1Geometry = new THREE.BoxGeometry(1, tankY, tankZ);
    let boundary1PhysicsMesh = new Physijs.BoxMesh(boundary1Geometry, boundaryPhysicsMaterial, 0);
    boundary1PhysicsMesh.position.set(tankX / 2 + 0.5, 0, 0);
    boundary1PhysicsMesh.visible = visibility;
    boundary1PhysicsMesh.userData.type = "boundary";
    boundary1PhysicsMesh.userData.boundary = "positiveX";
    scene.add(boundary1PhysicsMesh);

    //negative x
    let boundary2Geometry = new THREE.BoxGeometry(1, tankY, tankZ);
    let boundary2PhysicsMesh = new Physijs.BoxMesh(boundary2Geometry, boundaryPhysicsMaterial, 0);
    boundary2PhysicsMesh.position.set(0 - (tankX / 2 + 0.5), 0, 0);
    boundary2PhysicsMesh.visible = visibility;
    boundary2PhysicsMesh.userData.type = "boundary";
    boundary2PhysicsMesh.userData.boundary = "negativeX";
    scene.add(boundary2PhysicsMesh);

    //positive z
    let boundary3Geometry = new THREE.BoxGeometry(tankX + 2, tankY, 1);
    let boundary3PhysicsMesh = new Physijs.BoxMesh(boundary3Geometry, boundaryPhysicsMaterial, 0);
    boundary3PhysicsMesh.position.set(0, 0, tankZ / 2 + 0.5);
    boundary3PhysicsMesh.visible = visibility;
    boundary3PhysicsMesh.userData.type = "boundary";
    boundary3PhysicsMesh.userData.boundary = "positiveZ";
    scene.add(boundary3PhysicsMesh);

    //negative z
    let boundary4Geometry = new THREE.BoxGeometry(tankX + 2, tankY, 1);
    let boundary4PhysicsMesh = new Physijs.BoxMesh(boundary4Geometry, boundaryPhysicsMaterial, 0);
    boundary4PhysicsMesh.position.set(0, 0, 0 - (tankZ / 2 + 0.5));
    boundary4PhysicsMesh.visible = visibility;
    boundary4PhysicsMesh.userData.type = "boundary";
    boundary4PhysicsMesh.userData.boundary = "negativeZ";
    scene.add(boundary4PhysicsMesh);

    //positive y
    let boundary5Geometry = new THREE.BoxGeometry(tankX + 2, 1, tankZ + 2);
    let boundary5PhysicsMesh = new Physijs.BoxMesh(boundary5Geometry, boundaryPhysicsMaterial, 0);
    boundary5PhysicsMesh.position.set(0, tankY / 2 + 0.5, 0);
    boundary5PhysicsMesh.visible = visibility;
    boundary5PhysicsMesh.userData.type = "boundary";
    boundary5PhysicsMesh.userData.boundary = "positiveY";
    scene.add(boundary5PhysicsMesh);

    //negative y
    let boundary6Geometry = new THREE.BoxGeometry(tankX + 2, 1, tankZ + 2);
    let boundary6PhysicsMesh = new Physijs.BoxMesh(boundary6Geometry, boundaryPhysicsMaterial, 0);
    boundary6PhysicsMesh.position.set(0, 0 - (tankY / 2 + 0.5), 0);
    boundary6PhysicsMesh.visible = visibility;
    boundary6PhysicsMesh.userData.type = "boundary";
    boundary6PhysicsMesh.userData.boundary = "negativeY";
    scene.add(boundary6PhysicsMesh);
}