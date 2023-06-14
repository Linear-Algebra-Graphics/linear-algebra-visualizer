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
        //this.basis                     = [[Math.cos(Math.PI/4),Math.sin(Math.PI/4),0],[-1*Math.sin(Math.PI/4),Math.cos(Math.PI/4),0],[0,0,1]]
        
        this.graphAxis                 = new Axis(this)
        this.graphGrid                 = new Grid(this)
        this.showAxis                  = true
        this.showGrid                  = true
        this.infiniteAxis              = true
    }

    /**
     * adds new object to be displayed on the graph
     * @param {*} object can be a vector/grid/square/
     */
    addObject(object) {
        this.drawnObjects.push(object)
    }

    /** */
    changePerspective() {

    }

    draw() {
        // Clear screen / add background
        this.ctx.fillStyle = this.backgroundColor
        this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
        
        if (this.showGrid == true) {
            this.graphGrid.draw()
        }
        
        if (this.showAxis == true) {
            this.graphAxis.draw()
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

        //for infinite axis
        const infLen = this.graph.width*this.graph.numOfGraphUnitsEdgeToEdge
        
        this._infxAxis = new Vector(this.graph, [infLen,0,0], "blue", false)
        this._infyAxis = new Vector(this.graph, [0,infLen,0], "red", false)
        this._infzAxis = new Vector(this.graph, [0,0,infLen], "green", false)
        
        this._infxAxisNeg = new Vector(this.graph, [-1*infLen,0,0], "blue", false)
        this._infyAxisNeg = new Vector(this.graph, [0,-1*infLen,0], "red", false)
        this._infzAxisNeg = new Vector(this.graph, [0,0,-1*infLen], "green", false)
    
        // Default
        this.fullAxis     = true
        this.zeroZeroDot  = true
    }
    
    /**
     * draws x, y, z axis
     */
    draw() {
        if(this.graph.infiniteAxis === false) {
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
            if (this.fullAxis) {
                this._infxAxisNeg.draw()
                this._infyAxisNeg.draw()
                this._infzAxisNeg.draw()
            }
            this._infxAxis.draw()
            this._infyAxis.draw()
            this._infzAxis.draw()
            //remember to set back matrixMultiplcation matix if changed to finite axis
       }
       if (this.zeroZeroDot) {
            //this.graph.ctx.fillRect(this.graph.centerX, this.graph.centerY, 700, 500);
            
            this.graph.ctx.fillStyle = "black"
            this.graph.ctx.strokeStyle = "black"
            this.graph.ctx.beginPath();
                this.graph.ctx.arc(this.graph.graphCenterX, this.graph.graphCenterY, 5, 0, 2 * Math.PI);
                this.graph.ctx.fill();
            this.graph.ctx.stroke();

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
        this.graph.ctx.lineWidth = 3

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
    constructor(graph){
        this.graph = graph
    }

    draw() {
        
        let xBasis = matrixVectorMultiplication(this.graph.basis, [1,0,0]);
        let yBasis = matrixVectorMultiplication(this.graph.basis, [0,1,0]);

        let xAngle = Math.atan(xBasis[1] / xBasis[0])
        let yAngle = Math.atan(yBasis[1] / yBasis[0])
        
        const scale = this.graph.canvas.width / this.graph.numOfGraphUnitsEdgeToEdge
        this.graph.ctx.lineWidth = 1
        this.graph.ctx.strokeStyle = "grey"

        
        //loop through x axis intervals
        let x = this.graph.graphCenterX
        let y = this.graph.graphCenterY
        let x_neg = this.graph.graphCenterX
        let y_neg = this.graph.graphCenterY
        
        while (0 <= x && x <= this.graph.canvas.width && 0 <= y && y <= this.graph.canvas.width) { //check for in canvas bounds
            this._drawOrthoLine(x, y, yBasis)
            this._drawOrthoLine(x_neg, y_neg, yBasis)
            x += scale * xBasis[0]
            y -= scale * xBasis[1]
            x_neg -= scale * xBasis[0]
            y_neg += scale * xBasis[1]     
        }
        
        //loop through y axis intervals
        x = this.graph.graphCenterX
        y = this.graph.graphCenterY
        x_neg = this.graph.graphCenterX
        y_neg = this.graph.graphCenterY
        
        while (0 <= x && x <= this.graph.canvas.width && 0 <= y && y <= this.graph.canvas.width) { //check for in canvas bounds
            this._drawOrthoLine(x, y, xBasis)
            this._drawOrthoLine(x_neg, y_neg, xBasis)
            x += scale * yBasis[0]
            y -= scale * yBasis[1]
            x_neg -= scale * yBasis[0]
            y_neg += scale * yBasis[1]     
        }
    }

    _drawOrthoLine(x, y, orthogonalBasis) {
        let width_scale = this.graph.canvas.width

        let finalX  = x + width_scale * orthogonalBasis[0]
        // Flipped because Y axis is zero at the top
        let finalY  = y - width_scale * orthogonalBasis[1]
        let startX  = x - width_scale * orthogonalBasis[0]
        // Flipped because Y axis is zero at the top
        let startY  = y + width_scale * orthogonalBasis[1]
        this.graph.ctx.beginPath()
            this.graph.ctx.moveTo(startX, startY)
            this.graph.ctx.lineTo(finalX, finalY)
        this.graph.ctx.stroke()
    }

}
