import { updateCurrencies } from '../fetcher/coinmarketcap-fetch';

updateCurrencies().then((e) => { console.log('done', e) })