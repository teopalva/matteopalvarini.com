
(function() {

    var imageWidth = 343;
    var imageHeight = 343;
    var radius = imageHeight / 2;
    var duration = 1000;
    var numSteps = 10;

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
        var qExt = queue(1);
        var qInt = queue(1);

        /**
         * Performs linear interpolation between 2 points A and B.
         * @param A coordinates of origin
         * @param B coordinates of arrival point
         * @param steps number of intermediate steps
         * @param time total time
         * @param action the action to be performed, it has to provide the needed params (x, y, i, B, steps)
         * @param callback to be called when finished
         */
        var interpolate = function(A, B, steps, time, action, callback) {
            var unit = [(B[0] - A[0]) / steps, (B[1] - A[1]) / steps];
            for(var i=0; i<steps; i++) {
                var task = function(x, y, i, callbackInt) {
                    var callback = function() {
                        action({x:x, y:y, i:i, B:B, steps:steps}, callbackInt);
                        return true;
                    };
                    d3.timer(callback, time / steps);
                };
                qInt.defer(task, A[0] + unit[0] * (i+1), A[1] + unit[1] * (i+1), i);
            }
            qInt.awaitAll(callback);
        };

        var durationEdge = duration / 6;
        var vertices = [];
        for (var i = 1; i <= 7; i++) {
            var angle = i * Math.PI / 3,
                x = Math.sin(angle) * radius,
                y = -Math.cos(angle) * radius;
            vertices.push({x: x, y: y});
        }

        vertices.forEach(function(v, i) {
            var task = function(callback) {
                var okCallback = function() {
                    callback(null, 'finished');
                };
                if(i !== 6) {
                    interpolate(currPos, [v.x, v.y], numSteps, durationEdge, function (params, callbackInt) {
                        if (params.i === params.steps - 1) {
                            // Round the coords for last point
                            context.lineTo(params.B[0], params.B[1]);
                            currPos = [params.x, params.y];
                        } else {
                            context.lineTo(params.x, params.y);
                        }
                        context.stroke();
                        callbackInt(null, 'finished');
                    }, okCallback);
                } else {
                    //afterDrawing();
                }
            };
            qExt.defer(task);
        });

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