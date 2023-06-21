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
            returnVector[i] = returnVector[i] + matrix[i][j]*vector[j];
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
                returnMatrix[i][m] = returnMatrix[i][m] + leftMatrix[m][n] * rightMatrix[i][n]
            }

        }
        
    }
    return returnMatrix
}

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