const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    id: {type:Number, required: true, unique:true},
    title: { type: String, required: true },
    price: { type: Number, min: [0, 'wrong price'], required: true },
    description: String,
    category: String,
    image: String,
    sold: { type: String },
    dateOfSale: { type: Date, required: true },
})
exports.Product = mongoose.model('Product', productSchema);
