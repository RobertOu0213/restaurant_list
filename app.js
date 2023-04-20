const express = require("express");
const app = express();
const port = 3000;
const exphbs = require("express-handlebars");
const restaurantList = require("./restaurant.json");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

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

app.get("/search", (req, res) => {
  const restaurantsFilter = restaurantList.results.filter(
    (item) =>
      item.name.toLowerCase().includes(req.query.keyword.toLowerCase()) ||
      item.category.toLowerCase().includes(req.query.keyword.toLowerCase())
  );

  res.render("index", {
    restaurants: restaurantsFilter,
    keyword: req.query.keyword,
  });
});

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`);
});
