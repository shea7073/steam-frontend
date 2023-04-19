
    window.onload = init;
    window.addEventListener('resize', function (e) {
        clearInterval(intervalID);
        ballInfo = []
        init();
    })

    let canvas: any;
    let context: any;
    let width: number, height: number;
    const dx = 0;
    let ballColor = '#c7d5e0';
    let ballInfo: any[];
    let intervalID: any;

    function init() {
        canvas = document.getElementById("bubble-canvas");
        context = canvas.getContext("2d");

        context.canvas.width = window.innerWidth;
        context.canvas.height = window.innerHeight;

        width = canvas.width;
        height = canvas.height;

        for (let i = 0; i < 10; i++) {
            let radius = Math.floor(Math.random() * (10 - 3 + 1)) + 3;
            let spawnX = Math.floor(Math.random() * ((width - radius) - radius + 1)) + radius;
            let spawnY = height + radius;
            let speed = Math.floor(Math.random() * (10 - 3 + 1)) + 3;
            ballInfo.push({x: spawnX, y: spawnY, speed: speed, radius: radius});
        }
        intervalID = setInterval(drawBallOnCanvas, 33);
    }


    // draw current position on the canvas
    function drawBallOnCanvas() {

        // Clear the canvas

        context.fillStyle = '#2a475e';
        context.fillRect(0, 0, width, height);

        // render the ball

        for (let i = 0; i < ballInfo.length; i++) {
            let gradient = context.createRadialGradient(ballInfo[i].x, ballInfo[i].y, ballInfo[i].radius, (ballInfo[i].x - 3), (ballInfo[i].y -3), 0);
            gradient.addColorStop(.66, ballColor)
            gradient.addColorStop(1, "#9999ff");
            context.strokeStyle = 'black';
            context.fillStyle = gradient;
            context.beginPath();
            context.arc(ballInfo[i].x, ballInfo[i].y, ballInfo[i].radius, 0, 2 * Math.PI);
            context.fill();
            context.closePath();
        }

        // update ball position
        for (let i = 0; i < ballInfo.length; i++) {
            ballInfo[i].y -= ballInfo[i].speed;

            if (ballInfo[i].y < 0) {
                ballInfo[i].y = height - ballInfo[i].radius;
                ballInfo[i].x = Math.floor(Math.random() * ((width - ballInfo[i].radius) - ballInfo[i].radius + 1)) + ballInfo[i].radius;
                ballInfo[i].speed = Math.floor(Math.random() * (10 - 3 + 1)) + 3;
            }

        }
    }





