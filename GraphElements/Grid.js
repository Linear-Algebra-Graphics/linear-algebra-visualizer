/**
 * returns an instance of a graph grid
 */
class Grid {
    constructor(graph, colorLight, lineWidthLight, colorDark, lineWidthDark){
        
        this.graph          = graph
        //lighter grid lines
        this.colorLight     = "#E6E6E3"
        this.lineWidthLight = 2
        
        //darker grid lines
        this.colorDark      = "#BFBFBD"
        this.lineWidthDark  = 3
    }

    /**
     * draws grid
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
            let angle = Math.acos((dotProduct(xBasis2D, yBasis2D)) / (xLength * yLength))
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

            if (!(det3x3(this.graph.basis) < 0.000001 && det3x3(this.graph.basis) > -0.000001)) {
                // If statments are just for clarity
                if (5 * minPgramHeight < 2.5 * boxW) {
                    iter_mult = 0
                    let factor = 5
                    let multScale = 2
                    while (factor * minPgramHeight < 2.5 * boxW) {
                        minPgramHeight = minPgramHeight * multScale
                        iter_mult++
                        //we calculate scaling starting from unit square 1x1 on the graph
                        //this means copying desmos the first merge up takes to a 4x4 from a 5x5.
                        // therefore on the second iteration of the while loop, we check using factor 4, this then happens every 3 iterations
                        if (iter_mult % 3 == 1) {
                            factor = 4
                            multScale = 2.5
                        } else {
                            factor = 5
                            multScale = 2
                        }
                    }
                } else if (5 * minPgramHeight > 5 * boxW) {
                    iter_div = 0
                    let divScale = 2
                    while (5 * minPgramHeight > 5 * boxW) {
                        minPgramHeight = minPgramHeight / divScale
                        iter_div++
                        if (iter_div % 3 == 1) {
                            divScale = 2.5
                        } else {
                            divScale = 2
                        }
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
                this.drawHalfAxisGridInf(true, xBasis,yBasis, iters, div)
                this.drawHalfAxisGridInf(false, neg_xBasis,yBasis, iters, div)
                this.drawHalfAxisGridInf(true, yBasis, xBasis, iters, div)
                this.drawHalfAxisGridInf(false, neg_yBasis, xBasis, iters, div)
            }
        } else {
            
            // there are gridSize lines on each half axis
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
                    
                    //grid numbers - they currently look bad
                    
                    // ctx.font = "30px Monospace"
                    // ctx.fillStyle = "black"
                
                    // if (angle >= Math.PI/4 && angle < 3*Math.PI/4) {
                    //     ctx.textAlign = 'center'
                    //     ctx.textBaseline = 'middle';
                    // } else {
                    //     ctx.textAlign = 'center'
                    //     ctx.textBaseline = 'middle';
                    // }

                    // let labelPtX = this.graph.changeBasisZoomAndRotate([i, 0, 0])
                    // let labelPtY = this.graph.changeBasisZoomAndRotate([0, i, 0])
                    // let labelPtZ = this.graph.changeBasisZoomAndRotate([0, 0, i])
                    // let scale = this.graph.scale

                    // let xAngle = Math.acos((dotProduct([labelPtX[0], labelPtX[1]], [1, 0])) / (vectorLength([labelPtX[0], labelPtX[1]]) * vectorLength([1,0])))
                    // let yAngle = Math.acos((dotProduct([labelPtY[0], labelPtY[1]], [1, 0])) / (vectorLength([labelPtY[0], labelPtY[1]]) * vectorLength([1,0])))
                    // let zAngle = Math.acos((dotProduct([labelPtZ[0], labelPtZ[1]], [1, 0])) / (vectorLength([labelPtZ[0], labelPtZ[1]]) * vectorLength([1,0])))

                    // if (xAngle >= Math.PI/4 && xAngle < 3*Math.PI/4) {
                    //     ctx.textAlign = 'center'
                    //     ctx.textBaseline = 'middle';
                    // } else {
                    //     ctx.textAlign = 'center'
                    //     ctx.textBaseline = 'middle';
                    // }
                    // ctx.fillText(i, this.graph.centerX + (scale * labelPtX[0]), this.graph.centerY - (scale * labelPtX[1]))
                    // ctx.fillText(-1*i, this.graph.centerX - (scale * labelPtX[0]), this.graph.centerY + (scale * labelPtX[1]))

                    // if (yAngle >= Math.PI/4 && yAngle < 3*Math.PI/4) {
                    //     ctx.textAlign = 'center'
                    //     ctx.textBaseline = 'middle';
                    // } else {
                    //     ctx.textAlign = 'center'
                    //     ctx.textBaseline = 'middle';
                    // }
                    // ctx.fillText(i, this.graph.centerX + (scale * labelPtY[0]), this.graph.centerY - (scale * labelPtY[1]))
                    // ctx.fillText(-1*i, this.graph.centerX - (scale * labelPtY[0]), this.graph.centerY + (scale * labelPtY[1]))

                    // if (zAngle >= Math.PI/4 && zAngle < 3*Math.PI/4) {
                    //     ctx.textAlign = 'center'
                    //     ctx.textBaseline = 'middle';
                    // } else {
                    //     ctx.textAlign = 'center'
                    //     ctx.textBaseline = 'middle';
                    // }
                    // ctx.fillText(i, this.graph.centerX + (scale * labelPtZ[0]), this.graph.centerY - (scale * labelPtZ[1]))
                    // ctx.fillText(-1*i, this.graph.centerX - (scale * labelPtZ[0]), this.graph.centerY + (scale * labelPtZ[1]))
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
     * @param {boolean} isPositiveAxis boolean value that indicates if half axis is positive
     * @param {number[]} axis vector defining axis along which grid lines are drawn
     * @param {number[]} gridVector vector defining grid lines
     * @param {number} iterations numberic value of scalings applied to inter grid line distance
     * @param {boolean} divide boolean value, true if distance needs to be smaller, else false
     */
    drawHalfAxisGridInf(isPositiveAxis, axis, gridVector, iterations, divide) {
        let x = this.graph.centerX
        let y = this.graph.centerY

        let keepGoing = true
        let lineCount = 0

        let xStep = this.graph.scale * axis[0]
        let yStep = this.graph.scale * axis[1]
        if (divide) {
            for (let i = 0; i < iterations; i++) {
                if (i % 3 == 1) {
                    //every 3rd we have 4x4 from previous square of 4 small 5x5s, so this step requires step scale
                    // up by 2.5
                    xStep = xStep / 2.5
                    yStep = yStep / 2.5
                } else {
                    xStep = xStep / 2
                    yStep = yStep / 2
                }
            }
        } else {
            for (let i = 0; i < iterations; i++) {
                if (i % 3 == 1) {
                    xStep = xStep * 2.5
                    yStep = yStep * 2.5
                } else {
                    xStep = xStep * 2
                    yStep = yStep * 2
                }
            }
        }
        

        while (keepGoing) {

            let endPoints = getGraphBoundaryEndpoints(x, y, gridVector, this.graph)

            let startX = endPoints[0]
            let startY = endPoints[1]
            let endX = endPoints[2]
            let endY = endPoints[3]


            // start weirdness <= I do not know exaclty why the
            // next 4 lines do what they do
            let mergesToFourSquare = 2
            if (divide) {
                mergesToFourSquare = 1
            }
            // end weirdness??

            // we check for % = 2 on zoom out because our graph starts at default on 5units by 5units square,
            // which is two merge ups to the next 4x4
            //
            // we check for % = 1 on zoom in because on defualt 5unit by 5unit square one iteration of square
            // split on zoom in brings up 4x4 from 5x5
            let boxSize = 5
            if (iterations % 3 == mergesToFourSquare) {
                boxSize = 4
            }

            // Biggest grid spacing should be the default number we start with
            // Smallest grid spacing should be 2 times the default

            // This means the two minimum points are outside the canvas. This means that we do not need to draw the lines anymore so we break the loop.
            if (!this.graph.outSideCanvas([startX, startY]) || !this.graph.outSideCanvas([endX, endY])) {
                // Make every fith line dark
                if (lineCount % boxSize == 0) {
                    this.graph.drawLine([startX, startY],[endX, endY], this.colorDark, this.lineWidthDark);
                    
                    //do not want to add 0 4 times (once per half axis call)
                    if (lineCount != 0) {
                        this._addGridNumber(x, y, axis, gridVector, isPositiveAxis)
                    }
                } else {
                    //no labeling, just drawing light grid line
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

    /**
     * adds a grid number offset from the x, y location
     * @param {number} x x coordinate
     * @param {number} y y coordinate
     * @param {number[]} axis vector defining the line x, y is on
     * @param {number[]} gridVector vector perp to axis along which the number is added
     * @param {boolean} isPositiveAxis boolean value of whether the axis is positive or negative
     */
    _addGridNumber(x, y, axis, gridVector, isPositiveAxis) {
        // grid numbers
        let angle = Math.acos((dotProduct([axis[0], axis[1]], [1, 0])) / (vectorLength([axis[0], axis[1]]) * vectorLength([1,0])))
        // console.log(angle)
        this.graph.ctx.font = "30px Monospace"
        this.graph.ctx.fillStyle = "black"
    
        if (angle >= Math.PI/4 && angle < 3*Math.PI/4) {
            this.graph.ctx.textAlign = 'center'
            this.graph.ctx.textBaseline = 'middle';
        } else {
            this.graph.ctx.textAlign = 'center'
            this.graph.ctx.textBaseline = 'middle';
        }
        
        // calculate value at current gridline
        let dist = (vectorLength([x - this.graph.centerX, y - this.graph.centerY, 0])/vectorLength(axis)) / this.graph.scale
        //set to 0 decimals rn
        // .001
        let indexVal = "" //the string of the value to be displayed

        indexVal = formatNumber(parseFloat(dist))

        //negative sign for negative axis
        if (!isPositiveAxis) {
            indexVal = "-" + indexVal
        }
        
        //offset grid numbers from axis
        let scale = this.graph.scale
        let gridNumX = (0.9 * scale * gridVector[0]/vectorLength(gridVector))
        let gridNumY = (0.9 * scale * gridVector[1]/vectorLength(gridVector))
        this.graph.ctx.fillText(indexVal, x - gridNumX, y + gridNumY)
    }
}


/**
 * formats number to string, turns in to scientific notation 
 * if value > PLACEHOLDER or value < PLACEHOLDER
 * @param {number} dist a numeric float value 
 * @return returns dist formatted as a string
 */
function formatNumber(dist) {
    let expStr = ""
    // convert to scienfitic notation if index is greater than value
    if (dist / 1000000 > 1 || dist * 100 < 1) {
        expStr = dist.toExponential()
        let split = expStr.split("e")
        // parse into int to get rid of floating point errors
        let coeff = Math.round(split[0])
        expStr = "" + coeff + "e" + split[1]
    } else {
        if (dist >= 1) {
            expStr = dist.toFixed(0)
        } else {
            expStr = dist.toFixed(2)
        }
    }
    return expStr
}