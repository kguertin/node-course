const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res) => {
  Product.find()
    .then(products => {
      res.render('./shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.isLoggedIn
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
        path: '/products',
        isAuthenticated: req.isLoggedIn
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
        path: '/',
        isAuthenticated: req.isLoggedIn
      });
    });
}

exports.getCart = (req, res) => {
  req.user.populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('./shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        isAuthenticated: req.isLoggedIn
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
  req.user.removeFromCart(prodId)
    .then(() => {
      console.log('Item Deleted');
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
}

exports.postOrder = (req, res) => {
  req.user.populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      console.log(user.cart.items)
      const products = user.cart.items.map(i => {
        return {
          quantity: i.quantity,
          product: { ...i.productId._doc
          }
        }
      });
      console.log(products)
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(() => req.user.clearCart())
    .then(() => res.redirect('/orders'))
    .catch(err => console.log(err));
}

exports.getOrders = (req, res) => {
  Order.find({'user.userId': req.user._id})
    .then(orders => {
      res.render('./shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated: req.isLoggedIn
      })
    })
    .catch(err => console.log(err))
}

exports.getCheckout = (req, res) => {
  res.render('./shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
    isAuthenticated: req.isLoggedIn
  })
}