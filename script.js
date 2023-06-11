
let canvas = document.getElementById("graph")
let xInput = document.getElementById("x")
let yInput = document.getElementById("y")
let graphButton = document.getElementById("graphButton")
let vectorColors = document.getElementById("vector colors")

displayWidth = 600
displayHeight = 600
canvas.style.width = displayWidth + "px"
canvas.style.height = displayHeight + "px"
canvas.width = displayWidth * 2
canvas.height = displayHeight *2

let test_graph = new Graph(canvas);


//scale needs to change
//since with scale = 1 graphed vectors are too small
graphButton.addEventListener("click", function() {
    //console.log("hooray hooray javascript!")
    let scale = 1
    let x = parseInt(xInput.value) * scale
    let y = parseInt(yInput.value) * scale
    let color = vectorColors.value
    test_graph.drawVector([x, y], color)
})
