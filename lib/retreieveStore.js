import axios from "axios";

const timeInterval = 1 * 60 * 1000; // 1 min

const storePage =
  "https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/stores/json?page=";
const salePage =
  "https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/sales/json?page=";

async function retreieve(uriBase, key) {
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

async function retreieveSales() {
  const sales = retreieve(salePage, "sales");
  await sales.then((resolve) => {
    resolve.forEach((sale) => {
      if (sale.code && storeMap[sale.code]) {
        let store = storeMap[sale.code];
        delete sale.code;
        Object.assign(store, sale);
      }
    });
  });
  setTimeout(retreieveSales, timeInterval);
}

export async function retreieveStore() {
  const stores = retreieve(storePage, "storeInfos");
  await stores.then((resolve) => {
    resolve.forEach((store) => {
      if (store.code) {
        storeInfos.push(store);
        storeMap[store.code] = store;
      }
    });
  });
  retreieveSales();
}

let storeMap = {};
let storeInfos = [];

export function getStoreInfo() {
  return storeInfos;
}
