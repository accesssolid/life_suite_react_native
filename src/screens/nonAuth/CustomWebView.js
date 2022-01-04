import { Container, Form } from 'native-base'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { WebView } from 'react-native-webview';
import { getApi } from '../../api/api';
import Loader from '../../components/loader';
import { showToast } from '../../utils';
import { useSelector } from 'react-redux';
const CustomWebView = ({ navigation, route }) => {
    const { uri, change, connect_account_id } = route.params
    console.log(change)
    const [loader, setLoader] = React.useState(false)
    const access_token = useSelector(state => state.authenticate.access_token)

    const replaceAccount = async () => {
        try {
            try {
                let headers = {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": `Bearer ${access_token}`
                }
                const formdata = new FormData()
                formdata.append("connect_account_id", connect_account_id)
                let config = {
                    headers: headers,
                    data: formdata,
                    endPoint: '/api/updateConnectNewConnectAccount',
                    type: 'post'
                }
                let response = await getApi(config)
                if (response.status) {
                    navigation.goBack()
                }
                else {
                    showToast(response.message, 'danger')
                    navigation.goBack()
                }

            } catch (err) {
                navigation.goBack()
            }
        } catch (Err) {

        } finally {
            setLoader(false)
        }
    }

    const getNewAccountDetails = async () => {
        try {
            setLoader(true)
            console.log("Account detail", connect_account_id)
            let headers = {
                'Content-Type': 'multipart/form-data',
                "Authorization": `Bearer ${access_token}`
            }
            const formdata = new FormData()
            formdata.append("connect_account_id", connect_account_id)
            let config = {
                headers: headers,
                data: formdata,
                endPoint: '/api/connectAccountDetail',
                type: 'post'
            }
            let response = await getApi(config)
            if (response.status) {
                if (response.data) {
                    if (response.data.email && response.data.details_submitted) {
                        replaceAccount()
                    } else {
                        showToast("You haven't submitted all information.", 'danger')
                        setLoader(false)
                        navigation.goBack()
                    }
                } else {
                    setLoader(false)
                    navigation.goBack()
                }
            }
            else {
                showToast(response.message, 'danger')
                setLoader(false)
                navigation.goBack()
            }

        } catch (err) {
            console.log(err)
            navigation.goBack()
        }
    }


    return (
        <Container>
            <WebView
                onLoadStart={(e) => {
                    setLoader(true)
                }}
                onLoadEnd={e => {
                    setLoader(false)
                }}
                source={{ uri: uri }}
                source={{ uri: uri }}
                onShouldStartLoadWithRequest={e => {
                    setLoader(false)
                    if (e.url.includes("return") || e.url.includes("refresh")) {
                        setLoader(false)
                        if (change) {
                            getNewAccountDetails()
                        } else {
                            navigation.pop()
                        }
                        return false
                    }
                    return true
                }}
                style={{
                    flex: 1
                }}
            />
            {loader && <Loader />}
        </Container>
    )
}

export default CustomWebView

