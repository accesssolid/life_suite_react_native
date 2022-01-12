
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    StatusBar,
    Text,
    View,
    TextInput,
    BackHandler,
    ImageBackground,
    Dimensions,
} from 'react-native';
import { Container, Content } from 'native-base'
import { SafeAreaView } from 'react-native-safe-area-context';
import { getJsonData, storeJsonData } from '../../../asyncStorage/async'
import { retrieveItem, showToast } from '../../../components/validators';
import CustomButton from '../../../components/customButton';
import LS_COLORS from '../../../constants/colors';
import { useDispatch, useSelector } from 'react-redux';
// import loginReducer, { setAuthToken } from '../../../redux/features/loginReducer';
import { loginReducer, setAuthToken } from '../../../redux/features/loginReducer';
import { getApi } from '../../../api/api';
import Loader from '../../../components/loader';

const Passcode = (props) => {
    const dispatch = useDispatch()
    const [Passcode, setPasscode] = useState('')
    const access_token = useSelector(state => state.authenticate.access_token)
    const user = useSelector(state => state.authenticate.user)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const backAction = () => {
            Alert.alert("Hold on!", "Are you sure you want to exit app?", [
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel"
                },
                { text: "YES", onPress: () => BackHandler.exitApp() }
            ]);
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        if (access_token !== null) {
            getUser(user.id)
        }
    }, [access_token])

    const confirmPassCode = async () => {
        const pass = await getJsonData("passcode")
        if (pass == Passcode) {
            checkAuth()
        }
        else {
            Alert.alert('Wrong passcode')
        }
    }

    const getUser = (id) => {
        setLoading(true)
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
                    if (response.data.user_role == 2) {
                        props.navigation.navigate("MainDrawer")
                    } else {
                        props.navigation.navigate("MainDrawer")
                    }
                    setLoading(false)
                }
                else {
                    if (response.message !== "The user id field is required.") {
                        showToast(response.message, 'danger')
                    }
                    setLoading(false)
                }
            })
            .catch(err => {
                setLoading(false)
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
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <View style={{ width: Dimensions.get('screen').width, height: 100, marginBottom: 10 }}>
                            <Image
                                source={require('../../../assets/splash/logo.png')}
                                style={{ height: '100%', width: '100%' }}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={{ width: '80%', alignSelf: 'center', marginVertical: 5, textAlign: 'center' }}>Enter Passcode</Text>
                        <View style={{ backgroundColor: LS_COLORS.global.lightGrey, width: Dimensions.get('screen').width - 200, height: 50, alignSelf: 'center', marginTop: 20 }}>
                            <TextInput
                                secureTextEntry={true}
                                style={{ flex: 1, paddingHorizontal: 10, textAlign: 'center', }}
                                keyboardType={'number-pad'}
                                returnKeyType={'default'}
                                enablesReturnKeyAutomatically={true}
                                value={Passcode}
                                placeholder={'Enter Passcode'}
                                onChangeText={(i) => setPasscode(i)}
                                placeholderTextColor={LS_COLORS.global.black}
                                autoFocus={true}
                            />
                        </View>
                        <View style={{ height: 30 }} />
                        <CustomButton action={() => confirmPassCode()} title={'CONFIRM'} customStyles={{ width: '60%' }} />
                    </View>
                </View>
                {loading && <Loader />}
            </SafeAreaView>
        </>
    );
};


export default Passcode;
