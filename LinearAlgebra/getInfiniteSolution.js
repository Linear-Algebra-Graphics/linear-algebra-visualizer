
function stringVectorsEqual(vec1, vec2) {
    if (vec1.length != vec2.length) {
        throw new Error("string vecs wrong size!")
    }
    for (let i = 0; i < vec1.length; i++) {
        if (vec1[i] != vec2[i]) {
            return false
        }
    }
    return true
}

function formatFracString(frac) {
    let output = ""
    if (!equalFrac(frac, new Frac(1,1)) && !equalFrac(frac, new Frac(0,1))) {
        if (frac.getDenominator() == 1) {
            //x/1 case
            //check for decimal
            let stringNum = "<mn>" + frac.getNumerator()+"</mn>"
            if (stringNum.indexOf(".") > -1) {
                //has decimal point
                output = "<mn>" + frac.getNumerator().toFixed(2) + "</mn>"
            } else {
                output = "<mn>" + frac.toString() + "</mn>"
            }
        } else {
            //x/y case
            output = 
                '<mfrac>\
                    <mn>'+frac.getNumerator()+'</mn>\
                    <mn>'+frac.getDenominator()+'</mn>\
                </mfrac>'
        }
    }
    return output
}


function getInfiniteSolutionFrac(reduced) {
    //determine which case
    let secondRowPivot = -1
    for (let i = 0; i < reduced[1].length - 1; i++) {
        if (reduced[1][i].getNumerator() == 1 && reduced[1][i].getDenominator() == 1) {
            secondRowPivot = i
            break
        }
    }

    let output = ["<mn>x</mn>", "<mn>y</mn>", "<mn>z</mn>"]
    const vars = ["<mn>x</mn>", "<mn>y</mn>", "<mn>z</mn>"]
    //debugger
    if (secondRowPivot == -1) {
        /**
         * case 1
         * a b c d
         * 0 0 0 0
         * 0 0 0 0
         */
        let nonZeroCount = 0
        for (let i = 0; i < reduced[0].length - 1; i++) {
            if (reduced[0][i].getNumerator() != 0) {
                nonZeroCount++;
            }
        }
        //debugger
        if (nonZeroCount == 1) {
            /** 
             * case 
             * a 0 0 d
             * 0 0 0 0
             * 0 0 0 0
             */
            output[0] = "<mn>"+reduced[0][reduced[0].length - 1].toString()+"</mn>"

        } else {
            //debugger
            for (let col = 1; col < reduced[0].length - 1; col++) {
                if (reduced[0][col].getNumerator() != 0) {
                    //debugger
                    
                    let fracFactor = divideFracs(new Frac(1, 1), reduced[0][col])
                    let factor = formatFracString(fracFactor)

                    let value = formatFracString(reduced[0][reduced[0].length - 1])
                    if (equalFrac(reduced[0][reduced[0].length - 1], new Frac(1,1))) {
                        value = "<mn>1</mn>"
                    }

                    if (factor == "") {
                        output[col] = value
                    } else {
                        output[col] = factor + "<mo>(</mo>" +value
                    }

                    for (let other = 0; other < reduced[0].length - 1; other++) {
                        if (other != col && reduced[0][other].getNumerator() != 0) {
                            let sign = "<mo>-</mo>"
                            if (reduced[0][other].getNumericalValue() < 0) {
                                sign = "<mo>+</mo>"
                            }

                            let coefficient = absValueOfFrac(reduced[0][other])
                            let coeffString = formatFracString(coefficient)

                            output[col] += "" + sign + coeffString + vars[other]
                        }
                    }
                    if (factor != "") {
                        output[col] += "<mo>)</mo>"
                    }   

                    // "z = (x+y)"
                }
            }    
        }
    } else if (secondRowPivot == 2) {
        /**
         * case 2
         * a b 0 d
         * 0 0 e f
         * 0 0 0 0
         */
        output[2] = "<mn>"+reduced[1][reduced[1].length - 1].toString()+"</mn>"

        if (reduced[0][1] == 0) {
            /** 
             * case
             * a 0 0 d
             * 0 0 e f
             * 0 0 0 0 
             */
            output[0] = "<mn>"+reduced[0][reduced[0].length - 1].toString()+"</mn>"
        } else {
            output[0] = vars[0]
            let coeff1 = formatFracString(divideFracs(new Frac(1, 1), reduced[0][1]))

            let value = formatFracString(reduced[0][reduced[0].length - 1])
            if (equalFrac(reduced[0][reduced[0].length - 1], new Frac(1,1))) {
                value = "<mn>1</mn>"
            }

            if (coeff1 != "") {
                output[1] = coeff1+"<mo>(</mo>"+value
            } else {
                output[1] = value
            }

            for (let i = 0; i < reduced[0].length - 1; i++) {
                if (i != 1 && reduced[0][i].getNumerator() != 0) {
                    let sign = "<mo>-</mo>"
                    if (reduced[0][i].getNumericalValue() < 0) {
                        sign = "<mo>+</mo>"
                    }
                    output[1] += sign + formatFracString(absValueOfFrac(reduced[0][i])) + vars[i]
                }
            }

            if (coeff1 != "") {
                output[1] += "<mo>)</mo>"
            }
        }

    } else if (secondRowPivot == 1) {
        /**
         * case 3
         * a 0 b c
         * 0 d e f
         * 0 0 0 0 
         * 
         * our cases depend on b and e, 
         */
        const b = reduced[0][2]
        const e = reduced[1][2]

        if (b.getNumerator() == 0 && e.getNumerator() == 0) {
            output[0] = "<mn>"+reduced[0][reduced[0].length - 1].toString()+"</mn>"
            output[1] = "<mn>"+reduced[1][reduced[1].length - 1].toString()+"</mn>"
        } else if (b.getNumerator() == 0) {
            output[0] = "<mn>"+reduced[0][reduced[0].length - 1].toString()+"</mn>"
            output[1] = vars[1]

            let value = formatFracString(reduced[1][reduced[1].length - 1])
            //debugger
            if (equalFrac(reduced[1][reduced[1].length - 1], new Frac(1,1))) {
                value = "<mn>1</mn>"
            }

            let coeff = formatFracString(divideFracs(new Frac(1, 1), reduced[1][2]))

            if (coeff != "") {
                output[2] = coeff +"<mo>(</mo>" + value
            } else {
                output[2] = value
            }

            output[2] += "<mo>-</mo>" + vars[1]

            if (coeff != "") {
                output[2] += "<mo>)</mo>"
            }

        } else if (e.getNumerator() == 0) {
            output[1] = "<mn>"+reduced[1][reduced[1].length - 1].toString()+"</mn>"
            output[0] = vars[0]

            let value = formatFracString(reduced[0][reduced[0].length - 1])
            if (equalFrac(reduced[0][reduced[0].length - 1], new Frac(1,1))) {
                value = "<mn>1</mn>"
            }

            let coeff = formatFracString(divideFracs(new Frac(1, 1), reduced[0][2]))
            if (coeff != "") {
                output[2] = coeff+"<mo>(</mo>"+value
            } else {
                output[2] = value
            }

            output[2] += "<mo>-</mo>" + vars[0]
            
            if (coeff != "") {
                output[2] += "<mo>)</mo>"
            }

        } else {
            output[0] = "" + formatFracString(reduced[0][reduced[0].length - 1])
            let sign = "<mo>-</mo>"
            if (b.getNumericalValue() < 0) {
                sign = "<mo>+</mo>"
            }
            if (output[0] == "" && sign == "<mo>+</mo>") {
                output[0] += formatFracString(absValueOfFrac(b)) + vars[2]
            } else {
                output[0] += sign + formatFracString(absValueOfFrac(b)) + vars[2]
            }

            output[1] = "" + formatFracString(reduced[1][reduced[0].length - 1])
            sign = "<mo>-</mo>"
            if (e.getNumericalValue() < 0) {
                sign = "<mo>+</mo>"
            }

            if (output[1] == "" && sign == "<mo>+</mo>") {
                output[1] = formatFracString(absValueOfFrac(e)) +  vars[2]
            } else {
                output[1] += sign + formatFracString(absValueOfFrac(e)) +  vars[2]
            }
        }
    }
    return output
}

function getInfiniteSolution(reduced) {
    //determine which case
    let secondRowPivot = -1
    for (let i = 0; i < reduced[1].length - 1; i++) {
        if (reduced[1][i] == 1) {
            secondRowPivot = i
            break
        }
    }

    let output = ["x", "y", "z"]
    const vars = ["x", "y", "z"]
    //debugger
    if (secondRowPivot == -1) {
        /**
         * case 1
         * a b c d
         * 0 0 0 0
         * 0 0 0 0
         */
        let nonZeroCount = 0
        for (let i = 0; i < reduced[0].length - 1; i++) {
            if (reduced[0][i] != 0) {
                nonZeroCount++;
            }
        }
        //debugger
        if (nonZeroCount == 1) {
            /** 
             * case 
             * a 0 0 d
             * 0 0 0 0
             * 0 0 0 0
             */
            output[0] = reduced[0][reduced[0].length - 1]

        } else {
            for (let col = 1; col < reduced[0].length - 1; col++) {
                if (reduced[0][col] != 0) {
                    output[col] = "(1/" + reduced[0][col] + ")" + "(" + reduced[0][reduced[0].length - 1]

                    for (let other = 0; other < reduced[0].length - 1; other++) {
                        if (other != col && reduced[0][other] != 0) {
                            let sign = "-"
                            if (reduced[0][other] < 0) {
                                sign = "+"
                            }
                            output[col] += "" + sign + Math.abs(reduced[0][other]) + vars[other]
                        }
                    }
                    output[col] += ")"
                }
            }    
        }
    } else if (secondRowPivot == 2) {
        /**
         * case 2
         * a b 0 d
         * 0 0 e f
         * 0 0 0 0
         */
        output[2] = "" + reduced[1][reduced[1].length - 1]

        if (reduced[0][1] == 0) {
            /** 
             * case
             * a 0 0 d
             * 0 0 e f
             * 0 0 0 0 
             */
            output[0] = reduced[0][reduced[0].length - 1]
        } else {
            output[0] = vars[0]
            output[1] = "(1/"+reduced[0][1]+")"+"("+reduced[0][reduced[0].length - 1]
            for (let i = 0; i < reduced[0].length - 1; i++) {
                if (i != 1 && reduced[0][i] != 0) {
                    let sign = "-"
                    if (reduced[0][i] < 0) {
                        sign = "+"
                    }
                    output[1] += sign + Math.abs(reduced[0][i]) + vars[i]
                }
            }
            output[1] += ")"
        }
        
         
    } else if (secondRowPivot == 1) {
        /**
         * case 3
         * a 0 b c
         * 0 d e f
         * 0 0 0 0 
         * 
         * our cases depend on b and e, 
         */
        const b = reduced[0][2]
        const e = reduced[1][2]

        if (b == 0 && e == 0) {
            output[0] = reduced[0][reduced[0].length - 1]
            output[1] = reduced[1][reduced[1].length - 1]
        } else if (b == 0) {
            output[0] = reduced[0][reduced[0].length - 1]
            output[1] = vars[1]
            output[2] = "(1/"+reduced[1][2] + ")(" + reduced[1][reduced[1].length - 1]
            output[2] += "-" + vars[1] + ")"
        } else if (e == 0) {
            output[1] = reduced[1][reduced[1].length - 1]
            output[0] = vars[0]
            output[2] = "(1/"+reduced[0][2]+")("+reduced[0][reduced[0].length - 1]
            output[2] += "-" + vars[0] + ")"   
        } else {
            output[0] = "" + reduced[0][reduced[0].length - 1]
            let sign = "-"
            if (b < 0) {
                sign = "+"
            }
            output[0] += sign + Math.abs(b) + vars[2]

            output[1] = "" + reduced[1][reduced[0].length - 1]
            sign = "-"
            if (e < 0) {
                sign = "+"
            }
            output[1] += sign + Math.abs(e) +  vars[2]
        }
    }
    return output
}

