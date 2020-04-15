import axios from 'axios'

const storePage =
  "https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/stores/json?page=";
const salePage =
  "https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/sales/json?page=";

let storeInfos = [];

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

export async function retreieveStore() {
  const stores = retreieve(storePage, "storeInfos");
  const sales = retreieve(salePage, "sales");
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

export function getStoreInfo() {
    return storeInfos;
}