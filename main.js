import { addLighting, addTable, addWater, addTank, addSand } from "./visualEnvironment.mjs";
import { addBoundaries } from "./boundaries.mjs";
import { addNeonTetra } from "./fish.mjs";
import { moveFish } from "./fishMovement.mjs";
import { addAxes } from "./tools.mjs";

let renderer;
let scene;
let camera;
let camControls;
let tankX;
let tankY;
let tankZ;
let counter;

function init() {

    Physijs.scripts.worker = "libs/physijs_worker.js";

    scene = new Physijs.Scene();
    scene.setGravity(new THREE.Vector3(0, -0, 0));

    camera = new THREE.PerspectiveCamera(
        27, //field of view
        window.innerWidth / window.innerHeight, //aspect ratio
        0.1, //near plane
        10000 //far plane
    );
    
    renderer = new THREE.WebGLRenderer();
    renderer.preserveDrawingBuffer = true; //for screenshots
    renderer.setClearColor("#000000", 1,4);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camControls = new THREE.OrbitControls(camera, renderer.domElement);
    //maybe make the camera not be able to pan

    camera.position.x = 100;
    camera.position.y = 50;
    camera.position.z = 200;
    camera.lookAt(scene.position);

    renderer.domElement.setAttribute("aria-label", "Interactive 3D Aquarium Simulation");
    document.body.appendChild(renderer.domElement);

    tankX = 100;
    tankY = 50;
    tankZ = 50;


    let visualEnvironmentGroup = new THREE.Group();
    addLighting(visualEnvironmentGroup, tankX, tankY, tankZ);
    addTable(visualEnvironmentGroup, tankX, tankY, tankZ);
    addWater(visualEnvironmentGroup, tankX, tankY, tankZ);
    addTank(visualEnvironmentGroup, tankX, tankY, tankZ);
    addSand(visualEnvironmentGroup, tankX, tankY, tankZ);
    visualEnvironmentGroup.name = "visualEnvironmentGroup";
    scene.add(visualEnvironmentGroup);

    addBoundaries(scene, tankX, tankY, tankZ);

    // for (let i = 0; i < 100; i++) {
        // addNeonTetra(scene);
    // }

    counter = 0;
    render();
    
    renderer.domElement.toDataURL("image/png");

    console.log(scene);
}


function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);

    camControls.update()

    moveFish(scene, counter);




    scene.simulate();
    counter++;
}


function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


window.addEventListener("load", init);
window.addEventListener("resize", resize);
