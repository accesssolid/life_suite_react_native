import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Dimensions } from 'react-native'
import Modal from 'react-native-modal';
import { getInfoDescription } from '../utils';
import LS_COLORS from "../../../constants/colors";
import LS_FONTS from "../../../constants/fonts";
import { useDispatch, useSelector } from 'react-redux';
import { getApi } from '../../../api/api';
import { setAddServiceData } from '../../../redux/features/services';

import { WebView} from "react-native-webview"
import Header from '../../../components/header';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../../components/customButton';

const {width,height}=Dimensions.get('window')

const CustomWebView = (props) => {
    const [data, setData] = useState("")
    const {type,userType,title,onAccept,notAccept}=props.route.params


    useEffect(() => {
        if(type=="privacy"){
            getPrivacy()
        }else if(type=="terms"){
            getTerms()
        }
    }, [])

 


    const getPrivacy = () => {
        let headers = {
        }
        let formdata= new FormData()
        if(userType){
            formdata.append("type",userType)
        }else{
            formdata.append("type","customer")
        }
        let config = {
            headers: headers,
            endPoint: '/api/privacyPolicy',
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
    const getTerms = () => {
        let headers = {
        }
        let formdata= new FormData()
       
        if(userType){
            formdata.append("type",userType)
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
        <SafeAreaView style={{flex:1,backgroundColor:"white"}}>
            <View style={styles.container}>
                <Text maxFontSizeMultiplier={1.7} style={styles.title}>{title}</Text>
                <WebView
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1 }}
                    source={{
                        html: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
                            <HTML>
                            <HEAD></HEAD>                            
                            <BODY style="font-size:25px">
                            ${data}
                            </BODY>
                            </HTML>`
                    }}
                />
            </View>
            <View style={{flexDirection:"row",justifyContent:"space-evenly"}}>
                    <CustomButton action={()=>{
                        onAccept()
                        props.navigation.goBack()
                    }} title="I accept" customStyles={{marginBottom:0,borderRadius:5,width:width*0.45}} />
                    <CustomButton 
                    action={()=>{
                        notAccept()
                        props.navigation.goBack()
                    }}
                    title="I don't accept" customStyles={{marginBottom:0,borderRadius:5,width:width*0.45}} />
                </View> 
        </SafeAreaView>
    )
}

export default CustomWebView;

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    container: {
        width: '100%',
        alignSelf: 'center',
        paddingVertical: '4%',
        backgroundColor: LS_COLORS.global.white,
        borderRadius: 10,
        paddingHorizontal: 10,
        overflow: 'hidden',
        // height: '90%'
        flex:1,
    },
    title: {
        fontFamily: LS_FONTS.PoppinsBold,
        fontSize: 16,
        letterSpacing: 0.32,
        color: LS_COLORS.global.darkBlack,
        textTransform: 'uppercase',
        textAlign:"center"
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