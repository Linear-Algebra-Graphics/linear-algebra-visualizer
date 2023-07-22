
/**
 * defines a fraction as numerator / denominator
 */
class Frac {
    /**
     * creates a new instance of a fraction that is numerator / denominator
     * @param {Number} numerator 
     * @param {Number} denominator 
     */
    constructor(numerator, denominator) {
        this.numerator = numerator
        this.denominator = denominator
        this.simplify()
    }

    /**
     * simplifies this fraction
     * @modifies this.numerator, this.denominator so that the fraction is in its most simplified form
     */
    simplify() {
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

    /**
     * uses the gcd euclids algorithm to find greatest common factor of a and b
     * @param {Number} a 
     * @param {Number} b 
     * @returns {Number} greatest common factor of a and b
     */
    _gcd(a, b) {
        if (a == 0) {
            return b
        } else {
            return this._gcd(b % a, a)
        }
    }

    /**
     * gets the numerator value
     * @returns {Number} the value of the numerator of this fraction
     */
    getNumerator() {
        return this.numerator
    }

    /**
     * gets the denominator value
     * @returns {Number} the value of the denominator of this fraction
     */
    getDenominator() {
        return this.denominator
    }

    /**
     * gets the non fraction numerical value of the fraction, ie 1/2 => 0.5
     * @returns {Number} this.numerator / this.denominator
     */
    getNumericalValue() {
        return this.getNumerator() / this.getDenominator()
    }

    /**
     * gets the string representation of the fraction 
     * @returns {String} a/b returns the string "a/b"
     */
    toString() {
        if (this.getNumerator() == 0) {
            return "0"
        } else if (this.getDenominator() == 1) {
            return "" + this.getNumerator()
        } else {
            return this.getNumerator() + "/" + this.getDenominator()
        }
    }

}

/**
 * divides fractions
 * @param {Frac} frac1 a Frac object
 * @param {Frac} frac2 a Frac object
 * @returns {Frac} a new Frac object that is frac1/frac2
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
 * multiplies two fractions
 * @param {Frac} frac1 a Frac object
 * @param {Frac} frac2 a Frac object
 * @returns {Frac} frac1 * frac2
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
 * adds two fractions
 * @param {Frac} frac1 a Frac object
 * @param {Frac} frac2 a Frac object
 * @returns {Frac} frac1 + frac2
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
 * subtracts one fraction from another
 * @param {Frac} frac1 a Frac object
 * @param {Frac} frac2 a Frac object
 * @returns {Frac} frac1 - frac2
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
 * checks if two fractions are equivalent
 * @param {Frac} frac1 a Frac object
 * @param {Frac} frac2 a Frac object
 * @returns {Boolean} true if frac1 is equivalent to frac2
 */
function equalFrac(frac1, frac2) {
    let answer = (frac1.getNumerator() == frac2.getNumerator()) && (frac1.getDenominator() == frac2.getDenominator())
    return answer
}

/**
 * checks if two matrices with frac objects as elements are equal
 * @param {Frac} matrix1 frac matrix
 * @param {Frac} matrix2 frac matrix
 * @returns {Boolean} if the two matrices are equal
 */
function fracMatricesEqual(matrix1, matrix2) {
    if (matrix1.length != matrix2.length) {
        return false
    }

    for (let i = 0; i < matrix1.length; i++) {
        for (let j = 0; j < matrix1[i].length; j++) {
            if (!equalFrac(matrix1[i][j], matrix2[i][j])) {
                return false
            }
        }
    }

    return true
}