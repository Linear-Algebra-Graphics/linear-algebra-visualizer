
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

test_graph.draw();



// //scale needs to change
// //since with scale = 1 graphed vectors are too small
document.getElementById("graphButton").addEventListener("click", function() {
    let x = parseFloat(xInput.value)
    let y = parseFloat(yInput.value)
    let color = vectorColors.value
    test_graph.addObject(new Vector(test_graph, [x, y, 0], color, 3, false))
    test_graph.draw()
})

document.getElementById("zoomIn").addEventListener("click", function() {
    test_graph.zoomIn()
    test_graph.draw()
})

document.getElementById("zoomOut").addEventListener("click", function() {
    test_graph.zoomOut()
    test_graph.draw()
})

document.getElementById("defaultZoom").addEventListener("click", function() {
    test_graph.setDefaultZoom()
    test_graph.draw()
})

document.getElementById("infiniteAxis").addEventListener("click", function() {
    test_graph.infiniteAxis = document.getElementById("infiniteAxis").checked
    test_graph.draw()
})

document.getElementById("showGrid").addEventListener("click", function() {
    test_graph.showGrid = document.getElementById("showGrid").checked
    test_graph.draw()
})


document.getElementById("slider").addEventListener("input", function() {
    //alert(document.getElementById("slider").value);
    //do matrix multy stuff with document.getElementById("slider").value
    switch(parseInt(document.getElementById("slider").value)) {
        case 0:
            test_graph.basis = [[1,0,0],[0,1,0],[0,0,1]]
            test_graph.draw();
            break;
        case 1:
            matrix_a = getMatrixFromTable("matrix-A")
            
            if (matrix_a === null) {
                alert("Invalid Matrix")
            } else {
                test_graph.basis = matrix_a
                console.log(test_graph.basis)
                test_graph.draw()
            }
            break;
            // code block
        case 2:
            matrix_a = getMatrixFromTable("matrix-A")
            matrix_b = getMatrixFromTable("matrix-B")

            if (matrix_a === null || matrix_b === null) {
                alert("Invalid Matrix")
            } else {
                test_graph.basis = matrixMultiplication(matrix_b, matrix_a)
                console.log(matrix_a)
                console.log(matrix_b)
                test_graph.draw()
            }
            break;
        case 3:
            matrix_a = getMatrixFromTable("matrix-A")
            matrix_b = getMatrixFromTable("matrix-B")
            matrix_c = getMatrixFromTable("matrix-C")

            if (matrix_a === null || matrix_b === null || matrix_c === null) {
                alert("Invalid Matrix")
            } else {
                test_graph.basis = matrixMultiplication(matrix_c, matrixMultiplication(matrix_b, matrix_a))
                console.log(test_graph.basis)
                test_graph.draw()
            }
            // code block
            break;
        default:
            //nothing happens woohoo
            break;
    }
}, false);


/**
 * gets the array of input values in from matrix with id:id
 * @requires {*} that the id is from a table, and that the table holds inputs for a 2x2 matrix
 * @param {*} id value of id tag of the table made matrix
 * @returns null if there is an unfilled input, else returns a matrix such that
 *             [[a,c],[b,d]] = |a b|
 *                             |c d|
 */
function getMatrixFromTable(id) {
    let table = document.getElementById(id);

    inputArray = table.getElementsByTagName("input")
    
    matrix = [[parseFloat(inputArray[0].value), parseFloat(inputArray[2].value), 0],[parseFloat(inputArray[1].value), parseFloat(inputArray[3].value), 0], [0,0,1]]

    for (let i = 0; i < inputArray.length; i++) {
        if (inputArray[i].value == "") {
            return null;
        }
    }

    return matrix
}