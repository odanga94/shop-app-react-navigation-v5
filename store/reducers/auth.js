import { AUTHENTICATE, LOG_OUT, SET_DID_TRY_AL } from '../actions/auth';

const initialState = {
    token: null,
    userId: null,
    didTryAutoLogin: false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            return {
               token: action.token,
               userId: action.userId,
               didTryAutoLogin: true 
            }
        case LOG_OUT:
            return {
                ...initialState,
                didTryAutoLogin: true
            }
        case SET_DID_TRY_AL:
            return {
                ...state,
                didTryAutoLogin: true
            }
        default: 
            return state;

    }
}