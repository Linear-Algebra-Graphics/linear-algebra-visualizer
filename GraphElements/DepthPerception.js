
class DepthPerception {
    constructor(graph, planes, lines, points, text) {
        this.graph = graph
        this.planes = planes
        this.lines = lines
        this.points = points
        this.text = text
        this.gridSize = 10

        //the lines that split planes and the lines that split lines are fundamentally different, so
        //must be separate classes
        this.gaussianPlanes = undefined

        this.precision = 7
        
    }

    draw() {
        // let lines = []
        // for (let i = 0; i < this.axisLines.length; i++) {
        //     lines.push(new Line(this.graph, [0,0,0], this.axisLines[i], false))
        // }
        let wow = new GridLinesDepth(this.graph, this.gaussianPlanes)

        let gridLines = wow.getGridLines()
        //debugger


        //let gridPolygons = new Array(gridLines.length)
        for (let i = 0; i < gridLines.length; i++) {
            gridLines[i].point1 = this.graph.changeBasisAndRotate(gridLines[i].point1)
            gridLines[i].point2 = this.graph.changeBasisAndRotate(gridLines[i].point2)
            gridLines[i].midPoint = this.graph.changeBasisAndRotate(gridLines[i].midPoint)
        }
        //debugger
    
        if (this.gaussianPlanes != undefined) {
            //this.gaussianPlanes.cubeBoundPlanes = true
            //we are going to look at each line, and figure out which planes are in front/behind
            //we can represent this with a boolean or bit array so that we have faast lookup time in a map
            //we need to know the index of each color in the given array in gaussianPlanes, so that each index
            //for its color corresponds to a index in the boolean/bit array. each line polygon should have an array

            //get index map
            let colorIndexMap = new Map()

            
            for (let i = 0; i < this.gaussianPlanes.planeColors.length; i++) {
                colorIndexMap.set(this.gaussianPlanes.planeColors[i], i)
            }

            // //get in rotation plane equations
            let planes = JSON.parse(JSON.stringify(this.gaussianPlanes.planesStdForm))

            for (let i = 0; i < planes.length; i++) {
                //debugger
                const normalVector = planes[i].slice(0, planes[i].length - 1) //should always be length 4 array at planes[i]
                const index = leftMostNonZeroInRowStd(planes, i)
                if (index < planes[i].length - 1 && this.gaussianPlanes.planesToDraw[i]) {
                    //change basis magik now
                    const pointOnPlane = new Array(planes[i].length - 1).fill(0)
                    pointOnPlane[index] = planes[i][planes[i].length - 1] / planes[i][index]

                    let newNormalVector = this.graph.changeBasisAndRotate(normalVector)
                    const newPointOnPlane = this.graph.changeBasisAndRotate(pointOnPlane)
                    const newD = dotProduct(newNormalVector, newPointOnPlane)
                    newNormalVector.push(newD)
                    planes[i] = newNormalVector
                    //debugger
                } else {
                    planes[i] = null
                }
            }
            //console.log(planes)
            //debugger

            // //debugger
            let planesBeforeMap = new Map()
            // //check depth relative to planes
            // //should sort each map value by min/maxZ once done
            //debugger
            for (let i = 0; i < gridLines.length; i++) {
                //debugger
                let planesBefore = new Array(planes.length).fill(true)
                let str = ""
                for (let j = 0; j < planes.length; j++) {
                    //debugger
                    if (planes[j] != null && !numEqual(planes[j][2], 0, this.precision)) {
                        let z = (planes[j][3] - (planes[j][0] * gridLines[i].midPoint[0]) - (planes[j][1] * gridLines[i].midPoint[1])) / planes[j][2]
                        if (!numEqual(z, gridLines[i].midPoint[2], this.precision)) {
                            if (z < gridLines[i].midPoint[2]) {
                                planesBefore[j] = false
                            }
                        }
                    }
                    str += planesBefore[j]
                }
                if (planesBeforeMap.has(str)) {
                    planesBeforeMap.get(str).push(gridLines[i])
                } else {
                    planesBeforeMap.set(str, [gridLines[i]])
                }
            }
            //debugger
            //debugger




            ///end stupid
            
            let polygons = this.gaussianPlanes.returnPlanePolygons()
            let polygonColorMap = new Map()

            let map = new Map()
            for (let i = 0; i < polygons.length; i++) {
                //count polygons of similar color
                if (!polygonColorMap.has(polygons[i].fillColor)) {
                    polygonColorMap.set(polygons[i].fillColor, 0)   
                }
                polygonColorMap.set(polygons[i].fillColor, polygonColorMap.get(polygons[i].fillColor) + 1)

                //put polygons of same x y center point together
                let adjPoint = scaleVector(polygons[i].centroid, this.graph.scale)
                for (let j = 0; j < adjPoint.length; j++) {
                    adjPoint[j] =  parseFloat((Math.round(adjPoint[j] * 100) / 100).toFixed(2));
                }
                let stringForm = "["+adjPoint[0]+","+adjPoint[1]+"]"
                if (map.has(stringForm)) {
                    map.get(stringForm).push(polygons[i])
                } else {
                    map.set(stringForm, [polygons[i]])
                }
            }

            //debugger
            if (planesBeforeMap.has("truetruetrue")) {
                let value = planesBeforeMap.get("truetruetrue")
                value = value.sort(function(a, b) {
                    if (numEqual(a.minZ, b.minZ, 7)) {
                        if (numEqual(a.maxZ, b.maxZ, 7)) {
                            return 0;
                        } else {
                            return a.maxZ - b.maxZ
                        }
                    } else {
                        return a.minZ - b.minZ
                    }
                })
                for (let j = 0; j < value.length; j++) {
                    //debugger
                    value[j].point1 = this.graph.applyZoom(value[j].point1)
                    value[j].point2 = this.graph.applyZoom(value[j].point2)
                    value[j].midPoint = this.graph.applyZoom(value[j].midPoint)
                    debugger
                    value[j].draw()
                }
            }

            let notColored = new Array(planes.length).fill(true)

            //debugger
            map.forEach((value, key, map) => {
                map.get(key).sort(function(a, b) {
                    //debugger
                    if (numEqual(a.centroid[2], b.centroid[2], 7)) {
                        return 0
                    } else {
                        return a.centroid[2] - b.centroid[2]
                    }
                })
                //debugger
                for (let i = 0; i < map.get(key).length; i++) {
                    let polygon = map.get(key)[i]
                    for (let j = 0; j < polygon.lines.length; j++) {
                        polygon.lines[j].point1 = this.graph.applyZoom(polygon.lines[j].point1)
                        polygon.lines[j].point2 = this.graph.applyZoom(polygon.lines[j].point2)
                    }
                    debugger
                    polygon.draw()
                


                    // debugger
                    let color = polygon.fillColor
                    if (polygonColorMap.has(color)) {
                        let old = polygonColorMap.get(color)
                        
                        if (old == 1) {
                            //debugger
                            polygonColorMap.delete(color)
                            notColored[colorIndexMap.get(color)] = false
                            let str = ""+notColored[0]+""+notColored[1]+""+notColored[2]
                            debugger
                            if (planesBeforeMap.has(str) && str != "truetruetrue") {
                                let value = planesBeforeMap.get(str)
                                for (let j = 0; j < value.length; j++) {
                                    value[j].point1 = this.graph.applyZoom(value[j].point1)
                                    value[j].point2 = this.graph.applyZoom(value[j].point2)
                                    value[j].midPoint = this.graph.applyZoom(value[j].midPoint)
                                    debugger
                                    value[j].draw()
                                }  
                            }
                            planesBeforeMap.delete(str)
                        } else {
                            polygonColorMap.set(color, old - 1)
                        }
                        
                    }
                }
            })

            if (this.gaussianPlanes.hasSolution) {
                //draw dot at solution
                this.graph.drawDotFromVector(this.gaussianPlanes.solution, "pink", "black", 6)
            }
        }

    }

    // getObjectClass(object) {
    //     if (typeof object != "object") {
    //         throw new Error("not an object!!")
    //     }
    //     return object.constructor.name
    // }
    

    /**
     * sorts record of polygons by smallest to largest minimum Z value
     * then for all polygons with same minimum Z, sorts by smallest to largest maximum Z value
     * @param {Polygon[]} polygons a list of polygons
     *                    wherre Polygon is a Polygon Object, and minZ, maxZ are numerical values
     * @returns {Polygon[]} a sorted array of the input records, first by minZ then by maxZ
     */
    sortPolygons(polygons) {
        const numericPrecision = this.precision
        let sortedPolygons = polygons.sort(function(a, b) {
            
            let aClass = a.constructor.name
            let bClass = b.constructor.name

            if (!numEqual(a.minZ, b.minZ, numericPrecision)) {
                return a.minZ - b.minZ
            } else if (!numEqual(a.maxZ, b.maxZ, numericPrecision)) {
                return a.maxZ - b.maxZ
            } else { 
                for (let i = 0; i < a.lines.length; i++) {
                    let pointA = a.lines[i].point1
                    for (let j = 0; j < b.lines.length; j++) {
                        let pointB = b.lines[j].point1
                        if (vectorEquals([pointA[0], pointA[1]], [pointB[0], pointB[1]], numericPrecision) && 
                            !numEqual(pointA[2], pointB[2], numericPrecision)) {
                                return pointA[2] - pointB[2]
                        }
                    }
                }
                
                return 0
            }
        })

        return sortedPolygons
    }
    
}

/**
 * 
 * @param {Number[][]} matrix row col format matrix
 * @param {Number} row 
 * @returns {Number} index of the leftmost nonzero element in row of matrix
 */
function leftMostNonZeroInRowStd(matrix, row) {
    let col = 0
    while (col < matrix[row].length) {
        if (matrix[row][col] != 0) {
            return col;
        }
        col++
    }
    return col
}

class GridLinesDepth {
    constructor(graph, gaussianPlanes) {
        this.graph = graph
        this.gridSize = 10
        this.gaussianPlanes = gaussianPlanes
        

        //lighter grid lines
        this.colorLight     = "black"//"#E6E6E3"
        this.lineWidthLight = 6//2
        
        //darker grid lines
        this.colorDark      = "black"//"#BFBFBD"
        this.lineWidthDark  = 6//3
    }

    getGridLines() {
        let gridLines = []
        //debugger
        if (false) {
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
                this.getHalfAxisGridInfLines(gridLines, true, xBasis,yBasis, iters, div)
                this.getHalfAxisGridInfLines(gridLines, false, neg_xBasis,yBasis, iters, div)
                this.getHalfAxisGridInfLines(gridLines, true, yBasis, xBasis, iters, div)
                this.getHalfAxisGridInfLines(gridLines, false, neg_yBasis, xBasis, iters, div)
            }
        } else {
            //debugger
            // there are gridSize lines on each half axis
            let gridSize = this.gridSize
            //this.graph.drawPointToPoint([3,3, 0], [10,3, 0], "green", 3)
    
            // let xAxisVec = this.changeBasisZoomAndRotate([gridSize,0,0])
            // let yAxisVec = this.changeBasisZoomAndRotate([0,gridSize,0])
            
            for (let i = 10; i < gridSize + 1; i+=10) {
                let currentColor = this.colorLight
                let lineWidth    = this.lineWidthLight 
                let ctx = this.graph.ctx
    
                if (i % 5 == 0) {
                    currentColor = this.colorDark
                    lineWidth    = this.lineWidthDark
                }
                // xy plane
                //on x axis drawing y axis grid lines
                //this.graph.drawPointToPoint([i, gridSize, 0], [i, -(gridSize), 0], currentColor, lineWidth)
                //debugger
                let line1 = new Line(this.graph, [i, gridSize, 0], [i, -(gridSize), 0], false)
                line1.color = "green"//currentColor
                line1.lineWdith = lineWidth
                gridLines.push(line1)

                // same on negative x axis
                //this.graph.drawPointToPoint([-i, gridSize, 0], [-i, -(gridSize), 0], currentColor, lineWidth)
                let line2 = new Line(this.graph, [-i, gridSize, 0], [-i, -(gridSize), 0], false)
                line2.color = "green"//currentColor
                line2.lineWdith = lineWidth
                gridLines.push(line2)
                                
                //on y axis drawing x axis grid lines
                //this.graph.drawPointToPoint([-(gridSize), i, 0], [gridSize,i, 0], currentColor, lineWidth)
                let line3 = new Line(this.graph, [-(gridSize), i, 0], [gridSize,i, 0], false)
                line3.color = "green"//currentColor
                line3.lineWdith = lineWidth
                gridLines.push(line3)

                //same as above on negative y axis
                //this.graph.drawPointToPoint([-(gridSize), -i, 0], [gridSize,-i, 0], currentColor, lineWidth)
                let line4 = new Line(this.graph, [-(gridSize), -i, 0], [gridSize,-i, 0], false)
                line4.color = "green"//currentColor
                line4.lineWdith = lineWidth
                gridLines.push(line4)
    
    
                // //xz plane
                // //on x axis drawing z axis grid lines
                // // this.graph.drawPointToPoint([i, 0, -(gridSize)], [i, 0, gridSize], currentColor, lineWidth)
                // let line5 = new Line(this.graph, [i, 0, -(gridSize)], [i, 0, gridSize], false)
                // line5.color = "red"//currentColor
                // line5.lineWdith = lineWidth
                // gridLines.push(line5)
                
                // // //same as above on negative x axis
                // // this.graph.drawPointToPoint([-i, 0, -(gridSize)], [-i, 0, gridSize], currentColor, lineWidth)
                // let line6 = new Line(this.graph, [-i, 0, -(gridSize)], [-i, 0, gridSize], false)
                // line6.color = "red"//currentColor
                // line6.lineWdith = lineWidth
                // gridLines.push(line6)

                // // //on z axis drawing x axis grid lines
                // // this.graph.drawPointToPoint([-(gridSize), 0, i], [gridSize, 0, i], currentColor, lineWidth)
                // let line7 = new Line(this.graph, [-(gridSize), 0, i], [gridSize, 0, i], false)
                // line7.color = "red"//currentColor
                // line7.lineWdith = lineWidth
                // gridLines.push(line7)

                // // //same as above on negative z axis
                // // this.graph.drawPointToPoint([-(gridSize), 0, -i], [gridSize, 0, -i], currentColor, lineWidth)
                // let line8 = new Line(this.graph, [-(gridSize), 0, -i], [gridSize, 0, -i], false)
                // line8.color = "red"//currentColor
                // line8.lineWdith = lineWidth
                // gridLines.push(line8)


                // // //yz plane
                // // //on y axis drawing x axis grid lines
                // // this.graph.drawPointToPoint([0, -(gridSize), i], [0, gridSize, i], currentColor, lineWidth)
                // let line9 = new Line(this.graph, [0, -(gridSize), i], [0, gridSize, i], false)
                // line9.color = "blue"//currentColor
                // line9.lineWdith = lineWidth
                // gridLines.push(line9)

                // // //same as above on negative y axis
                // // this.graph.drawPointToPoint([0, -(gridSize), -i], [0, gridSize,-i], currentColor, lineWidth)
                // let line10 = new Line(this.graph, [0, -(gridSize), -i], [0, gridSize,-i], false)
                // line10.color = "blue"//currentColor
                // line10.lineWdith = lineWidth
                // gridLines.push(line10)

                // // //on y axis drawing x axis grid lines
                // // this.graph.drawPointToPoint([0, i, -(gridSize)], [0, i, gridSize], currentColor, lineWidth)
                // let line11 = new Line(this.graph, [0, i, -(gridSize)], [0, i, gridSize], false)
                // line11.color = "blue"//currentColor
                // line11.lineWdith = lineWidth
                // gridLines.push(line11)

                // // //same as above on negative y axis
                // // this.graph.drawPointToPoint([0, -i, -(gridSize)], [0,-i, gridSize], currentColor, lineWidth)
                // let line12 = new Line(this.graph, [0, -i, -(gridSize)], [0,-i, gridSize], false)
                // line12.color = "blue"//currentColor
                // line12.lineWdith = lineWidth
                // gridLines.push(line12)
            }
    
        }
        //debugger
        let axisLength = 10// * this.graph.currentZoom
        let xp = new Line(this.graph, [0,0,0], [axisLength,0,0], false)
        let xn = new Line(this.graph, [0,0,0], [-axisLength,0,0], false)

        let yp = new Line(this.graph, [0,0,0], [0,axisLength,0], false)
        let yn = new Line(this.graph, [0,0,0], [0,-axisLength,0], false)

        let zp = new Line(this.graph, [0,0,0], [0,0,axisLength], false)
        let zn = new Line(this.graph, [0,0,0], [0,0,-axisLength], false)
        let axisColor = "black"
        xp.color = "blue"//axisColor
        xn.color = axisColor
        yp.color = "red"//axisColor
        yn.color = axisColor
        zp.color = "green"//axisColor
        zn.color = axisColor
        // xp.color = axisColor
        // xn.color = axisColor
        // yp.color = axisColor
        // yn.color = axisColor
        // zp.color = axisColor
        // zn.color = axisColor

        let axislineWidth = 6
        xp.lineWidth = axislineWidth
        xn.lineWidth = axislineWidth
        yp.lineWidth = axislineWidth
        yn.lineWidth = axislineWidth
        zp.lineWidth = axislineWidth
        zn.lineWidth = axislineWidth

        //gridLines = gridLines.concat([xp, xn, yp, yn, zp, zn])
        //gridLines = gridLines.push([xp, xn, yp, yn, zp, zn])

        //split on planes!!!
        if (this.gaussianPlanes != undefined) {
            let planes = []
            for (let i = 0; i < this.gaussianPlanes.planesStdForm.length; i++) {
                if (this.gaussianPlanes.planesToDraw[i]) {
                    planes.push(this.gaussianPlanes.planesStdForm[i])
                }
            }
            //debugger
            gridLines = this.splitGridLinesWithPlanes(gridLines, planes)
            
        }
        //console.log(gridLines.length)
        return gridLines
    }

    splitGridLinesWithPlanes(gridLines, planes) {
        let allLines = []
        for (let i = 0; i < gridLines.length; i++) {
            this._splitGridLinesHelper(gridLines[i], planes, 0, allLines)
        }
        return allLines
    }

    _splitGridLinesHelper(gridLine, planes, planeIndex, allLines) {
        if (planeIndex == planes.length) {
            allLines.push(gridLine)
        } else {
            let currPlane = planes[planeIndex]
            let currPlaneColor = this.gaussianPlanes.planeColors[planeIndex]
            if (currPlane == undefined) {
                debugger
            }
            let afterSplit = gridLine.splitWithPlane(currPlane, currPlaneColor)

            for (let i = 0; i < afterSplit.length; i++) {
                this._splitGridLinesHelper(afterSplit[i], planes, planeIndex + 1, allLines)
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
    getHalfAxisGridInfLines(gridLines, isPositiveAxis, axis, gridVector, iterations, divide) {
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
                let factor = 1 / (this.graph.scale * this.graph.currentZoom)
                let inverseMatrix = this._inverseRotate()
                if (lineCount % boxSize == 0) {
                    //this.graph.drawLine([startX, startY],[endX, endY], this.colorDark, this.lineWidthDark);
                    let point1 = scaleVector([startX - this.graph.centerX, this.graph.centerY - startY], factor)
                    let point2 = scaleVector([endX - this.graph.centerX,this.graph.centerY -  endY], factor)
                    point1 = matrixVectorMultiplication(inverseMatrix, point1)
                    point2 = matrixVectorMultiplication(inverseMatrix, point2)
                    gridLines.push(new Line(this.graph, point1, point2, false))

                    //startY = centerY - startY0
                    //startY0 = cetnerY - startY
                    //startX = centerX + startX0
                    
                    //do not want to add 0 4 times (once per half axis call)
                    // if (lineCount != 0) {
                    //     this._addGridNumber(x, y, axis, gridVector, isPositiveAxis)
                    // }
                } else {
                    //no labeling, just drawing light grid line
                    //this.graph.drawLine([startX, startY],[endX, endY], this.colorLight, this.lineWidthLight);
                    let point1 = scaleVector([startX - this.graph.centerX, this.graph.centerY - startY], factor)
                    let point2 = scaleVector([endX - this.graph.centerX, this.graph.centerY - endY], factor)
                    point1 = matrixVectorMultiplication(inverseMatrix, point1)
                    point2 = matrixVectorMultiplication(inverseMatrix, point2)
                    gridLines.push(new Line(this.graph, point1, point2, false))
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
     * 
     * @returns {Number[][]} the matrix that takes a rotated vector back to standard basis relative to graph
     */
    _inverseRotate() {
        let inverseBasisRotationMatrix = this.graph.zRotationMatrix
        inverseBasisRotationMatrix = matrixMultiplication(this.graph.xRotationMatrix, inverseBasisRotationMatrix)
        inverseBasisRotationMatrix = matrixMultiplication(this.graph.yRotationMatrix, inverseBasisRotationMatrix)
        inverseBasisRotationMatrix = transpose(inverseBasisRotationMatrix)
        return inverseBasisRotationMatrix
    }
}


