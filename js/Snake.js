var targets = { buttom: [] };
var buttomObject = [];
var number = 9, width = 120, height = 120;
$(function () {
    init();
    animate();
});

var renderer, camera, scene, controls;
function init() {
    scene = new THREE.Scene();

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = "absolute";
    document.getElementById("container").appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 800;

    for (var i = 0; i < number * number; i++) {
        var element = document.createElement("div");
        element.className = "element";
        element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';
        element.style.width = width + "px";
        element.style.height = height + "px";
        element.innerText = i;

        var object = new THREE.CSS3DObject(element);
        object.position.x = Math.random() * 4000 - 2000;
        object.position.y = Math.random() * 4000 - 2000;
        object.position.z = Math.random() * 4000 - 2000;
        scene.add(object);
        buttomObject.push(object);

        var object = new THREE.Object3D();
        object.position.x = i % number * width - Math.floor(number / 2) * width;
        object.position.y = Math.floor(i / number) * height - Math.floor(number / 2) * height;

        element.innerText = object.position.x + "   " + object.position.y;

        targets.buttom.push(object);
    }

    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.5;
    controls.minDistance = 500;
    controls.maxDistance = 6000;
    controls.addEventListener('change', render);

    transform(targets.buttom, 4000);
}

function transform(targets, duration) {
    TWEEN.removeAll();

    for (var i = 0; i < buttomObject.length; i++) {
        var object = buttomObject[i];
        var target = targets[i];
        new TWEEN.Tween(object.position)
            .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
        new TWEEN.Tween(object.rotation)
            .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
    }
    new TWEEN.Tween(this)
        .to({}, duration * 2)
        .onUpdate(render)
        .start();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    TWEEN.update();
}

function render() {
    renderer.render(scene, camera);
}