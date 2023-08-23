function checkEqual(first, second, message) {
    if (first === second) {
        console.log("%c \u2713 " + message + " Passed", "color: green; background: black;")
        
    } else {
        console.log("%c \u2717  " + message + " Failed", "color: red; background: black;")
        console.log(first.toString())
        console.log(second.toString())
    }
}