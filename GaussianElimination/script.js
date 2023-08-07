
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
test_graph.Axis = new Axis(test_graph, "black", "black", "black", "black", 10)
test_graph.showGaussianPlanes = true

test_graph.currentZoom = 6/10
test_graph.defaultZoom = 6/10

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

    constructor() {
        this.defaultMatrix = document.createElement("div")
        this.defaultMatrix.innerHTML = `
        <div class="name-bar">
            <button type="button" class="">-</button> 
            <div class="label"></div>
            <button type="button" class="select-button">select</button> 
            <button type="button" class="">clear</button> 
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
            <button type="button" class="select-button stepone">Select Planes</button> 
            <button type="button" class="select-button steptwo">Combine Planes</button>
            <button type="button" class="select-button stepthree">Result</button>
        </div>
        `
        this.defaultRowOperation.className = "operation"

        this.matrixList        = []
        this.planeOrdering     = []
        this.operations        = []

        // This is just for firefox basically
        let plane1 = document.getElementsByClassName("color-box")[0].getElementsByClassName("color-checkbox")[0].checked
        let plane2 = document.getElementsByClassName("color-box")[1].getElementsByClassName("color-checkbox")[0].checked
        let plane3 = document.getElementsByClassName("color-box")[2].getElementsByClassName("color-checkbox")[0].checked

        this.selectedPlanes    = [plane1, plane2, plane3]
        this.selected          = {type:"matrix", index:0}
        this.view              = 1
    }

    selectMatrix(index) {
        if (index == 0) {
            this._updateInputMatrix();
        }

        // Unselect old.
        let oldMatrix = document.getElementById(this.selected.type + this.selected.index)
        oldMatrix.classList.remove("selected");

        // Select new.
        this.selected = {type:"matrix", index: index}
        
        document.getElementById("matrix"+index).classList.add("selected")
        test_graph.gaussianPlanes = new GaussianPlanes(test_graph, transpose(numericMatrixFromFrac(this.matrixList[index])), ["blue", "red", "green"])
        test_graph.gaussianPlanes.planesToDraw = this.selectedPlanes
    }

    selectOperation(index, step) {
        // Unselect old.
        let oldMatrix = document.getElementById(this.selected.type + this.selected.index)
        oldMatrix.classList.remove("selected");

        // Select new.
        document.getElementById("operation"+index).classList.add("selected")
        this.selected = {type:"operation", index: index}


        if(this.operations[index].type == "swap") {

        } else if(this.operations[index].type == "divide") {

        } else if(this.operations[index].type == "subtract") {

            if (step == 0) {
                // let transposedMatrix = transpose(numericMatrixFromFrac(this.matrixList[index]))
                // let row1 = transposedMatrix[this.operations[index].row1]
                // let row2 = transposedMatrix[this.operations[index].row2]
                // let newMatrix = [row1, row2, [0,0,0,0]]
                test_graph.gaussianPlanes = new GaussianPlanes(test_graph, transpose(numericMatrixFromFrac(this.matrixList[index])), ["blue", "red", "green"])
                test_graph.gaussianPlanes.planesToDraw = [false, false, false]
                test_graph.gaussianPlanes.planesToDraw[this.operations[index].row1] = true
                test_graph.gaussianPlanes.planesToDraw[this.operations[index].row2] = true
            }

            if (step == 1) {
                let transposedMatrix = transpose(this.matrixList[index])
                
                let row1 = transposedMatrix[0]
                let row2 = transposedMatrix[1]
                let row3 = transposedMatrix[2]

                let row4 = transpose(this.matrixList[index+1])[this.operations[index].row1]

                let newMatrix = [row1, row2, row3, row4]
                console.log(numericMatrixFromFrac(newMatrix))

                test_graph.gaussianPlanes = new GaussianPlanes(test_graph, numericMatrixFromFrac(newMatrix), ["blue", "red", "green", "orange"])
                test_graph.gaussianPlanes.planesToDraw = [false, false, false, true]
                test_graph.gaussianPlanes.planesToDraw[this.operations[index].row1] = true
                test_graph.gaussianPlanes.planesToDraw[this.operations[index].row2] = true
            }

            if (step == 2) {
                let transposedMatrix = transpose(this.matrixList[index])
                
                let row1 = transposedMatrix[0]
                let row2 = transposedMatrix[1]
                let row3 = transposedMatrix[2]

                let row4 = transpose(this.matrixList[index+1])[this.operations[index].row1]

                let newMatrix = [row1, row2, row3, row4]
                console.log(numericMatrixFromFrac(newMatrix))

                test_graph.gaussianPlanes = new GaussianPlanes(test_graph, numericMatrixFromFrac(newMatrix), ["blue", "red", "green", "orange"])
                test_graph.gaussianPlanes.planesToDraw = [false, false, false, true]

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

        // Add solution to right side.

        let solutionLocation = document.getElementsByClassName("matrix-solution")[0]
        let solutoinMatrix = this.defaultMatrix.cloneNode(true)
        let finalIndex = this.matrixList.length-1
        solutoinMatrix.getElementsByClassName("label")[0].innerHTML  = "Solution"
        solutoinMatrix.querySelectorAll(".name-bar button")[1].classList.add("matrix" + (finalIndex))
        solutoinMatrix.id                                            = "matrix" + (finalIndex)


        let colorBoxes = solutoinMatrix.getElementsByClassName("color-box")

        // console.log(colorBoxes)
        for (let i=0; i<colorBoxes.length; i++) {
            colorBoxes[i].classList.add("row"+rowOrderList[steps.length-1][i])
            colorBoxes[i].getElementsByClassName("color-checkbox")[0].checked = this.selectedPlanes[rowOrderList[steps.length-1][i]]
        }
    
        // let div = document.createElement("div")
        // div.className = "locked"
        // solutoinMatrix.getElementsByClassName("values")[0].appendChild(div)
        
        this._writeMatrix(solutoinMatrix, this.matrixList[this.matrixList.length-1], true)

        let matrixValues = solutoinMatrix.getElementsByClassName("matrix-value")

        for (let i=0; i<matrixValues.length; i++) {
            matrixValues[i].readOnly = true;
        }
        
        solutionLocation.appendChild(solutoinMatrix)

        document.getElementsByClassName("solution-arrow")[0].style = "display: flex;"
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
        
        document.getElementsByClassName("matrix-container")[0].appendChild(HTMLMatrix)
        
    }


    // CHANGE DIRECTION OF ARROW (R1 <- 3*R)
    // ADD <sub>subscript</sub> TAGS FOR R TO MAKE CLEAR
    addRowOperation(operation) {
        this.operations.push(operation)
        let index = this.operations.length - 1
        let operationStr = ""
        
        if (operation.type == "swap") {
            operationStr = "<p>" + "R" + "<sub>" + operation.row1 + "</sub>" + " &hArr; " + "R" + "<sub>" + operation.row2 + "</sub>"  + "<p>"
        } else if (operation.type == "divide") {
            let value = operation.value
            let newFrac     = new Frac(value.getDenominator(), value.getNumerator())
            let numerator   = newFrac.getNumerator()
            let denominator = newFrac.getDenominator()
            let row = operation.row + 1

            let stepString = "<p>"

            // if (numerator == 1) {
            //     stepString = "R"+(row+1)
            // } else {
            //     stepString = numerator+" * R"+ row
            // }

            // if (denominator == 1) {
            //     stepString = stepString
            // } else {
            //     stepString += "/(" + denominator + ")"
            // }

            // let additionorsubtraction = "-"
            // if (numerator[0] == "-") {
            //     additionorsubtraction = "+"
            //     numerator = numerator[1]
            // }

            if (numerator == 0) {
                stepString = stepString + "0 *"
            } else {
                stepString = stepString + " <sup>" + numerator + "</sup>/<sub>" + denominator + "</sub> R" + "<sub>" + row + "</sub>";
            }
            
            operationStr = stepString + " &rArr; " + "R" + "<sub>" + row + "</sub>" + "</p>"
        } else if (operation.type == "subtract") {
            let value = operation.value
            let numerator   = value.getNumerator()
            let denominator = value.getDenominator()
            let row1 = operation.row1 + 1
            let row2 = operation.row2 + 1

            let additionorsubtraction = "-"
            if (String(numerator)[0] == "-") {
                additionorsubtraction = "+"
                numerator = -1 * numerator
            }
            
            let stepString = "(<sup>" + numerator + "</sup>/<sub>"  + denominator + "</sub> R" + "<sub>" + row2 + "</sub>" + ")"

            // if (numerator == 1) {
            //     stepString += "R"+row2
            // } else {
            //     stepString += numerator+" * R"+row2
            // }

            // if (denominator == 1) {
            //     stepString = stepString
            // } else {
            //     stepString += "/" + denominator
            // }


            operationStr = "<p>" +"R"+"<sub>" + row1 + "</sub> " + additionorsubtraction + " " + stepString + " &rArr; " + "R" + "<sub>" + row1 + "</sub>" + "</p>"
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
        if (operation.type != "subtract") {
            let buttons = HTMLOperation.getElementsByTagName("button")
            buttons[0].remove()
            buttons[0].remove()
            buttons[0].remove()
        }

        document.getElementsByClassName("matrix-container")[0].appendChild(HTMLOperation)
    }

    clear() {
        for(let i=this.matrixList.length; i>1; i--) {
            this.removeLast()
        }
        document.getElementsByClassName("matrix-solution")[0].getElementsByClassName("matrix")[0].remove()
        document.getElementsByClassName("solution-arrow")[0].style = "display: none;"

    }

    removeLast() {
        
        if (this.matrixList.length > 1) {
            // debugger
            if (this.selected.index == (this.matrixList.length-1)) {
                this.selectMatrix(this.matrixList.length-2)
            }

            document.getElementById("matrix"    + (this.matrixList.length-1)).remove()
            document.getElementById("operation" + (this.operations.length-1)).remove()

            this.matrixList.pop();
            this.planeOrdering.pop();
            this.operations.pop();

        }
    }

    changeView(view) {
        // Remove old color
        
        document.querySelectorAll(".view-button.view-" + this.view)[0].style="background: white;"
        this.view = view
        document.querySelectorAll(".view-button.view-" + this.view)[0].style="background: lightgray;"
        if(view == 1) {
            test_graph.gaussianPlanes.cubeBoundPlanes = false
        } else if (view == 2) {
            test_graph.gaussianPlanes.cubeBoundPlanes = true
        }
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
    }

    if (current.classList.contains("zoom-out-button")) {
        test_graph.zoomOut()
    }

    if (current.classList.contains("new-operation-button") ) {
        if (current.classList.contains("closed")) {
            document.querySelectorAll(".new-operation .new-operation-button")[0].innerHTML = "➖ Close"
            current.classList.remove("closed")
            current.classList.add("open")

            document.querySelectorAll(".new-operation .settings-container select")[0].value=""
            document.querySelectorAll(".new-operation .settings-container")[0].style="display: static;"
            
            document.querySelectorAll(".swap.specific-settings")[0].style = "display: none;";
            document.querySelectorAll(".combine.specific-settings")[0].style = "display: none;";
            document.querySelectorAll(".scale.specific-settings")[0].style = "display: none;";

            document.querySelectorAll(".new-operation button.apply-new-operation-button")[0].style="display: none;"

        } else if (current.classList.contains("open")) {
            document.querySelectorAll(".new-operation .new-operation-button")[0].innerHTML = "➕ Apply new row operation"
            current.classList.remove("open")
            current.classList.add("closed")

            document.querySelectorAll(".new-operation .settings-container")[0].style="display: none;"
        }
    }

    if (current.classList.contains("apply-new-operation-button")) {
        if(checkValidOperations() == true) {

        } else {
            setTimeout(function() {
                current.innerHTML = "✅ Apply"
                current.class = "apply-new-operation-button"
            }, 1000);

            current.innerHTML = "❌ Invalid operation"
            current.class     = "invalid-operation"
        }
    }

    // ADD CHECKBOX AS WELL!!!!!!!!!

})

document.addEventListener("change", function() {
    const current = document.activeElement
    // console.log(current.value);
    if (current.classList.contains("operation-dropdown")) {
        let selection = current.value;
        if (selection == "swap") {
            document.querySelectorAll(".swap.specific-settings")[0].style = "display: flex;";
            document.querySelectorAll(".combine.specific-settings")[0].style = "display: none;";
            document.querySelectorAll(".scale.specific-settings")[0].style = "display: none;";
        } else if (selection == "combine") {
            document.querySelectorAll(".swap.specific-settings")[0].style = "display: none;";
            document.querySelectorAll(".combine.specific-settings")[0].style = "display: flex;";
            document.querySelectorAll(".scale.specific-settings")[0].style = "display: none;";
        } else if (selection == "scale") {
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

        }

        if(current.classList.contains("combine-5")) {
            let selection = document.querySelectorAll(".new-operation .combine-5")[0].value
            let combine1OSelect = document.querySelectorAll(".new-operation select.combine-1")[0]
            combine1OSelect.value = selection
        }


    }


})


function checkValidOperations() {
    
    let selection = document.querySelectorAll(".new-operation .operation-dropdown")[0].value
    debugger
    if (selection == "swap") {
        let swap = document.querySelectorAll(".new-operation .swap.specific-settings")[0]
        let swap1 = swap.querySelectorAll(".row.swap-1")[0].value
        let swap2 = swap.querySelectorAll(".row.swap-2")[0].value 

        if (swap1 != "r1" && swap1 != "r2" && swap1 != "r3") {
            return false
        }
        
        if (swap2 != "r1" && swap2 != "r2" && swap2 != "r3") {
            return false
        }

        return true
    } else if (selection == "combine") {
        let swap = document.querySelectorAll(".new-operation .combine.specific-settings")[0]
        let combine1 = swap.querySelectorAll(".row.combine-1")[0].value
        let combine2 = swap.querySelectorAll(".combine-2")[0].value
        let combine3 = swap.querySelectorAll(".row.combine-3") // DO NOT USE RIGHT NOW
        let combine4 = swap.querySelectorAll(".row.combine-4")[0].value 
        let combine5 = swap.querySelectorAll(".row.combine-5")[0].value

        

        if (combine1 != "r1" && combine1 != "r2" && combine1 != "r3") {
            return false
        }
        
        if (combine2 != "+" && combine2 != "-") {
            return false
        }

        if (combine4 != "r1" && combine4 != "r2" && combine4 != "r3") {
            return false
        }

        if (combine5 != "r1" && combine5 != "r2" && combine5 != "r3") {
            return false
        }


        return true
    } else if (selection == "scale") {
        let scale = document.querySelectorAll(".new-operation .scale.specific-settings")[0]
        let scale1 = swap.querySelectorAll(".row.scale-1")[0].value
        let scale2 = swap.querySelectorAll(".row.scale-2")[0].value
        let scale3 = swap.querySelectorAll(".row.scale-3")[0].value

        if (scale2 != "r1" && scale2 != "r2" && scale2 != "r3") {
            return false
        }

        if (scale3 != "r1" && scale3 != "r2" && scale3 != "r3") {
            return false
        }
        
    } else {
        return false;
    }

}


// Only for when we have default case might want to remove later

gaussSteps.selectMatrix(0)
