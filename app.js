//jshint esversion:6
require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 5;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/SecretsDB",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home.ejs");
})


app.get("/login", function (req, res) {
    res.render("login.ejs", {
        display: "none"
    });
})

app.get("/register", function (req, res) {
    res.render("register.ejs", {
        display: "none"
    });
})


app.post("/register", function (req, res) {
    console.log(req.body);
    User.findOne({ email: req.body.username }, function (err, user) {
        if (err)
            console.log(err);
        else {
            if (user)
                res.render("register.ejs", {
                    display: "block"
                });
            else {
                bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                    const newUser = new User
                        ({
                            email: req.body.username,
                            password: hash
                        })
                    newUser.save();
                    res.redirect("/login");

                })

            }
        }
    })
})


app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ email: username }, function (err, user) {
        if (err)
            console.log(err);
        else {
            if (!user)
                res.render("login.ejs", {
                    display: "block"
                });
            else {
                bcrypt.compare(password, user.password, function (err, result) {
                    console.log(result);
                    if (result)
                        res.render("secrets");
                    else
                        res.render("login.ejs", {
                            display: "block"
                        });
                })
            }
        }
    })
})



app.listen(3000, function () {
    console.log("Listening at port 3000");
})