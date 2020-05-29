const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    items: [{
      productId: {
        type: Schema.ObjectId,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }]
  }
})

module.exports = mongoose.model('User', userSchema)




// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class User {
//   constructor(username, email, cart, id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection('users')
//       .insertOne(this)
//       .then(() => console.log('User Added'))
//       .catch(err => console.log(err))
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString();
//     })

//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new mongodb.ObjectId(product._id),
//         quantity: newQuantity
//       })
//     }

//     const updatedCart = {
//       items: updatedCartItems
//     };

//     const db = getDb();
//     return db.collection('users')
//       .updateOne({
//         _id: new mongodb.ObjectId(this._id)
//       }, {
//         $set: {
//           cart: updatedCart
//         }
//       })
//       .then(() => console.log('Cart Updated'))
//       .catch(err => console.log(err))
//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map(p => p.productId);
//     return db.collection('products')
//       .find({
//         _id: {
//           $in: productIds
//         }
//       })
//       .toArray()
//       .then(products => {
//         return products.map(product => {
//           return { ...product,
//             quantity: this.cart.items.find(i => i.productId.toString() === product._id.toString()).quantity
//           };
//         })
//       })
//       .catch(err => console.log(err))
//   }

//   deleteItemFromCart(prodId) {
//     const updatedCartItems = this.cart.items.filter(item => {
//       return item.productId.toString() !== prodId.toString();
//     });
//     const db = getDb();
//     return db.collection('users')
//       .updateOne({
//         _id: new mongodb.ObjectId(this._id)
//       }, {
//         $set: {
//           cart: {
//             items: updatedCartItems
//           }
//         }
//       })
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then(products => {
//         const order = {
//           items: products,
//           user: {
//             _id: new mongodb.ObjectId(this._id),
//             username: this.username,
//             email: this.email
//           }
//         }
//         return db.collection('orders')
//           .insertOne(order)
//           .then(() => {
//             this.cart = {
//               items: []
//             }
//             return db.collection('users')
//               .updateOne({
//                 _id: new mongodb.ObjectId(this._id)
//               }, {
//                 $set: {
//                   cart: {
//                     items: []
//                   }
//                 }
//               })
//           })
//       })
//       .catch(err => console.log(err))
//   }

//   getOrders() {
//     const db = getDb();
//     return db.collection('orders')
//       .find({
//         'user._id': new mongodb.ObjectId(this._id)
//       })
//       .toArray()
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db.collection('users')
//       .findOne({
//         _id: new mongodb.ObjectId(userId)
//       })
//       .then(user => {
//         console.log('user sent: ', user);
//         return user;
//       })
//       .catch(err => console.log(err));
//   }
// }

// module.exports = User