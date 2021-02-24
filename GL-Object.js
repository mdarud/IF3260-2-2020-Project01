"use strict";

class GLObject {
    id;
    va;
    ca;
    shader;
    bufferId;
    cBufferId;
    gl;

    constructor(id, shader, /*bufferId, cBufferId,*/ gl) {
        this.id = id;
        this.shader = shader;
        // this.bufferId = bufferId;
        // this.cBufferId = cBufferId;
        this.gl = gl;
    }

    setVertexArray(va) {
        this.va = va;
    }

    setColorArray(ca) {
        var length = this.va.length / 2;
        
        this.ca = new Array();
        for (var i = 0; i < length; i++) {
            this.ca.push(ca);
        }
    }

    bind() {
        const gl = this.gl;
        this.bufferId = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, this.bufferId );
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.va), gl.STATIC_DRAW);

        this.cBufferId = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, this.cBufferId );
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.ca), gl.STATIC_DRAW);
    }


    draw() {
        const gl = this.gl;
        gl.useProgram(this.shader);

        // gl.clear( gl.COLOR_BUFFER_BIT );
        // var vertexPos = gl.getAttribLocation(this.shader, 'a_pos')
        // var uniformCol = gl.getUniformLocation(this.shader, 'u_fragColor')
        // var uniformPos = gl.getUniformLocation(this.shader, 'u_proj_mat')

        // gl.vertexAttribPointer(vertexPos, 2, gl.FLOAT, false, 0, 0)
        // gl.uniformMatrix3fv(uniformPos, false, this.projectionMat)
        // gl.uniform4fv(uniformCol, [1.0, 0.0, 0.0, 1.0])
        // gl.enableVertexAttribArray(vertexPos)
        // gl.drawArrays(gl.TRIANGLES, 0, this.va.length/2)

        gl.bindBuffer( gl.ARRAY_BUFFER, this.bufferId );
        var vPos = gl.getAttribLocation( this.shader, "vPosition" );
        console.log(vPos);
        gl.vertexAttribPointer( vPos, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPos );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.cBufferId );
        var vColor = gl.getAttribLocation( this.shader, "vColor" );
        gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vColor );
        console.log(this.va.length);
        console.log(flatten(this.ca));
        gl.drawArrays(gl.TRIANGLES_FAN, 0, this.va.length/2);
    }
}