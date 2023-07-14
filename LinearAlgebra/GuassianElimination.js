// First, arrange the rows where so the first row has
// the largest value, the second has the second largest etc...
// 
// Second use the top value to eliminate the first values
// of the next rows.

// Assuming final columb is all zeros
// Assuming matrix is square
/**
 * calculates reduced echelon form of an input matrix representing
 *              |a b c|x|
 *              |d e f|y|
 *              |g h i|z|
 * using partial pivot method
 * @param {*} inputMatrixWithAugment augmenting matrix
 * @modifies matrixWithAugment to be in parital pivoted reduced echelon form
 * @returns an array of the snapshot of the matrix at each step of gaussian elimation
 */
function gaussianElimination(inputMatrixWithAugment) {
    //make local copy of matrixWithAugment
    let matrixWithAugment = JSON.parse(JSON.stringify(inputMatrixWithAugment))
    let steps = []
    steps.push(inputMatrixWithAugment)


    //tech dont need to do very last column i think, so -2 instead of -1
    for(let columb = 0; columb < matrixWithAugment.length - 2; columb++) {
        
        partialPivot(matrixWithAugment, columb, columb)
        let firstRowVal   = matrixWithAugment[columb][columb]
        if (firstRowVal != 0) {
            for(let row = columb+1; row < matrixWithAugment[0].length; row++) {
                let leftMostValue = matrixWithAugment[columb][row]
                
                let multiple = leftMostValue / firstRowVal
                if (firstRowVal == 0) {
                    multiple == 0
                }
                
                rowSubtractionWithMultiple(matrixWithAugment, multiple, columb, row)
                //matrix[columb][row] = rowSubtractionWithMultiple(multiple, currentRow, firstRow)

                //perhaps store a copy of matrixWithAugment every time at this step?
                //save snapshot
                let copy = JSON.parse(JSON.stringify(matrixWithAugment))
                steps.push(copy)
            }
        }
    }

    // get into reduced echelon form
    for (let row = matrixWithAugment[0].length - 1; row >= 0; row--) {
        let leftMostValue = matrixWithAugment[row][row]
        // make left most value 1
        for (let col = row; col < matrixWithAugment.length; col++) {
            if (leftMostValue == 0) {
                matrixWithAugment[col][row] = 0
            } else {
                matrixWithAugment[col][row] = matrixWithAugment[col][row] / leftMostValue
            }
        }

        //make all values above index (row, row) 0, and update the values in the augment row
        for (let rowsAbove = row - 1; rowsAbove >= 0; rowsAbove--) {
            matrixWithAugment[matrixWithAugment.length - 1][rowsAbove] -= matrixWithAugment[row][rowsAbove] * matrixWithAugment[matrixWithAugment.length - 1][row]
            matrixWithAugment[row][rowsAbove] = 0
            //save snapshot
        }
        let copy = JSON.parse(JSON.stringify(matrixWithAugment))
        steps.push(copy)
    }
    return steps
}


/**
 * performs partial pivot on the matrix, and edits the matrix to reflect this
 * @param {*} matrix matrix to do partial pivot on
 * @param {*} row this is indeed a row
 * @param {*} col this is indeed the column
 */
function partialPivot(matrix, row, col) {
    // loop over rows from row...end
    let maxAbsVal = null
    let maxAbsValIndex = row
    for (let i = row; i < matrix[col].length; i++) {
        if (maxAbsVal == null || Math.abs(matrix[col][i]) > maxAbsVal) {
            maxAbsVal = matrix[col][i]
            maxAbsValIndex = i
        }
    }
    if (row != maxAbsValIndex) {
        // swap maxValIndex row to row index
        let aux = Array(matrix.length)
        for (let j = 0; j < matrix.length; j++) {
            //row of max abs val values
            aux[j] = matrix[j][maxAbsValIndex]
        }
        for (let j = 0; j < matrix.length; j++) {
            matrix[j][maxAbsValIndex] = matrix[j][row]
            matrix[j][row] = aux[j]
        }
    }
    //return matrix
}

/**
 * subtracts multiple of row1 from row2
 * @param {*} matrix
 * @param {*} multiple 
 * @param {*} row1 
 * @param {*} row2 
 * @returns 
 */
function rowSubtractionWithMultiple(matrix, multiple, row1, row2) {

    for (let columb = row1; columb < matrix.length; columb++) {
        matrix[columb][row2] = matrix[columb][row2] - (multiple * matrix[columb][row1])
    }

    // for (let columb = 0; columb < row1.length; columb++) {
    //     outputRow[columb] = row2[columb] - multiple * row1[columb]
    // }

    // return outputRow
}



//beck algo
// ISSUES:
// DOES NOT WORK FOR MATRIX WITH MORE THAN 5 COLUMBS
// When going down the diagonal if the columb below is all zeros but to your right
// there is a number that number will never be checked as it gets skiped over.
// I'm too tired....
// These should be fixed out :)
function GaussianElimination(inputMatrix, steps, fraction) {
    for (let i=0; i<inputMatrix.length; i++) {
        for(let j=0; j<inputMatrix[i].length; j++) {
            inputMatrix[i][j] = new frac(inputMatrix[i][j], 1)
        }
    }

    //debugger
    // Unreference the matrix from the input matrix techincally you dont need
    // to do this cuz the transpsoe already does it but its more clear this way
    let matrix = deepCopy(inputMatrix)
    matrix     = transpose(matrix)
    // debugger

    let stepList   = []
    let rowOppList = []

    sortMatrixByNumberOfLeadingZeros(matrix)

    for (let rowIndex=0; rowIndex < matrix.length; rowIndex++) {
        let leadingZeros = getLeadingNumberOfZeros(matrix[rowIndex])
        // Make sure row is not all zeros
        if(leadingZeros < matrix[rowIndex].length) {
            // If the first non zero number is not 1
            if (matrix[rowIndex][leadingZeros].getNumerator() == 1 && matrix[rowIndex][leadingZeros].getDenominator() == 1) {
                
            } else if(matrix[rowIndex][leadingZeros].getNumerator() != 0) {
                divideRow(rowIndex, matrix[rowIndex][leadingZeros])
            }

            // For the rest of the rows, below current row have zero below the 1
            // from the current row.
            for(let j=rowIndex+1; j<matrix.length; j++) {
                // If its zero dont do this otherwise it adds an unecessary step.
                if (matrix[j][leadingZeros].getNumerator() != 0) {
                
                    // debugger
                    subtractandScaleRows(j, rowIndex, matrix[j][leadingZeros])
                }
            }
        }

        sortMatrixByNumberOfLeadingZeros(matrix)

    }

    // Matrix is now is in row eclion form (Wrong spelling but you get the idea)
    // debugger
    for (let rowIndex=matrix.length-1; rowIndex>=0; rowIndex--) {

        let leadingZeros = getLeadingNumberOfZeros(matrix[rowIndex])
        // If row is not all zeros
        if (leadingZeros < matrix[rowIndex].length) {
            // For the rest of the rows, below current row have zero below the 1
            // from the current row.
            for(let j=rowIndex-1; j>=0; j--) {
                // If its zero dont do this otherwise it adds an unecessary step.
                if (matrix[j][leadingZeros].getNumerator() != 0) {
                    subtractandScaleRows(j, rowIndex, matrix[j][leadingZeros])
                }
            }
        }

    }

    if (fraction == false) {
        let newmatrix = deepCopy(matrix)

        for (i=0; i<matrix.length; i++) {
            for( j=0; j<matrix[i].length; j++) {
                newmatrix[i][j] = matrix[i][j].getFloating()
            }
        }
        return transpose(newmatrix)
    }

    return [transpose(matrix), stepList, rowOppList]

    function swapRows(r1, r2) {
        
        let temp = matrix[r1]
        matrix[r1] = matrix[r2]
        matrix[r2] = temp

        if(steps == true) {
            stepList.push(deepCopy(transpose(matrix)))
            rowOppList.push("R"+(r1+1) + " <-> " + "R"+(r2+1))
        }
    }
    function divideRow(r, v) {

        for (let i=0; i<matrix[r].length; i++) {
            matrix[r][i] = devideFrac(matrix[r][i], v)
        }

        if(steps == true) {
            stepList.push(deepCopy(transpose(matrix)))
            rowOppList.push("R"+(r+1) + " = " + ("R"+(r+1))+"/"+"("+v.value()+")")
        }
    }
    function multiplyRow(r, v) {
        for (let i=0; i<matrix[r].length; i++) {
            matrix[r][i] = multiplyFrac(matrix[r][i], v)
        }

        if(steps == true) {
            stepList.push(deepCopy(transpose(matrix)))
            rowOppList.push("R"+(r+1) + " = " + ("R"+(r+1))+" * "+"("+v.value()+")")
        }
    }
    function addRows(r1, r2) {
        for (let i=0; i<matrix[r].length; i++) {
            matrix[r1][i] = addFrac(matrix[r1][i], matrix[r2][i])
        }
        if(steps == true) {
            stepList.push(deepCopy(transpose(matrix)))
            rowOppList.push("R"+(r1+1) + " = " + "R"+(r1+1) + " + " + "R"+(r2+1))
        }
    }
    function subtractRows(r1, r2) {
        for (let i=0; i<matrix[r].length; i++) {
            matrix[r1][i] = subtractFrac(matrix[r1][i], matrix[r2][i])
        }
        if(steps == true) {
            stepList.push(deepCopy(transpose(matrix)))
            rowOppList.push("R"+(r1+1) + " = " + "R"+(r1+1) + " - " + "R"+(r2+1))
        }
    }
    // r1 - s * r2
    function subtractandScaleRows(r1, r2, s) {
        
        for (let i=0; i<matrix[r1].length; i++) {
            //debugger
            let scaledFrac = multiplyFrac(matrix[r2][i], s)
            matrix[r1][i] = subtractFrac(matrix[r1][i], scaledFrac)
        }
        if(steps == true) {
            stepList.push(deepCopy(transpose(matrix)))
            rowOppList.push("R"+(r1+1) + " = " + "R"+(r1+1) + " - " + "R"+(r2+1) + " * " + "("+s.value()+")" )
        }
        
    }

    // Simple selection sort
    function sortMatrixByNumberOfLeadingZeros(matrix) {

        for (let i=0; i<matrix.length; i++) {
            let currentRow = matrix[i]
            zeros = getLeadingNumberOfZeros(currentRow)
            
            let swapIndex = null
            for (let j=i+1; j<matrix.length; j++) {
                if (zeros > getLeadingNumberOfZeros(matrix[j])) {
                    swapIndex = j
                }
            }
            if(swapIndex != null) {
                swapRows(i, swapIndex)
            }
        }
    }

    function getLeadingNumberOfZeros(row) {
        let numberOfZeros = 0
        for(let i=0; i<matrix.length; i++) {
            if (row[i].getNumerator() == 0) {
                numberOfZeros++
            } else {
                break
            }
        }
        return numberOfZeros
    }
}



// Do not access numerator and denominator directly. Use getter.
class frac {
    constructor(numerator, denominator) {
        this.numerator   = numerator
        this.denominator = denominator
    }

    addFrac(frac) {
        this.numerator = (this.getNumerator() * frac.getDenominator()) + (frac.getNumerator() * this.getDenominator())
        this.denominator = this.getDenominator() * frac.getDenominator()
    }

    subtractFrac(frac) {
        this.numerator = (this.getNumerator() * frac.getDenominator()) - (frac.getNumerator() * this.getDenominator())
        this.denominator = this.getDenominator() * frac.getDenominator()

    }

    multiplyFrac(frac) {
        this.numerator   = this.getNumerator()   * frac.getNumerator()
        this.denominator = this.getDenominator() * frac.getDenominator()
    }

    devideFrac(frac) {
        this.numerator   = this.getNumerator()   * frac.getDenominator()
        this.denominator = this.getDenominator() * frac.getNumerator()

    }

    value() {
        if (this.getDenominator() == 1) {
            return "" + this.getNumerator()
        } else {
            return this.getNumerator() + "/" + this.getDenominator()
        }
    }

    getNumerator() {
        this._simplify()
        return this.numerator
    }
    getDenominator() {
        this._simplify()
        return this.denominator
    }

    getFloating() {
        return this.numerator / this.denominator
    }

    _simplify() {
        
        let primeNumbers = [2, 3, 5, 7, 11, 13, 17, 19, 23]

        let largestPrime = 1

        // Should traverse the list backwards because it would be faster
        // To lazy to change
        for(let i=0; i<primeNumbers.length; i++) {
            let currentPrime = primeNumbers[i]
            if (this.numerator % currentPrime == 0 && this.denominator % currentPrime == 0) {
                largestPrime = currentPrime
            }
        }
        if(largestPrime != 1) {
            this.numerator   = this.numerator   / largestPrime
            this.denominator = this.denominator / largestPrime
            return true
        } else {
            return false
        }

    }

}

function addFrac(frac1, frac2) {
    
    let numerator   = (frac1.getNumerator() * frac2.getDenominator()) + (frac2.getNumerator() * frac1.getDenominator())
    let denominator = frac1.getDenominator() * frac2.getDenominator()
    return new frac(numerator, denominator)
}

function subtractFrac(frac1, frac2) {
    let numerator   = (frac1.getNumerator() * frac2.getDenominator()) - (frac2.getNumerator() * frac1.getDenominator())
    let denominator = frac1.getDenominator() * frac2.getDenominator()
    return new frac(numerator, denominator)
}

function multiplyFrac(frac1, frac2) {
    let numerator   = frac1.getNumerator()   * frac2.getNumerator()
    let denominator = frac1.getDenominator() * frac2.getDenominator()
    return new frac(numerator, denominator)
}

function devideFrac(frac1, frac2) {
    let numerator   = frac1.getNumerator()   * frac2.getDenominator()
    let denominator = frac1.getDenominator() * frac2.getNumerator()
    return new frac(numerator, denominator)
}

function deepCopy(matrix) {
    
    let newMatrix = []
    
    for(i=0; i<matrix.length; i++) {
        newMatrix.push([])
    }

    for(let i=0; i<matrix.length; i++) {
        for(let j=0; j<matrix[i].length; j++) {
            newMatrix[i].push(new frac(matrix[i][j].getNumerator(), matrix[i][j].getDenominator()))
        }
    }

    return newMatrix;
}
