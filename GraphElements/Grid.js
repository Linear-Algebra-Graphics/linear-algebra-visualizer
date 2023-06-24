/**
 * returns an instance of a graph grid
 */
class Grid {
    constructor(graph){
        this.graph          = graph
        //lighter grid lines
        this.colorLight     = "#E6E6E3"
        this.lineWidthLight = 2
        
        //darker grid lines
        this.colorDark      = "#BFBFBD"
        this.lineWidthDark  = 3
    }

    /**
     * 
     */
    draw() {
        
        
        if (!this.graph.xAxisVisible() || !this.graph.yAxisVisible() || !this.graph.zAxisVisible()) {
            //infinite grid case
            
            // xBasis and yBasis are relative 
            let xBasis
            let yBasis

            let neg_xBasis
            let neg_yBasis

            if (!this.graph.xAxisVisible()) {
                xBasis = this.graph.changeBasisZoomAndRotate([0,1,0]);
                yBasis = this.graph.changeBasisZoomAndRotate([0,0,1]);

                neg_xBasis = this.graph.changeBasisZoomAndRotate([0,-1,0]);
                neg_yBasis = this.graph.changeBasisZoomAndRotate([0,0,-1]);
            } else if (!this.graph.yAxisVisible()) {
                xBasis = this.graph.changeBasisZoomAndRotate([1,0,0]);
                yBasis = this.graph.changeBasisZoomAndRotate([0,0,1]);

                neg_xBasis = this.graph.changeBasisZoomAndRotate([-1,0,0]);
                neg_yBasis = this.graph.changeBasisZoomAndRotate([0,0,-1]);
            } else {
                xBasis = this.graph.changeBasisZoomAndRotate([1,0,0]);
                yBasis = this.graph.changeBasisZoomAndRotate([0,1,0]);

                neg_xBasis = this.graph.changeBasisZoomAndRotate([-1,0,0]);
                neg_yBasis = this.graph.changeBasisZoomAndRotate([0,-1,0]);
            }

            // Point slope formula
                // y+y1 = m(x-x1)
                // y = m(x-x1)+y1
                // y = mx-mx1+y1
                // y = mx + (y1-mx1)
                // y = mx + b
                // b = (y1-mx1)
            /**
             * we define the standard box as a box of w*h, that is 5x5 in terms of grid boxes
             * boxW: is the width of offset between two grid lines in standard zoom and perspective
             * 
             * minPgramHeight: the width of the a 5x5 grid box in zoomed basis
             * iter_mult: number of times to double minPgramHeight to being it back to the standard box
             * iter_div: number of times to halve minPgramHeight --||--
             */
            let boxW =  1
            //get (x,y) vector elements of x and y basis
            let xBasis2D = [xBasis[0], xBasis[1]] //only want x y so that the angle and 2d vector lengths are accurate
            let yBasis2D = [yBasis[0], yBasis[1]]

            //calculate length of these 2d vectors
            let xLength = vectorLength(xBasis2D)
            let yLength = vectorLength(yBasis2D)

            //calculate area of parrallelogram defined by x and y axis vectors in R2
            let angle = Math.acos((vectorMultiplication(xBasis2D, yBasis2D)) / (xLength * yLength))
            let area = xLength * yLength * Math.sin(angle)

            //calculate the two heights of the parrallelogram 
            let perpXLength = area / xLength //pgram height when base is x vector
            let perpYLength = area / yLength //pgram height when base is y vector
            
            //get minimum of two pgram heights
            let minPgramHeight = Math.min(perpXLength, perpYLength)
        
            let iter_mult = Number.MAX_VALUE
            let iter_div = Number.MAX_VALUE

            //find if scaling is division or multiplication, and how many scaling iterations
            //keep if else for now
            if (5 * minPgramHeight < 2.5 * boxW) {
                iter_mult = 0
                while (5 * minPgramHeight < 2.5 * boxW) {
                    minPgramHeight = minPgramHeight * 2
                    iter_mult++
                }
            } else if (5 * minPgramHeight > 5 * boxW) {
                iter_div = 0
                while (5 * minPgramHeight > 5 * boxW) {
                    minPgramHeight = minPgramHeight / 2
                    iter_div++
                }
            }
            
            //get lower of the iteration counts => least # of scaling 
            //to get back to standard boxW dimensions
            let iters = iter_div
            let div = true
            if (iter_div == Number.MAX_VALUE) {
                iters = iter_mult
                div = false
            }
            if (iters == Number.MAX_VALUE) {
                iters = 0
            }

            //2d infinite grid
            this.drawHalfAxisGridInf(xBasis,yBasis, iters, div)
            this.drawHalfAxisGridInf(neg_xBasis,yBasis, iters, div)
            this.drawHalfAxisGridInf(yBasis, xBasis, iters, div)
            this.drawHalfAxisGridInf(neg_yBasis, xBasis, iters, div)
            
        } else {
            let gridSize = 2 * 5
            //this.graph.drawPointToPoint([3,3, 0], [10,3, 0], "green", 3)

            // let xAxisVec = this.changeBasisZoomAndRotate([gridSize,0,0])
            // let yAxisVec = this.changeBasisZoomAndRotate([0,gridSize,0])
            
            for (let i = 1; i < gridSize + 1; i++) {
                let currentColor = this.colorLight
                let lineWidth    = this.lineWidthLight 
                let ctx = this.graph.ctx

                if (i % 5 == 0) {
                    currentColor = this.colorDark
                    lineWidth    = this.lineWidthDark
                    
                //    this.graph.
                }
                // xy plane
                    //on x axis drawing y axis grid lines
                    this.graph.drawPointToPoint([i, gridSize, 0], [i, -(gridSize), 0], currentColor, lineWidth)
                    // same on negative x axis
                    this.graph.drawPointToPoint([-i, gridSize, 0], [-i, -(gridSize), 0], currentColor, lineWidth)
                                  
                    //on y axis drawing x axis grid lines
                    this.graph.drawPointToPoint([-(gridSize), i, 0], [gridSize,i, 0], currentColor, lineWidth)
                    //same as above on negative y axis
                    this.graph.drawPointToPoint([-(gridSize), -i, 0], [gridSize,-i, 0], currentColor, lineWidth)


                //xz plane
                    //on x axis drawing z axis grid lines
                    this.graph.drawPointToPoint([i, 0, -(gridSize)], [i, 0, gridSize], currentColor, lineWidth)
                    //same as above on negative x axis
                    this.graph.drawPointToPoint([-i, 0, -(gridSize)], [-i, 0, gridSize], currentColor, lineWidth)

                    //on z axis drawing x axis grid lines
                    this.graph.drawPointToPoint([-(gridSize), 0, i], [gridSize, 0, i], currentColor, lineWidth)
                    //same as above on negative z axis
                    this.graph.drawPointToPoint([-(gridSize), 0, -i], [gridSize, 0, -i], currentColor, lineWidth)


                //yz plane
                    //on y axis drawing x axis grid lines
                    this.graph.drawPointToPoint([0, -(gridSize), i], [0, gridSize, i], currentColor, lineWidth)
                    //same as above on negative y axis
                    this.graph.drawPointToPoint([0, -(gridSize), -i], [0, gridSize,-i], currentColor, lineWidth)

                    //on y axis drawing x axis grid lines
                    this.graph.drawPointToPoint([0, i, -(gridSize)], [0, i, gridSize], currentColor, lineWidth)
                    //same as above on negative y axis
                    this.graph.drawPointToPoint([0, -i, -(gridSize)], [0,-i, gridSize], currentColor, lineWidth)
            }

        }

    }

    
    /**
     * draws grid lines along half of an axis, in the direction of the vector axis
     * each grid line is defined by the vector gridVector
     * 
     * accounts for merging or splitting grid lines at enough zoom
     * @param {*} axis xBasis originally 
     * @param {*} gridVector vector defining grid lines
     * @param {*} iteraions number of scalings applied to distance between grid lines
     * @param {*} divide true if distance needs to be smaller, else false
     */
    drawHalfAxisGridInf(axis, gridVector, iterations, divide) {
        let x = this.graph.centerX
        let y = this.graph.centerY

        let keepGoing = true
        let lineCount = 0

        let xStep = this.graph.scale * axis[0]
        let yStep = this.graph.scale * axis[1]
        if (divide) {
            for (let i = 0; i < iterations; i++) {
                xStep = xStep / 2
                yStep = yStep / 2
            }
        } else {
            for (let i = 0; i < iterations; i++) {
                xStep = xStep * 2
                yStep = yStep * 2
            }
        }

        while (keepGoing) {

            let endPoints = getGraphBoundaryEndpoints(x, y, gridVector, this.graph)

            let startX = endPoints[0]
            let startY = endPoints[1]
            let endX = endPoints[2]
            let endY = endPoints[3]
            // Biggest grid spacing should be the default number we start with
            // Smallest grid spacing should be 2 times the default

            // This means the two minimum points are outside the canvas. This means that we do not need to draw the lines anymore so we break the loop.
            if (!this.graph.outSideCanvas([startX, startY]) || !this.graph.outSideCanvas([endX, endY])) {
                // Make every fith line dark
                if (lineCount % 5 == 0) {
                    // this.graph.ctx.fillStyle = "black"
                    // this.graph.ctx.font = "40px monospace";
                    // this.graph.ctx.fillText(("(" + ", " + ")"), x+10, y-20);
                    this.graph.drawLine([startX, startY],[endX, endY], this.colorDark, this.lineWidthDark);
                } else {
                    this.graph.drawLine([startX, startY],[endX, endY], this.colorLight, this.lineWidthLight);
                }
                
                x += xStep
                y -= yStep

            } else {
                keepGoing = false
            }
            lineCount++
        }
    }
}