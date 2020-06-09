const mongoose = require('mongoose');

const {
  validationResult
} = require('express-validator');

const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('./admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  })
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('./admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: false,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
      },
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    })
  }

  const product = new Product({
    _id: mongoose.Types.ObjectId('5ed16f01ac69e103c54bf0b0'),
    title,
    price,
    description,
    imageUrl,
    userId: req.user
  });
  product.save()
    .then(() => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    })
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if (!editMode) {
    return res.redirect('/')
  }

  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('./admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      })
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
}

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('./admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      product: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDescription,
        _id: prodId
      },
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    })
  }

  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/')
      }
      product.title = updatedTitle,
        product.price = updatedPrice,
        product.description = updatedDescription,
        product.imageUrl = updatedImageUrl
      return product.save()
        .then(() => {
          console.log('Updated Product');
          res.redirect('/admin/products');
        })
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
}

exports.getProducts = (req, res, next) => {
  Product.find({
      userId: req.user._id
    })
    .then(products => {
      res.render('./admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      })
    })
    .catch(err => {
        const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  });
}

exports.postDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  Product.deleteOne({
      _id: prodId,
      userId: req.user._id
    })
    .then(() => res.redirect('/admin/products'))
    .catch(err => {
        const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  });
}