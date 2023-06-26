
/**
 * returns an instance of a graph axis
 */
class Axis {
    /**
     * creates an instance of an Axis
     * @param {*} graph the graph on which the axis are drawn
     */
    constructor(graph) {
        this.graph = graph
        this.lineWidth = 6
        
        //for finite axis
        this._xAxis = new Vector(this.graph, [10,0,0], "blue", this.lineWidth, false, "x")
        this._yAxis = new Vector(this.graph, [0,10,0], "red", this.lineWidth, false, "y")
        this._zAxis = new Vector(this.graph, [0,0,10], "green", this.lineWidth, false, "z")
        
        this._xAxisNeg = new Vector(this.graph, [-10,0,0], "blue", this.lineWidth, false, "")
        this._yAxisNeg = new Vector(this.graph, [0,-10,0], "red", this.lineWidth, false, "")
        this._zAxisNeg = new Vector(this.graph, [0,0,-10], "green", this.lineWidth, false, "")
    
        // Default
        this.fullAxis         = true //if false draws only positive axis
        this.zeroZeroDot      = true
        this.zeroZeroDotColor = "black"
        this.zeroZeroDotSize  = 5
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
            ctx.font = "45px Monospace"
            ctx.fillStyle = "black"
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle';
            ctx.fillText("x", xEnd, yEnd)
            ctx.fillText("y", yStart, yEnd)
            ctx.fillText("z", zStart, zEnd)
       }
       
       if (this.zeroZeroDot) {
            // puts a dot at (0, 0)
            this.graph.ctx.fillStyle   = this.zeroZeroDotColor
            this.graph.ctx.strokeStyle = this.zeroZeroDotColor
            this.graph.ctx.beginPath();
                this.graph.ctx.arc(this.graph.centerX, this.graph.centerY, this.zeroZeroDotSize, 0, 2 * Math.PI);
                this.graph.ctx.fill();
            this.graph.ctx.stroke();

        }

    }
    
    /**
     * Is this function useless? it probably is, but 
     * we may keep it as a mascot!
     * Change the size of the axis
     * @param {*} size 
     * @param {*} arrow 
     */
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