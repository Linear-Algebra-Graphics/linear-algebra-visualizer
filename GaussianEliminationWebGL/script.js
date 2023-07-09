
const { mat2, mat2d, mat3, mat4, quat, quat2, vec2, vec3, vec4 } = glMatrix;


const canvas = document.querySelector('canvas')
displayWidth  = 800
displayHeight = 800

canvas.style.width = displayWidth + "px"
canvas.style.height = displayHeight + "px"
canvas.width = displayWidth * 2
canvas.height = displayHeight * 2


const gl = canvas.getContext('webgl')

if (!gl) {
    throw new Error('WebGL not supported')
}

let matrix = [[1,0,0],[0,1,0],[0,0,1]]
let gaussiansteps
document.getElementById("Eliminate-Gauss").addEventListener("click", function() {
    let inputMatrix = getMatrixFromTable("matrix-A")
    console.log(inputMatrix)
    gaussiansteps = new GaussianSteps(inputMatrix)
    gaussiansteps.getVertexColorData()
    GL.addObject(gaussiansteps)
})

// <button id="Next-Step">Next Step</button>
// <button id="Prev-Step">Prev Step</button>

//these two should only appear after ressing eliminate gauss
document.getElementById("Next-Step").addEventListener("click", function() {
    gaussiansteps.nextStep();
})

document.getElementById("Prev-Step").addEventListener("click", function() {
    gaussiansteps.prevStep();
})

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
        [parseFloat(inputArray[0].value), parseFloat(inputArray[4].value), parseFloat(inputArray[8].value)],
        [parseFloat(inputArray[1].value), parseFloat(inputArray[5].value), parseFloat(inputArray[9].value)],
        [parseFloat(inputArray[2].value), parseFloat(inputArray[6].value), parseFloat(inputArray[10].value)],
        [parseFloat(inputArray[3].value), parseFloat(inputArray[7].value), parseFloat(inputArray[11].value)]
    ]

   
    for (let i = 0; i < inputArray.length; i++) {
        if (inputArray[i].value == "") {
            return null;
        }
    }

    return matrix
}



// let gaussiansteps = new GaussianSteps([[1,1,0],[0,2,-4],[4,3,0],[6,4,10]])
// let gaussiansteps = new GaussianSteps([[2,1,3],[3,2,-4],[4,3,0],[6,4,10]])
// gaussiansteps.getVertexColorData()

GL = new GL(gl)

// GL.addObject(new GLAxis("x", 6, .03, 2, [0,0,1], 1, [0,0,0]))
// GL.addObject(new GLAxis("y", 6, .03, 2, [1,0,0], 1, [0,0,0]))
// GL.addObject(new GLAxis("z", 6, .03, 2, [0,1,0], 1, [0,0,0]))

let point = [0,0,0]

let alpha = 0.5
// GL.addObject(new GLPlane([0,1,0], 2, [0,0,1], alpha, point))
// GL.addObject(new GLPlane([0,0,1], 2, [0,1,0], alpha, point))
// GL.addObject(new GLPlane([1,0,0], 2, [0.85,0,0], alpha, point))

// GL.addObject(gaussiansteps)

// GL.addObject(new GLPlane([2,3,4], 2, [0,0,1], alpha, point))
// GL.addObject(new GLPlane([1,2,3], 2, [0,1,0], alpha, point))


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

setInterval(function() {
    GL.draw(x, y)
}, 1000/60)

