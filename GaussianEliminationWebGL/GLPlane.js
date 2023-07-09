
class GLPlane {
    
    constructor(normalVector, sideLength, colorVector, alpha, planeCenter) {
        this.vertexData = []
        this.colorData = []


        let a = normalVector[0]
        let b = normalVector[1]
        let c = normalVector[2]

        //debugger

        //calculate orthonormal basis of plane
        if(!(a == 0 && b == 0 && c == 0)) {
            let planeBasis = new Array(2)

            if(a != 0) {
                // x = -(b/a)y - (c/a)z   |-b/a -c/a|
                // y = y + 0z             |1       0|
                // z = 0y + z             |0       1|
                
                planeBasis[0] = [(-1 * b/a), 1, 0]
                planeBasis[1] = [(-1 * c/a), 0, 1]
                
            } else if (b != 0) {
                // x = x + 0z             |1       0|
                // y = -(a/b)x - (c/b)z   |-a/b -c/b|
                // z = 0x + z             |0       1|
                
                planeBasis[0] = [1,(-1 * a/b),0]
                planeBasis[1] = [0,(-1 * b/c),1]
                
            } else {
                // x = x                  |1       0|
                // y = y                  |0       1|
                // z = -(a/c)x - (b/c)y   |-a/c -b/c|

                planeBasis[0] = [1,0,-a/c]
                planeBasis[1] = [0,1,-b/c]
            }

            let orthanormalBasis = GramSchmidt(planeBasis)
            let basisVec1 = orthanormalBasis[0]
            let basisVec2 = orthanormalBasis[1]
            

            let point1 = [planeCenter[0] + basisVec1[0] + basisVec2[0], planeCenter[1] + basisVec1[1] + basisVec2[1], planeCenter[2] + basisVec1[2] + basisVec2[2]]
            let point2 = [planeCenter[0] + basisVec1[0] - basisVec2[0], planeCenter[1] + basisVec1[1] - basisVec2[1], planeCenter[2] + basisVec1[2] - basisVec2[2]]

            let point3 = [planeCenter[0] - basisVec1[0] + basisVec2[0], planeCenter[1] - basisVec1[1] + basisVec2[1], planeCenter[2] - basisVec1[2] + basisVec2[2]]
            let point4 = [planeCenter[0] - basisVec1[0] - basisVec2[0], planeCenter[1] - basisVec1[1] - basisVec2[1], planeCenter[2] - basisVec1[2] - basisVec2[2]]

            point1 = scaleVector(point1, sideLength)
            point2 = scaleVector(point2, sideLength)
            point3 = scaleVector(point3, sideLength)
            point4 = scaleVector(point4, sideLength)


            this.vertexData = this.vertexData.concat(point1)
            this.vertexData = this.vertexData.concat(point3)
            this.vertexData = this.vertexData.concat(point2)

            this.vertexData = this.vertexData.concat(point3)
            this.vertexData = this.vertexData.concat(point2)
            this.vertexData = this.vertexData.concat(point4)
            
            

            let colorAndAlpha = colorVector.concat(alpha)
            for (let i = 0; i < 6; i++) {
                this.colorData = this.colorData.concat(colorAndAlpha)
            }
        }


        // console.log(this.vertexData)
        // console.log(this.colorData)

    }


    getVertexColorData() {
        return {vertexData: this.vertexData, colorData: this.colorData}
    }


}