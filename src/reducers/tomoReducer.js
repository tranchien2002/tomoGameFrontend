import * as actions from 'actions/tomoAction'

const initialState = {
    web3: null,
    account: null,
    tomo: null,
    game: null,
    factory: null,
}

const tomoReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.WEB3_CONNECT:
            return {
                ...state,
                web3: action.web3,
                account: action.account
            }
        case actions.INSTANTIATE_CONTRACT:
            return {
                ...state,
                factory: action.factory,
                game: action.game
            }
        default:
            return state;
    }
}

export default tomoReducer;
