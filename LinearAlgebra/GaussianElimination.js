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

/**
 * does row1 - value*row2 
 * @param {*} fracMatrix 
 * @param {Number} row1 
 * @param {Number} row2 
 * @param {Frac} value 
 * @returns 
 */
function fracMatrixSubtractOperation(fracMatrix, row1, row2, value) {
    for (let col = 0; col < fracMatrix[row1].length; col++) {
        let subtractedFrac = multiplyFracs(fracMatrix[row2][col], value)
        fracMatrix[row1][col] = subtractFracs(fracMatrix[row1][col], subtractedFrac)
    }

    return {steps: [fracMatrix], operations: [{type: "subtract", row1: row1, row2: row2, value: value}]}
}

function fracMatrixDivideOperation(fracMatrix, row, value) {
    for (let col = 0; col < fracMatrix[row].length; col++) {
        fracMatrix[row][col] = divideFracs(fracMatrix[row][col], value)
    }

}


/**
 * Preforms Gaussian Elimination on the input matrix.
 * @param {*} inputMatrix Matix that gets reduced.
 * @requirments Must be either all Frac or all number. Must also be in columb row form.
 * @param {boolean} steps Set to true to return a snapshot of the matrix after every row opperation. Also returns all row opperations.
 * @param {boolean} fracMode Set to false if you give an inputMatrix of floats not Frac.
 * @returns {Frac[][]} if steps == false && fracMode == true: Row reduced Frac matrix.
 * @returns {{steps: Frac[][][], operations: String[]}} if steps == true && fracMode == true: List of the steps to the row reduced Frac matrix. Also returns all row opperations.
 * @returns {number[][]} if steps == false && fracMode == false: Row reduced number matrix.
 * @returns {{steps: number[][][], operations: String[]}} if steps == true && fracMode == false: List of the steps to the row reduced numbe rmatrix.  Also returns all row opperations.
 */
function gaussianEliminationV3(inputMatrix, steps, fracMode) {
    if (fracMode == false) {
        inputMatrix = numericMatrixToFracMatrix(inputMatrix)
    }

    //1) sort rows by least num zeros to left
    //2) find first non-zero value,
    //  if 1 do nothing, else divide whole row by first nonzero value - > make all left most values nonzero
    //3) delete everything below each leftMostValue
    //4)


    let matrix = transpose(inputMatrix)

    let stepList     = []
    let operations   = []

    let rowOrderList = []

    
    orderByLeastNumZeros()
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
    
    orderByLeastNumZeros()
    // Matrix is now in row eclion form

    //console.log(stringMatrixFromFrac(matrix))
    
    for (let row = matrix.length - 1; row >= 1; row--) {
        let index = numLeftZerosInRow(matrix, row)
        if (index < matrix[row].length - 1) {
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
    orderByLeastNumZeros()
    matrix = transpose(matrix)
    if (fracMode == false) {
        matrix = numericMatrixFromFrac(matrix)
    }
    
    if (steps == false) {
        return matrix
    } else {
        return {steps: stepList, operations: operations, rowOrderList: rowOrderList}
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
            // Because division numerator and denominator switch
            // let numerator   = value.getDenominator()
            // let denominator = value.getNumerator()
            // row = row + 1

            // let stepString = ""

            // if (numerator == 1) {
            //     stepString = "R"+(row+1)
            // } else {
            //     stepString = numerator+" * R"+ row
            // }

            // if (denominator == 1) {
            //     stepString = stepString
            // } else {
            //     stepString += "/(" + denominator + ")"
            // }

            // R1/3   -> R1
            operations.push({type:"divide", row: row, value: value})

            let currentRowOrder
            if (rowOrderList.length == 0) {
                currentRowOrder = []
                for (let i = 0; i < matrix.length; i++) {
                    currentRowOrder.push(i)
                }
            } else {
                currentRowOrder = rowOrderList[rowOrderList.length-1]
            }

            rowOrderList.push(currentRowOrder)
        }
        // ADD ONE TO OPPERATIONS
    }
    
    /**
     * does row1 - value*row2 
     * @param {Number} row1 a Frac
     * @param {Number} row2 a Frac
     * @param {Frac} value a Frac
     */
    function subtractScaledRowFromRow(row1, row2, value) {
        for (let col = 0; col < matrix[row1].length; col++) {
            let subtractedFrac = multiplyFracs(matrix[row2][col], value)
            matrix[row1][col] = subtractFracs(matrix[row1][col], subtractedFrac)
        }
        saveSnapshot()
        if (steps) {
            // Because division numerator and denominator switch
            // let numerator   = scale.getNumerator()
            // let denominator = scale.getDenominator()
            // row1 = row1 + 1
            // row2 = row2 + 1

            // let stepString = ""

            // if (numerator == 1) {
            //     stepString = "R"+row2
            // } else {
            //     stepString = numerator+" * R"+row2
            // }

            // if (denominator == 1) {
            //     stepString = stepString
            // } else {
            //     stepString += "/" + denominator
            // }

            // R1 - R2 -> R1
            //operations.push("R"+row1 + " - " + stepString + " &rArr; " + "R"+row1)
            operations.push({type: "subtract", row1: row1, row2: row2, value: value})
            //effectedRows.push([row1, row2])

            let currentRowOrder
            if (rowOrderList.length == 0) {
                currentRowOrder = []
                for (let i = 0; i < matrix.length; i++) {
                    currentRowOrder.push(i)
                }
            } else {
                currentRowOrder = rowOrderList[rowOrderList.length-1]
            }

            rowOrderList.push(currentRowOrder)
        }
        // ADD ONE TO OPPERATIONS
    }


    function swapRows(row1, row2) {
        
        let temp = matrix[row1]
        matrix[row1] = matrix[row2]
        matrix[row2] = temp
        // row1=row1+1
        // row2=row2+1
        
        saveSnapshot()
        
        if (steps == true) {
            // operations.push("R" + row1 + " &hArr; " + "R" + row2)
            // effectedRows.push([row1, row2])
            // let currentRowOrder = rowOrderList[rowOrderList.length-1]

            // let temp2 = currentRowOrder[row1-1]
            // currentRowOrder[row1-1] = currentRowOrder[row2-1]
            // currentRowOrder[row2-1] = temp2
            // rowOrderList.push(currentRowOrder)
            operations.push({type:"swap", row1: row1, row2: row2})

            let currentRowOrder
            if (rowOrderList.length == 0) {
                currentRowOrder = []
                for (let i = 0; i < matrix.length; i++) {
                    currentRowOrder.push(i)
                }
            } else {
                currentRowOrder = rowOrderList[rowOrderList.length-1]
            }

            let temp = currentRowOrder[row1]
            currentRowOrder[row1] = currentRowOrder[row2]
            currentRowOrder[row2] = temp
            rowOrderList.push(currentRowOrder)
        }
        
    }
    
    /**
     * Sorts the matrix from top to bottom row in order of ascending number of zeros on the left.
     */
    // Uses selection sort.
    function orderByLeastNumZeros() {
        for (let i = 0; i < matrix.length; i++) {
            let zeros = numLeftZerosInRow(matrix, i)
            
            let swapIndex = null
            
            for (let j = i + 1; j < matrix.length; j++) {
                if (zeros > numLeftZerosInRow(matrix, j)) {
                    swapIndex = j
                }
            }

            if (swapIndex != null) {
                swapRows(i, swapIndex)
            }
        }

    }

}


/**
 * sorts a matrix from top to bottom row in order of ascending number of zeros on the left
 * @param {*} matrix input matrix of fracs to be sorted in row col form
 * @returns a new matrix that is sorted
 * @deprecated
 */
function orderByLeastNumZeros_old(matrix) {
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
 * @param {Frac[][]} matrix a matrix of fracs
 * @param {Number} row the row to check
 * @returns {Number} the number of continuous zeros on the left of the row
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
 * gets the Number matrix of a Frac matrix
 * @param {Frac[][]} matrix a Frac matrix
 * @returns {Number[][]} input matrix in with all Frac's in Number form
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
 * converts a Frac matrix to the same matrix where each element is the Frac.toString()
 * @param {Frac[][]} matrix a matrix
 * @returns {String[][]} 
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

/**
 * creates a new object that is a copy of the input matrix
 * @param {Frac[][]} matrix 
 * @returns {Frac[][]} output matrix such that matrixEqual(output, matrix) = true
 */
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

/**
 * 
 * @param {any} val 
 * @returns {Boolean}
 */
function isLetterOrFloat(val) {
    return (val.length === 1 && val.match(/[a-z]/i)) || (!val.isInteger())
}

/**
 * checks if val is a alphabetic character
 * @param {any} val 
 * @returns {Boolean} 
 */
function isLetter(val) {
    return (val.length === 1 && val.match(/[a-z]/i))
}