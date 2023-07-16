function matrixEqual(matrix1, matrix2) {

}

class Tests {
    constructor() {
        this.actualResultList   = []
        this.expectedResultList = []
        this.testNameList       = []
    }

    add(result, expected, name) {
        this.actualResultList.push(result)
        this.expectedResultList.push(expected)
        this.testNameList.push(name)
    }

    runTests(stopOnFirstFailed) {
        console.log("Total tests: " + this.actualResultList.length)
        let testsPassedInARow = 0
        for (let i=0; i<this.actualResultList.length; i++) {
            passed = matrixEqual(this.actualResultList[i], this.expectedResultList[i])
            if (passed == true) {
                testsPassedInARow++                
            } else {
                console.log("%c \u2713 " + "("  + testsPassedInARow  + ")" + " Tests passed", "color: green; background: black;")
                console.log("%c \u2717 " + this.testNameList[i] + " Failed", "color: red; background: black;")
                console.log("Expected: ")
                console.log(this.expectedResultList[i].toString())
                console.log("Actual: ")
                console.log(this.actualResultList[i].toString())
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
        // console.log(this.tesetNameList[testNumber])
        passed = matrixEqual(this.actualResultList[i], this.expectedResultList[i])
        if (passed == true) {
            console.log("%c \u2713 " + message + " Passed", "color: green; background: black;")
        } else {
            console.log("%c \u2717  " + message + " Failed", "color: red; background: black;")
            console.log("Expected: ")
            console.log(this.expectedResultList[i].toString())
            console.log("Actual: ")
            console.log(this.actualResultList[i].toString())
        }
        
    }
}

tests = new Tests()

tests.add(
    [[new Fraction(1,1)],[new Fraction(1,1)]],
    [[new Fraction(1,1)],[new Fraction(1,1)]],
    "1x2 matrix"
)

tests.add(
    [[new Fraction(1,1)],[new Fraction(1,1)]],
    [[new Fraction(1,1)],[new Fraction(1,1)]],
    "1x2 matrix"
)



checkEqual(1,2,"test")

// //vectorEquals tests
// checkEqual(vectorEquals([0,0,0],[0,0,0]), true, "vector Equality 1")
// checkEqual(vectorEquals([1,2,3],[1,2,3]), true, "vector Equality 2")
// checkEqual(vectorEquals([10,-15,33],[10,-15,33]), true, "vector Equality 4")
// checkEqual(vectorEquals([1,4,2],[2,4,2]), false, "vector Equality 5")
// checkEqual(vectorEquals([1,4,2],[1,3,2]), false, "vector Equality 6")
// checkEqual(vectorEquals([1,4,2],[1,4,3]), false, "vector Equality 7")
