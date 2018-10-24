import axios from 'axios';
import * as Promise from 'bluebird';
import knex from '../db/knex';
const apiKey = process.env.COINMARKETCAP_KEY || 'ab1d908f-a947-4996-8f8f-8cd28a146d6e';
const options = {
  url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=200&sort=market_cap&sort_dir=desc',
  method: 'get',
  headers: {
    'X-CMC_PRO_API_KEY': apiKey
  },
};

const insertData = currencies => {
  return knex.transaction(trx => Promise.map(currencies, (currency: any) => trx.insert({
    primary: currency.symbol,
    secondary: 'USD',
    price: currency.quote.USD.price,
    marketcap: currency.quote.USD.market_cap,
    timestamp: currency.quote.USD.last_updated,
  }).into('cryptik').catch(e => { console.log(e); })));
};

export const updateCurrencies = () => {
  return axios(options).then(response => {
    return response.data.data;
  }).then(insertData).catch(error => {
    console.log(error);
  });
}

updateCurrencies().then(() => process.exit(0));