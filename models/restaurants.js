const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
  },
});

module.exports = mongoose.model("Restaurants", restaurantSchema);
