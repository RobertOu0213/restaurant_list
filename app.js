const express = require("express");
const app = express();
const port = 3000;
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const restaurantList = require("./models/seeds/restaurant.json");
const Restaurants = require("./models/restaurants");
const restaurants = require("./models/restaurants");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

mongoose.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", () => {
  console.log("mongodb error");
});
db.once("open", () => {
  console.log("mongodb connected");
});

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//connect 靜態資料
app.use(express.static("public"));

//body parser
app.use(express.urlencoded({ extended: true }));

//瀏覽全部餐廳
app.get("/", (req, res) => {
  Restaurants.find()
    .lean()
    .then((restaurants) => {
      res.render("index", { restaurants });
    })
    .catch((error) => console.log(error));
});

//瀏覽新餐廳
app.get("/restaurants/new", (req, res) => {
  res.render("new");
});

//新增新餐廳
app.post("/restaurants", (req, res) => {
  const name = req.body.name;
  return Restaurants.create({ name })
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

//瀏覽特定餐廳
app.get("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  return Restaurants.findById(id)
    .lean()
    .then((restaurant) => res.render("detail", { restaurant }))
    .catch((error) => console.log(error));
});

//瀏覽編輯餐廳
app.get("/restaurants/:id/edit", (req, res) => {
  const id = req.params.id;
  return Restaurants.findById(id)
    .lean()
    .then((restaurant) => res.render("edit", { restaurant }))
    .catch((error) => console.log(error));
});

//修改資料
app.post("/restaurants/:id/edit", (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  return Restaurants.findById(id)
    .then((restaurant) => {
      restaurant.name = name;
      return restaurant.save();
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch((error) => console.log(error));
});

//搜尋keyword
app.get("/search", (req, res) => {
  Restaurants.find()
    .lean()
    .then((restaurant) => {
      let restaurantFilter = restaurant.name
        .toLowerCase()
        .trim()
        .includes(req.query.keyword.toLowerCase().trim());
      res.render("index", { restaurants: restaurantFilter });
    });
});

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`);
});
