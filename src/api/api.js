export const baseUrl = ""
export const mediaBaseUrl = ""

export const api = async (config) => {
    if (config.method == "GET") {
        return new Promise(function (resolve, reject) {
            fetch(baseUrl + config.endpoint,
                {
                    method: config.method,
                    headers: config.headers,
                })
                // .then((response) => console.log("Full Response =>", response))
                .then((response) => response.json())
                .then(async (res) => {
                    console.log("Response => ", ` *${config.endpoint}* `, res)
                    resolve(res);
                })
                .catch((error) => {
                    console.error("Error => ", ` *${config.endpoint}* `, error);
                    reject(error)
                });
        });
    } else {
        return new Promise(function (resolve, reject) {
            fetch(baseUrl + config.endpoint,
                {
                    method: config.method,
                    headers: config.headers,
                    body: JSON.stringify(config.data)
                })
                // .then((response) => console.log("Full Response =>", response))
                .then((response) => response.json())
                .then(async (res) => {
                    console.log("Response => ", ` *${config.endpoint}* `, res)
                    resolve(res);
                })
                .catch((error) => {
                    console.error("Error => ", ` *${config.endpoint}* `, error);
                    reject(error)
                });
        });
    }
}