const express = require("express");
const ProdutoSchema = require("../models/produto");
const router = express.Router();

//create produto
/**
 * @swagger
 * components:
 *  schemas:
 *    produto:
 *     type: object
 *     properties:
 *       name: 
 *        type: string
 *        description: nome do producto
 *       descricao: 
 *        type: string
 *        description: descricao do produto
 *       quantidade: 
 *        type: number
 *        description: quantidade do produto
 *       preco:
 *        type: number
 *        description: preco do produto
 *     required:
 *        -name
 *        -descricao
 *        -quantidade
 *        -preco
 *     example:
 *         nome: leite de almendras
 *         descricao: produto organico
 *         quantidade: 25
 *         preco: 15
 */

 /**
 * @swagger
 * /api/produto:
 *  post: 
 *   summary: registre producto
 *   tags: [produto]
 *   requestBody:
 *    required: true
 *    content:
 *      application/json:
 *       schema:
 *        type: object
 *        $ref: '#/components/schemas/produto'
 *   responses:
 *    201:
 *     description: producto cadastrado
 */

router.post("/produto", async (req, res) => {
    const produtos = ProdutoSchema(req.body);
    const erros = []
    produtos
    try {
        if (!req.body.nome || req.body.nome == null) {
            erros.push("Inserir o nome do produto")
        }

        if (typeof req.body.name == "number") {
            erros.push("Inserir o nome correto")
        }

        if (!req.body.descricao || req.body.descricao == null) {
            erros.push("Inserir o descricao")
        }

        if (typeof req.body.descricao == "number") {
            erros.push("descricao errado")
        }

        if (!req.body.quantidade || req.body.quantidade == null) {
            erros.push("Inserir o quantidade")
        }

        if (typeof req.body.quantidade == "string") {
            erros.push("quantidade errada, insirerir valor numerico")
        }

        
        if (!req.body.preco || req.body.preco == null) {
            erros.push("Inserir o preco")
        }

        if (typeof req.body.preco == "string") {
            erros.push("Preco errado, insirerir valor numerico")
        }

        if (erros.length > 0) {
            res.status(404)
            res.send(erros)
            return
        }
        else {
            await produtos.save()
            return res.status(201).send("Produto cadastrado con sucesso")
        }
    }
    catch (error){
        if (!req.body == ProdutoSchema)
        return res.status(400).send("Erro do lado do servidor" + error)
        console.log(error)
    }

});

// get all produtos 
/**
 * @swagger
 * /api/produtos:
 *  get: 
 *   summary: mostrar todos os produtos
 *   tags: [produto]
 *   responses:
 *    200:
 *     description: todos os produtos
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *        $ref: '#/components/schemas/produto'
 */

router.get("/produtos", (req, res) => {
    ProdutoSchema
        .find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// get a produto
/**
 * @swagger
 * /api/produto/{id}:
 *  get: 
 *   summary: mostrar um produto
 *   tags: [produto]
 *   parameters:
 *   - in: path
 *     name: id
 *     schema:
 *      type: string
 *     required: true
 *     description: id do produto
 *   responses:
 *    200:
 *     description: id do produto
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        $ref: '#/components/schemas/produto'
 *    404:
 *      description: produto não encontrado
 */

router.get("/produto/:id", (req, res) => {
    const { id } = req.params;
    ProdutoSchema
        .findById(id)
        .then((data) => await = res.status(200).json(data))
        .catch((error) => res.status(404).send("Produto não encontrado"));
});

// update a produto
/**
 * @swagger
 * /api/produto/{id}:
 *  put: 
 *   summary: actualizar produto
 *   tags: [produto]
 *   parameters:
 *   - in: path
 *     name: id
 *     schema:
 *      type: string
 *     required: true
 *     description: id do produto
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       $ref: '#/components/schemas/produto'
 *   responses:
 *    200:
 *     description: produto atualizado
 *    404:
 *      description: produto não encontrado
 */

router.put("/produto/:id", async (req, res) => {
    const { id } = req.params;
    const { nome, descricao, quantidade, preco } = ProdutoSchema(req.body);
    const erros = []

    try {
        if (typeof req.body.nome == "number") {
            erros.push("Nome errado")
        }

        if (typeof req.body.descricao == "number") {
            erros.push("Descrição errrada")
        }

        if (typeof req.body.quantidade == "string") {
            erros.push("Quantidade errada, insira valor numerico")
        }
        
        if (typeof req.body.preco == "string") {
            erros.push("Preco errado, insira valor numerico")
        }
        
        if (erros.length > 0) {
            res.status(404)
            res.send(erros)
        }

        else {
            await ProdutoSchema.updateOne({ _id: id }, { $set: {  nome, descricao, quantidade, preco } })
            res.status(200).json("Produto atualizado com sucesso")
        }
    }

    catch { res.status(404).send("Produto não encontrado") };

});

// delete a produto
/**
 * @swagger
 * /api/produto/{id}:
 *  delete: 
 *   summary: deletar um produto
 *   tags: [produto]
 *   parameters:
 *   - in: path
 *     name: id
 *     schema:
 *      type: string
 *     required: true
 *     description: id do produto
 *   responses:
 *    200:
 *     description: Produto deletado com sucesso
 *    404:
 *      description: Produto não encontrado
 */

router.delete("/produto/:id", async (req, res) => {
    const { id } = req.params;
    const delpro = await ProdutoSchema.findOne({ _id: id })
       if (!delpro){
            res.status(404).json("Não existe o produto")
            return
        }
        try {
            await ProdutoSchema.remove({ _id: id})
            res.status(200).json ("Produto deletado com sucesso")
            
        } catch (error) {
            res.status(500).json({ error: ("Error do servidor") })
        }
});

module.exports = router;
