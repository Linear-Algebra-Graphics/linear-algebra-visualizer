
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
    const delta = Math.sign(event.deltaY);

    if (delta==-1) {
      test_graph.zoomIn()
      // console.log("Increasing scale by 10%")
    }

    if (delta==1) {
      test_graph.zoomOut()
      // console.log("Decreasing scale by 10%")
    }
});




// document.getElementById("zoomIn").addEventListener("click", function() {
//     test_graph.zoomIn()
// })

// document.getElementById("zoomOut").addEventListener("click", function() {
//     test_graph.zoomOut()
// })

// document.getElementById("defaultZoom").addEventListener("click", function() {
//     test_graph.setDefaultZoom()
// })

// darkMode = false
// document.getElementById("darkMode").addEventListener("click", function() {
//     if(darkMode == false ) {
//         test_graph.backgroundColor = "black"
//         document.getElementsByTagName("body")[0].style.backgroundColor = "black"
//         document.getElementsByTagName("body")[0].style.color = "white"
        
//         test_graph.Grid.colorDark = "#6F7378"
//         test_graph.Grid.colorLight = "#292C33"
//         test_graph.Axis.zeroZeroDotColor = "#292C33"
        
//         darkMode = true
//         document.getElementById("darkMode").innerText = "Light Mode!"
//     } else {
//         test_graph.backgroundColor = "white"
//         document.getElementsByTagName("body")[0].style.backgroundColor = "white"
//         document.getElementsByTagName("body")[0].style.color = "black"
        
//         test_graph.Grid.colorDark = "#BFBFBD"
//         test_graph.Grid.colorLight = "#E6E6E3"
//         test_graph.Axis.zeroZeroDotColor = "black"
    
//         darkMode = false
//         document.getElementById("darkMode").innerText = "Dark Mode!"
//     }
// })

// document.getElementById("defaultOrientation").addEventListener("click", function() {
//     // Resets to default state of x and y
//     x = 0
//     y = 0
// })


test_graph.draw()



setInterval(function() {

    test_graph.rotateAboutZ(2 * Math.PI * (x) / displayWidth)

    test_graph.rotateAboutX(2 * Math.PI * (y) / displayHeight)


    test_graph.draw()
}, 1000/60)

let defaultMatrix = document.createElement("div")
defaultMatrix.innerHTML = `
<div class="name-bar">
    <button type="button" class="clear-button">-</button> 
    <div class="label">
    </div>
    <button type="button" class="select-button">select</button> 
    <button type="button" class="clear-button">clear</button> 
</div>
<div class="values">
    <div class="line"></div>

    <div class="column">
        <input type="text" value="5">
        <input type="text" value="0">
        <input type="text" value="3">
    </div>
    <div class="column">
        <input type="text" value="4">
        <input type="text" value="2">
        <input type="text" value="1">
    </div>
    <div class="column">
        <input type="text" value="7">
        <input type="text" value="2">
        <input type="text" value="0">
    </div>
    <div class="line-gray"></div>
    <div class="column">
        <input type="text" value="2">
        <input type="text" value="3">
        <input type="text" value="5">
    </div>

    <div class="line"></div>
</div>
`

defaultMatrix.className = "matrix"

let origonalMatrix = defaultMatrix.cloneNode(true)
origonalMatrix.getElementsByClassName("label")[0].innerHTML = "Origo Matrix"
document.getElementsByClassName("matrix-container")[0].appendChild(origonalMatrix)

// console.log("heelp")

// let inputMatrices = document.getElementsByClassName("matrix")
// let matrixToInputs = new Map()

// for (let i = 0; i < inputMatrices.length; i++) {
//     let values = inputMatrices[i].getElementsByClassName("value")
//     let columns = values.getElementsByClassName("column")
//     console.log(columns)
// }

let inputMatrices = document.getElementsByClassName("matrix")
let matrixToInputs = new Map()
console.log(inputMatrices.length)

for (let i = 0; i < inputMatrices.length; i++) {
    let values = inputMatrices[i].getElementsByClassName("values")
    for (let j = 0; j < values.length; j++) {
        let columns = values[j].getElementsByClassName("column")
        for (let k = 0; k < columns.length; k++) {
            let column = columns[k].getElementsByTagName("input")
            for (let l = 0; l < column.length; l++) {
                let inputField = column[l]

                inputField.addEventListener("keydown", (event) => {
                    let inputTextLength = inputField.value.length
                    if (isNaN(inputTextLength)) {
                        inputTextLength = 0
                    }
                    let indexInText = event.target.selectionStart

                    // console.log("textLength " + (inputTextLength))
                    // console.log("index "  + indexInText)
                    switch (event.key) {
                        case "ArrowLeft":
                            let rowLeft = k - 1
                            if (rowLeft >= 0 && indexInText == 0) {
                                // console.log(columns[rowLeft].getElementsByTagName("input"))
                                columns[rowLeft].getElementsByTagName("input")[l].focus()
                            }
                            
                            break
                        case "ArrowRight":
                            let rowRight = k + 1
                            // console.log(indexInText + ", " + inputTextLength)
                            if (rowRight < columns.length && indexInText == inputTextLength) {
                                columns[rowRight].getElementsByTagName("input")[l].focus()
                            }
                            break
                        case "ArrowUp":
                            let rowUp = l - 1
                            if (rowUp >= 0) {
                                column[rowUp].focus()
                            }
                            break
                        case "ArrowDown":
                            let rowDown = l + 1 
                            if (rowDown < column.length) {
                                column[rowDown].focus()
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

function readMatrix(matrixNumber, fractionFormat) {

    matrix = [[undefined,undefined,undefined],[undefined,undefined,undefined],[undefined,undefined,undefined],[undefined,undefined,undefined]]
    
    let selectedMatrix = document.getElementsByClassName("matrix")[matrixNumber]
    let columbs = selectedMatrix.getElementsByClassName("values")[0].getElementsByClassName("column")
    for (let c=0; c<columbs.length; c++) {
        let values = columbs[c].getElementsByTagName("input")
        for(let v=0; v<values.length; v++) {
            if(fractionFormat == true) {
                const regex = /((\d*\.*\d*)\/(\d*\.*\d*))|\d*\.*\d*/m;
                let fractionFormat = (values[v].value).match(regex)[0]
                let split = fractionFormat.split("/")
                
                if(split.length == 2) {
                    if (parseFloat(split[1]) != 0) {
                        matrix[c][v] = new Frac(split[0], split[1])
                    } else {
                        return null;
                    }
                } else {
                    matrix[c][v] = new Frac(parseFloat(split[0]), 1)
                }

            } else {
                matrix[c][v] = parseFloat(values[v].value);
            }
        }
    }

    return matrix
}

function writeMatrix(HTMLMatrix, matrix, fractionFormat) {
    
    let columbs = HTMLMatrix.getElementsByClassName("values")[0].getElementsByClassName("column")
    for (let c=0; c<columbs.length; c++) {
        let values = columbs[c].getElementsByTagName("input")
        for(let v=0; v<values.length; v++) {
            if (fractionFormat == true) {
                values[v].value = matrix[c][v].toString()
            } else {
                values[v].value = matrix[c][v]
            }
        }
    }
}

function addMatrix(matrix, locked, fractionFormat) {
    HTMLMatrix = defaultMatrix.cloneNode(true)
    HTMLMatrix.getElementsByClassName("label")[0].innerHTML = "Step: " + (numberOfmatrices)
    if (locked == true) {
        div = document.createElement("div")
        div.className = "locked"
        HTMLMatrix.getElementsByClassName("values")[0].appendChild(div)
    }
    if (matrix != null) {
        writeMatrix(HTMLMatrix, matrix, fractionFormat)
    }
    document.getElementsByClassName("matrix-container")[0].appendChild(HTMLMatrix)
    numberOfmatrices++
    if (matrix != null) {

    }
}

function removeMatrix() {
    matrices = document.getElementsByClassName("matrix");
    if (numberOfmatrices > 1) {
        matrices[matrices.length - 1].remove()
        numberOfmatrices--;
    }
}


numberOfmatrices = 1;
selectedMatrix   = 0;

document.addEventListener("click", function() {
    const current = document.activeElement
    console.log(current)
    if (current.tagName == "button") {
        const matrixIndex = parseInt(current.id)

        

        selectedMatrix = matrixIndex
        // console.log("active element " + current)
    }
})



document.getElementById("add-augmented").addEventListener("click", function() {
    addMatrix(null, false, false)
})

document.getElementById("remove-augmented").addEventListener("click", function() {
    removeMatrix();
})

document.getElementById("clear").addEventListener("click", function() {
    matrices = document.getElementsByClassName("matrix");
    while(matrices.length > 1) {
        removeMatrix()
    }
})


document.getElementById("animate").addEventListener("click", function() {
    let fracMatrix = readMatrix(numberOfmatrices-1, true)
    let fracSteps  = GaussianEliminationV3(fracMatrix, true, true)
    
    let matrix    = numericMatrixFromFrac(fracMatrix)
    let numSteps  = GaussianEliminationV3(matrix, true, false)

    test_graph.gaussianPlanes = []
    
    for(let i = 0; i < fracSteps.length; i++) {
        setTimeout(function() {
            addMatrix(fracSteps[i], true, true)
            test_graph.gaussianPlanes.push(new GaussianPlanes(test_graph, transpose(numSteps[i])))
            test_graph.gaussianPlanesIndex = i
            test_graph.showGaussianPlanes = true
        }, i*3000)      
    }
})

