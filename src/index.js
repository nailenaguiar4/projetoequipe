const express = require('express');
const mongoose = require("mongoose");
require("dotenv").config();
const produtoRouter = require('./router/produto');
const clientesRouter = require('./router/cliente');
const transacaoRouter = require('./router/transacao');
const { response, request } = require('express');
const { use } = require('./router/cliente');
const path = require("path")

//swagger
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerSpec = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API LOJA DE PRODUTOS ─SAUDE E VIDA─",
            version: "1.0.0"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ]
    },
    apis: [`${path.join(__dirname, "./router/*")}`]
}

const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use('/api', produtoRouter);
app.use('/api', clientesRouter);
app.use('/api', transacaoRouter);
app.use(
    "/api-doc", 
    swaggerUI.serve, 
    swaggerUI.setup(swaggerJsDoc(swaggerSpec))
    );


//routes
app.get('/', (req, res) => {
    res.send("API LOJA DE PRODUTOS ─SAUDE E VIDA─");
});

app.use((req, res, next) => {
    res.status(404).send("Rota não encontrada")
    next()
});

app.use((error, req, res, next) => {
    res.status(500).send("Erro do lado do servidor")
});


//mongodb connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Conectado com MONGODB Atlas"))
    .catch((error) => console.error(error))

app.listen(port, () => console.log('Servidor conectado na porta', port));