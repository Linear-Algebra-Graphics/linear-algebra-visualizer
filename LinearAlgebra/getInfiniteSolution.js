
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
            //check for decimal
            let stringNum = "" + frac.getNumerator()
            if (stringNum.indexOf(".") > -1) {
                //has decimal point
                output = "" + frac.getNumerator().toFixed(2)
            } else {
                output = "" + frac.toString()
            }
        } else {
            output = "(" + frac.toString() + ")"
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
            output[0] = reduced[0][reduced[0].length - 1].toString()

        } else {
            debugger
            for (let col = 1; col < reduced[0].length - 1; col++) {
                if (reduced[0][col].getNumerator() != 0) {
                    debugger
                    
                    let fracFactor = divideFracs(new Frac(1, 1), reduced[0][col])
                    let factor = formatFracString(fracFactor)

                    let value = formatFracString(reduced[0][reduced[0].length - 1])
                    if (equalFrac(reduced[0][reduced[0].length - 1], new Frac(1,1))) {
                        value = "1"
                    }

                    output[col] = factor + "(" +value

                    for (let other = 0; other < reduced[0].length - 1; other++) {
                        if (other != col && reduced[0][other].getNumerator() != 0) {
                            let sign = "-"
                            if (reduced[0][other].getNumericalValue() < 0) {
                                sign = "+"
                            }

                            let coefficient = absValueOfFrac(reduced[0][other])
                            let coeffString = formatFracString(coefficient)

                            output[col] += "" + sign + coeffString + vars[other]
                        }
                    }
                    output[col] += ")"

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
        output[2] = "" + reduced[1][reduced[1].length - 1].toString()

        if (reduced[0][1] == 0) {
            /** 
             * case
             * a 0 0 d
             * 0 0 e f
             * 0 0 0 0 
             */
            output[0] = reduced[0][reduced[0].length - 1].toString()
        } else {
            output[0] = vars[0]
            let coeff1 = formatFracString(divideFracs(new Frac(1, 1), reduced[0][1]))

            let value = formatFracString(reduced[0][reduced[0].length - 1])
            if (equalFrac(reduced[0][reduced[0].length - 1], new Frac(1,1))) {
                value = "1"
            }

            output[1] = coeff1+"("+value
            for (let i = 0; i < reduced[0].length - 1; i++) {
                if (i != 1 && reduced[0][i].getNumerator() != 0) {
                    let sign = "-"
                    if (reduced[0][i].getNumericalValue() < 0) {
                        sign = "+"
                    }
                    output[1] += sign + formatFracString(absValueOfFrac(reduced[0][i])) + vars[i]
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

        if (b.getNumerator() == 0 && e.getNumerator() == 0) {
            output[0] = reduced[0][reduced[0].length - 1].toString()
            output[1] = reduced[1][reduced[1].length - 1].toString()
        } else if (b.getNumerator() == 0) {
            output[0] = reduced[0][reduced[0].length - 1].toString()
            output[1] = vars[1]

            let value = formatFracString(reduced[1][reduced[1].length - 1])
            debugger
            if (equalFrac(reduced[1][reduced[1].length - 1], new Frac(1,1))) {
                value = "1"
            }

            output[2] = formatFracString(divideFracs(new Frac(1, 1), reduced[1][2]))+"(" + value
            output[2] += "-" + vars[1] + ")"
        } else if (e.getNumerator() == 0) {
            output[1] = reduced[1][reduced[1].length - 1].toString()
            output[0] = vars[0]

            let value = formatFracString(reduced[0][reduced[0].length - 1])
            if (equalFrac(reduced[0][reduced[0].length - 1], new Frac(1,1))) {
                value = "1"
            }

            output[2] = formatFracString(divideFracs(new Frac(1, 1), reduced[0][2]))+"("+value
            output[2] += "-" + vars[0] + ")"   
        } else {
            output[0] = "" + formatFracString(reduced[0][reduced[0].length - 1])
            let sign = "-"
            if (b.getNumericalValue() < 0) {
                sign = "+"
            }
            output[0] += sign + formatFracString(absValueOfFrac(b)) + vars[2]

            output[1] = "" + formatFracString(reduced[1][reduced[0].length - 1])
            sign = "-"
            if (e.getNumericalValue() < 0) {
                sign = "+"
            }
            output[1] += sign + formatFracString(absValueOfFrac(e)) +  vars[2]
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

// /**
//  * the input must have infinite solutions!!!!
//  * @param {*} reduced row col form
//  */
// function getInfiniteSolution(reduced) {
//     //iterate from last row to first
//     //reduced is in row col form
//     let nonZerosPerRow = new Array(reduced.length)
//     for (let row = 0; row < reduced.length; row++) {
//         let count = 0
//         for (let col = 0; col < reduced[row].length - 1; col++) {
//             if (reduced[row][col] != 0) {
//                 count++
//             }
//         }
//         nonZerosPerRow[row] = count
//     }


//     let free = -1
//     for (let col = 0; col < reduced[0].length - 1; col++) {
//         let nonZeroCount = 0
//         for (let row = 0; row < reduced.length; row++) {
//             if (reduced[row][col] != 0) {
//                 nonZeroCount++
//             }
//         }
//         if (nonZeroCount > 1) {
//             free = col
//         }
//     }
//     console.log(free)

//     //debugger
//     let prevCol = reduced[0].length - 1
//     const vars = ["x","y","z"]
//     let output = ["x", "y", "z"]
//     for (let row = reduced.length - 1; row >= 0; row--) {
//         let column = leftMostNonZeroInRow(transpose(reduced), row)
//         //try and find a column with more than one nonzero values
//         debugger
//         for (let col = column; col < prevCol; col++) {
//             if (col == free) {
//                 output[col] = vars[col]
//             } else if (reduced[row][col] != 0) {
//                 //count num zeros from col to end
//                 let count = 0;
//                 for (let i = col; i < reduced[row].length - 1; i++) {
//                     if (reduced[row][i] != 0) {
//                         count++
//                     }
//                 }

//                 //debugger
//                 if (((col == column && prevCol - column > 1) || reduced[row][col] == 0) && free == -1 && count > 1) {
//                     output[col] = "" + vars[col]
//                 } else {
//                     let factor = ""
//                     if (reduced[row][col] == -1) {
//                         factor = "-"
//                     } else if (reduced[row][col] != 1) {
//                         factor = "(1/" + reduced[row][col] + ")"
//                     }

//                     output[col] = factor + "(" + reduced[row][reduced[row].length - 1]


//                     let count = 0
//                     for (let other = column; other < prevCol; other++) {
//                         if ((other != col && reduced[row][other] != 0) || other == free) {
//                             count++
//                             let sign = "+"
//                             if (reduced[row][other] > 0) {
//                                 sign = "-"
//                             }

//                             if (reduced[row][other] == 1) {
//                                 output[col] += "" + sign + vars[other]
//                             } else {
//                                 output[col] += "" + sign + Math.abs(reduced[row][other]) +"" + vars[other]
//                             }
                            
//                         }
//                     }
//                     output[col] += ")"
//                 }
//                 //debugger
//             }
//         }


//         if (column == reduced[0].length) {
//             prevCol = reduced[0].length -1
//         } else if (free == -1) {
//             prevCol = column
//         }
//         // } else {
//         //     prevCol = free + 1
//         // }
//     }
//     return output
// }




// /**
//  * the input must have infinite solutions!!!!
//  * @param {*} reduced row col form
//  */
// function getInfiniteSolution(reduced) {
//     //iterate from last row to first
//     //reduced is in row col form
//     let free = -1
//     for (let col = 0; col < reduced[0].length - 1; col++) {
//         let nonZeroCount = 0
//         for (let row = 0; row < reduced.length; row++) {
//             if (reduced[row][col] != 0) {
//                 nonZeroCount++
//             }
//         }
//         if (nonZeroCount > 1) {
//             free = col
//         }
//     }
//     console.log(free)

//     //debugger
//     let prevCol = reduced[0].length - 1
//     const vars = ["x","y","z"]
//     let output = ["", "", ""]
//     for (let row = reduced.length - 1; row >= 0; row--) {
//         let column = leftMostNonZeroInRow(transpose(reduced), row)
//         //try and find a column with more than one nonzero values
        
//         for (let col = column; col < prevCol; col++) {
//             if (col == free) {
//                 output[col] = vars[col]
//             } else {
//                 //debugger
//                 if (((col == column && prevCol - column > 1) && reduced[row][col] == 0) && free == -1) {
//                     output[col] = "" + vars[col]
//                 } else if (reduced[row][col] != 0) {
//                     let factor = ""
//                     if (reduced[row][col] == -1) {
//                         factor = "-"
//                     } else if (reduced[row][col] != 1) {
//                         factor = "(1/" + reduced[row][col] + ")"
//                     }

//                     output[col] = factor + "(" + reduced[row][reduced[row].length - 1]



//                     for (let other = column; other < prevCol; other++) {
//                         if ((other != col && reduced[row][other] != 0) || other == free) {

//                             let sign = "+"
//                             if (reduced[row][other] > 0) {
//                                 sign = "-"
//                             }

//                             if (reduced[row][other] == 1) {
//                                 output[col] += "" + sign + vars[other]
//                             } else {
//                                 output[col] += "" + sign + Math.abs(reduced[row][other]) +"" + vars[other]
//                             }
                            
//                         }
//                     }
//                     output[col] += ")"
//                 }
//                 //debugger
//             }
//         }


//         if (column == reduced[0].length) {
//             prevCol = reduced[0].length -1
//         } else if (free == -1) {
//             prevCol = column
//         } else {
//             prevCol = free + 1
//         }
//     }
//     return output
// }

