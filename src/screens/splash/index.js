import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native'

/* Constants */
import LS_COLORS from '../../constants/colors';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';

/* Methods */
import { getJsonData } from '../../asyncStorage/async';
import { retrieveItem, showToast } from '../../components/validators';
import { loginReducer } from '../../redux/features/loginReducer';
import { getApi } from '../../api/api';

const Splash = (props) => {
    const dispatch = useDispatch()
    const isAuthorized = useSelector(state => state.authenticate.isAuthorized)

    useEffect(() => {
        checkAuth()
    }, [])

    const getUser = (id) => {
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
        let user_data = {
            "user_id": id,
        }
        let config = {
            headers: headers,
            data: JSON.stringify(user_data),
            endPoint: '/api/customer_detail',
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
            console.log("Dataaaa =>> ", data)
            if (data) {
                getUser(data.id)
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
