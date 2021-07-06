import { Toast } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LS_FONTS from '../constants/fonts';

export const showToast = async (text,type) =>{
    if(!type)
    {
        Toast.show({
            text: text,        
            duration: 4000,
            position: "bottom",
            textStyle:{textAlign:'center',fontSize:16,fontFamily:LS_FONTS.PoppinsRegular},
            style:{bottom:15,width:'90%',alignSelf:'center',borderRadius:20}
          })
        return false;
    }
    Toast.show({
        text: text,
        type:type,
        duration: 4000,
        position: "bottom",
        textStyle:{textAlign:'center',fontSize:16,fontFamily:LS_FONTS.PoppinsRegular},
        style:{bottom:15,width:'90%',alignSelf:'center',borderRadius:20}
      })
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

