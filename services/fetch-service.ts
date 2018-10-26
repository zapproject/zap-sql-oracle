import cron from 'node-cron';
import { updateCurrencies } from '../fetcher/coinmarketcap-fetch';

cron.schedule('* 8, 16, 23 * * *', () => {
  console.log('Update currencies.');
  updateCurrencies().then(() => {
    console.log('Currencies have been updated.');
  });
});
