import { ZapProvider } from "@zapjs/provider";
import { ZapToken } from "@zapjs/zaptoken"
import { config } from "./config";
const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require('web3');

export class Oracle {
  web3: any;
  constructor() {
    this.web3 = new Web3(new HDWalletProvider(config.mnemonic, config.NODE_WS))
  }
    /**
   * Initializes the oracle. Creates the provider if it does not exist already.
   * For each endpoint in schema, create curve and params
   * Starts listening for queries and calling handleQuery function
   */
  async initialize() {
    const provider = await this.getProvider();
    const title = await provider.getTitle();
    if (title.length === 0) {
      console.log("No provider found, Initializing provider");
      const res: string = await provider.initiateProvider({title: config.title, public_key: config.public_key});
      console.log(res);
      console.log("Successfully created oracle", config.title);
    } else {
      console.log("Oracle exists");
    }
  }

  /**
   * Loads a ZapProvider from a given Web3 instance
   * @param web3 - WebSocket Web3 instance to load from
   * @returns ZapProvider instantiated
   */
  async getProvider(): Promise<ZapProvider> {
    // loads the first account for this web3 provider
    const accounts: string[] = await this.web3.eth.getAccounts();
    if (accounts.length == 0) throw new Error('Unable to find an account in the current web3 provider');
    const owner: string = accounts[0];
    console.log("Loaded account:", owner);
    // TODO: Add Zap balance
    console.log("Wallet contains:", await this.web3.eth.getBalance(owner) / 1e18, "ETH");
    return new ZapProvider(owner, {
      networkId: (await this.web3.eth.net.getId()).toString(),
      networkProvider: this.web3.currentProvider
    });
  }
}