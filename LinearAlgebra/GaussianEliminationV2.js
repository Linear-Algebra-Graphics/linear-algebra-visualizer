// ISSUES:
// DOES NOT WORK FOR MATRIX WITH MORE THAN 5 COLUMBS
// When going down the diagonal if the columb below is all zeros but to your right
// there is a number that number will never be checked as it gets skiped over.
// I'm too tired....
// These should be fixed out :)
function GaussianEliminationV2(inputMatrix, steps, useFractions) {
    //debugger
    if (useFractions == false) {
        for (let i=0; i<inputMatrix.length; i++) {
            for (let j=0; j<inputMatrix[i].length; j++) {
                inputMatrix[i][j] = new frac(inputMatrix[i][j], 1)
            }
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

    if (useFractions == false) {
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