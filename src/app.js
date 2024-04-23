const express = require('express');
const app = express();
const cartRouter = require("./route/carts.router.js")
const productsRouter = require("./route/products.router.js")

const PORT = 8080;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/', productsRouter);
app.use('/', cartRouter);


app.listen(PORT, () =>{
    console.log(`Server Runing on Port: ${PORT}`);
})