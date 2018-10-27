import * as Web3 from 'web3';
import * as HDWalletProvider from 'truffle-hdwallet-provider';
import { config } from "./config";
import { getQueriesToRun, getQueryData, completeQuery, queryError } from "../db/queries";
import { getProvider } from './utils';
import { DEFAULT_GAS } from '@zapjs/types';
import { ZapProvider } from '@zapjs/provider/lib/src';

export class Responder {
  web3: any;
  provider: ZapProvider;
  constructor() {
    this.web3 = new Web3(new HDWalletProvider(config.mnemonic, config.NODE_WS))
  }

  async getResponse() {
    const rows = await getQueriesToRun(Date.now() + 24 * 60 * 60 * 1000);
    if (!rows.length) Promise.resolve();
    this.provider = await getProvider(this.web3);
    /* return this.provider.zapDispatch.contract.methods
      .respond1('39321419166917203612643141771553320096522987823732892611119270400749290767191', 'some text')
      .send({ from: this.provider.providerOwner, gas: 2000000, gasPrice: 15000000000}).then(txid => { console.log(txid); return txid }).catch(console.log); */
    return Promise.all(rows.map(query => this.respond(query)));
  }

  private async respond(query) {
    try {
      const data = await getQueryData(query.queryId, query.sql);
      console.log('query.sql', query.sql);
      const response = Object.values(data[0][0]).map(String);
      console.log('response', response);
      // const txid: any = await this.provider.zapDispatch.contract.methods.respond1(query.queryId, response[0])
        // .send({ from: this.provider.providerOwner, gas: DEFAULT_GAS});
      const txid: any = await Promise.race([
        this.provider.respond({
          queryId: query.queryId,
          responseParams: response,
          dynamic: false,
          gas: DEFAULT_GAS,
        }),
        new Promise((resolve) => { setTimeout(() => { resolve('Request timeout.'); }, 2000); }),
      ])
      console.log('Responded to queryId', query.queryId,'in transaction', txid.transactionHash);
      await completeQuery(query.queryId, txid)
      return txid;
    } catch (e) {
      console.error(`Error responding to query ${query.queryId}`, e);
      await queryError(query.queryId, e.message);
      return e.message;
    }
  }
}