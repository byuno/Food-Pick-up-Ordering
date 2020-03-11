// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require("morgan");
const cookieParser = require('cookie-parser');

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

//use cookie parser
app.use(cookieParser());

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/styles",
  sass({
    src: __dirname + "/styles",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: "expanded"
  })
);
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");

const categoriesRoute = require("./routes/categories");
const orderItemsRoutes = require("./routes/order_items");
const backendRoutes = require("./routes/backend_routes");
// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));

app.use("/api/categories", categoriesRoute(db));
app.use("/api/order", orderItemsRoutes(db));
app.use("/br", backendRoutes(db));
// Note: mount other resources here, using the same pattern above


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  console.log('yo!!!!!!!!!!!!!!!!!!!!!')
  const insertString = `INSERT INTO orders(name) VALUES($1) RETURNING id`;
  const preparedVals = ["BobTestOrder"];

  db.query(insertString, preparedVals)
    .then((_res) => {
      const newRow = _res.rows[0];
      const { id: orderId } = newRow;
      console.log('New Order Id:  ', orderId);
      res.render("index", { orderId });
      //console.log('Cookies: ', _res.cookie('user_id', 1234));
    })
    .catch(e => console.error(e.stack))
  // insert a db row in Orders table, returning order id or uuid

});

app.get("/checkout", (req, res) => {
  res.render("checkout");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
