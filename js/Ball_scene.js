var Ball = function (scene) {
    this.scene = scene;
    this.camera = camera;

    this.redius = 30;
    this.surfaceNum = 31;
    this.surfaceSize = 15;
    this.position = { x: 0, y: 0, z: 0 };
    this.center = { x: 0, y: 0, z: 0 };
    this.direction = 0;
    this.speed = 0;
    this.createTime = 3000;

    var divObject = [];
    var directObject = [];
    var startRun = false;
    this.init = function () {
        //创建div对象
        for (var i = 0, l = this.surfaceNum; i < l; i++) {
            var element = document.createElement("div");
            element.className = "element";
            var red = Math.floor(255 * Math.random());
            var green = Math.floor(255 * Math.random());
            var blud = Math.floor(255 * Math.random());
            element.style.backgroundColor = 'rgba(' + red + ',' + green + ',' + blud + ',' + (Math.random() * 0.5 + 0.5) + ')';
            element.style.width = this.surfaceSize + "px";
            element.style.height = this.surfaceSize + "px";
            //element.innerText = i;

            var object = new THREE.CSS3DObject(element);
            object.position.x = Math.random() * 4000 - 2000;
            object.position.y = Math.random() * 4000 - 2000;
            object.position.z = Math.random() * 4000 - 2000;
            this.scene.add(object);
            divObject.push(object);
        }
        //创建位置圆对象
        for (var i = 0, l = this.surfaceNum; i < l; i++) {
            var phi = Math.acos(-1 + (2 * i) / l);
            var theta = Math.sqrt(l * Math.PI) * phi;

            var object = new THREE.Object3D();
            object.position.x = this.redius * Math.cos(theta) * Math.sin(phi);
            object.position.y = this.redius * Math.sin(theta) * Math.sin(phi);
            object.position.z = this.redius * Math.cos(phi);
            object.lookAt(new THREE.Vector3(this.center.x, this.center.y, this.center.z));
            directObject.push(object);
        }

        this.transform(this.createTime);
        window.ondeviceorientation = this.Rotate;
        setTimeout(this.StartRun, this.createTime);
    }
    this.StartRun = function () {
        startRun = true;
    }
    this.StopRun = function () {
        startRun = false;
        vX = 0;
        vY = 0;
    }
    this.setPosition = function (x, y, z) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
    }

    var direction = this.direction;
    this.run = function () {
        var speed = Math.sqrt(vX * vX + vY * vY);
        //方向圆旋转
        for (var i = 0; i < this.surfaceNum; i++) {
            var object = directObject[i];
            var x = object.position.x;
            var y = object.position.y;
            var z = object.position.z;
            //转换坐标系
            var newX = x * Math.cos(direction) + y * Math.sin(direction);
            var newZ = z
            var newY = y * Math.cos(direction) - x * Math.sin(direction);
            //平行于滚动方向的半径
            var r = Math.sqrt(this.redius * this.redius - newY * newY);
            var omga = speed / this.redius;
            //由于acos只有>0部分，所以通过k来补全整个圆
            var k = -1; if (z > 0) k = 1;
            var newOmage = 0;
            //如果r==0，则说明在旋转轴上，角度为0
            if (r != 0) newOmage = Math.acos(newX / r) * k - omga;
            //滚动后的x,y分别为平行于滚动方向的半径*相应的三角函数
            newX = r * Math.cos(newOmage);
            newZ = r * Math.sin(newOmage);

            //回转坐标系,-direction
            var oldX = newX * Math.cos(-direction) + newY * Math.sin(-direction);
            var oldZ = newZ;
            var oldY = newY * Math.cos(-direction) - newX * Math.sin(-direction);
            object.position.x = oldX;
            object.position.y = oldY;
            object.position.z = oldZ;
        }
        ////div组旋转
        for (var i = 0; i < this.surfaceNum; i++) {
            var object = divObject[i];
            var target = directObject[i];
            object.position.x = target.position.x + this.position.x;
            object.position.y = target.position.y + this.position.y;
            object.position.z = target.position.z + this.position.z;
            object.lookAt(new THREE.Vector3(this.position.x, this.position.y, this.position.z));
        }
        this.position.x += vX;
        this.position.y += vY;
        pX = this.position.x;
        pY = this.position.y;
    }

    this.transform = function (duration) {

        TWEEN.removeAll();

        for (var i = 0; i < this.surfaceNum; i++) {

            var object = divObject[i];
            var target = directObject[i];

            new TWEEN.Tween(object.position)
                .to({ x: target.position.x, y: target.position.y, z: target.position.z }, duration)// Math.random() * duration + duration)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();

            new TWEEN.Tween(object.rotation)
                .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, duration)// Math.random() * duration + duration)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();

            new TWEEN.Tween(this.camera.position).to({ z: 2000 }, duration * 1.5).start();

        }

        new TWEEN.Tween(this)
            .to({}, duration * 2)
            .onUpdate(render)
            .start();

    }
    var g = 9.8;
    var pX, pY;
    var speedUp = 0.04; speedDown = 2.2;
    var vX = 0, vY = 0, aX = 0, aY = 0;
    this.Rotate = function (e) {
        if (startRun) {
            testImpact();
            var beta = -e.beta;
            var gamma = e.gamma;
            if (beta > 90) beta = 90;
            if (beta < -90) beta = -90;

            aX = g * Math.sin(gamma / 180 * Math.PI) * speedUp;
            aY = g * Math.sin(beta / 180 * Math.PI) * speedUp;

            if (aX * vX < 0) aX = aX * speedDown;
            if (aY * vY < 0) aY = aY * speedDown;
            vX += aX;
            vY += aY;
            if (vX > 0) {
                direction = Math.atan(vY / vX);
            }
            else {
                direction = Math.atan(vY / vX) + Math.PI;
            }
            if ((pX > 375 - 30 - 80 && vX > 0) || (pX < -(375 - 30 - 80) && vX < 0)) vX = -vX;
            if ((pY > 667 - 30 - 90 && vY > 0) || (pY < -(667 - 30 - 90) && vY < 0)) vY = -vY;
        }
    }
    this.move = function (px, py) {
        pX = px;
        pY = py;
        this.position.x = px;
        this.position.y = py;
        vX = 0;
        vY = 0;
    }
    this.init();
}