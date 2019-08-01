import getWeb3 from '../utils/getWeb3';
import Factory from 'contracts/Factory.json';
import firebase from 'config';

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
    console.log('Web3 Account:', account);
    const balance = await web3.eth.getBalance(account);
    dispatch({
      type: WEB3_CONNECT,
      web3,
      account,
      balance
    });
  } else {
    console.log('Account not found');
  }
};

export const INSTANTIATE_CONTRACT = 'INSTANTIATE_CONTRACT';
export const instantiateContracts = () => async (dispatch, getState) => {
  const state = getState();
  let web3 = state.tomo.web3;
  const from = state.tomo.account;
  const networkId = process.env.REACT_APP_TOMO_ID;
  const FactoryArtifact = require('contracts/Factory');
  const GameArtifact = require('contracts/Game');
  let factoryAddress = FactoryArtifact.networks[networkId].address;
  const factory = new web3.eth.Contract(Factory.abi, factoryAddress, {
    transactionConfirmationBlocks: 1
  });
  let listGame = await factory.methods.getAllGames().call({ from });
  console.log(listGame);
  let currentGameAddress = listGame[listGame.length - 1];
  const game = new web3.eth.Contract(GameArtifact.abi, currentGameAddress, {
    transactionConfirmationBlocks: 1
  });
  let questionCount = await game.methods.currentQuestion().call({ from });
  console.log('questionCount', questionCount);
  dispatch({
    type: INSTANTIATE_CONTRACT,
    factory,
    game,
    questionCount
  });
};

// GET_CEO_ADDRESS
export const GET_CEO_ADDRESS = 'GET_CEO_ADDRESS';
export const getCeoAddress = () => async (dispatch, getState) => {
  const state = getState();
  let web3 = state.tomo.web3;
  const from = state.tomo.account;
  const networkId = process.env.REACT_APP_TOMO_ID;

  const FactoryArtifact = require('contracts/Factory');
  let factoryAddress = FactoryArtifact.networks[networkId].address;
  const factory = new web3.eth.Contract(FactoryArtifact.abi, factoryAddress);

  const ceoAddress = await factory.methods.ceoAddress().call({ from });
  dispatch({
    type: GET_CEO_ADDRESS,
    ceoAddress
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
  const from = state.tomo.account;
  let web3 = state.tomo.web3;

  var answer = web3.utils.fromAscii(answerIndex.toString());
  await game.methods
    .answer(answer)
    .send({ from: from, value: 3 * 10 ** 18 })
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
  const from = state.tomo.account;
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
