const express = require('express');
const request = require('sync-request');
const console = require('console');

const storePage = 'https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/stores/json?page='
const salePage  = 'https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/sales/json?page='

var app = express();

let storeInfos = [];
let port = 80;

function req(uriBase, key) {
	let page = 1;
	let totalPages = 1;
	let ret = [];

	console.log(key);
	do {
		let res = request('GET', uriBase + page);
		json = JSON.parse(res.getBody());
		list = json[key];
		ret = ret.concat(list);
		totalPages = json.totalPages;
	} while (page++ < totalPages);
	console.log(ret.length);

	return ret;
}

function main() {
	let stores  = req(storePage, 'storeInfos');
	let sales   = req(salePage,  'sales');
	let codeSales = {};

	sales.forEach((element)  => { 
		let code = element.code;
		if (code != null) {
			delete(element['code']);
			codeSales[code] = element;
		}
	});
	stores.forEach((element) => {
		let code = element.code;
		if(codeSales[code] != null) {
			let sale = codeSales[code];
			let newObject = (Object.assign(element, sale));
			storeInfos.push(newObject);
		}
	});

	console.log(storeInfos.length);
}

app.get('/', (req, res) => {
	if (req.query.city != null) {
		let city = req.query.city;
		let storeList = [];
		storeInfos.forEach((element) => {
			if (element.addr.indexOf(city) >= 0) {
				storeList.push(element);
			}
		});
		res.send(storeList);
	} else {
		res.send('city=[city name]');
	}
});

app.listen(port, () => { console.log(`server start port at ${port}`); });

main();
