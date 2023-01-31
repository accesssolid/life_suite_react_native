import { createSlice } from "@reduxjs/toolkit";
import { getApi } from "../../api/api";

const initialState = {
    name: "questionaireModel",
    list: [{ title: "Are you certified to perform this service?", type: "is_certified" }, { title: "Do you have business license for this service?", type: "is_business_licensed" }, { title: "Do you have insurance for this service?", type: "is_insauranced" }],
    types: {
        is_certified: 0,
        is_insauranced: 0,
        is_business_licensed: 0
    },
    selectedValue: {
        is_certified: 0,
        is_insauranced: 0,
        is_business_licensed: 0
    },
    service_id: null,
    open: false
}
const questionSlice = createSlice({
    name: "questions",
    initialState: initialState,
    reducers: {
        setQOpen: (state, action) => {
            state.open = action.payload
        },
        setQuestionTypes: (state, action) => {
            state.types = action.payload
        },
        setSelectedValue: (state, action) => {
            state.selectedValue = action.payload
        },
        setQService: (state, action) => {
            state.service_id = action.payload
        },
        clearQuestionTypes: (state, action) => {
            return initialState
        },

        setOpenQuestionaire: (state, action) => {
            state.open = action.payload
        }
    }
})

export const { setQuestionTypes, setOpenQuestionaire, clearQuestionTypes, setSelectedValue, setQService, setQOpen } = questionSlice.actions



export const addUpdateQuestionaire = () => async (dispatch, getState) => {
    try {
        const access_token = getState().authenticate.access_token
        const questionaireModel = getState().questionaireModel
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let config = {
            headers: headers,
            data: JSON.stringify({service_id:questionaireModel.service_id,...questionaireModel?.selectedValue}),
            endPoint: "/api/addUpdateQuestionnaire",
            type: 'post'
        }
        if(questionaireModel?.service_id){
            getApi(config)
            .then((response) => {
                if (response.status == true) {
                    dispatch(clearQuestionTypes())
                } else {
                   dispatch(clearQuestionTypes())
                }
            }).catch(err => {

            }).finally(() => {

            })
        }
        

    } catch (Err) {
        console.log(Err)
    } finally {

    }
}

export default questionSlice.reducer