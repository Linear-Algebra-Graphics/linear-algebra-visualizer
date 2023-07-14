
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
 */


class GaussianPlanes {
    constructor(graph, planesStdForm) {
        this.graph = graph
        this.planesStdForm = planesStdForm
        let transposed = transpose(this.planesStdForm)
        let reduced = GaussianEliminationV2(transposed, true, false)
        let result = reduced[reduced.length - 1];
        if (result.length != 3) {
            result = [0, 0, 0]
        }
        this.intersection = result
    }

    /**
     * splits all planes defined by the list of stdForm planes 
     * @param {*} polygonLines the lines of the current polygon, is an array of Line Objects
     * @param {*} intersectLines an array of Line Objects that may intersect with polygonLines
     * @param {*} color the color in any representation
     * @param {*} alpha a numerical value such that  0 <= alpha <= 1
     * @returns an array of all polygons from splitting on all intersectLines
     */
    splitPlanes(polygonLines, intersectLines, color, alpha) {
        let output = []
        this._splitPlanesHelper(polygonLines, intersectLines, 0, output, color, alpha)
        return output
    }

    //helper recursive function
    //@param intersectLinesIndex is the index in the array of intersectLines, 
    //                           ie the current intersect line considered
    _splitPlanesHelper(polygonLines, intersectLines, intersectLinesIndex, output, color, alpha) {
        if (intersectLines.length == 0 || intersectLinesIndex == intersectLines.length ) {
            //base case, there are no intersection lines, so no more splits can be found
            //now return the current polygonLines as a polygon in output

            //find minZ and maxZ so output is sortable
            let minZ = Number.MAX_VALUE
            let maxZ = -1*Number.MAX_VALUE
            for (let i = 0; i < polygonLines.length; i++) {
                let currZ = polygonLines[i].point1[2]
                if (currZ == -0) {
                    currZ = 0
                }

                minZ = Math.min(currZ, minZ)
                maxZ = Math.max(currZ, maxZ)
            }
            output.push({polygon: new Polygon(this.graph, polygonLines, color, alpha), minZ: minZ, maxZ: maxZ})
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
                let splitLines = polygonLines[i].splitWithLine2D(interesectLine, color)
                if (splitLines.length != 0) {
                    let splitPt1 = splitLines[0].point1
                    let splitPt2 = splitLines[1].point1
                    
                    if (vectorEquals(splitLines[0].point1, splitLines[0].point2) || vectorEquals(splitLines[1].point1, splitLines[1].point2)) {
                        //case where intersect point is the exact endpoint of a line
                        if (vectorEquals(splitLines[0].point1, splitLines[0].point2)) {
                            linesWithSplit.set(pt3DToStr(splitLines[0].point1), splitLines[1])
                        } else {
                            linesWithSplit.set(pt3DToStr(splitPt1), new Line(splitPt1, splitLines[1].point2, splitLines[0].inf))
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
                if (vectorEquals(foundSplitPoints[0], foundSplitPoints[1])) {  
                    splitPoints = [foundSplitPoints[0], foundSplitPoints[foundSplitPoints.length - 1]]
                } else {
                    if (vectorEquals(foundSplitPoints[0], foundSplitPoints[foundSplitPoints.length - 1])) {
                        splitPoints = [foundSplitPoints[1], foundSplitPoints[foundSplitPoints.length - 1]]
                    } else {
                        splitPoints = [foundSplitPoints[0], foundSplitPoints[foundSplitPoints.length - 1]]
                    }
                }
            }

            //if there are two distinct split points we know it is a valid split
            if (splitPoints.length == 2 && !vectorEquals([splitPoints[0][0], splitPoints[0][1]], [splitPoints[1][0],splitPoints[1][1]])) {
                //case where line does not split plane, ie standard view for example
                //create two new shapes defined by lines.
                let leftPolygonLines = new Array()
                let rightPolygonLines = new Array()
                
                let currPoint = splitLinesRef[0].point2

                //check if one of lines is length 0, ie start end are the same point
                if (vectorEquals(splitLinesRef[0].point1, splitLinesRef[0].point2) || vectorEquals(splitLinesRef[1].point1, splitLinesRef[1].point2)) {
                    //case where intersect point is the exact endpoint of a line
                    if (vectorEquals(splitLinesRef[0].point1, splitLinesRef[0].point2)) {
                        currPoint = splitLinesRef[0].point1
                    } else {
                        currPoint = splitLinesRef[1].point2
                    }
                }

                // populate lefPolygonLines
                let i = 0
                while (!vectorEquals(currPoint, splitPoints[0])) {
                    i++
                    leftPolygonLines.push(linesWithSplit.get(pt3DToStr(currPoint)))
                    currPoint = linesWithSplit.get(pt3DToStr(currPoint)).point2
                }
                leftPolygonLines.push(new Line(currPoint, splitPoints[1], false))

                // populate rightPolygonLines
                i = 0
                while (!vectorEquals(currPoint, splitPoints[1])) {
                    i++
                    rightPolygonLines.push(linesWithSplit.get(pt3DToStr(currPoint)))
                    currPoint = linesWithSplit.get(pt3DToStr(currPoint)).point2
                }
                
                rightPolygonLines.push(new Line(currPoint, splitPoints[0], false))

                //valid split recursive calls
                intersectLinesIndex = intersectLinesIndex + 1  

                //sanity check for length > 2 (valid polygon must have >= 3 lines defining it)
                //a length of two is possible potentialy if intersect line is one of the lines of the polygon
                if (leftPolygonLines.length > 2) {
                    this._splitPlanesHelper(leftPolygonLines, intersectLines, intersectLinesIndex, output, color, alpha)
                }
                if (rightPolygonLines.length > 2) {
                    this._splitPlanesHelper(rightPolygonLines, intersectLines, intersectLinesIndex, output, color, alpha)
                }
            } else {
                //no valid split recursive call
                intersectLinesIndex = intersectLinesIndex + 1
                this._splitPlanesHelper(polygonLines, intersectLines, intersectLinesIndex, output, color, alpha)
            }
        }
    }

    //plane is defined by (a, b, c, d) => ax + by + cz = d, rn it is only (a, b, c) for simplicity
    /**
     * find the line of intersection between two 2D planes
     * @param {*} plane1 normal vector [a, b, c]
     * @param {*} plane2 normal vector [a, b, c]
     * @requires : both planes are of the same dimension, R3 only rn
     * @returns a Line Object of the intersection line
     */
    getPlanePlaneIntersectLine(plane1, plane2) {
        //debugger
        if (plane1.length != plane2.length) {
            throw new Error("planes must be same dimension!")
        }

        // calculate crossproduct => vector perp to both normals => intersetion vector
        // u x v = (u2v3 - u3v2, u3v1-u1v3, u1v2-u2v1)
        let intersectVector = planePlaneIntersectVector3D(plane1, plane2)

        //find a point of intersection between two planes
        //[a,b,c,d]
        let reducedEchelon = GaussianEliminationV2(transpose([plane1, plane2]), true, false)

        let point1 = new Array(3)
        let point2 = new Array(3)
        for (let i = 0; i < 3; i++) {
            point1[i] = 0
            point2[i] = 0
        }
        //temp for testing, need to use gaussianElim for actual
        //debugge

        //go through reduced row echelon form to get a solution
        for (let row = 0; row < 2; row++) {
            let col = 0
            while (col < 3 && reducedEchelon[col][row] == 0) {
                col++
            }

            if (col == 3) {
                // no solution
                return []
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
        return new Line(point1, point2, true)
    }

    /**
     * draws the planes 
     */
    draw() {
        let planeLines = []

        //get othonormal basis of two lines per plane 
        for (let i = 0; i < this.planesStdForm.length; i++) {
            let currPlaneLines = getPlaneLines(this.graph, this.planesStdForm[i], 10, this.intersection)
            planeLines.push(currPlaneLines)
        }
    
        let n = this.planesStdForm.length - 1
        let intersect_ij = []
        for (let i = 0; i < this.planesStdForm.length - 1; i++) {
            for (let j = i + 1; j < this.planesStdForm.length; j++) {
                let currIntersect = this.getPlanePlaneIntersectLine(this.planesStdForm[i], this.planesStdForm[j])
                if (currIntersect.length != 0) {
                    currIntersect.point1 = this.graph.changeBasisAndRotate(currIntersect.point1)
                    currIntersect.point2 = this.graph.changeBasisAndRotate(currIntersect.point2)
                }
                intersect_ij.push(currIntersect)
            }
        }

        //just an example colors array
        let colors = ["red", "blue", "green", "purple", "yellow", "orange"]
        let polygons = []
        for (let i = 0; i < planeLines.length; i++) {
            if (planeLines[i].length != 0) {
                let intersectLines = []
                if (intersect_ij.length == 1) {
                    let normal = vectorSubtract(intersect_ij[0].point1, intersect_ij[0].point2)
                    //not offset yet!!
                    intersectLines.push(new Line([0,0,0], [-1 * normal[1], normal[0], 0], true))
                }

                for (let j = 0; j < intersect_ij.length; j++) {
                    if (intersect_ij[j].length != 0) {
                        intersectLines.push(intersect_ij[j])
                    }
                }
                for (let j = 0; j < planeLines.length; j++) {
                    if (j != i && planeLines[j].length != 0) {
                        intersectLines = intersectLines.concat(planeLines[j])
                    }
                }
                let planeLinesCopy = new Array(planeLines[i].length)
                for (let j = 0; j < planeLinesCopy.length; j++) {
                    planeLinesCopy[j] = new Line(planeLines[i][j].point1, planeLines[i][j].point2, false)
                }

                polygons = polygons.concat(this.splitPlanes(planeLinesCopy, intersectLines, colors[i], 0.6))
            }
        }
        
        let sortedPolygons = this.sortPolygons(polygons)
        
        //draw planes   
        for (let i = 0; i < sortedPolygons.length; i++) {

            for (let j = 0; j < sortedPolygons[i].polygon.lines.length; j++) {
                let point1 = sortedPolygons[i].polygon.lines[j].point1
                let point2 = sortedPolygons[i].polygon.lines[j].point2
                sortedPolygons[i].polygon.lines[j].point1 = this.graph.applyZoom(point1)
                sortedPolygons[i].polygon.lines[j].point2 = this.graph.applyZoom(point2)
            }
            sortedPolygons[i].polygon.draw(true, false)
        }

        //draw outlines
        for (let i = 0; i < planeLines.length; i++) {
            if (planeLines[i].length != 0) {
                
                for (let j = 0; j < planeLines[i].length; j++) {
                    planeLines[i][j].point1 = this.graph.applyZoom(planeLines[i][j].point1)
                    planeLines[i][j].point2 = this.graph.applyZoom(planeLines[i][j].point2)
                }
                // console.log(planeLines)
                let planePolygon = new Polygon(this.graph, planeLines[i], "red", 1)
                planePolygon.draw(false, true)
            }
        }
    }

    /**
     * sorts polygons by smallest to largest minimum Z value
     * then for all polygons with same minimum Z, sorts by smallest to largest maximum Z value
     * @param {} polygons a list of {polygon: Polygon, minZ: minZ: maxZ: maxZ}
     *                    wherre Polygon is a Polygon Object, and minZ, maxZ are numerical values
     * @returns a sorted array of polygons, first by minZ then by maxZ
     */
    sortPolygons(polygons) {
        //debugger
        //NOT SORTING PROPERLY FOR SOME WEIRD REASON?????!!!
        //7,-7 is failing
        let sortedPolygons = polygons.sort(function(a, b) {
            if (!numEqual(a.minZ, b.minZ, 12)) {
                return a.minZ - b.minZ
            } else if (!numEqual(a.maxZ, b.maxZ, 12)) {
                return a.maxZ - b.maxZ
            } else {
                
                for (let i = 0; i < a.polygon.lines.length; i++) {
                    let pointA = a.polygon.lines[i].point1
                    for (let j = 0; j < b.polygon.lines.length; j++) {
                        let pointB = b.polygon.lines[j].point1
                        if (vectorEquals([pointA[0], pointA[1]], [pointB[0], pointB[1]]) && !numEqual(pointA[2], pointB[2], 12)) {
                            return pointA[2] - pointB[2]
                        }
                    }
                }
                //debugger
                if (!numEqual(a.minZ, b.minZ, 12)) {
                    return a.minZ - b.minZ
                } else if (!numEqual(a.maxZ, b.maxZ, 12)) {
                    return a.maxZ - b.maxZ
                } else {
                    return 0
                }
            }
        })

        // let sortedPolygons = partialSortByMinZ(polygons, 0, polygons.length)
        
        // //need to store all equal minZ polygons by maxZ now //
        // let start = 0 
        // let end = 0
        // let i = 0
        // while (i <= polygons.length) {
        //     if (i != polygons.length && numEqual(polygons[start].minZ, polygons[i].minZ, 12)) {
        //         end = i
        //     } else {
        //         sortedPolygons = partialSortByMaxZ(sortedPolygons, start, end + 1)
        //         start = i
        //         end = i
        //     }
        //     i++
        // }
        // start = 0
        // end = 0
        // i = 0
        // while (i <= polygons.length) {
        //     if (i != polygons.length && numEqual(polygons[start].minZ, polygons[i].minZ, 12) && numEqual(polygons[start].maxZ, polygons[i].maxZ, 12)) {
        //         end = i
        //     } else {
        //         sortedPolygons = partialSortByPointZ(sortedPolygons, start, end + 1)
        //         start = i
        //         end = i
        //     }
        //     i++
        // }

        return sortedPolygons
    }
}


/**
 * sorts the input arr from index [start, end) by smallest to largest minZ value
 * @param {*} arr input array, each element is a record with a minZ field
 * @param {*} start a numerical value
 * @param {*} end a numerical value
 * @requires : start < end
 * @returns the arr with index start inclusive to end exclusive sorted
 */
function partialSortByMinZ(arr, start, end) {
    if (start >= end) {
        throw new Error("start index >= end index!!")
    }
    let preSorted = arr.slice(0, start)
    let postSorted = arr.slice(end);
    let sorted = arr.slice(start, end).sort(function(a, b) {return a.minZ - b.minZ});
    arr.length = 0;
    arr.push.apply(arr, preSorted.concat(sorted).concat(postSorted));
    return arr;
}

/**
 * sorts the input arr from index [start, end) by smallest to largest maxZ value
 * @param {*} arr input array, each element is a record with a maxZ field
 * @param {*} start a numerical value
 * @param {*} end a numerical value
 * @requires : start < end
 * @returns the arr with index start inclusive to end exclusive sorted
 */
function partialSortByMaxZ(arr, start, end) {
    if (start >= end) {
        throw new Error("start index >= end index!!")
    }
    let preSorted = arr.slice(0, start)
    let postSorted = arr.slice(end);
    let sorted = arr.slice(start, end).sort(function(a, b) {return a.maxZ - b.maxZ});
    arr.length = 0;
    arr.push.apply(arr, preSorted.concat(sorted).concat(postSorted));
    return arr;
}

function partialSortByPointZ(arr, start, end) {
    if (start >= end) {
        throw new Error("start index >= end index!!")
    }
    let preSorted = arr.slice(0, start)
    let postSorted = arr.slice(end);
    let sorted = arr.slice(start, end).sort(function(a, b) {
        for (let i = 0; i < a.polygon.lines.length; i++) {
            let pointA = a.polygon.lines[i].point1
            for (let j = 0; j < b.polygon.lines.length; j++) {
                let pointB = b.polygon.lines[j].point1
                if (vectorEquals([pointA[0], pointA[1]], [pointB[0], pointB[1]]) && !numEqual(pointA[2], pointB[2], 12)) {
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
 * turns a 3D point [x, y, z] into the string "x,y,z"
 * @param {*} point an array of [x, y, z]
 * @returns the string "x,y,z"
 */
function pt3DToStr(point) {
    return "" + point[0] + "," + point[1] + "," + point[2]
}

/**
 * 
 * @param {*} plane1 ax+by+cz = d => [a,b,c,d]
 * @param {*} plane2 ax+by+cz = d => [a,b,c,d]
 * @returns intersection vector [dx, dy, dz]
 */
function planePlaneIntersectVector3D(plane1, plane2) {
    // calculate crossproduct => vector perp to both normals => intersetion vector
    // u x v = (u2v3 - u3v2, u3v1-u1v3, u1v2-u2v1)
    let cx = (plane1[1] * plane2[2]) - (plane1[2] * plane2[1])
    let cy = (plane1[2] * plane2[0]) - (plane1[0] * plane2[2])
    let cz = (plane1[0] * plane2[1]) - (plane1[1] * plane2[0])

    // correct fp error to 0 if needed (safer calculations)
    if (numEqual(cx, 0, 12)) {
        cx = 0
    }
    if (numEqual(cy, 0, 12)) {
        cy = 0
    }
    if (numEqual(cz, 0, 12)) {
        cz = 0
    }
    return [cx, cy, cz]
}

//gets in basis zoomed and rotated!!!! change func name later
function getPlaneLines(graph, normal, sideLength, intersection) {
    let a = normal[0]
    let b = normal[1]
    let c = normal[2]
    let d = normal[3]

    if(a == 0 && b == 0 && c == 0) {
        throw new Error("Normal vector is [0,0,0]")
    }

    let planeBasis = getPlaneVectors2D([a, b, c])

    //find offset
    //ax + by + cz = d
    /**
     * ax + d = 0
     * by + d = 0
     * cz + d = 0
     */
    let offsetX = 0
    let offsetY = 0
    let offsetZ = 0
    if (!numEqual(a, 0, 12)) {
        offsetX = d/a
    }
    if (!numEqual(b, 0, 12)) {
        offsetY = d/b
    }
    if (!numEqual(c, 0, 12)) {
        offsetZ = d/c
    }
    let offsetVec = [offsetX, offsetY, offsetZ]
    offsetVec = graph.changeBasisAndRotate(offsetVec)

    let orthanormalBasis = GramSchmidt(planeBasis)
    let basisVec1 = graph.changeBasisAndRotate(orthanormalBasis[0])
    let basisVec2 = graph.changeBasisAndRotate(orthanormalBasis[1])

    // there are gridSize lines on each half axis
    let gridSize = sideLength
    
    let corner1 = vectorAdd(scaleVector(basisVec2, -1 * gridSize), scaleVector(basisVec1, gridSize)) 
    let corner2 = vectorAdd(scaleVector(basisVec2, -1 * gridSize), scaleVector(basisVec1, -1 * gridSize))

    let corner3 = vectorAdd(scaleVector(basisVec2, gridSize), scaleVector(basisVec1, gridSize))
    let corner4 = vectorAdd(scaleVector(basisVec2, gridSize), scaleVector(basisVec1, -1 * gridSize))
    //console.log(this.intersection)
    // if (this.intersection == undefined) {
    //     debugger
    // }
    
    //intersection is the solution of the system (if it exists)
    console.log(intersection)
    intersection = graph.changeBasisAndRotate(intersection)
    corner1 = vectorAdd(corner1, intersection)
    corner2 = vectorAdd(corner2, intersection)
    corner3 = vectorAdd(corner3, intersection)
    corner4 = vectorAdd(corner4, intersection)

    if (vectorEquals([corner1[0], corner1[1]], [corner2[0], corner2[1]]) || vectorEquals([corner1[0], corner1[1]], [corner3[0], corner3[1]])) {
        //plane is not visible
        return []
    } else {
        let line1 = new Line(corner1, corner3, false)
        let line2 = new Line(corner3, corner4, false)
        let line3 = new Line(corner4, corner2, false)
        let line4 = new Line(corner2, corner1, false)

        //remove lines that are 0 length
        let lines = [line1, line2, line3, line4]

        for (let i = 0; i < lines.length; i++) {
            if (vectorEquals(lines[i].point1, lines[i].point2)) {
                return []
            }
        }
        return  lines
    }
}

function getPlaneVectors2D(normal) {
    let a = normal[0]
    let b = normal[1]
    let c = normal[2]

    if(a == 0 && b == 0 && c == 0) {
        throw new Error("Normal vector is [0,0,0]")
    }

    let planeBasis = new Array(2)

    if(!numEqual(a, 0, 12)) {
        // x = -(b/a)y - (c/a)z   |-b/a -c/a|
        // y = y + 0z             |1       0|
        // z = 0y + z             |0       1|
        planeBasis[0] = [(-1 * b/a), 1, 0]
        planeBasis[1] = [(-1 * c/a), 0, 1]
        
    } else if (!numEqual(b, 0, 12)) {
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

    if (!numEqual(0, dotProduct(planeBasis[0], [a,b,c]),12)) {
        let v = dotProduct(planeBasis[0], [a,b,c])
        debugger
    }
    if (!numEqual(0, dotProduct(planeBasis[1], [a,b,c]),12)) {
        let v = dotProduct(planeBasis[1], [a,b,c])
        debugger
    }
    return planeBasis
}



/**
 * this is a line
 */
class Line {
    constructor(point1, point2, inf) {
        this.point1 = point1
        this.point2 = point2
        this.inf = inf
    }


    /**
     * splits obj with otherLine
     * @param {*} otherLine the line to split obj with
     * @param {*} color a truly useless param
     * @returns [] if otherLine does not split obj, 
     *          [line(this.point1, splitPoint), line(splitPoint, this.point2)] if a splitPoint exists
     */
    splitWithLine2D(otherLine, color) {
        //debugger
        const a1 = this.point2[1] - this.point1[1]//line1.abc[0]
        const b1 = this.point1[0] - this.point2[0] //line1.abc[1]
        const c1 = (this.point1[1] * (this.point2[0] - this.point1[0])) - (this.point1[0] * (this.point2[1] - this.point1[1])) //line1.abc[2]

        const a2 = otherLine.point2[1] - otherLine.point1[1]//line2.abc[0]
        const b2 = otherLine.point1[0] - otherLine.point2[0]//line2.abc[1]
        const c2 = (otherLine.point1[1] * (otherLine.point2[0] - otherLine.point1[0])) - (otherLine.point1[0] * (otherLine.point2[1] - otherLine.point1[1])) //line2.abc[2]
        const det = (a1 * b2) - (a2 * b1)

        //check if lines are parrallel
        if (det != 0) {
            let x = ((b1 * c2) - (b2 * c1)) / det
            let y = ((a2 * c1) - (a1 * c2)) / det

            let xMax = Math.max(this.point1[0], this.point2[0])
            let xMin = Math.min(this.point1[0], this.point2[0])
            let yMax = Math.max(this.point1[1], this.point2[1]) 
            let yMin = Math.min(this.point1[1], this.point2[1])

            //dont care if the other line is inf or finite for this algorithm, treating it as finite has issues
            //so always treat otherLine as inf
            if ((!(x > xMax || x < xMin) || numEqual(x, xMax, 12) || numEqual(x, xMin, 12)) && (!(y > yMax || y < yMin) || numEqual(y, yMax, 12) || numEqual(y, yMin, 12))) {

                    let dx = this.point2[0] - this.point1[0]
                    let dy = this.point2[1] - this.point1[1]
                    let dz = this.point2[2] - this.point1[2]

                    //get z coord on line given x, y
                    let t = (x - this.point1[0]) / dx
                    if (numEqual(dx, 0, 12)) {
                        t = (y - this.point1[1]) / dy
                    }

                    let z = this.point1[2] + dz * t
                    let midPoint = [x, y, z]

                    if (vectorEquals(this.point1, midPoint)) {
                        return [new Line(this.point1, this.point1, false), new Line(this.point1, this.point2, false)]
                    } else if (vectorEquals(this.point2, midPoint)) {
                        return [new Line(this.point1, this.point2, false), new Line(this.point2, this.point2, false)]
                    } else {
                        return [new Line(this.point1, midPoint, false), new Line(midPoint, this.point2, false)]
                    }
            }
        }

        return []
    }
}


/**
 * polygon much wow
 */
class Polygon {
    /**
     * 
     * @param {*} graph 
     * @param {*} lines 
     * @param {*} color 
     * @param {*} alpha 
     */
    constructor(graph, lines, color, alpha) {
        this.graph = graph
        //vertices must be in order of a circuit around shape
        this.lines = lines
        this.color = color
        this.alpha = alpha
    }

    /**
     * draws this polygon
     */
    draw(fill, outline) {
        //debugger
        let line = this.lines[0]

        this.graph.ctx.globalAlpha = this.alpha;
        this.graph.ctx.beginPath()
        this.graph.ctx.moveTo(this.graph.centerX + (this.graph.scale * line.point1[0]), this.graph.centerY - (this.graph.scale * line.point1[1]))
        for (let i = 0; i < this.lines.length; i++) {
            line = this.lines[i]
            this.graph.ctx.lineTo(this.graph.centerX + (this.graph.scale * line.point2[0]), this.graph.centerY - (this.graph.scale * line.point2[1]))
        }
        this.graph.ctx.closePath()
        this.graph.ctx.fillStyle = this.color
        if (fill) {this.graph.ctx.fill()}
        
        this.graph.ctx.strokeStyle = "black"
        if (outline) {this.graph.ctx.stroke()}
        
        this.graph.ctx.globalAlpha = 1;


        // let minZVector = this.lines[0].point1
        // for (let i = 1; i < this.lines.length; i++) {
        //     if (this.lines[i].point1[2] < minZVector[2]) {
        //         minZVector = this.lines[i].point1
        //     }
        // }

        // let vector = minZVector
        // let vecX = this.graph.centerX + this.graph.scale * vector[0]
        // let vecY = this.graph.centerY - this.graph.scale * vector[1]

        // //Draw the dot
        // if (this.color == "blue") {
        //     this.graph.ctx.fillStyle = this.color
        //     this.graph.ctx.strokeStyle = this.color
        //     this.graph.ctx.beginPath();
        //         this.graph.ctx.arc(vecX, vecY, 10, 0, 2 * Math.PI);
        //         this.graph.ctx.fill();
        //     this.graph.ctx.stroke();
        // }
        // if (this.color == "red") {
        //     this.graph.ctx.fillStyle = this.color
        //     this.graph.ctx.strokeStyle = this.color
        //     this.graph.ctx.beginPath();
        //         this.graph.ctx.arc(vecX, vecY, 10, 0, 2 * Math.PI);
        //         this.graph.ctx.fill();
        //     this.graph.ctx.stroke();
        // }
    }
}

function LightenDarkenColor(col,amt) {
    var usePound = false;
    if ( col[0] == "#" ) {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col,16);

    var r = (num >> 16) + amt;

    if ( r > 255 ) r = 255;
    else if  (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if ( b > 255 ) b = 255;
    else if  (b < 0) b = 0;
    
    var g = (num & 0x0000FF) + amt;

    if ( g > 255 ) g = 255;
    else if  ( g < 0 ) g = 0;

    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}



