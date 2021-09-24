// import { Toast } from 'native-base';
import { ToastAndroid, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

export const showToast = async (text, type) => {
    if (Platform.OS == "ios") {
        Toast.showWithGravity(text, Toast.SHORT, Toast.BOTTOM);
    } else {
        ToastAndroid.show(text, ToastAndroid.LONG);
    }
}

/**
* store data in async storage
* 
*/
export const storeItem = async (key, item) => {
    return new Promise(async (resolve, reject) => {
        try {
            //we want to wait for the Promise returned by AsyncStorage.setItem()
            //to be resolved to the actual value before returning the value
            var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
            resolve(jsonOfItem);
        } catch (error) {
            reject(error);
        }
    })

}

/**
 * reterive data from async storage
 * 
 */

export const retrieveItem = async (key) => {
    return new Promise(async (resolve, reject) => {
        try {
            const retrievedItem = await AsyncStorage.getItem(key);
            const item = JSON.parse(retrievedItem);
            resolve(item);
        } catch (error) {
            reject(error.message);
        }
    })
}

export const removeItem = async (key) => {
    return new Promise(async (resolve, reject) => {
        try {
            await AsyncStorage.removeItem(key);
            resolve('removed');
        } catch (error) {
            reject(error.message);
        }
    })
}

// Set time out function
export const sleep = async (milliseconds) => {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds)
    });
}

