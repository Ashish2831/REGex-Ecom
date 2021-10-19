const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const Product = require("./models/productModel");
const app = express();
const path = require("path");
const hbs = require("hbs");

const errorMiddleware = require("./middleware/error");

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path: "./src/config/config.env",
    });
}

app.use(express.json());
app.use(cookieParser());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(fileUpload());

// Route Imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");
const async = require("hbs/lib/async");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

app.use(express.static(path.join(__dirname, "../public")));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../templates"));
hbs.registerPartials(path.join(__dirname, "../templates/partials"));

app.get("/", (req, res) => {
    const {
        token
    } = req.cookies;
    if (token === undefined)
        res.render("index", {
            loggedIn: false,
        });
    else
        res.render("index", {
            loggedIn: true,
        });
});

app.get("/cart/", (req, res) => {
    const {
        token
    } = req.cookies;
    if (token === undefined) res.redirect("/account/");
    else
        res.render("cart", {
            loggedIn: true,
        });
});

app.get("/account/", (req, res) => {
    const {
        token
    } = req.cookies;
    if (token === undefined) res.render("account");
    else res.redirect("/");
});

app.get("/checkout/", (req, res) => {
    const {
        token
    } = req.cookies;
    if (token === undefined) res.redirect("/account/");
    else
        res.render("checkout", {
            loggedIn: true,
        });
});

app.get("/about/", (req, res) => {
    const {
        token
    } = req.cookies;
    if (token === undefined) res.redirect("/account/");
    else
        res.render("team", {
            loggedIn: true,
        });
});

app.get("/products/", (req, res) => {
    const {
        token
    } = req.cookies;
    if (token === undefined) res.redirect("/account/");
    else
        res.render("products", {
            loggedIn: true,
        });
});

app.get("/product_details/:id/", async (req, res) => {
    const product = await Product.findById(req.params.id);
    const related_products = await Product.find({
        category: product.category,
        _id: {
            $ne: product._id,
        },
    });

    const {
        token
    } = req.cookies;
    if (token === undefined) res.redirect("/account/");
    else
        res.render("product_details", {
            loggedIn: true,
            product: product,
            related_products: related_products,
        });
});

app.get("/cart/:id_list/", async (req, res) => {
    const cart_products = await Product.find({
        _id: {
            $in: JSON.parse(req.params.id_list),
        },
    });
    res.json({
        'cart_products': cart_products
    });
});

app.get("/login/:success/:token/", (req, res) => {
    res.cookie("token", JSON.parse(req.params.token));
});

app.get("/logout/", (req, res) => {
    res.clearCookie("token");
    res.redirect("/account/");
});

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;