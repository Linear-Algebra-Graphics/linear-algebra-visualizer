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
        this.numOfGraphUnitsEdgeToEdge = this.canvas.width / 60;
        this.scale = this.canvas.width / this.numOfGraphUnitsEdgeToEdge
        this.backgroundColor = "white"
        // I matrix is default
        this.basis = [[1,0,0],[0,1,0],[0,0,1]]
        this.defaultZoom = 1
        this.currentZoom = 1
        this.zoomIncrement = 1.1
        this.maxZoom = 28000000//730000
        this.minZoom = 0
        
        //this.finalBasis                = [[0.44838321609003245,0.8938414241512637,0],[-0.3586652681480998,0.17991948245712944,-0.9159629933881666],[-0.8187256664799333, 0.41070243279483926,0.4012627502564743]]//[[1,1,0],[1,1,0],[0,0,1]]
        
        this.finalBasis = [[0,1,0],[-1,0,0],[0,0,1]]
        // this.finalBasis = [[0,2,0],[-2,0,0],[0,0,2]]
        // this.finalBasis = [[0,.5,0],[-.5,0,0],[0,0,.5]]
        // this.finalBasis = [[2,0,0],[0,2,0],[0,0,2]]
        // this.finalBasis = [[2,1,0],[0,1,0],[0,0,1]]
        // this.finalBasis = [[2,.5,0],[1,1,0],[0,0,1]]


        this.animationPercentage       = 0
        this.animationTickAdd          = 1/300
        this.currentlyAnimating        = false
        
        this.xRotationMatrix           = [[1,0,0],[0,1,0],[0,0,1]]
        this.yRotationMatrix           = [[1,0,0],[0,1,0],[0,0,1]]
        this.zRotationMatrix           = [[1,0,0],[0,1,0],[0,0,1]]

        //this.basis                     = [[Math.cos(Math.PI/4),Math.sin(Math.PI/4),0],[-1*Math.sin(Math.PI/4),Math.cos(Math.PI/4),0],[0,0,1]]
        
        this.Axis                      = new Axis(this, "blue", "red", "green", "black", 10)
        this.Grid                      = new Grid(this, 10)
        this.showAxis                  = true
        this.showGrid                  = true
        this.infiniteAxis              = false
        

        //gaussian planes stuff
        this.gaussianPlanes            = undefined 
        this.animatingGaussianPlanes    = false
        this.gaussAnimationPercentage  = 0
        this.gaussAnimationTick        = 1/150
        this.SUV                       = undefined
        this.augmented2                = undefined
        this.animatedRowsQueue         = []
    }

     /**
     *  <label>Show Grid</label>
                    <input type="checkbox" class="show-grid-checkbox" checked></input>

                    <button id="defaultZoom" class="default-zoom-button"> default zoom </button>
     * 
     */

    /**
     * 
     * @param {*} finalMatrix 
     * @param {*} fps 
     */
    setAnimationTo(finalMatrix, fps) {
        if (this.gaussianPlanes === undefined) {
            throw new Error("idiot")
        } 

        //determine start and end matrices
        this.augmented2 = finalMatrix
        let augmented1 = this.gaussianPlanes.planesStdForm

        //figure out which rows need to be animated.
        let rows = []
        for (let i = 0; i < augmented1.length; i++) {
            let v1 = Array.from(this.augmented2[i])
            let v2 = Array.from(augmented1[i])
            normalizeVector(v1)
            normalizeVector(v2)

            if (!vectorEquals(v1, v2, 12)) {
                rows.push(i)
            }
        }

        let a = normalizeVector(arrayFirstN(augmented1[index], 3));
        let b = normalizeVector(arrayFirstN(this.augmented2[index], 3));
        //ref: https://math.stackexchange.com/questions/180418/calculate-rotation-matrix-to-align-vector-a-to-vector-b-in-3d/
        let v = crossProductR3(a, b);
        let s = vectorNormL2(v);
        let c = dotProduct(a, b);

        //this is the 3x3 skew-symmetric cross-product matrix of v
        let vx = [[0, v[2], -1*v[1]],[-1*v[2], 0, v[0]],[v[1], -1*v[0], 0]]

        let I = [[1,0,0],[0,1,0],[0,0,1]];

        let factor = (1 - c) / (s * s);

        let vx2 = matrixMultiplication(vx, vx);
        let scaledVx2 = scaleMatrix(vx2, factor);

        let matrixR = addMatrices(addMatrices(I, vx), scaledVx2);

        let A = transpose(matrixR)
        let SUV = SVD(A)
        this.SUV = SUV
    }

    
    
    animateGaussianPlanes(augmented1, augmented2, index, center) {
        //debugger
        //should only work for systems that have a solution.
        //first find the transformation matrix??
        // let a = normalizeVector(arrayFirstN(augmented1[index], 3));
        // let b = normalizeVector(arrayFirstN(augmented2[index], 3));
        // //ref: https://math.stackexchange.com/questions/180418/calculate-rotation-matrix-to-align-vector-a-to-vector-b-in-3d/
        // let v = crossProductR3(a, b);
        // let s = vectorNormL2(v);
        // let c = dotProduct(a, b);

        // //this is the 3x3 skew-symmetric cross-product matrix of v
        // let vx = [[0, v[2], -1*v[1]],[-1*v[2], 0, v[0]],[v[1], -1*v[0], 0]]

        // let I = [[1,0,0],[0,1,0],[0,0,1]];

        // let factor = (1 - c) / (s * s);

        // let vx2 = matrixMultiplication(vx, vx);
        // let scaledVx2 = scaleMatrix(vx2, factor);

        // let matrixR = addMatrices(addMatrices(I, vx), scaledVx2);

        // let A = transpose(matrixR)
        // let SUV = SVD(A)
        let S = this.SUV[0]
        let U = transpose(this.SUV[1])
        let V = transpose(this.SUV[2])

        let R = matrixMultiplication(U, transpose(V))
        let angles  = this._decomposeRotation(R)

        for (let i = 0; i < angles.length - 1; i++) {
            angles[i] = angles[i] * this.gaussAnimationPercentage
        }

        let E = Array(3)
        for (let i = 0; i < 3; i++) {
            E[i] = Array(3).fill(0)
        }

        for(let i = 0; i < E.length; i++) {
            if (S[i] > 1) {
                E[i][i] = 1 + ((S[i] - 1) * this.gaussAnimationPercentage)
            } else {
                E[i][i] = 1 - ((1 - S[i]) * this.gaussAnimationPercentage)
            }
        }

        let transitionR = this._makeRotationMatrix(angles[0], angles[1], angles[2])
        let transitionS = matrixMultiplication(V, matrixMultiplication(E, transpose(V)))
        //if must be before animate percentage update!!!
        if (this.gaussAnimationPercentage >= 1) {
            console.log("done")
            this.animatingGaussianPlanes = false
            this.gaussianPlanes = new GaussianPlanes(this, augmented2, this.gaussianPlanes.planeColors, this.gaussianPlanes.cubeBoundPlanes)
        } else {
            this.gaussAnimationPercentage += this.gaussAnimationTick
        
            let vec = matrixVectorMultiplication(matrixMultiplication(transitionR, transitionS), a)
            let newD = dotProduct(vec, this.gaussianPlanes.solution)
            vec.push(newD)
            augmented1[index] = vec
            this.gaussianPlanes = new GaussianPlanes(this, augmented1, this.gaussianPlanes.planeColors, this.gaussianPlanes.cubeBoundPlanes)
        }
        
    }

    animateChangeOfBasis() {
        // debugger
        let SUV = SVD(transpose(this.finalBasis))
        
        // S doesn't need to be transposed because its diagonal
        let S = SUV[0]
        let U = transpose(SUV[1])
        let V = transpose(SUV[2])
        //debugger

        //console.log(y)
        //console.log(matrixMultiplication(U, matrixMultiplication(E, transpose(V))))

        // Polar decomp -> A = U E V^T = U V^T V E V^T = (U*V^T) (V E V^T) = U P
        // I will use U = R (Rotation) and P = S (Scale) 
        
        // U * V^T
        let R = matrixMultiplication(U, transpose(V))
        // V E V^T
        // let S = matrixMultiplication(V, matrixMultiplication(E, transpose(V)))

        let angles  = this._decomposeRotation(R)

        // -1 since last term is error
        for (let i = 0; i < angles.length - 1; i++) {
            angles[i] = angles[i] * this.animationPercentage
        }
        
        // We need to start at the I basis. So we need to go FROM 1 TO the singular value
        // in a smooth way.
        let E = Array(3)
        for (let i = 0; i < 3; i++) {
            E[i] = Array(3).fill(0)
        }

        for(let i = 0; i < E.length; i++) {
            if (S[i] > 1) {
                E[i][i] = 1 + ((S[i] - 1) * this.animationPercentage)
            } else {
                E[i][i] = 1 - ((1 - S[i]) * this.animationPercentage)
            }
        }
        console.log(E)


        let transitionR = this._makeRotationMatrix(angles[0], angles[1], angles[2])
        let transitionS = matrixMultiplication(V, matrixMultiplication(E, transpose(V)))
        //if must be before animate percentage update!!!
        if (this.animationPercentage > 1) {
            this.currentlyAnimating = false
        }
        
        this.animationPercentage += this.animationTickAdd
        
        this.basis = matrixMultiplication(transitionR, transitionS)
        this.addObject(new Dot(this, matrixVectorMultiplication(this.basis, [1,0,0]), "blue", 3))
        this.addObject(new Dot(this, matrixVectorMultiplication(this.basis, [0,1,0]), "red", 3))
        this.addObject(new Dot(this, matrixVectorMultiplication(this.basis, [0,0,1]), "green", 3))
    }


    /**
     * decomposes rotation matrix into x, y, z rotation angles 
     * @param {*} R rotation matrix to decompose
     * @returns an array of [xTheta, yTheta, zTheta, errorFromR]
     */
    _decomposeRotation(R) {
        // This is the rotation matrix where: R = Y X Z, where X, Y, and Z are
        // rotation matrcies that rotate around that axis.
        //     
        //     | sin(x)sin(y)sin(z)+cos(y)cos(z)  sin(x)sin(y)cos(z)-cos(y)sin(z)  cos(x)sin(y) |
        // R = | cos(x)sin(z)                     cos(x)cos(z)                     -sin(x)      |
        //     | sin(x)cos(y)sin(z)-sin(y)cos(z)  sin(x)cos(y)cos(z)+sin(y)sin(z)  cos(x)cos(y) |
        //     

        let xTheta = Math.abs( Math.asin(-R[2][1])                 )
        // console.log(xTheta)

        let yTheta = Math.abs( Math.asin(R[2][0]/Math.cos(xTheta)) )
        let zTheta = Math.abs( Math.acos(R[1][1]/Math.cos(xTheta)) )
        
        //                      [xTheta, yTheta, zTheta, error]
        let lowestErrorAngles = [undefined, undefined, undefined, Number.MAX_SAFE_INTEGER]
        
        // Goes through all possible signs of the angles. We only know the abs of them
        // so we need to check everything
        for (let i = -1; i < 3; i=i+2) {
            for (let j = -1; j < 3; j=j+2) {
                for (let k = -1; k < 3; k=k+2) {
                    
                    xTheta = i * xTheta
                    yTheta = j * yTheta
                    zTheta = k * zTheta
                    
                    // console.log("ijk: " + xTheta + " " + yTheta+ " " + zTheta)

                    let sumSquaredError = this._sumSquaredError(R, this._makeRotationMatrix(xTheta, yTheta, zTheta))
                    //console.log(sumSquaredError)
                    // console.log(R)
                    // console.log(this._makeRotationMatrix(xTheta, yTheta, zTheta))
                    // console.log("Error: " + sumSquaredError)
                    //console.log("---------\n---------")

                    if (lowestErrorAngles[3] > sumSquaredError) {
                        lowestErrorAngles = [xTheta, yTheta, zTheta, sumSquaredError]
                    }
                }
            }
        }

        if (lowestErrorAngles[3] > 0.0001) {
            console.log("%c" + "LOWEST ERROR IS ABOVE 0.0001... \nERROR: " + lowestErrorAngles[3], "color: red; background: black;")
        }

        return lowestErrorAngles
        
    }

    // returns the sum squared error of the differences between entries of input matrix with matrix R
    // R is deifned in _decomposeRotation
    _sumSquaredError(matrix1, matrix2) {
        if (matrix1.length != matrix2.length) {
            throw new Error("_sumSquareError matrices different size")
        }
        if (matrix1[0].length != matrix1.length || matrix2[0].length != matrix2.length) {
            throw new Error("matrices not square")
        }
        if (matrix1.length == 0 || matrix2.length == 0) {
            return 0
        }

        let sumSquaredError = 0
        
        for (let i = 0; i < matrix1.length; i++) {
            for (let j = 0; j < matrix1[i].length; j++) {
                sumSquaredError += Math.pow((matrix1[j][i] - matrix2[j][i]), 2)
            }
        }
        return sumSquaredError
    }

    //sometimes my genius scares me....
    
    //     
    //     | sin(x)sin(y)sin(z)+cos(y)cos(z)  sin(x)sin(y)cos(z)-cos(y)sin(z)  cos(x)sin(y) |
    // R = | cos(x)sin(z)                     cos(x)cos(z)                     -sin(x)      |
    //     | sin(x)cos(y)sin(z)-sin(y)cos(z)  sin(x)cos(y)cos(z)+sin(y)sin(z)  cos(x)cos(y) |
    //     
    _makeRotationMatrix (x, y, z) {
        let rotation = Array(3)
        rotation[0]  = Array(3)
        rotation[1]  = Array(3)
        rotation[2]  = Array(3)

        
        rotation[0][0] = Math.sin(x) * Math.sin(y) * Math.sin(z) + Math.cos(y) * Math.cos(z)
        rotation[0][1] = Math.cos(x) * Math.sin(z)
        rotation[0][2] = Math.sin(x) * Math.cos(y) * Math.sin(z) - Math.sin(y) * Math.cos(z)

        rotation[1][0] = Math.sin(x) * Math.sin(y) * Math.cos(z) - Math.cos(y) * Math.sin(z)
        rotation[1][1] = Math.cos(x) * Math.cos(z)
        rotation[1][2] = Math.sin(x) * Math.cos(y) * Math.cos(z) + Math.sin(y) * Math.sin(z)

        rotation[2][0] = Math.cos(x) * Math.sin(y)
        rotation[2][1] = -1 * Math.sin(x)
        rotation[2][2] = Math.cos(x) * Math.cos(y)
        
        return rotation
    }


    /**
     * zooms in graph view
     */
    zoomIn() {
        if (this.currentZoom < this.maxZoom) {
            this.currentZoom = this.currentZoom * this.zoomIncrement 
        }
    }

    /**
     * zooms out in graph view
     */
    zoomOut() {
        if (this.currentZoom > this.minZoom) {
            this.currentZoom =this.currentZoom / this.zoomIncrement 
        }
    }

    /**
     * returns zoom to default 1x zoom
     */
    setDefaultZoom() {
        //should be animation back to default zoom
        this.currentZoom = this.defaultZoom
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
        // debugger
        // Clear screen / add background
        this.ctx.fillStyle = this.backgroundColor
        this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);

        if(this.currentlyAnimating) {
            this.animateChangeOfBasis()
        }

        if (this.animatingGaussianPlanes) {
            this.animateGaussianPlanes([[1,1/2,5/8,3],[0,-5/12,-5/16,-3/2],[-1/2,0,-1,-1]], [[1,1/2,5/8,3],[0,-5/12,-5/16,-3/2],[0,1/4,-11/16,1/2]], 2, [38/35,114/35,16/35])
        }
        
        if (this.showGrid) {
            this.Grid.draw()
        }

        if (this.gaussianPlanes != undefined) {
            this.gaussianPlanes.draw()

            if (this.gaussianPlanes.hasSingleSolution) {
                // let vector = [130,122,0]//([-1*(this.canvas.width/(2 *this.scale * this.currentZoom)) + (20/(this.scale*this.currentZoom)), 
                                        //(this.canvas.height/(2 *this.scale * this.currentZoom)) - (120/(this.scale*this.currentZoom)), 0], 
                                        //this.currentZoom)
                let vecX = 20
                let vecY = 122

                // Draw the dot
                this.ctx.fillStyle = "white"
                this.ctx.lineWidth = 4;
                this.ctx.strokeStyle = "black"
                this.ctx.beginPath();
                    this.ctx.arc(parseInt(vecX.toFixed(0)), parseInt(vecY.toFixed(0)), 8, 0, 2 * Math.PI);
                    this.ctx.fill();
                this.ctx.stroke();

                this.ctx.font = "30px Arial";
                this.ctx.fillStyle = "black"
                this.ctx.textAlign = "center"
                this.ctx.fillText("Solution point", 130, 124);
            }
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

        let x1 = point1[0]
        let y1 = point1[1]
        let x2 = point2[0]
        let y2 = point2[1]

        try {
            x1.toFixed(0)
        } catch (e) {
            console.log(e)
            debugger
        }

        this.ctx.beginPath()
            this.ctx.moveTo(parseInt(x1.toFixed(0)), parseInt(y1.toFixed(0)))
            this.ctx.lineTo(parseInt(x2.toFixed(0)), parseInt(y2.toFixed(0)))
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

        this.drawLine([parseInt(startX.toFixed(0)), parseInt(startY.toFixed(0))],[parseInt(endX.toFixed(0)), parseInt(endY.toFixed(0))], color, lineWidth)
    }

    
    /**
     * draws a dot at the endpoint of given vector
     * @param {*} vector vector on which to draw
     * @param {*} color color of dot
     * @param {*} size radius of dot
     */
    drawDotFromVector(vector, fillColor, outlineColor, size) {
        vector = this.changeBasisZoomAndRotate(vector)

        let vecX = this.centerX + this.scale * vector[0]
        let vecY = this.centerY - this.scale * vector[1]

        // Draw the dot
        this.ctx.fillStyle = fillColor
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = outlineColor
        this.ctx.beginPath();
            this.ctx.arc(parseInt(vecX.toFixed(0)), parseInt(vecY.toFixed(0)), size, 0, 2 * Math.PI);
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
        
        updatedVector     = matrixVectorMultiplication(this.zRotationMatrix, updatedVector)
        updatedVector     = matrixVectorMultiplication(this.xRotationMatrix, updatedVector)
        updatedVector     = matrixVectorMultiplication(this.yRotationMatrix, updatedVector)

        updatedVector     = scaleVector(updatedVector, this.currentZoom)
        return updatedVector
    }

    //BEGIN FOR TESTING ONLY
    changeBasisAndRotate(vector) {
        let updatedVector = matrixVectorMultiplication(this.basis, vector)
        updatedVector     = matrixVectorMultiplication(this.zRotationMatrix, updatedVector)
        updatedVector     = matrixVectorMultiplication(this.xRotationMatrix, updatedVector)
        updatedVector     = matrixVectorMultiplication(this.yRotationMatrix, updatedVector)
        return updatedVector
    }

    applyZoom(vector) {
        let updatedVector = scaleVector(vector, this.currentZoom)
        return updatedVector
    }
    //END FOR TESTING PURPOSES ONLY
    
    /**
     * 
     * @param {*} theta 
     */
    rotateAboutZ(theta) {
        let x_rotation = [Math.cos(theta), Math.sin(theta), 0 ]
        let y_rotation = [-1* Math.sin(theta), Math.cos(theta), 0]
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


    xAxisVisible() {
        let upperBound = 0.0000000000001
        let lowerBound = -0.0000000000001
        let xAxis = this.changeBasisAndRotate([1, 0, 0])
        let x = xAxis[0]
        let y = xAxis[1]
        // if (x <= upperBound && x >= lowerBound) {
        //     x = 0
        // }
        // if (y <= upperBound && y >=lowerBound) {
        //     y = 0
        // }
        return !vectorEquals([x, y, 1], [0, 0, 1], 10)
    }

    yAxisVisible() {
        let upperBound = 0.0000000000001
        let lowerBound = -0.0000000000001
        let yAxis = this.changeBasisAndRotate([0, 1, 0])
        let x = yAxis[0]
        let y = yAxis[1]
        // if (x <= upperBound && x >= lowerBound) {
        //     x = 0
        // }
        // if (y <= upperBound && y >=lowerBound) {
        //     y = 0
        // }
        return !vectorEquals([x, y, 1], [0, 0, 1], 10)
    }

    zAxisVisible() {
        let upperBound = 0.0000000000001
        let lowerBound = -0.0000000000001
        let zAxis = this.changeBasisAndRotate([0, 0, 1])
        let x = zAxis[0]
        let y = zAxis[1]
        // if (x <= upperBound && x >= lowerBound) {
        //     x = 0
        // }
        // if (y <= upperBound && y >=lowerBound) {
        //     y = 0
        // }
        return !vectorEquals([x, y, 1], [0, 0, 1], 10)
    }

    /**
     * 
     * @returns true if z axis is not directly facing front of graph
     */
    zVisible() {
        return !(this.basis[2][0] == 0 && this.basis[2][1] == 0)
    }
    /**
     * finds if point is outside the graph canvas or not
     * @param {*} point point to check for outside canvas
     * @returns true if outside graph canvas, else false
     */
    outSideCanvas(point) {
        return (point[0] < 0 || point[0] > this.canvas.width) || (point[1] < 0 || point[1] > this.canvas.height)
    }

    /**
     * returns the euclidean distance from point to the graph center
     * @param {*} point point to get distance of
     * @returns distance of point to graph center
     */
    distToGraphCenter(point) {
        let x = this.centerX
        let y = this.centerY
        return Math.abs( Math.sqrt( Math.pow(point[0] - x, 2) + Math.pow(point[1] - y, 2)) )
    }

}

/**
 * why is this green?
 * @param {*} a
 * @param {*} b 
 */
function getTransformationMatrix(a, b) {
    //ref: https://math.stackexchange.com/questions/180418/calculate-rotation-matrix-to-align-vector-a-to-vector-b-in-3d/
    let v = crossProductR3(a, b);
    let s = vectorNormL2(v);
    let c = dotProduct(a, b);

    //this is the 3x3 skew-symmetric cross-product matrix of v
    let vx = [[0, v[2], -1*v[1]],[-1*v[2], 0, v[0]],[v[1], -1*v[0], 0]]

    let I = [[1,0,0],[0,1,0],[0,0,1]];

    let factor = (1 - c) / (s * s);

    let vx2 = matrixMultiplication(vx, vx);
    let scaledVx2 = scaleMatrix(vx2, factor);

    let matrixR = addMatrices(addMatrices(I, vx), scaledVx2);

    let A = transpose(matrixR)
    let SUV = SVD(A)
    this.SUV = SUV
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

        let dis_point1 = [graph.distToGraphCenter(point1), point1]
        let dis_point2 = [graph.distToGraphCenter(point2), point2]
        let dis_point3 = [graph.distToGraphCenter(point3), point3]
        let dis_point4 = [graph.distToGraphCenter(point4), point4]

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
 * sorts input array in ascending order by first element
 * @param {*} dis_points an array where the first element is a distance, and the second a point (x, y)
 * @returns the sorted array
 */
function findTwoClosesPoints(dis_points) {
    let twoClosestPoints = dis_points.sort(function(a, b) {return a[0] - b[0]})
    return [twoClosestPoints[0][1], twoClosestPoints[1][1]]
}

class Dot {
    constructor(graph, vector, color, radius) { 
        this.graph  = graph
        this.vector = vector
        this.color  = color
        this.radius = radius
    }

    draw() {
        this.graph.drawDotFromVector(this.vector, this.color, this.radius)
    }
}