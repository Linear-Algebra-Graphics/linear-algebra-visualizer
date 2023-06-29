


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
