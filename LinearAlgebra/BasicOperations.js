


/**
 * 
 * @param {Number[][] | Frac[][]} matrix col row format matrix
 * @param {Number} row 
 * @returns {Number} index of the leftmost nonzero element in row of matrix
 */
function leftMostNonZeroInRow(matrix, row) {
    let col = 0
    while (col < matrix.length) {
        if (typeof matrix[col][row] == 'number') {
            if (matrix[col][row] != 0) {
                return col;
            }
        } else if (typeof matrix[col][row] == 'object') {
            if (matrix[col][row].constructor.name == "Frac") {
                if (matrix[col][row].getNumerator() != 0) {
                    return col;
                }
            }
        }
        col++
    }
    return col
}

//chagne



function arrayFirstN(arr, n) {
    let newArr = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        newArr[i] = arr[i]
    }
    return newArr
}


/**
 * does Ax = b multiplication 
 * @param {Number[][]} matrix col row representation matrix A
 * @param {Number[]} vector column vector x
 * @returns {Number[]} vector b from Ax = b
 */
function matrixVectorMultiplication(matrix, vector) {

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
 * @param {Number[][]} leftMatrix col row representation
 * @param {Number[][]} rightMatrix col row representation
 * @returns {Number[][]} a col row matrix = leftMatrix * rightMatrix 
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

function addMatrices(matrix1, matrix2) {
    if (matrix1.length != matrix2.length || matrix1[0].length != matrix2[0].length) {
        throw new Error("adding matrices of diff dimensions!");
    }

    let output = new Array(matrix1.length);
    for (let i = 0; i < output.length; i++) {
        output[i] = new Array(matrix1[i].length).fill(0);
        for (let j = 0; j < output[i].length; j++) {
            output[i][j] = matrix1[i][j] + matrix2[i][j];
        } 
    }
    return output;
}

/**
 * gets the dot product of two vectors
 * @param {Number[]} vector1 a vector in form [a1, a2, ... , an]
 * @param {Number[]} vector2 a vector in form [b1, b2, ... , bn]
 * @requires : that vector1 and vector2 have the same dimension
 * @returns {Number} a numerical value vector1 * vector2
 */
function dotProduct(vector1, vector2) {
    if (vector1.length != vector2.length) {
        throw new Error("trying to dot product vectors of different length")
    }

    let output = 0
    for (let i = 0; i < vector1.length; i++) {
        output = output + (vector1[i] * vector2[i])
    }
    
    return output
}

/**
 * returns the matrix result of vector multiplication
 * @param {Number[]} v1 a column vector
 * @param {Number[]} v2 a column vector
 * @requires : vectors v1 and v2 are both in Rn
 * @returns {Number[]} v1 * v2^T
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

function scaleMatrix(matrix, scalar) {
    let output = new Array(matrix.length);
    for (let i = 0; i < output.length; i++) {
        output[i] = new Array(matrix[i].length);
        for (let j = 0; j < output[i].length; j++) {
            output[i][j] = scalar * matrix[i][j];
        }
    }
    return output;
}


/**
 * checks if two matrices are equal
 * accounts for floating point differences up to 1e-12
 * @param {Number[][]} matrix1 col row representation
 * @param {Number[][]} matrix2 col row representation
 * @returns {boolean} indicating if the two matrices are equal
 */
function matrixEquals(matrix1, matrix2) {
    if (matrix1.length != matrix2.length || matrix1[0].length != matrix2[0].length) {
        return false;
    }
    for (let i = 0; i < matrix1.length; i++) {
        for (let j = 0; j < matrix1[0].length; j++) {
            if (!numEqual(matrix1[i][j], matrix2[i][j], 12)) {
                return false
            }
        }
    }
    return true
}

/**
 * checks if two vectors are equal, if total error is below 1e-12 then it is equal
 * @param {Number[]} vector1 
 * @param {Number[]} vector2 
 * @returns {boolean} true if equal false otherwise
 */
function vectorEquals(vector1, vector2, precision) {
    if (vector1 == undefined || vector2 == undefined) {
        throw new Error("a vector is undefined")
    }
    if (vector1.length != vector2.length) {
        return false;
    }

    for (let i = 0; i < vector1.length; i++) {
        if (!numEqual(vector1[i], vector2[i], precision)) {
            return false;
        }
    }
    
    return true
}

/**
 * checks if two Numbers are equal up to 1e-precision
 * @param {Number} num1 
 * @param {Number} num2 
 * @param {Number} precision 
 * @returns {boolean} true if equal false otherwise
 */
function numEqual(num1, num2, precision) {
    return (Math.abs(num1 - num2) < Math.pow(10, -1*precision))
}


/**
 * returns the length of a vector
 * @param {Number[]} vector of any dimension
 * @returns {Number} value for the length of the vector
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
 * @param {Number[]} v vector to be normalized
 * @returns {Number[]} normalized vector
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
 * @param {Number} x Number x value
 * @param {Number} m slope of line
 * @param {Number} b y intersect
 * @requires : m is a valid slope, ie no vertical lines
 * @returns {Number} the y coordinate at x of the line
 */
function getYIntersept(x, m, b) { 
    return (m * x) + b
}


/**
 * gets x when given y using y = mx+b
 * @param {Number} y Number y value
 * @param {Number} m slope of line
 * @param {Number} b y intersect
 * @requires : m is a valid slope, ie no vertical lines
 * @returns {Number} x coordinate at y of the line
 */
function getXIntersept(y, m, b) {
    return (y - b) / m
}

/**
 * returns the transpose of input matrix in col row form 
 * @param {Number[][]} matrix a col row matrix as defined by us two idiots
 * @returns {Number[][]} the transposed matrix in the col row matrix form defined by us two idiots, ie [[a,b,c],[d,e,f],[g,h,i]] for 3x3
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
 * @param {Number[]} v1 a vector
 * @param {Number[]} v2 a vector
 * @requires that v1, v2 in Rn
 * @returns {Number[]} a vector v1 - v2
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
 * @param {Number[]} v1 a vector
 * @param {Number[]} v2 a vector
 * @requires that v1, v2 in Rn
 * @returns {Number[]} a vector v1 + v2
 */
function vectorAdd(v1, v2) {
    if (v1.length != v2.length) {
        throw new Error("v1 length " + v1.length + " != v2 length " + v2.length + "!!")
    }
    let result = Array(v1.length)
    
    for (let i = 0; i < v1.length; i++) {
        result[i] = v1[i] + v2[i]
    }
    
    return result
}

/**
 * scales a vector by a scalar c
 * @param {Number[]} v a vector
 * @param {Number} c a Number value
 * @returns {Number[]} c * v
 */
function scaleVector(v, c) {
    let result = new Array(v.length)
    
    for (let i = 0; i < v.length; i++) {
        result[i] = v[i] * c
    }
    
    return result
}

/**
 * calculates the determinant of a 3x3 matrix
 * @param {Number[][]} matrix 
 * @returns {Number} the determinant 
 */
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


/**
 * 
 * @param {Number[]} vec1 
 * @param {Number[]} vec2 
 * @returns cross product of two R3 vectors
 */
function crossProductR3(vec1, vec2) {
    // calculate crossproduct => vector perp to both normals => intersetion vector
    // u x v = (u2v3 - u3v2, u3v1-u1v3, u1v2-u2v1)
    let cx = (vec1[1] * vec2[2]) - (vec1[2] * vec2[1])
    let cy = (vec1[2] * vec2[0]) - (vec1[0] * vec2[2])
    let cz = (vec1[0] * vec2[1]) - (vec1[1] * vec2[0])

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

function vectorNormL2(vector) {
    let sum = 0;
    for (let i = 0; i < vector.length; i++) {
        sum += (vector[i] * vector[i])
    }
    return Math.sqrt(sum)
}