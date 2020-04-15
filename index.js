import express from 'express'
import axios from 'axios'

const storePage =
  "https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/stores/json?page=";
const salePage =
  "https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/sales/json?page=";

const app = express();
const port = 80;

let storeInfos = [];

async function req(uriBase, key) {
  let page = 1;
  let totalPages = 1;
  let ret = [];

  console.log(key);
  do {
    await axios({
      method: "get",
      url: uriBase + page,
    }).then((res) => {
      const list = res.data[key];
      totalPages = res.data.totalPages;
      ret = ret.concat(list);
    });
  } while (page++ < totalPages);
  console.log(ret.length);

  return ret;
}

async function main() {
  const stores = req(storePage, "storeInfos");
  const sales = req(salePage, "sales");
  let codeSales = {};

  await sales.then((resolve) => {
    resolve.forEach((sale) => {
      if (sale.code) {
        codeSales[sale.code] = sale;
        delete sale.code;
      }
    });
  });

  await stores.then((resolve) => {
    resolve.forEach((store) => {
      if (codeSales[store.code]) {
        storeInfos.push(Object.assign(store, codeSales[store.code]));
      }
    });
  });
}

app.get("/", (req, res) => {
  if (req.query.city != null) {
    console.log(req.query.city);
    let city = req.query.city;
    let storeList = [];
    storeInfos.forEach((element) => {
      if (element.addr.indexOf(city) >= 0) {
        storeList.push(element);
      }
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

main();
console.log("start server");
