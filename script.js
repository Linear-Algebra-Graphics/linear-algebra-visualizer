
let canvas = document.getElementById("graph")
let xInput = document.getElementById("x")
let yInput = document.getElementById("y")
let graphButton = document.getElementById("graphButton")
let vectorColors = document.getElementById("vector colors")

canvas.width = 600
canvas.height = 600

let test_graph = new Graph(canvas);

graphButton.addEventListener("click", function() {
    console.log("hooray hooray javascript!")
    let x = parseInt(xInput.value)
    let y = parseInt(yInput.value)
    let color = vectorColors.value
    test_graph.drawVector([x, y], color)
})
