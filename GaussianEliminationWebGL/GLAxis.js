class GLAxis {
    constructor(axis, sides, width, length, color, alpha, offset) {

        // if (offset === undefined) {
        //     offset = [0,0,0]
        // }

        this.vertexData = []
        this.colorData  = []

        if (sides < 3) {
            throw new Error("Cylinder size < 3, not enough sides!")
        }
        
        if (length <= 0) {
            throw new Error("Cylinder has 0 or negative length!")
        }
    
        let angle = (2*Math.PI) / sides
        let currentAngle = 0
        
        for(let i = 0; i < sides; i++) {

            // This makes one rectangle.
            // The v1-v4 are the corners of the rectangle.
            // We split it into two triangles
    
            let y = Math.sin(angle) * (width/2)
            let z = Math.cos(angle) * (width/2)
    
            let y1 = Math.sin(currentAngle + angle) * (width/2)
            let z1 = Math.cos(currentAngle + angle) * (width/2)
            
            let v_1 = undefined
            let v_2 = undefined
            let v_3 = undefined
            let v_4 = undefined
    
            if (axis == "x") {
    
                v_1 = [-length * 0,y,z]
                v_2 = [length,y,z]
    
                v_3 = [-length * 0,y1,z1]
                v_4 = [length,y1,z1]
    
            } else if (axis == "y") {
    
                v_1 = [y,-length * 0,z]
                v_2 = [y,length,z]
    
                v_3 = [y1,-length * 0,z1]
                v_4 = [y1,length,z1]
    
            } else if (axis == "z") {
    
                v_1 = [z,y,-length * 0]
                v_2 = [z,y,length]
    
                v_3 = [z1,y1,-length * 0]
                v_4 = [z1,y1,length]
    
            } else {
                throw new Error("Axis must be x, y, or z")
            }
            
            // console.log(offset)

            //offset = scaleVector(offset, -1)
            this.vertexData =  this.vertexData.concat(vectorAdd(v_1, offset))
            this.vertexData =  this.vertexData.concat(vectorAdd(v_2, offset))
            this.vertexData =  this.vertexData.concat(vectorAdd(v_4, offset))
    
            this.vertexData =  this.vertexData.concat(vectorAdd(v_3, offset))
            this.vertexData =  this.vertexData.concat(vectorAdd(v_4, offset))
            this.vertexData =  this.vertexData.concat(vectorAdd(v_1, offset))
            
            let colorAndAlpha = color.concat(alpha)
            for (let i = 0; i < 6; i++) {
                this.colorData =  this.colorData.concat(colorAndAlpha)
            }
    
            currentAngle += angle
        }

    }

    getVertexColorData() {
        return {vertexData: this.vertexData, colorData: this.colorData}
    }
}

