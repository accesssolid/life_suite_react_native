import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ImageBackground, StatusBar, Platform, Image, TouchableOpacity, ScrollView } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import { globalStyles } from '../../../utils';
import LS_FONTS from '../../../constants/fonts';
import CustomDropDown from '../../../components/dropDown';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import { CheckBox } from 'react-native-elements'
import ImagePicker from 'react-native-image-crop-picker';

/* Components */;
import Header from '../../../components/header';
import { Container, Content, Row, } from 'native-base'
import { TextInput } from 'react-native-gesture-handler';
import { BASE_URL, getApi } from '../../../api/api';
import CustomButton from '../../../components/customButton';
import Loader from '../../../components/loader';
import { showToast } from '../../../components/validators';
import { setMyJobs } from '../../../redux/features/provider';
import { setAddServiceMode } from '../../../redux/features/services';
import { Alert } from 'react-native';

const AddLicense = (props) => {
    const dispatch = useDispatch()
    const { subService } = props.route.params
    const user = useSelector(state => state.authenticate.user)
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState(require('../../../assets/camera.png'))
    const isAddServiceMode = useSelector(state => state.services.isAddServiceMode)
    const addServiceData = useSelector(state => state.services.addServiceData)
    const access_token = useSelector(state => state.authenticate.access_token)

    const pickImage = () => {
        Alert.alert(
            "LifeSuite",
            "Pick image from...",
            [
                {
                    text: "Camera",
                    onPress: () => {
                        ImagePicker.openCamera({
                            width: 400,
                            height: 400,
                            cropping: true
                        }).then(image => {
                            setImage({
                                uri: image.path,
                                name: image.filename ? image.filename : image.path.split("/").pop(),
                                type: image.mime,
                            })
                        })
                    },
                },
                {
                    text: "Gallery", onPress: () => {
                        ImagePicker.openPicker({
                            width: 400,
                            height: 400,
                            cropping: true
                        }).then(image => {
                            setImage({
                                uri: image.path,
                                name: image.filename ? image.filename : image.path.split("/").pop(),
                                type: image.mime,
                            })
                        }).catch(err => {
                            console.log("Image picker error : ", err)
                        })
                    }
                }
            ]
        );
    }

    const next = () => {
        if (isAddServiceMode) {
            saveNewService()
        } else {

        }
    }

    const saveNewService = () => {
        if (image !== require('../../../assets/camera.png')) {
            setLoading(true)
            let headers = {
                'Content-Type': 'multipart/form-data',
                "Authorization": `Bearer ${access_token}`
            }

            var formdata = new FormData();
            formdata.append("user_id", user.id);
            formdata.append("service_id", addServiceData.service_id);
            formdata.append("json_data", JSON.stringify(addServiceData.json_data));
            formdata.append('license file', {
                uri: Platform.OS == "ios" ? image.uri.replace('file:///', '') : image.uri,
                name: image.name,
                type: image.type,
            });

            let config = {
                headers: headers,
                data: formdata,
                endPoint: '/api/providerServicesAdd',
                type: 'post'
            }

            getApi(config)
                .then((response) => {
                    if (response.status == true) {
                        setLoading(false)
                        showToast(response.message, 'success')
                        getMyJobs()
                    }
                    else {
                        setLoading(false)
                        showToast(response.message, 'danger')
                    }
                })
                .catch(err => {
                    setLoading(false)
                    console.log("error =>", err)
                })
        } else {
            setLoading(false)
            showToast("Please select certificate of licence image")
        }
    }

    const getMyJobs = () => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json"
        }

        let user_data = {
            "user_id": user.id
        }

        let config = {
            headers: headers,
            data: JSON.stringify({ ...user_data }),
            endPoint: '/api/providerServicesList',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    dispatch(setMyJobs({ data: [...response.data] }))
                    dispatch(setAddServiceMode({ data: false }))
                    setLoading(false)
                    props.navigation.navigate('HomeScreen')
                }
                else {
                    setLoading(false)
                    props.navigation.navigate('HomeScreen')
                }
            }).catch(err => {
                setLoading(false)
            })
    }

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <View style={{ width: '100%', height: '30%' }}>
                <ImageBackground
                    resizeMode="stretch"
                    source={{ uri: BASE_URL + subService.image }}
                    style={styles.image}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
                            <View style={{ height: "22%", justifyContent: 'flex-end', marginTop: StatusBar.currentHeight + 20 }}>
                                <Header
                                    imageUrl={require("../../../assets/backWhite.png")}
                                    action={() => {
                                        props.navigation.pop()
                                    }}
                                    imageUrl1={require("../../../assets/homeWhite.png")}
                                    action1={() => {
                                        props.navigation.navigate("HomeScreen")
                                    }}
                                />
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: "center", height: "33%" }}>
                                <Text style={{ fontSize: 29, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.white }}>{subService.name}</Text>
                            </View>
                        </SafeAreaView>
                    </View>
                </ImageBackground>
            </View>
            <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
                <Container>
                    <Content contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                        <Text style={styles.service}>Load your Certificate or License</Text>
                        <View style={{ width: '50%', aspectRatio: 1, borderWidth: 2, borderColor: LS_COLORS.global.divider, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ height: image == require('../../../assets/camera.png') ? 33 : '100%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Image style={{ height: '100%', width: '100%' }} resizeMode="contain" source={image} />
                            </View>
                        </View>
                        <View style={{ flex: 1 }} />
                        <View style={{ paddingBottom: '15%' }}>
                            <CustomButton
                                title={"Take Picture"}
                                customStyles={{ width: '50%', borderRadius: 6, backgroundColor: LS_COLORS.global.white, borderWidth: 1, borderColor: LS_COLORS.global.green }}
                                customTextStyles={{ color: LS_COLORS.global.green }}
                                action={() => pickImage()}
                            />
                        </View>
                        <View style={{ paddingBottom: '2.5%' }}>
                            <CustomButton
                                title={"Save"}
                                customStyles={{ width: '50%', borderRadius: 6 }}
                                action={() => next()}
                            />
                        </View>
                    </Content>
                </Container>
                {loading && <Loader />}
            </SafeAreaView >
        </>
    )
}

export default AddLicense;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: LS_COLORS.global.cyan,
    },
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
    },
    image: {
        resizeMode: 'contain',
        width: '100%',
        height: '100%',
    },
    mechanic: {
        fontSize: 29,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    },
    price: {
        width: '100%',
        alignSelf: 'center',
        height: 40,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    priceTime: {
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: "black",
        marginRight: '13%'
    },
    service: {
        fontSize: 14,
        fontFamily: LS_FONTS.PoppinsRegular,
        color: "black",
        alignSelf: 'center',
        paddingVertical: '3%',
        marginTop: '10%'
    },
    save: {
        justifyContent: "center",
        alignItems: 'center',
        height: 45,
        width: 174,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 6,
        alignSelf: 'center',
        marginTop: 40
    },
    saveText: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    },
    fromContainer: {
        height: 32,
        width: 75,
        alignItems: 'center',
        borderColor: LS_COLORS.global.lightTextColor,
        justifyContent: "center",
        backgroundColor: '#ECECEC',
        paddingHorizontal: 5,
        marginRight: '10%'
    },
    inputStyle: {
    },
})