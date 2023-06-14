

let matrix1 = [[1,0,0],[0,1,0],[0,0,1]]
let vec1 = [1,2,3]

function checkEqual(first, second) {
    if (first === second) {
        console.log("%c \u2713 Passed", "color: green; background: black;")
        
    } else {
        console.log("%c \u2717 Failed", "color: red; background: black;")
        console.log(first.toString())
        console.log(second.toString())
    }
}

checkEqual(matrixVectorMultiplication(matrix1, vec1),[1,2,3])
checkEqual(matrixVectorMultiplication([[1,4,7],[2,5,8],[3,6,9]], vec1),[14,32,50])
checkEqual(matrixMultiplication([[1,4,7],[2,5,8],[3,6,9]],  [[1,0,0],[0,1,0],[0,0,1]]), [[1,4,7],[2,5,8],[3,6,9]])

