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
 */
function gaussianElimination(inputMatrixWithAugment) {
    //make local copy of matrixWithAugment
    let matrixWithAugment = JSON.parse(JSON.stringify(inputMatrixWithAugment))

    //tech dont need to do very last column i think, so -2 instead of -1
    for(let columb = 0; columb < matrixWithAugment.length - 2; columb++) {
        
        partialPivot(matrixWithAugment, columb, columb)
        let firstRowVal   = matrixWithAugment[columb][columb]

        for(let row = columb+1; row < matrixWithAugment[0].length; row++) {
            let leftMostValue = matrixWithAugment[columb][row]
            let multiple   = leftMostValue / firstRowVal
            
            rowSubtractionWithMultiple(matrixWithAugment, multiple, columb, row)
            //matrix[columb][row] = rowSubtractionWithMultiple(multiple, currentRow, firstRow)

            //perhaps store a copy of matrixWithAugment every time at this step?
        }

        //save snapshot
        let copy = JSON.parse(JSON.stringify(matrixWithAugment))
        console.log(copy)
    }

    // get into reduced echelon form
    for (let row = matrixWithAugment[0].length - 1; row >= 0; row--) {
        let leftMostValue = matrixWithAugment[row][row]
        // make left most value 1
        for (let col = row; col < matrixWithAugment.length; col++) {
            matrixWithAugment[col][row] = matrixWithAugment[col][row] / leftMostValue
        }

        //make all values above index (row, row) 0, and update the values in the augment row
        for (let rowsAbove = row - 1; rowsAbove >= 0; rowsAbove--) {
            matrixWithAugment[matrixWithAugment.length - 1][rowsAbove] -= matrixWithAugment[row][rowsAbove] * matrixWithAugment[matrixWithAugment.length - 1][row]
            matrixWithAugment[row][rowsAbove] = 0
        }
        
        //save snapshot
        let copy = JSON.parse(JSON.stringify(matrixWithAugment))
        console.log(copy)
    }
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