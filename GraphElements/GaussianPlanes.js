
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

//for some reason does not work for non identity normals
class GaussianPlanes {
    constructor(graph, planesStdForm) {
        this.graph = graph
        this.planesStdForm = planesStdForm
    }

    splitPlanes(polygonLines, intersectLines, color, alpha) {
        //debugger
        let output = []
        this._splitPlanesHelper(polygonLines, intersectLines, 0, output, color, alpha)
        return output
    }

    _splitPlanesHelper(polygonLines, intersectLines, intersectLinesIndex, output, color, alpha) {
        //debugger
        //debugger
        if (intersectLines.length == 0 || intersectLinesIndex == intersectLines.length ) {
            //debugger
            let minZ = Number.MAX_VALUE
            for (let i = 0; i < polygonLines.length; i++) {
                let currZ = polygonLines[i].point1[2]
                if (currZ == -0) {
                    currZ = 0
                }
                minZ = Math.min(currZ, minZ)
            }

            let maxZ = -1*Number.MAX_VALUE
            for (let i = 0; i < polygonLines.length; i++) {
                let currZ = polygonLines[i].point1[2]
                if (currZ == -0) {
                    currZ = 0
                }
                maxZ = Math.max(polygonLines[i].point1[2], maxZ)
            }
            output.push({polygon: new Polygon(this.graph, polygonLines, color, alpha, minZ), minZ: minZ, maxZ: maxZ})

        } else {
            
            let interesectLine = intersectLines[intersectLinesIndex]
            let linesWithSplit = new Map()
            
            let splitLinesRef = [] 
            let foundSplitPoints = [] //should always be 2 of these exactly, unless it is a case like standard view, where some planes are not split


            //debugger
            //for all lines in shape check for intersection, split if intersects
            for (let i = 0; i < polygonLines.length; i++) {
                //debugger
                let splitLines = polygonLines[i].splitWithLine2D(interesectLine, color)
                if (splitLines.length != 0) {
                    let splitPt1 = splitLines[0].point1
                    let splitPt2 = splitLines[1].point1
                    
                    if (vectorEquals(splitLines[0].point1, splitLines[0].point2) || vectorEquals(splitLines[1].point1, splitLines[1].point2)) {
                        //case where intersect point is the exact endpoint of a line
                        //debugger
                        if (vectorEquals(splitLines[0].point1, splitLines[0].point2)) {
                            linesWithSplit.set(pt3DToStr(splitLines[0].point1), splitLines[1])
                        } else {
                            linesWithSplit.set(pt3DToStr(splitPt1), new Line(splitPt1, splitLines[1].point2))
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

            if (linesWithSplit.length > 6) {
                debugger
            }

            if (foundSplitPoints.length != 2) {
                //debugger
            }
            // This means the line intersects at a corner resulting in 4 points.
            // We cut it down to two because it doesn't matter.
            let splitPoints = foundSplitPoints
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

            //debugger
            if (splitPoints.length == 2) {
                //case where line does not split plane, ie standard view for example
                //create two new shapes defined by lines.
                //debugger
                let leftPolygonLines = new Array()
                let rightPolygonLines = new Array()
                
                let currPoint = splitLinesRef[0].point2

                if (vectorEquals(splitLinesRef[0].point1, splitLinesRef[0].point2) || vectorEquals(splitLinesRef[1].point1, splitLinesRef[1].point2)) {
                    //case where intersect point is the exact endpoint of a line
                    //debugger
                    if (vectorEquals(splitLinesRef[0].point1, splitLinesRef[0].point2)) {
                        currPoint = splitLinesRef[0].point1
                    } else {
                        currPoint = splitLinesRef[1].point2
                    }
                }

                if (splitPoints[0] == undefined || splitPoints[1] == undefined) {
                    debugger
                }

                //leftPolygonLines.push(linesWithSplit.get(pt3DToStr(currPoint)))
                let i = 0

                //debugger
                while (!vectorEquals(currPoint, splitPoints[0])) {
                    i++
                    leftPolygonLines.push(linesWithSplit.get(pt3DToStr(currPoint)))
                    // try {
                    //     leftPolygonLines.push(linesWithSplit.get(pt3DToStr(currPoint)))
                    // } catch(e) {
                    //     console.log(1)
                    //     console.log(leftPolygonLines)
                    //     console.log(linesWithSplit.get(pt3DToStr(currPoint)))
                    //     debugger
                    // }
                    if (linesWithSplit.get(pt3DToStr(currPoint)) == undefined) {
                        debugger
                    }
                    currPoint = linesWithSplit.get(pt3DToStr(currPoint)).point2
                    if (i > 5) {
                       // debugger
                    }
                }
                leftPolygonLines.push(new Line(currPoint, splitPoints[1], false))

                //debugger
                i = 0
                while (!vectorEquals(currPoint, splitPoints[1])) {
                    i++
                    rightPolygonLines.push(linesWithSplit.get(pt3DToStr(currPoint)))
                    // try {
                    //     rightPolygonLines.push(linesWithSplit.get(pt3DToStr(currPoint)))
                    // } catch(e) {
                    //     console.log(1)
                    //     console.log(rightPolygonLines)
                    //     console.log(linesWithSplit.get(pt3DToStr(currPoint)))
                    //     debugger
                    // }
                    if (linesWithSplit.get(pt3DToStr(currPoint)) == undefined) {
                        debugger
                    }
                    currPoint = linesWithSplit.get(pt3DToStr(currPoint)).point2

                    if (i > 5) {
                        //debugger
                    }
                }
                
                rightPolygonLines.push(new Line(currPoint, splitPoints[0], false))


                if (rightPolygonLines.length > 4 || leftPolygonLines.length > 4) {
                    //debugger
                }

                intersectLinesIndex = intersectLinesIndex + 1
                //debugger
                this._splitPlanesHelper(leftPolygonLines, intersectLines, intersectLinesIndex, output, color, alpha)
                this._splitPlanesHelper(rightPolygonLines, intersectLines, intersectLinesIndex, output, color, alpha)
            } else {
                intersectLinesIndex = intersectLinesIndex + 1
                this._splitPlanesHelper(polygonLines, intersectLines, intersectLinesIndex, output, color, alpha)
            }
        }
    }

    //plane is defined by (a, b, c, d) => ax + by + cz = d
    getPlanePlaneIntersectLine(plane1, plane2) {
        if (plane1.length != plane2.length) {
            throw new Error("planes must be same dimension!")
        }

        // u x v = (u2v3 - u3v2, u3v1-u1v3, u1v2-u2v1)
        let cx = (plane1[1] * plane2[2]) - (plane1[2] * plane2[1])
        let cy = (plane1[2] * plane2[0]) - (plane1[0] * plane2[2])
        let cz = (plane1[0] * plane2[1]) - (plane1[1] * plane2[0])
        let intersectVector = [cx, cy, cz]

        //find a point of intersection between two planes
        let gaussElimSteps = gaussianElimination(transpose([plane1.concat(0), plane2.concat(0)]))
        let point1 = new Array(3)
        let point2 = new Array(3)
        for (let i = 0; i < 3; i++) {
            point1[i] = 0
            point2[i] = 0
        }
        let reducedEchelon = gaussElimSteps[gaussElimSteps.length - 1]
        
        for (let row = 0; row < 2; row++) {
            let col = 0
            while (col < 3 && reducedEchelon[col][row] == 0) {
                col++
            }

            if (col == 2) {
                // no solution
                return []
            } else if (col != 3) {
                //console.log("should be 1: " + reducedEchelon[col][row])
                point1[col] = reducedEchelon[reducedEchelon.length - 1][row]
            }
        }
        for (let i = 0; i < 3; i++) {
            point2[i] = point1[i] + intersectVector[i]
        }


        let t
        if (intersectVector[0] == 0) {
            t = point1[1] / intersectVector[1]
        } else if (intersectVector[1] == 0) {
            t = point1[2] / intersectVector[2]
        } else {
            t = point1[0] / intersectVector[0]
        }
        let x = point1[0] - (t * intersectVector[0])
        let y = point1[1] - (t * intersectVector[1])
        let z = point1[2] - (t * intersectVector[2])

        // if (!vectorEquals([x, y, z], [0,0,0])) {
        //     debugger
        // }





        return new Line(point1, point2, true)
        // return new Line(this.graph.changeBasisZoomAndRotate(point1), this.graph.changeBasisZoomAndRotate(point2), true)
    }

    draw() {
        //debugger
        let planeLines = new Array(this.planesStdForm.length)
        // let colors = ["red", "green", "blue"]
        for (let i = 0; i < this.planesStdForm.length; i++) {
            planeLines[i] = getPlaneLines(this.graph, this.planesStdForm[i], 10)

        }

        //debugger
        //WARNING< assumes that all planes do interesect, need to take care of [] return case!!!!
        // this affects the splitPlanes base case!!!

        let intersect12 = this.getPlanePlaneIntersectLine(this.graph.changeBasisAndRotate(this.planesStdForm[0]), this.graph.changeBasisAndRotate(this.planesStdForm[1]))
        let intersect13 = this.getPlanePlaneIntersectLine(this.graph.changeBasisAndRotate(this.planesStdForm[0]), this.graph.changeBasisAndRotate(this.planesStdForm[2]))
        let intersect23 = this.getPlanePlaneIntersectLine(this.graph.changeBasisAndRotate(this.planesStdForm[1]), this.graph.changeBasisAndRotate(this.planesStdForm[2]))

        // if (intersect12.length != 0) {
        //     intersect12.point1 = this.graph.changeBasisZoomAndRotate(intersect12.point1)
        //     intersect12.point2 = this.graph.changeBasisZoomAndRotate(intersect12.point2)
        // }
        // if (intersect13.length != 0) {
        //     intersect13.point1 = this.graph.changeBasisZoomAndRotate(intersect13.point1)
        //     intersect13.point2 = this.graph.changeBasisZoomAndRotate(intersect13.point2)
        // }
        // if (intersect23.length != 0) {
        //     intersect23.point1 = this.graph.changeBasisZoomAndRotate(intersect23.point1)
        //     intersect23.point2 = this.graph.changeBasisZoomAndRotate(intersect23.point2)
        // }

        // console.log("S")
        // console.log(intersect12)
        // console.log(intersect13)
        // console.log(intersect23)
        // console.log("E")

        //debugger
        // console.log(intersect12)
        // console.log()


        let polygons = []
        if (planeLines[0].length != 0) {
            polygons = polygons.concat(this.splitPlanes(planeLines[0], [intersect12, intersect13], "red", 0.5))
        }
        if (planeLines[1].length != 0) {
            polygons = polygons.concat(this.splitPlanes(planeLines[1], [intersect12, intersect23], "blue", 0.5))
        }
        if (planeLines[2].length != 0) {
            polygons = polygons.concat(this.splitPlanes(planeLines[2], [intersect13, intersect23], "green", 0.5))
        }
        
        //console.log(polygons)
        let sortedPolygons = this.sortPolygons(polygons)


        console.log("S")  
        console.log(sortedPolygons)
        console.log(this.graph.changeBasisZoomAndRotate(this.planesStdForm[0]) + ", " + this.graph.changeBasisZoomAndRotate(this.planesStdForm[1]) + ", " + this.graph.changeBasisZoomAndRotate(this.planesStdForm[2]))
        // for (let i = 0; i < polygons.length; i++) {
        //     sortedPolygons[i].polygon.draw()
        // }
        for (let i = 0; i < sortedPolygons.length; i++) {
            for (let j = 0; j < sortedPolygons[i].polygon.lines.length; j++) {
                sortedPolygons[i].polygon.lines[j].point1 = this.graph.applyZoom(sortedPolygons[i].polygon.lines[j].point1)
                sortedPolygons[i].polygon.lines[j].point2 = this.graph.applyZoom(sortedPolygons[i].polygon.lines[j].point2)
            }
            sortedPolygons[i].polygon.draw()
        }
        
    }

    sortPolygons(polygons) {
        let sortedPolygons = partialSortByMinZ(polygons, 0, polygons.length)
        
        //need to store all equal minZ polygons by maxZ now //
        let start = 0 
        let end = 0
        let i = 0
        while (i <= polygons.length) {
            if (i != polygons.length && numEqual(polygons[start].minZ, polygons[i].minZ, 12)) {
                end = i
            } else {
                sortedPolygons = partialSortByMaxZ(sortedPolygons, start, end + 1)
                start = i
                end = i
            }
            i++
        }

        return sortedPolygons
    }
}



function partialSortByMinZ(arr, start, end) {
    //debugger
    let preSorted = arr.slice(0, start)
    let postSorted = arr.slice(end);
    let sorted = arr.slice(start, end).sort(function(a, b) {return a.minZ - b.minZ});
    arr.length = 0;
    arr.push.apply(arr, preSorted.concat(sorted).concat(postSorted));
    return arr;
}

function partialSortByMaxZ(arr, start, end) {
    let preSorted = arr.slice(0, start)
    let postSorted = arr.slice(end);
    let sorted = arr.slice(start, end).sort(function(a, b) {return a.maxZ - b.maxZ});
    arr.length = 0;
    arr.push.apply(arr, preSorted.concat(sorted).concat(postSorted));
    return arr;
}


function pt3DToStr(point) {
    return "" + point[0] + "," + point[1] + "," + point[2]
}

//gets in basis zoomed and rotated!!!! change func name later
function getPlaneLines(graph, normal, sideLength) {
    //ax + by + cz = 0

    // x = (-b(1)-c(1))/a
    // y = (-c(1)-a(4))/b
    
    // 0x + 0y + 1z = 0
    // cz = -ax-by
    // 
    // ax = ax + 0y     |1       0|
    // by = 0x + by     |0       1|
    // cz = -ax -by     |-a/c -b/c|
    //then get perp basis...
    // 
    let a = normal[0]
    let b = normal[1]
    let c = normal[2]

    if(a == 0 && b == 0 && c == 0) {
        throw new Error("Normal vector is [0,0,0]")
    }

    let planeBasis = new Array(2)

    if(a != 0) {
        // x = -(b/a)y - (c/a)z   |-b/a -c/a|
        // y = y + 0z             |1       0|
        // z = 0y + z             |0       1|
        
        planeBasis[0] = [(-1 * b/a), 1, 0]
        planeBasis[1] = [(-1 * c/a), 0, 1]
        
    } else if (b != 0) {
        // x = x + 0z             |1       0|
        // y = -(a/b)x - (c/b)z   |-a/b -c/b|
        // z = 0x + z             |0       1|
        
        planeBasis[0] = [1,(-1 * a/b),0]
        planeBasis[1] = [0,(-1 * b/c),1]
        
    } else {
        // x = x                  |1       0|
        // y = y                  |0       1|
        // z = -(a/c)x - (b/c)y   |-a/c -b/c|

        planeBasis[0] = [1,0,-a/c]
        planeBasis[1] = [0,1,-b/c]
    }

    let orthanormalBasis = GramSchmidt(planeBasis)
    let basisVec1 = graph.changeBasisAndRotate(orthanormalBasis[0])
    let basisVec2 = graph.changeBasisAndRotate(orthanormalBasis[1])




    // there are gridSize lines on each half axis
    let gridSize = sideLength
    //this.graph.drawPointToPoint([3,3, 0], [10,3, 0], "green", 3)

    // let xAxisVec = this.changeBasisZoomAndRotate([gridSize,0,0])
    // let yAxisVec = this.changeBasisZoomAndRotate([0,gridSize,0])
    
    let corner1 = vectorAdd(scaleVector(basisVec2, -1 * gridSize), scaleVector(basisVec1, gridSize))
    let corner2 = vectorAdd(scaleVector(basisVec2, -1 * gridSize), scaleVector(basisVec1, -gridSize))

    let corner3 = vectorAdd(scaleVector(basisVec2, gridSize), scaleVector(basisVec1, gridSize))
    let corner4 = vectorAdd(scaleVector(basisVec2, gridSize), scaleVector(basisVec1, -gridSize))

    // corner1 = scaleVector(corner1, graph.scale)
    // corner2 = scaleVector(corner2, graph.scale)
    // corner3 = scaleVector(corner3, graph.scale)
    // corner4 = scaleVector(corner4, graph.scale)
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

        // for (let i = 0; i < lines.length; i++) {
        //     if (!vectorEquals(lines[i].point1, lines[i].point2)) {
        //         output.push(lines[i])
        //     }
        // }
        for (let i = 0; i < lines.length; i++) {
            if (vectorEquals(lines[i].point1, lines[i].point2)) {
                return []
            }
        }
        return  lines
    }
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


    //can only be done on a finite line!!!, might just remove this.inf field entirely
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

            if (x > Math.max(this.point1[0], this.point2[0])) {
                let i = 0
            }
            if (x < Math.min(this.point1[0], this.point2[0])) {
                let i = 0
            }
            if (y > Math.max(this.point1[1], this.point2[1])) {
                let i = 0
            }
            if (y < Math.min(this.point1[1], this.point2[1])) {
                let i = 0
            }

            let xMax = Math.max(this.point1[0], this.point2[0])
            let xMin = Math.min(this.point1[0], this.point2[0])
            let yMax = Math.max(this.point1[1], this.point2[1]) 
            let yMin = Math.min(this.point1[1], this.point2[1])
            
            if ((!(x > xMax || x < xMin) || numEqual(x, xMax, 12) || numEqual(x, xMin, 12)) && (!(y > yMax || y < yMin) || numEqual(y, yMax, 12) || numEqual(y, yMin, 12))) {

                    // if (color == "red") {
                    //     console.log("x: " + x + ", xMax: " + xMax +", xMin: " + xMin + " y: " + x + ", yMax: " + yMax +", yMin: " + yMin)
                    // }
                    let dx = this.point2[0] - this.point1[0]
                    let dy = this.point2[1] - this.point1[1]
                    let dz = this.point2[2] - this.point1[2]

                    //get z coord on line given x, y
                    let t = (x - this.point1[0]) / dx
                    if (dx == 0) {
                        t = (y - this.point1[1]) / dy
                    }

                    let z = this.point1[2] + dz * t

                    let midPoint = [x, y, z]

                    // if ((numEqual(x, xMax, 12) || numEqual(x, xMin, 12)) && (numEqual(y, yMax, 12) || numEqual(y, yMin, 12))) {
                    //     return []
                    // } else {
                    if (vectorEquals(this.point1, midPoint)) {
                        return [new Line(this.point1, this.point1, false), new Line(this.point1, this.point2, false)]
                    } else if (vectorEquals(this.point2, midPoint)) {
                        return [new Line(this.point1, this.point2, false), new Line(this.point2, this.point2, false)]
                    } else {
                        return [new Line(this.point1, midPoint, false), new Line(midPoint, this.point2, false)]
                    }
                    //}
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
     * @param {*} vertices a set of R3 vertices that define the polygon
     * @requires : something to do with vertex ordering so that canvas draws correctly, idk what this is
     *             ABSOLUTELY Must be that vertices go either clockwise or counterclockwise around boundary of polygon!!!!
     */
    constructor(graph, lines, color, alpha, minZ) {
        this.graph = graph
        //vertices must be in order of a circuit around shape
        this.lines = lines
        this.color = color
        this.alpha = alpha
        this.minZ = minZ
    }

    draw() {
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
        this.graph.ctx.fill()
        this.graph.ctx.globalAlpha = 1;

        let minZVector = this.lines[0].point1
        for (let i = 1; i < this.lines.length; i++) {
            if (this.lines[i].point1[2] < minZVector[2]) {
                minZVector = this.lines[i].point1
            }
        }

        let vector = minZVector
        let vecX = this.graph.centerX + this.graph.scale * vector[0]
        let vecY = this.graph.centerY - this.graph.scale * vector[1]

        //Draw the dot
        if (this.color == "blue") {
            this.graph.ctx.fillStyle = this.color
            this.graph.ctx.strokeStyle = this.color
            this.graph.ctx.beginPath();
                this.graph.ctx.arc(vecX, vecY, 10, 0, 2 * Math.PI);
                this.graph.ctx.fill();
            this.graph.ctx.stroke();
        }
        if (this.color == "red") {
            this.graph.ctx.fillStyle = this.color
            this.graph.ctx.strokeStyle = this.color
            this.graph.ctx.beginPath();
                this.graph.ctx.arc(vecX, vecY, 10, 0, 2 * Math.PI);
                this.graph.ctx.fill();
            this.graph.ctx.stroke();
        }
    }
}



