/**
 * IDEA! find polygons by getting all individual lines from planes and intersections, then 
 * recursive down each half and keep splitting until not splittable, the not splittable result is 
 * a single polygon????
 * 
 * then apply painters algorithm and boom boom boom....??!!
 * 
 * 
 * 
 * I THINK theres is max 22 polygons in this overlap..., so can initilize size 22 array for speed in graph
 * 
 * need to get overall outline of all plane intersections
 * perhaps find all intersecting points, then sort by distance from center point. 
 * you then begin with 3 smallest distance points, and add points to set,
 * if the added point is already within the polygon enclosed by the set, then do not add, else add
 * 
 * lines defining polygon must not be infinite, need start and end point, info (ez get from vertices)
 * 
 * 
 * you know what if we recursived down each plane, and used its intersect lines with the other planes as split reference? <= seems goodd....
 * yes this is the plan
 * 
 * 1) recursively reduce each plane into its splitted polygons, using set of all lines defined by other planes
 *      a) each subpolygon must keep its color information
 *      b) each polygon must keep track of its lowest z value point
 * 2) compile all polygons from planes, and sort w.r.t z values, 
 * 3) iterate through list of polygons, drawing in order of most to least distance to viewer in 3d
 * 
 * 
 * IDEA REVISED:
 * 1) find 4 endpoints for all planes
 * 2) find all intersections lines between planes
 * 3) call algorithm(plane1, [intersections with plane2, plane3]), repeat for plane2, plane3 -> returns list of polygons
 *     a) We now have 4 points for edges of plane also UP TO two intersection lines
 *     b) take first intersect line in list, call splitpolygon() which will return two polygons. Then with second line split those two polygons again
 *     c) repeat until list of intersect lines is empty
 *     d) add polygon to return list
 * 4) compile all polygons
 * 5) sort by lowest z coordinate
 * 6) draw in order
 * 
 * Ignore everything above
 */


//ERROR RIDDEN CONVOLUTED CUBE ONE
/** may the flickering leave this class alone */ 
class GaussianPlanes {
    /**
     * creates a new instance of the planes defined by a augmentted matrix system
     * @param {*} graph the graph on which the planes exist
     * @param {Number[][]} planesStdForm an array of planes defined as [a, b, c, d] => ax + by + cz = d
     * @param {String[]} planeColors array of the plane colors in order
     * @param {Boolean} cubeBoundPlanes determines if the planes are bounded by a cube or not
     */
    constructor(graph, planesStdForm, planeColors, cubeBoundPlanes) {
        this.graph = graph
        this.planesStdForm = planesStdForm
        this.planeColors = planeColors
        this.cubeBoundPlanes = cubeBoundPlanes

        this.planeOrderFromInput = Array.from(Array(planesStdForm.length).keys());

        let reduced = gaussianEliminationV3(transpose(this.planesStdForm), false, false)
        this.solution = [reduced[reduced.length - 1][0], reduced[reduced.length - 1][1], reduced[reduced.length - 1][2]]
        let matrix = transpose(planesStdForm)

        this.hasSolution = this._hasSolution(reduced)
        this.planeCenter = this._findPlaneCenters(matrix)

        // boolean array of the size of the number of rows in the augmented matrix, indicates if row is to be drawn or not
        this.planesToDraw = new Array(this.planesStdForm.length).fill(true)

        //floating point this.precision => 1e-this.precision
        this.precision = 7
        this.cubeHalfSideLength = 6
    }

    _findPlaneCenters(matrix) {
        let planeCenter = new Array(this.planesStdForm.length)//.fill(new Array(3).fill(0)) //why does this not work??!!!!
        for (let i = 0; i < planeCenter.length; i++) {
            planeCenter[i] = new Array(3);
            for (let j = 0; j < 3; j++) {
                planeCenter[i][j] = 0
            }
        }
        
        if (this.hasSolution) {
            for (let i = 0; i < planeCenter.length; i++) {
                planeCenter[i] = this.solution
            }
        } else {
            for (let i = 0; i < matrix[0].length; i++) {
                let col = leftMostNonZeroInRow(matrix, i)
                if (col < matrix.length - 1) {
                    planeCenter[i][col] = matrix[matrix.length - 1][i] / matrix[col][i]
                }
            }
        }
        return planeCenter
    }

    _hasSolution(reduced) {
        let hasSolution = true
        //see if a solution 
        for (let i = 0; i < reduced[0].length; i++) {
            let col = leftMostNonZeroInRow(reduced, i)
            if (col == reduced.length - 1) {
                hasSolution = false
                break
            }
        }
        return hasSolution
    }

    /**
     * splits all planes defined by the list of stdForm planes 
     * @param {Line[]} polygonLines the lines of the current polygon, is an array of Line Objects
     * @param {Line[]} intersectLines an array of Line Objects that may intersect with polygonLines
     * @param {String} color the color in any representation
     * @param {Number} alpha a numerical value such that  0 <= alpha <= 1
     * @returns {Polygon[]} an array of all polygons from splitting on all intersectLines
     */
    splitPlanes(polygonLines, intersectLines, fillColor, outlineColor, alpha) {
        let output = []
        this._splitPlanesHelper(polygonLines, intersectLines, 0, output, fillColor, outlineColor, alpha)
        return output
    }

    //helper recursive function
    _splitPlanesHelper(polygonLines, intersectLines, intersectLinesIndex, output, fillColor, outlineColor, alpha) {
        if (intersectLines.length == 0 || intersectLinesIndex == intersectLines.length ) {
            //base case, there are no intersection lines, so no more splits can be found
            //now return the current polygonLines as a polygon in output
            let polygon = new Polygon(this.graph, polygonLines, fillColor, outlineColor, alpha)
            polygon.fill = true
            polygon.outline = false
            output.push(polygon)

        } else {
            //recursive case

            //current line to check for intersect with all polygonLines
            let interesectLine = intersectLines[intersectLinesIndex]
            //contains lines where key: point1, value = line(point1, point2, inf)
            //has all lines of the polygon after all line splits by intersections
            let linesWithSplit = new Map()
            
            // the last pair of lines that are created from a split
            let splitLinesRef = [] 
            // all points on which a line in the polygon is split 
            // should always be 2 of these exactly, unless it is a case like standard view, where some planes are not split
            let foundSplitPoints = [] 

            //for all lines in shape check for intersection, split if intersects
            for (let i = 0; i < polygonLines.length; i++) {
                //debugger
                let splitLines = polygonLines[i].splitWithLine2D(interesectLine)
                if (splitLines.length != 0) {
                    let splitPt1 = splitLines[0].point1
                    let splitPt2 = splitLines[1].point1
                    
                    if (vectorEquals(splitLines[0].point1, splitLines[0].point2, this.precision) || 
                        vectorEquals(splitLines[1].point1, splitLines[1].point2, this.precision)) {
                            //case where intersect point is the exact endpoint of a line
                            if (vectorEquals(splitLines[0].point1, splitLines[0].point2, this.precision)) {
                                linesWithSplit.set(pt3DToStr(splitLines[0].point1), splitLines[1])
                            } else {
                                linesWithSplit.set(pt3DToStr(splitPt1), new Line(this.graph, splitPt1, splitLines[1].point2, splitLines[0].inf))
                            }
                    } else {
                        linesWithSplit.set(pt3DToStr(splitPt1), splitLines[0])
                        linesWithSplit.set(pt3DToStr(splitPt2), splitLines[1])
                    }
                    
                    //keep track of this for traversal to get two polygons
                    splitLinesRef = splitLines
                    foundSplitPoints.push(splitLines[0].point2)
                } else {
                    linesWithSplit.set(pt3DToStr(polygonLines[i].point1), polygonLines[i])
                }
            }

            // This means the line intersects at a corner resulting in 4 points.
            // We cut it down to two because all others are duplicates
            let splitPoints = foundSplitPoints
            //check if there are two intersects, if true this means a valid split is found
            if (foundSplitPoints.length > 2) {
                // we know that dupes are always next to each other because of the order of the
                // lines in a polygon

                // aabb, abb, aab, abba, aba
                if (vectorEquals(foundSplitPoints[0], foundSplitPoints[1], this.precision)) {  
                    splitPoints = [foundSplitPoints[0], foundSplitPoints[foundSplitPoints.length - 1]]
                } else {
                    if (vectorEquals(foundSplitPoints[0], foundSplitPoints[foundSplitPoints.length - 1], this.precision)) {
                        splitPoints = [foundSplitPoints[1], foundSplitPoints[foundSplitPoints.length - 1]]
                    } else {
                        splitPoints = [foundSplitPoints[0], foundSplitPoints[foundSplitPoints.length - 1]]
                    }
                }
            }

            //if there are two distinct split points we know it is a valid split
            if (splitPoints.length == 2 && !vectorEquals([splitPoints[0][0], splitPoints[0][1]], [splitPoints[1][0],splitPoints[1][1]], this.precision)) {
                //case where line does not split plane, ie standard view for example
                //create two new shapes defined by lines.
                let leftPolygonLines = new Array()
                let rightPolygonLines = new Array()
                
                let currPoint = splitLinesRef[0].point2

                //check if one of lines is length 0, ie start end are the same point
                if (vectorEquals(splitLinesRef[0].point1, splitLinesRef[0].point2, this.precision) || 
                    vectorEquals(splitLinesRef[1].point1, splitLinesRef[1].point2, this.precision)) {
                        //case where intersect point is the exact endpoint of a line
                        if (vectorEquals(splitLinesRef[0].point1, splitLinesRef[0].point2, this.precision)) {
                            currPoint = splitLinesRef[0].point1
                        } else {
                            currPoint = splitLinesRef[1].point2
                        }
                }

                // populate lefPolygonLines
                let i = 0
                while (!vectorEquals(currPoint, splitPoints[0], this.precision)) {
                    i++
                    leftPolygonLines.push(linesWithSplit.get(pt3DToStr(currPoint)))
                    if (linesWithSplit.get(pt3DToStr(currPoint)) == undefined) {
                        debugger
                    }
                    currPoint = linesWithSplit.get(pt3DToStr(currPoint)).point2
                }
                leftPolygonLines.push(new Line(this.graph, currPoint, splitPoints[1], false))

                // populate rightPolygonLines
                i = 0
                while (!vectorEquals(currPoint, splitPoints[1], this.precision)) {
                    i++
                    rightPolygonLines.push(linesWithSplit.get(pt3DToStr(currPoint)))
                    currPoint = linesWithSplit.get(pt3DToStr(currPoint)).point2
                }
                
                rightPolygonLines.push(new Line(this.graph, currPoint, splitPoints[0], false))

                //valid split recursive calls
                intersectLinesIndex = intersectLinesIndex + 1  

                //sanity check for length > 2 (valid polygon must have >= 3 lines defining it)
                //a length of two is possible potentialy if intersect line is one of the lines of the polygon
                if (leftPolygonLines.length > 2) {
                    this._splitPlanesHelper(leftPolygonLines, intersectLines, intersectLinesIndex, output, fillColor, outlineColor, alpha)
                }
                if (rightPolygonLines.length > 2) {
                    this._splitPlanesHelper(rightPolygonLines, intersectLines, intersectLinesIndex, output, fillColor, outlineColor, alpha)
                }
            } else {
                //no valid split recursive call
                intersectLinesIndex = intersectLinesIndex + 1
                this._splitPlanesHelper(polygonLines, intersectLines, intersectLinesIndex, output, fillColor, outlineColor, alpha)
            }
        }
    }

    //plane is defined by (a, b, c, d) => ax + by + cz = d, rn it is only (a, b, c) for simplicity
    /**
     * find the line of intersection between two 2D planes
     * @param {Number[]} plane1 normal vector [a, b, c]
     * @param {Number[]} plane2 normal vector [a, b, c]
     * @requires : both planes are of the same dimension, R3 only rn
     * @returns {Line | null} the intersection line
     */
    getPlanePlaneIntersectLine(plane1, plane2) {
        //debugger
        if (plane1.length != plane2.length) {
            throw new Error("planes must be same dimension!")
        }

        // calculate crossproduct => vector perp to both normals => intersetion vector
        // u x v = (u2v3 - u3v2, u3v1-u1v3, u1v2-u2v1)
        let intersectVector = this.planePlaneIntersectVector3D(plane1, plane2)

        //find a point of intersection between two planes
        //[a,b,c,d]
        let reducedEchelon = gaussianEliminationV3(transpose([plane1, plane2]), false, false)

        let point1 = new Array(3)
        let point2 = new Array(3)
        for (let i = 0; i < 3; i++) {
            point1[i] = 0
            point2[i] = 0
        }

        //go through reduced row echelon form to get a solution
        for (let row = 0; row < 2; row++) {
            let col = 0
            while (col < 3 && reducedEchelon[col][row] == 0) {
                col++
            }

            if (col == 3) {
                // no solution
                return null
            } else if (col != 3) {
                //console.log("should be 1: " + reducedEchelon[col][row])
                point1[col] = reducedEchelon[reducedEchelon.length - 1][row]
            }
        }
        //debugger

        for (let i = 0; i < 3; i++) {
            point2[i] = point1[i] + intersectVector[i]
        }

        //intersection line is infinite length
        return new Line(this.graph, point1, point2, true)
    }

    /**
     * takes a line and applies basis and rotation of the graph to the line
     * @param {Line} line 
     * @modifies line.point1 and line.point2
     */
    _changeBasisAndRotate3DLine(line) {
        line.point1 = this.graph.changeBasisAndRotate(line.point1)
        line.point2 = this.graph.changeBasisAndRotate(line.point2)
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

    getFixedSizePlaneLines(planeLength) {
        let planeLines = []

        //get othonormal basis of two lines per plane 
        for (let i = 0; i < this.planesStdForm.length; i++) {
            let currPlaneLines = this.getPlaneLines(this.planesStdForm[i], planeLength / this.graph.currentZoom, this.planeCenter[this.planeOrderFromInput[i]])
            planeLines.push(currPlaneLines)

            for (let j = 0; j < currPlaneLines.length; j++) {
                this._changeBasisAndRotate3DLine(currPlaneLines[j])
            }
        }
        return planeLines
    }

    /**
     * 
     * @param {Number} cubeSize half the sidelength of the cube
     * @param {Number[][]} cubePlanesStdForm standard forms of all 6 sides of the cube
     * @returns {Line[][]} each index has an array of lines defining one gaussian plane
     */
    getCubeBoundedPlaneLines(cubeSize, cubePlanesStdForm) {
        let planeLines = []

        //get orthonormal basis of two lines per plane 
        for (let i = 0; i < this.planesStdForm.length; i++) {
            //we are using max of width and height as the plane size rn just so they are sufficiently large to a cube around the grid
            let currPlaneLines = this.getPlaneLines(this.planesStdForm[i], 
                                               Math.max(this.graph.canvas.width, this.graph.canvas.height) / this.graph.currentZoom, 
                                               this.planeCenter[this.planeOrderFromInput[i]])
            if (currPlaneLines.length != 0) {
                //bring to basis and rotation
                for (let j = 0; j < currPlaneLines.length; j++) {
                    this._changeBasisAndRotate3DLine(currPlaneLines[j])
                }

                let planeCubeIntersects = []
                
                for (let j = 0; j < cubePlanesStdForm.length; j++) {
                    let planeCubeIntersectLine = this.getPlanePlaneIntersectLine(this.planesStdForm[i], cubePlanesStdForm[j])
                    if (planeCubeIntersectLine != null) {
                        this._changeBasisAndRotate3DLine(planeCubeIntersectLine)

                        planeCubeIntersects.push(planeCubeIntersectLine)
                    }
                }

                let planePolygons = this.splitPlanes(currPlaneLines, planeCubeIntersects, this.planeColors[i], "black", 0.6)
            
                let inCubePolygons = []
                let inverseRotationMatrix = this._inverseRotate()

                //write a specialized splitplanes function later to optimize? not needed?
                for (let j = 0; j < planePolygons.length; j++) {
                    let inCube = true
                    for (let k = 0; k < planePolygons[j].lines.length; k++) {
                        let currLine = planePolygons[j].lines[k].point1
                        let currLineCopy = [currLine[0], currLine[1], currLine[2]]
                
                        currLineCopy = matrixVectorMultiplication(inverseRotationMatrix, currLineCopy)

                        let error = 0.00000001
                        let cubeSizeAndError = cubeSize + error
                        if (Math.abs(currLineCopy[0]) > cubeSizeAndError ||
                            Math.abs(currLineCopy[1]) > cubeSizeAndError ||
                            Math.abs(currLineCopy[2]) > cubeSizeAndError) {
                                inCube = false
                                break
                        }
                    }
                    if (inCube) {
                        inCubePolygons.push(planePolygons[j].lines)
                    }
                }
                
                if (inCubePolygons.length > 1) {
                    debugger
                }
                if (inCubePolygons.length == 0) {
                    currPlaneLines = []
                } else {
                    currPlaneLines = inCubePolygons[0]
                }

            }

            planeLines.push(currPlaneLines)
        }
        return planeLines
    }

    /**
     * finds all intersects for planes i and j for 0 <= i, j < this.planesStdFrom, i != j
     * @returns {Line[][]} adjacency matrix of intersection lines, contains a Line object if interseciton exists, else Null
     */
    _getAllPlaneIntersections() {
        let intersect_ij = new Array(this.planesStdForm.length)
        for (let i = 0; i < intersect_ij.length; i++) {
            intersect_ij[i] = new Array(this.planesStdForm.length).fill(null)
        }

        for (let i = 0; i < this.planesStdForm.length - 1; i++) {
            for (let j = i + 1; j < this.planesStdForm.length; j++) {
                //calculate intersect of plane i and j only if both planes are to be drawn
                let currIntersect = null
                if (this.planesToDraw[i] && this.planesToDraw[j]) {
                    currIntersect = this.getPlanePlaneIntersectLine(this.planesStdForm[i], this.planesStdForm[j])
                }
                
                if (currIntersect != null) {
                    this._changeBasisAndRotate3DLine(currIntersect)
                }
                //we keep this outside the if because ij represents intersection between ith and jth plane
                intersect_ij[i][j] = currIntersect
                intersect_ij[j][i] = currIntersect
            }
        }
        return intersect_ij
    }

    /**
     * returns all polygons with their minZ and maxZ values from the gaussian planes
     * @param {Line[][]} planeLines 
     * @returns {Polygon[]}
     */
    _getPlanePolygons(planeLines) {
        //intersect_ij[i][j] is the intersectio line between plane i and plane j, is null if no intersectino
        let intersect_ij = this._getAllPlaneIntersections()

        let axisPlanes = [[1,0,0,0],[0,1,0,0],[0,0,1,0]]

        let axisIntersections = []
        for (let i = 0; i < this.planesStdForm.length; i++) {
            if (this.planesToDraw[i]) {
                for (let j = 0; j < axisPlanes.length; j++) {
                    let currIntersect = this.getPlanePlaneIntersectLine(this.planesStdForm[i], axisPlanes[j])
                    if (currIntersect != null) {
                        this._changeBasisAndRotate3DLine(currIntersect)
                        axisIntersections.push(currIntersect)
                    }
                }
            }
        }

        let polygons = []
        //iterate over each plane
        for (let i = 0; i < planeLines.length; i++) {
            if (planeLines[i].length != 0 /**&& this.planesToDraw[i]**/) {
                //build up the lines that could intersect with the ith plane
                // let xp = new Line(this.graph, [0,0,0], [10,0,0], false)
                // let xn = new Line(this.graph, [0,0,0], [-10,0,0], false)

                // let yp = new Line(this.graph, [0,0,0], [0,10,0], false)
                // let yn = new Line(this.graph, [0,0,0], [0,-10,0], false)

                // let zp = new Line(this.graph, [0,0,0], [0,0,10], false)
                // let zn = new Line(this.graph, [0,0,0], [0,0,-10], false)

                // let intersectLines = [xp, xn, yp, yn, zp, zn]

                // for (let i = 0; i < intersectLines.length; i++) {
                //     this._changeBasisAndRotate3DLine(intersectLines[i]) 
                // }
                let intersectLines = []

                //add axis planes as well?
                // for (let j = 0; j < axisIntersections.length; j++) {
                //     intersectLines.push(axisIntersections[j])
                // }

                //all lines from intersections between ith plane and some jth plane
                for (let j = 0; j < intersect_ij.length; j++) {
                    for (let k = 0; k < intersect_ij.length; k++) {
                        if (intersect_ij[j][k] != null && this.planesToDraw[j] && this.planesToDraw[k]) {
                            intersectLines.push(intersect_ij[j][k])
                        }
                    }
                    // if (intersect_ij[i][j] != null) {
                    //     intersectLines.push(intersect_ij[i][j])
                    // }
                }

                //all lines from the outlines of the other visible planes
                for (let j = 0; j < planeLines.length; j++) {
                    if (j != i && planeLines[j].length != 0 && this.planesToDraw[j]) {
                        intersectLines = intersectLines.concat(planeLines[j])
                    }
                }

                //copying to avoid potential nasties
                let planeLinesCopy = new Array(planeLines[i].length)
                for (let j = 0; j < planeLinesCopy.length; j++) {
                    planeLinesCopy[j] = new Line(this.graph, planeLines[i][j].point1, planeLines[i][j].point2, false)
                }
                
                polygons = polygons.concat(this.splitPlanes(planeLinesCopy, intersectLines, this.planeColors[i], "black", 0.6))
            }
        }
        return polygons
    }

    /**
     * draws all the planes with correct depth perception
     * @param {Polygon[]} sortedPolygons 
     */
    _drawPlanes(sortedPolygons) {
        let planesToDrawColors = new Set()
        //get all the colors of the planes to be drawn
        for (let i = 0; i < this.planesToDraw.length; i++) {
            if (this.planesToDraw[i]) {
                planesToDrawColors.add(this.planeColors[i])
            }
        }

        let returnPolygons = []

        for (let i = 0; i < sortedPolygons.length; i++) {
            if (planesToDrawColors.has(sortedPolygons[i].fillColor)){

                returnPolygons.push(sortedPolygons[i])

             }
        }

        return returnPolygons;
    }

    /**
     * draws an outline around all gaussian planes of input color
     * @param {Line[][]} planeLines 
     * @param {String} outlineColor 
     */
    _drawPlaneOutlines(planeLines, outlineColor) {
        //draw outlines
        
        let returnPolygons = []

        for (let i = 0; i < planeLines.length; i++) {
            if (planeLines[i].length != 0 && this.planesToDraw[i]) {

                
                // console.log(planeLines)
                let planePolygon = new Polygon(this.graph, planeLines[i], "black", outlineColor, 1)
                planePolygon.fill = false
                planePolygon.outline = true
                returnPolygons.push(planePolygon)

            }
        }

        return returnPolygons
    }

    /**
     * draws the cube bounding the gaussian planes
     * @param {Number[][]} cubePlanesStdForm 
     * @param {Number} cubeSize 
     * @param {String} outlineColor 
     */
    _drawPlaneBoundingCubeOutlines(cubePlanesStdForm, cubeSize, outlineColor) {
        let returnPolygons = []
        for (let i = 0; i < cubePlanesStdForm.length; i++) {
            let point = [0,0,0]
            let nonzero = leftMostNonZeroInRow(transpose(cubePlanesStdForm), i)
            point[nonzero] = cubePlanesStdForm[i][cubePlanesStdForm[i].length - 1]
            let cubePlaneLines = this.getPlaneLines(cubePlanesStdForm[i], cubeSize, point)
            if (cubePlaneLines.length != 0) {
                for (let j = 0; j < cubePlaneLines.length; j++) {
                    cubePlaneLines[j].point1 = this.graph.changeBasisAndRotate(cubePlaneLines[j].point1)
                    cubePlaneLines[j].point2 = this.graph.changeBasisAndRotate(cubePlaneLines[j].point2)
                }
                let cubePolygon = new Polygon(this.graph, cubePlaneLines, "gray", outlineColor, 1)
                cubePolygon.fill = false
                cubePolygon.outline = true
                returnPolygons.push(cubePolygon)
            }
        }
        return returnPolygons;
    }
    

    /** 
     * draws the planes from the augmented matrix defined by this.planesStdForm
     * trying to add a larger constant sized cube in which the planes will be constrained, within the cube the planes should fill to max
     */
    returnPlanePolygons() {
        //dividing so that regardless of zoom cube remains same size
        let cubeSize = this.cubeHalfSideLength / this.graph.currentZoom
        let cubePlanesStdForm = [[1,0,0,cubeSize],
                                 [1,0,0,-cubeSize],
                                 [0,1,0,cubeSize],
                                 [0,1,0,-cubeSize],
                                 [0,0,1,cubeSize],
                                 [0,0,1,-cubeSize]]
        //debugger
        let planeLines
        if (this.cubeBoundPlanes) {
            planeLines = this.getCubeBoundedPlaneLines(cubeSize, cubePlanesStdForm)
        } else {
            planeLines = this.getFixedSizePlaneLines(6)
        }
        let polygonlist = []

        let polygons = this._getPlanePolygons(planeLines)

        //debugger
        // --- --- --- --- ---
        //let sortedPolygons = this.sortPolygons(polygons)
        // for (let i=0; i< polygons.length; i++) {
        //     polygonlist.push(polygons[i])
        // }
        //debugger
        //draw planes   
        let planePolygons = this._drawPlanes(polygons)
        for (let i=0; i< planePolygons.length; i++) {
            polygonlist.push(planePolygons[i])
        }
        //debugger
        //draw outlines
        let planeOutlines = this._drawPlaneOutlines(planeLines, "black")
        for (let i=0; i< planeOutlines.length; i++) {
            polygonlist.push(planeOutlines[i])
        }
  
        //draw plane bounding cube
        if (this.cubeBoundPlanes) {
            let boxpolygons = this._drawPlaneBoundingCubeOutlines(cubePlanesStdForm, cubeSize, "#333333")
            for (let i=0; i< boxpolygons.length; i++) {
                polygonlist.push(boxpolygons[i])
            }
            
        }

   
        // if (this.hasSolution) {
        //     //draw dot at solution
        //     this.graph.drawDotFromVector(this.solution, "pink", "black", 6)
        // }

        return polygonlist
    }

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

        //need to store all equal minZ polygons by maxZ now //
        // let start = 0 
        // let end = 0
        // let i = 0
        // while (i <= polygons.length) {
        //     if (i != polygons.length && numEqual(polygons[start].minZ, polygons[i].minZ, this.precision) && numEqual(polygons[start].maxZ, polygons[i].maxZ, this.precision)) {
        //         end = i
        //     } else {
        //         sortedPolygons = this.partialSortBySamePoint(sortedPolygons, start, end + 1, numericPrecision)
        //         start = i
        //         end = i
        //     }
        //     i++
        // }

        return sortedPolygons
    }

    partialSortBySamePoint(arr, start, end, numericPrecision) {
        if (start >= end) {
            throw new Error("start index >= end index!!")
        }
        let preSorted = arr.slice(0, start)
        let postSorted = arr.slice(end);
        let sorted = arr.slice(start, end).sort(function(a, b) {
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
        });
        arr.length = 0;
        arr.push.apply(arr, preSorted.concat(sorted).concat(postSorted));
        return arr;
    }
    

    /**
     * finds the R3 intersection vector between two R2 planes
     * @param {Number[]} plane1 ax+by+cz = d => [a,b,c,d]
     * @param {Number[]} plane2 ax+by+cz = d => [a,b,c,d]
     * @returns {Number[]} intersection vector [dx, dy, dz]
     */
    planePlaneIntersectVector3D(plane1, plane2) {
        // calculate crossproduct => vector perp to both normals => intersetion vector
        // u x v = (u2v3 - u3v2, u3v1-u1v3, u1v2-u2v1)
        let cx = (plane1[1] * plane2[2]) - (plane1[2] * plane2[1])
        let cy = (plane1[2] * plane2[0]) - (plane1[0] * plane2[2])
        let cz = (plane1[0] * plane2[1]) - (plane1[1] * plane2[0])

        // correct fp error to 0 if needed (safer calculations)
        if (numEqual(cx, 0, this.precision)) {
            cx = 0
        }
        if (numEqual(cy, 0, this.precision)) {
            cy = 0
        }
        if (numEqual(cz, 0, this.precision)) {
            cz = 0
        }
        return [cx, cy, cz]
    }

    /**
     * takes normal vector defining plane in standard view form, and 
     * finds the plane lines in the basis, zoom and rotation of the current view on the graph
     * @param {*} graph the graph on which the plane exists
     * @param {Number[]} normal a vector [a, b, c, d] => ax + by + cz = d
     * @param {Number} sideLength the sidelengths of the plane
     * @param {Number[]} intersection this is the solution to the matrix system, and where the plane is to be centered around
     *                         relative to the [0,0,0] center of the graph
     * @returns {Line[]} [line1, line2, line3, line4] defining a 4 sided plane
     */
    getPlaneLines(normal, sideLength, intersection) {
        let a = normal[0]
        let b = normal[1]
        let c = normal[2]
        let d = normal[3]

        if (a == 0 && b == 0 && c == 0) {
            return []
        }

        let planeBasis = this.getPlaneVectors2D([a, b, c])

        //find offset
        //ax + by + cz = d
        /**
         * ax + d = 0
         * by + d = 0
         * cz + d = 0
         */

        let orthanormalBasis = gramSchmidt(planeBasis)
        //let basisVec1 = graph.changeBasisAndRotate(orthanormalBasis[0])
        //let basisVec2 = graph.changeBasisAndRotate(orthanormalBasis[1])
        let basisVec1 = orthanormalBasis[0]
        let basisVec2 = orthanormalBasis[1]

        // there are gridSize lines on each half axis
        let gridSize = sideLength
        
        let corner1 = vectorAdd(scaleVector(basisVec2, -1 * gridSize), scaleVector(basisVec1, gridSize)) 
        let corner2 = vectorAdd(scaleVector(basisVec2, -1 * gridSize), scaleVector(basisVec1, -1 * gridSize))

        let corner3 = vectorAdd(scaleVector(basisVec2, gridSize), scaleVector(basisVec1, gridSize))
        let corner4 = vectorAdd(scaleVector(basisVec2, gridSize), scaleVector(basisVec1, -1 * gridSize))
        
        //intersection is the solution of the system (if it exists)
        //intersection = graph.changeBasisAndRotate(intersection)
        corner1 = vectorAdd(corner1, intersection)
        corner2 = vectorAdd(corner2, intersection)
        corner3 = vectorAdd(corner3, intersection)
        corner4 = vectorAdd(corner4, intersection)

        let line1 = new Line(this.graph, corner1, corner3, false)
        let line2 = new Line(this.graph, corner3, corner4, false)
        let line3 = new Line(this.graph, corner4, corner2, false)
        let line4 = new Line(this.graph, corner2, corner1, false)

        //remove lines that are 0 length
        let lines = [line1, line2, line3, line4]
        return lines
    }

    /**
     * calculates vectors defining the R2 plane of a normal vector
     * @param {Number[]} normal a vector with entries [a, b, c, ...] where [a,b,c] define a normal vector
     * @returns two vectors non parrallel vectors definint the plane with input normal vector
     */
    getPlaneVectors2D(normal) {
        let a = normal[0]
        let b = normal[1]
        let c = normal[2]

        if(a == 0 && b == 0 && c == 0) {
            throw new Error("Normal vector is [0,0,0]")
        }

        let planeBasis = new Array(2)

        if(!numEqual(a, 0, this.precision)) {
            // x = -(b/a)y - (c/a)z   |-b/a -c/a|
            // y = y + 0z             |1       0|
            // z = 0y + z             |0       1|
            planeBasis[0] = [(-1 * b/a), 1, 0]
            planeBasis[1] = [(-1 * c/a), 0, 1]
            
        } else if (!numEqual(b, 0, this.precision)) {
            // x = x + 0z             |1       0|
            // y = -(a/b)x - (c/b)z   |-a/b -c/b|
            // z = 0x + z             |0       1|
            planeBasis[0] = [1,(-1 * a/b),0]
            planeBasis[1] = [0,(-1 * c/b),1]
            
        } else {
            // x = x                  |1       0|
            // y = y                  |0       1|
            // z = -(a/c)x - (b/c)y   |-a/c -b/c|

            //ax+by+cz=0
            //cz=-ax-by
            //z = (-a/c)x + (-b/c)y
            planeBasis[0] = [1,0,(-1 * a)/c]
            planeBasis[1] = [0,1,(-1 * b)/c]
        }

        return planeBasis
    }
}

/**
 * turns a 3D point [x, y, z] into the string "x,y,z"
 * @param {Number[]} point an array of [x, y, z]
 * @returns {String} the string "x,y,z"
 */
function pt3DToStr(point) {
    return "" + point[0] + "," + point[1] + "," + point[2]
}

/**
 * 
 * @param {Number[][]} matrix col row format matrix
 * @param {Number} row 
 * @returns {Number} index of the leftmost nonzero element in row of matrix
 */
function leftMostNonZeroInRow(matrix, row) {
    let col = 0
    while (col < matrix.length) {
        if (matrix[col] == null) {
            debugger
        }
        if (matrix[col][row] != 0) {
            return col;
        }
        col++
    }
    return col
}




/**
 * this is a line (no kidding!!)
 */
class Line {
    /**
     * creates a new instance of a Line
     * @param {*} graph
     * @param {Number[]} point1 a point in Rn where n >= 2
     * @param {Number[]} point2 a point in Rn where n >= 2
     * @param {Boolean} inf indicates if line extends infinitely
     *                      if true, infinite line!!
     *                      if false, line is bounded by point1 and point2
     */
    constructor(graph, point1, point2, inf) {
        this.graph = graph
        this.point1 = point1
        this.point2 = point2
        this.inf = inf
        this.precision = 7
        this.color = "#E6E6E3"
        this.lineWidth = 4
        this.behindPlanes = new Set()
        this.beforePlanes = new Set()
        this.minZ = Math.min(this.point1[2], this.point2[2])
        this.maxZ = Math.max(this.point1[2], this.point2[2])

        let sumX = this.point1[0] + this.point2[0]
        let sumY = this.point1[1] + this.point2[1]
        let sumZ = this.point1[2] + this.point2[2]
        this.midPoint = [sumX / 2, sumY / 2, sumZ / 2]

        this.planesBefore = []
    }

    splitWithPlane(plane, color) {
        // Return array of lines.
        // ax+by+cz = d [a, b, c, d]
        let a = this.point2[0] - this.point1[0]
        let b = this.point2[1] - this.point1[1]
        let c = this.point2[2] - this.point1[2]
        //debugger

        if (numEqual(dotProduct([plane[0], plane[1], plane[2]], [a, b, c]), 0, this.precision)) {
            return [this]
        } else {
            let a1 = plane[0]
            let b1 = plane[1]
            let c1 = plane[2]
            let d1 = plane[3]

            let x0 = this.point1[0]
            let y0 = this.point1[1]
            let z0 = this.point1[2]

            let numerator = d1 - ((a1*x0) + (b1*y0) + (c1*z0))
            let denominator = (a1*a) + (b1*b) + (c1*c)

            if (numEqual(denominator, 0, this.precision)) {
                return [this]
            } else {
                let t = numerator / denominator
                let x = x0 + (a * t)
                let y = y0 + (b * t)
                let z = z0 + (c * t)

                //check if within bounds 
                if (!this.inf) {
                    let xMax = Math.max(this.point1[0], this.point2[0])
                    let yMax = Math.max(this.point1[1], this.point2[1])
                    let zMax = Math.max(this.point1[2], this.point2[2])
                    let xMin = Math.min(this.point1[0], this.point2[0])
                    let yMin = Math.min(this.point1[1], this.point2[1])
                    let zMin = Math.min(this.point1[2], this.point2[2])

                    if ((!(x > xMax || x < xMin) || numEqual(x, xMax, this.precision) || numEqual(x, xMin, this.precision)) &&
                        (!(y > yMax || y < yMin) || numEqual(y, yMax, this.precision) || numEqual(y, yMin, this.precision)) &&
                        (!(z > zMax || z < zMin) || numEqual(z, zMax, this.precision) || numEqual(z, zMin, this.precision))) {
                            let intersectPoint = [x, y, z]
                            //check if intersects at endpoints
                            if (!vectorEquals(intersectPoint, this.point1, this.precision) && 
                                !vectorEquals(intersectPoint, this.point2, this.precision)) {
                                    let line1 = new Line(this.graph, this.point1, intersectPoint, false) 
                                    let line2 = new Line(this.graph, intersectPoint, this.point2, false)
                                    line1.color = this.color
                                    line2.color = this.color
                                    line1.lineWidth = this.lineWidth
                                    line2.lineWidth = this.lineWidth

                                    line1.behindPlanes = new Set(this.behindPlanes)
                                    line1.beforePlanes = new Set(this.beforePlanes)
                                    line2.behindPlanes = new Set(this.behindPlanes)
                                    line2.beforePlanes = new Set(this.beforePlanes)
                                    
                                    //debugger
                                    if (!numEqual(this.point1[2], this.point2[2], this.precision)) {
                                        if (this.point1[2] > this.point2[2]) {
                                            line1.behindPlanes.add(color)
                                            line2.beforePlanes.add(color)
                                        } else {
                                            line2.behindPlanes.add(color)
                                            line1.beforePlanes.add(color)
                                        }
                                    }
                                    
                                    return [line1, line2]
                            }
                    }
                }
            }
            return [this]
            // y = mx + b
        }

    }


    /**
     * splits obj with otherLine
     * @param {Line} otherLine the line to split obj with
     * @returns {Line[]} [] if otherLine does not split obj, 
     *                   [line(this.point1, splitPoint), line(splitPoint, this.point2)] if a splitPoint exists
     */
    splitWithLine2D(otherLine) {
        const a1 = this.point2[1] - this.point1[1]
        const b1 = this.point1[0] - this.point2[0] 
        const c1 = (this.point1[1] * (this.point2[0] - this.point1[0])) - (this.point1[0] * (this.point2[1] - this.point1[1]))

        const a2 = otherLine.point2[1] - otherLine.point1[1]
        const b2 = otherLine.point1[0] - otherLine.point2[0]
        const c2 = (otherLine.point1[1] * (otherLine.point2[0] - otherLine.point1[0])) - (otherLine.point1[0] * (otherLine.point2[1] - otherLine.point1[1]))
        const det = (a1 * b2) - (a2 * b1)

        //check if lines are parrallel
        if (!numEqual(det, 0, this.precision)) {
            let x = ((b1 * c2) - (b2 * c1)) / det
            let y = ((a2 * c1) - (a1 * c2)) / det

            let xMax = Math.max(this.point1[0], this.point2[0])
            let xMin = Math.min(this.point1[0], this.point2[0])
            let yMax = Math.max(this.point1[1], this.point2[1]) 
            let yMin = Math.min(this.point1[1], this.point2[1])

            //dont care if the other line is inf or finite for this algorithm, treating it as finite has issues
            //so always treat otherLine as inf
            //this checks for if the point is within bound of the line
            if ((!(x > xMax || x < xMin) || numEqual(x, xMax, this.precision) || numEqual(x, xMin, this.precision)) &&
                (!(y > yMax || y < yMin) || numEqual(y, yMax, this.precision) || numEqual(y, yMin, this.precision))) {

                    let dx = this.point2[0] - this.point1[0]
                    let dy = this.point2[1] - this.point1[1]
                    let dz = this.point2[2] - this.point1[2]

                    //get z coord on line given x, y
                    let t = (x - this.point1[0]) / dx
                    if (numEqual(dx, 0, this.precision)) {
                        t = (y - this.point1[1]) / dy
                    }

                    let z = this.point1[2] + dz * t
                    let midPoint = [x, y, z]

                    if (vectorEquals(this.point1, midPoint, this.precision)) {
                        return [new Line(this.graph, this.point1, this.point1, false), new Line(this.graph, this.point1, this.point2, false)]
                    } else if (vectorEquals(this.point2, midPoint, this.precision)) {
                        return [new Line(this.graph, this.point1, this.point2, false), new Line(this.graph, this.point2, this.point2, false)]
                    } else {
                        return [new Line(this.graph, this.point1, midPoint, false), new Line(this.graph, midPoint, this.point2, false)]
                    }
            }
        }

        return []
    }

    draw() {
        let scaledPoint1 = scaleVector(this.point1, this.graph.scale)
        let scaledPoint2 = scaleVector(this.point2, this.graph.scale)
        // scaledPoint1 = this.point1
        // scaledPoint2 = this.point2
        let point1GraphCoord = [this.graph.centerX + scaledPoint1[0], this.graph.centerY - scaledPoint1[1]]
        let point2GraphCoord = [this.graph.centerX + scaledPoint2[0], this.graph.centerY - scaledPoint2[1]]
        //just finite line case for now
        this.graph.ctx.beginPath()
        this.graph.ctx.moveTo(point1GraphCoord[0], point1GraphCoord[1])
        this.graph.ctx.lineTo(point2GraphCoord[0], point2GraphCoord[1])
        this.graph.ctx.closePath()
        this.graph.ctx.strokeStyle = this.color
        this.graph.ctx.lineWidth = this.lineWdith
        this.graph.ctx.stroke()

    }
}


/**
 * polygon much wow
 */
class Polygon {
    /**
     * creates a new instance of a polygon shape
     * @param {*} graph 
     * @param {Line[]} lines lines defining polygon, are in order of a circuit around the polygon
     * @param {String} fillColor 
     * @param {String} outlineColor 
     * @param {Number} alpha value betwen 0 and 1
     * @requires: that all lines are in order of a path around the polygon
     */
    constructor(graph, lines, fillColor, outlineColor, alpha) {
        this.graph = graph
        //vertices must be in order of a circuit around shape
        this.lines = lines
        this.fillColor = fillColor
        this.outlineColor = outlineColor
        this.alpha = alpha

        this.fill    = true
        this.outline = true
        //find minZ and maxZ so polygon is sortable
        let minZ = this.lines[0].point1[2]
        let maxZ = this.lines[0].point1[2]

        let sumX = this.lines[0].point1[0]
        let sumY = this.lines[0].point1[1]
        let sumZ = this.lines[0].point1[2]
        //debugger
        for (let i = 0; i < this.lines.length; i++) {
            let currZ = this.lines[i].point2[2]
            if (currZ == -0) {
                currZ = 0
            }

            minZ = Math.min(currZ, minZ)
            maxZ = Math.max(currZ, maxZ)

            if (i < this.lines.length - 1 || this.lines.length == 1) {
                sumX += this.lines[i].point2[0]
                sumY += this.lines[i].point2[1]
                sumZ += this.lines[i].point2[2]
            }
        }
        //debugger
        this.minZ = minZ
        this.maxZ = maxZ

        this.numPoints = this.lines.length + 1

        this.centroid = [sumX / this.numPoints, sumY / this.numPoints, sumZ / this.numPoints]
    }

    /**
     * draws this polygon on its graph
     * @param {Boolean} fill if true, polygon is filled with this.color, else no fill
     * @param {Boolean} outline if true, polygon is outlined with black
     */
    draw() {
        // let vector = this.centroid

        // let vecX = this.graph.centerX + (this.graph.scale * vector[0])
        // let vecY = this.graph.centerY - (this.graph.scale * vector[1])

        // // Draw the center dot
        // let size = 10
        // this.graph.ctx.fillStyle = this.fillColor
        // this.graph.ctx.lineWidth = 4;
        // this.graph.ctx.strokeStyle = this.outlineColor
        // this.graph.ctx.beginPath();
        //     this.graph.ctx.arc(vecX, vecY, size, 0, 2 * Math.PI);
        //     this.graph.ctx.fill();
        // this.graph.ctx.stroke();

        //draw polygon
        let line = this.lines[0]

        this.graph.ctx.globalAlpha = this.alpha;
        //debugger
        let point = [(this.graph.scale * line.point1[0]), (this.graph.scale * line.point1[1])]
        point = this.vectorToFixed(point, 0)


        this.graph.ctx.beginPath()
        this.graph.ctx.moveTo(this.graph.centerX + point[0], this.graph.centerY - point[1])
        for (let i = 0; i < this.lines.length; i++) {
            line = this.lines[i]
            point = [(this.graph.scale * line.point2[0]), (this.graph.scale * line.point2[1])]
            point = this.vectorToFixed(point, 0)
            this.graph.ctx.lineTo(this.graph.centerX + point[0], this.graph.centerY - point[1])
        }
        this.graph.ctx.closePath()
        this.graph.ctx.fillStyle = this.fillColor
        if (this.fill) {this.graph.ctx.fill()}
        
        this.graph.ctx.lineWidth = this.lines[0].lineWidth;
        this.graph.ctx.strokeStyle = this.outlineColor
        if (this.outline) {this.graph.ctx.stroke()}
        
        this.graph.ctx.globalAlpha = 1;

    }

    vectorToFixed(vector, val) {
        for (let i = 0; i < vector.length; i++) {
            vector[i] = parseFloat((Math.round(vector[i] * 100) / 100).toFixed(val));
        }
        return vector
    }
}


