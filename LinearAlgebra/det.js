function det3x3(matrix) {
    // First row
    let e11 = matrix[0][0]
    let e12 = matrix[1][0]
    let e13 = matrix[2][0]

    // Second row
    let e21 = matrix[0][1]
    let e22 = matrix[1][1]
    let e23 = matrix[2][1]
    
    // Third row
    let e31 = matrix[0][2]
    let e32 = matrix[1][2]
    let e33 = matrix[2][2]
    
    let det = (e11*e22*e33) + (e12*e23*e31) + (e13*e21*e32) - (e11*e23*e32) - (e12*e21*e33) - (e13*e22*e31)
    return det
}