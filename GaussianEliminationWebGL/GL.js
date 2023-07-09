class GL {
    constructor(gl){
        //shader is like miniprogram that runs on gpu, so nneeds some code
        const vertexShader = gl.createShader(gl.VERTEX_SHADER)
        gl.shaderSource(vertexShader, `
            precision mediump float;

            attribute vec3 position;
            attribute vec4 color;
            varying vec4 vColor;

            uniform mat4 matrix;

            void main() {
                vColor = color;
                gl_Position = matrix * vec4(position, 1);
            }
        `)

        gl.compileShader(vertexShader)

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(fragmentShader, `
            precision mediump float;
            varying vec4 vColor;

            void main() {
                gl_FragColor = vec4(vColor);
            }
        `)

        gl.compileShader(fragmentShader)


        const program = gl.createProgram()
        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)
        gl.linkProgram(program)

        gl.useProgram(program)
        const uniformLocations = {
            matrix: gl.getUniformLocation(program, `matrix`),
        }

        // let m = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
        // const matrix = new Float32Array(m)//mat4.create()


        //mat4.translate(matrix, matrix, [.2, .5, 1])
        //mat4.scale(matrix, matrix, [0.25, 0.25, 0.25])

        gl.enable(gl.DEPTH_TEST)
        gl.enable(gl.BLEND)
        //gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        //l.blendFunc(gl.SRC_COLOR, gl.SRC_ALPHA_SATURATE)
        //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        this.program     = program
        this.uniformLocations = uniformLocations
        this.gl          = gl
        this.objectArray = []
    }

    addObject(object) {
        this.objectArray.push(object)
    }

    draw(x, y) {

        let vertexData = []
        let colorData  = []

        for(let i=0; i<this.objectArray.length; i++) {
            vertexData = vertexData.concat(this.objectArray[i].getVertexColorData().vertexData)
            colorData  = colorData.concat(this.objectArray[i].getVertexColorData().colorData)
        }

        const positionBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertexData), this.gl.STATIC_DRAW)
    
        const colorBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colorData), this.gl.STATIC_DRAW)
    
        //need to enable position attributes
        const positionLocation = this.gl.getAttribLocation(this.program, `position`)
        this.gl.enableVertexAttribArray(positionLocation)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)
        this.gl.vertexAttribPointer(positionLocation, 3, this.gl.FLOAT, false, 0, 0)
    
        //need to enable color attributes
        const colorLocation = this.gl.getAttribLocation(this.program, `color`)
        this.gl.enableVertexAttribArray(colorLocation)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer)
        this.gl.vertexAttribPointer(colorLocation, 4, this.gl.FLOAT, false, 0, 0)
    
        let m = [1,0,0,0,
                 0,1,0,0,
                 0,0,1,0,
                 0,0,0,1]
        let matrix = new Float32Array(m)
        mat4.scale(matrix, matrix, [0.15, 0.15, 0.15])
        
        mat4.rotateX(matrix, matrix, 2 * Math.PI * (-y) / displayWidth)
        mat4.rotateY(matrix, matrix, 2 * Math.PI * (-x) / displayHeight)
        // mat4.rotateZ(matrix, matrix, Math.PI/4)
        // mat4.rotateX(matrix, matrix, Math.PI/4)
        // mat4.rotateY(matrix, matrix, Math.PI/4)
        // console.log(matrix)
        // debugger
        this.gl.uniformMatrix4fv(this.uniformLocations.matrix, false, matrix)
    
        this.gl.drawArrays(this.gl.TRIANGLES, 0, vertexData.length)
        // gl.drawArrays(gl.TRIANGLES, 3, 3)
        // gl.drawArrays(gl.TRIANGLES, 6, 3)
        // gl.drawArrays(gl.TRIANGLES, 9, 3)
        // gl.drawArrays(gl.TRIANGLES, 12, 3)
        // gl.drawArrays(gl.TRIANGLES, 15, 3)
    }

}