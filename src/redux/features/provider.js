import { createSlice } from '@reduxjs/toolkit'
import { getApi } from '../../api/api'
const initialState={
    myJobs: []
}
const providerSlice = createSlice({
    name: "provider",
    initialState: initialState,
    reducers: {
        setMyJobs: (state, action) => {
            state.myJobs = action.payload.data
        },
        clearMyJobs:(state,action)=>{
            return initialState
        }
    }
})

export const { setMyJobs ,clearMyJobs} = providerSlice.actions

export const getMyJobsThunk = (user_id,access_token) => {
    return (dispatch)=>{
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let user_data = {
            "user_id": user_id
        }
        let config = {
            headers: headers,
            data: JSON.stringify({ ...user_data }),
            endPoint: '/api/providerAddedServicesList',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                if (response.status) {
                    dispatch(setMyJobs({ data: [...response.data] }))
                }
                else {
                    dispatch(setMyJobs({ data: [] }))
                }
            }).catch(err => {
                
            })
    }
   
}

export default providerSlice.reducer