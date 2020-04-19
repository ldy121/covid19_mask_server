const express = require("express");
const { retreieveStore, getStoreInfo } = require("./lib/retreieveStore");

const app = express();

app.get("/", (req, res) => {
  if (req.query.city != null) {
    console.log(req.query.city);

    let city = req.query.city;
    const storeInfos = getStoreInfo();

    const storeList = storeInfos
      .filter((element) => {
        return element.addr.indexOf(city) >= 0;
      })
      .filter((element) => {
        const cityAddr = 10;
        return element.addr.indexOf(city) < cityAddr;
      });

    console.log(storeList.length);
    res.send(storeList);
  } else {
    res.send("city=[city name]");
  }
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`server start port at ${port}`);
  retreieveStore();
});
