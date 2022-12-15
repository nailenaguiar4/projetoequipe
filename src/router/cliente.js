const express = require("express");
const swaggerJSDoc = require("swagger-jsdoc");
const ClientesSchema = require('../models/cliente');
const router = express.Router();

//create Clientes
/**
 * @swagger
 * components:
 *  schemas:
 *    cliente:
 *     type: object
 *     properties:
 *       name: 
 *        type: string
 *        description: Nome do Cliente
 *       cpf: 
 *        type: integer
 *        description: numero do CPF
 *       email: 
 *        type: string
 *        description: email do cliente
 *     required:
 *        -nome
 *        -cpf
 *        -email
 *     example:
 *         nome: ronnie escalante
 *         cpf: 71128221152
 *         email: escalantealvillar@email.com
 */

/**
 * @swagger
 * /api/Cliente:
 *  post: 
 *   summary: cliente novo
 *   tags: [cliente]
 *   requestBody:
 *    required: true
 *    content:
 *      application/json:
 *       schema:
 *        type: object
 *        $ref: '#/components/schemas/cliente'
 *   responses:
 *    201:
 *     description: cliente creado com sucesso!
 */

//create Clientes
router.post("/Cliente", async (req, res) => {
    const clientes = ClientesSchema(req.body);
    const erros = []
    clientes
    try {
        if (!req.body.nome || req.body.nome == null) {
            erros.push("Inserir o nome")
        }

        if (typeof req.body.nome == "number") {
            erros.push("Nome errado")
        }

        if (!req.body.cpf || req.body.cpf == null) {
            erros.push("Inserir o cpf")
        }

        if (typeof req.body.cpf == "string") {
            erros.push("CPF errado")
        }

        if (erros.length > 0) {
            res.status(404)
            res.send(erros)

        }
        else {
            await clientes.save()
            res.status(201).send("Cliente cadastrado con sucesso")
        }
    }

    catch (error) {
        res.status(500).send("Error del lado del servidor")
    }

});

// get all Clientes
/**
 * @swagger
 * /api/Clientes:
 *  get: 
 *   summary: mostrar todos os clientes
 *   tags: [cliente]
 *   responses:
 *    200:
 *     description: todos os clientes
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *        $ref: '#/components/schemas/cliente'
 */

router.get("/Clientes", (req, res) => {
    ClientesSchema
        .find()
        .populate({
            path: 'compra',
            populate: ({ path: 'item', select: 'nome' })
        })
        .then((data) => res.status(200).json(data))
        .catch((error) => res.json({ message: error }));
});


// get for id cliente
/**
 * @swagger
 * /api/Cliente/{id}:
 *  get: 
 *   summary: mostra um cliente
 *   tags: [cliente]
 *   parameters:
 *   - in: path
 *     name: id
 *     schema:
 *      type: string
 *     required: true
 *     description: id do cliente
 *   responses:
 *    200:
 *     description: um cliente
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        $ref: '#/components/schemas/cliente'
 *    404:
 *      description: cliente não encontrado
 */

router.get("/Cliente/:id", async (req, res) => {
    const { id } = req.params;
    ClientesSchema
        .findById(id)
        .populate({
            path: 'compra',
            populate: ({ path: 'item', select: 'nome' })
        })
        .then((data) => await = res.status(200).json(data))
        .catch((error) => res.status(404).send("Cliente não encontrado"));
});

//update 
/**
 * @swagger
 * /api/Cliente/{id}:
 *  put: 
 *   summary: actualizar dados do cliente
 *   tags: [cliente]
 *   parameters:
 *   - in: path
 *     name: id
 *     schema:
 *      type: string
 *     required: true
 *     description: cliente identificado
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       $ref: '#/components/schemas/cliente'
 *   responses:
 *    200:
 *     description: actualizado dados do cliente
 *    404:
 *      description: cliente não encontrado
 */
router.put("/cliente/:id", async (req, res) => {
    const { id } = req.params;
    const { nome, cpf, email, compra } = ClientesSchema(req.body);
    const erros = []
    try {
        if (typeof req.body.nome == "number") {
            erros.push("Nome errado")
        }

        if (typeof req.body.cpf == "string") {
            erros.push("CPF errado")
        }

        if (typeof req.body.email == "number") {
            erros.push("email errado")
        }

        if (erros.length > 0) {
            res.status(404)
            res.send(erros)
            return
        }
        else {
            await
                ClientesSchema.updateOne({ _id: id }, { $set: { nome, cpf, email, compra } })
            ClientesSchema.then((data) => res.json(data))
            res.status(404).send("Cliente não encontrado")
            return
        }
    }
    catch {
        res.status(200).json("Cliente actualizado com sucesso")
    }


});


// delete a Clientes
/**
 * @swagger
 * /api/Cliente/{id}:
 *  delete: 
 *   summary: deletar um cliente
 *   tags: [cliente]
 *   parameters:
 *   - in: path
 *     name: id
 *     schema:
 *      type: string
 *     required: true
 *     description: cliente identificado
 *   responses:
 *    200:
 *     description: cliente deletado com sucesso
 *    404:
 *      description: Cliente não encontrado
 */

router.delete("/cliente/:id", async (req, res) => {
    const { id } = req.params;
    const delcliente = await ClientesSchema.findOne({ _id: id })
    if (!delcliente) {
        res.status(404).json("Não existe o cliente")
        return
    }
    try {
        await ClientesSchema.remove({ _id: id })
        res.status(200).json("Cliente deletado com sucesso")

    } catch (error) {
        res.status(500).json({ error: ("Error do servidor") })
    }
});

module.exports = router;