/** 
 * case 1
 * a b c d
 * 0 0 0 0
 * 0 0 0 0
 * 
 * case 2
 * a 0 b c
 * 0 d e f
 * 0 0 0 0
 * 
 * need to test when b, e are not zero, when one is zero, when both are zero
 * 
 * case 3
 * a b 0 c
 * 0 0 d e
 * 0 0 0 0
 * 
 * case 4
 * 
 */



//case 1
checkEqual(getInfiniteSolution([[1,0,0,0],[0,0,0,0],[0,0,0,0]]), ["0","y","z"], "test 1")
checkEqual(getInfiniteSolution([[1,2,3,4],[0,0,0,0],[0,0,0,0]]), ["x","(1/2)(4-x-3z)","(1/3)(4-x-2y)"], "test 1")
checkEqual(getInfiniteSolution([[1,0,3,-4],[0,0,0,0],[0,0,0,0]]), ["x","y","(1/3)(4-x)"], "test 1")
checkEqual(getInfiniteSolution([[1,0,0,4],[0,0,0,0],[0,0,0,0]]), ["4","y","z"], "test 1")
checkEqual(getInfiniteSolution([[1,0,-3,0],[0,0,0,0],[0,0,0,0]]), ["x","y","(1/-3)(0-x)"], "test 1")
checkEqual(getInfiniteSolution([[1,5,-3,0],[0,0,0,0],[0,0,0,0]]), ["x","(1/5)(0-x+3z)","(1/-3)(0-x-5y)"], "test 1")
checkEqual(getInfiniteSolution([[1,-2,0,0],[0,0,0,0],[0,0,0,0]]), ["x","(1/-2)(0-x)","z"], "test 1")


//case2
checkEqual(getInfiniteSolution([[1, 0, 0, 0],[0,0,1,0],[0,0,0,0]]), ["(0)","y","(0)"], "test 1")

checkEqual(getInfiniteSolution([[1, 2, 0, 0],[0,0,1,0],[0,0,0,0]]), ["x","(1/2)(0-x)","0"], "test 1")
checkEqual(getInfiniteSolution([[1, 2, 0, 0],[0,0,1,4],[0,0,0,0]]), ["x","(1/2)(0-x)","4"], "test 1")

checkEqual(getInfiniteSolution([[1, 0, 0, 3],[0,0,1,0],[0,0,0,0]]), ["3","y","0"], "test 1")
checkEqual(getInfiniteSolution([[1, 0, 0, 3],[0,0,1,4],[0,0,0,0]]), ["3","y","4"], "test 1")

checkEqual(getInfiniteSolution([[1, 1, 0, 1],[0,0,1,1],[0,0,0,0]]), ["x", "(1-x)", "(1)"], "test 1")
checkEqual(getInfiniteSolution([[1, -3, 0, 0],[0,0,1,7],[0,0,0,0]]), ["x","(1/-3)(0-x)","(7)"], "test 1")

//case 3
checkEqual(getInfiniteSolution([[1,0,0,2],[0,1,0,5],[0,0,0,0]]), ["2","5","z"], "test 1")
checkEqual(getInfiniteSolution([[1,0,0,2],[0,1,3,5],[0,0,0,0]]), ["2","y","(1/3)(5-y)"], "test 1")
checkEqual(getInfiniteSolution([[1,0,3,2],[0,1,0,5],[0,0,0,0]]), ["x","5","(1/3)(2-x)"], "test 1")
checkEqual(getInfiniteSolution([[1,0,3,2],[0,1,4,5],[0,0,0,0]]), ["2-3z","5-4z","z"], "test 1")
checkEqual(getInfiniteSolution([[1,0,3,0],[0,1,4,0],[0,0,0,0]]), ["0-3z","0-4z","z"], "test 1")


//misc
// checkEqual(getInfiniteSolution([[1,0,3,2],[0,1,-4,5],[0,0,0,0]]), ["(2-3z)","(5+4z)","z"], "test 1")
// checkEqual(getInfiniteSolution([[1,0,4,2],[0,1,1,2],[0,0,0,0]]), ["(2-4z)","(2-z)","z"], "test 1")
// checkEqual(getInfiniteSolution([[1,0,0,5],[0,1,0,-3],[0,0,0,0]]), ["(5)","(-3)","z"], "test 1")
// checkEqual(getInfiniteSolution([[1,0,11,0],[0,1,0,-3],[0,0,0,0]]), ["x","-3","(1/11)(0-x)"], "test 1")


// checkEqual(getInfiniteSolution(), [], "test 1")

// checkEqual(getInfiniteSolution(), [], "test 1")

// checkEqual(getInfiniteSolution(), [], "test 1")

// checkEqual(getInfiniteSolution(), [], "test 1")

// checkEqual(getInfiniteSolution(), [], "test 1")

//