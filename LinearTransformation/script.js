
let canvas = document.getElementById("graph")
let xInput = document.getElementById("x")
let yInput = document.getElementById("y")
let zInput = document.getElementById("z")
let vectorColors = document.getElementById("vector colors")

linearTransformation = new LinearTransformation([[1,0,0],[0,1,0],[0,0,1]])

displayWidth  = 600
displayHeight = 600

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


canvas.addEventListener("wheel", event => {
    //disableScroll()
    debugger
    const delta = Math.sign(event.deltaY);
    if (event.target.id == "graph") {
        
        let rect = event.target.getBoundingClientRect()
        let x = event.clientX - rect.left; //x position within the element.
        let y = event.clientY - rect.top;  //y position within the element.

        if (delta==-1) {
        test_graph.zoomIn()
        // console.log("Increasing scale by 10%")
        }

        if (delta==1) {
        test_graph.zoomOut()
        // console.log("Decreasing scale by 10%")
        }
        
    }
    //enableScroll()
});

function disableScroll() {
    document.body.classList.add("stop-scrolling");
}

function enableScroll() {
    document.body.classList.remove("stop-scrolling");
}




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
    if (event.key === "ArrowRight") {
        zInput.focus()
    }
})

zInput.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        yInput.focus()
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

document.getElementById("addCube").addEventListener("click", function() {
    let type = document.getElementById("cube-options").value
    let color = document.getElementById("cube-color").value
    let cube 
    cube = new CenteredThreeDimCube(test_graph, color, type)
    cube.setTransformation(linearTransformation)
    test_graph.addObject(cube)
})

// //scale needs to change
// //since with scale = 1 graphed vectors are too small
document.getElementById("graphButton").addEventListener("click", function() {
    let x = parseFloat(xInput.value)
    let y = parseFloat(yInput.value)
    let z = parseFloat(zInput.value)
    let color = vectorColors.value
    let thisVector = new Vector(test_graph, [x, y, z], color, 4, true, "cords")
    thisVector.setTransformation(linearTransformation)
    test_graph.addObject(thisVector)
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

darkMode = false
document.getElementById("darkMode").addEventListener("click", function() {
    if(darkMode == false ) {
        test_graph.backgroundColor = "black"
        document.getElementsByTagName("body")[0].style.backgroundColor = "black"
        document.getElementsByTagName("body")[0].style.color = "white"
        
        test_graph.Grid.colorDark = "#6F7378"
        test_graph.Grid.colorLight = "#292C33"
        test_graph.Axis.zeroZeroDotColor = "#292C33"
        
        darkMode = true
        document.getElementById("darkMode").innerText = "Light Mode!"
    } else {
        test_graph.backgroundColor = "white"
        document.getElementsByTagName("body")[0].style.backgroundColor = "white"
        document.getElementsByTagName("body")[0].style.color = "black"
        
        test_graph.Grid.colorDark = "#BFBFBD"
        test_graph.Grid.colorLight = "#E6E6E3"
        test_graph.Axis.zeroZeroDotColor = "black"
    
        darkMode = false
        document.getElementById("darkMode").innerText = "Dark Mode!"
    }
})

document.getElementById("defaultOrientation").addEventListener("click", function() {
    // Resets to default state of x and y
    x = 0
    y = 0
})


document.getElementById("slider").addEventListener("input", function() {
    //alert(document.getElementById("slider").value);
    //do matrix multy stuff with document.getElementById("slider").value
    switch(parseInt(document.getElementById("slider").value)) {
        case 0:
            linearTransformation.setTransformation([[1,0,0],[0,1,0],[0,0,1]])
            break;
        case 1:
            matrix_a = getMatrixFromTable("matrix-A")
            
            if (matrix_a === null) {
                alert("Invalid Matrix")
            } else {
                linearTransformation.setTransformation(matrix_a)
            }
            break;
            // code block
        case 2:
            matrix_a = getMatrixFromTable("matrix-A")
            matrix_b = getMatrixFromTable("matrix-B")

            if (matrix_a === null || matrix_b === null) {
                alert("Invalid Matrix")
            } else {
                linearTransformation.setTransformation(matrixMultiplication(matrix_b, matrix_a))
            }
            break;
        case 3:
            matrix_a = getMatrixFromTable("matrix-A")
            matrix_b = getMatrixFromTable("matrix-B")
            matrix_c = getMatrixFromTable("matrix-C")

            if (matrix_a === null || matrix_b === null || matrix_c === null) {
                alert("Invalid Matrix")
            } else {
                linearTransformation.setTransformation(matrixMultiplication(matrix_c, matrixMultiplication(matrix_b, matrix_a)))
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
 * @returns null if there is an unfilled input, else returns a 3x3 matrix such that
 */
function getMatrixFromTable(id) {
    let table = document.getElementById(id);

    inputArray = table.getElementsByTagName("input")
    
    // 0 1 2
    // 3 4 5
    // 6 7 8
    matrix = [
        [parseFloat(inputArray[0].value), parseFloat(inputArray[3].value), parseFloat(inputArray[6].value)],
        [parseFloat(inputArray[1].value), parseFloat(inputArray[4].value), parseFloat(inputArray[7].value)],
        [parseFloat(inputArray[2].value), parseFloat(inputArray[5].value), parseFloat(inputArray[8].value)]
    ]

   
    for (let i = 0; i < inputArray.length; i++) {
        if (inputArray[i].value == "") {
            return null;
        }
    }

    return matrix
}



test_graph.draw()



setInterval(function() {

    test_graph.rotateAboutZ(2 * Math.PI * (x) / displayWidth)

    test_graph.rotateAboutX(2 * Math.PI * (y) / displayHeight)


    test_graph.draw()
}, 1000/60)


//test_graph.infiniteAxis = false


//test_graph.addObject(new ThreeDimCube(test_graph))