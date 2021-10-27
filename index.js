const Express = require("express");
const Mongoose = require("mongoose");
const DotEnv = require("dotenv");
const AuthRoutes = require("./routes/auth");
const UserRoutes = require("./routes/user");
const AdminRoutes = require("./routes/admin");
const ProductRoutes = require("./routes/product");
const CartRoutes = require("./routes/cart");
const OrdersRoutes = require("./routes/cart");

DotEnv.config();

// connect the database
Mongoose.connect(process.env.MONGO_URL)
  .then((res) => {
    console.log("connected");
  })
  .catch((e) => {
    console.log("not connected");
  });

const app = Express();
// this allow you to parse json
app.use(Express.json());
// call the routes
app.use("/api/auth", AuthRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/products", ProductRoutes);
app.use("/api/carts", CartRoutes);
app.use("/api/orders", OrdersRoutes);
app.use("/admin", AdminRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log("app is running on " + process.env.PORT);
});
