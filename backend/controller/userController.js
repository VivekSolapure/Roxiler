const express = require('express')
const app = express();
const Model = require('../model/productModel.js')
const Product = Model.Product
let url = "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
app.use(express.json());

exports.createProduct = async (req, res) => {
    // Check if the incoming data is an array
    if (Array.isArray(req.body)) {
        console.log("Request Body is an Array:", req.body);

        // Iterate over each product in the array and save it
        try {
            await Promise.all(req.body.map(async (productData) => {
                const product = new Product(productData);
                await product.save();
            }));
            res.status(201).json({ message: "All products saved successfully", data: req.body });
        } catch (err) {
            console.error("Error saving products:", err);
            res.status(400).json({ error: err.message });
        }
    } else {
        // If it's not an array, save a single product
        const product = new Product(req.body);
        product.save()
            .then(() => {
                res.status(201).json(req.body);
                console.log("Single product saved:", req.body);
            })
            .catch((err) => {
                res.status(400).json(err);
                console.log("Error saving product:", err);
            });
    }
};

exports.getProduct = async (req, res) => {
    const page = req.query.page;
    const perPage = req.query.perPage;
    const search = req.query.search;
    const selectedMonth = req.query.month; 

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Check if a specific month is selected, otherwise return all data
    let monthQuery = {};
    if (selectedMonth && selectedMonth !== "Select All") {
        const month = monthNames.indexOf(selectedMonth);
        if (month >= 0) {
            monthQuery = {
                $expr: { $eq: [{ $month: '$dateOfSale' }, month + 1] }  // +1 because $month returns 1-based index
            };
        }
    }

    const statistic = await Product.find({ ...monthQuery }); 
    console.log(statistic); 

    const totalSale = statistic.reduce((acc, product) => {
        console.log(acc);
        return acc + product.price; 
    }, 0);  
    const totalSoldItem = statistic.reduce((acc, product) => {
        if(product.sold ==='true'){
            return acc+1
        }
        return acc
    }, 0);  
    const totalNotSoldItem = statistic.reduce((acc, product) => {
        if(product.sold !='true'){
            return acc+1
        }
        return acc
    }, 0);

    console.log("Total Sale:", totalSale);
    console.log("Total Sale:", totalSoldItem);
    console.log("Total NotSale:", totalNotSoldItem);


    const searchQuery = search ? {
        $or: [
            { title: new RegExp(search, 'i') },
            { description: new RegExp(search, 'i') }
        ]
    } : {};

    try {
        const transactions = await Product.find({ ...searchQuery, ...monthQuery })
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));

        const total = await Product.countDocuments({ ...searchQuery, ...monthQuery });

        res.json({
            transactions,
            selectedMonth,
            totalPages: Math.ceil(total / perPage),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).send('Error fetching transactions');
    }
}

exports.getStatistics = async(req,res)=>{
    const selectedMonth= req.query.month

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Check if a specific month is selected, otherwise return all data
    let monthQuery = {};
    if (selectedMonth && selectedMonth !== "Select All") {
        const month = monthNames.indexOf(selectedMonth);
        if (month >= 0) {
            monthQuery = {
                $expr: { $eq: [{ $month: '$dateOfSale' }, month + 1] }  // +1 because $month returns 1-based index
            };
        }
    }
    const statistic = await Product.find({ ...monthQuery }); 
    console.log(statistic); 

    const totalSale = statistic.reduce((acc, product) => {
        console.log(acc);
        return acc + product.price
    }, 0).toFixed(2);  
    const totalSoldItem = statistic.reduce((acc, product) => {
        if(product.sold ==='true'){
            return acc+1
        }
        
        return acc
    }, 0);  
    const totalNotSoldItem = statistic.reduce((acc, product) => {
        if(product.sold !='true'){
            return acc+1
        }
        return acc
    }, 0);


    try {
        res.json({
            totalSoldItem,
            totalSale,
            totalNotSoldItem
        })
        
    } catch (error) {
        console.log("SERVER: Error while fetching Statistics");
    }
 
}