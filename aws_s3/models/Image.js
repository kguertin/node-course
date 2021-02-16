const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema(
  {
    filePath: String,
  },
  {
    timestamps: true,
  }
);

const Image = mongoose.Model('Image', ImageSchema);

module.exports = Image;
