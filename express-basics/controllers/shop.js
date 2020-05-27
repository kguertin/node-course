const Product = require('../models/product')

exports.getProducts = (req, res) => {
  Product.fetchAll()
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
  Product.fetchAll()
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
    .then(cart => cart.getProducts())
    .then(products => {
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
  .then(res => console.log('this is the response:', res))
  .catch(err => console.log(err));
//  let fetchedCart;
//   let newQuantity = 1;

//   req.user.getCart()
//     .then(cart => {
//       fetchedCart = cart;
//       return cart.getProducts({
//         where: { id: prodId }
//       })
//     })
//     .then(products => {
//       let product;
//       if (products.length > 0) {
//         product = products[0];
//       }
//       if (product) {
//         const oldQuantity = product.cartItem.quantity;
//         newQuantity = oldQuantity + 1;
//         return product
//       }
//       return Product.findByPk(prodId)
//     })
//     .then(product => {
//       return fetchedCart.addProduct(product, {
//         through: { quantity: newQuantity }
//       })
//     })
//     .then(() => res.redirect('/cart'))
//     .catch(err => console.log(err))
};

exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  req.user.getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => {
      console.log('Item Deleted');
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
}

exports.postOrder = (req, res) => {
  req.user.getCart()
    .then(cart => cart.getProducts())
    .then(products => {
      return req.user.createOrder()
        .then(order => {
          return order.addProducts(products.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity };
            return product;
          }))
        })
        .catch(err => console.log(err))
    })
    .then(() => res.redirect('/orders'))
    .catch(err => console.log(err));
}

exports.getOrders = (req, res) => {
  res.render('./shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  })
}

exports.getCheckout = (req, res) => {
  res.render('./shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  })
}

