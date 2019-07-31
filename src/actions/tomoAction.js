import getWeb3 from '../utils/getWeb3';
import Factory from 'contracts/Factory.json';
import firebase from 'config';
import HDWalletProvider from 'truffle-hdwallet-provider';

const shuffle = (myArr) => {
  let l = myArr.length;
  let temp;
  let index;
  while (l > 0) {
    index = Math.floor(Math.random() * l);
    l--;
    temp = myArr[l];
    myArr[l] = myArr[index];
    myArr[index] = temp;
  }
  return myArr;
};

export const WEB3_CONNECT = 'WEB3_CONNECT';
export const web3Connect = () => async (dispatch) => {
  // const web3 = new Web3(Web3.givenProvider || 'ws://127.0.0.1:8545');
  const web3 = await getWeb3();
  const accounts = await web3.eth.getAccounts();
  if (accounts.length > 0) {
    const account = accounts[0];
    dispatch({
      type: WEB3_CONNECT,
      web3,
      account
    });
  } else {
    console.log('Account not found');
  }
  // call getAliasAcount() funciton to get or create alias accout
  await dispatch(getBalance());
  await dispatch(getAliasAcount());
};

export const INSTANTIATE_CONTRACT = 'INSTANTIATE_CONTRACT';
export const instantiateContracts = () => async (dispatch, getState) => {
  const state = getState();
  let web3 = state.tomo.web3;
  const networkId = process.env.REACT_APP_TOMO_ID;
  const FactoryArtifact = require('contracts/Factory');
  let factoryAddress = FactoryArtifact.networks[networkId].address;
  const factory = new web3.eth.Contract(Factory.abi, factoryAddress, {
    transactionConfirmationBlocks: 1
  });
  dispatch({
    type: INSTANTIATE_CONTRACT,
    factory
  });
};

export const LOGIN_ALIAS_ACCOUNT = 'LOGIN_ALIAS_ACCOUNT';
export const loginAliasAccount = () => async (dispatch, getState) => {
  const state = getState();
  const privateKey = state.tomo.aliasAccount.privateKey;
  console.log(privateKey.replace('0x', ''));
  var Web3 = require('web3');

  var provider = new HDWalletProvider(
    privateKey.replace('0x', ''),
    'https://testnet.tomochain.com'
  );
  var alias_web3 = new Web3(provider);
  dispatch({
    type: LOGIN_ALIAS_ACCOUNT,
    alias_web3
  });
  dispatch(instantiateGame());
};

export const INSTANTIATE_GAME = 'INSTANTIATE_GAME';
export const instantiateGame = () => async (dispatch, getState) => {
  const GameArtifact = require('contracts/Game');
  const state = getState();
  let alias_web3 = state.tomo.alias_web3;
  let factory = state.tomo.factory;
  let from = state.tomo.aliasAccount.address;
  let listGame = await factory.methods.getAllGames().call({ from });
  let currentGameAddress = listGame[listGame.length - 1];
  const game = new alias_web3.eth.Contract(GameArtifact.abi, currentGameAddress);
  let questionCount = await game.methods.currentQuestion().call({ from });
  dispatch({
    type: INSTANTIATE_GAME,
    game,
    questionCount
  });
};

export const GET_BALANCE = 'GET_BALANCE';
export const getBalance = () => async (dispatch, getState) => {
  const state = getState();
  let web3 = state.tomo.web3;
  const from = state.tomo.account;
  await web3.eth.getBalance(from).then((balance) => {
    dispatch({
      type: GET_BALANCE,
      balance: web3.utils.fromWei(balance)
    });
  });
};

export const SET_BOUNTY = 'SET_BOUNTY';
export const setBounty = () => async (dispatch, getState) => {
  const state = getState();
  const from = state.tomo.account;
  const game = state.tomo.game;
  if (game) {
    await game.methods
      .setBounty()
      .send({ from: from, value: 10 ** 19 })
      .then(() => {
        dispatch({
          type: SET_BOUNTY,
          bounty: state.tomo.bounty
        });
      })
      .catch((e) => {
        console.log('Error setBounty', e);
      });
  }
};

export const SET_QUESTION = 'SET_QUESTION';
export const setQuestion = (correctAnswer) => async (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();
  const state = getState();
  const from = state.tomo.account;
  const game = state.tomo.game;
  game.methods
    .setQuestion(state.tomo.web3.utils.fromAscii(correctAnswer.correct.toString()))
    .send({ from: from }, async (e, r) => {
      if (e) return;
      dispatch({
        type: SET_QUESTION,
        questioning: true
      });
      await firestore
        .collection('current_question')
        .doc('current')
        .get()
        .then(async (doc) => {
          if (doc.exists) {
            await firestore
              .collection('current_question')
              .doc('current')
              .set({
                ...correctAnswer,
                question: correctAnswer.question,
                correct: correctAnswer.correct,
                answer: correctAnswer.answer,
                //add user choice vao database
                user_choice: {
                  0: 0,
                  1: 0,
                  2: 0,
                  3: 0
                }
              })
              .then(() => {
                console.log('done selected question');
                dispatch({
                  type: 'INSERT_QUES'
                });
              })
              .catch((err) => {
                dispatch({ type: 'INSERT_QUES_ERROR' }, err);
              });

            await firestore
              .collection('list_question')
              .doc(correctAnswer.id)
              .delete()
              .then(function() {
                console.log('doc', correctAnswer.id);
                console.log('remove selected document');
              })
              .catch(function(error) {
                console.error('Error removing document: ', error);
              });
          } else {
            console.log('No such document!');
          }
        });
    });
};

export const ANSWER = 'ANSWER';
//khi nguoi dung chon dap an update user_choice tren firebase
export const answer = (answerIndex) => async (dispatch, getState) => {
  var db = firebase.firestore();
  const state = getState();
  const game = state.tomo.game;
  const from = state.tomo.aliasAccount.address;
  let alias_web3 = state.tomo.alias_web3;

  var answer = alias_web3.utils.fromAscii(answerIndex.toString());
  await game.methods
    .answer(answer)
    .send({
      from: from,
      value: 3 * 10 ** 18,
      // TODO tinh gas limit
      gasLimit: alias_web3.utils.toHex(2000000),
      gasPrice: alias_web3.utils.toHex(alias_web3.utils.toWei('0.25', 'gwei'))
    })
    .then(() => {
      dispatch({
        type: ANSWER,
        questioning: false,
        questionBounty: state.tomo.questionBounty + 2
      });
    })
    .catch((e) => {
      console.log('Error answer', e);
    })
    .then(() => {
      // tang so sau khi xac nhanj contract
      db.collection('current_question')
        .doc('current')
        .get()
        .then((doc) => {
          if (doc.exists) {
            var data = doc.data();
            data.user_choice[answerIndex] = data.user_choice[answerIndex] + 1;
            console.log('Document data:', data);
            db.collection('current_question')
              .doc('current')
              .set(data);
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
          }
        })
        .catch(function(error) {
          console.log('Error getting document:', error);
        });
    });
};

export const SHARE_QUESTION_BOUNTY = 'SHARE_QUESTION_BOUNTY';
export const shareQuestionBounty = () => async (dispatch, getState) => {
  const state = getState();
  const game = state.tomo.game;
  const from = state.tomo.account;
  await game.methods
    .shareQuestionBounty()
    .send({ from: from })
    .then((result) => {
      dispatch({
        type: SHARE_QUESTION_BOUNTY,
        bounty: 0
      });
    })
    .catch((e) => {
      console.log('Error bounty question', e);
    });
};

export const SHARE_BOUNTY = 'SHARE_BOUNTY';
export const shareBounty = () => async (dispatch, getState) => {
  const state = getState();
  const game = state.tomo.game;
  const from = state.tomo.account;
  await game.methods
    .shareBounty()
    .send({ from: from })
    .then((result) => {
      dispatch({
        type: SHARE_QUESTION_BOUNTY,
        bounty: 0
      });
    })
    .catch((e) => {
      console.log('Error bounty', e);
    });
};

export const FETCH_WIN_COUNT = 'FETCH_WIN_COUNT';
export const fetchWinCount = () => async (dispatch, getState) => {
  const state = getState();
  let web3 = state.tomo.web3;
  const game = state.tomo.game;
  const from = state.tomo.aliasAccount.address;
  let winCount = await game.methods.winCount(from).call({
    from: from
  });
  winCount = web3.utils.hexToNumber(winCount);
  dispatch({
    type: FETCH_WIN_COUNT,
    winCount
  });
};

export const CREATE_NEW_GAME = 'CREATE_NEW_GAME';
export const createNewGame = () => async (dispatch, getState) => {
  const state = getState();
  let web3 = state.tomo.web3;
  const factory = state.tomo.factory;
  const from = state.tomo.account;
  const GameArtifact = require('contracts/Game');
  factory.methods
    .createGame()
    .send({ from })
    .then(async () => {
      let listGame = await factory.methods.getAllGames().call({ from });
      let currentGameAddress = listGame[listGame.length - 1];
      console.log(listGame);
      const game = new web3.eth.Contract(GameArtifact.abi, currentGameAddress);
      let questionCount = await game.methods.currentQuestion().call({ from });
      dispatch({
        type: CREATE_NEW_GAME,
        game: game,
        questionCount: questionCount
      });
      fetch('https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple', {
        method: 'GET'
      })
        .then((res) => {
          return res.json();
        })
        .then((jsonRes) => {
          var db = firebase.firestore();
          var list_questions = [];
          jsonRes.results.forEach((e, index) => {
            let object = {};
            object['question'] = e.question;
            e.incorrect_answers.push(e.correct_answer);
            object['answer'] = shuffle(e.incorrect_answers);
            object['quesNumber'] = index;
            object['correct'] = object['answer'].indexOf(e.correct_answer);
            list_questions.push(object);
          });
          db.collection('list_question')
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                console.log('doc', doc);
                doc.ref.delete();
              });
            })
            .then(() => {
              console.log('delete all');
              console.log('list question new', list_questions);
              list_questions.forEach((e) => {
                let newId = db.collection('list_question').doc().id;
                e['id'] = newId;
                db.collection('list_question')
                  .doc(e['id'])
                  .set(e);
              });
            });
        });
    })
    .catch((e) => {
      console.log('Error create game', e);
    });
};

export const GET_ALIAS = 'GET_ALIAS';
export const getAliasAcount = () => async (dispatch, getState) => {
  var aliasAccount = {
    address: '',
    privateKey: ''
  };
  if (localStorage.getItem('alias_account') === null) {
    const state = getState();
    let web3 = state.tomo.web3;
    // create Alias account
    var account = await web3.eth.accounts.create();

    aliasAccount = account;
    localStorage.setItem('alias_account', JSON.stringify(aliasAccount));
  } else {
    aliasAccount = JSON.parse(localStorage.getItem('alias_account'));
  }
  dispatch({
    type: GET_ALIAS,
    aliasAccount: aliasAccount
  });
};

export const SEND_MONEY_TO_ALIAS = 'SEND_MONEY_TO_ALIAS';
export const sendMoneyToAlias = () => async (dispatch, getState) => {
  const state = getState();
  let web3 = state.tomo.web3;
  await web3.eth.sendTransaction({
    from: state.tomo.account,
    to: state.tomo.aliasAccount.address,
    value: 31 * 10 ** 18
  });
  dispatch(getAliasBalance());
  dispatch(loginAliasAccount());
};

export const GET_ALIAS_BALANCE = 'GET_ALIAS_BALANCE';
export const getAliasBalance = () => async (dispatch, getState) => {
  const state = getState();
  let web3 = state.tomo.web3;
  let aliasBalance = await web3.eth.getBalance(state.tomo.aliasAccount.address);
  console.log(web3.utils.fromWei(aliasBalance));
  dispatch({
    type: GET_ALIAS_BALANCE,
    aliasBalance
  });
};

export const SEND_MONEY_BACK = 'SEND_MONEY_BACK';
export const sendMoneyBack = () => async (dispatch, getState) => {
  const state = getState();
  let alias_web3 = state.tomo.alias_web3;
  await alias_web3.eth.sendTransaction({
    from: state.tomo.aliasAccount.address,
    to: state.tomo.account,
    // TODO tinh gas
    value: state.tomo.aliasBalance - 30000000000000000
  });
};
