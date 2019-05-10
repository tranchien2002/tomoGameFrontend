import Web3 from 'web3';
import Factory from 'contracts/Factory.json';
// import Game from 'contracts/Game.json';
// import { default as contract } from 'truffle-contract'
// import { AST_EmptyStatement } from 'terser';

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
  console.log(listGame)
  let currentGameAddress = listGame[listGame.length - 1]
  const game = new web3.eth.Contract(GameArtifact.abi, currentGameAddress)
  dispatch({
      type: INSTANTIATE_CONTRACT,
      factory,
      game
  })
}

export const GET_BALANCE = 'GET_BALANCE'
export const getBalance = () => async (dispatch, getState) => {
  const state = getState();
  let web3 = state.tomo.web3
  const from = state.tomo.account
  await web3.eth.getBalance(from).then((balance)=>{
    dispatch({
      type : GET_BALANCE,
      balance : web3.utils.fromWei(balance)
    })
  })
}

export const SET_BOUNTY = 'SET_BOUNTY'
export const setBounty = () => async (dispatch, getState) => {
  const state = getState();
  const from = state.tomo.account;
  const game = state.tomo.game;
  if (game) {
    await game.methods
      .setBounty()
      .send({from: from, value: 10 ** 19})
      .then(() => {
        dispatch({
          type: SET_BOUNTY,
          bounty: state.tomo.bounty
        })
      })
      .catch(e =>{
        console.log("Error setBounty", e)
      })
  }
}

export const SET_QUESTION = 'SET_QUESTION'
export const setQuestion = (correctAnswer) => async (dispatch, getState) => {
  const state = getState();
  const from = state.tomo.account;
  const game = state.tomo.game;
  console.log("ques", correctAnswer.correct)
  await game.methods
    .setQuestion(state.tomo.web3.utils.fromAscii(correctAnswer.correct.toString()))
    .send({from: from})
    .then(() => {
      dispatch({
        type: SET_QUESTION,
        questioning: true
      })
    })
    .catch(e => {
      console.log("Error setQuestion", e)
    })
}

export const ANSWER = 'ANSWER'
export const answer = (answer) => async (dispatch, getState) => {
  const state = getState();
  const game = state.tomo.game;
  const from = state.tomo.account;
  let web3 = state.tomo.web3
  console.log(answer)
  answer = web3.utils.fromAscii(answer.toString());
  console.log(answer)
  await game.methods
    .answer(answer)
    .send({from: from, value: 3*10**18})
    .then(() => {
      dispatch({
        type: ANSWER,
        questioning: false,
        questionBounty: state.tomo.questionBounty + 2
      })
    })
    .catch(e => {
      console.log("Error answer", e)
    })
}

export const SHARE_QUESTION_BOUNTY = 'SHARE_QUESTION_BOUNTY'
export const shareQuestionBounty = () => async (dispatch, getState) => {
  const state = getState();
  const game = state.tomo.game;
  const from = state.tomo.account;
  await game.methods
    .shareQuestionBounty()
    .send({from: from})
    .then(result => {
      dispatch({
        type: SHARE_QUESTION_BOUNTY,
        bounty: 0
      })
    })
    .catch(e => {
      console.log("Error bounty question", e)
    })
}

export const SHARE_BOUNTY = 'SHARE_BOUNTY'
export const shareBounty = () => async (dispatch, getState) => {
  const state = getState();
  const game = state.tomo.game;
  const from = state.tomo.account;
  await game.methods
    .shareBounty()
    .send({from: from})
    .then(result => {
      dispatch({
        type: SHARE_QUESTION_BOUNTY,
        bounty: 0
      })
    })
    .catch(e => {
      console.log("Error bounty", e)
    })
}

export const FETCH_WIN_COUNT = 'FETCH_WIN_COUNT'
export const fetchWinCount = () => async (dispatch, getState) => {
  const state = getState();
  let web3 = state.tomo.web3
  const game = state.tomo.game;
  const from = state.tomo.account;
  let winCount = await game.methods
    .winCount(from)
    .call({
      from: from
    })
  winCount = web3.utils.hexToNumber(winCount);
  dispatch({
    type: FETCH_WIN_COUNT,
    winCount
  })
}

export const CREATE_NEW_GAME = 'CREATE_NEW_GAME'
export const createNewGame = () => async (dispatch, getState) => {
  const state = getState();
  let web3 = state.tomo.web3
  const factory = state.tomo.factory;
  const from = state.tomo.account;
  const GameArtifact = require('contracts/Game');
  await factory.methods
    .createGame()
    .send({from})
    .then(result => {
      const game = new web3.eth.Contract(GameArtifact.abi, result)
      dispatch({
        type: CREATE_NEW_GAME,
        game: game
      })
    })
    .catch(e => {
      console.log("Error create game", e)
    })
}
