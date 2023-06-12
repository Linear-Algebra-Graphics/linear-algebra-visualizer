
let canvas = document.getElementById("graph")
let xInput = document.getElementById("x")
let yInput = document.getElementById("y")
let graphButton = document.getElementById("graphButton")
let vectorColors = document.getElementById("vector colors")

displayWidth  = 600
displayHeight = 600

canvas.style.width = displayWidth + "px"
canvas.style.height = displayHeight + "px"
canvas.width = displayWidth * 2
canvas.height = displayHeight * 2

// canvas.width = displayWidth 
// canvas.height = displayHeight

let test_graph = new Graph(canvas);

test_graph.draw();



// //scale needs to change
// //since with scale = 1 graphed vectors are too small
graphButton.addEventListener("click", function() {
    let x = parseInt(xInput.value)
    let y = parseInt(yInput.value)
    let color = vectorColors.value
    test_graph.addObject(new Vector(test_graph, [x, y, 0], color, false))
    test_graph.draw()
})