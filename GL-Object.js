"use strict";

class GLObject {
    id;         // identity 
    va;         // vertex attribute
    vba;        // vertex attribute buat digambar
    cp;         // canvas points
    ca;         // color attribute
    shader;     // shader program
    bufferId;   // buffer for vertex
    cBufferId;  // buffer for colour
    gl;         // GL

    constructor(id, shader, gl) {
        this.id = id;
        this.shader = shader;
        // this.bufferId = bufferId;
        // this.cBufferId = cBufferId;
        this.gl = gl;
    }

    setVertexArray(va) {
        this.va = va;

        this.cp = new Array();
        this.cp.push()
    }

    setColorArray(ca) {
        this.ca = ca;
    }

    bind() {
        if (this.id == "POLYGON") {
            // console.log(this.ca);
            // this.getVBAPolygon()
            // console.log(this.ca);
            this.vba = this.va;
        } else {
            this.vba = this.va;
        }

        const gl = this.gl;
        this.bufferId = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, this.bufferId );
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vba), gl.STATIC_DRAW);

        this.cBufferId = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, this.cBufferId );
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.ca), gl.STATIC_DRAW);
    }

    getVBAPolygon() {
        this.vba = [];
        var temp = [];
        for (var i = 0; i < this.va.length - 2; i++) {
            for (var j = i + 2; j < this.va.length; j++) {
                this.vba.push(this.va[i]);
                this.vba.push(this.va[i+1]);
                this.vba.push(this.va[j]);

                temp.push(this.ca[0]);
                temp.push(this.ca[0]);
                temp.push(this.ca[0]);
            }
        }
        // console.log(this.vba);
        this.ca = temp;
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

        if (this.id == "LINE") {
            gl.drawArrays(gl.LINES, 0, this.va.length);
        } else {
            gl.drawArrays(gl.TRIANGLE_FAN, 0, this.va.length);
        }
    }
}