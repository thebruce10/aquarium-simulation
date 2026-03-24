import { addLighting, addTable, addWater, addTank, addSand } from "./visualEnvironment.mjs";
import { addBoundaries } from "./boundaries.mjs";
import { addNeonTetra, addGoldfish } from "./fish.mjs";
import { moveFish } from "./fishMovement.mjs";
import { addCoral } from "./decorations.mjs";
import { addSeaweed } from "./decorations.mjs";

let renderer;
let scene;
let camera;
let camControls;
let transformControls;
let projector = new THREE.Projector();
let selectedObject;
let outline;
let tankX;
let tankY;
let tankZ;
let counter;
let neonTetraAmount;
let goldfishAmount;
let editorVisible = true;
let objectToolBarHidden = false;
let animalsToolBarHidden = false;
let decorationsToolBarHidden = false;
let pointerDownX;
let pointerDownY;

function init() {

    Physijs.scripts.worker = "libs/physijs_worker.js";

    scene = new Physijs.Scene({ fixedTimeStep: 1 / 60 });
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

    selectedObject = false;
    outline = false;

    transformControls = new THREE.TransformControls(camera, renderer.domElement);
    scene.add(transformControls);


    transformControls.addEventListener("change",
        () => {
            if (selectedObject) {
                selectedObject.__dirtyPosition = true;
                selectedObject.__dirtyRotation = true;

                let min = new THREE.Vector3(-tankX/2, -tankY/2, -tankZ/2);
                let max = new THREE.Vector3(tankX/2, tankY/2, tankZ/2);
                transformControls.object.position.clamp(min, max);
                transformControls.position.clamp(min, max);

                objectToolBarChange(); //update the display
            }
        }
    );
    //not working
    transformControls.minX = -tankX/2;
    transformControls.maxX = tankX/2;
    transformControls.minY = -tankY/2;
    transformControls.maxY = tankY/2;
    transformControls.minZ = -tankZ/2;
    transformControls.maxZ = tankZ/2;

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


    neonTetraAmount = 10;
    goldfishAmount = 3;

    refreshAnimalsToolBar();

    let editor = document.getElementById("editor")
    let objectToolBar = document.getElementById("objectToolBar");
    let animalsToolBar = document.getElementById("animalsToolBar");
    let decorationsToolBar = document.getElementById("decorationsToolBar");

    document.getElementById("objectToolBarContent").style.display = "block";
    document.getElementById("objectToolBarTopButton").innerHTML = "&#9660";
    objectToolBar.style.left = editor.offsetWidth - objectToolBar.offsetWidth - 10 + "px";
    objectToolBar.style.top = 10 + "px";
    dragElement(objectToolBar, editor);

    document.getElementById("animalsToolBarContent").style.display = "block";
    document.getElementById("animalsToolBarTopButton").innerHTML = "&#9660";
    animalsToolBar.style.left = 10 + "px";
    animalsToolBar.style.top = editor.offsetHeight - animalsToolBar.offsetHeight - 10 + "px";
    dragElement(animalsToolBar, editor);

    document.getElementById("decorationsToolBarContent").style.display = "block";
    document.getElementById("decorationsToolBarTopButton").innerHTML = "&#9660";
    decorationsToolBar.style.left = editor.offsetWidth - decorationsToolBar.offsetWidth - 10 + "px";
    decorationsToolBar.style.top = editor.offsetHeight - decorationsToolBar.offsetHeight - 10 + "px";
    dragElement(decorationsToolBar, editor);



    addCoral(scene, 25, -tankY/2, 0);
    addCoral(scene, -10, -tankY/2, 10);
    addSeaweed(scene, -25, -tankY/2, 0);
    addSeaweed(scene, 20, -tankY/2, 15);
    addSeaweed(scene, 5, -tankY/2, -5);
    addSeaweed(scene, -10, -tankY/2, -10);

    counter = 0;
    render();

    console.log(scene)

}


function render() {
    renderer.render(scene, camera);

    camControls.update();


    moveFish(scene, counter, tankX, tankY, tankZ, neonTetraAmount, goldfishAmount);
    scene.simulate();

    
    requestAnimationFrame(render);
    counter++;
}


function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    let editor = document.getElementById("editor");
    let objectToolBar = document.getElementById("objectToolBar");
    let animalsToolBar = document.getElementById("animalsToolBar");
    let decorationsToolBar = document.getElementById("decorationsToolBar");
    clampElementPosition(objectToolBar, editor);
    clampElementPosition(animalsToolBar, editor);
    clampElementPosition(decorationsToolBar, editor);
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

        editorVisible = true;
        let editor = document.getElementById("editor");
        editor.style.display = "block";
    }

    //immersive button hides all the tools
    if (event.target.id == "immersiveSubMenuButton") {
        console.log("switch to immersive view");

        editorVisible = false;
        let editor = document.getElementById("editor");
        editor.style.display = "none";

        deselectObject();
        
    }

    //delete button deletes an object
    if (event.target.id == "deleteMenuButton") {
        if (selectedObject) {
            let deletePopup = document.getElementById("deletePopup");
            deletePopup.style.display = "block";
        }
    }
    if (event.target.id == "yesDeletePopupButton") {
        //delete the object
        scene.remove(selectedObject);
        deselectObject();

        let deletePopup = document.getElementById("deletePopup");
        deletePopup.style.display = "none";
    }
    if (event.target.id == "noDeletePopupButton") {
        //dont delete the object

        let deletePopup = document.getElementById("deletePopup");
        deletePopup.style.display = "none";
    }


    //screenshot button takes a screenshot
    if (event.target.id == "screenshotMenuButton") {
        takeScreenshot();
    }


    if (event.target.id == "coralDecorationsToolBarButton") {
        addCoral(scene, 0, -tankY/2, 0);
    }

    if (event.target.id == "seaweedDecorationsToolBarButton") {
        addSeaweed(scene, 0, -tankY/2, 0);
    }

    if (event.target.id == "objectToolBarTopButton") {
        let content = document.getElementById("objectToolBarContent");
        let button = document.getElementById("objectToolBarTopButton");
        if (content.style.display == "block") {
            button.innerHTML = "&#9650";
            content.style.display = "none";
            
        } else {
            button.innerHTML = "&#9660";
            content.style.display = "block";
            let editor = document.getElementById("editor");
            let objectToolBar = document.getElementById("objectToolBar");
            clampElementPosition(objectToolBar, editor);
        }
    }

    if (event.target.id == "animalsToolBarTopButton") {
        let content = document.getElementById("animalsToolBarContent");
        let button = document.getElementById("animalsToolBarTopButton");
        if (content.style.display == "block") {
            button.innerHTML = "&#9650";
            content.style.display = "none";
            
        } else {
            button.innerHTML = "&#9660";
            content.style.display = "block";
            let editor = document.getElementById("editor");
            let animalsToolBar = document.getElementById("animalsToolBar");
            clampElementPosition(animalsToolBar, editor);
        }
    }

    if (event.target.id == "decorationsToolBarTopButton") {
        let content = document.getElementById("decorationsToolBarContent");
        let button = document.getElementById("decorationsToolBarTopButton");
        if (content.style.display == "block") {
            button.innerHTML = "&#9650";
            content.style.display = "none";
            
        } else {
            button.innerHTML = "&#9660";
            content.style.display = "block";
            let editor = document.getElementById("editor");
            let decorationsToolBar = document.getElementById("decorationsToolBar");
            clampElementPosition(decorationsToolBar, editor);
        }
    }

}


function refreshAnimalsToolBar() {
    document.getElementById("neonTetraAnimalsToolBarSlider").value = neonTetraAmount;
    document.getElementById("neonTetraAnimalsToolBarInput").value = neonTetraAmount;
    document.getElementById("goldfishAnimalsToolBarSlider").value = goldfishAmount;
    document.getElementById("goldfishAnimalsToolBarInput").value = goldfishAmount;
}

function selectObject(object) {
    selectedObject = object;

    //remove previous outline
    if (outline){
        scene.remove(outline);
    }
    
    //give object an outline
    outline = new THREE.EdgesHelper(selectedObject, "#7171ff"); // color
    outline.material.linewidth = 1; // Set line thickness
    scene.add(outline);

    //show deselect message
    let instruction = document.getElementById("selectUserInstruction");
    instruction.style.display = "block";

    //turn off camera makes it a lot easier
    camControls.enabled = false
    camControls.state = -1;

    transformControls.attach(selectedObject);
    transformControls.setMode("translate");

    objectToolBarChange();

}

function deselectObject() {
    if (selectedObject) {
        //remove objects outline
        scene.remove(outline);
        selectedObject = false;
        
        transformControls.detach();

        //hide deselect message
        let instruction = document.getElementById("selectUserInstruction");
        instruction.style.display = "none";

        //turn camera back on
        camControls.enabled = true;
        camControls.state = -1; // reset camera state 

        //fire fake mouse event so orbit controls aren't sticky and auto matically rotating
        const evt = new MouseEvent('mouseup', {     
            button: 0,
            bubbles: true
        });

        camControls.domElement.dispatchEvent(evt);
    }
    objectToolBarChange();
}

function pickObject(x,y) {
    let vector = new THREE.Vector3((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1, 0.5);
        projector.unprojectVector(vector, camera);
        let raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        let intersects = raycaster.intersectObjects(scene.children);

        
        let clickedObject = false;
        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object.userData.type == "decoration") {
                clickedObject = intersects[i].object;
                break;
            }
        }
        if (clickedObject) {
            if (editorVisible){
                selectObject(clickedObject);
            }
        }
}

function onDocumentPointerDown(event) {
    if (event.target.id == "threeJSCanvas") {
        pointerDownX = event.clientX;
        pointerDownY = event.clientY;
    }
    
    
}

function onDocumentPointerUp(event) {

    if (event.target.id == "threeJSCanvas") {
        if (pointerDownX == event.clientX && pointerDownY == event.clientY) {
            if (selectedObject) {
                deselectObject();
            } else {
                pickObject(event.clientX, event.clientY);
            }
        }
    }
}

function neonTetraAnimalsToolBarSliderChange(event) {
    let slider = event.srcElement;
    let input = document.getElementById("neonTetraAnimalsToolBarInput");
    
    neonTetraAmount = slider.value;
    input.value = slider.value;

}
function neonTetraAnimalsToolBarInputChange(event) {
    let input = event.srcElement;
    let slider = document.getElementById("neonTetraAnimalsToolBarSlider");
    
    input.value = clamp(input.value, input.min, input.max);

    neonTetraAmount = input.value;
    slider.value = input.value;
}

function goldfishAnimalsToolBarSliderChange(event) {
    let slider = event.srcElement;
    let input = document.getElementById("goldfishAnimalsToolBarInput");
    
    goldfishAmount = slider.value;
    input.value = slider.value;

}
function goldfishAnimalsToolBarInputChange(event) {
    let input = event.srcElement;
    let slider = document.getElementById("goldfishAnimalsToolBarSlider");

    // input.value = clamp(input.value, input.min, input.max);
    
    goldfishAmount = input.value;
    slider.value = input.value;
}

function clamp(number, min, max) {
    return Math.min(Math.max(number, min), max);
}

function objectToolBarChange(event) {
    if (selectedObject){
        if (event) { //if there is an event
            //name
            if (event.target.id == "nameObjectToolBarInput") {
                let nameInput = document.getElementById("nameObjectToolBarInput");
                selectedObject.name = nameInput.value;
            }

            //location x
            if (event.target.id == "locationXObjectToolBarInput") {
                let locX = document.getElementById("locationXObjectToolBarInput");

                locX.value = clamp(Number(locX.value), Number(locX.min), Number(locX.max));

                let tempX = selectedObject.position.x;

                selectedObject.position.x = Number(locX.value);

                if (tempX !== selectedObject.position.x) {
                    selectedObject.__dirtyPosition = true;
                    selectedObject.__dirtyRotation = true;
                } else {
                    selectedObject.__dirtyPosition = false;
                    selectedObject.__dirtyRotation = false;
                }
            }

            //location y
            if (event.target.id == "locationYObjectToolBarInput") {
                let locY = document.getElementById("locationYObjectToolBarInput");

                locY.value = clamp(Number(locY.value), Number(locY.min), Number(locY.max));

                let tempY = selectedObject.position.y;

                selectedObject.position.y = Number(locY.value);

                if (tempY !== selectedObject.position.y) {
                    selectedObject.__dirtyPosition = true;
                    selectedObject.__dirtyRotation = true;
                } else {
                    selectedObject.__dirtyPosition = false;
                    selectedObject.__dirtyRotation = false;
                }
            }

            //location z
            if (event.target.id == "locationZObjectToolBarInput") {
                let locZ = document.getElementById("locationZObjectToolBarInput");

                locZ.value = clamp(Number(locZ.value), Number(locZ.min), Number(locZ.max));

                let tempZ = selectedObject.position.z;

                selectedObject.position.z = Number(locZ.value);

                if (tempZ !== selectedObject.position.z) {
                    selectedObject.__dirtyPosition = true;
                    selectedObject.__dirtyRotation = true;
                } else {
                    selectedObject.__dirtyPosition = false;
                    selectedObject.__dirtyRotation = false;
                }
            }


            //rotation x
            if (event.target.id == "rotationXObjectToolBarInput") {
                let rotX = document.getElementById("rotationXObjectToolBarInput");

                rotX.value = clamp(Number(rotX.value), Number(rotX.min), Number(rotX.max));

                let tempX = selectedObject.rotation.x;

                selectedObject.rotation.x = Math.PI/180 * Number(rotX.value);

                if (tempX !== selectedObject.rotation.x) {
                    selectedObject.__dirtyPosition = true;
                    selectedObject.__dirtyRotation = true;
                } else {
                    selectedObject.__dirtyPosition = false;
                    selectedObject.__dirtyRotation = false;
                }
            }

            //rotation y
            if (event.target.id == "rotationYObjectToolBarInput") {
                let rotY = document.getElementById("rotationYObjectToolBarInput");

                rotY.value = clamp(Number(rotY.value), Number(rotY.min), Number(rotY.max));

                let tempY = selectedObject.rotation.y;

                selectedObject.rotation.y = Math.PI/180 * Number(rotY.value);

                if (tempY !== selectedObject.rotation.y) {
                    selectedObject.__dirtyPosition = true;
                    selectedObject.__dirtyRotation = true;
                } else {
                    selectedObject.__dirtyPosition = false;
                    selectedObject.__dirtyRotation = false;
                }
            }

            //rotation z
            if (event.target.id == "rotationZObjectToolBarInput") {
                let rotZ = document.getElementById("rotationZObjectToolBarInput");

                rotZ.value = clamp(Number(rotZ.value), Number(rotZ.min), Number(rotZ.max));

                let tempZ = selectedObject.rotation.z;

                selectedObject.rotation.z = Math.PI/180 * Number(rotZ.value);

                if (tempZ !== selectedObject.rotation.z) {
                    selectedObject.__dirtyPosition = true;
                    selectedObject.__dirtyRotation = true;
                } else {
                    selectedObject.__dirtyPosition = false;
                    selectedObject.__dirtyRotation = false;
                }
            }



        } else {
            //enable all the controls and set them to the correct values
            enableObjectToolBar();

        }
        
    } else {
        //disable all the controls and set them to blank
        disableObjectToolBar();
    }
}

function enableObjectToolBar() {
    //get all the input elements
    let nameInput = document.getElementById("nameObjectToolBarInput");
    let locX = document.getElementById("locationXObjectToolBarInput");
    let locY = document.getElementById("locationYObjectToolBarInput");
    let locZ = document.getElementById("locationZObjectToolBarInput");
    let rotX = document.getElementById("rotationXObjectToolBarInput");
    let rotY = document.getElementById("rotationYObjectToolBarInput");
    let rotZ = document.getElementById("rotationZObjectToolBarInput");

    //set minimum and maximum values
    locX.min = parseInt(-tankX/2);
    locX.max = parseInt(tankX/2);
    locY.min = parseInt(-tankY/2);
    locY.max = parseInt(tankY/2);
    locZ.min = parseInt(-tankZ/2);
    locZ.max = parseInt(tankZ/2);

    //set all the input elements to the correct values
    nameInput.value = selectedObject.name;
    locX.value = selectedObject.position.x;
    locY.value = selectedObject.position.y;
    locZ.value = selectedObject.position.z;
    rotX.value = Math.round(selectedObject.rotation.x * 180/Math.PI);
    rotY.value = Math.round(selectedObject.rotation.y * 180/Math.PI);
    rotZ.value = Math.round(selectedObject.rotation.z * 180/Math.PI);

    //enable all the input elements
    nameInput.disabled = false;
    locX.disabled = false;
    locY.disabled = false;
    locZ.disabled = false;
    rotX.disabled = false;
    rotY.disabled = false;
    rotZ.disabled = false;
}

function disableObjectToolBar() {
    //get all the input elements
    let nameInput = document.getElementById("nameObjectToolBarInput");
    let locX = document.getElementById("locationXObjectToolBarInput");
    let locY = document.getElementById("locationYObjectToolBarInput");
    let locZ = document.getElementById("locationZObjectToolBarInput");
    let rotX = document.getElementById("rotationXObjectToolBarInput");
    let rotY = document.getElementById("rotationYObjectToolBarInput");
    let rotZ = document.getElementById("rotationZObjectToolBarInput");

    //blank all the values
    nameInput.value = "";
    locX.value = "";
    locY.value = "";
    locZ.value = "";
    rotX.value = "";
    rotY.value = "";
    rotZ.value = "";

    //disable all the input elements
    nameInput.disabled = true;
    locX.disabled = true;
    locY.disabled = true;
    locZ.disabled = true;
    rotX.disabled = true;
    rotY.disabled = true;
    rotZ.disabled = true;
}

function dragElement(element, area) {
    //code from https://www.w3schools.com/howto/howto_js_draggable.asp

    let pos1;
    let pos2;
    let pos3;
    let pos4;
    if (document.getElementById(element.id + "Top")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(element.id + "Top").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        element.onmousedown = dragMouseDown;
    }

    function dragMouseDown(event) {
        event = event || window.event;
        event.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = event.clientX;
        pos4 = event.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(event) {
        event = event || window.event;
        event.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - event.clientX;
        pos2 = pos4 - event.clientY;
        pos3 = event.clientX;
        pos4 = event.clientY;
        // set the element's new position:
        let newPositionY = (element.offsetTop - pos2);
        let newPositionX = (element.offsetLeft - pos1);
        element.style.top = clamp(newPositionY, 0, area.offsetHeight - element.offsetHeight) + "px";
        element.style.left = clamp(newPositionX, 0, area.offsetWidth - element.offsetWidth) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function clampElementPosition(element, area) {
    console.log(parseInt(element.style.top), 0, area.offsetHeight - element.offsetHeight);
    console.log();
    element.style.top = clamp(parseInt(element.style.top), 0, area.offsetHeight - element.offsetHeight) + "px";
    element.style.left = clamp(parseInt(element.style.left), 0, area.offsetWidth - element.offsetWidth) + "px";
}

function onDocumentKeyDown(event) {

    switch (event.code) {
        case "Escape":
            deselectObject();
            break;
        case "KeyR":
            transformControls.setMode("rotate");
            break;
        case "KeyT":
            transformControls.setMode("translate");
            break;
        case "Delete":
            if (selectedObject) {
                let deletePopup = document.getElementById("deletePopup");
                deletePopup.style.display = "block";
            }
            break;

    }

}


//because cannot get the camera controls back when in transform mode
document.addEventListener("keydown", onDocumentKeyDown);


window.addEventListener("load", init);
window.addEventListener("resize", resize);

document.addEventListener("click", clickHandler);
document.addEventListener("pointerdown", onDocumentPointerDown);
document.addEventListener("pointerup", onDocumentPointerUp);



document.getElementById("neonTetraAnimalsToolBarSlider").addEventListener("input", neonTetraAnimalsToolBarSliderChange);
document.getElementById("neonTetraAnimalsToolBarInput").addEventListener("input", neonTetraAnimalsToolBarInputChange);

document.getElementById("goldfishAnimalsToolBarSlider").addEventListener("input", goldfishAnimalsToolBarSliderChange);
document.getElementById("goldfishAnimalsToolBarInput").addEventListener("input", goldfishAnimalsToolBarInputChange);

document.getElementById("objectToolBar").addEventListener("change", objectToolBarChange);