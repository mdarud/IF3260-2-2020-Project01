class Renderer {
    objectList;
    count;

    constructor() {
        this.objectList = new Array();
        this.count = 0;
    }


    addObject(obj) {
        this.objectList.push(obj)
        this.count++
    }


    removeObject(idk) {
        const idx = this.objectList.findIndex(obj => obj.idk === idk)
        this.objectList.splice(idx, 1)
        this.count--
    }


    render() {
        for (const obj of this.objectList) {
            obj.draw()
        }
    }

    renderTex(selectProgram) {
        for (const obj of this.objectList) {
            obj.drawSelect(selectProgram)
        }
    }
}