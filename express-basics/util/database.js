const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect(`mongodb+srv://kevin:node1234@cluster0-kmmuu.mongodb.net/test?retryWrites=true&w=majority`)
    .then(client => {
      console.log('Connection Successful');
      callback(client);
    })
    .catch(err => console.log(err));
}

module.exports = mongoConnect