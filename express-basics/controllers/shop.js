const Product = require('../models/product')

exports.getProducts = (req, res) => {
  Product.find()
    .then(products => {
      res.render('./shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    });
}

exports.getProduct = (req, res) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
}

exports.getIndex = (req, res) => {
  Product.find()
    .then(products => {
      res.render('./shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    });
}

exports.getCart = (req, res) => {
  req.user.getCart()
    .then(products => {
      console.log('Get Cart: ', products)
      res.render('./shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => console.log(err))
}

exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  req.user.deleteItemFromCart(prodId)
    .then(() => {
      console.log('Item Deleted');
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
}

exports.postOrder = (req, res) => {
  req.user.addOrder()
    .then(() => res.redirect('/orders'))
    .catch(err => console.log(err));
}

exports.getOrders = (req, res) => {
  req.user.getOrders()
    .then(orders => {
      res.render('./shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      })
    })
    .catch(err => console.log(err))
}

exports.getCheckout = (req, res) => {
  res.render('./shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  })
}