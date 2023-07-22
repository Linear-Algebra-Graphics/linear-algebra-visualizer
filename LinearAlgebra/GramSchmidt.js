/**
 * does Gram Schmidt smart process on basis
 * @param {*} v a basis
 * @requires : basis is linearly independent
 * @returns an orthonormal representation of the input basis
 */
function gramSchmidt (basis) {
    //make local copy of basis 
    let basisCopy = JSON.parse(JSON.stringify(basis))

    let u = Array(basisCopy.length)

    for (let i = 0; i < basisCopy.length; i++) {
        u[i] = basisCopy[i]
        for(let j = i - 1; j >= 0; j--) {
            u[i] = vectorSubtract(u[i], ProjectOntoVector(basisCopy[i], u[j]))
        }
    }

    
    for (let i = 0; i < u.length; i++) {
        u[i] = normalizeVector(u[i])
    }
    
    return u
}

/**
 * Projects b onto u
 * @param {Number[]} b a vector
 * @param {Number[]} u a vector 
 * @requires : b and u are both vectors in Rn 
 * @returns {Number[]} the projection of b onto u
 */
function ProjectOntoVector(b, u) {
    // P = (uu^t) / (u^t u)
    // Pb = (uu^t)b / (u^t u)
    
    let top = matrixVectorMultiplication(vectorMultiplication(u,u), b)

    let dotproduct = dotProduct(u,u)

    for (i = 0; i < top.length; i++) {
        top[i] = top[i] / dotproduct
    }

    return top

}