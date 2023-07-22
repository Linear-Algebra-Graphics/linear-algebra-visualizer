
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
test_graph.showGaussianPlanes = true

test_graph.currentZoom = .7
test_graph.defaultZoom = .7

//add mouse support
let x = 387//95//41;
let y = -114//-213;

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
    }

    if (delta==1) {
      test_graph.zoomOut()
    }
});


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
    <div class="label"></div>
    <button type="button" class="select-button" id="">select</button> 
    <button type="button" class="clear-button">clear</button> 
</div>
<div class="values">
    <div class="line"></div>

    <div class="column">
        <input class="matrix-value" type="text" value="2/3">
        <input class="matrix-value" type="text" value="1/6">
        <input class="matrix-value" type="text" value="1/2">
    </div>
    <div class="column">
        <input class="matrix-value" type="text" value="1/3">
        <input class="matrix-value" type="text" value="1/2">
        <input class="matrix-value" type="text" value="0">
    </div>
    <div class="column">
        <input class="matrix-value" type="text" value="25/60">
        <input class="matrix-value" type="text" value="25/60">
        <input class="matrix-value" type="text" value="1">
    </div>
    <div class="line-gray"></div>
    <div class="column">
        <input class="matrix-value" type="text" value="15">
        <input class="matrix-value" type="text" value="10">
        <input class="matrix-value" type="text" value="11">
    </div>

    <div class="line"></div>
</div>
`

defaultMatrix.className = "matrix"

let origonalMatrix = defaultMatrix.cloneNode(true)
origonalMatrix.getElementsByClassName("label")[0].innerHTML  = "Input Matrix"
origonalMatrix.getElementsByClassName("select-button")[0].id = "0select"
origonalMatrix.id                                            = "0matrix"
origonalMatrix.getElementsByClassName("name-bar")[0].classList.add("selected")

document.getElementsByClassName("matrix-container")[0].appendChild(origonalMatrix)

document.addEventListener("keydown", (event) => {
    const inputField = document.activeElement
    if (inputField.className == "matrix-value") {
        //in future add a check to make sure this is a input field in a matrix and not for a vector
        //debugger 
        const columnId = inputField.parentNode
        const valuesId = columnId.parentNode
        const matrixId = valuesId.parentNode
        const matrixContainer = matrixId.parentNode

        const column = Array.from(columnId.getElementsByTagName("input"))
        const columns = Array.from(valuesId.getElementsByClassName("column"))
        const matrixArray = Array.from(matrixContainer.getElementsByClassName("matrix"))
        
        const l = column.indexOf(inputField) // inputIndex
        const k = columns.indexOf(columnId) // columnIndex
        //keep this to poentially move between matrices using arrows?
        const i = matrixArray.indexOf(matrixId) // matrixIndex
        
        let inputTextLength = inputField.value.length
    
        if (isNaN(inputTextLength)) {
            inputTextLength = 0
        }
        let indexInText = event.target.selectionStart
        
        // console.log("W")
        // console.log(inputTextLength)
        // console.log(indexInText)
    
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
    }
})

/**
 * reads a matrix and gets it into fraction form, this col row form
 * @param {integer} matrixNumber the index of matrix in matrix-container
 * @param {boolean} fractionFormat determines if values in matrix are fractions or numerics 
 * @returns 
 */
function readMatrix(matrixNumber, fractionFormat) {
    //debugger
    matrix = [[undefined,undefined,undefined],[undefined,undefined,undefined],[undefined,undefined,undefined],[undefined,undefined,undefined]]
    
    let selectedMatrix = document.getElementById(matrixNumber+"matrix")
    let columbs = selectedMatrix.getElementsByClassName("values")[0].getElementsByClassName("column")
    for (let c = 0; c < columbs.length; c++) {
        let values = columbs[c].getElementsByTagName("input")
        for(let v = 0; v < values.length; v++) {
            
            let fracAnswer

            const regex = /^(-*)(((\d*\.*\d*)\/(\d*\.*\d*))|\d*\.*\d*)$/;
            let regexGroups = (values[v].value).match(regex)
            
            let minusSigns  = regexGroups[1]

            let neg = 1

            if (minusSigns % 2 != 0) {
                neg = -1
            }

            let number      = regexGroups[2]
            
            let split = number.split("/")
            
            if(split.length == 2) {
                if (parseFloat(split[1]) != 0) {
                    fracAnswer = new Frac(parseFloat(neg*split[0]), parseFloat(split[1]))
                } else {
                    return null;
                }
            } else if(split.length == 1) {
                fracAnswer = new Frac(parseFloat(neg*split[0]), 1)
            } else {
                return null
            }

            if (fractionFormat == true) {
                matrix[c][v] = fracAnswer
            } else {
                matrix[c][v] = fracAnswer.getNumericalValue()
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

    HTMLMatrix.getElementsByClassName("label")[0].innerHTML  = "Step: " + (numberOfmatrices)
    HTMLMatrix.getElementsByClassName("select-button")[0].id = (numberOfmatrices) + "select"
    HTMLMatrix.id                                            = (numberOfmatrices) + "matrix"

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

        if (selectedMatrix > (matrices.length-1)) {
            selectMatrix(matrices.length-1)
        }
    }
}

function selectMatrix(matrixNumber) {
    // Unselect old selection if it exists
    let oldMatrix = document.getElementById(selectedMatrix+"matrix")
    if(oldMatrix != null) {
        oldMatrix.getElementsByClassName("name-bar")[0].classList.remove("selected");
    }
    // Select new selection
    let newMatrix = document.getElementById(matrixNumber+"matrix")
    newMatrix.getElementsByClassName("name-bar")[0].classList.add("selected");
    
    let selectedMatrixValues = readMatrix(matrixNumber, false)
    if (selectedMatrixValues == null) {
        console.log("HELP !!!")
    }

    test_graph.gaussianPlanes = new GaussianPlanes(test_graph, transpose(selectedMatrixValues))
    selectedMatrix = matrixNumber
}


let numberOfmatrices = 1;
let selectedMatrix   = 0;

document.addEventListener("click", function() {
    const current = document.activeElement

    if (current.classList.contains("select-button")) {

        const matrixIndex = parseInt((current.id)[0])
        selectMatrix(matrixIndex)
    }
})

selectMatrix(0)


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

let isSolving = false

document.getElementById("solve").addEventListener("click", function() {
    if (!isSolving) {
        isSolving = true
        //debugger
        let fracMatrix = readMatrix(numberOfmatrices-1, true)
        let fracSteps  = gaussianEliminationV3(fracMatrix, true, true)
        
        let matrix    = numericMatrixFromFrac(fracMatrix)
        let numSteps  = gaussianEliminationV3(matrix, true, false)

        
        for(let i = 0; i < fracSteps.length; i++) {
            setTimeout(function() {
                addMatrix(fracSteps[i], true, true)
                if (i == fracSteps.length - 1) {
                    isSolving = false
                }
            }, i*100)      
        }
    }
})

let isAnimating = false

document.getElementById("animate").addEventListener("click", function() {
    if (!isAnimating) {
        isAnimating = true
        let matrices = Array.from((document.getElementsByClassName("matrix-container")[0]).getElementsByClassName("matrix"))
        for (let i = 0; i < matrices.length; i++) {
            setTimeout(function() {        
                selectMatrix(i)
                
                if (i == matrices.length - 1) {
                    isAnimating = false
                }
            }, i*2000)
        }
    }
})