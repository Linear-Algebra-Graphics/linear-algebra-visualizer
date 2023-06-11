
//x, y, z axis
class Graph {
    
    constructor(canvas) {
        this.canvas = canvas
        this.height = canvas.height
        this.width = canvas.width
        this.ctx = canvas.getContext("2d")
        this.baseX = this.canvas.width/2
        this.baseY = this.canvas.height/2
        this.drawnVectors = [];
        this.axisVectors = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
        //this.axisVectors = [[[0, this.height/2],[this.width, this.height/2]],[[this.width/2, 0],[this.width/2, this.height]]]; //stores endpoints
        this.drawAxis(this.ctx, this.axisVectors[0], this.axisVectors[1])
    }

    drawAxis() {
        this.ctx.strokeStyle = "blue"
        this.ctx.lineWidth = 2
        let axisLength = this.baseX
        //              calculates x y needed to keep vector length at axisLength
        // let xScale = Math.sqrt((axisLength*axisLength)/
        //                         parseFloat(this.axisVectors[0][0] * this.axisVectors[0][0]
        //                          + this.axisVectors[0][1] * this.axisVectors[0][1]))
        // let yScale = Math.sqrt((axisLength*axisLength)/
        //                         parseFloat(this.axisVectors[1][0] * this.axisVectors[1][0]
        //                         + this.axisVectors[1][1] * this.axisVectors[1][1]))
        let xScale = axisLength;
        let yScale = axisLength;
        let xAxis = [(xScale*this.axisVectors[0][0]), (xScale*this.axisVectors[0][1])]
        let yAxis = [(yScale*this.axisVectors[1][0]), (yScale*this.axisVectors[1][1])]

        //x axis right
        this.ctx.beginPath()
        this.ctx.moveTo(this.baseX, this.baseY)
        this.ctx.lineTo(this.baseX + xAxis[0], this.baseY - xAxis[1])
        this.ctx.stroke()
        //x axis left
        this.ctx.beginPath()
        this.ctx.moveTo(this.baseX, this.baseY)
        this.ctx.lineTo(this.baseX - xAxis[0], this.baseY + xAxis[1])
        this.ctx.stroke()
        
        this.ctx.strokeStyle = "red"
        //y axis top
        this.ctx.beginPath()
        this.ctx.moveTo(this.baseX, this.baseY)
        this.ctx.lineTo(this.baseX + yAxis[0], this.baseY - yAxis[1])
        this.ctx.stroke()
        //y axis bottom
        this.ctx.beginPath()
        this.ctx.moveTo(this.baseX, this.baseY)
        this.ctx.lineTo(this.baseX - yAxis[0], this.baseY + yAxis[1])
        this.ctx.stroke()
        
        //write axis labels
        this.ctx.font = "30px Arial"
        this.ctx.fillStyle = "black"
        this.ctx.fillText("x", this.baseX - xAxis[0] + 10, this.baseY + xAxis[1] - 10)
        this.ctx.fillText("y", this.baseX + yAxis[0] - 20, this.baseY - yAxis[1] + 20)
    }

    /**
     * takes a 2d vector [x, y] and draws it on the canvas
     * @param {*} vector : len 2 number array of vector
     * @param {*} color : color to draw the vector
     */
    drawVector(vector, color) {
        this.ctx.strokeStyle = color
        this.ctx.beginPath()
            this.ctx.moveTo(this.baseX, this.baseY)
            this.ctx.lineTo(vector[0] + this.baseX, this.baseY - vector[1])
        this.ctx.stroke()
        this.drawnVectors.push(vector)
    }

    /** */
    changeBasis(matrix) {

    }

    /** */
    changePerspective() {

    }
}
