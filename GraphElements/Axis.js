
/**
 * returns an instance of a graph axis
 */
class Axis {
    /**
     * 
     * @param {*} graph 
     * @param {*} xcolor 
     * @param {*} ycolor 
     * @param {*} zcolor 
     */
    constructor(graph, xcolor, ycolor, zcolor, zeroZeroDotColor, axisLength) {
        this.axisLength = axisLength
        this.graph = graph
        this.lineWidth = 3
        
        //for finite axis
        this._xAxis = new Vector(this.graph, [this.axisLength,0,0], xcolor, this.lineWidth, false, "x")
        this._yAxis = new Vector(this.graph, [0,this.axisLength,0], ycolor, this.lineWidth, false, "y")
        this._zAxis = new Vector(this.graph, [0,0,this.axisLength], zcolor, this.lineWidth, false, "z")
        
        this._xAxisNeg = new Vector(this.graph, [-1*this.axisLength,0,0], xcolor, this.lineWidth, false, "")
        this._yAxisNeg = new Vector(this.graph, [0,-1*this.axisLength,0], ycolor, this.lineWidth, false, "")
        this._zAxisNeg = new Vector(this.graph, [0,0,-1*this.axisLength], zcolor, this.lineWidth, false, "")
    
        // Default
        this.fullAxis         = true //if false draws only positive axis
        this.zeroZeroDot      = true
        this.zeroZeroDotColor = zeroZeroDotColor
        this.zeroZeroDotSize  = 4
    }
    
    /**
     * draws x, y, z axis
     */
    draw() {

        if(this.graph.infiniteAxis === false) {
            // finite axis case
            // we only draw an axis if it is visible!
            if (this.fullAxis) {
                //draw negative axis as well
                if (this.graph.xAxisVisible()) {
                    this._xAxisNeg.draw()
                }
                if (this.graph.yAxisVisible()) {
                    this._yAxisNeg.draw()
                }
                if (this.graph.zAxisVisible()) {
                    this._zAxisNeg.draw()
                }
            }

            if (this.graph.xAxisVisible()) {
                this._xAxis.draw()
            }
            if (this.graph.yAxisVisible()) {
                this._yAxis.draw()
            }
            if (this.graph.zAxisVisible()) {
                this._zAxis.draw()
            }


       } else {
            // infinite axis case
            let xBasis = this.graph.changeBasisZoomAndRotate([1,0,0]);
            let yBasis = this.graph.changeBasisZoomAndRotate([0,1,0]);
            let zBasis = this.graph.changeBasisZoomAndRotate([0,0,1]);

            let sortedIntersectX = getGraphBoundaryEndpoints(this.graph.centerX, this.graph.centerY, xBasis, this.graph);
            let sortedIntersectY = getGraphBoundaryEndpoints(this.graph.centerX, this.graph.centerY, yBasis, this.graph);
            let sortedIntersectZ = getGraphBoundaryEndpoints(this.graph.centerX, this.graph.centerY, zBasis, this.graph);

            let xStart = [sortedIntersectX[0], sortedIntersectX[1]]
            let xEnd   = [sortedIntersectX[2], sortedIntersectX[3]]

            let yStart = [sortedIntersectY[0], sortedIntersectY[1]]
            let yEnd   = [sortedIntersectY[2], sortedIntersectY[3]]

            let zStart = [sortedIntersectZ[0], sortedIntersectZ[1]]
            let zEnd   = [sortedIntersectZ[2], sortedIntersectZ[3]]

            this.graph.drawLine(xStart, xEnd, "blue", this.lineWidth)
            this.graph.drawLine(yStart, yEnd, "red", this.lineWidth)
            this.graph.drawLine(zStart, zEnd, "green", this.lineWidth)

            let ctx = this.graph.ctx
              //label axis
            ctx.font = "30px Monospace"
            ctx.fillStyle = "black"
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle';
            ctx.fillText("x", xEnd, yEnd)
            ctx.fillText("y", yStart, yEnd)
            ctx.fillText("z", zStart, zEnd)
       }
       
       if (this.zeroZeroDot) {
            //puts a dot at (0, 0)
            this.graph.ctx.fillStyle   = this.zeroZeroDotColor
            this.graph.ctx.strokeStyle = this.zeroZeroDotColor
            this.graph.ctx.beginPath();
                this.graph.ctx.arc(this.graph.centerX, this.graph.centerY, this.zeroZeroDotSize, 0, 2 * Math.PI);
                this.graph.ctx.fill();
            this.graph.ctx.stroke();
        }

    }
}