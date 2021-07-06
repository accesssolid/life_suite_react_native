
import { createSlice } from '@reduxjs/toolkit'


const authenticateSlice = createSlice({
    name: "authenticate",
    initialState: {
        authenticate: false,
        user: {},
        friends: {},
        name: '',
        token: "",
        modal: true,
        initial: 'SelectOption'
    },
    reducers: {
        loadauthentication: (state, action) => {
            console.log(action,'actionnnn')
            state.user = action.payload
            state.authenticate = true


        },
        friendauthentication: (state, action) => {

            state.friends = action.payload
            state.authenticate = true

        },
        fcmToken: (state, action) => {

            state.token = action.payload

        },
        logoutState: (state, action) => {
            state.authenticate = false
            state.user = {}
            state.friends = {}
        },
        modalState: (state, action) => {
            state.modal = action.payload
        },
        loadInitial: (state, action) => {
            state.initial = action.payload
        },
    }
})

export const { logoutState, loadauthentication, friendauthentication, fcmToken, modalState, loadInitial } = authenticateSlice.actions

export const loginReducer = (data) => {

    return async (dispatch) => {

        try {
            console.log("data =>", data)
            dispatch(loadauthentication(data))
        } catch (err) {

        }
    }
}
export const tokenReducer = (data) => {

    return async (dispatch) => {

        try {
            dispatch(fcmToken(data))
        } catch (err) {

        }
    }
}
export const loginFriendReducer = (data) => {

    return async (dispatch) => {

        try {
            dispatch(friendauthentication(data))
        } catch (err) {

        }
    }
}
export const modalReducer = (data) => {

    return async (dispatch) => {

        try {
            dispatch(modalState(data))
        } catch (err) {

        }
    }
}
export const InitialReducer = (data) => {

    return async (dispatch) => {

        try {
            dispatch(loadInitial(data))
        } catch (err) {

        }
    }
}

export const logout = () => {
    return async (dispatch) => {
        dispatch(logoutState())
        try {

        } catch (err) {
            console.log(err)
        }
    }
}
export default authenticateSlice.reducer