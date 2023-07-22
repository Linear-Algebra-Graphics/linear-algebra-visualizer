class GaussTests {
    constructor() {
        this.inputList   = []
        this.expectedResultList = []
        this.testNameList       = []
    }

    add(result, expected, name) {
        this.inputList.push(result)
        this.expectedResultList.push(expected)
        this.testNameList.push(name)
    }

    runTests(stopOnFirstFailed) {
        console.log("Total tests: " + this.inputList.length)
        let testsPassedInARow = 0
        for (let i=0; i<this.inputList.length; i++) {
            let result = gaussianEliminationV3(this.inputList[i], false, true)
            let passed = fracMatricesEqual(result, this.expectedResultList[i])
            if (passed == true) {
                testsPassedInARow++
            } else {
                if (testsPassedInARow != 0) {
                    console.log("%c \u2713 " + "("  + testsPassedInARow  + ")" + " Tests passed", "color: green; background: black;")
                }
                console.log("%c \u2717 " + this.testNameList[i] + " Failed", "color: red; background: black;")
                console.log("Input: ")
                console.log(stringMatrixFromFrac(this.inputList[i]))
                console.log("Expected: ")
                console.log(stringMatrixFromFrac(this.expectedResultList[i]))
                console.log("Actual: ")
                console.log(stringMatrixFromFrac(result))
                testsPassedInARow = 0
                if(stopOnFirstFailed == true) {
                    break
                }
            }
        }
        if (testsPassedInARow != 0) {
            console.log("%c \u2713 " + "("  + testsPassedInARow  + ")" + " Tests passed", "color: green; background: black;")
        }
    }

    runTest(testNumber) {
        console.log("Test: " + testNumber)
        let result = gaussianEliminationV3(this.inputList[testNumber], false)
        passed = fracMatricesEqual(result, this.expectedResultList[testNumber])
        if (passed == true) {
            console.log("%c \u2713 " + message + " Passed", "color: green; background: black;")
        } else {
            console.log("%c \u2717  " + message + " Failed", "color: red; background: black;")
            console.log("Input: ")
            console.log(stringMatrixFromFrac(this.inputList[i]))
            console.log("Expected: ")
            console.log(stringMatrixFromFrac(this.expectedResultList[i]))
            console.log("Actual: ")
            console.log(stringMatrixFromFrac(result))
        }
        
    }
}

let gaussTests = new GaussTests()

gaussTests.add(
    [[new Frac(1,1)],[new Frac(1,1)]],
    [[new Frac(1,1)],[new Frac(1,1)]],
    "1x2 matrix - no Fractions"
)

gaussTests.add(
    [
        [new Frac(5,1), new Frac(5,1), new Frac(0,1)],
        [new Frac(0,1), new Frac(0,1), new Frac(0,1)],
        [new Frac(7,1), new Frac(7,1), new Frac(1,1)],
        [new Frac(1,1), new Frac(1,1), new Frac(6,1)]
    ],
    [
        [new Frac(1,1), new Frac(0,1), new Frac(0,1)],
        [new Frac(0,1), new Frac(0,1), new Frac(0,1)],
        [new Frac(0,1), new Frac(1,1), new Frac(0,1)],
        [new Frac(-41,5), new Frac(6,1), new Frac(0,1)]
    ],
    "3x4 dependent - no Fractions"
)

gaussTests.add(
    [
        [new Frac(5,1), new Frac(5,1), new Frac(0,1)],
        [new Frac(0,1), new Frac(0,1), new Frac(0,1)],
        [new Frac(7,1), new Frac(7,1), new Frac(1,1)],
        [new Frac(1,1), new Frac(1,1), new Frac(6,1)]
    ],
    [
        [new Frac(1,1), new Frac(0,1), new Frac(0,1)],
        [new Frac(0,1), new Frac(0,1), new Frac(0,1)],
        [new Frac(0,1), new Frac(1,1), new Frac(0,1)],
        [new Frac(-41,5), new Frac(6,1), new Frac(0,1)]
    ],
    "3x4 dependent - no Fractions"
)

gaussTests.add(
    [
        [new Frac(1,1), new Frac(0,1), new Frac(0,1), new Frac(0,1)],
        [new Frac(3,1), new Frac(0,1), new Frac(0,1), new Frac(0,1)],
        [new Frac(5,1), new Frac(0,1), new Frac(1,1), new Frac(0,1)],
        [new Frac(1,1), new Frac(0,1), new Frac(6,1), new Frac(0,1)]
    ],
    [
        [new Frac(1,1), new Frac(0,1), new Frac(0,1), new Frac(0,1)],
        [new Frac(3,1), new Frac(0,1), new Frac(0,1), new Frac(0,1)],
        [new Frac(0,1), new Frac(1,1), new Frac(0,1), new Frac(0,1)],
        [new Frac(-29,1), new Frac(6,1), new Frac(0,1), new Frac(0,1)]
    ],
    "4x4 dependent - no Fractions"
)


gaussTests.add(
    [
        [new Frac(5,1), new Frac(0,1), new Frac(3,1)],
        [new Frac(0,7), new Frac(7,1), new Frac(1,1)],
        [new Frac(7,1), new Frac(0,1), new Frac(1,1)],
        [new Frac(1,1), new Frac(3,1), new Frac(6,1)]

    ],
    [
        [new Frac(1,1), new Frac(0,1), new Frac(0,1)],
        [new Frac(0,1), new Frac(1,1), new Frac(0,1)],
        [new Frac(0,1), new Frac(0,1), new Frac(1,1)],
        [new Frac(19,8), new Frac(3,7), new Frac(-87,56)]
    ],
    "3x4 independent - no Fractions"
)

gaussTests.add(
    [
        [new Frac(1,1), new Frac(0,1), new Frac(0,1), new Frac(0,1)],
        [new Frac(3,1), new Frac(0,1), new Frac(0,1), new Frac(0,1)],
        [new Frac(0,1), new Frac(0,1), new Frac(1,1), new Frac(0,1)],
        [new Frac(1,1), new Frac(1,1), new Frac(6,1), new Frac(0,1)],
        [new Frac(0,1), new Frac(0,1), new Frac(0,1), new Frac(0,1)]
    ],
    [
        [new Frac(1,1), new Frac(0,1), new Frac(0,1), new Frac(0,1)],
        [new Frac(3,1), new Frac(0,1), new Frac(0,1), new Frac(0,1)],
        [new Frac(0,1), new Frac(1,1), new Frac(0,1), new Frac(0,1)],
        [new Frac(0,1), new Frac(0,1), new Frac(1,1), new Frac(0,1)],
        [new Frac(0,1), new Frac(0,1), new Frac(0,1), new Frac(0,1)]
    ],
    "4 x 5"
)

gaussTests.runTests()


// tests.add(
//     [

//     ],
//     [

//     ],
//     ""
// )

