const fs = require('fs').promises
const ProductManager = require('./productManager.js')

const pManagment = new ProductManager();

class CartsManagment{
    constructor(){
        this.carts = [];
        this.Id = 0;
        this.cartsFileName = "carrito.json"
        this.directoryPath = "./";
    }

    async addCart(){
        try {
            //llamo a la funcion para cargar los carritos
            this.carts = await this.loadCarts();
            //manejo los id de los carritos para que no se repitan
            const lasId = this.carts.length > 0 ? this.carts[this.carts.length -1].id : 0;
            const newId = lasId + 1;
            //creo el Nuevo ojteco que agregaremos posteriormente al array de objetos de carts
            const newCart = {
            id: newId,
            product: []
            }
            //agrego el objeto
            this.carts.push(newCart);
            //agrego los objetos al archivo.
            await fs.writeFile(`${this.directoryPath}${this.cartsFileName}`, JSON.stringify( this.carts , null, 2));
            console.log("Se agrego correctamente el carrito")
        } catch (error) {
            console.error("Se produjo algun error al agregar el carrito", error);
            throw error;
        }
    }

    async addProductToCart(idCart, idProduct, quantity){
        try {
            //llamo a la funcion para cargar los carritos
            const cartContent = await this.loadCarts();
            const cartCheck = cartContent.find((c) => c.id === idCart);
            if(!cartCheck){
                console.log(`El carrito ingrsado ${idCart} no existe`);
                throw new Error({message: "El carrito ingresado no existe"});
            }
            //llamo a la funcion para ver si existe algun producto con ese id
            const productCheck = await pManagment.getProductById(idProduct);
            if(productCheck){
                //como existe un producto con ese id llama a la funcion para comporbar si ese producto ya esta ingresado en ese carrito
                const product = await this.getCartContById(cartContent, idCart, idProduct);
                if(product){
                    //como el producto ya existe en ese carro suma la cantidad
                    product.quantity = product.quantity + quantity;
                    console.log("El producto ya existia se agrego la cantidad Ingresada")
                } else {
                    //como no existe ese producto lo recorro el array de carritos buscando que carrito indica el id ingresado
                    for(const obj of cartContent){
                        if(obj.id === idCart){
                            //agrego el producto
                            obj.product.push({idP: idProduct, quantity: quantity});
                            console.log("El producto no existia se agrego el producto y la cantidad Ingresada")
                            break;
                        }
                    } 
                }
                //escribo el archivo con las modificaciones realizadas.
                await fs.writeFile(`${this.directoryPath}${this.cartsFileName}`, JSON.stringify( cartContent , null, 2));
            } else {
                console.log("El producto Ingresado no existe");
                throw new Error(`message: El producto id ingresado: ${idProduct} no existe`)
            }
            
        }
        catch (error) {
            console.error("Se produjo un error al agregar el Producto al carrito", error);
            throw error;
        }
    }

    async getCartProducts(idCart){
        try {
            const cartContent = await this.loadCarts();
            const cartCheck = cartContent.find((c) => c.id === idCart);
            if(cartCheck){
                console.log(`Contenido del carrito con ID ${idCart}:`, cartCheck.product);
                return cartCheck;
            } else {
                console.log("El ID de carrito ingresado no pertenece a ningun carrito")
                //throw new Error(`message: El id del cart ingresado: ${idCart} no existe`)
            }
        } catch (error) {
            console.error("Error al buscar el carrito", error);
            throw error;
        }
    }

    async getCartContById( cart ,idCart, idProduct ){
        try {
            for(const obj of cart){
                if(obj.id === idCart){
                    for(const product of obj.product){
                        if(product.idP === idProduct){
                            return product;
                        }
                    }
                
                }
            }
            return null;
        } catch (error) {
            console.error("Error al buscar el cart y product", error);
            throw error;
        }

    }

    async getAllCarts(){
        try {
            const cartContent = await this.loadCarts();
            return cartContent;
        } catch (error) {
            console.error("se produjo algun Erro", error)
        }

    }
    async loadCarts(){
        try {
            if(this.checkfile()){
                const cartsContent = await fs.readFile(`${this.directoryPath}${this.cartsFileName}`, "utf8")
                return JSON.parse(cartsContent);
            } 
        } catch (error) {
            console.error("Error al leer el archivo", error)
        }
    }  
    
    async checkfile(){
        try {
            const fileExist = await fs.access(`${this.directoryPath}${this.cartsFileName}`, fs.constants.F_OK,);
            if(fileExist){
                return true;
            }                
        } catch (error) {
            console.error("!!!!!!!!hubo algun problema al chequear el archivo¡¡¡¡¡¡¡¡¡", error);
            if(error.code === 'ENOENT'){
                await fs.writeFile(`${this.directoryPath}${this.cartsFileName}`,JSON.stringify([], null, 2));
                return true;
            } else{
                return trow
            }
           
            
        }
    }
}

   

module.exports = CartsManagment;