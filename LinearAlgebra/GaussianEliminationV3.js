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


function GaussianEliminationV3(inputMatrix, steps, fractions) {
    //1) sort rows by least num zeros to left
    //2) find first non-zero value,
    //  if 1 do nothing, else divide whole row by first nonzero value - > make all left most values nonzero
    //3) delete everything below each leftMostValue
    //4) 
    //let matrix = transpose(inputMatrix)
    let matrix = orderByLeastNumZeros(transpose(inputMatrix))
    // console.log(matrix)
    // console.log(stringMatrixFromFrac(matrix))

    let stepList    = []
    let operations = []

    //make leftMost be 1

    //keep track of these for step 3
    for (let row = 0; row < matrix.length; row++) {
        let index = numLeftZerosInRow(matrix, row)
        
        //check that this is not part of the augment values
        if (index < matrix[row].length) {
            //make the value 1 and divide all values to right by leftMostValue, this includes the augment values
            let leftMostValue = matrix[row][index]

            //console.log(leftMostValue.getNumericalValue())
            divideRow(row, leftMostValue)

            for (let rowBelow = row + 1; rowBelow < matrix.length; rowBelow++) {
                if (matrix[rowBelow][index].getNumerator() != 0) {
                    let scale = matrix[rowBelow][index]
                    subtractScaledRowFromRow(rowBelow, row, scale)
                }
            }
        }
    }

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
    return stepList

    function saveSnapshot() {
        if (steps == true) {
            stepList.push(stringMatrixFromFrac(deepCopy(matrix)))
        }
    }

    /**
     * divides entire row by value
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


class Frac {
    constructor(numerator, denominator) {
        this.numerator = numerator
        this.denominator = denominator
        this.simplify()
    }

    /**
     * 
     * @returns 
     */
    simplify() {
        //debugger
        if (this.numerator == 0) {
            this.numerator = 0
            this.denominator = 1
        } else {
            let sign = Math.sign(this.numerator * this.denominator)
            let gcd = this._gcd(Math.abs(this.numerator), Math.abs(this.denominator))

            this.numerator   = sign * Math.abs(this.numerator) / gcd
            this.denominator = Math.abs(this.denominator) / gcd
        }
    }

    _gcd(a, b) {
        if (a == 0) {
            return b
        } else {
            return this._gcd(b % a, a)
        }
    }

    getNumerator() {
        return this.numerator
    }

    getDenominator() {
        return this.denominator
    }

    getNumericalValue() {
        return this.getNumerator() / this.getDenominator()
    }

    toString() {
        if (this.denominator == 1) {
            return "" + this.numerator
        } else {
            return "" + this.getNumerator() + "/" + this.getDenominator()
        }
    }

}

/**
 * 
 * @param {*} frac1 a Frac object
 * @param {*} frac2 a Frac object
 * @returns a new Frac object that is frac1/frac2
 */
function divideFracs(frac1, frac2) {
    if (frac1.getDenominator() == 0 || frac2.getDenominator() == 0) {
        throw new Error("frac has 0 denominator")
    }
    if (frac2.getNumerator() == 0) {
        throw new Error("trying to divide by 0")
    }

    if (frac1.getNumerator() == 0) {
        return new Frac(0, 1)
    }

    let newNumerator = frac1.getNumerator() * frac2.getDenominator()
    let newDenominator = frac1.getDenominator() * frac2.getNumerator()
    let output = new Frac(newNumerator, newDenominator)
    return output;
}

/**
 * 
 * @param {*} frac1 a Frac object
 * @param {*} frac2 a Frac object
 * @returns a new Frac object that is frac1 * frac2
 */
function multiplyFracs(frac1, frac2) {
    if (frac1.getDenominator() == 0 || frac2.getDenominator() == 0) {
        throw new Error("frac has 0 denominator")
    }

    if (frac1.getNumerator() == 0 || frac2.getNumerator() == 0) {
        return new Frac(0, 1)
    }

    let newNumerator = frac1.getNumerator() * frac2.getNumerator()
    let newDenominator = frac1.getDenominator() * frac2.getDenominator()
    let output = new Frac(newNumerator, newDenominator)
    return output;
}

/**
 * 
 * @param {*} frac1 a Frac object
 * @param {*} frac2 a Frac object
 * @returns a new Frac object that is frac1 + frac2
 */
function addFracs(frac1, frac2) {
    let newDenominator = frac1.getDenominator() * frac2.getDenominator()
    let newNumerator = (frac1.getNumerator() * frac2.getDenominator()) + (frac2.getNumerator() * frac1.getDenominator())
    if (newNumerator == 0) {
        return new Frac(0, 1)
    }
    if (newNumerator == NaN || newDenominator ==NaN) {
        debugger
    }
    let output = new Frac(newNumerator, newDenominator)
    return output;
}

/**
 * 
 * @param {*} frac1 a Frac object
 * @param {*} frac2 a Frac object
 * @returns a new Frac object that is the value frac1 - frac2
 */
function subtractFracs(frac1, frac2) {
    let newDenominator = frac1.getDenominator() * frac2.getDenominator()
    let newNumerator = (frac1.getNumerator() * frac2.getDenominator()) - (frac2.getNumerator() * frac1.getDenominator())
    if (newNumerator == 0) {
        return new Frac(0, 1)
    }
    let output = new Frac(newNumerator, newDenominator)
    return output;
}

/**
 * 
 * @param {*} frac1 a Frac object
 * @param {*} frac2 a Frac object
 * @modifies frac1 and frac2 to become their simplified form
 * @returns true if frac1 is equivalent to frac2
 */
function equalFrac(frac1, frac2) {
    let answer = (frac1.getNumerator() == frac2.getNumerator()) && (frac1.getDenominator() == frac2.getDenominator())
    return answer
}