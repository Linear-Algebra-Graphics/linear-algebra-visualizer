
class TriangularPlane {
    constructor(graph, vertices, color) {
        this.graph = graph
        this.vertices = vertices
        this.color = color
        this.linearTransformatio = new LinearTransformation([[1,0,0],[0,1,0],[0,0,1]])
    }

    setTransformation(linearTransformation) {
        this.linearTransformation = linearTransformation
    }


    draw() {
        let vertex1 = this.graph.changeBasisZoomAndRotate(this.vertices[0])
        let vertex2 = this.graph.changeBasisZoomAndRotate(this.vertices[1])
        let vertex3 = this.graph.changeBasisZoomAndRotate(this.vertices[2])
        this.graph.ctx.lineWidth = 4
        this.graph.ctx.beginPath()
            this.graph.ctx.moveTo(this.graph.centerX + (this.graph.scale * vertex1[0]), this.graph.centerY - (this.graph.scale * vertex1[1]))
            this.graph.ctx.lineTo(this.graph.centerX + (this.graph.scale * vertex2[0]), this.graph.centerY - (this.graph.scale * vertex2[1]))
            this.graph.ctx.lineTo(this.graph.centerX + (this.graph.scale * vertex3[0]), this.graph.centerY - (this.graph.scale * vertex3[1]))
        this.graph.ctx.closePath()
        this.graph.ctx.strokeStyle = this.color
        this.graph.ctx.stroke()
        this.graph.ctx.fillStyle = "grey"
        this.graph.ctx.fill()
    }
}
// graph.addObject()

// conspetual-problems-3
//    2
//    5
//    6

class Square2d {
    constructor(graph, vertices, outsideColor, insideColor) {
        this.graph        = graph
        this.vertices     = vertices
        this.outsideColor = outsideColor
        this.insideColor  = insideColor
        
        this.linearTransformation = new LinearTransformation([[1,0,0],[0,1,0],[0,0,1]])
    }

    setTransformation(linearTransformation) {
        this.linearTransformation = linearTransformation
    }

    draw() {


        // let point1 = vectorAdd(vectorMultiplication(this.graph.changeBasisZoomAndRotate(this.vertices[0]), this.scale), centercords)
        let point1 = matrixVectorMultiplication(this.linearTransformation.matrix, this.vertices[0])
        point1     = this.graph.changeBasisZoomAndRotate(point1)
        point1     = scaleVector(point1, this.graph.scale)
        point1     = [this.graph.centerX + point1[0], this.graph.centerY - point1[1]]

        let point2 = matrixVectorMultiplication(this.linearTransformation.matrix, this.vertices[1])
        point2     = this.graph.changeBasisZoomAndRotate(point2)
        point2     = scaleVector(point2, this.graph.scale)
        point2     = [this.graph.centerX + point2[0], this.graph.centerY - point2[1]]

        let point3 = matrixVectorMultiplication(this.linearTransformation.matrix, this.vertices[2])
        point3     = this.graph.changeBasisZoomAndRotate(point3)
        point3     = scaleVector(point3, this.graph.scale)
        point3     = [this.graph.centerX + point3[0], this.graph.centerY - point3[1]]
        
        let point4 = matrixVectorMultiplication(this.linearTransformation.matrix, this.vertices[3])
        point4     = this.graph.changeBasisZoomAndRotate(point4)
        point4     = scaleVector(point4, this.graph.scale)
        point4     = [this.graph.centerX + point4[0], this.graph.centerY - point4[1]]


        this.graph.ctx.lineWidth = 4
        this.graph.ctx.strokeStyle = this.outsideColor
        this.graph.ctx.fillStyle = this.insideColor;

        this.graph.ctx.beginPath()
            this.graph.ctx.moveTo(point1[0], point1[1])
            this.graph.ctx.lineTo(point2[0], point2[1])
            this.graph.ctx.lineTo(point3[0], point3[1])
            this.graph.ctx.lineTo(point4[0], point4[1])
            this.graph.ctx.lineTo(point1[0], point1[1])
            this.graph.ctx.closePath();
            this.graph.ctx.globalAlpha = 0.5;

            this.graph.ctx.fill();
            
        this.graph.ctx.stroke()
        this.graph.ctx.globalAlpha = 1;

    }
}




class CenteredThreeDimCube {

    constructor(graph, color, cubeType){
        this.graph  = graph
        this.color = color
        this.points = [
            [0,0,0],
            [1,0,0],
            [0,1,0],
            [1,1,0],

            [0,0,1],
            [1,0,1],
            [0,1,1],
            [1,1,1]
        ]

        this.lines = [
            [0,1, this.color],
            [1,3, this.color],
            [3,2, this.color],
            [2,0, this.color],

            [4,5, this.color],
            [5,7, this.color],
            [7,6, this.color],
            [6,4, this.color],

            [0,4, this.color],
            [2,6, this.color],
            [3,7, this.color],
            [1,5, this.color]

        ]

        if (cubeType == "centered") {
            this.scale = 2
            this.offset = [-.5, -.5, -.5]
        } else {
            this.scale = 1
            this.offset = [0, 0, 0]
        }
        
        this.linearTransformation = new LinearTransformation([[1,0,0],[0,1,0],[0,0,1]])
    }

    setTransformation(linearTransformation) {
        this.linearTransformation = linearTransformation
    }

    draw() {

        for(let i=0; i<this.lines.length; i++) {

            const scale = this.graph.canvas.width / this.graph.numOfGraphUnitsEdgeToEdge

            let point1 = this.points[this.lines[i][0]]
            let point2 = this.points[this.lines[i][1]]

            point1 = [point1[0] + this.offset[0], point1[1] + this.offset[1], point1[2] + this.offset[2]]
            point2 = [point2[0] + this.offset[0], point2[1] + this.offset[1], point2[2] + this.offset[2]]

            point1 = matrixVectorMultiplication(this.linearTransformation.matrix, point1)
            point2 = matrixVectorMultiplication(this.linearTransformation.matrix, point2)

            let firstPointUpdated  = this.graph.changeBasisZoomAndRotate(point1)
            let secondPointUpdated = this.graph.changeBasisZoomAndRotate(point2)    
            
            let firstX = this.graph.centerX + scale * this.scale * firstPointUpdated[0]
            let firstY = this.graph.centerY - scale * this.scale * firstPointUpdated[1]

            let secondX = this.graph.centerX + scale * this.scale * secondPointUpdated[0]
            let secondY = this.graph.centerY - scale * this.scale * secondPointUpdated[1]

            this.graph.drawLine(
              // First point
              [firstX, firstY],
              // Second point
              [secondX, secondY],
              // Offset
              this.lines[i][2],
              // Color
              4
            )
    
          }
    }
}
