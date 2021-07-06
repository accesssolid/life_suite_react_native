import React from 'react'
import { showToast } from '../components/validators'
// import RNFetchBlob from 'rn-fetch-blob'
export const BASE_URL = "http://122.160.70.200/projects/php/lifeSuite/public"
// export const imagebaseurl = 'http://122.160.70.200:5004/api/v1/images/'

export const getApi = (config)=>{
  
    return new Promise((resolve,reject)=>{
        return fetch(BASE_URL+config.endPoint,{
           body:config.data,
            headers:config.headers,
            method:config.type
        }).then(async(response)=>{
         
            let json = await response.json()
       
            resolve(json);  
        }) .catch((error) => {
            console.log('err',error.message)
            
          
        });
    })
}

// export const imageApi = (config)=>{
 
   
//     return new Promise((resolve,reject)=>{
//         return RNFetchBlob.fetch('POST', BASE_URL + config.endPoint, {
//             'Authorization': 'Bearer '+config.headers,
//             'Content-Type': 'multipart/form-data',
//           },
//             config.params
//           ).then(async(response)=>{
          
//             let json = await JSON.parse(response.data)
       
//             resolve(json);  
//         }) .catch((error) => {
//             console.log('err',error.message)
            
          
//         });
//     })

// }
