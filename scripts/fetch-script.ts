import { updateCurrencies } from '../fetcher/coinmarketcap-fetch';

updateCurrencies().then(() => { process.exit(0); })