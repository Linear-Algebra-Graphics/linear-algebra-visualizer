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

//vectorEquals tests
checkEqual(vectorEquals([0,0,0],[0,0,0]), true, "vector Equality 1")
checkEqual(vectorEquals([1,2,3],[1,2,3]), true, "vector Equality 2")
checkEqual(vectorEquals([10,-15,33],[10,-15,33]), true, "vector Equality 4")
checkEqual(vectorEquals([1,4,2],[2,4,2]), false, "vector Equality 5")
checkEqual(vectorEquals([1,4,2],[1,3,2]), false, "vector Equality 6")
checkEqual(vectorEquals([1,4,2],[1,4,3]), false, "vector Equality 7")

//matrixEquals tests
checkEqual(matrixEquals([[1,0,0],[0,1,0],[0,0,1]], [[1,0,0],[0,1,0],[0,0,1]]), true, "matrix equality 1")
checkEqual(matrixEquals([[1,0,0],[-0,1,0],[0,0,1]], [[1,0,-0],[0,1,0],[0,0,1]]), true, "matrix equality 2")
checkEqual(matrixEquals([[1,4],[2,5]], [[1,4],[2,5]]), true, "matrix equality 3")
checkEqual(matrixEquals([[-10,4],[64,5]], [[-10,4],[64,5]]), true, "matrix equality 4")
checkEqual(matrixEquals([[1,4,7],[2,5,8],[3,6,9]], [[3,4,1],[2,5,1],[3,6,2]]), false, "matrix equality 5")
checkEqual(matrixEquals([[-10,4],[64,5]], [[-11,4],[64,5]]), false, "matrix equality 6")

//matrixVectorMultiplication tests
checkEqual(vectorEquals(matrixVectorMultiplication(matrix1, vec1),[1,2,3]), true, "matrix vec mult 1")
checkEqual(vectorEquals(matrixVectorMultiplication([[1,4,7],[2,5,8],[3,6,9]], vec1),[14,32,50]), true, "matrix vec mult 2")

//matrixMultiplication tests
checkEqual(matrixEquals(matrixMultiplication([[1,4,7],[2,5,8],[3,6,9]],  [[1,0,0],[0,1,0],[0,0,1]]), [[1,4,7],[2,5,8],[3,6,9]]), true,  "matrix matrix mult 1")
checkEqual(matrixEquals(matrixMultiplication([[1,2,3],[4,5,6],[7,8,9]],  [[1,0,0],[0,1,0],[0,0,1]]), [[1,2,3],[4,5,6],[7,8,9]]), true,  "matrix matrix mult 2")
checkEqual(matrixEquals(matrixMultiplication([[1,2,3],[4,5,6],[7,8,9]],  [[1,4,7],[2,5,8],[3,6,9]]), [[66,78,90],[78,93,108],[90,108,126]]), true,  "matrix matrix mult 3")
checkEqual(matrixEquals(matrixMultiplication([[7, 8, 9],[10, 11, 12]], [[1, 2],[3, 4],[5, 6]]), [[27, 30, 33], [61, 68, 75], [95, 106, 117]]), true, "matrix multiplcation 4")

//dotProduct tests
checkEqual(dotProduct([1,2], [3,4]), 11, "dot product 1")
checkEqual(dotProduct([1,2,5], [3,4,2]), 21, "dot product 2")

//vectorMultiplication (cross product) tests
checkEqual(matrixEquals(vectorMultiplication([1,2,3],[4,5,6]), [[4,8,12],[5,10,15],[6,12,18]]), true, "vector mult 1")
checkEqual(matrixEquals(vectorMultiplication([2,5,1],[1,4,5]), [[2,5,1],[8,20,4],[10,25,5]]), true, "vector mul 2")
checkEqual(matrixEquals(vectorMultiplication([-6,-5,1],[-3,4,-15]), [[18,15,-3],[-24,-20,4],[90,75,-15]]), true, "vector mul 3")

//numEqual tests
checkEqual(numEqual(1,1,12), true, "num equals 1")
checkEqual(numEqual(1.01, 1, 1), true, "num equals 2")
checkEqual(numEqual(1.0000000000001, 1, 12), true, "num equals 3")
checkEqual(numEqual(5, 5, 12), true, "num equals 4")
checkEqual(numEqual(5, 6, 12), false, "num equals 5")
checkEqual(numEqual(1000, 1, 12), false, "num equals 6")
checkEqual(numEqual(1.00000000001, 1, 12), false, "num equals 7")
checkEqual(numEqual(14, 16, 2), false, "num equals 8")

//vectorLength tests