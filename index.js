'use strict';

import express from "express";
import { retreieveStore, getStoreInfo } from "./lib/retreieveStore";

const app = express();
const port = 80;

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

app.listen(port, () => {
  console.log(`server start port at ${port}`);
});

retreieveStore();
console.log("start server");
