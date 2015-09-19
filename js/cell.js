
(function() {

    var imageWidth = 343;
    var imageHeight = 343;
    var radius = imageHeight / 2;
    var duration = 1000;

    var cell = d3.select(".project");

    var canvas = cell.append("canvas")
        .attr("width", imageWidth)
        .attr("height", imageHeight)
        .classed('canvas', true);

    var context = canvas.node().getContext("2d");

    var image = new Image;
    image.src = "https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/2/005/0a8/0ee/14de48e.jpg";
    //image.onload = func;

    function drawImage() {
        context.save();
        context.translate(imageWidth / 2, imageHeight / 2);
        context.beginPath();
        context.moveTo(0, -radius);
        context.stroke();
        context.lineWidth = 1;
        context.strokeStyle = 'white';
        var currPos = [0, -radius];

        /**
         * Performs linear interpolation between 2 points A and B.
         * @param A coordinates of origin
         * @param B coordinates of arrival point
         * @param steps number of intermediate steps
         * @param time total time
         */
        var interpolate = function(A, B, steps, time) {
            var unit = [Math.abs(B[0] - A[0]) / steps, Math.abs(B[1] - A[1]) / steps];
            var xSign = B[0] > A [0] ? +1 : -1;
            var ySign = B[1] > A [1] ? +1 : -1;
            for(var i=0; i<steps; i++) {
                (function(x, y, i) {
                    var action = function() {
                        if(i === steps -1) {
                            // Round the coords for last point
                            context.lineTo(B[0], B[1]);
                        } else {
                            context.lineTo(x, y);
                        }
                        context.stroke();
                        return true;
                    };
                    d3.timer(action, (time / steps) * i);
                })(A[0] + unit[0] * xSign * (i+1), A[1] + unit[1] * ySign * (i+1), i);
            }
        };

        var durationEdge = duration / 6;
        for (var i = 1; i <= 7; i++) {
            var angle = i * Math.PI / 3,
                x = Math.sin(angle) * radius,
                y = -Math.cos(angle) * radius;
            (function(x, y, i, currPos) {
                var action = function() {
                    if(i === 7) {
                        afterDrawing();
                    } else {
                        interpolate(currPos, [x,y], 10, durationEdge);
                    }
                    return true;
                };
                if(i === 1) {
                    action();
                } else {
                    d3.timer(action, durationEdge * (i-1));
                }
            })(x, y, i, currPos);
            currPos = [x, y];
        }

        var afterDrawing = function() {
            context.clip();
            context.drawImage(image,
                0, 0,
                imageWidth, imageHeight,
                -imageWidth / 2, -imageHeight / 2,
                imageWidth, imageHeight);
            context.strokeStyle = null;
            context.restore();
        };

    }

    drawImage();

}());