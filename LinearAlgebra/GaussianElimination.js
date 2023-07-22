//Note, all functions are written in transposed matrix format

/**
 * should only take integer matrices for now
 * @param {*} matrix 
 * @returns 
 */
function numericMatrixToFracMatrix(matrix) {
    let fracMatrix = new Array(matrix.length)
    for (let i = 0; i < matrix.length; i++) {
        fracMatrix[i] = new Array(matrix[i].length)
        for (let j = 0; j < matrix[i].length; j++) {
            fracMatrix[i][j] = new Frac(matrix[i][j], 1)
        }
    }

    return fracMatrix
}

function GaussianEliminationV3(inputMatrix, steps, fracMode) {
    if (fracMode == false) {
        inputMatrix = numericMatrixToFracMatrix(inputMatrix)
    }

    //1) sort rows by least num zeros to left
    //2) find first non-zero value,
    //  if 1 do nothing, else divide whole row by first nonzero value - > make all left most values nonzero
    //3) delete everything below each leftMostValue
    //4)


    let matrix = transpose(inputMatrix)

    let stepList    = []
    let operations = []

    matrix = orderByLeastNumZeros(matrix)
    // console.log(matrix)
    // console.log(stringMatrixFromFrac(matrix))


    //make leftMost be 1

    //keep track of these for step 3
    for (let row = 0; row < matrix.length; row++) {
        let index = numLeftZerosInRow(matrix, row)
        // 4 2 3 1
        // 0 0 0 5
        // Also wont ever divide by zero (We think)
        //check that this is not part of the augment values
        if (index < matrix[row].length - 1) {
            //make the value 1 and divide all values to right by leftMostValue, this includes the augment values
            let leftMostValue = matrix[row][index]

            //console.log(leftMostValue.getNumericalValue())
            if (leftMostValue != 1) {
                divideRow(row, leftMostValue)
            }

            for (let rowBelow = row + 1; rowBelow < matrix.length; rowBelow++) {
                if (matrix[rowBelow][index].getNumerator() != 0) {
                    let scale = matrix[rowBelow][index]
                    subtractScaledRowFromRow(rowBelow, row, scale)
                }
            }
        }
        
    }
    
    matrix = orderByLeastNumZeros(matrix)
    // Matrix is now in row eclion form

    //console.log(stringMatrixFromFrac(matrix))
    
    for (let row = matrix.length - 1; row >= 1; row--) {
        let index = numLeftZerosInRow(matrix, row)
        if (index < matrix[row].length) {
            for (let rowAbove = row - 1; rowAbove >= 0; rowAbove--) {
                let scale = matrix[rowAbove][index]
                if (scale.getNumerator() != 0) {
                    subtractScaledRowFromRow(rowAbove, row, scale)
                }
            }
        }
    }

    // console.log(stringMatrixFromFrac(matrix))
    // console.log(stepList)
    // console.log(operations)
    matrix = orderByLeastNumZeros(matrix)
    matrix = transpose(matrix)
    if (fracMode == false) {
        matrix = numericMatrixFromFrac(matrix)
    }
    
    if (steps == false) {
        return matrix
    } else {
        return stepList
    }
    

    // ---FUNCTIONS---


    
    function saveSnapshot() {
        if (steps == true) {
            if (fracMode == true) {
                stepList.push(transpose(deepCopy(matrix)))
            } else {
                stepList.push(numericMatrixFromFrac(transpose(deepCopy(matrix))))
            }
        }
    }

    /**
     * divides entire row by valuet
     * @param {*} row
     * @param {*} value 
     */
    function divideRow(row, value) {
        for (let col = 0; col < matrix[row].length; col++) {
            matrix[row][col] = divideFracs(matrix[row][col], value)
        }

        saveSnapshot()
        if (steps) {
            operations.push("row" + row + " = (" + divideFracs(new Frac(1, 1), value).toString() + ")row" + row)
        }
        // ADD ONE TO OPPERATIONS
    }
    
    /**
     * does row1 - scale*row2 
     * @param {*} rows1 a Frac
     * @param {*} row2 a Frac
     * @param {*} scale a Frac
     */
    function subtractScaledRowFromRow(row1, row2, scale) {
        for (let col = 0; col < matrix[row1].length; col++) {
            let subtractedFrac = multiplyFracs(matrix[row2][col], scale)
            matrix[row1][col] = subtractFracs(matrix[row1][col], subtractedFrac)
        }
        saveSnapshot()
        if (steps) {
            operations.push("row" + row1 + " = row" + row1 + "-(" + scale.toString() + ")row" + row2)
        }
        // ADD ONE TO OPPERATIONS
    }

}

/**
 * sorts a matrix from top to bottom row in order of ascending number of zeros on the left
 * @param {*} matrix input matrix of fracs to be sorted in row col form
 * @returns a new matrix that is sorted
 */
function orderByLeastNumZeros(matrix) {
    let rowWithNumZeros = new Array(matrix.length)
    for (let row = 0; row < matrix.length; row++) {
        let numZeros = numLeftZerosInRow(matrix, row)
        rowWithNumZeros[row] = {numZeros: numZeros, row: row}
    }

    rowWithNumZeros = rowWithNumZeros.sort(function(a, b) {return a.numZeros - b.numZeros})

    let orderedMatrix = new Array(matrix.length)
    for (let i = 0; i < rowWithNumZeros.length; i++) {
        orderedMatrix[i] = matrix[rowWithNumZeros[i].row]
    }

    return orderedMatrix
}

/**
 * 
 * @param {*} matrix a matrix of fracs
 * @param {*} row the row to check
 * @returns the number of continuous zeros on the left of the row
 *          eg: row = [0,0,0,1,2,0,5] returns 3
 */
function numLeftZerosInRow(matrix, row) {
    let count = 0
    for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col].getNumerator() != 0) {
            return count
        } else {
            count++
        }
    }
    return count
}

/**
 * 
 * @param {*} matrix a matrix row col form
 */
function numericMatrixFromFrac(matrix) {
    if (matrix.length == 0) {
        throw new Error("empty matrix!! 0x0")
    }

    let numericalMatrix = new Array(matrix.length)
    for (let i = 0; i < matrix.length; i++) {
        numericalMatrix[i] = new Array(matrix[i].length)
    } 

    //copy matrix over
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j].getDenominator() == 0) {
                throw new Error("denominator is 0!!")
            }
            numericalMatrix[i][j] = matrix[i][j].getNumerator() / matrix[i][j].getDenominator()
        }
    }
    return numericalMatrix
}

/**
 * 
 * @param {*} matrix a matrix row col form
 */
function stringMatrixFromFrac(matrix) {
    if (matrix.length == 0) {
        throw new Error("empty matrix!! 0x0")
    }

    let numericalMatrix = new Array(matrix.length)
    for (let i = 0; i < matrix.length; i++) {
        numericalMatrix[i] = new Array(matrix[i].length)
    } 

    //copy matrix over
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j].getDenominator() == 0) {
                throw new Error("denominator is 0!!")
            }
            numericalMatrix[i][j] = matrix[i][j].toString()
        }
    }
    return numericalMatrix
}

function deepCopy(matrix) {
    if (matrix.length == 0) {
        console.log("trying to deepCopy an empty matrix!")
        return []
    }

    let newMatrix = new Array(matrix.length)
    for (let i = 0; i < matrix.length; i++) {
        newMatrix[i] = new Array(matrix[i].length)
    } 

    //copy matrix over
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            newMatrix[i][j] = new Frac(matrix[i][j].getNumerator(), matrix[i][j].getDenominator())
        }
    }
    
    return newMatrix
}

function isLetterOrFloat(val) {
    return (val.length === 1 && val.match(/[a-z]/i)) || (!val.isInteger())
}

function isLetter(val) {
    return (val.length === 1 && val.match(/[a-z]/i))
}