$(function () {
    InitThree();
    InitPlatform();
    ball = new Ball(scene,camera);
    animate();
});

var scene, camera, renderer, controls, ball, platformDiv;
var platformWidth = 750, platformLength = 1334;
function InitThree() {
    scene = new THREE.Scene();

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = "absolute";
    document.getElementById("container").appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 600;

    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.5;
    controls.minDistance = 500;
    controls.maxDistance = 3000;
    controls.addEventListener('change', render);

}
function InitPlatform() {
    platformDiv = document.createElement("div");
    platformDiv.className = "platform";
    //element.style.backgroundColor = 'rgba(0,127,127,0.5)';
    platformDiv.style.width = platformWidth + "px";
    platformDiv.style.height = platformLength + "px";
    var object = new THREE.CSS3DObject(platformDiv);
    object.position.x = 0;
    object.position.y = 0;
    object.position.z = -55;
    object.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(object);

}
function animate() {
    render();
    requestAnimationFrame(animate);
    TWEEN.update();
    controls.update();
    ball.run();
    testImpact()
}
function render() {
    renderer.render(scene, camera);
}