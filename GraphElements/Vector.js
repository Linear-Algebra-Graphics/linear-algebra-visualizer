class Vector {
    /**
     * creates an instance of a vector
     * @param {*} graph graph on which vector is drawn
     * @param {Number[]} cords coordinates (x, y, z) of vector
     * @param {String} color color of vector
     * @param {Boolean} arrow true if vector has arrow at the end
     * @param {String} label case ""      : no label 
     *                  case "cords" : shows coordinates in (x, y, z) format
     *                  case other   : whatever label "other" is
     */
    constructor(graph, cords, color, lineWidth, arrow, label){
        this.graph     = graph
        this.cords     = cords
        this.color     = color
        this.lineWidth = lineWidth
        this.arrow     = arrow
        this.label     = label
        this.linearTransformation = new LinearTransformation([[1,0,0],[0,1,0],[0,0,1]])
    }

    /**
     * 
     * @param {LinearTransformation} linearTransformation 
     */
    setTransformation(linearTransformation) {
        this.linearTransformation = linearTransformation
    }

    /**
     * draws the vector on the graph, according to 
     * given color, linewidth, arrows if requested, and label if requested
     */
    draw() {
        //check if vector is significantly larger than canvas
        let transformedCords = matrixVectorMultiplication(this.linearTransformation.matrix, this.cords)

        this.graph.drawPointToPoint([0,0,0], transformedCords, this.color, this.lineWidth)

        if(this.arrow) {
            let arrowLength = .3
            if (this.graph.currentZoom <= 1) {
                arrowLength = arrowLength * this.graph.currentZoom
            }
            let inBasisCords = this.graph.changeBasisZoomAndRotate(transformedCords)

            let vectorLength = Math.abs( Math.sqrt( Math.pow(inBasisCords[0], 2) + Math.pow(inBasisCords[1], 2) + Math.pow(inBasisCords[2], 2)) )
            let inverseNormalizedVectorButThenScaledToCorrectLength = [arrowLength * -1 * (1/vectorLength) * inBasisCords[0], arrowLength * -1 * (1/vectorLength) * inBasisCords[1], arrowLength * -1 * (1/vectorLength) * inBasisCords[2]]
            
            //angle of the arrow head to line
            let headAngle = Math.PI/6;

            // Both xy rotations with theta=45deg and theta=-45deg
            let rotationMatrix1 = [[Math.cos(headAngle), Math.sin(headAngle), 0], [-1 * Math.sin(headAngle), Math.cos(headAngle), 0], [0, 0, 1]]
            let rotationMatrix2 = [[Math.cos((2*Math.PI) - headAngle), Math.sin((2*Math.PI) - headAngle), 0], [-1 * Math.sin((2*Math.PI) - headAngle), Math.cos((2*Math.PI) - headAngle), 0], [0, 0, 1]]
            
            let arrow1 = matrixVectorMultiplication(rotationMatrix1, inverseNormalizedVectorButThenScaledToCorrectLength)
            let arrow2 = matrixVectorMultiplication(rotationMatrix2, inverseNormalizedVectorButThenScaledToCorrectLength)

            //want to add onto this.cords here because this is still in vector notation, 
            //so no need to subtract the ys as that is taken care of in drawLine
            this._drawArrowLine(inBasisCords, [inBasisCords[0] + arrow1[0], inBasisCords[1] + arrow1[1], 0], this.color, this.lineWidth)
            this._drawArrowLine(inBasisCords, [inBasisCords[0] + arrow2[0], inBasisCords[1] + arrow2[1], 0], this.color, this.lineWidth)
        }
        

        if (this.label != "") {
                        
                        
            let inBasisCords = this.graph.changeBasisZoomAndRotate(transformedCords)
            
            let scale = this.graph.scale
            let centerX = this.graph.centerX
            let centerY = this.graph.centerY

            this.graph.ctx.font = "45px Monospace"
            this.graph.ctx.fillStyle = this.color
            this.graph.ctx.textAlign = 'center'
            this.graph.ctx.textBaseline = 'middle';

            let labelXOffset = ((inBasisCords[0])/(vectorLength(inBasisCords)) * 60)
            let labelYOffset = ((inBasisCords[1])/(vectorLength(inBasisCords)) * 60)
            
            if (this.graph.currentZoom < 1) {
                labelXOffset = labelXOffset * this.graph.currentZoom
                labelYOffset = labelYOffset * this.graph.currentZoom
            }
            
            let labelX = centerX + (scale * inBasisCords[0]) + labelXOffset
            let labelY = centerY - (scale * inBasisCords[1]) - labelYOffset
            
            if (this.label == "cords") {
                //coordinates relative to non rotated basis
                //this.graph.ctx.fillText("(" + formatNumber(inBasisCords[0]) + "," + formatNumber(inBasisCords[1]) + "," + formatNumber(inBasisCords[2]) + ")", labelX, labelY)
                
                //coordinates relative to basis
                this.graph.ctx.fillText("(" + formatNumber(transformedCords[0]) + "," + formatNumber(transformedCords[1]) + "," + formatNumber(transformedCords[2]) + ")", labelX, labelY)
            } else {
                this.graph.ctx.fillText(this.label, labelX, labelY)
            }
        }

        this.graph.drawDotFromVector(transformedCords, this.color, 1)
    }

    /**
     * NOTE: potentially use graph methods instead??
     * 
     * draws line from endpoint of vector 1 to endpoint of vector 2
     * w.r.t the standard (nontransformed) basis
     * @param {Number[]} vector1 
     * @param {Number[]} vector2 
     * @param {String} color 
     * @param {Number} lineWidth 
     */
    _drawArrowLine(vector1, vector2, color, lineWidth) {    
        // First apply the basis, then the applied matrix. Not sure if this is the correct order for all situations...

        let vec1X = this.graph.centerX + this.graph.scale * vector1[0]
        let vec1Y = this.graph.centerY - this.graph.scale * vector1[1]

        let vec2X = this.graph.centerX + this.graph.scale * vector2[0]
        let vec2Y = this.graph.centerY - this.graph.scale * vector2[1]

        this.graph.drawLine([vec1X, vec1Y],[vec2X, vec2Y], color, lineWidth)
    }
}