//jshint esversion:6
require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var encrypt = require('mongoose-encryption');

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


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

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
                const newUser = new User
                    ({
                        email: req.body.username,
                        password: req.body.password
                    })
                newUser.save();
                res.redirect("/login");
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
                console.log(user);
                if (user.password === password) {
                    res.render("secrets");
                }

                else
                    res.render("login.ejs", {
                        display: "block"
                    });
            }
        }
    })
})



app.listen(3000, function () {
    console.log("Listening at port 3000");
})