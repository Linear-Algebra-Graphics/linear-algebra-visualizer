
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


let x = 0;
let y = 0;

//add mouse support
canvas.addEventListener('mousemove', function(e) {    // return null

    let delta_x = 0
    let delta_y = 0
    // console.log("mouse on canvas!")
    if (mouseIsDown) {
        // this 20 is the offset of canvas
        x = -20 + delta_x + e.clientX;
        y = -20 + delta_y + e.clientY;
    } else {
        delta_x = e.clientX - x
        delta_y = e.clientY - y
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





//add ability to switch betwen vector input fields wiith arrow keys
xInput.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
        yInput.focus()
    }
})

yInput.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        xInput.focus()
    }
})



//add functionality to switch between matrix input cells using arrow keys
let inputMatrices = document.getElementsByClassName("matrix-table")
let matrixToInputs = new Map()

//add event listener for every single table input cell
for (let i = 0; i < inputMatrices.length; i++) {
    //iterate over tr's
    for (let j = 0; j < inputMatrices[i].children.length; j++) {
        //iterate over td,
        for (let k = 0; k < inputMatrices[i].children[j].children.length; k++) {
            //iterate over each input field in td
            for (let l = 0; l < inputMatrices[i].children[j].children[k].children.length; l++) {
                let inputField = inputMatrices[i].children[j].children[k].children[l]
                inputField.addEventListener("keydown", (event) => {
                    const currentInput = document.activeElement
                    const currentTd = currentInput.parentNode //td
                    const currentTr = currentTd.parentNode //tr
                    const index = Array.from(currentTr.children).indexOf(currentTd);
                    
                    switch(event.key) {
                        case "ArrowLeft":
                            let prevTd = currentTd.previousElementSibling
                            if (prevTd !== null) {
                                prevTd.getElementsByTagName('input')[0].focus()
                            }
                            break
                        case "ArrowRight":
                            let nextTd = currentTd.nextElementSibling
                            if (nextTd !== null) {
                                nextTd.getElementsByTagName('input')[0].focus()
                            }
                            break
                        case "ArrowUp":
                            let prevTr = currentTr.previousElementSibling
                            if (prevTr !== null) {
                                prevTr.children[index].getElementsByTagName('input')[0].focus()
                            }
                            break
                        case "ArrowDown":
                            let nextTr = currentTr.nextElementSibling
                            if (nextTr !== null) {
                                nextTr.children[index].getElementsByTagName('input')[0].focus()
                            }
                            break
                        default:
                            break
                    }
                })
            }
        }
    }
}

// //scale needs to change
// //since with scale = 1 graphed vectors are too small
document.getElementById("graphButton").addEventListener("click", function() {
    let x = parseFloat(xInput.value)
    let y = parseFloat(yInput.value)
    let color = vectorColors.value
    test_graph.addObject(new Vector(test_graph, [x, y, 0], color, 3, true))
})

document.getElementById("zoomIn").addEventListener("click", function() {
    test_graph.zoomIn()
})

document.getElementById("zoomOut").addEventListener("click", function() {
    test_graph.zoomOut()
})

document.getElementById("defaultZoom").addEventListener("click", function() {
    test_graph.setDefaultZoom()
})

document.getElementById("infiniteAxis").addEventListener("click", function() {
    test_graph.infiniteAxis = document.getElementById("infiniteAxis").checked
})

document.getElementById("showGrid").addEventListener("click", function() {
    test_graph.showGrid = document.getElementById("showGrid").checked
})


document.getElementById("slider").addEventListener("input", function() {
    //alert(document.getElementById("slider").value);
    //do matrix multy stuff with document.getElementById("slider").value
    switch(parseInt(document.getElementById("slider").value)) {
        case 0:
            test_graph.basis = [[1,0,0],[0,1,0],[0,0,1]]
            break;
        case 1:
            matrix_a = getMatrixFromTable("matrix-A")
            
            if (matrix_a === null) {
                alert("Invalid Matrix")
            } else {
                test_graph.basis = matrix_a
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



test_graph.draw()


setInterval(function() {
    test_graph.draw()
}, 1000/60)