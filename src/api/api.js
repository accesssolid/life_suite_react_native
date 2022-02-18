
// export const BASE_URL = "http://122.160.70.200/projects/php/lifeSuite/public"
export const BASE_URL = "http://18.224.113.59/lifeSuite/public"

// export const BASE_URL = "http://18.224.113.59/lifeSuiteDev/public"


export const getApi = (config) => {
    // console.log("Request Data =>", '/*', config.endPoint, '*/', "==>", config)
    return new Promise((resolve, reject) => {
        return fetch(BASE_URL + config.endPoint, {
            body: config.data,
            headers: config.headers,
            method: config.type
        }).then(async (response) => {
            // console.log("Response",await response.text())
            let json = await response.json()
            // console.log("Response Data =>", '/*', config.endPoint, '*/', "==>", JSON.stringify(json))
            resolve(json);
        }).catch((error) => {
            // console.log("API error =>", '/*', config.endPoint, '*/', "==>", error)
            reject(error)
        });
    })
}
