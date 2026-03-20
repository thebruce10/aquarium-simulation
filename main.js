import { addLighting, addTable, addWater, addTank, addSand } from "./visualEnvironment.mjs";
import { addBoundaries } from "./boundaries.mjs";
import { addNeonTetra, addGoldfish } from "./fish.mjs";
import { moveFish } from "./fishMovement.mjs";
import { addAxes } from "./tools.mjs";
import { addCoral } from "./decorations.mjs";
import { addSeaweed } from "./decorations.mjs";

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
    renderer.setClearColor("#000000", 1, 4);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camControls = new THREE.OrbitControls(camera, renderer.domElement);
    //maybe make the camera not be able to pan

    camera.position.x = 100;
    camera.position.y = 50;
    camera.position.z = 200;
    camera.lookAt(scene.position);

    renderer.domElement.setAttribute("aria-label", "Interactive 3D Aquarium Simulation");
    renderer.domElement.setAttribute("id", "threeJSCanvas");

    if (document.getElementById("threeJSCanvas")) {
        //there is already a canvas - replace it
        document.getElementById("threeJSCanvas").replaceWith(renderer.domElement);
    } else {
        //no canvas - add a new one
        document.body.appendChild(renderer.domElement);
    }


    tankX = 100;
    tankY = 50;
    tankZ = 50;


    let visualEnvironmentGroup = new THREE.Group();
    addTable(visualEnvironmentGroup, tankX, tankY, tankZ);
    addWater(visualEnvironmentGroup, tankX, tankY, tankZ);
    addTank(visualEnvironmentGroup, tankX, tankY, tankZ);
    addSand(visualEnvironmentGroup, tankX, tankY, tankZ);
    addLighting(visualEnvironmentGroup, tankX, tankY, tankZ);
    visualEnvironmentGroup.name = "visualEnvironmentGroup";
    scene.add(visualEnvironmentGroup);

    addBoundaries(scene, tankX, tankY, tankZ);

    for (let i = 0; i < 10; i++) {
        addNeonTetra(scene);
    }
    for (let i = 0; i < 3; i++) {
        addGoldfish(scene);
    }

    addCoral(scene, 25, -tankY/2, 0);
    addCoral(scene, -10, -tankY/2, 10);
    addSeaweed(scene, -25, -tankY/2, 0);
    addSeaweed(scene, 20, -tankY/2, 15);
    addSeaweed(scene, 5, -tankY/2, -5);
    addSeaweed(scene, -10, -tankY/2, -10);

    counter = 0;
    render();

    console.log(scene);
}


function render() {
    renderer.render(scene, camera);

    camControls.update();


    moveFish(scene, counter, tankX, tankY, tankZ);
    scene.simulate();

    
    requestAnimationFrame(render);
    counter++;
}


function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function takeScreenshot() {
    //code from https://stackoverflow.com/questions/26193702/three-js-how-can-i-make-a-2d-snapshot-of-a-scene-as-a-jpg-image
    let imgData;

    let strMime = "image/png";
    let strDownloadMime = "image/octet-stream";

    renderer.render(scene, camera);
    imgData = renderer.domElement.toDataURL(strMime);

    let date = new Date();

    let link = document.createElement('a'); //create a link element
    if (typeof link.download === 'string') {
        document.body.appendChild(link);
        link.download = `aquarium_simulation_screenshot_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.png`;
        link.href = imgData.replace(strMime, strDownloadMime);
        link.click(); //download the file from the link
        document.body.removeChild(link); //remove the link when done
    } else {
        location.replace(uri);
    }

}

function clickHandler(event) {
    console.log(event.target.id);

    //file button shows file sub menu
    if (event.target.id == "fileMenuButton") {
        let fileSubMenuBar = document.getElementById("fileSubMenuBar");

        if (fileSubMenuBar.style.display == "none") {
            fileSubMenuBar.style.display = "block";
        } else {
            fileSubMenuBar.style.display = "none";
        }

    } else {
        let fileSubMenuBar = document.getElementById("fileSubMenuBar");
        fileSubMenuBar.style.display = "none";
    }

    //reset button initialises everything again
    if (event.target.id == "resetSubMenuButton") {
        let resetPopup = document.getElementById("resetPopup");
        resetPopup.style.display = "block"; //show reset popup
    }
    if (event.target.id == "yesResetPopupButton") {
        init();
        let resetPopup = document.getElementById("resetPopup");
        resetPopup.style.display = "none"; //hide reset popup
    }
    if (event.target.id == "noResetPopupButton") {
        console.log("reset aborted by user");
        let resetPopup = document.getElementById("resetPopup");
        resetPopup.style.display = "none"; //hide reset popup
    }

    //view button shows view sub menu
    if (event.target.id == "viewMenuButton") {
        let viewSubMenuBar = document.getElementById("viewSubMenuBar");

        if (viewSubMenuBar.style.display == "none") {
            viewSubMenuBar.style.display = "block";
        } else {
            viewSubMenuBar.style.display = "none";
        }

    } else {
        let viewSubMenuBar = document.getElementById("viewSubMenuBar");
        viewSubMenuBar.style.display = "none";
    }

    //editor button shows all the tools
    if (event.target.id == "editorSubMenuButton") {
        console.log("switch to editor view");
    }

    //immersive button hides all the tools
    if (event.target.id == "immersiveSubMenuButton") {
        console.log("switch to immersive view");
    }

    //delete button deletes an object
    if (event.target.id == "deleteMenuButton") {
        let deletePopup = document.getElementById("deletePopup");
        deletePopup.style.display = "block";
    }
    if (event.target.id == "yesDeletePopupButton") {
        console.log("delete the selected object");
        let deletePopup = document.getElementById("deletePopup");
        deletePopup.style.display = "none";
    }
    if (event.target.id == "noDeletePopupButton") {
        console.log("delete aborted by user");
        let deletePopup = document.getElementById("deletePopup");
        deletePopup.style.display = "none";
    }


    //screenshot button takes a screenshot
    if (event.target.id == "screenshotMenuButton") {
        takeScreenshot();
    }

}


window.addEventListener("load", init);
window.addEventListener("resize", resize);

document.addEventListener("click", clickHandler);