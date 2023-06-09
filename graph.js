

//only x y axis rn
class Graph {
    
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")
        this.baseX = this.canvas.width/2
        this.baseY = this.canvas.height/2
        this.drawnVectors = [];
        drawBasis(this.ctx, this.canvas.width, this.canvas.height)
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
    }

    /** */
    changeBasis(matrix) {

    }

    /** */
    changePerspective() {

    }
}


// draws the initial x,y basis of the graph
// @param {*} ctx : 2d context of canvas
// @param {*} width : width of canvas
// @param {*} height : height of canvas
// @requires : x and y to be nonegative
function drawBasis(ctx, width, height) {
    ctx.strokeStyle = "black"
    //x axis
    ctx.beginPath()
        ctx.moveTo(0, height/2)
        ctx.lineTo(width, height/2)
    ctx.stroke()
    //y axis
    ctx.beginPath()
        ctx.moveTo(width/2, 0)
        ctx.lineTo(width/2, height)
    ctx.stroke()
}


