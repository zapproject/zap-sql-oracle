import axios from 'axios';
import knex from '../db/knex';
const apiKey = process.env.COINMARKETCAP_KEY || 'ab1d908f-a947-4996-8f8f-8cd28a146d6e';
const options = {
  url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=200&sort=market_cap&sort_dir=desc',
  method: 'get',
  headers: {
    'X-CMC_PRO_API_KEY': apiKey
  },
};

const insertData = currencies => knex.transaction(trx => {
  const promises = currencies.map((currency: any) => trx.insert({
    primary: currency.symbol,
    secondary: 'USD',
    price: currency.quote.USD.price,
    marketcap: currency.quote.USD.market_cap,
    timestamp: currency.quote.USD.last_updated,
  }).into('cryptik').catch(console.log));
  return Promise.all(promises);
});

const removeOldData = () => {
  return knex('cryptik').where('timestamp', '<', Date.now() - 48 * 60 * 60 * 1000).delete();
};

export const updateCurrencies = () => removeOldData()
  .then(() => axios(options))
  .then(response => insertData(response.data.data))
  .catch(console.log);
