
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
test_graph.linearTransformation = linearTransformation

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

test_graph.draw()

setInterval(function() {

    test_graph.draw()
}, 1000/60)

if(window.location.hash) {
    if (window.location.hash == "#2a") {
        selectedQuestion = document.getElementsByClassName("question-link")[0]
        selectedQuestion.previousElementSibling.classList.remove("hidden")
    } else
    if (window.location.hash == "#2b") {
        selectedQuestion = document.getElementsByClassName("question-link")[1]
        selectedQuestion.previousElementSibling.classList.remove("hidden")
    } else
    if (window.location.hash == "#2c") {
        selectedQuestion = document.getElementsByClassName("question-link")[2]
        selectedQuestion.previousElementSibling.classList.remove("hidden")
    } else
    if (window.location.hash == "#2d") {
        selectedQuestion = document.getElementsByClassName("question-link")[3]
        selectedQuestion.previousElementSibling.classList.remove("hidden")
    } else {
        selectedQuestion = document.getElementsByClassName("question-link")[0]
        selectedQuestion.previousElementSibling.classList.remove("hidden")
        window.location.hash = "#2a"
    }
} else {
    selectedQuestion = document.getElementsByClassName("question-link")[0]
    selectedQuestion.previousElementSibling.classList.remove("hidden")
    window.location.hash = "#2a"
}


document.getElementsByClassName("question-container")[0].addEventListener("click", function(event) {
    const current = event.target
    // console.log(current)
    if (current.classList.contains("question-link")) {

        selectedQuestion.previousElementSibling.classList.add("hidden")

        selectedQuestion = current

        selectedQuestion.previousElementSibling.classList.remove("hidden")

        window.location.hash
        if (window.location.hash == "#2a") {
            test_graph.drawnObjects = []

            let targetShape = new Square2d(test_graph, [[0,0,0],[0,1,0],[1,1,0],[1,0,0]], "black", "gray")
            let unitSquare  = new Square2d(test_graph, [[0,0,0],[0,1,0],[1,1,0],[1,0,0]], "purple", "purple")
            unitSquare.setTransformation(linearTransformation)
            targetShape.setTransformation(new LinearTransformation([[2,1,0],[0,0,0],[0,0,1]]))

            test_graph.addObject(targetShape)
            test_graph.addObject(unitSquare)
        } else
        if (window.location.hash == "#2b") {
            test_graph.drawnObjects = []
            let targetShape = new Square2d(test_graph, [[0,0,0],[0,1,0],[1,1,0],[1,0,0]], "black", "gray")
            let unitSquare  = new Square2d(test_graph, [[0,0,0],[0,1,0],[1,1,0],[1,0,0]], "purple", "purple")
            unitSquare.setTransformation(linearTransformation)
            targetShape.setTransformation(new LinearTransformation([[2,1,0],[0,0,0],[0,0,1]]))

            test_graph.addObject(targetShape)
            test_graph.addObject(unitSquare)
        } else
        if (window.location.hash == "#2c") {
            test_graph.drawnObjects = []
            let targetShape = new Square2d(test_graph, [[0,0,0],[0,1,0],[1,1,0],[1,0,0]], "black", "gray")
            let unitSquare  = new Square2d(test_graph, [[0,0,0],[0,1,0],[1,1,0],[1,0,0]], "purple", "purple")
            unitSquare.setTransformation(linearTransformation)
            targetShape.setTransformation(new LinearTransformation([[2,1,0],[0,0,0],[0,0,1]]))

            test_graph.addObject(targetShape)
            test_graph.addObject(unitSquare)
        } else
        if (window.location.hash == "#2d") {
            test_graph.drawnObjects = []
            let targetShape = new Square2d(test_graph, [[0,0,0],[0,1,0],[1,1,0],[1,0,0]], "red", "red")
            let unitSquare  = new Square2d(test_graph, [[0,0,0],[0,1,0],[1,1,0],[1,0,0]], "purple", "purple")
            unitSquare.setTransformation(linearTransformation)
            targetShape.setTransformation(new LinearTransformation([[2,1,0],[0,0,0],[0,0,1]]))

            test_graph.addObject(targetShape)
            test_graph.addObject(unitSquare)
        }




    }

})

let defaultMatrix = document.createElement("div")

defaultMatrix.innerHTML = `
<div class="name-bar">
    <button type="button" class="clear-button">-</button> 
    <div class="label"></div>
</div>
<div class="values">
    <div class="line"></div>

    <div class="column">
        <input class="matrix-value" type="text" value="1">
        <input class="matrix-value" type="text" value="0">
    </div>
    <div class="column">
        <input class="matrix-value" type="text" value="0">
        <input class="matrix-value" type="text" value="1">
    </div>

    <div class="line"></div>
</div>
`

defaultMatrix.className = "matrix"

let origonalMatrix = defaultMatrix.cloneNode(true)
origonalMatrix.getElementsByClassName("label")[0].innerHTML  = "Linear Transformation (Matrix):"

document.getElementsByClassName("matrix-container")[0].appendChild(origonalMatrix)

/**
 *
 * @returns the only matrix on the screen. Always returns 3x3 even though its 2x2
 */
function readMatrixDONOTUSE() {
    let fractionFormat = false
    //debugger
    matrix = [[undefined,undefined,undefined],[undefined,undefined,undefined],[undefined,undefined,undefined],[undefined,undefined,undefined]]
    
    let selectedMatrix = document.getElementsByClassName("matrix")[0]
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

    let realMatrix = [[matrix[0][0],matrix[0][1],0 ],[matrix[1][0],matrix[1][1],0], [0,0,1]]

    return realMatrix
}