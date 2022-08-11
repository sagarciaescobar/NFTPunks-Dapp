import Web3 from "web3/dist/web3.min";

import { InjectedConnector } from "@web3-react/injected-connector";

export const getLibrary = (provider) => {
  return new Web3(provider);
};

export const connector = new InjectedConnector({
  supportedChainIds: [4],
});
