import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Platform } from 'react-native'
import Modal from 'react-native-modal';
import LS_COLORS from "../constants/colors";
import LS_FONTS from "../constants/fonts";
import { useDispatch, useSelector } from 'react-redux';
import { getApi } from '../api/api';
import { WebView } from "react-native-webview"
import { role } from '../constants/globals';
import { widthPercentageToDP } from 'react-native-responsive-screen';

const TermsModal = (props) => {
    const dispatch = useDispatch()
    const access_token = useSelector(state => state.authenticate.access_token)
    const [data, setData] = useState("")
    const user = useSelector(state => state.authenticate?.user)

    useEffect(() => {
        getTerms()
    }, [props])
    const getTerms = () => {
        let headers = {
            // Accept: "application/json",
            // "Content-Type": "application/json",
            // "Authorization": `Bearer ${access_token}`
        }
        let formdata= new FormData()
       
        if(user?.user_role==role.provider){
            formdata.append("type","provider")
        }else{
            formdata.append("type","customer")
        }
        let config = {
            headers: headers,
            endPoint: '/api/termsCondition',
            data:formdata,
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    setData([response.data.text_data])
                }
                else {
                }
            }).catch(err => {
                console.log(err)
            })
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
             
                <Text maxFontSizeMultiplier={1.5} style={styles.title}>TERMS & CONDITIONS</Text>
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

export default TermsModal;

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