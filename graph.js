
//x, y, z axis
class Graph {
    
    constructor(canvas) {
        this.canvas = canvas
        this.height = canvas.height
        this.width = canvas.width
        this.ctx = canvas.getContext("2d")
        
        this.graphCenterX = this.canvas.width/2
        this.graphCenterY = this.canvas.height/2
        
        this.drawnVectors = [];
        
        let xAxis = {cords : {x: 10, y: 0, z: 0}, color: "blue", arrow: false}
        let yAxis = {cords : {x: 0, y: 10, z: 0}, color: "red", arrow: false}
        let zAxis = {cords : {x: 0, y: 0, z: 10}, color: "green", arrow: false}
        this.axisVectors = [xAxis, yAxis, zAxis]

        // This is the number of graph units from edge to edge. E.g if the canvas is 600x600px we want
        // the length of 20 units to be 600 px.
        this.numOfGraphUnitsEdgeToEdge = 20;

        this.backgroundColor = "white";

        this.showAxis     = true
        this.lables       = false
        this.fullAxis     = true
        this.infinateAxis = false
        this.zeroZeroDot  = true

    }

    addAxisVectors() {
        //              calculates x y needed to keep vector length at axisLength
        // let xScale = Math.sqrt((axisLength*axisLength)/
        //                         parseFloat(this.axisVectors[0][0] * this.axisVectors[0][0]
        //                          + this.axisVectors[0][1] * this.axisVectors[0][1]))
        // let yScale = Math.sqrt((axisLength*axisLength)/
        //                         parseFloat(this.axisVectors[1][0] * this.axisVectors[1][0]
        //                         + this.axisVectors[1][1] * this.axisVectors[1][1]))
        
        // let xScale = axisLength;
        // let yScale = axisLength;
        // let xAxis = [(xScale*this.axisVectors[0][0]), (xScale*this.axisVectors[0][1])]
        // let yAxis = [(yScale*this.axisVectors[1][0]), (yScale*this.axisVectors[1][1])]


        // Draw x axis
        this.addVector(this.axisVectors[0]);
        // Draw y axis
        this.addVector(this.axisVectors[1]);
        


        
        // if (lables == true) {
        //     //write axis labels
        //     this.ctx.font = "30px Arial"
        //     this.ctx.fillStyle = "black"
        //     this.ctx.fillText("x", this.graphCenterX - xAxis[0] + 10, this.graphCenterY + xAxis[1] - 10)
        //     this.ctx.fillText("y", this.graphCenterX + yAxis[0] - 20, this.graphCenterY - yAxis[1] + 20)
        // }
    }

    addVector(vector) {
        this.drawnVectors.push(vector)
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
            this.addAxisVectors();
        }

        // Draw all vectors
        for(let i=0; i<this.drawnVectors.length; i++) {

            let currentVector = this.drawnVectors[i];

            this.ctx.strokeStyle = currentVector.color

            this.ctx.beginPath()
                this.ctx.moveTo(this.graphCenterX, this.graphCenterY)
                this.ctx.lineTo(currentVector.cords.x + this.graphCenterX, this.graphCenterY - currentVector.cords.y)
            this.ctx.stroke()
        }

    }


}
