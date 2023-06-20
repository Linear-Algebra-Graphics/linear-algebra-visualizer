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
        this.centerX = this.canvas.width/2
        this.centerY = this.canvas.height/2
        this.drawnObjects = [];

        // This is the number of graph units from edge to edge. E.g if the canvas is 600x600px we want
        // the length of 20 units to be 600 px.
        this.numOfGraphUnitsEdgeToEdge = this.canvas.width / 80;
        this.scale                     = this.canvas.width / this.numOfGraphUnitsEdgeToEdge
        this.backgroundColor           = "white"
        // I matrix is default
        this.basis                     = [[1,0,0],[0,1,0],[0,0,1]]
        this.currentZoom               = 1
        this.zoomIncrement             = 1.1
        
        //only rotation...
        this.animateBasis
        this.animateAngles
        this.animateFinalAngles
        
        this.xRotationMatrix            = [[1,0,0],[0,1,0],[0,0,1]]
        this.yRotationMatrix            = [[1,0,0],[0,1,0],[0,0,1]]
        this.zRotationMatrix            = [[1,0,0],[0,1,0],[0,0,1]]

        //this.basis                     = [[Math.cos(Math.PI/4),Math.sin(Math.PI/4),0],[-1*Math.sin(Math.PI/4),Math.cos(Math.PI/4),0],[0,0,1]]
        
        this.graphAxis                 = new Axis(this)
        this.graphGrid                 = new Grid(this)
        this.showAxis                  = true
        this.showGrid                  = true
        this.infiniteAxis              = true
    }

    animate() {
        if (animating) {
             
        }
    }

    zoomIn() {
        this.currentZoom = this.currentZoom * this.zoomIncrement 
    }

    zoomOut() {
        this.currentZoom =this.currentZoom / this.zoomIncrement 
    }

    /**
     * returns zoom to default 1x
     */
    setDefaultZoom() {
        //should be animation back to default zoom
        this.currentZoom = 1
    }

    /**
     * adds new object to be displayed on the graph
     * @param {*} object can be a vector/grid/square/
     */
    addObject(object) {
        this.drawnObjects.push(object)
    }

    // Draws all objects in the queue and the grid / axis if they are enabled.
    draw() {
        // Clear screen / add background
        this.ctx.fillStyle = this.backgroundColor
        this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);

        if (this.showGrid) {
            this.graphGrid.draw()
        }
        
        if (this.showAxis) {
            this.graphAxis.draw()
        }
        
        // Draw all objects
        for(let i = 0; i < this.drawnObjects.length; i++) {
            this.drawnObjects[i].draw();
        }
    }
    
    /**
     * draws line from point1 to point2 on the graph canvas (standard) basis, 
     * does not shift to graph basis, and length unscaled
     * @param {*} point1 endpoint 1
     * @param {*} point2 endpoint 2
     * @param {*} color color of line
     * @param {*} lineWidth width of line
     */
    drawLine(point1, point2, color, lineWidth) {
        
        this.ctx.lineWidth = lineWidth
        this.ctx.strokeStyle = color

        this.ctx.beginPath()
            this.ctx.moveTo(point1[0], point1[1])
            this.ctx.lineTo(point2[0], point2[1])
        this.ctx.stroke()
    }

    /**
     * draws line from the endpoint of vector 1 to the endpoint of vector 2
     * draws in the basis, zoom, and current rotation of graph, as well as scaled to length
     * where vector = (a, b) has endpoints (a, b)
     * @param {*} vector1 first endpoint
     * @param {*} vector2 second endpoint
     * @param {*} color color of vector
     * @param {*} inBasis if true, draws vector in current graph basis, else draws in standard basis
     * @param {*} lineWidth line width to draw the vector
     */
    drawLineFromVectors(vector1, vector2, color, lineWidth) {    
        // First apply the basis, then the applied matrix. Not sure if this is the correct order for all situations...
        vector1 = this.changeBasisZoomAndRotate(vector1)
        vector2 = this.changeBasisZoomAndRotate(vector2)

        let vec1X = this.centerX + this.scale * vector1[0]
        let vec1Y = this.centerY - this.scale * vector1[1]

        let vec2X = this.centerX + this.scale * vector2[0]
        let vec2Y = this.centerY - this.scale * vector2[1]

        this.drawLine([vec1X, vec1Y],[vec2X, vec2Y], color, lineWidth)
    }

    
    /**
     * draws a dot at the endpoint of given vector
     * @param {*} vector vector on which to draw
     * @param {*} color color of dot
     * @param {*} size radius of dot
     */
    drawDotFromVector(vector, color, size) {
        vector = this.changeBasisZoomAndRotate(vector)

        let vecX = this.centerX + this.scale * vector[0]
        let vecY = this.centerY - this.scale * vector[1]

        // Draw the dot
        this.ctx.fillStyle = color
        this.ctx.strokeStyle = color
        this.ctx.beginPath();
            this.ctx.arc(vecX, vecY, 1, 0, 2 * Math.PI);
            this.ctx.fill();
        this.ctx.stroke();
    }

    /**
     * Updates the given vectors basis, rotation, and zoom, to match the graph
     * @param {*} vector vector to operate on
     * @returns vector in terms of current 
     *          basis and zoom of the graph relative to the canvas
     */
    changeBasisZoomAndRotate(vector) {
        let updatedVector = matrixVectorMultiplication(this.basis, vector)
        
        updatedVector     = matrixVectorMultiplication(this.xRotationMatrix, updatedVector)
        updatedVector     = matrixVectorMultiplication(this.yRotationMatrix, updatedVector)
        updatedVector     = matrixVectorMultiplication(this.zRotationMatrix, updatedVector)

        updatedVector     = matrixVectorMultiplication([[this.currentZoom, 0, 0],[0, this.currentZoom, 0],[0, 0, this.currentZoom]], updatedVector)
        return updatedVector
    }
    
    /**
     * 
     * @param {*} theta 
     */
    rotateZ(theta) {
        let x_rotation = [Math.cos(theta), Math.sin(theta), 0 ]
        let y_rotation = [Math.cos(theta+Math.PI/2), Math.sin(theta+Math.PI/2), 0]
        let z_rotation = [0, 0, 1]

        this.zRotationMatrix = [x_rotation, y_rotation, z_rotation]

    }

    /**
     * 
     * @param {*} theta 
     */
    rotateY(theta) {
        let x_rotation = [Math.cos(theta), 0, -1 * Math.sin(theta)]
        let y_rotation = [0, 1, 0]
        let z_rotation = [Math.sin(theta), 0, Math.cos(theta)]
        
        this.yRotationMatrix = [x_rotation, y_rotation, z_rotation]
    } 

    /**
     * 
     * @param {*} theta 
     */
    rotateX(theta) {
        let x_rotation = [1, 0, 0]
        let y_rotation = [0, Math.cos(theta), Math.sin(theta)]
        let z_rotation = [0, -1 * Math.sin(theta), Math.cos(theta)]

        this.xRotationMatrix = [x_rotation, y_rotation, z_rotation]
    } 

}

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
        this._xAxis = new Vector(this.graph, [10,0,0], "blue", this.lineWidth, false)
        this._yAxis = new Vector(this.graph, [0,10,0], "red", this.lineWidth, false)
        this._zAxis = new Vector(this.graph, [0,0,10], "green", this.lineWidth, false)
        
        this._xAxisNeg = new Vector(this.graph, [-10,0,0], "blue", this.lineWidth, false)
        this._yAxisNeg = new Vector(this.graph, [0,-10,0], "red", this.lineWidth, false)
        this._zAxisNeg = new Vector(this.graph, [0,0,-10], "green", this.lineWidth, false)
    
        // Default
        this.fullAxis     = true
        this.zeroZeroDot  = true
    }
    
    /**
     * draws x, y, z axis
     */
    draw() {

        if(this.graph.infiniteAxis === false) {
            if (this.fullAxis) {
                this._xAxisNeg.draw()
                this._yAxisNeg.draw()
                this._zAxisNeg.draw()
            }
            this._xAxis.draw()
            this._yAxis.draw()
            this._zAxis.draw()

       } else {
            let xBasis = this.graph.changeBasisZoomAndRotate([1,0,0]);
            let yBasis = this.graph.changeBasisZoomAndRotate([0,1,0]);

            let sortedIntersectX = getGraphBoundaryEndpoints(this.graph.centerX, this.graph.centerY, xBasis, this.graph);
            let sortedIntersectY = getGraphBoundaryEndpoints(this.graph.centerX, this.graph.centerY, yBasis, this.graph);

            let xStart = [sortedIntersectX[0], sortedIntersectX[1]]
            let xEnd   = [sortedIntersectX[2], sortedIntersectX[3]]

            let yStart = [sortedIntersectY[0], sortedIntersectY[1]]
            let yEnd   = [sortedIntersectY[2], sortedIntersectY[3]]

            this.graph.drawLine(xStart, xEnd, "blue", this.lineWidth)
            this.graph.drawLine(yStart, yEnd, "red", this.lineWidth)
       }
       
       if (this.zeroZeroDot) {
            // puts a dot at (0, 0)
            this.graph.ctx.fillStyle = "black"
            this.graph.ctx.strokeStyle = "black"
            this.graph.ctx.beginPath();
                this.graph.ctx.arc(this.graph.centerX, this.graph.centerY, 5, 0, 2 * Math.PI);
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



class Vector {
    /**
     * creates an instance of a vector
     * @param {*} graph graph on which vector is drawn
     * @param {*} cords coordinates (x, y, z) of vector
     * @param {*} color color of vector
     * @param {*} arrow true if vector has arrow at the end
     */
    constructor(graph, cords, color, lineWidth, arrow){
        this.graph     = graph
        this.cords     = cords
        this.color     = color
        this.lineWidth = lineWidth
        this.arrow     = arrow
    }

    /**
     * draws the vector on the graph
     */
    draw() {

        this.graph.drawLineFromVectors([0, 0, 0], this.cords, this.color, this.lineWidth)

        if(this.arrow) {
            let arrowLength = .3
            let inBasisCords = this.graph.changeBasisZoomAndRotate(this.cords)

            let vectorLength = Math.abs( Math.sqrt( Math.pow(inBasisCords[0], 2) + Math.pow(inBasisCords[1], 2) + Math.pow(inBasisCords[2], 2)) )
            let inverseNormalizedVectorButThenScaledToCorrectLength = [arrowLength * -1 * (1/vectorLength) * inBasisCords[0], arrowLength * -1 * (1/vectorLength) * inBasisCords[1], arrowLength * -1 * (1/vectorLength) * inBasisCords[2]]
            
            //angle of the arrow head to line
            let headAngle = Math.PI/6;

            // Both xy rotations with theta=45deg and theta=-45deg
            let rotationMatrix1 = [[Math.cos(headAngle), Math.sin(headAngle), 0], [-1 * Math.sin(headAngle), Math.cos(headAngle), 0], [0, 0, 1]]
            let rotationMatrix2 = [[Math.cos((2*Math.PI) - headAngle), Math.sin((2*Math.PI) - headAngle), 0], [-1 * Math.sin((2*Math.PI) - headAngle), Math.cos((2*Math.PI) - headAngle), 0], [0, 0, 1]]
            
            let arrow1 = matrixVectorMultiplication(rotationMatrix1, inverseNormalizedVectorButThenScaledToCorrectLength)
            let arrow2 = matrixVectorMultiplication(rotationMatrix2, inverseNormalizedVectorButThenScaledToCorrectLength)

            //want to add onto this.cords here because this is still in vector notation, 
            //so no need to subtract the ys as that is taken care of in drawLine
            this.drawArrowLine(inBasisCords, [inBasisCords[0] + arrow1[0], inBasisCords[1] + arrow1[1], 0], this.color, this.lineWidth)
            this.drawArrowLine(inBasisCords, [inBasisCords[0] + arrow2[0], inBasisCords[1] + arrow2[1], 0], this.color, this.lineWidth)

        }

        this.graph.drawDotFromVector(this.cords, this.color, 1)
    }

    /**
     * draws line from endpoint of vector 1 to endpoint of vector 2
     * w.r.t the standard (nontransformed) basis
     * @param {*} vector1 
     * @param {*} vector2 
     * @param {*} color 
     * @param {*} lineWidth 
     */
    drawArrowLine(vector1, vector2, color, lineWidth) {    
        // First apply the basis, then the applied matrix. Not sure if this is the correct order for all situations...

        let vec1X = this.graph.centerX + this.graph.scale * vector1[0]
        let vec1Y = this.graph.centerY - this.graph.scale * vector1[1]

        let vec2X = this.graph.centerX + this.graph.scale * vector2[0]
        let vec2Y = this.graph.centerY - this.graph.scale * vector2[1]

        this.graph.drawLine([vec1X, vec1Y],[vec2X, vec2Y], color, lineWidth)
    }
}

class Grid {
    constructor(graph){
        this.graph = graph
    }

    /**
     * 
     */
    draw() {
        // Need to decide if where we want to changeBasis andd zoom, in functions, or outside functions?
        let xBasis = this.graph.changeBasisZoomAndRotate([1,0,0]);
        let yBasis = this.graph.changeBasisZoomAndRotate([0,1,0]);

        let neg_xBasis = this.graph.changeBasisZoomAndRotate([-1,0,0]);
        let neg_yBasis = this.graph.changeBasisZoomAndRotate([0,-1,0]);
        
        // Point slope formula
            // y+y1 = m(x-x1)
            // y = m(x-x1)+y1
            // y = mx-mx1+y1
            // y = mx + (y1-mx1)
            // y = mx + b
            // b = (y1-mx1)

        this.drawHalfAxisGrid(xBasis,yBasis)
        this.drawHalfAxisGrid(neg_xBasis,yBasis)
        this.drawHalfAxisGrid(yBasis, xBasis)
        this.drawHalfAxisGrid(neg_yBasis, xBasis)
    }
    
    /**
     * draws grid lines along half of an axis, in the direction of the vector axis
     * each grid line is defined by the vector gridVector
     * @param {*} axis xBasis originally 
     * @param {*} gridVector vector defining grid lines
     */
    drawHalfAxisGrid(axis, gridVector) {
        let x = this.graph.centerX
        let y = this.graph.centerY

        let keepGoing = true
        let lineCount = 0

        while (keepGoing) {

            let endPoints = getGraphBoundaryEndpoints(x, y, gridVector, this.graph)

            let startX = endPoints[0]
            let startY = endPoints[1]
            let endX = endPoints[2]
            let endY = endPoints[3]
            // Biggest grid spacing should be the default number we start with
            // Smallest grid spacing should be 2 times the default


            // This means the two minimum points are outside the canvas. This means that we do not need to draw the lines anymore so we break the loop.
            if (!outSideCanvas(this.graph, [startX, startY]) || !outSideCanvas(this.graph, [endX, endY])) {
                // Make every fith line dark
                if (lineCount % 5 == 0) {
                    // this.graph.ctx.fillStyle = "black"
                    // this.graph.ctx.font = "40px monospace";
                    // this.graph.ctx.fillText(("(" + ", " + ")"), x+10, y-20);
                    this.graph.drawLine([startX, startY],[endX, endY], "black", 3);
                } else {
                    this.graph.drawLine([startX, startY],[endX, endY], "gray", 1);
                }
                
                x += this.graph.scale * axis[0]
                y -= this.graph.scale * axis[1]

            } else {
                keepGoing = false
            }
            lineCount++
        }
    }
}

/**
 * gridVector and x y define a line y = mx + b
 *  
 * returns an array [startX, startY, endX, endY] that are the two
 * end points (startX, startY, endX, endY) of the line y = mx+b that intersect with 
 * the graph boundary
 *  
 * @param {*} x x coordinate of a point on the line
 * @param {*} y y coordinate of a point on the line
 * @param {*} gridVector [deltaX, deltaY] defining slope of line
 * @param {*} graph the graph whose boundaries lines are to intersect with given line
 * @returns the array [startX, startY, endX, endY]
 */
function getGraphBoundaryEndpoints(x, y, gridVector, graph) {
    let startX, startY, endX, endY //points to draw from and to
    // First check if the lines are paralel to get rid of the edge case.
    if (gridVector[0] === 0) {
        //parrallel with y axis case
        startX = x
        startY = graph.canvas.height
        endX   = x
        endY   = 0
    } else if (gridVector[1]  === 0) {
        //parrallel with x axis case
        startX = 0
        startY = y
        endX   = graph.canvas.width
        endY   = y
    } else {
        // IF WE ARE HERE THERE 4 POINTS
        //calculate and compare 4 points THERE IS NO NULL POINT

        //case ensures that line will always intersect with all 
        //four lines defining boundaries of mxn canvas
        //console.log("3")
        //y - y1 = m(x - x1)
        //
        let x1 = x + gridVector[0]
        let y1 = y - gridVector[1]

        //need to deal with vertical line case
        let m  = (-1*gridVector[1]) / (gridVector[0])
        let b  = y1 - (m * x1)
        // console.log("m: " + m)
        // console.log("y: " + yBasis[1] + " x: " + yBasis[0])

        let point1 = [0, getYIntersept(0, m, b)]
        let point2 = [graph.canvas.width, getYIntersept(graph.canvas.width, m, b)]

        let point3 = [getXIntersept(0, m, b), 0]
        let point4 = [getXIntersept(graph.canvas.height, m, b), graph.canvas.height]

        let dis_point1 = [distToGraphCenter(graph, point1), point1]
        let dis_point2 = [distToGraphCenter(graph, point2), point2]
        let dis_point3 = [distToGraphCenter(graph, point3), point3]
        let dis_point4 = [distToGraphCenter(graph, point4), point4]

        // Either is empty or two points.
        let pointsOnCanvas = findTwoClosesPoints([dis_point1, dis_point2, dis_point3, dis_point4])

        // If there are no points on canvas end the loop.
        startX = pointsOnCanvas[0][0]
        startY = pointsOnCanvas[0][1]
        endX   = pointsOnCanvas[1][0]
        endY   = pointsOnCanvas[1][1]
    }
    return [startX, startY, endX, endY]
}


/**
 * returns the length of a vector
 * @param {*} vector the vector in question
 * @returns length of vector
 */
function vectorLength(vector) {
    return Math.abs( Math.sqrt( Math.pow(vector[0], 2) + Math.pow(vector[1], 2)) )
}

/**
 * finds if point is outside the graph canvas or not
 * @param {*} graph graph whose canvas the point is evaluated on
 * @param {*} point point to check for outside canvas
 * @returns true if outside graph canvas, else false
 */
function outSideCanvas(graph, point) {
    return (point[0] < 0 || point[0] > graph.canvas.width) || (point[1] < 0 || point[1] > graph.canvas.height)
}

/**
 * returns the euclidean distance from point to the graph center
 * @param {*} graph graph in question
 * @param {*} point point to get distance of
 * @returns distance of point to graph center
 */
function distToGraphCenter(graph, point) {
    let x = graph.centerX
    let y = graph.centerY
    return Math.abs( Math.sqrt( Math.pow(point[0] - x, 2) + Math.pow(point[1] - y, 2)) )
}

/**
 * sorts input array in ascending order by first element
 * @param {*} dis_points an array where the first element is a distance, and the second a point (x, y)
 * @returns the sorted array
 */
function findTwoClosesPoints(dis_points) {
    let twoClosestPoints = dis_points.sort(function(a, b) {return a[0] - b[0]})
    return [twoClosestPoints[0][1], twoClosestPoints[1][1]]
}


/**
 * returns y when given x for y = mx + b
 * @param {*} x number x value
 * @param {*} m slope of line
 * @param {*} b y intersect
 * @returns y coordinate at x of the line
 * @requires that m is a valid slope, ie no vertical lines
 */
function getYIntersept(x, m, b) { 
    return (m * x) + b
}


/**
 * gets x when given y using y = mx+b
 * @param {*} y number y value
 * @param {*} m slope of line
 * @param {*} b y intersect
 * @returns x coordinate at y of the line
 * @requires that m is a valid slope, ie no vertical lines
 */
function getXIntersept(y, m, b) {
    return (y - b) / m
}