
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
test_graph.Axis = new Axis(test_graph, "black", "black", "black", "black")
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

setInterval(function() {

    test_graph.rotateAboutZ(2 * Math.PI * (x) / displayWidth)

    test_graph.rotateAboutX(2 * Math.PI * (y) / displayHeight)


    test_graph.draw()
}, 1000/60)



class GaussianElimStepsHTMLModel {


    constructor(matrixLocation) {
        this.defaultMatrix = document.createElement("div")
        this.defaultMatrix.innerHTML = `
        <div class="name-bar">
            <button type="button" class="clear-button">-</button> 
            <div class="label"></div>
            <button type="button" class="select-button">select</button> 
            <button type="button" class="clear-button">clear</button> 
        </div>
        <div class="values">
        
            <div class="color-column">
                <div class="color-box">
                    <input type="checkbox">
                </div>
                <div class="color-box">
                    <input type="checkbox">
                </div>
                <div class="color-box">
                    <input type="checkbox">
                </div>
            </div>
        
            <div class="line"></div>
        
            <div class="column">
                <input class="matrix-value" type="text" value="">
                <input class="matrix-value" type="text" value="">
                <input class="matrix-value" type="text" value="">
            </div>
            <div class="column">
                <input class="matrix-value" type="text" value="">
                <input class="matrix-value" type="text" value="">
                <input class="matrix-value" type="text" value="">
            </div>
            <div class="column">
                <input class="matrix-value" type="text" value="">
                <input class="matrix-value" type="text" value="">
                <input class="matrix-value" type="text" value="">
            </div>
            <div class="line-gray"></div>
            <div class="column">
                <input class="matrix-value" type="text" value="">
                <input class="matrix-value" type="text" value="">
                <input class="matrix-value" type="text" value="">
            </div>
        
            <div class="line"></div>
        </div>
        `
        this.defaultMatrix.className = "matrix"

        this.defaultRowOperation           = document.createElement("div")
        this.defaultRowOperation.innerHTML = `
        <div class="operation-text"></div>
        <div class="operation-buttons">
            <button type="button" class="select-button">select</button> 
            <button type="button" class="">1</button>
            <button type="button" class="">2</button> 
        </div>
        `
        this.defaultRowOperation.className = "operation"

        this.matrixList        = []
        this.planeOrdering     = []
        this.operations        = []
        this.selected          = {type:"matrix", index:0}
    }

    selectStep(type, index) {

        if (index == 0) {
            this._updateInputMatrix();
        }
        // Unselect old.
        let oldMatrix = document.getElementById(this.selected.type + this.selected.index)
        oldMatrix.classList.remove("selected");
        
        // Select new.
        this.selected = {type, index}
        if (type == "matrix") {
            document.getElementById(type+index).classList.add("selected")
            test_graph.gaussianPlanes = new GaussianPlanes(test_graph, transpose(numericMatrixFromFrac(this.matrixList[index])), ["blue", "red", "green"])
        } else if (type == "operation") {
            document.getElementById(type+index).classList.add("selected")
            if(this.operations[index].type == "swap") {


            } else if(this.operations[index].type == "divide") {

            } else if(this.operations[index].type == "subtract") {
                // let transposedMatrix = transpose(numericMatrixFromFrac(this.matrixList[index]))
                // let row1 = transposedMatrix[this.operations[index].row1]
                // let row2 = transposedMatrix[this.operations[index].row2]
                // let newMatrix = [row1, row2, [0,0,0,0]]
                test_graph.gaussianPlanes = new GaussianPlanes(test_graph, transpose(numericMatrixFromFrac(this.matrixList[index])), ["blue", "red", "green"])
                test_graph.gaussianPlanes.planesToDraw = [false, false, false]
                test_graph.gaussianPlanes.planesToDraw[this.operations[index].row1] = true
                test_graph.gaussianPlanes.planesToDraw[this.operations[index].row2] = true

            } else {
                throw new Error("Invalid operation.");
            }
        } else {
            console.log("Somethin gone WRONG! ;(")
        }

    }

    _updateInputMatrix() {
        let matrix = [[undefined,undefined,undefined],[undefined,undefined,undefined],[undefined,undefined,undefined],[undefined,undefined,undefined]]
        let fractionFormat = true
        let selectedMatrix = document.getElementById("matrix0")
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

        this.matrixList[0] = matrix
    }

    _writeMatrix(HTMLMatrix, matrix, fractionFormat) {
    
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

    solve() {
        // debugger
        this._updateInputMatrix()

        let lastMatrix         = this.matrixList[this.matrixList.length-1]
        let gaussianElimResult = gaussianEliminationV3(lastMatrix, true, true)

        console.log(gaussianElimResult)

        let steps         = gaussianElimResult.steps
        let rowOperations = gaussianElimResult.operations
        let rowOrderList  = gaussianElimResult.rowOrderList


        for(let i = 0; i < steps.length; i++) {
            this.addRowOperation(rowOperations[i])
            this.addMatrix(steps[i], rowOrderList[i])
        }

        // ADD SOLUTION TO RIGHT OF INPUT
    }

    addMatrix(matrix, rowOrderList) {
        // debugger
        this.matrixList.push(matrix)
        this.planeOrdering.push(rowOrderList)

        let HTMLMatrix = this.defaultMatrix.cloneNode(true)
        let index = this.matrixList.length-1

        HTMLMatrix.getElementsByClassName("label")[0].innerHTML  = "Step: " + (index)
        HTMLMatrix.querySelectorAll(".name-bar button")[1].classList.add("matrix" + (index))
        HTMLMatrix.id                                            = "matrix" + (index)
        
        let colorBoxes = HTMLMatrix.getElementsByClassName("color-box")
        // console.log(colorBoxes)
        for (let i=0; i<colorBoxes.length; i++) {
            colorBoxes[i].classList.add("row"+rowOrderList[i])
        }
    
        let div = document.createElement("div")
        div.className = "locked"
        HTMLMatrix.getElementsByClassName("values")[0].appendChild(div)
        
        if (matrix != null) {
            this._writeMatrix(HTMLMatrix, matrix, true)
        }
        
        document.getElementsByClassName("matrix-container")[0].appendChild(HTMLMatrix)
        
    }


    // CHANGE DIRECTION OF ARROW (R1 <- 3*R)
    // ADD <sub>subscript</sub> TAGS FOR R TO MAKE CLEAR
    addRowOperation(operation) {
        this.operations.push(operation)
        let index = this.operations.length - 1
        let operationStr = ""
        
        if (operation.type == "swap") {
            operationStr = "R" + operation.row1 + " &hArr; " + "R" + operation.row2
        } else if (operation.type == "divide") {
            let value = operation.value
            let numerator   = value.getDenominator()
            let denominator = value.getNumerator()
            let row = operation.row + 1

            let stepString = ""

            if (numerator == 1) {
                stepString = "R"+(row+1)
            } else {
                stepString = numerator+" * R"+ row
            }

            if (denominator == 1) {
                stepString = stepString
            } else {
                stepString += "/(" + denominator + ")"
            }
            operationStr = stepString + " &rArr;" + "R" + row
        } else if (operation.type == "subtract") {
            let value = operation.value
            let numerator   = value.getNumerator()
            let denominator = value.getDenominator()
            let row1 = operation.row1 + 1
            let row2 = operation.row2 + 1

            let stepString = ""

            if (numerator == 1) {
                stepString = "R"+row2
            } else {
                stepString = numerator+" * R"+row2
            }

            if (denominator == 1) {
                stepString = stepString
            } else {
                stepString += "/" + denominator
            }
            operationStr = "R"+row1 + " - " + stepString + " &rArr; " + "R"+row1
        } else {
            throw new Error("Invalid row operation!!")
        }
        

        let HTMLOperation = this.defaultRowOperation.cloneNode(true)
        HTMLOperation.id = "operation" + (index)
        HTMLOperation.querySelectorAll("button")[0].classList.add("operation" + (index))

        HTMLOperation.getElementsByClassName("operation-text")[0].innerHTML = operationStr
        
        document.getElementsByClassName("matrix-container")[0].appendChild(HTMLOperation)
    }

    clear() {

    }

    removeLast() {

    }


}

let gaussSteps = new GaussianElimStepsHTMLModel()


// Select button
// Sove
// Animate button
// Clear button
// New matrix button
// Remove last
document.addEventListener("click", function() {

    const current = document.activeElement

    if (current.classList.contains("select-button")) {
        // Figure out what is selected and update graph
        // to show correctly
        for (let i=0; i<current.classList.length; i++) {
            if (current.classList[i].match(/(\D*)(\d*)/)[2] != "") {
                let type  = current.classList[i].match(/(\D*)(\d*)/)[1]
                let index = current.classList[i].match(/(\D*)(\d*)/)[2]
                gaussSteps.selectStep(type, index)
                break
            }
        }

    }

    if (current.classList.contains("solve-button")) {
        // Get the latest matrix.
        // Add matrices and steps from then on.
        gaussSteps.solve()
    }

    if (current.classList.contains("animate-button")) {
        // Select first to last matrix
        gaussSteps.animate()
    }

    if (current.classList.contains("clear-button")) {
        // Clear everything but first matrix
        gaussSteps.clear()
    }

    if (current.classList.contains("add-button")) {
        // Add matrix at the end
    }

    if (current.classList.contains("remove-button")) {
        // Remove the last matrix
    }

    // ADD CHECKBOX AS WELL!!!!!!!!!


})