import Web3 from 'web3';
import Factory from 'contracts/Factory.json';
import Game from 'contracts/Game.json';
import { default as contract } from 'truffle-contract'

export const WEB3_CONNECT = 'WEB3_CONNECT';
export const web3Connect = () => async dispatch => {
  const web3 = new Web3(Web3.givenProvider || 'ws://127.0.0.1:9545');
  const accounts = await web3.eth.getAccounts();
  if (accounts.length > 0) {
    const account = accounts[0];
    console.log('Web3 Account:', account);
    const balance = await web3.eth.getBalance(account);
    dispatch({
      type: WEB3_CONNECT,
      web3,
      account,
      balance,
    });
  } else {
    console.log("Account not found");
  }
};

export const INSTANTIATE_CONTRACT = 'INSTANTIATE_CONTRACT'
export const instantiateContracts = () => async (dispatch, getState) => {
    const state = getState();
    let web3 = state.tomo.web3
    const from = state.tomo.account
    const networkId = process.env.REACT_APP_TOMO_ID;
    const FactoryArtifact = require('contracts/Factory');
    const GameArtifact = require('contracts/Game');
    let factoryAddress = FactoryArtifact.networks[networkId].address;
    const factory = new web3.eth.Contract(Factory.abi, factoryAddress);
    let listGame = await factory.methods.getAllGames().call({ from });
    let currentGameAddress = listGame[listGame.length - 1]
    const game = new web3.eth.Contract(GameArtifact.abi, currentGameAddress)
    dispatch({
        factory,
        game
    })
}
