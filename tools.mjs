export function addAxes(scene) {
    let axes = new THREE.Group();

    let axesLength = 10;
    let axesWidth = 1.5;


    let xArrowMaterialProperties = {
        color: '#ff0000',
        transparent: true,
        opacity: 0.5 //change this to 0.25 when the mouse is over it
    }
    let xArrowMaterial = new THREE.MeshBasicMaterial(xArrowMaterialProperties);
    let xArrow = new THREE.Group();
    let xCylinderGeometry = new THREE.CylinderGeometry(axesWidth/2, axesWidth/2, axesLength);
    let xCylinderMesh = new THREE.Mesh(xCylinderGeometry, xArrowMaterial);
    xCylinderMesh.position.set(0, axesLength/2, 0)
    xArrow.add(xCylinderMesh);
    let xConeGeometry = new THREE.CylinderGeometry(0, axesWidth, axesWidth*2);
    let xConeMesh = new THREE.Mesh(xConeGeometry, xArrowMaterial);
    xConeMesh.position.set(0, axesLength + axesWidth, 0)
    xArrow.add(xConeMesh);
    xArrow.rotation.set(0, 0, Math.PI/180 * -90);
    axes.add(xArrow);


    let yArrowMaterialProperties = {
        color: '#00ff00',
        transparent: true,
        opacity: 0.5 //change this to 0.25 when the mouse is over it
    }
    let yArrowMaterial = new THREE.MeshBasicMaterial(yArrowMaterialProperties);
    let yArrow = new THREE.Group();
    let yCylinderGeometry = new THREE.CylinderGeometry(axesWidth/2, axesWidth/2, axesLength);
    let yCylinderMesh = new THREE.Mesh(yCylinderGeometry, yArrowMaterial);
    yCylinderMesh.position.set(0, axesLength/2, 0)
    yArrow.add(yCylinderMesh);
    let yConeGeometry = new THREE.CylinderGeometry(0, axesWidth, axesWidth*2);
    let yConeMesh = new THREE.Mesh(yConeGeometry, yArrowMaterial);
    yConeMesh.position.set(0, axesLength + axesWidth, 0)
    yArrow.add(yConeMesh);
    yArrow.rotation.set(0, 0, 0)
    axes.add(yArrow);


    let zArrowMaterialProperties = {
        color: '#0000ff',
        transparent: true,
        opacity: 0.5 //change this to 0.25 when the mouse is over it
    }
    let zArrowMaterial = new THREE.MeshBasicMaterial(zArrowMaterialProperties);
    let zArrow = new THREE.Group();
    let zCylinderGeometry = new THREE.CylinderGeometry(axesWidth/2, axesWidth/2, axesLength);
    let zCylinderMesh = new THREE.Mesh(zCylinderGeometry, zArrowMaterial);
    zCylinderMesh.position.set(0, axesLength/2, 0)
    zArrow.add(zCylinderMesh);
    let zConeGeometry = new THREE.CylinderGeometry(0, axesWidth, axesWidth*2);
    let zConeMesh = new THREE.Mesh(zConeGeometry, zArrowMaterial);
    zConeMesh.position.set(0, axesLength + axesWidth, 0)
    zArrow.add(zConeMesh);
    zArrow.rotation.set(Math.PI/180 * 90, 0, 0);
    axes.add(zArrow);

    scene.add(axes);
}