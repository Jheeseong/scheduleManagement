const express = require('express');
const router = express.Router();
const checkLogIn = require('../config/passport/Middleware').checkLogIn
const categoryController = require('../controller/Category')

router.post('/create', checkLogIn, categoryController.saveCategory)

router.post('/update/:id', checkLogIn, categoryController.updateCategory)

router.post('/delete/:id', checkLogIn, categoryController.deleteCategory)

router.post('/myCategory', checkLogIn, categoryController.findMyCategory)

router.post('/shareCategory', checkLogIn, categoryController.findShareCategory)

router.post('/findById/:id', checkLogIn, categoryController.findCategoryById)

module.exports = router;