class GaussianSteps {
    
    constructor(matrix) {
        this.matrix      = matrix
        this.steps       = gaussianElimination(matrix)
        this.answer      = this.steps[this.steps.length-1][3]
        console.log(this.steps)

        this.currentStep = 0
        //this.colorList = [this._getRandomColor(),this._getRandomColor(),this._getRandomColor(),this._getRandomColor(),this._getRandomColor(),this._getRandomColor(),this._getRandomColor()]
        this.colorList = [[52/256, 168/256, 83/256],[61/256, 90/256, 128/256],[211/256, 84/256, 0/256]]
    }

    //asdasdadasd
    _getRandomColor() {
        //return Math.random() * (max - min) + min;
        let min = 0
        let max = 1
        return [(Math.random() * (max - min) + min),(Math.random() * (max - min) + min),(Math.random() * (max - min) + min)]
    }

    getVertexColorData() {
        let planeList = new Array(this.matrix[0].length)

        let currentMatrix = this.steps[this.currentStep]

        for (let i = 0; i < this.matrix[0].length; i++) {
            let normalVec = [currentMatrix[0][i], currentMatrix[1][i], currentMatrix[2][i]]
            // let colorVector
            // if (i == 1) {
            //     colorVector = [0.7,0,0]
            // } else if (i == 2) {
            //     colorVector = [0,0.7,0]
            // } else {
            //     colorVector = [0,0,0.7]
            // }
            planeList[i] = new GLPlane(normalVec, 2, this.colorList[i], 1, [0,0,0])
        }
        
        // console.log(planeList)
        // vertexData: this.vertexData, colorData: this.colorData

        let vertexData = []
        let colorData  = []
        //console.log(this.answer)
        let x = new GLAxis("x", 6, .1, 2, [0,0,1], 1, scaleVector(this.answer,-1))
        let y = new GLAxis("y", 6, .1, 2, [1,0,0], 1, scaleVector(this.answer,-1))
        let z = new GLAxis("z", 6, .1, 2, [0,1,0], 1, scaleVector(this.answer,-1))

        planeList.push(x)
        planeList.push(y)
        planeList.push(z)

        for (let i = 0; i < planeList.length; i++) {
            let currentVertexColorData = planeList[i].getVertexColorData()

            vertexData = vertexData.concat(currentVertexColorData.vertexData)
            colorData  = colorData.concat(currentVertexColorData.colorData)

        }

        
        return {vertexData: vertexData, colorData: colorData}

    }

    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++
        }
        console.log(transpose(this.steps[this.currentStep]))
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--
        }
    }
}