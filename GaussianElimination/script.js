let canvas = document.getElementById("graph")
let xInput = document.getElementById("x")
let yInput = document.getElementById("y")
let zInput = document.getElementById("z")
let vectorColors = document.getElementById("vector colors")

linearTransformation = new LinearTransformation([[1,0,0],[0,1,0],[0,0,1]])

displayWidth  = 700
displayHeight = 600

canvas.style.width = displayWidth + "px"
canvas.style.height = displayHeight + "px"
canvas.width = displayWidth * 2
canvas.height = displayHeight * 2

// canvas.width = displayWidth 
// canvas.height = displayHeight

let test_graph = new Graph(canvas);
test_graph.Axis = new Axis(test_graph, "black", "black", "black", "black", 10)
test_graph.showGaussianPlanes = true
test_graph.showAxis = true;

// test_graph.showAxis = false;
test_graph.showGrid = true;

test_graph.currentZoom = 6/10
test_graph.defaultZoom = 6/10


const defaultX = 387
const defaultY = -114
//add mouse support
let x = defaultX
let y = defaultY

let delta_x = 0
let delta_y = 0

let drawGraph = false;

let rowColors = ["#39f4eaff", "#f51485ff", "#1515b4ff", "orange"]

const parentBasic1 = document.getElementById("row-1-color"),
popupBasic1 = new Picker({parent: parentBasic1, color: rowColors[0]});
parentBasic1.style.backgroundColor = rowColors[0]
document.getElementsByClassName("color-box row0").backgroundColor = rowColors[0]
if (popupBasic1.color.hsla[2] > 0.5) {
    parentBasic1.style.color = "black"
}
let matrixColorSquares1 = document.getElementsByClassName("row0")
for (let i = 0; i < matrixColorSquares1.length; i++) {
    matrixColorSquares1[i].style = "background-color: " + rowColors[0] + ";"
}

popupBasic1.onChange = function(color) {
    parentBasic1.style.backgroundColor = color.rgbaString;
    rowColors[0] = color.rgbaString;
    if (popupBasic1.color.hsla[2] > 0.5) {
        parentBasic1.style.color = "black"
    } else {
        parentBasic1.style.color = "white"
    }
    let matrixColorSquares = document.getElementsByClassName("row0")
    for (let i = 0; i < matrixColorSquares.length; i++) {
        matrixColorSquares[i].style = "background-color: " + color.rgbaString + ";"
    }
    test_graph.draw()
};
//Open the popup manually:
//popupBasic1.openHandler();

const parentBasic2 = document.getElementById("row-2-color"),
popupBasic2 = new Picker({parent: parentBasic2, color: rowColors[1]});
parentBasic2.style.backgroundColor = rowColors[1]
if (popupBasic2.color.hsla[2] > 0.5) {
    parentBasic2.style.color = "black"
}
let matrixColorSquares2 = document.getElementsByClassName("row1")
for (let i=0; i<matrixColorSquares2.length; i++) {
    matrixColorSquares2[i].style = "background-color: " + rowColors[1] + ";"
}
    
popupBasic2.onChange = function(color) {
    parentBasic2.style.backgroundColor = color.rgbaString;
    rowColors[1] = color.rgbaString;
    if (popupBasic2.color.hsla[2] > 0.5) {
        parentBasic2.style.color = "black"
    } else {
        parentBasic2.style.color = "white"
    }
    let matrixColorSquares = document.getElementsByClassName("row1")
    for (let i=0; i<matrixColorSquares.length; i++) {
        matrixColorSquares[i].style = "background-color: " + color.rgbaString + ";"
    }
    test_graph.draw()
};
//Open the popup manually:
//popupBasic2.openHandler();

const parentBasic3 = document.getElementById("row-3-color"),
popupBasic3 = new Picker({parent: parentBasic3, color: rowColors[2]});
parentBasic3.style.backgroundColor = rowColors[2]
if (popupBasic3.color.hsla[2] > 0.5) {
    parentBasic3.style.color = "black"
}
let matrixColorSquares3 = document.getElementsByClassName("row2")
for (let i=0; i<matrixColorSquares3.length; i++) {
    matrixColorSquares3[i].style = "background-color: " + rowColors[2] + ";"
}
    
popupBasic3.onChange = function(color) {
    parentBasic3.style.backgroundColor = color.rgbaString;
    rowColors[2] = color.rgbaString;
    if (popupBasic3.color.hsla[2] > 0.5) {
        parentBasic3.style.color = "black"
    } else {
        parentBasic3.style.color = "white"
    }
    let matrixColorSquares = document.getElementsByClassName("row2")
    for (let i=0; i<matrixColorSquares.length; i++) {
        matrixColorSquares[i].style = "background-color: " + color.rgbaString + ";"
    }
    test_graph.draw()
};
//Open the popup manually:
//popupBasic3.openHandler();



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

canvas.addEventListener('mousemove', function(e) {    // return null

    // console.log("mouse on canvas!")
    if (mouseIsDown) {
        // this 20 is the offset of canvas
        x = - delta_x + (e.clientX -20);
        y = - delta_y + (e.clientY -20);

        //these two checks ensure that the z axis has only 180 rotation instead of 360.
        if (y > 0) {
            y = 0
        } else if (y < -300) {
            y = -300
        }

        drawGraph = true;
    } else {
        delta_x = (e.clientX -20) - x
        delta_y = (e.clientY -20) - y
        // Tell the graph not to draw because it isn't needed.
        drawGraph = false;
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


canvas.addEventListener("wheel", handleCanvasZoom, false);
// canvas.addEventListener("DOMMouseScroll", handleCanvasZoom, false);
// canvas.addEventListener("mousewheel", handleCanvasZoom, false);


function readMatrix(matrixNumber, fractionFormat) {
    //debugger
    matrix = [[undefined,undefined,undefined],[undefined,undefined,undefined],[undefined,undefined,undefined],[undefined,undefined,undefined]]
    
    let selectedMatrix = document.getElementById(matrixNumber+"matrix")
    let columbs = selectedMatrix.getElementsByClassName("values")[0].getElementsByClassName("column")
    for (let c = 0; c < columbs.length; c++) {
        let values = columbs[c].getElementsByTagName("input")
        for(let v = 0; v < values.length; v++) {
            
            let userInput = this.parseInputFrac(values[v].value)

            if (userInput.valid == false) {
                alert("Invalid Input!")
            } else {
                if (fractionFormat == true) {
                    matrix[c][v] = userInput.value
                } else {
                    matrix[c][v] = userInput.value.getNumericalValue()
                }
            }
                        
        }
    }

    return matrix
}

let fps    = 60
let oldFps = 60

var myFunction = function(){
    if (mouseIsDown == true && drawGraph == true) {
        test_graph.rotateAboutZ(2 * Math.PI * (x) / displayWidth)

        test_graph.rotateAboutX(2 * Math.PI * (y) / displayHeight)

        test_graph.draw()
    }
    if (fps != oldFps) {
        clearInterval(bigLoop);
        bigLoop = setInterval(myFunction, 1000/fps);
        oldFps = fps;
    }
}

var bigLoop = setInterval(myFunction, 1000/fps);


setInterval(function() {

    // test_graph.rotateAboutZ(2 * Math.PI * (x) / displayWidth)

    // test_graph.rotateAboutX(2 * Math.PI * (y) / displayHeight)

    if (test_graph.animatingGaussianPlanes) {
        test_graph.draw()
    }

}, 1000/fps)



class GaussianElimStepsHTMLModel {

    constructor() {
        this.defaultMatrix = document.createElement("div")
        this.defaultMatrix.innerHTML = `
        <div class="name-bar">
            <button type="button" class="">-</button> 
            <div class="label"></div>
            <button type="button" class="select-button">graph</button> 
        </div>
        <div class="values">
        
            <div class="color-column">
                <div class="color-box">
                    <input class="color-checkbox" type="checkbox">
                </div>
                <div class="color-box">
                    <input class="color-checkbox" type="checkbox">
                </div>
                <div class="color-box">
                    <input class="color-checkbox" type="checkbox">
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
            <div class="operation-text-button" style="display: flex; flex-direction: row; align-items: baseline;">
                <button type="button" class="select-button stepone">graph</button>
                <div></div>
            </div>
            <div class="operation-text-button" style="display: flex; flex-direction: row; align-items: baseline;">
                <button type="button" class="select-button steptwo">graph</button>
                <div></div>
            </div>
            <div class="operation-text-button" style="display: flex; flex-direction: row; align-items: baseline;">
                <button type="button" class="select-button stepthree">graph</button>
                <div></div>
            </div>
        </div>
        `
        this.defaultRowOperation.className = "operation"

        this.matrixList        = []
        this.planeOrdering     = []
        this.operationList     = []
        this.currMatrixIsValid = false

        // This is just for firefox basically
        let plane1 = document.getElementsByClassName("color-box")[0].getElementsByClassName("color-checkbox")[0].checked
        let plane2 = document.getElementsByClassName("color-box")[1].getElementsByClassName("color-checkbox")[0].checked
        let plane3 = document.getElementsByClassName("color-box")[2].getElementsByClassName("color-checkbox")[0].checked

        this.selectedPlanes    = [plane1, plane2, plane3]
        this.selected          = {type:"matrix", index:0}
        this.view              = 1
        this.newOperationOpen  = false;
        this.colorSettingsOpen = false;
        this.settingsOpen      = false;
        this.planeColors       = rowColors

        //this should keep track of solution status for when operation gaussianPlanes are displayed
        this.hasSolution       = false;
        //this._updateInputMatrix()
    }
    
    animate() {
        const matrixList = this.matrixList
        const operationList = this.operationList
        for (let i = 0; i < this.matrixList.length; i++) {
            this.selectMatrix(i)
            
            //if (i < this.matrixList.length - 2 && this.operationList[i].type == "combine") {
                setInterval(function() {
                    //debugger
                    test_graph.draw()
                    //debugger
                    // let start = transpose(numericMatrixFromFrac(matrixList[i]))
                    // let end = transpose(numericMatrixFromFrac(matrixList[i + 1]))
                    // //debugger
                    // test_graph.animateGaussianPlanes(start, end, operationList[i].row1, test_graph.gaussianPlanes.solution)
                }, 1000);
            //}
        }
    }

    updateSolutionIndicator() {
        let matrix = gaussianEliminationV3(this.matrixList[this.selected.index], false, true);
        let solutions = numberOfSolutionsMatrix(matrix);

        if (solutions == "one") {

            //array of [x, y, z] solution
            let solution = [matrix[3][0].toString(), matrix[3][1].toString(), matrix[3][2].toString()]
            //if a decimal value, round to thousandth place
            for (let i = 0; i < solution.length; i++) {
                if (solution[i].split(".").length == 2) {
                    solution[i] = "" + parseFloat(solution[i]).toFixed(3)
                }
            }
            
            document.getElementsByClassName("solution-overlay")[0].innerHTML = "One solution: (" + solution[0] + ", " + solution[1] + ", " + solution[2] + ")"
            document.getElementsByClassName("solution-overlay")[0].style = "background: lightgreen;"

        } else if (solutions == "infinite") {
            let solution = getInfiniteSolutionFrac(transpose(matrix))

            // for (let row = 0; row < matrix.length - 1; row++) {
            //     //check if col is 0s
            //     let index = leftMostNonZeroInRow(matrix, row)
            //     if (index < matrix.length - 1) {
            //         solution[index] = matrix[matrix.length - 1][row].toString()

            //         //if decimal round to thousandth
            //         if (solution[index].split(".").length == 2) {
            //             solution[index] = "" + parseFloat(solution[index]).toFixed(3)
            //         }
            //     }
            // }

            document.getElementsByClassName("solution-overlay")[0].innerHTML = "Infinite solutions:〈" + solution[0] + ", " + solution[1] + ", " + solution[2] + "〉"
            document.getElementsByClassName("solution-overlay")[0].style = "background: lightblue;"

        } else if(solutions == "none") {
            document.getElementsByClassName("solution-overlay")[0].innerHTML = "No Solution"
            document.getElementsByClassName("solution-overlay")[0].style = "background: #f7697e;"
        }
    }


    selectMatrix(index) {
        // if (index == 0) {
        //     this._updateInputMatrix();
        // }

        if (this.currMatrixIsValid) {
            // Unselect old.
            let oldMatrix = document.getElementById(this.selected.type + this.selected.index)
            oldMatrix.classList.remove("selected");

            // Select new.
            this.selected = {type:"matrix", index: index}
            //debugger
            
            this.updateSolutionIndicator()

            document.getElementById("matrix"+index).classList.add("selected")
            test_graph.gaussianPlanes = new GaussianPlanes(test_graph, transpose(numericMatrixFromFrac(this.matrixList[index])), this.planeColors, (this.view == 2))
            test_graph.gaussianPlanes.planesToDraw = this.selectedPlanes
            
            //keep track of solution status for operation steps
            this.hasSolution = test_graph.gaussianPlanes.hasSolution

        } //else {
        //     test_graph.gaussianPlanes = undefined
        // }
        test_graph.draw()

    }

    selectOperation(index, step) {
        // Unselect old.
        let oldMatrix = document.getElementById(this.selected.type + this.selected.index)
        oldMatrix.classList.remove("selected");

        // Select new.
        document.getElementById("operation"+index).classList.add("selected")
        this.selected = {type:"operation", index: index}


        if(this.operationList[index].type == "swap") {

        } else if(this.operationList[index].type == "scale") {

        } else if(this.operationList[index].type == "combine") {
            
            let prevPlaneCenter = test_graph.gaussianPlanes.solution //this doesnt work for intermediate operation steps

            if (step == 0) {
                // let transposedMatrix = transpose(numericMatrixFromFrac(this.matrixList[index]))
                // let row1 = transposedMatrix[this.operationList[index].row1]
                // let row2 = transposedMatrix[this.operationList[index].row2]
                // let newMatrix = [row1, row2, [0,0,0,0]]
                test_graph.gaussianPlanes = new GaussianPlanes(test_graph, transpose(numericMatrixFromFrac(this.matrixList[index])), this.planeColors, (this.view == 2))

                test_graph.gaussianPlanes.planesToDraw = [false, false, false]
                test_graph.gaussianPlanes.planesToDraw[this.operationList[index].row1] = true
                test_graph.gaussianPlanes.planesToDraw[this.operationList[index].row2] = true

            }

            if (step == 1) {
                let transposedMatrix = transpose(this.matrixList[index])
                
                let row1 = transposedMatrix[0]
                let row2 = transposedMatrix[1]
                let row3 = transposedMatrix[2]

                let row4 = transpose(this.matrixList[index+1])[this.operationList[index].row1]

                let newMatrix = [row1, row2, row3, row4]
                //console.log(numericMatrixFromFrac(newMatrix))

                test_graph.gaussianPlanes = new GaussianPlanes(test_graph, numericMatrixFromFrac(newMatrix), this.planeColors, (this.view == 2))
                test_graph.gaussianPlanes.planesToDraw = [false, false, false, true]
                test_graph.gaussianPlanes.planesToDraw[this.operationList[index].row1] = true
                test_graph.gaussianPlanes.planesToDraw[this.operationList[index].row2] = true
            }

            if (step == 2) {
                let transposedMatrix = transpose(this.matrixList[index])
                
                let row1 = transposedMatrix[0]
                let row2 = transposedMatrix[1]
                let row3 = transposedMatrix[2]

                let row4 = transpose(this.matrixList[index+1])[this.operationList[index].row1]

                let newMatrix = [row1, row2, row3, row4]
                console.log(numericMatrixFromFrac(newMatrix))

                test_graph.gaussianPlanes = new GaussianPlanes(test_graph, numericMatrixFromFrac(newMatrix), this.planeColors, (this.view == 2))
                test_graph.gaussianPlanes.planesToDraw = [false, false, false, true]

            }

            //try and keep center of planes the same when showing operations steps when some solution exists.
            if (this.hasSolution) {
                let planeCenter = new Array(test_graph.gaussianPlanes.planesStdForm.length)
                for (let i = 0; i < planeCenter.length; i++) {
                    planeCenter[i] = Array.from(prevPlaneCenter)
                }
                test_graph.gaussianPlanes.planeCenter = planeCenter
            }

        } else {
            throw new Error("Invalid operation.");
        }
    }

    _updateInputMatrix() {
        let matrix = [[undefined,undefined,undefined],[undefined,undefined,undefined],[undefined,undefined,undefined],[undefined,undefined,undefined]]

        let fractionFormat = true
        let selectedMatrix = document.getElementById("matrix0")
        let columbs = selectedMatrix.getElementsByClassName("values")[0].getElementsByClassName("column")

        let matrixValid = true;

        for (let c = 0; c < columbs.length && matrixValid; c++) {
            let values = columbs[c].getElementsByTagName("input")
            for(let v = 0; v < values.length; v++) {
                //debugger
                //build up a faction value of the value at the matrix[c][v] input cell
                let fracAnswer

                //v wizardry below
                // /^((-*)((\d+)(.\d+){0,1}))(\/((-*)((\d+)(.\d+){0,1}))){0,1}$/
                const regex = /^((-*)((\d+)(.\d+){0,1}))(\/((-*)((\d+)(.\d+){0,1}))){0,1}$/;
                let regexGroups = (values[v].value).match(regex)

                //1st check if input is valid
                if (regexGroups == null || regexGroups[0].length == 0) {
                    matrixValid = false;
                    columbs[c].getElementsByTagName("input")[v].style = "color: red;"
                    break
                }
                //debugger
                //determine sign of input?
                

                for(let i=0; i<regexGroups.length; i++) {
                    if (regexGroups[i] === undefined) {
                        regexGroups[i] = ""
                    }
                }

                let minusSigns = [...regexGroups[0].matchAll(/-/g)].length
                let neg = 1
                if (minusSigns % 2 != 0) {
                    neg = -1
                }
                
                //build up fraction
                let number = regexGroups[0].replace('-', '')
                let split = number.split("/")
                
                if(split.length == 2) {
                    if (parseFloat(split[1]) == 0) {
                        //cases of num/0
                        matrixValid = false;
                        columbs[c].getElementsByTagName("input")[v].style = "color: red;"
                        break
                    } else {
                        fracAnswer = new Frac(parseFloat(neg*split[0]), parseFloat(split[1]))
                    }
                } else if(split.length == 1) {
                    fracAnswer = new Frac(parseFloat(neg*split[0]), 1)
                } else {
                    matrixValid = false;
                    columbs[c].getElementsByTagName("input")[v].style = "color: red;"
                    break
                }

                if (fractionFormat == true) {
                    matrix[c][v] = fracAnswer
                } else {
                    matrix[c][v] = fracAnswer.getNumericalValue()
                }
                columbs[c].getElementsByTagName("input")[v].style = "color: initial;"   
            }
        }

        this.currMatrixIsValid = matrixValid

        if (!matrixValid) {
            document.getElementsByClassName("solution-overlay")[0].innerHTML = "Invalid matrix"
            document.getElementsByClassName("solution-overlay")[0].style = "background: #FFEB3B;"
            if (this.newOperationOpen) {
                this.toggleNewOperation()
            }
            document.getElementsByClassName("new-operation-button")[0].disabled = true
            
            test_graph.gaussianPlanes = undefined;
        } else {
            document.getElementsByClassName("new-operation-button")[0].disabled = false
            this.matrixList[0] = matrix
            test_graph.gaussianPlanes = new GaussianPlanes(test_graph, transpose(numericMatrixFromFrac(matrix)), this.planeColors, (this.view == 2))
            test_graph.gaussianPlanes.planesToDraw = this.selectedPlanes
            this.hasSolution = test_graph.gaussianPlanes.hasSolution

            this.updateSolutionIndicator()
            
            // Update the solution matrix.

            let solutionLocation = document.getElementsByClassName("matrix-solution")[0]
            let solutoinMatrix = solutionLocation.getElementsByClassName("matrix")[0]
            // let solutoinMatrix = this.defaultMatrix.cloneNode(true)
            // let finalIndex = this.matrixList.length-1
            // solutoinMatrix.getElementsByClassName("label")[0].innerHTML  = "Solution"
            // solutoinMatrix.querySelectorAll(".name-bar button")[1].classList.add("matrix" + (finalIndex))
            // solutoinMatrix.id                                            = "matrix" + (finalIndex)


            // let colorBoxes = solutoinMatrix.getElementsByClassName("color-box")

            // // console.log(colorBoxes)
            // for (let i=0; i<colorBoxes.length; i++) {
            //     colorBoxes[i].classList.add("row"+rowOrderList[steps.length-1][i])
            //     colorBoxes[i].getElementsByClassName("color-checkbox")[0].checked = this.selectedPlanes[rowOrderList[steps.length-1][i]]
            // }
        
            // let div = document.createElement("div")
            // div.className = "locked"
            // solutoinMatrix.getElementsByClassName("values")[0].appendChild(div)
            
            this._writeMatrix(solutoinMatrix, gaussianEliminationV3(matrix, false, true), true)

            // let matrixValues = solutoinMatrix.getElementsByClassName("matrix-value")

            // for (let i=0; i<matrixValues.length; i++) {
            //     matrixValues[i].readOnly = true;
            // }
            
            // solutionLocation.appendChild(solutoinMatrix)

            // document.getElementsByClassName("solution-arrow")[0].style = "display: flex;"
        }


        // make clear work later!!
        this.clear()
        test_graph.draw()

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

        //console.log(gaussianElimResult)

        let steps         = gaussianElimResult.steps
        let rowOperations = gaussianElimResult.operations
        let rowOrderList  = gaussianElimResult.rowOrderList


        for(let i = 0; i < steps.length; i++) {
            this.addRowOperation(rowOperations[i])
            this.addMatrix(steps[i], rowOrderList[i])
        }

    }

    addMatrix(matrix, rowOrderList) {
        // SO MATRIX COLORS DO NOT CHANGE! 
        rowOrderList = [0,1,2]
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
            colorBoxes[i].getElementsByClassName("color-checkbox")[0].checked = this.selectedPlanes[rowOrderList[i]]
        }
        
        // let div = document.createElement("div")
        // div.className = "locked"
        // HTMLMatrix.getElementsByClassName("values")[0].appendChild(div)
        
        if (matrix != null) {
            this._writeMatrix(HTMLMatrix, matrix, true)
        }

        let matrixValues = HTMLMatrix.getElementsByClassName("matrix-value")

        for (let i=0; i<matrixValues.length; i++) {
            matrixValues[i].readOnly = true;
        }

        let container = document.getElementsByClassName("matrix-container")[0]
        container.insertBefore(HTMLMatrix, container.getElementsByClassName("new-operation")[0])

        let matrixColorSquares1 = document.getElementsByClassName("row0")
        for (let i=0; i<matrixColorSquares1.length; i++) {
            matrixColorSquares1[i].style = "background-color: " + rowColors[0] + ";"
        }


        let matrixColorSquares2 = document.getElementsByClassName("row1")
        for (let i=0; i<matrixColorSquares2.length; i++) {
            matrixColorSquares2[i].style = "background-color: " + rowColors[1] + ";"
        }


        let matrixColorSquares3 = document.getElementsByClassName("row2")
        for (let i=0; i<matrixColorSquares3.length; i++) {
            matrixColorSquares3[i].style = "background-color: " + rowColors[2] + ";"
        }
        
        
    }

    addRowOperation(operation) {
        this.operationList.push(operation)
        let index = this.operationList.length - 1
        let operationStr = ""
        
        let step1Text
        let step2Text
        let step3Text


        if (operation.type == "swap") {
            operationStr = "<p>" + "R" + "<sub>" + (operation.row1+1) + "</sub>" + " &hArr; " + "R" + "<sub>" + (operation.row2+1) + "</sub>"  + "<p>"
        } else if (operation.type == "scale") {
            let value       = operation.value
            let numerator   = value.getNumerator()
            let denominator = value.getDenominator()
            let row         = operation.row + 1

            let stepString = "<p>"

            if ((numerator == 0 || denominator == 1) && numerator != 1) {
                stepString = stepString + "(" + numerator + ") R" + "<sub>" + row + "</sub>";
            } else if (numerator == 1 && denominator == 1) {
                stepString = stepString + "R" + "<sub>" + row + "</sub>";
            } else {
                stepString = stepString + "(<sup>" + numerator + "</sup>/<sub>" + denominator + "</sub>) R" + "<sub>" + row + "</sub>";
            }
            
            operationStr = stepString + " &rArr; " + "R" + "<sub>" + row + "</sub>" + "</p>"
        } else if (operation.type == "combine") {
            let value = operation.value
            let numerator   = value.getNumerator()
            let denominator = value.getDenominator()
            let row1 = operation.row1 + 1
            let row2 = operation.row2 + 1

            let additionorsubtraction = operation.sign;
            if (String(numerator)[0] == "-" && additionorsubtraction == "-") {
                additionorsubtraction = "+"
                numerator = -1 * numerator
            }
            
            // Check edge cases
            let stepString
            if ((numerator == 0 || denominator == 1) && numerator != 1) {
                stepString = "((" + numerator + ") R" + "<sub>" + row2 + "</sub>" + ")"
            } else if(numerator == 1 && denominator == 1) {
                stepString = "R" + "<sub>" + row2 + "</sub>"
            } else {
                stepString = "((<sup>" + numerator + "</sup>/<sub>"  + denominator + "</sub>) R" + "<sub>" + row2 + "</sub>" + ")"
            }



            operationStr = "<p>" +"R"+"<sub>" + row1 + "</sub> " + additionorsubtraction + " " + stepString + " &rArr; " + "R" + "<sub>" + row1 + "</sub>" + "</p>"

            // R1 and R2 
            step1Text = "R<sub>"+row1 + " </sub>and R<sub>" + row2 +"</sub>"

            // R1 + (1/6)R2 
            step2Text = "R<sub>"+row1 + " </sub>, R<sub>" + row2 +"</sub>" + " and "+"R"+"<sub>" + row1 + "</sub> " + additionorsubtraction + " " + stepString
            
            // New R1
            step3Text =  "New R<sub>" + row1 + "</sub>"

        } else {
            throw new Error("Invalid row operation!!")
        }
        
        
        let HTMLOperation = this.defaultRowOperation.cloneNode(true)
        HTMLOperation.id = "operation" + (index)
        let allbuttons = HTMLOperation.querySelectorAll("button");
        for(let i=0; i<allbuttons.length; i++) {
            HTMLOperation.querySelectorAll("button")[i].classList.add("operation" + (index))
        }

        HTMLOperation.getElementsByClassName("operation-text")[0].innerHTML = operationStr
        
        // Remove select buttons if not subtract.
        // debugger
        if (operation.type != "combine") {
            let buttons = HTMLOperation.getElementsByTagName("button")
            buttons[0].remove()
            buttons[0].remove()
            buttons[0].remove()

            let text = HTMLOperation.getElementsByClassName("operation-text-button")
            text[0].remove()
            text[0].remove()
            text[0].remove()
        }

        if (operation.type == "combine") {
            let text = HTMLOperation.getElementsByClassName("operation-text-button")
            text[0].getElementsByTagName("div")[0].innerHTML = step1Text
            text[1].getElementsByTagName("div")[0].innerHTML = step2Text
            text[2].getElementsByTagName("div")[0].innerHTML = step3Text

        }

        let container = document.getElementsByClassName("matrix-container")[0]
        container.insertBefore(HTMLOperation, container.getElementsByClassName("new-operation")[0])
    }

    clear() {
        //debugger
        for(let i=this.matrixList.length; i>1; i--) {
            this.removeLast()
        }
        
    }

    removeLast() {
        if (this.matrixList.length > 1) {
            let lastMatrixIndex = 0
            let updateSelected = false

            if (this.selected.type == "operation") {
                lastMatrixIndex = this.selected.index + 1;
                if (this.selected.index == this.operationList.length - 1) {
                    updateSelected = true
                }
            } else {
                lastMatrixIndex = this.selected.index
                if (this.selected.index == this.matrixList.length - 1) {
                    updateSelected = true
                }
            }

            if (updateSelected) {
                this.selectMatrix(this.matrixList.length - 2)
            }
            
            

            // // debugger
            // if (this.selected.index == (this.matrixList.length-1) || (this.selected.type == "operation" && this.selected.index == (this.operationList.length))) {
            //     this.selectMatrix(this.matrixList.length-2)
            // }

            document.getElementById("matrix"    + (this.matrixList.length-1)).remove()
            document.getElementById("operation" + (this.operationList.length-1)).remove()

            this.matrixList.pop();
            this.planeOrdering.pop();
            this.operationList.pop();
        }
    }

    changeView(view) {
        // Remove old color
        
        document.querySelectorAll(".view-button.view-" + this.view)[0].style="background: ;"
        this.view = view
        document.querySelectorAll(".view-button.view-" + this.view)[0].style="background: lightgray;"
        if(view == 1) {
            test_graph.gaussianPlanes.cubeBoundPlanes = false
        } else if (view == 2) {
            test_graph.gaussianPlanes.cubeBoundPlanes = true
        }
        test_graph.draw()
    }

    updatePlaneVisibility(checked, parentElement) {
        // ^(row)(\d)$
        for(let i=0; i<parentElement.classList.length; i++) {
            if (parentElement.classList[i].match(/^(row)(\d)$/) != null) {
                let rowNumber = parentElement.classList[i].match(/^(row)(\d)$/)[2]

                let colorBoxesWithRow = document.getElementsByClassName("row"+rowNumber)

                for (let j=0; j<colorBoxesWithRow.length; j++) {
                    colorBoxesWithRow[j].getElementsByClassName("color-checkbox")[0].checked = checked
                }
                this.selectedPlanes[rowNumber] = checked
                break;
            }
        }
        test_graph.draw()
    }
    
    toggleNewOperation() {
        
        if (this.newOperationOpen == false) {
            let button = document.querySelectorAll(".new-operation .new-operation-button")[0]
            button.innerHTML = "➖ Close"
            button.classList.remove("closed")
            button.classList.add("open")

            document.querySelectorAll(".new-operation .settings-container select")[0].value=""
            document.querySelectorAll(".new-operation .settings-container")[0].style="display: static;"
            // Scroll the thing into view
            document.querySelectorAll(".new-operation .settings-container")[0].scrollIntoView(true)
            

            document.querySelectorAll(".swap.specific-settings")[0].style = "display: none;";
            document.querySelectorAll(".combine.specific-settings")[0].style = "display: none;";
            document.querySelectorAll(".scale.specific-settings")[0].style = "display: none;";

            let swaps   = document.querySelectorAll(".new-operation .swap-1 option, .new-operation .swap-2 option")
            for (let i=0; i<swaps.length; i++) {
                swaps[i].disabled = false;
            }

            document.querySelectorAll(".new-operation button.apply-new-operation-button")[0].style="display: none;"
            this.newOperationOpen = true

        } else if (this.newOperationOpen == true) {
            let button = document.querySelectorAll(".new-operation .new-operation-button")[0]

            button.innerHTML = "➕ Apply new row operation"
            button.classList.remove("open")
            button.classList.add("closed")

            document.querySelectorAll(".new-operation .settings-container")[0].style="display: none;"
            this.newOperationOpen = false
        }
    }

    applyNewOperation() {
        
        let button = document.querySelectorAll(".apply-new-operation-button")[0]
        let checkResult = this.checkAndReturnOperationAndMatrix()

        if (checkResult.passed == true) {
            // debugger
            let matrix       = checkResult.data.matrix
            let rowOperation = checkResult.data.operation

            this.addRowOperation(rowOperation)
            this.addMatrix(matrix)
            this.toggleNewOperation()
            document.querySelectorAll(".new-operation .new-operation-button")[0].scrollIntoView(true)
            
        } else {
            setTimeout(function() {
                button.innerHTML = "✅ Apply"
                button.class = "apply-new-operation-button"
            }, 1000);

            button.innerHTML = "❌ Invalid operation"
            button.class     = "invalid-operation"
        }

    }

    // Uses the latest matrix
    checkAndReturnOperationAndMatrix() {
    
        let selection = document.querySelectorAll(".new-operation .operation-dropdown")[0].value
        
        if (selection == "swap") {
            let swap = document.querySelectorAll(".new-operation .swap.specific-settings")[0]
            let swap1 = swap.querySelectorAll(".row.swap-1")[0].value
            let swap2 = swap.querySelectorAll(".row.swap-2")[0].value 
    
            if (swap1 != "R0" && swap1 != "R1" && swap1 != "R2") {
                return {passed: false, data: null}
            }
            
            if (swap2 != "R0" && swap2 != "R1" && swap2 != "R2") {
                return {passed: false, data: null}
            }

            let fracMatrix = this.matrixList[this.matrixList.length-1]
            let row1       = parseInt(swap1[1])
            let row2       = parseInt(swap2[1])
            // debugger
            return {passed: true, data: {
                matrix: swapMatrixRows(fracMatrix, row1, row2),
                operation: {type:"swap", row1: row1, row2: row2}
            }}
        } else if (selection == "combine") {
            let combine = document.querySelectorAll(".new-operation .combine.specific-settings")[0]
            let combine1 = combine.querySelectorAll(".row.combine-1")[0].value
            let combine2 = combine.querySelectorAll(".combine-2")[0].value
            let combine3 = this.parseInputFrac(combine.querySelectorAll(".combine-3")[0].value)
            let combine4 = combine.querySelectorAll(".row.combine-4")[0].value 
            let combine5 = combine.querySelectorAll(".row.combine-5")[0].value
    
            if (combine1 != "R0" && combine1 != "R1" && combine1 != "R2") {
                return {passed: false, data: null}
            }
            
            if (combine2 != "+" && combine2 != "-") {
                return {passed: false, data: null}
            }

            if (combine3.valid == false) {
                return {passed: false, data: null}
            }
    
            if (combine4 != "R0" && combine4 != "R1" && combine4 != "R2") {
                return {passed: false, data: null}
            }
    
            if (combine5 != "R0" && combine5 != "R1" && combine5 != "R2") {
                return {passed: false, data: null}
            }
            
            let fracMatrix = this.matrixList[this.matrixList.length-1]
            let row1       = parseInt(combine1[1])
            let row2       = parseInt(combine4[1])
            let sign       = combine2
            let value      = combine3.value

            //debugger
            return {passed: true, data: {
                // fracMatrix, row1, row2, sign, value
                matrix: combineMatrixRows(fracMatrix, row1, row2, sign, value),
                operation: {type:"combine", row1: row1, row2: row2, sign: sign, value: value}
            }}

        } else if (selection == "scale") {
            let scale = document.querySelectorAll(".new-operation .scale.specific-settings")[0]
            // debugger
            let scale1 = this.parseInputFrac(scale.querySelectorAll(".scale-1")[0].value)
            let scale2 = scale.querySelectorAll(".row.scale-2")[0].value
            let scale3 = scale.querySelectorAll(".row.scale-3")[0].value
            
            if (scale1.valid == false) {
                return {passed: false, data: null}
            }

            if (scale2 != "R0" && scale2 != "R1" && scale2 != "R2") {
                return {passed: false, data: null}
            }
    
            if (scale3 != "R0" && scale3 != "R1" && scale3 != "R2") {
                return {passed: false, data: null}
            }

            let fracMatrix = this.matrixList[this.matrixList.length-1]
            let row        = parseInt(scale2[1])
            let value      = scale1.value
            
            return {passed: true, data: {
                // fracMatrix, row, value
                matrix: scaleMatrixRow(fracMatrix, row, value),
                operation: {type:"scale", row: row, value: value}
            }}
            
        } else {
            return {passed: false, data: null};
        }
    
    }

    changeOperationType(operation) {
        if (operation == "swap") {
            document.querySelectorAll(".swap.specific-settings")[0].style = "display: flex;";
            document.querySelectorAll(".combine.specific-settings")[0].style = "display: none;";
            document.querySelectorAll(".scale.specific-settings")[0].style = "display: none;";
        } else if (operation == "combine") {
            document.querySelectorAll(".swap.specific-settings")[0].style = "display: none;";
            document.querySelectorAll(".combine.specific-settings")[0].style = "display: flex;";
            document.querySelectorAll(".scale.specific-settings")[0].style = "display: none;";
        } else if (operation == "scale") {
            document.querySelectorAll(".swap.specific-settings")[0].style = "display: none;";
            document.querySelectorAll(".combine.specific-settings")[0].style = "display: none;";
            document.querySelectorAll(".scale.specific-settings")[0].style = "display: flex;";
        }

        // For firefox. Make sure all are unselected
        let select = document.querySelectorAll(".new-operation .specific-settings select")
        for (let i=0; i<select.length; i++) {
            select[i].value="";
        }

        document.querySelectorAll(".new-operation button.apply-new-operation-button")[0].style="display: block;"
        document.querySelectorAll(".new-operation button.apply-new-operation-button")[0].scrollIntoView(true)
    }

    parseInputFrac(input) {
        let fracAnswer
        
        const regex = /^(-*)(((\d*\.*\d*)\/(\d*\.*\d*))|\d*\.*\d*)$/;
        let regexGroups = (input).match(regex)

        if (regexGroups != null) {
            let minusSigns  = regexGroups[1]

            let neg = 1

            if (minusSigns.length % 2 != 0) {
                neg = -1
            }

            let number = regexGroups[2]
            let split  = number.split("/")
            
            if(split.length == 2) {
                if (parseFloat(split[1]) != 0) {
                    fracAnswer = new Frac(parseFloat(neg*split[0]), parseFloat(split[1]))
                    return {valid: true, value: fracAnswer}
                } else {
                    return {valid: false, value: null};
                }
            } else if(split.length == 1) {
                fracAnswer = new Frac(parseFloat(neg*split[0]), 1)
                return {valid: true, value: fracAnswer}
            } else {
                return {valid: false, value: null}
            }
        } else {
            return {valid: false, value: null}
        }
    }

    toggleColorSettings() {

        let settingsDiv    = document.getElementsByClassName("graph-settings-container")[0]
        let settingsButton = document.getElementsByClassName("settings-button")[0]
        let colorSettingsDiv    = document.getElementsByClassName("color-settings-container")[0]
        let colorSettingsbutton = document.getElementsByClassName("color-settings-button")[0]
        let steps          = document.getElementsByClassName("matrix-outer-wraper")[0]
        let rowReduced     = document.getElementsByClassName("solution-and-settings-container")[0]

        if (this.colorSettingsOpen == true) {
            colorSettingsDiv.style    = "display: none;"
            colorSettingsbutton.style = "background-color: ;"
            steps.style               = "display: ;"
            rowReduced.style          = "display: ;"

            this.colorSettingsOpen = false
        } else {
            colorSettingsDiv.style = "display: ;"
            colorSettingsbutton.style = "background-color: lightgray;"
            settingsDiv.style    = "display: none;"
            settingsButton.style = "background-color: ;"
            this.settingsOpen = false;
            steps.style               = "display: none;"
            rowReduced.style          = "display: none;"

            this.colorSettingsOpen = true

        }
    }

    toggleSettings() {
        let settingsDiv    = document.getElementsByClassName("graph-settings-container")[0]
        let settingsButton = document.getElementsByClassName("settings-button")[0]
        let colorSettingsDiv    = document.getElementsByClassName("color-settings-container")[0]
        let colorSettingsbutton = document.getElementsByClassName("color-settings-button")[0]
        let steps          = document.getElementsByClassName("matrix-outer-wraper")[0]
        let rowReduced     = document.getElementsByClassName("solution-and-settings-container")[0]

        if (this.settingsOpen == true) {
            settingsDiv.style    = "display: none;"
            settingsButton.style = "background-color: ;"
            steps.style               = "display: ;"
            rowReduced.style          = "display: ;"

            this.settingsOpen = false
        } else {
            settingsDiv.style = "display: ;"
            settingsButton.style = "background-color: lightgray;"
            colorSettingsDiv.style    = "display: none;"
            colorSettingsbutton.style = "background-color: ;"
            this.colorSettingsOpen = false;
            steps.style               = "display: none;"
            rowReduced.style          = "display: none;"

            this.settingsOpen = true

        }
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
    //debugger
    const current = document.activeElement
    
    if (current.classList.contains("select-button")) {
        // Figure out what is selected and update graph
        // to show correctly
        for (let i=0; i<current.classList.length; i++) {
            if (current.classList[i].match(/(\D*)(\d*)/)[2] != "") {
                let type  = current.classList[i].match(/(\D*)(\d*)/)[1]
                let index = parseInt(current.classList[i].match(/(\D*)(\d*)/)[2])

                if(type == "matrix") {
                    gaussSteps.selectMatrix(index)
                } else if(type == "operation") {
                    
                    if(current.classList.contains("stepone")) {
                        gaussSteps.selectOperation(index, 0)
                    } else if(current.classList.contains("steptwo")) {
                        gaussSteps.selectOperation(index, 1)
                    } else if(current.classList.contains("stepthree")) {
                        gaussSteps.selectOperation(index, 2)
                    }
                }
                break
            }
        }
        test_graph.draw()

    }

    if (current.classList.contains("default-zoom-button")) {
        test_graph.setDefaultZoom()
        test_graph.draw()
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
        gaussSteps.removeLast()
    }

    if (current.classList.contains("show-grid-checkbox")) {
        test_graph.showGrid = !test_graph.showGrid
        test_graph.draw()
    }

    if (current.classList.contains("color-checkbox")) {
        gaussSteps.updatePlaneVisibility(current.checked, current.parentElement)
    }

    if (current.classList.contains("row-opp")) {
        document.getElementsByTagName("dialog")[0].showModal();
    }

    if (current.classList.contains("view-button")) {
        if (current.classList.contains("view-1")) {
            gaussSteps.changeView(1)
        }
        if (current.classList.contains("view-2")) {
            gaussSteps.changeView(2)
        }
    }

    if (current.classList.contains("zoom-in-button")) {
        test_graph.zoomIn()
        test_graph.draw()
    }

    if (current.classList.contains("zoom-out-button")) {
        test_graph.zoomOut()
        test_graph.draw()
    }

    if (current.classList.contains("new-operation-button") ) {
        gaussSteps.toggleNewOperation();
    }

    if (current.classList.contains("apply-new-operation-button")) {
        gaussSteps.applyNewOperation();
    }

    if (current.classList.contains("color-settings-button")) {
        gaussSteps.toggleColorSettings();
    }

    if (current.classList.contains("settings-button")) {
        gaussSteps.toggleSettings();
    }

})

document.addEventListener("change", function() {
    const current = document.activeElement
    // console.log(current.value);
    if (current.classList.contains("operation-dropdown")) {
        let selection = current.value;
        gaussSteps.changeOperationType(selection)
    }

    if (current.classList.contains("row")) {
        
        // Swap option
        if(current.classList.contains("swap-1")) {
            let selection = document.querySelectorAll(".new-operation .swap-1")[0].value
            let row2Options = document.querySelectorAll(".new-operation .swap-2 option")
            for (let i=0; i<row2Options.length; i++) {
                if (row2Options[i].value == selection) {
                    row2Options[i].disabled = true;
                } else {
                    row2Options[i].disabled = false;
                }
            }
        }

        if(current.classList.contains("swap-2")) {
            let selection = document.querySelectorAll(".new-operation .swap-2")[0].value
            let row1Options = document.querySelectorAll(".new-operation .swap-1 option")
            for (let i=0; i<row1Options.length; i++) {
                if (row1Options[i].value == selection) {
                    row1Options[i].disabled = true;
                } else {
                    row1Options[i].disabled = false;
                }
            }
        }

        // Combine option
        if(current.classList.contains("combine-1")) {
            let selection = document.querySelectorAll(".new-operation .combine-1")[0].value
            let combine5Select = document.querySelectorAll(".new-operation select.combine-5")[0]
            combine5Select.value = selection

            let combine4Select = document.querySelectorAll(".new-operation select.combine-4")[0]
            for (let i=0; i<combine4Select.length; i++) {
                if (combine4Select[i].value == selection) {
                    combine4Select[i].disabled = true;
                } else {
                    combine4Select[i].disabled = false;
                }
            }

        }

        if(current.classList.contains("combine-5")) {
            let selection = document.querySelectorAll(".new-operation .combine-5")[0].value
            let combine1Select = document.querySelectorAll(".new-operation select.combine-1")[0]
            combine1Select.value = selection

            let combine4Select = document.querySelectorAll(".new-operation select.combine-4")[0]
            for (let i=0; i<combine4Select.length; i++) {
                if (combine4Select[i].value == selection) {
                    combine4Select[i].disabled = true;
                } else {
                    combine4Select[i].disabled = false;
                }
            }

        }

        // Scale option
        // debugger
        if(current.classList.contains("scale-2")) {
            let selection = document.querySelectorAll(".new-operation .scale-2")[0].value
            let scale3Select = document.querySelectorAll(".new-operation select.scale-3")[0]
            scale3Select.value = selection

        }

        if(current.classList.contains("scale-3")) {
            let selection = document.querySelectorAll(".new-operation .scale-3")[0].value
            let scale2Select = document.querySelectorAll(".new-operation select.scale-2")[0]
            scale2Select.value = selection
        }
    }
})

document.addEventListener("input", function() {
    const current = document.activeElement

    if (current.classList.contains("matrix-value")) {
        gaussSteps._updateInputMatrix();
    }
    
})

test_graph.rotateAboutZ(2 * Math.PI * (x) / displayWidth)

test_graph.rotateAboutX(2 * Math.PI * (y) / displayHeight)

test_graph.draw()

// Only for when we have default case might want to remove later

gaussSteps._updateInputMatrix();

gaussSteps.selectMatrix(0)