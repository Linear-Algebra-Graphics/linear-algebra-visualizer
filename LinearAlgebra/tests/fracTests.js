class FracTests {
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
            let result = equalFrac(this.inputList[i][0], this.inputList[i][1])
            let passed = result == this.expectedResultList[i]
            if (passed == true) {
                testsPassedInARow++
            } else {
                console.log("%c \u2713 " + "("  + testsPassedInARow  + ")" + " Tests passed", "color: green; background: black;")
                console.log("%c \u2717 " + this.testNameList[i] + " Failed", "color: red; background: black;")
                console.log("Input: ")
                console.log(this.inputList[i])
                console.log("Expected: ")
                console.log(this.expectedResultList[i])
                console.log("Actual: ")
                console.log(result)
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
        let result = equalFrac(this.inputList[i][0], this.inputList[i][1])
        let passed = result == expectedResultList[i]
        if (passed == true) {
            console.log("%c \u2713 " + message + " Passed", "color: green; background: black;")
        } else {
            console.log("%c \u2717  " + message + " Failed", "color: red; background: black;")
            console.log("Input: ")
            console.log(this.inputList[testNumber])
            console.log("Expected: ")
            console.log(this.expectedResultList[testNumber])
            console.log("Actual: ")
            console.log(result)
        }
        
    }
}

function getRandomNumberNotZero(min, max) {
    let result = Math.floor(Math.random() * (max - min + 1) + min)
    while(result == 0) {
        result = Math.floor(Math.random() * (max - min + 1) + min)
    }
    return result
}

let fracTests = new FracTests()

fracTests.add(
    [
    new Frac(0,1),
    new Frac(0,1),
    ],
    true,
    "Zero equal to zero."
)

fracTests.add(
    [
    new Frac(0,3),
    new Frac(0,1),
    ],
    true,
    "Zero equal to zero."
)

fracTests.add(
    [
    new Frac(0,1),
    new Frac(0,42),
    ],
    true,
    "Zero equal to zero."
)

for (let i = 0; i < 100; i++) {
    let numerator = 0
    let denominator1 = getRandomNumberNotZero(-1000,1000)
    let denominator2 = getRandomNumberNotZero(-1000,1000)

    fracTests.add(
        [
        new Frac(numerator,denominator1),
        new Frac(numerator,denominator2),
        ],
        true,
        "Zero equal to zero."
    )
}

for (let i = 0; i < 100; i++) {
    let numerator1 = 0
    let denominator1 = getRandomNumberNotZero(-1000,1000)

    let numerator2 = getRandomNumberNotZero(-1000,1000)
    let denominator2 = getRandomNumberNotZero(-1000,1000)

    fracTests.add(
        [
        new Frac(numerator1,denominator1),
        new Frac(numerator2,denominator2),
        ],
        false,
        "Zero not equal to not zero."
    )
}

fracTests.add(
    [
    new Frac(1,1),
    new Frac(1,1),
    ],
    true,
    "1 equal to 1"
)

fracTests.add(
    [
    new Frac(1,1),
    new Frac(5,5),
    ],
    true,
    "1 equal to 1"
)

fracTests.add(
    [
    new Frac(2,2),
    new Frac(7,7),
    ],
    true,
    "1 equal to 1"
)

for (let i = 0; i < 100; i++) {
    let numerator1 = getRandomNumberNotZero(-1000,1000)
    let numerator2 = getRandomNumberNotZero(-1000,1000)
    let denominator1 = numerator1
    let denominator2 = numerator2

    fracTests.add(
        [
        new Frac(numerator1, denominator1),
        new Frac(numerator2, denominator2),
        ],
        true,
        "1 equal 1"
    )
}

for (let i=0; i<100; i++) {
    let scaler = getRandomNumberNotZero(-1000,1000)
    let numerator1 = getRandomNumberNotZero(-1000,1000)
    let numerator2 = getRandomNumberNotZero(-1000,1000)
    let denominator1 = numerator1
    let denominator2 = numerator2

    fracTests.add(
        [
        new Frac(numerator1 * scaler, denominator1 * scaler),
        new Frac(numerator2, denominator2),
        ],
        true,
        "1 equal 1 - scaler"
    )
}

for (let i = 0; i < 100; i++) {
    let numerator1   = getRandomNumberNotZero(-1000,1000)
    let denominator1   = getRandomNumberNotZero(-1000,1000)

    let numerator2   = denominator1
    let denominator2 = numerator1

    if (Math.abs(numerator1) != Math.abs(denominator1)) {
        fracTests.add(
            [
            new Frac(numerator1, denominator1),
            new Frac(numerator2, denominator2),
            ],
            false,
            "two different numbers"
        )
    }
}



// Reduction tests
fracTests.add(
    [
        new Frac(8,8),
        new Frac(1,1)
    ],
    true,
    "reduction"
)

fracTests.add(
    [
        new Frac(4,16),
        new Frac(1,4)
    ],
    true,
    "redution"
)

fracTests.add(
    [
        new Frac(-2,-16),
        new Frac(1,8)
    ],
    true,
    "redution"
)




fracTests.add(
    [
        addFracs(new Frac(3,1), new Frac(5,1)),
        new Frac(8,1)
    ],
    true,
    "Adding hole numbers"
)

fracTests.add(
    [
        addFracs(new Frac(-4,1), new Frac(-1,1)),
        new Frac(-5,1)
    ],
    true,
    "Adding negative numbers"
)

fracTests.add(
    [
        addFracs(new Frac(10,1), new Frac(-7,1)),
        new Frac(3,1)
    ],
    true,
    "Adding one negaive"
)

fracTests.add(
    [
        addFracs(new Frac(1,2), new Frac(5,8)),
        new Frac(9, 8)
    ],
    true,
    "Adding fractions"
)

fracTests.add(
    [
        addFracs(new Frac(-6,5), new Frac(-1,3)),
        new Frac(-23,15)
    ],
    true,
    "Adding negative fractions"
)

fracTests.add(
    [
        addFracs(new Frac(1,8), new Frac(9,-1)),
        new Frac(-71,8)
    ],
    true,
    "Adding mixed fractions"
)

fracTests.add(
    [
       addFracs(new Frac(0,4), new Frac(1,4)),
       new Frac(1, 4)
    ],
    true,
    "Adding zero to fraction"
)

fracTests.runTests()