import { createSlice } from '@reduxjs/toolkit'

const initialState={
    addServiceData: {
        "user_id": null,
        "service_id": null,
        "json_data": {
            "services": [
                // {
                //     "item_id": null,
                //     "price": null,
                //     "time_duration": null
                // },
            ],
            "time_frame": [
                // {
                //     "date": "2021-07-16",
                //     "from_time": "10:05",
                //     "to_time": "23:00"
                // }
            ],
            "travel_distance": {
                // "travel_distance": "2800",
                // "address_text": "C-7 Pannu Tower",
                // "lat": "30.00",
                // "long": "70.76"
            },
            "products": [
                // {
                //     "item_product_id": "3",
                //     "price": 210
                // },
                // {
                //     "item_product_id": "4",
                //     "price": 100
                // }
            ],
            "new_products": []
        },
        "license file": null,
        images: [],
        certificates:[]
    },
    isAddServiceMode: false
}

const serviceSlice = createSlice({
    name: "services",
    initialState:initialState,
    reducers: {
        setAddServiceData: (state, action) => {
            state.addServiceData = action.payload.data
        },
        setAddServiceMode: (state, action) => {
            state.isAddServiceMode = action.payload.data
        },
        clearCleanData:(state,action)=>{
            return initialState
        }
    }
})

export const { setAddServiceData, setAddServiceMode,clearCleanData } = serviceSlice.actions

// export const tokenReducer = (data) => {
//     return async (dispatch) => {
//         try {
//             // dispatch(fcmToken(data))
//         } catch (err) {

//         }
//     }
// }

export default serviceSlice.reducer