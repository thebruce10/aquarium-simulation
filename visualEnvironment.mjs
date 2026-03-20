export function addLighting(group, tankX, tankY, tankZ){
    let lightColor = "#cc99ff";
    let lightIntensity = 0.8;
    let lightingGroup = new THREE.Group();

    //positive x, positive z
    let spotlight1 = new THREE.SpotLight(lightColor, lightIntensity);
    spotlight1.position.set(tankX/2 + 100, tankY/2 + 100, tankZ/2 + 100);
    spotlight1.castShadow = true;
    lightingGroup.add(spotlight1);

    //negative x, positive z
    let spotlight2 = new THREE.SpotLight(lightColor, lightIntensity);
    spotlight2.position.set(0 - (tankX/2 + 100), tankY/2 + 100, tankZ/2 + 100);
    spotlight2.castShadow = true;
    lightingGroup.add(spotlight2);

    //positive x, negative z
    let spotlight3 = new THREE.SpotLight(lightColor, lightIntensity);
    spotlight3.position.set(tankX/2 + 100, tankY/2 + 100, 0 - (tankZ/2 + 100));
    spotlight3.castShadow = true;
    lightingGroup.add(spotlight3);

    //negative x, negative z
    let spotlight4 = new THREE.SpotLight(lightColor, lightIntensity);
    spotlight4.position.set(0 - (tankX/2 + 100), tankY/2 + 100, 0 - (tankZ/2 + 100));
    spotlight4.castShadow = true;
    lightingGroup.add(spotlight4);

    //ambient light
    let ambientLight = new THREE.AmbientLight("#271e33");
    lightingGroup.add(ambientLight);

    lightingGroup.name = "lightingGroup"
    group.add(lightingGroup);
}

export function addTable(group, tankX, tankY, tankZ) {
    let tableGeometry = new THREE.BoxGeometry(tankX + 100, 10, tankZ + 100);

    let tableMaterial = new THREE.MeshPhongMaterial();
    tableMaterial.map = THREE.ImageUtils.loadTexture("assets/textures/wood-texture.jpg");
    tableMaterial.map.wrapS = tableMaterial.map.wrapT = THREE.RepeatWrapping;
    tableMaterial.map.repeat.set(1,1);
    tableMaterial.shininess = 0.1   ;

    let tableMesh = new THREE.Mesh(tableGeometry, tableMaterial);
    tableMesh.receiveShadow = true;
    tableMesh.castShadow = true;
    tableMesh.position.y = (0 - tankY/2) - 6; // 1 is sand layer and 5 is 1/2 of table

    group.add(tableMesh);
}

export function addWater(group, tankX, tankY, tankZ) {
    let waterGeometry = new THREE.BoxGeometry(tankX, tankY, tankZ);

    let materialProperties = {
        color: '#5ee0ff',
        transparent: true,
        opacity: 0.25,
        shininess: 5000
    }

    let waterMaterial = new THREE.MeshPhongMaterial(materialProperties);

    let waterMesh = new THREE.Mesh(waterGeometry, waterMaterial);



    group.add(waterMesh);
}

export function addTank(group, tankX, tankY, tankZ) {

    let tankGroup = new THREE.Group();

    let glassMaterialProperties = {
        color: '#ffffff',
        specular: '#ffffff',
        shininess: 5000,
        opacity: 0.2,
        transparent: true,
        side: THREE.DoubleSide
    }
    let glassMaterial = new THREE.MeshPhongMaterial(glassMaterialProperties);


    //positive x
    let wall1Geometry = new THREE.BoxGeometry(1, tankY + 11, tankZ); // 10 is for the top and 1 is for the bottom (second value)
    let wall1Mesh = new THREE.Mesh(wall1Geometry, glassMaterial);
    wall1Mesh.position.set(tankX/2 + 0.5, 4.5, 0); // 5 is for 1/2 of top and -0.5 is for 1/2 of bottom (second value)
    tankGroup.add(wall1Mesh);

    //negative x
    let wall2Geometry = new THREE.BoxGeometry(1, tankY + 11, tankZ);
    let wall2Mesh = new THREE.Mesh(wall2Geometry, glassMaterial);
    wall2Mesh.position.set(0 - (tankX/2 + 0.5), 4.5, 0);
    tankGroup.add(wall2Mesh);

    //positive z
    let wall3Geometry = new THREE.BoxGeometry(tankX + 2, tankY + 11, 1); // 2 is to cover the ends (first value)
    let wall3Mesh = new THREE.Mesh(wall3Geometry, glassMaterial);
    wall3Mesh.position.set(0, 4.5, tankZ/2 + 0.5);
    tankGroup.add(wall3Mesh);


    //back wall
    let backWallMaterialProperties = {
        color: '#1d1d1d',
        specular: '#949494',
        shininess: 10
    }
    let backWallmaterial = new THREE.MeshPhongMaterial(backWallMaterialProperties)
    let backWallGeometry = new THREE.BoxGeometry(tankX + 2, tankY + 11, 0.5);
    let backWallMesh = new THREE.Mesh(backWallGeometry, backWallmaterial);
    backWallMesh.castShadow = true;
    backWallMesh.receiveShadow = true;
    backWallMesh.position.set(0, 4.5, 0 - (tankZ/2 + 0.75));
    tankGroup.add(backWallMesh);

    //upper back wall
    let upperBackWallGeometry = new THREE.BoxGeometry(tankX + 2, 10, 0.5);
    let upperBackWallMesh = new THREE.Mesh(upperBackWallGeometry, backWallmaterial);
    upperBackWallMesh.position.set(0, tankY/2 + 5, 0 - (tankZ/2 + 0.25));
    tankGroup.add(upperBackWallMesh);


    //backdrop
    let backdropMaterial = new THREE.MeshPhongMaterial()
    backdropMaterial.map = THREE.ImageUtils.loadTexture("assets/textures/backdrop-texture.jpg");
    backdropMaterial.map.wrapS = backdropMaterial.map.wrapT = THREE.RepeatWrapping;
    backdropMaterial.map.repeat.set(1,1);
    let backdropGeometry = new THREE.BoxGeometry(tankX + 2, tankY + 1, 0.5);
    let backdropMesh = new THREE.Mesh(backdropGeometry, backdropMaterial);
    backdropMesh.receiveShadow = true;
    backdropMesh.position.set(0, -0.5, 0 - (tankZ/2 + 0.25));
    tankGroup.add(backdropMesh);


    
    tankGroup.name = "tank";
    group.add(tankGroup);

}

export function addSand(group, tankX, tankY, tankZ) {

    let sandGeometry = new THREE.BoxGeometry(tankX, 1, tankZ);

    let sandMaterial = new THREE.MeshPhongMaterial();
    sandMaterial.map = THREE.ImageUtils.loadTexture("assets/textures/sand-texture.jpg");
    sandMaterial.map.wrapS = sandMaterial.map.wrapT = THREE.RepeatWrapping;
    sandMaterial.map.repeat.set(0.2,0.1);

    let sandMesh = new THREE.Mesh(sandGeometry, sandMaterial);
    sandMesh.position.set(0, 0 - (tankY/2 + 0.5), 0);
    group.add(sandMesh);
}