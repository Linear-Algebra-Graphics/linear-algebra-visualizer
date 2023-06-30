function GramSchmidt (v) {
    let u = Array(vectorList.length)

    for (let i = 0; i < vectorList.length; i++) {
        u[i] = v[i]
        for(let j = i - 1; j >= 0; j--) {
            u[i] -= ProjectOntoVector(v[i], u[j])
        }
    }
}

/**
 * Projects b onto u
 * @param {*} b a vector
 * @param {*} u a vector 
 * @requires b and u are both vectors in Rn 
 * @returns the projection of b onto u
 */
function ProjectOntoVector(b, u) {
    // P = (uu^t) / (u^t u)
    // Pb = (uu^t)b / (u^t u)
    
    top = (matrixVectorMultiplication(vectorMultiplication(u,u)), b)

    dotproduct  = dotProduct(u,u)

    for (i = 0; i < top.length; i++) {
        top[i] = top[i] / dotproduct
    }

    return top

}