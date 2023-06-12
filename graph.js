//import { matrixVectorMultiplication } from "./matrixMult"

//Notation
//vector: [a, b, c] is a column vector
//
//        |a|
//        |b|
//        |c|
//
//matrix: [[a,b,c],[d,e,f],[g,h,i]] is the matrix
//
//        |a d g|
//        |b e h|
//        |c f i|
//
class Graph {
    
    /**
     * creates an instance of an R3 graph
     * @param {*} canvas canvas on which the graph is drawn 
     */
    constructor(canvas) {
        this.canvas = canvas
        this.height = canvas.height
        this.width = canvas.width
        this.ctx = canvas.getContext("2d")
        
        this.graphCenterX = this.canvas.width/2
        this.graphCenterY = this.canvas.height/2
        
        this.drawnObjects = [];

        // This is the number of graph units from edge to edge. E.g if the canvas is 600x600px we want
        // the length of 20 units to be 600 px.
        this.numOfGraphUnitsEdgeToEdge = 20;
        this.backgroundColor           = "white"
        // I matrix is default
        this.basis                     = [[1,0,0],[0,1,0],[0,0,1]]
        this.showAxis                  = true
        this.graphAxis                 = new Axis(this)
        this.graphGrid                 = new Grid(this)
    }

    addObject(object) {
        this.drawnObjects.push(object)
    }

    /** */
    changeBasis(matrix) {

    }

    /** */
    changePerspective() {

    }

    draw() {
        // Clear screen / add background
        this.ctx.fillStyle = this.backgroundColor
        this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
        
        if (this.showAxis == true) {
            this.graphAxis.draw()
        }

        if (this.showGrid == true) {
            this.graphGrid.draw()
        }
        
        // Draw all objects

        for(let i = 0; i < this.drawnObjects.length; i++) {
            this.drawnObjects[i].draw();
        }
    }


}

//me
class Axis {
    
    /**
     * creates an instance of an Axis
     * @param {*} graph the graph on which the axis are drawn
     */
    constructor(graph) {
        this.graph = graph
        
        this._xAxis = new Vector(this.graph, [10,0,0], "blue", false)
        this._yAxis = new Vector(this.graph, [0,10,0], "red", false)
        this._zAxis = new Vector(this.graph, [0,0,10], "green", false)
        
        this._xAxisNeg = new Vector(this.graph, [-10,0,0], "blue", false)
        this._yAxisNeg = new Vector(this.graph, [0,-10,0], "red", false)
        this._zAxisNeg = new Vector(this.graph, [0,0,-10], "green", false)
    
        // Default
        this.fullAxis     = true
        this.infiniteAxis = false
        this.zeroZeroDot  = true
    }
    
    /**
     * draws x, y, z axis
     */
    draw() {
        if (this.zeroZeroDot) {
            this.graph.ctx.fillRect(this.graph.centerX, this.graph.centerY, 1, 1);
        }

        if(this.infiniteAxis == false) {
            //console.log("trying to draw successful")
            if (this.fullAxis) {
                this._xAxisNeg.draw()
                this._yAxisNeg.draw()
                this._zAxisNeg.draw()
            }
            this._xAxis.draw()
            this._yAxis.draw()
            this._zAxis.draw()

       } else {
            //remember to set back matrixMultiplcation matix if changed to finite axis
       }
    }
    
    
    setAxis(size, arrow) {

        // Update the cords
        this._xAxis.cords = [size, 0, 0]
        this._xAxis.cords = [0, size, 0]
        this._xAxis.cords = [0, 0, size]

        this._xAxisNeg.cords = [-1*size, 0, 0]
        this._yAxisNeg.cords = [0, -1*size, 0]
        this._zAxisNeg.cords = [0, 0, -1*size]

        
        // Update the arrows
        this._xAxis.arrow = arrow
        this._xAxis.arrow = arrow
        this._xAxis.arrow = arrow

        this._xAxisNeg.arrow = arrow
        this._yAxisNeg.arrow = arrow
        this._zAxisNeg.arrow = arrow   
    }
}



class Vector {

    /**
     * creates an instance of a vector
     * @param {*} graph graph on which vector is drawn
     * @param {*} cords coordinates (x, y, z) of vector
     * @param {*} color color of vector
     * @param {*} arrow true if vector has arrow at the end
     */
    constructor(graph, cords, color, arrow){
        this.graph         = graph
        this.cords         = cords
        this.color         = color
        this.arrow         = arrow
    }

    /**
     * draws the vector on the graph
     */
    draw() {
        this.graph.ctx.strokeStyle = this.color
        
        const scale = this.graph.canvas.width / this.graph.numOfGraphUnitsEdgeToEdge
        
        let centerX = this.graph.graphCenterX
        let centerY = this.graph.graphCenterY
        
        // First apply the basis, then the applied matrix. Not sure if this is the correct order for all situations...
        let updatedCords = matrixVectorMultiplication(this.graph.basis, this.cords)
        //console.log(updatedCords)

        let finalX  = centerX + scale * updatedCords[0]
        // Flipped because Y axis is zero at the top
        let finalY  = centerY - scale * updatedCords[1]
        // console.log("finalX: " + finalX)
        // console.log("finalY: " + finalY)
        this.graph.ctx.beginPath()
            this.graph.ctx.moveTo(centerX, centerY)
            this.graph.ctx.lineTo(finalX, finalY)
        this.graph.ctx.stroke()

        if(this.arrow == true) {
            // Draw the arrow
        }
    }


}

class Grid {
    constructor(){
        
    }

    draw() {
        
    }
}



/**
 * does Ax = b multiplication 
 * @param {*} matrix matrix A
 * @param {*} vector vector x
 * @returns vector Ax = b
 */
function matrixVectorMultiplication (matrix, vector) {
    //console.log(matrix)
    //console.log("vector " + vector)
    let returnVector= new Array(vector.length)
    //console.log("help1")
    for (let i=0; i<returnVector.length; i++) {
        returnVector[i] = 0
    }
    //console.log("help2")
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            returnVector[i] = returnVector[i] + matrix[i][j]*vector[j];
        }
    }
    //console.log(returnVector)
    return returnVector
}