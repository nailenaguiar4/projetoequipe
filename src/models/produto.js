const mongoose = require("mongoose");
const Schema = mongoose.Schema

const ProdutoSchema = mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    quantidade: {
        type: Number,
        required: true
    },
    preco: {
        type: Number,
        required: true
    }

});

module.exports = mongoose.model('produto', ProdutoSchema);