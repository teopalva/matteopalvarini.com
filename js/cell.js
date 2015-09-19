
(function() {

    var imageWidth = 343;
    var imageHeight = 343;
    var radius = imageHeight / 2;

    var cell = d3.select(".project");

    var canvas = cell.append("canvas")
        .attr("width", imageWidth)
        .attr("height", imageHeight);

    var context = canvas.node().getContext("2d");

    var image = new Image;
    image.src = "https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/2/005/0a8/0ee/14de48e.jpg";
    //image.onload = resized;

    function drawImage() {
        context.save();
        context.translate(imageWidth / 2, imageHeight / 2);
        context.beginPath();
        context.moveTo(0, -radius);
        context.stroke();
        var currPos = [0, -radius];

        var interpolate = function(currPos, B, steps, time) {
            var unit = [B[0] / steps, B[1] / steps];
            for(var i=1; i<=steps; i++) {
                (function(x, y) {
                    var action = function() {
                        context.lineTo(x, y);
                        context.stroke();
                    };
                    setTimeout(action, (time / steps) * i);
                })(currPos[0] + unit[0] * i, currPos[1] + unit[1] * i);
            }
        };

        for (var i = 1; i <= 7; i++) {
            var angle = i * Math.PI / 3,
                x = Math.sin(angle) * radius,
                y = -Math.cos(angle) * radius;
            (function(x, y, c, i, currPos) {
                var action = function() {
                    if(i === 7) {
                        afterDrawing();
                    } else {
                        c.lineTo(x, y);
                        c.stroke();
                        //interpolate(currPos, [x,y], 10, 10000);
                    }
                };
                if(i === 1) {
                    action();
                } else {
                    setTimeout(action, 1000 * (i-1));
                }
            })(x, y, context, i, currPos);
            currPos = [x, y];
        }

        var afterDrawing = function() {
            context.stroke();
            context.clip();
            context.drawImage(image,
                0, 0,
                imageWidth, imageHeight,
                -imageWidth / 2, -imageHeight / 2,
                imageWidth, imageHeight);
            context.restore();
        };

    }

    drawImage();

}());