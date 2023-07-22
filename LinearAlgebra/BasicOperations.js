/**
 * does Ax = b multiplication 
 * @param {*} matrix matrix A
 * @param {*} vector vector x
 * @returns vector Ax = b
 */
function matrixVectorMultiplication (matrix, vector) {

    let returnVector= new Array(vector.length)
    for (let i = 0; i < returnVector.length; i++) {
        returnVector[i] = 0
    }

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            returnVector[i] = returnVector[i] + matrix[j][i]*vector[j];
        }
    }

    return returnVector
}


/**
 * multiplies rightMatrix by leftMatrix
 * @param {*} leftMatrix 
 * @param {*} rightMatrix 
 * @returns leftMatrix*rightMatrix
 */
function matrixMultiplication(leftMatrix, rightMatrix) {
    let returnMatrix = new Array(rightMatrix.length)
    for (let i = 0; i < returnMatrix.length; i++) {
        returnMatrix[i] = new Array(leftMatrix[0].length).fill(0);
    }
    for (let i = 0; i < rightMatrix.length; i++) {
        
        for (let m = 0; m < leftMatrix[0].length; m++) {

            for (let n = 0; n < leftMatrix.length; n++) {
                returnMatrix[i][m] = returnMatrix[i][m] + leftMatrix[n][m] * rightMatrix[i][n]
            }
        }
        
    }
    return returnMatrix
}

/**
 * gets the dot product of two vectors
 * @param {*} vector1 a vector in form [a1, a2, ... , an]
 * @param {*} vector2 a vector in form [b1, b2, ... , bn]
 * @requires : that vector1 and vector2 have the same dimension
 * @returns a numerical value vector1 * vector2
 */
function dotProduct(vector1, vector2) {
    if (vector1.length != vector2.length) {
        return null
    }
    let output = 0
    for (let i = 0; i < vector1.length; i++) {
        output = output + (vector1[i] * vector2[i])
    }
    return output
}

/**
 * returns the matrix result of vector multiplication
 * @param {*} v1 a column vector
 * @param {*} v2 a column vector
 * @requires : vectors v1 and v2 both in Rn
 * @returns v1 * v2^T
 */
function vectorMultiplication(v1, v2) {
    let output = new Array(v2.length)

    for (let i = 0; i < v2.length; i++) {
        output[i] = new Array(v2.length);
    }

    for (let i = 0; i < v2.length; i++) {
        let factor = v2[i]
        for (let j = 0; j < v2.length; j++) {
            output[i][j] = v1[j] * factor
        }
    }
    return output
}


/**
 * checks if two matrices are equal
 * does not account for floating point differences yet => only used for checking identiy rn
 * @param {*} matrix1 
 * @param {*} matrix2 
 * @returns true if every entry in matrx1 = same entry in matrix2
 */
function matrixEquals(matrix1, matrix2) {
    if (matrix1.length != matrix2.length || matrix1[0].length != matrix2[0].length) {
        return false;
    }
    for (let i = 0; i < matrix1.length; i++) {
        for (let j = 0; j < matrix1[0].length; j++) {
            if (matrix1[i][j] !== matrix2[i][j]) {
                return false
            }
        }
    }
    return true
}

function vectorEquals(vector1, vector2) {
    if (vector1 == undefined || vector2 == undefined) {
        throw new Error("a vector is undefined")
    }
    if (vector1.length != vector2.length) {
        return false;
    }

    let sumSquaredError = 0
    let sumError = 0
    for (let i = 0; i < vector1.length; i++) {
        if (!numEqual(vector1[i], vector2[i], 12)) {
            return false;
        }
        sumError += Math.abs(vector1[i] - vector2[i])
        //sumSquaredError += Math.pow((vector1[i] - vector2[i]), 2)
    }
    
    return sumError < 0.00000000001
}

function numEqual(num1, num2, precision) {
    return (Math.abs(num1 - num2) < Math.pow(10, -1*precision))
}


/**
 * returns the length of a vector
 * @param {*} vector a 2d vector
 * @returns length of vector
 */
function vectorLength(vector) {
    let sum = 0;
    for (let i = 0; i < vector.length; i++) {
        sum += Math.pow(vector[i], 2)
    }
    
    return Math.abs(Math.sqrt(sum))
}

/**
 * normalizes a vector of any dimension
 * @param {*} v vector to be normalized
 * @returns normalized vector
 */
function normalizeVector(v) {
    
    let length = vectorLength(v)
    
    for (i = 0; i < v.length; i++) {
        v[i] = v[i] / length
    }

    return v
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

/**
 * NEEDS FIX!! ONLY WORKS FOR SQUARE MATRICES!!!
 * returns the transpose of input matrix 
 * @param {*} matrix a matrix as defined by us two idiots
 * @returns the transposed matrix in the matrix form defined by us two idiots, ie [[a,b,c],[d,e,f],[g,h,i]] for 3x3
 */
function transpose(matrix) {

    outputMatrix = new Array(matrix[0].length)
    
    for (i = 0; i < outputMatrix.length; i++) {
        outputMatrix[i] = new Array(matrix.length)
    }

    for (i = 0; i < matrix.length; i++) {
        for (j = 0; j < matrix[i].length; j++) {
            outputMatrix[j][i] = matrix[i][j]
        }
    }

    return outputMatrix
}

// [[1],[2],[3]]


/**
 * calcualtes the vector subtraction v1 - v2
 * @param {*} v1 a vector
 * @param {*} v2 a vector
 * @requires that v1, v2 in Rn
 * @returns a vector v1 - v2
 */
function vectorSubtract(v1, v2) {
    if (v1.length !== v2.length) {
        throw new Error("vector subtract called on vectors of diff lengths!")
    }
    let result = Array(v1.length)
    
    for (let i = 0; i < v1.length; i++) {
        result[i] = v1[i] - v2[i]
    }
    
    return result
}

/**
 * calcualtes the vector addition v1 + v2
 * @param {*} v1 a vector
 * @param {*} v2 a vector
 * @requires that v1, v2 in Rn
 * @returns a vector v1 + v2
 */
function vectorAdd(v1, v2) {
    if (v1.length != v2.length) {
        throw new Error("v1 length != v2 length!!")
    }
    let result = Array(v1.length)
    
    for (let i=0; i<v1.length; i++) {
        result[i] = v1[i] + v2[i]
    }
    
    return result
}

function scaleVector(v, c) {
    let result = new Array(v.length)
    
    for (let i = 0; i < v.length; i++) {
        result[i] = v[i] * c
    }
    
    return result
}

function det3x3(matrix) {
    // First row
    let e11 = matrix[0][0]
    let e12 = matrix[1][0]
    let e13 = matrix[2][0]

    // Second row
    let e21 = matrix[0][1]
    let e22 = matrix[1][1]
    let e23 = matrix[2][1]
    
    // Third row
    let e31 = matrix[0][2]
    let e32 = matrix[1][2]
    let e33 = matrix[2][2]
    
    let det = (e11*e22*e33) + (e12*e23*e31) + (e13*e21*e32) - (e11*e23*e32) - (e12*e21*e33) - (e13*e22*e31)
    return det
}