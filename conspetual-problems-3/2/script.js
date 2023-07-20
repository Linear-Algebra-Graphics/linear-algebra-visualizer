
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
test_graph.linearTransformation=linearTransformation

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

    }

})

test_graph.addObject(new Square2d(test_graph, [[0,0,0],[0,1,0],[1,1,0],[1,0,0]], "black", "gray"))

test_graph.addObject(new Square2d(test_graph, [[1,1,0],[2,1,0],[2,2,0],[1,2,0]], "purple", "purple"))


