/**
 * does Gram Schmidt smart process on basis
 * @param {*} v a basis
 * @requires : basis is linearly independent
 * @returns an orthonormal representation of the input basis
 */
function GramSchmidt (basis) {
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
 * @param {*} b a vector
 * @param {*} u a vector 
 * @requires b and u are both vectors in Rn 
 * @returns the projection of b onto u
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

/**
 * calcualtes the vector subtraction v1 - v2
 * @param {*} v1 a vector
 * @param {*} v2 a vector
 * @requires that v1, v2 in Rn
 * @returns a vector v1 - v2
 */
function vectorSubtract(v1, v2) {
    if (v1.length !== v2.length) {
        throw new Error("vector subtract called on vectors of diff lengths!")
    }
    let result = Array(v1.length)
    
    for (let i = 0; i < v1.length; i++) {
        result[i] = v1[i] - v2[i]
    }
    
    return result
}

/**
 * calcualtes the vector addition v1 + v2
 * @param {*} v1 a vector
 * @param {*} v2 a vector
 * @requires that v1, v2 in Rn
 * @returns a vector v1 + v2
 */
function vectorAdd(v1, v2) {
    let result = Array(v1.length)
    
    for (let i=0; i<v1.length; i++) {
        result[i] = v1[i] + v2[i]
    }
    
    return result
}

function scaleVector(v, c) {
    let result = Array(v.length)
    
    for (let i=0; i<v.length; i++) {
        result[i] = v[i] * c
    }
    
    return result
}