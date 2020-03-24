const express = require("express");
const mongoose = require("mongoose");
const chalk = require("chalk");

const ShortUrl = require("./models/shortUrl");
// DB config
const db = require("./config/keys").MongoURI;
const app = express();
const port = process.env.PORT || 8080;

mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set("view engine", "ejs");
app.use(
  express.urlencoded({
    extended: false
  })
);

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", {
    shortUrls: shortUrls
  });
});
app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({
    full: req.body.fullUrl
  });
  res.redirect("/");
});
app.get("/shortUrl/delete/:id", async (req, res) => {
  const shortUrlId = req.params.shortUrlId;
  const targetUrl = await ShortUrl.deleteOne(shortUrlId);
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) res.sendStatus(404);
  shortUrl.clicks++;
  shortUrl.save();
  res.redirect(shortUrl.full);
});

app.listen(port, (req, res, next) =>
  console.log("App running on port:" + chalk.blue(`${port}`))
);
