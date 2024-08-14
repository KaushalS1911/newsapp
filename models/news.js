const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema({
    category: String,
    title: String,
    desc_1: String,
    desc_2: String,
    desc_3: String,
    desc_4: String,
    desc_5: String,
    images: []
}, {timestamps: true})


module.exports = mongoose.model('News', newsSchema)


