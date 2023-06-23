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
function vectorMultiplication(vector1, vector2) {
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


/**
 * returns the length of a vector
 * @param {*} vector the vector in question
 * @returns length of vector
 */
function vectorLength(vector) {
    return Math.abs( Math.sqrt( Math.pow(vector[0], 2) + Math.pow(vector[1], 2)) )
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