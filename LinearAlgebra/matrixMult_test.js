

let matrix1 = [[1,0,0],[0,1,0],[0,0,1]]
let vec1 = [1,2,3]

function checkEqual(first, second, message) {
    if (first === second) {
        console.log("%c \u2713 " + message + " Passed", "color: green; background: black;")
        
    } else {
        console.log("%c \u2717  " + message + " Failed", "color: red; background: black;")
        console.log(first.toString())
        console.log(second.toString())
    }
}

checkEqual(matrixEquals([[1,0,0],[0,1,0],[0,0,1]], [[1,0,0],[0,1,0],[0,0,1]]), true, "matrix equality 1")
checkEqual(matrixEquals([[1,0,0],[-0,1,0],[0,0,1]], [[1,0,-0],[0,1,0],[0,0,1]]), true, "matrix equality 2")
checkEqual(matrixEquals([[1,4,7],[2,5,8],[3,6,9]], [[1,4,7],[2,5,8],[3,6,9]]), true, "matrix equality 3")
checkEqual(matrixEquals([[1,4,7],[2,5,8],[3,6,9]], [[3,4,1],[2,5,1],[3,6,2]]), false, "matrix equality 4")

checkEqual(matrixVectorMultiplication(matrix1, vec1),[1,2,3], "matrix vec mult 1")
checkEqual(matrixVectorMultiplication([[1,4,7],[2,5,8],[3,6,9]], vec1),[14,32,50], "matrix vec mult 2")

checkEqual(matrixEquals(matrixMultiplication([[1,4,7],[2,5,8],[3,6,9]],  [[1,0,0],[0,1,0],[0,0,1]]), [[1,4,7],[2,5,8],[3,6,9]]), true,  "matrix matrix mult 1")
checkEqual(matrixEquals(matrixMultiplication([[1,2,3],[4,5,6],[7,8,9]],  [[1,0,0],[0,1,0],[0,0,1]]), [[1,2,3],[4,5,6],[7,8,9]]), true,  "matrix matrix mult 2")
checkEqual(matrixEquals(matrixMultiplication([[1,2,3],[4,5,6],[7,8,9]],  [[1,4,7],[2,5,8],[3,6,9]]), [[66,78,90],[78,93,108],[90,108,126]]), true,  "matrix matrix mult 3")

checkEqual(matrixEquals(matrixMultiplication([[7, 8, 9],[10, 11, 12]], [[1, 2],[3, 4],[5, 6]]), [[27, 30, 33], [61, 68, 75], [95, 106, 117]]), true, "matrix multiplcation 4")

checkEqual(vectorMultiplication([1,2], [3,4]), 11, "vec vec mult 1")
checkEqual(vectorMultiplication([1,2,5], [3,4,2]), 21, "vec vec mult 2")
