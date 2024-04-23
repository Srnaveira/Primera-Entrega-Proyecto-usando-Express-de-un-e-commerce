const CartsManagment = require('../cartsManager.js')
const express = require('express');
const router = express.Router()

const cManager = new CartsManagment();

router.post('/api/carts/', async (req, res)=>{
    try {
        const newCart = await cManager.addCart()
        res.status(201).json({message:'Se a creado correctamente el nuevo cart', cart: newCart});
    } catch (error) {
        console.error("Se produjo algun error al generar el Cart", error);
        res.status(500).json({message: "Error interno del servidor", error: error});
    }
})


router.get('/api/carts/', async (req, res)=>{
    try {
        const cartContent = await cManager.getAllCarts();
        res.status(200).json({message: "Se envio el contenido de todos los carritos", cart: cartContent});
    } catch (error) {
        console.error("Se produjo algun error al traer el contenido del Cart", error);
        res.status(500).json({message: "Error interno del servidor", error: error});
    }
})


router.get('/api/carts/:cid', async (req, res)=>{
    try {
        const cartId = parseInt(req.params.cid);
        const cartContent = await cManager.getCartProducts(cartId);
        if(cartContent){
            res.status(200).json({message: "Se encontro correctamente el contenido del carito", cart: cartContent});
        } else {
            res.status(404).json({message: "No existe ese producto"});
        }
    } catch (error) {
        console.error("Se produjo algun error al traer el contenido del Cart", error);
        res.status(500).json({message: "Error interno del servidor", error: error});
    }
})


router.post('/api/carts/:cid/product/:pid', async (req, res)=>{
    try {
        const cartId = parseInt(req.params.cid);
        const productid = parseInt(req.params.pid);
        const quantity = 1;
        await cManager.addProductToCart(cartId, productid, quantity);
        res.status(200).json({message: "Producto agregado correctamente"})
    } catch (error) {
        console.error("Hubo un problema al agregar ese producto", error)
        res.status(404).json({message: "Producto o carrito no encontrado", error: error})
    }
})


module.exports = router