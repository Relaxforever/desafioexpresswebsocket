const fs = require("fs");

module.exports = class Contenedor {

    constructor(name) {
        this.name = name
    }

    async save(Obj) {
        // in case if doesn't exist create it.
        if (!fs.existsSync(this.name)){
            try {
                Obj.id = 1
                const createdNewFile = fs.promises.writeFile(this.name,`[${JSON.stringify(Obj)}]`);
                console.log('successfully created File and Object')
                return 1;
            } catch (e) {
                console.error(e)
            }
        } else {
            try {
                const FileReaded = await fs.promises.readFile(this.name, 'utf-8')
                if (FileReaded){
                    const arrayList = JSON.parse(FileReaded)
                    // console.log(arrayList)
                    Obj.id = arrayList.length !== 0 ? arrayList[arrayList.length - 1].id + 1 : 1
                    arrayList.push(Obj)
                    //console.log(arrayList)
                    await fs.promises.writeFile(this.name, JSON.stringify(arrayList));
                    console.log('successfully added Object to the file');
                    return arrayList[arrayList.length - 1].id;

                }
            } catch (e) {
                console.error(e)
            }
        }
        /* await fs.promises.appendFile(this.name, JSON.stringify(Obj));
         console.log('successfully added Object to the file');*/
    }

    async getById(number){
        try {
            const FileReaded = await fs.promises.readFile(this.name, 'utf-8')
            if (FileReaded){
                const arrayList = JSON.parse(FileReaded)
                // console.log(arrayList)
                const objectFound = arrayList.find((elem) => elem.id === number)
                if (objectFound) {
                    return objectFound;
                } else {
                    return null;
                }

            }
        } catch (e) {
            console.error(e)
        }

    }

    async getAll(){
        try {
            const FileReaded = await fs.promises.readFile(this.name, 'utf-8')
            if (FileReaded){
                const arrayList = JSON.parse(FileReaded)
                return arrayList
            }
        } catch (e) {
            console.error(e)
        }
    }

    async updateById(id, obj){
        try {
            const FileReaded = await fs.promises.readFile(this.name, 'utf-8')
            if (FileReaded){
                const arrayList = JSON.parse(FileReaded)
                for (let cont = 0; cont < arrayList.length; cont++){
                    if (arrayList[cont].id === id){
                        arrayList[cont].title = obj.title
                        arrayList[cont].price = obj.price
                        arrayList[cont].thumbnail = obj.thumbnail
                        await fs.promises.writeFile(this.name, JSON.stringify(arrayList));
                        return arrayList
                    }
                }
                return {"error": "Producto no Encontrado"}
            }
        } catch (e) {
            console.error(e)
        }
    }




    async deleteById(number){
        try {
            const FileReaded = await fs.promises.readFile(this.name, 'utf-8')
            if (FileReaded){
                const arrayList = JSON.parse(FileReaded)
                let newArray = []
                for(let cont = 0; cont < arrayList.length; cont++){
                    if (arrayList[cont].id !== number){
                        newArray.push(arrayList[cont])
                    }
                }
                await fs.promises.writeFile(this.name, JSON.stringify(newArray));
                // console.log('el array cuando se elimino la posicion quedo asi ' + newArray)
            }
        } catch (e) {
            console.error(e)
        }
    }


    async deleteAll() {
        await fs.promises.writeFile(this.name, '[]');
    }

}