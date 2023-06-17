
let canvas = document.getElementById("graph")
let xInput = document.getElementById("x")
let yInput = document.getElementById("y")
let vectorColors = document.getElementById("vector colors")

displayWidth  = 800
displayHeight = 800

canvas.style.width = displayWidth + "px"
canvas.style.height = displayHeight + "px"
canvas.width = displayWidth * 2
canvas.height = displayHeight * 2

// canvas.width = displayWidth 
// canvas.height = displayHeight

let test_graph = new Graph(canvas);

// test_graph.draw();

let x = 0;
let y = 0;

let delta_x = 0
let delta_y = 0

//add mouse support
canvas.addEventListener('mousemove', function(e) {    // return null

    // console.log("mouse on canvas!")
    if (mouseIsDown) {
        // this 20 is the offset of canvas
        x = - delta_x + (e.clientX -20);
        y = - delta_y + (e.clientY -20);
    } else {
        delta_x = (e.clientX -20) - x
        delta_y = (e.clientY -20) - y
    }
    // console.log("(" + x + ", " + y + ")")
    // console.log("(" + e.clientX + ", " + e.clientY + ")")
});


let mouseIsDown = false


document.addEventListener('mousedown', function(event) {
    
    if (event.button === 0) {
        mouseIsDown = true
    }
});

document.addEventListener('mouseup', function(event) {

    if (event.button === 0) {
        mouseIsDown = false
    } 
});



test_graph.draw()


setInterval(function() {

    test_graph.rotateY(2 * Math.PI * (x) / displayWidth)

    test_graph.rotateX(2 * Math.PI * (-y) / displayHeight)

    test_graph.draw()
}, 1000/60)

test_graph.currentZoom  = .5
test_graph.infiniteAxis = false
test_graph.showGrid     = false

test_graph.showAxis     = true
// test_graph.addObject(new Vector(test_graph, [1, 1, 0], "black", 3, true))

class ThreeDimCube {

    constructor(graph){
        this.graph  = graph
        this.points = [
            [0,0,0],
            [1,0,0],
            [0,1,0],
            [1,1,0],

            [0,0,1],
            [1,0,1],
            [0,1,1],
            [1,1,1]
        ]

        this.lines = [
            [0,1, "orange"],
            [1,3, "orange"],
            [3,2, "orange"],
            [2,0, "orange"],

            [4,5, "orange"],
            [5,7, "orange"],
            [7,6, "orange"],
            [6,4, "orange"],

            [0,4, "orange"],
            [2,6, "orange"],
            [3,7, "orange"],
            [1,5, "orange"]

        ]

        this.scale = 3
        this.offset = [-.5, -.5, -.5]
    }

    draw() {

        for(let i=0; i<this.lines.length; i++) {

            const scale = this.graph.canvas.width / this.graph.numOfGraphUnitsEdgeToEdge

            let point1 = this.points[this.lines[i][0]]
            let point2 = this.points[this.lines[i][1]]

            point1 = [point1[0] + this.offset[0], point1[1] + this.offset[1], point1[2] + this.offset[2]]
            point2 = [point2[0] + this.offset[0], point2[1] + this.offset[1], point2[2] + this.offset[2]]

            let firstPointUpdated  = this.graph.changeBasisAndZoom(point1)
            let secondPointUpdated = this.graph.changeBasisAndZoom(point2)    
            
            let firstX = this.graph.centerX + scale * this.scale * firstPointUpdated[0]
            let firstY = this.graph.centerY - scale * this.scale * firstPointUpdated[1]

            let secondX = this.graph.centerX + scale * this.scale * secondPointUpdated[0]
            let secondY = this.graph.centerY - scale * this.scale * secondPointUpdated[1]

            this.graph.drawLine(
              // First point
              [firstX, firstY],
              // Second point
              [secondX, secondY],
              // Offset
              this.lines[i][2],
              // Color
              4
            )
    
          }


    }
}


test_graph.addObject(new ThreeDimCube(test_graph))
