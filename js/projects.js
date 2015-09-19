
(function() {

    var data = [
        {title: 'RoomCast', url: '/roomcast'},
        {title: 'Dropverse', url: '/dropverse'},
        {title: 'Right Here, Right Now', url: '/right-here-right-now'},
        {title: 'Right Here, Right Now', url: '/right-here-right-now'},
        {title: 'Right Here, Right Now', url: '/right-here-right-now'},
        {title: 'Right Here, Right Now', url: '/right-here-right-now'},
        {title: 'Right Here, Right Now', url: '/right-here-right-now'},
        {title: 'Right Here, Right Now', url: '/right-here-right-now'},
        {title: 'Right Here, Right Now', url: '/right-here-right-now'},
        {title: 'Right Here, Right Now', url: '/right-here-right-now'},
        {title: 'Right Here, Right Now', url: '/right-here-right-now'},
        {title: 'Right Here, Right Now', url: '/right-here-right-now'}
    ];

    data.forEach(function(d, i) {
        d.i = i % 10;
        d.j = i / 10 | 0;
    });

    Math.seedrandom(+d3.time.hour(new Date));

    d3.shuffle(data);

    var height = 460,
        imageWidth = 132,
        imageHeight = 152,
        radius = 75,
        depth = 4;

    var currentFocus = [innerWidth / 2, height / 2],
        desiredFocus,
        idle = true;

    var style = document.body.style,
        transform = ("webkitTransform" in style ? "-webkit-"
                : "MozTransform" in style ? "-moz-"
                : "msTransform" in style ? "-ms-"
                : "OTransform" in style ? "-o-"
                : "") + "transform";

    var hexbin = d3.hexbin()
        .radius(radius);

    if (!("ontouchstart" in document)) d3.select("#cells")
        .on("mousemove", mousemoved);

    var deep = d3.select("#cells-deep");

    var canvas = deep.append("canvas")
        .attr("height", height);

    var context = canvas.node().getContext("2d");

    var svg = deep.append("svg")
        .attr("height", height);

    var mesh = svg.append("path")
        .attr("class", "cell-mesh");

    var anchor = svg.append("g")
        .attr("class", "cell-anchor")
        .selectAll("a");

    var graphic = deep.selectAll("svg,canvas");

    var image = new Image;
    image.src = "http://d3js.org/ex.jpg?3f2d00ffdba6ced9c50f02ed42f12f6156368bd2";
    image.onload = resized;

    d3.select(window)
        .on("resize", resized)
        .each(resized);

    function drawImage(d) {
        context.save();
        context.beginPath();
        context.moveTo(0, -radius);

        for (var i = 1; i < 6; ++i) {
            var angle = i * Math.PI / 3,
                x = Math.sin(angle) * radius,
                y = -Math.cos(angle) * radius;
            context.lineTo(x, y);
        }

        context.clip();
        context.drawImage(image,
            imageWidth * d.i, imageHeight * d.j,
            imageWidth, imageHeight,
            -imageWidth / 2, -imageHeight / 2,
            imageWidth, imageHeight);
        context.restore();
    }

    function resized() {
        var deepWidth = innerWidth * (depth + 1) / depth,
            deepHeight = height * (depth + 1) / depth,
            centers = hexbin.size([deepWidth, deepHeight]).centers();

        desiredFocus = [innerWidth / 2, height / 2];
        moved();

        graphic
            .style("left", Math.round((innerWidth - deepWidth) / 2) + "px")
            .style("top", Math.round((height - deepHeight) / 2) + "px")
            .attr("width", deepWidth)
            .attr("height", deepHeight);

        centers.forEach(function(center, i) {
            center.j = Math.round(center[1] / (radius * 1.5));
            center.i = Math.round((center[0] - (center.j & 1) * radius * Math.sin(Math.PI / 3)) / (radius * 2 * Math.sin(Math.PI / 3)));
            context.save();
            context.translate(Math.round(center[0]), Math.round(center[1]));
            drawImage(center);//.cell = data[(center.i % 10) + ((center.j + (center.i / 10 & 1) * 5) % 10) * 10]);
            context.restore();
        });

        mesh.attr("d", hexbin.mesh);

        anchor = anchor.data(centers, function(d) { return d.i + "," + d.j; });

        anchor.exit().remove();

        anchor.enter().append("a")
            .attr("xlink:href", function(d) { return d.cell.url; })
            .attr("xlink:title", function(d) { return d.cell.title; })
            .append("path")
            .attr("d", hexbin.hexagon());

        anchor
            .attr("transform", function(d) { return "translate(" + d + ")"; });
    }

    function mousemoved() {
        var m = d3.mouse(this);

        desiredFocus = [
            Math.round((m[0] - innerWidth / 2) / depth) * depth + innerWidth / 2,
            Math.round((m[1] - height / 2) / depth) * depth + height / 2
        ];

        moved();
    }

    function moved() {
        if (idle) d3.timer(function() {
            if (idle = Math.abs(desiredFocus[0] - currentFocus[0]) < .5 && Math.abs(desiredFocus[1] - currentFocus[1]) < .5) currentFocus = desiredFocus;
            else currentFocus[0] += (desiredFocus[0] - currentFocus[0]) * .14, currentFocus[1] += (desiredFocus[1] - currentFocus[1]) * .14;
            deep.style(transform, "translate(" + (innerWidth / 2 - currentFocus[0]) / depth + "px," + (height / 2 - currentFocus[1]) / depth + "px)");
            return idle;
        });
    }

}());