require("dotenv").config();
const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const authRouter = require("./Routes/authRoutes");
const feedRouter = require("./Routes/feedRoutes");
const userRouter = require("./Routes/userRoutes");
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//To allow cross-origin requests
// app.use(cors());

// use passport in app
app.use(passport.initialize());

require("./passport-config")(passport);

const mongo_url = process.env.MONGO_URL || "mongodb://localhost:27017/knovator";

mongoose
	.connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log(`Connected to database ${mongo_url}`);
	})
	.catch((err) => {
		console.log("Error connecting to database : ", err);
		exit(0);
	});

app.use("/auth", authRouter);
app.use("/feed", feedRouter);
app.use("/user", userRouter);

app.listen(port, (req, res) => {
	console.log(`Server is running on http://localhost:${port}/`);
});
