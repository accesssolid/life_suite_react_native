import { createSlice } from '@reduxjs/toolkit'

const serviceSlice = createSlice({
    name: "services",
    initialState: {
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
                // "time_frame": [
                //     // {
                //     //     "date": "2021-07-16",
                //     //     "from_time": "10:05",
                //     //     "to_time": "23:00"
                //     // }
                // ],
                // "travel_distance": [
                //     // {
                //     //     "travel_distance": "2800",
                //     //     "address_text": "C-7 Pannu Tower",
                //     //     "lat": "30.00",
                //     //     "long": "70.76"
                //     // }
                // ]
            },
            "license file": null
        },
        isAddServiceMode: false
    },
    reducers: {
        setAddServiceData: (state, action) => {
            state.addServiceData = action.payload.data
        },
        setAddServiceMode: (state, action) => {
            state.isAddServiceMode = action.payload.data
        },
    }
})

export const { setAddServiceData, setAddServiceMode } = serviceSlice.actions

// export const tokenReducer = (data) => {
//     return async (dispatch) => {
//         try {
//             // dispatch(fcmToken(data))
//         } catch (err) {

//         }
//     }
// }

export default serviceSlice.reducer