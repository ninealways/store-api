var gplay = require("google-play-scraper");
var store = require("app-store-scraper");
const express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post("/appDetails", async (req, res) => {
  const { value, selectPlatform } = req.body || {};
  //console.log("selectPlatform", req.body);
  let result ={};
  if (selectPlatform == "ANDROID") {
    result = await gplay.app({ appId: value, fullDetail: true });
    let reviews = await gplay.reviews({
      appId: value,
      sort: gplay.sort.RATING,
      num: 3000,
    });
  } else {
    result = await store.app({ id: value, ratings: true });
  }
  res.send(result);
});

app.post("/appReviews", async (req, res) => {
  const { value, selectPlatform, nextPaginationToken } = req.body || {};
  //console.log("selectPlatform", req.body);
  let result = {};
  if (selectPlatform == "ANDROID") {
    result = await gplay.reviews({
      appId: value,
      sort: gplay.sort.RATING,
      paginate: true,
      num: 150,
      nextPaginationToken: nextPaginationToken,
    });
  } else {

    result = await store.reviews({
      id: value,
      sort: store.sort.HELPFUL,
      page: 1
    });
  }
  res.send(result);
});

app.post("/appRatings", async (req, res) => {
  const { value, selectPlatform } = req.body || {};
  //console.log("selectPlatform", req.body);
  let result={};
  if (selectPlatform == "ANDROID") {
    result = await gplay.ratings({
      appId: value,
    });
  } else {
    result = await store.ratings({
      id: value,
    })
  }
  res.send(result);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
