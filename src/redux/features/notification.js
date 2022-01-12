import { createSlice } from "@reduxjs/toolkit";
import { getApi } from "../../api/api";
import { role } from "../../constants/globals";

const initialState={
    data:[]
}

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotifications: (state, action) => {
            state.data = action.payload.data
        },
        clearNotificationData:(state,action)=>{
            return initialState
        }
    }

})

export const { setNotifications ,clearNotificationData} = notificationSlice.actions

export const loadNotificaitonsThunk = () => async (dispatch,getState) => {
    try {
        const access_token=getState().authenticate.access_token
        const user=getState().authenticate.user
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let config = {
            headers: headers,
            data: JSON.stringify({ notification_type: "all" }),
            endPoint: user.user_role == role.provider ? '/api/providerNotificationList' : "/api/customerNotificationList",
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    dispatch(setNotifications({data:response.data}))
                }else{
                    dispatch(setNotifications({data:[]}))
                }
            }).catch(err => {
                dispatch(setNotifications({data:[]}))
            }).finally(() => {

                // dispatch(setNotifications({data:[]}))
            })

    } catch (Err) {
        console.log(Err)
    } finally {

    }
}

export default notificationSlice.reducer
