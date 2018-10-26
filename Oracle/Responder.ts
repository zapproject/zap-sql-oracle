import * as Web3 from 'web3';
import * as HDWalletProvider from 'truffle-hdwallet-provider';
import { config } from "./config";
import { getQueriesToRun, getQueryData, completeQuery, resetQuery } from "../db/queries";
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
    if (!rows.length) return;
    this.provider = await getProvider(this.web3);
    for (let query of rows) {
      const data = await getQueryData(query.queryId, query.sql);
      console.log('query', query.sql);
      await this.respond(query.queryId, Object.values(data[0][0]).map(String)).catch(console.log);
    }
    return Promise.resolve();
  }

  private respond(queryId, response) {
    console.log('response', response);
    return this.provider.respond({
      queryId: queryId,
      responseParams: response,
      dynamic: false,
      gas: DEFAULT_GAS,
    }).then((txid: any) => {
      console.log('Responded to queryId', queryId, "in transaction", txid.transactionHas);
      return completeQuery(queryId)
    }).catch(e => {
      console.error(`Error responding to query ${queryId}`, e);
      return resetQuery(queryId);
    });
  }
}