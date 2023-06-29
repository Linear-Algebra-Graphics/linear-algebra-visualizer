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

checkEqual(dotProduct([1,2], [3,4]), 11, "dot product 1")
checkEqual(dotProduct([1,2,5], [3,4,2]), 21, "dot product 2")

checkEqual(matrixEquals(vectorMultiplication([1,2,3],[4,5,6]), [[4,8,12],[5,10,15],[6,12,18]]), true, "vector mult 1")
checkEqual(matrixEquals(vectorMultiplication([2,5,1],[1,4,5]), [[2,5,1],[8,20,4],[10,25,5]]), true, "vector mul 2")
checkEqual(matrixEquals(vectorMultiplication([-6,-5,1],[-3,4,-15]), [[18,15,-3],[-24,-20,4],[90,75,-15]]), true, "vector mul 3")