const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');
const port = process.env.PORT || 8080;
const mongoose = require('mongoose');
const userRouter = require('./routes/userRouter.js');
app.use(express.json());

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb+srv://solapurevivek2003:egIQZN2TDyqdRf0y@cluster0.vnpmx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log("DB connected");
}

app.use(cors());

app.listen(port, () => {
    console.log('Running on port 8080');
});

// Fetching data from third-party API
let url = "https://s3.amazonaws.com/roxiler.com/product_transaction.json";
let data;
fetch(url)
    .then(res => res.json())
    .then(out => {
        data = out;
    });

app.get('/api/product/', (req, res) => {
    res.json(data);
});

// Use the routes for products
app.use('/product', userRouter.routes);



//mongo pass: egIQZN2TDyqdRf0y
//mongo username: solapurevivek2003