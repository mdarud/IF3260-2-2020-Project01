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
        this.ca = ca;
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
                
        gl.bindBuffer( gl.ARRAY_BUFFER, this.bufferId );
        var vPos = gl.getAttribLocation( this.shader, "vPosition" );
        gl.vertexAttribPointer( vPos, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPos );
    
        gl.bindBuffer( gl.ARRAY_BUFFER, this.cBufferId );
        var vColor = gl.getAttribLocation( this.shader, "vColor" );
        gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vColor );

        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.va.length);
    }
}