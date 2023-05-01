const express = require("express");
const app = express();
const port = 3000;
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const restaurantList = require("./models/seeds/restaurant.json");

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

app.get("/", (req, res) => {
  res.render("index", { restaurants: restaurantList.results });
});

app.get("/restaurants/:restaurant_id", (req, res) => {
  const restaurants = restaurantList.results.find(
    (item) => item.id.toString() === req.params.restaurant_id
  );
  res.render("show", { restaurants: restaurants });
});

//搜尋keyword
app.get("/search", (req, res) => {
  const restaurantsFilter = restaurantList.results.filter(
    (item) =>
      item.name
        .toLowerCase()
        .trim()
        .includes(req.query.keyword.toLowerCase().trim()) ||
      item.category
        .toLowerCase()
        .trim()
        .includes(req.query.keyword.toLowerCase().trim())
  );

  res.render("index", {
    restaurants: restaurantsFilter,
    keyword: req.query.keyword,
  });
});

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`);
});
