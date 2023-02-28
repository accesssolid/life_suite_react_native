import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Platform } from 'react-native'
import Modal from 'react-native-modal';
import { getInfoDescription } from '../utils';
import LS_COLORS from "../constants/colors";
import LS_FONTS from "../constants/fonts";
import { useDispatch, useSelector } from 'react-redux';
import { getApi } from '../api/api';
import { setAddServiceData } from '../redux/features/services';
import { ScrollView } from 'react-native-gesture-handler';
import { WebView } from "react-native-webview"
import { role } from '../constants/globals';
import { widthPercentageToDP } from 'react-native-responsive-screen';

const CDCModal = (props) => {
    const dispatch = useDispatch()
    const access_token = useSelector(state => state.authenticate.access_token)
    const [data, setData] = useState("")
    const user = useSelector(state => state.authenticate?.user)

    useEffect(() => {
        getData()
    }, [props])
    
    const getData= async () => {
        try {

            let headers = {
                "Content-Type": "application/json"
            }

            let config = {
                headers: headers,
                data: JSON.stringify({}),
                endPoint: '/api/cdd',
                type: 'post'
            }
            let res = await getApi(config)
    
            if (res.status) {
                if(res.data?.text_data){
                    setData(res.data?.text_data)
                }else{
                    setData("Dont't provide or receive any services if you have COVID-19 or have any related symptoms.")

                }
                
            }
        } catch (err) {

        }
    }

    return (
        <Modal
            backdropOpacity={.5}
            backdropColor="rgba(0,0,0,0.5)"
            onBackButtonPress={() => props.setVisible(false)}
            onBackdropPress={() => props.setVisible(false)}
            hasBackdrop={true}
            isVisible={props.isVisible}>
            <View style={styles.container}>
             
                <Text maxFontSizeMultiplier={1.5} style={styles.title}>CDC Guidelines</Text>
                <WebView
                    showsVerticalScrollIndicator={false}
                    style={{flex:1}}
                    source={{
                        html: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
                            <HTML>
                            <HEAD></HEAD>                            
                            <BODY style="font-size:${Platform.isPad?"20px":"4.5vw"}">
                            ${data}
                            </BODY>
                            </HTML>`
                    }}
                />
                   <TouchableOpacity style={{ backgroundColor: "blue" }} activeOpacity={0.7} onPress={() => props.setVisible(false)} style={{ height: 25, aspectRatio: 1, position: 'absolute', top: '1%', right: '3%' }}>
                    <Image source={require('../assets/cancel.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

export default CDCModal;

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        height: '100%',
        width: '100%',
    },
    container: {
        // height: '50%',
        alignSelf: 'center',
        padding: '4%',
        backgroundColor: LS_COLORS.global.white,
        borderRadius: 10,
        paddingVertical: 10,
        height: '60%',
        width:"90%"
    },
    title: {
        fontFamily: LS_FONTS.PoppinsBold,
        fontSize:Platform?.isPad?26: widthPercentageToDP(3.7),
        letterSpacing: 0.32,
        color: LS_COLORS.global.darkBlack,
        textTransform: 'uppercase',
        alignSelf:"center"
    },
    desc: {
        marginTop: 25,
        fontFamily: LS_FONTS.PoppinsRegular,
        fontSize: 12,
        letterSpacing: 0.24,
        color: LS_COLORS.global.textInputText,
        textAlign: 'left'
    }
})