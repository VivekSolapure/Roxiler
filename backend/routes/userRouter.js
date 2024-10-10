const productcontroller=require('../controller/userController.js')
const express =require('express')
const userController=express.Router();

userController
.post('/',productcontroller.createProduct)
.get('/',productcontroller.getProduct)
.get('/statistics',productcontroller.getStatistics)


exports.routes=userController;