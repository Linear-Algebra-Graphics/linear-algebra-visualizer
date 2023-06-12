

let matrix = [[1,0,0],[0,1,0],[0,0,1]]
let vec = [1,2,3]

function checkEqual(first, second) {
    if (first === second) {
        console.log("%c \u2713 Passed", "color: green; background: black;")
    } else {
        console.log("%c \u2717 Failed", "color: red; background: black;")
    }
}

checkEqual(1,1)
checkEqual(1,2)

