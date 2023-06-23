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
        
        this.Axis                 = new Axis(this)
        this.Grid                 = new Grid(this)
        this.showAxis                  = true
        this.showGrid                  = true
        this.infiniteAxis              = false
    }

    animate() {
        if (animating) {
             
        }
    }

    /**
     * zooms in graph view
     */
    zoomIn() {
        this.currentZoom = this.currentZoom * this.zoomIncrement 
    }

    /**
     * zooms out in graph view
     */
    zoomOut() {
        this.currentZoom =this.currentZoom / this.zoomIncrement 
    }

    /**
     * returns zoom to default 1x zoom
     */
    setDefaultZoom() {
        //should be animation back to default zoom
        this.currentZoom = 1
    }

    /**
     * adds new object to be displayed on the graph
     * @param {*} object can be a vector/grid/square/Axis
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
            if (this.xRotationMatrix == [[1,0,0],[0,1,0],[0,0,1]] && 
                this.yRotationMatrix == [[1,0,0],[0,1,0],[0,0,1]] &&
                this.zRotationMatrix == [[1,0,0],[0,1,0],[0,0,1]]) {
                    this.Grid.draw()
            } else {
                //make 3d definite grid
            }
            this.Grid.draw()
        }
        
        if (this.showAxis) {
            this.Axis.draw()
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
     * 
     * @param {*} point1 
     * @param {*} point2 
     * @param {*} color 
     * @param {*} lineWidth 
     */
    drawPointToPoint(point1, point2, color, lineWidth) {    
        // First apply the basis, then the applied matrix. Not sure if this is the correct order for all situations...
        point2 = this.changeBasisZoomAndRotate(point2)
        point1 = this.changeBasisZoomAndRotate(point1)
        
        let startX = this.centerX + (this.scale * point1[0])
        let startY = this.centerY - (this.scale * point1[1])
        
        let endX = this.centerX + (this.scale * point2[0])
        let endY = this.centerY - (this.scale * point2[1])
        
        
        //let diagonalLength = vectorLength([this.centerX, this.centerY])
        
        //need to scale vectors down for really long vectors when drawn on canvas
        //super long vectors may cause drawing issues
        // if (vectorLength(vector) > 2 * diagonalLength) {

        //     // let sortedIntersect = getGraphBoundaryEndpoints(this.centerX, this.centerY, vector, this);

        //     // let end1 = [sortedIntersect[0], sortedIntersect[1]]
        //     // let end2   = [sortedIntersect[2], sortedIntersect[3]]

        //     // console.log("(" + vector + "), (" + end1 + "), (" + end2 + ")")
            
        //     // if (Math.sign(vector[0]) == 1) {

        //     // }
        // }

        this.drawLine([startX, startY],[endX, endY], color, lineWidth)
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
    rotateAboutZ(theta) {
        let x_rotation = [Math.cos(theta), Math.sin(theta), 0 ]
        let y_rotation = [Math.sin(theta), Math.cos(theta), 0]
        let z_rotation = [0, 0, 1]
    
        this.zRotationMatrix = [x_rotation, y_rotation, z_rotation]
    }

    /**
     * 
     * @param {*} theta 
     */
    rotateAboutY(theta) {
        let x_rotation = [Math.cos(theta), 0, -1 * Math.sin(theta)]
        let y_rotation = [0, 1, 0]
        let z_rotation = [Math.sin(theta), 0, Math.cos(theta)]
        
        this.yRotationMatrix = [x_rotation, y_rotation, z_rotation]
    } 

    /**
     * 
     * @param {*} theta 
     */
    rotateAboutX(theta) {
        let x_rotation = [1, 0, 0]
        let y_rotation = [0, Math.cos(theta), Math.sin(theta)]
        let z_rotation = [0, -1 * Math.sin(theta), Math.cos(theta)]

        this.xRotationMatrix = [x_rotation, y_rotation, z_rotation]
    }

    /**
     * finds if a rotation in perspective has been applied to graph (non basis change)
     * @returns true if graph perspective has not been rotated
     */
    noRotation() {
        let identity = [[1,0,0],[0,1,0],[0,0,1]]
        return matrixEquals(this.xRotationMatrix, identity) && matrixEquals(this.yRotationMatrix, identity) && matrixEquals(this.zRotationMatrix, identity)
    }

    /**
     * 
     * @returns true if z axis is not directly facing front of graph
     */
    zVisible() {
        return !(this.basis[0][2] == 0 && this.basis[1][2] == 0)
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
    if (gridVector[0] === 0 && gridVector[1] === 0) {
        startX = x
        startY = y
        endX = x
        endY = y
    } else if (gridVector[0] === 0) {
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

