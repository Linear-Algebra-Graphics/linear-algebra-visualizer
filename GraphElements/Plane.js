
//keep as mascot
class Plane {
    /**
     * creates an instance of a plane
     * @param {*} graph 
     * @param {*} normal normal vector 
     * @param {*} centerCords 
     * @param {*} color color of plane
     * @param {*} sideLength side length of square plane shape
     * @requires : normal to be a nonzero vector
     */
    constructor(graph, normal, centerCords, color, sideLength) {

        this.graph       = graph
        this.normal      = normal
        this.centerCords = centerCords
        this.sideLength  = sideLength
        this.color       = color
    }

    /**
     * must return vertices in drawable order, ie traveling around shape
     */
    getLines() {
        //ax + by + cz = 0

        // x = (-b(1)-c(1))/a
        // y = (-c(1)-a(4))/b
        
        // 0x + 0y + 1z = 0
        // cz = -ax-by
        // 
        // ax = ax + 0y     |1       0|
        // by = 0x + by     |0       1|
        // cz = -ax -by     |-a/c -b/c|
        //then get perp basis...
        //
        
        let a = this.normal[0]
        let b = this.normal[1]
        let c = this.normal[2]

        if(a == 0 && b == 0 && c == 0) {
            throw new Error("Normal vector is [0,0,0]")
        }

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
        let basisVec1 = this.graph.changeBasisZoomAndRotate(orthanormalBasis[0])
        let basisVec2 = this.graph.changeBasisZoomAndRotate(orthanormalBasis[1])



        // there are gridSize lines on each half axis
        let gridSize = this.sideLength
        //this.graph.drawPointToPoint([3,3, 0], [10,3, 0], "green", 3)

        // let xAxisVec = this.changeBasisZoomAndRotate([gridSize,0,0])
        // let yAxisVec = this.changeBasisZoomAndRotate([0,gridSize,0])
        
        let corner1 = vectorAdd(scaleVector(basisVec2, -1 * gridSize), scaleVector(basisVec1, gridSize))
        let corner2 = vectorAdd(scaleVector(basisVec2, -1 * gridSize), scaleVector(basisVec1, -gridSize))

        let corner3 = vectorAdd(scaleVector(basisVec2, gridSize), scaleVector(basisVec1, gridSize))
        let corner4 = vectorAdd(scaleVector(basisVec2, gridSize), scaleVector(basisVec1, -gridSize))

        corner1 = scaleVector(corner1, this.graph.scale)
        corner2 = scaleVector(corner2, this.graph.scale)
        corner3 = scaleVector(corner3, this.graph.scale)
        corner4 = scaleVector(corner4, this.graph.scale)

        let line1 = new Line(corner1, corner3, false)
        let line2 = new Line(corner3, corner4, false)
        let line3 = new Line(corner4, corner2, false)
        let line4 = new Line(corner2, corner1, false)

        return  [line1, line2, line3, line4]
    }
    
    draw() {

        let a = this.normal[0]
        let b = this.normal[1]
        let c = this.normal[2]

        if(a == 0 && b == 0 && c == 0) {
            throw new Error("Normal vector is [0,0,0]")
        }

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
        let basisVec1 = this.graph.changeBasisZoomAndRotate(orthanormalBasis[0])
        let basisVec2 = this.graph.changeBasisZoomAndRotate(orthanormalBasis[1])



        // there are gridSize lines on each half axis
        let gridSize = this.sideLength
        //this.graph.drawPointToPoint([3,3, 0], [10,3, 0], "green", 3)

        // let xAxisVec = this.changeBasisZoomAndRotate([gridSize,0,0])
        // let yAxisVec = this.changeBasisZoomAndRotate([0,gridSize,0])
        
        let corner1 = vectorAdd(scaleVector(basisVec2, -1 * gridSize), scaleVector(basisVec1, gridSize))
        let corner2 = vectorAdd(scaleVector(basisVec2, -1 * gridSize), scaleVector(basisVec1, -gridSize))

        let corner3 = vectorAdd(scaleVector(basisVec2, gridSize), scaleVector(basisVec1, gridSize))
        let corner4 = vectorAdd(scaleVector(basisVec2, gridSize), scaleVector(basisVec1, -gridSize))

        corner1 = scaleVector(corner1, this.graph.scale)
        corner2 = scaleVector(corner2, this.graph.scale)
        corner3 = scaleVector(corner3, this.graph.scale)
        corner4 = scaleVector(corner4, this.graph.scale)

        this.graph.ctx.globalAlpha = 0.5;
        this.graph.ctx.beginPath()
        this.graph.ctx.moveTo(this.graph.centerX + corner1[0], this.graph.centerY - corner1[1])
        this.graph.ctx.lineTo(this.graph.centerX + corner3[0], this.graph.centerY - corner3[1])
        this.graph.ctx.lineTo(this.graph.centerX + corner4[0], this.graph.centerY - corner4[1])
        this.graph.ctx.lineTo(this.graph.centerX + corner2[0], this.graph.centerY - corner2[1])

        this.graph.ctx.closePath()
        this.graph.ctx.fillStyle=this.color
        this.graph.ctx.fill()
        this.graph.ctx.globalAlpha = 1;

        
        // for (let i = 1; i < gridSize + 1; i++) {
        //     let currentColor = this.colorLight
        //     let lineWidth    = this.lineWidthLight 
        //     let ctx = this.graph.ctx

        //     if (i % 5 == 0) {
        //         currentColor = this.colorDark
        //         lineWidth    = this.lineWidthDark
                
        //     }






        //     // xy plane
        //     //     on x axis drawing y axis grid lines
                
        //         this.graph.drawPointToPoint(
                    
        //             vectorAdd(scaleVector(basisVec2, -1 * gridSize),scaleVector(basisVec1, i)),

        //             vectorAdd(scaleVector(basisVec2, gridSize), scaleVector(basisVec1, i))
                    
        //             , this.color, lineWidth)

        //         this.graph.drawPointToPoint(
                
        //             vectorAdd(scaleVector(basisVec2, -1 * gridSize),scaleVector(basisVec1, -i)),

        //             vectorAdd(scaleVector(basisVec2, gridSize), scaleVector(basisVec1, -i))
                    
        //             , this.color, lineWidth)

        //         this.graph.drawPointToPoint(
                
        //             vectorAdd(scaleVector(basisVec1, -1 * gridSize),scaleVector(basisVec2,i)),

        //             vectorAdd(scaleVector(basisVec1, gridSize), scaleVector(basisVec2,i))
                    
        //             , this.color, lineWidth)

        //         this.graph.drawPointToPoint(
            
        //             vectorAdd(scaleVector(basisVec1, -1 * gridSize),scaleVector(basisVec2,-i)),

        //             vectorAdd(scaleVector(basisVec1, gridSize), scaleVector(basisVec2,-i))
                    
        //             , this.color, lineWidth)
        // }
    }   
}
