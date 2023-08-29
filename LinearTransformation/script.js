
let canvas = document.getElementById("graph")
let xInput = document.getElementById("x")
let yInput = document.getElementById("y")
let zInput = document.getElementById("z")
let vectorColors = document.getElementById("vector colors")

linearTransformation = new LinearTransformation([[1,0,0],[0,1,0],[0,0,1]])

displayWidth  = window.innerWidth
displayHeight = window.innerHeight - document.getElementsByClassName("topnav")[0].offsetHeight

canvas.style.width = displayWidth + "px"
canvas.style.height = displayHeight + "px"
canvas.width = displayWidth * 2
canvas.height = displayHeight * 2

// canvas.width = displayWidth 
// canvas.height = displayHeight

let test_graph = new Graph(canvas);


//add mouse support
let x = 0;
let y = 0;

let delta_x = 0
let delta_y = 0


/* Basic example */



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


function handleCanvasZoom(event) {
    const delta = Math.sign(event.deltaY);
    //let delta = event.wheelDelta ? event.wheelDelta/40 : event.detail ? -event.detail : 0;
    if (delta) {
        if (delta < 0) {
            test_graph.zoomIn()
            test_graph.draw()
        }
        if (delta > 0) {
            test_graph.zoomOut()
            test_graph.draw()
        }
    }
    return event.preventDefault() && false;
}

canvas.addEventListener("wheel", handleCanvasZoom, {capture: false});

setInterval(function() {

    test_graph.rotateAboutZ(2 * Math.PI * (x) / displayWidth)

    test_graph.rotateAboutX(2 * Math.PI * (y) / displayHeight)


    test_graph.draw()
}, 1000/60)


//test_graph.infiniteAxis = false


//test_graph.addObject(new ThreeDimCube(test_graph))