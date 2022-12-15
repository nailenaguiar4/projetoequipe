const mongoose = require("mongoose");
const Schema = mongoose.Schema

const transacaoSchema = mongoose.Schema({
    valor: {
        type: Number,
        required: true
    },
    forma_de_pagamento: {
        type: String,
        required: true
    },
    data: {
        type: Date, 
        default: Date.now
    },
    item: { required: true, type: Schema.ObjectId, ref: 'produto' }
});

module.exports = mongoose.model('transacao', transacaoSchema);