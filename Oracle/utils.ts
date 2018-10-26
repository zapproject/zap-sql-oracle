import { ZapProvider } from "@zapjs/provider/lib/src";

/**
 * Loads a ZapProvider from a given Web3 instance
 * @param web3 - WebSocket Web3 instance to load from
 * @returns ZapProvider instantiated
 */
export async function getProvider(web3): Promise<ZapProvider> {
  // loads the first account for this web3 provider
  const accounts: string[] = await web3.eth.getAccounts();
  if (accounts.length == 0) throw new Error('Unable to find an account in the current web3 provider');
  const owner: string = accounts[0];
  console.log('Loaded account:', owner);
  // TODO: Add Zap balance
  console.log('Wallet contains:', await web3.eth.getBalance(owner) / 1e18, 'ETH');
  return new ZapProvider(owner, {
    networkId: (await web3.eth.net.getId()).toString(),
    networkProvider: web3.currentProvider
  });
}
