const express = require("express");
const app = express();
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const restaurantList = require("./restaurant.json");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", () => {
  console.log("mongodb error!");
});
db.once("open", () => {
  console.log("mongodb connected");
});

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//connect 靜態資料
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { restaurants: restaurantList.results });
});

app.listen(3000, () => {
  console.log(`Express is listening on http://localhost:3000`);
});
