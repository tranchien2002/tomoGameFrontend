import * as actions from 'actions/tomoAction';

const initialState = {
  web3: null,
  alias_web3: null,
  account: null,
  tomo: null,
  game: null,
  factory: null,
  bounty: 0,
  questioning: false,
  questionBounty: 0,
  winCount: 0,
  balance: 0,
  questionCount: 0,
  aliasAccount: {
    address: '',
    privateKey: ''
  },
  aliasBalance: 0
};

const tomoReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.WEB3_CONNECT:
      return {
        ...state,
        web3: action.web3,
        account: action.account,
        balance: action.balance
      };
    case actions.INSTANTIATE_CONTRACT:
      return {
        ...state,
        factory: action.factory
      };
    case actions.LOGIN_ALIAS_ACCOUNT:
      return {
        ...state,
        alias_web3: action.alias_web3
      };
    case actions.INSTANTIATE_GAME:
      return {
        ...state,
        game: action.game,
        questionCount: action.questionCount
      };
    case actions.SET_BOUNTY:
      return {
        ...state,
        bounty: action.bounty
      };
    case actions.SET_QUESTION:
      return {
        ...state,
        questioning: action.questioning
      };
    case actions.ANSWER:
      return {
        ...state,
        questioning: action.questioning,
        questionBounty: action.questionBounty
      };
    case actions.SHARE_QUESTION_BOUNTY:
      return {
        ...state,
        questionBounty: action.questionBounty
      };
    case actions.SHARE_BOUNTY:
      return {
        ...state,
        bounty: action.bounty
      };
    case actions.FETCH_WIN_COUNT:
      return {
        ...state,
        winCount: action.winCount
      };
    case actions.CREATE_NEW_GAME:
      return {
        ...state,
        game: action.game,
        questionCount: action.questionCount
      };
    case actions.GET_BALANCE:
      return {
        ...state,
        balance: action.balance
      };
    case actions.GET_ALIAS:
      return {
        ...state,
        aliasAccount: action.aliasAccount
      };
    case actions.GET_ALIAS_BALANCE:
      return {
        ...state,
        aliasBalance: action.aliasBalance
      };
    default:
      return state;
  }
};

export default tomoReducer;
