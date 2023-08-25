function checkEqual(output, expected, message) {
    //can numbers, strings, booleans, Fracs, and arrays of each of these
    if (output === expected) {
        console.log("%c \u2713 " + message + " Passed", "color: green; background: black;")
    //     equal = true
    // } else if ((typeof output == "object") && (typeof expected == "object")) {
    //     if (output.constructor.name == "Frac" && expected.constructor.name == "Frac") {
    //         equal = equalFrac(output, expected)
    //     }  
    //     if (output.constructor.name == 'Array' && expected.constructor.name == 'Array') {
    //         if (output.length == expected.length) {
    //             for (let i = 0; i < output.length && output[i].length == expected[i].length; i++) {
    //                 if (output[i].constructor.name == "Frac" && expected[i].constructor.name == "Frac" && !equalFrac(output[i])) {
                        
    //                 } else {

    //                 }
    //             }
    //         }
    //     }

    } else {
        console.log("%c \u2717  " + message + " Failed", "color: red; background: black;")
    }
    console.log("output: " +  output.toString())
    console.log("expected: " + expected.toString())
}

