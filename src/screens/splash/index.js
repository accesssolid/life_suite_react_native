import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native'

/* Constants */
import LS_COLORS from '../../constants/colors';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

/* Methods */
import { getJsonData } from '../../asyncStorage/async';
import { retrieveItem, showToast } from '../../components/validators';
import { loginReducer, setAuthToken } from '../../redux/features/loginReducer';
import { getApi } from '../../api/api';

const Splash = (props) => {
    const dispatch = useDispatch()
    const access_token = useSelector(state => state.authenticate.access_token)
    const user = useSelector(state => state.authenticate.user)

    useEffect(() => {
        checkAuth()
    }, [])

    useEffect(() => {
        if (access_token !== null) {
            getUser(user.id)
        }
    }, [access_token])

    const getUser = (id) => {
        console.log("user =>", user)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let user_data = {
            "user_id": id,
        }
        let config = {
            headers: headers,
            data: JSON.stringify(user_data),
            endPoint: user.user_role == 2 ? '/api/customer_detail' : '/api/provider_detail',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    dispatch(loginReducer(response.data))
                    setTimeout(() => {
                        if (response.data.user_role == 2) {
                            props.navigation.navigate("UserStack")
                        } else {
                            props.navigation.navigate("ProviderStack")
                        }
                    }, 2000);
                }
                else {
                    showToast(response.message, 'danger')
                    setLoader(false)
                }
            })
            .catch(err => {

            })
    }

    const checkAuth = () => {
        retrieveItem('user').then((data) => {
            if (data) {
                dispatch(loginReducer(data))
                retrieveItem('access_token').then(res => {
                    dispatch(setAuthToken({ data: res }))
                })
            }
            else {
                setTimeout(() => {
                    props.navigation.navigate('WelcomeScreen')
                }, 2000);
            }
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image resizeMode="contain" style={styles.image} source={require('../../assets/splash/logo.png')} />
            </View>
        </View>
    )
}

export default Splash;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: LS_COLORS.global.white
    },
    logoContainer: {
        width: '80%',
        height: '20%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: '100%',
        height: '100%'
    }
})
