const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const { userRoute } = require("./routes");

// variabel
const app = express();

// config env
dotenv.config();
// get value from env
const port = process.env.PORT || 3002;

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/api/auth", userRoute);

// connect mongodb
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB is connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`Server run on port : ${port}`);
});
