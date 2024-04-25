import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeStringData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (e) {
        // saving error
    }
}

// export const storeJsonData = async (key, value) => {
//     console.log(key,value,"kkkkk==>>");
//     try {
//         const jsonValue = JSON.stringify(value)
//         await AsyncStorage.setItem(key, jsonValue)
//         console.log(jsonValue,"jsonValue");
//     } catch (e) {
//         // saving error
//     }
// }

export const storeJsonData = async (key, value) => {
    console.log(key, value, "kkkkk==>>");
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
        console.log(jsonValue, "jsonValue");
        return true; // Return true upon successful storage
    } catch (error) {
        console.error("Error storing data:", error);
        return false; // Return false if storing data fails
    }
};


export const getStringData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key)
        if (value !== null) {
            return value
        }
    } catch (e) {
        // error reading value
    }
}

export const getJsonData = async (key) => {
    console.log(key,"key");
    try {
        const jsonValue = await AsyncStorage.getItem(key)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        // error reading value
    }
}