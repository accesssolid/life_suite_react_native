import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal';
import { getInfoDescription } from '../utils';
import LS_COLORS from "../constants/colors";
import LS_FONTS from "../constants/fonts";
import { useDispatch, useSelector } from 'react-redux';
import { getApi } from '../api/api';
import { setAddServiceData } from '../redux/features/services';
import { ScrollView } from 'react-native-gesture-handler';
import { WebView } from "react-native-webview"

const SoftwareModal = (props) => {
    const dispatch = useDispatch()
    const access_token = useSelector(state => state.authenticate.access_token)
    const [data, setData] = useState("")

    useEffect(() => {
        getSoftware()
    }, [])

    // var regex = /(<([^>]+)>)/ig
    // const rename = data.replace(regex, "");
    // console.log(rename)


    const getSoftware = () => {
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }

        let config = {
            headers: headers,
            endPoint: '/api/softwareLicense',
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
            onBackButtonPress={() => props.setVisible(false)}
            onBackdropPress={() => props.setVisible(false)}
            hasBackdrop={true}
            isVisible={props.isVisible}>
            <View style={styles.container}>
               
                <Text style={styles.title}>SOFTWARE LICENSE</Text>
                <WebView
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1}}
                    source={{
                        html: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
                            <HTML>
                            <HEAD></HEAD>                            
                            <BODY style="font-size:30px">
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

export default SoftwareModal;

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    container: {
     width: '90%',
        alignSelf: 'center',
        padding: '4%',
        backgroundColor: LS_COLORS.global.white,
        borderRadius: 10,
        paddingVertical: 10,
        overflow: 'hidden',
        height: '75%'
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