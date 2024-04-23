const ProductManager = require('../productManager.js')
const express = require('express');
const router = express.Router()


const productManagment = new ProductManager();

router.get('/api/products/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const listProducts = await productManagment.loadProducts();
        if(listProducts){
            if(limit){
                console.log("deberia entrar aqui")
                const listProductsLimit = listProducts.slice(0, limit)
                return res.status(200).json(listProductsLimit);
            } else{
                return res.status(200).json(listProducts);
            }
        }
    } catch (error) {
        console.error("error al leer el archivo", error)
        res.status(500).json({ error: "Error interno del servidor" })
    }

})


router.get('/api/products/:pid', async (req, res) => {
    try {
        let pId = parseInt(req.params.pid)
        const listproducts = await productManagment.getProductById(pId);
        if(listproducts){
            res.status(200).json(listproducts); 
        } else {
            res.status(404).json({message: "El producto Solicitado No existe"});
        }
    } catch (error) {
        console.log("hubo algun problema: ", error)
        res.status(500).json({ error: "Error interno del servidor" })
    }

})

router.post('/api/products/', async (req, res) => {
    try {
        const newProduct = req.body
        await productManagment.addProduct(newProduct)
        res.status(201).json({message: "Product Agregado Correctamente", product: newProduct});
    } catch (error) {
        console.error("Error al agregar el producto: ", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message});
    }
})

router.put('/api/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const updateProduct = req.body;
        await productManagment.updateProduct(productId, updateProduct);
        // Envía una respuesta exitosa
        res.status(200).json({ message: "Producto actualizado correctamente."});
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        // Envía una respuesta con Error
        res.status(500).json({  message: "Error interno del servidor", error: error.message}); 
    }

})

router.delete('/api/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        await productManagment.deleteProduct(productId);
        res.status(200).json({message: "Producto borrado correctamente"})
    } catch (error) {
        console.error("Error al borrar el Producto", error)
        res.status(500).json({message: "Error interno del servidor", error: error.message})
    }

})

module.exports = router