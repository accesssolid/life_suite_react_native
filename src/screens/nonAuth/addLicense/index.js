import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ImageBackground, StatusBar, Platform, Image, TouchableOpacity } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';

/* Components */;
import Header from '../../../components/header';
import { Container, Content, Row, } from 'native-base'
import { BASE_URL, getApi } from '../../../api/api';
import CustomButton from '../../../components/customButton';
import Loader from '../../../components/loader';
import { showToast } from '../../../components/validators';
import { setMyJobs } from '../../../redux/features/provider';
import { setAddServiceData, setAddServiceMode } from '../../../redux/features/services';
import { Alert } from 'react-native';
import { Dimensions } from 'react-native';

const AddLicense = (props) => {
    const dispatch = useDispatch()
    const { subService } = props.route.params
    const user = useSelector(state => state.authenticate.user)
    const [loading, setLoading] = useState(false)
    const isAddServiceMode = useSelector(state => state.services.isAddServiceMode)
    const addServiceData = useSelector(state => state.services.addServiceData)
    const access_token = useSelector(state => state.authenticate.access_token)
    const [resizeMode, setresizemode] = useState("cover")
    const [images, setImages] = useState([{
        uri: require('../../../assets/camera.png'),
        name: '',
        type: '',
    }])

    useEffect(() => {
        toggleResize()
    }, [])

    useEffect(() => {
        if (images[0].uri !== require('../../../assets/camera.png')) {
            toggleResize()
        }
    }, [images])

    const toggleResize = () => {
        setTimeout(() => {
            if (resizeMode == "cover") {
                setresizemode("contain")
            } else {
                setresizemode("cover")
            }
        }, 1000);
    }

    useEffect(() => {
        if (!isAddServiceMode && subService && subService.license_data && subService.license_data.length > 0) {
            const imageData = subService.license_data.map((item, index) => {
                return {
                    id: item.id,
                    uri: BASE_URL + item.file_url,
                    name: item.file_url.split("/")[item.file_url.split("/").length - 1],
                    type: 'image/png',
                }
            })

            if (imageData.length > 0) {
                setImages(imageData)
            }
        }
    }, [])

    const pickImage = () => {
        Alert.alert(
            "LifeSuite",
            "Pick image from...",
            [
                {
                    text: "Cancel", onPress: () => { }, style: 'cancel'
                },
                {
                    text: "Camera",
                    onPress: () => {
                        ImagePicker.openCamera({
                            width: Dimensions.get('screen').width,
                            height: Dimensions.get('screen').width,
                            cropping: true
                        }).then(image => {
                            let data = [...images]
                            if (data.length <= 1) {
                                data[data.length - 1] = {
                                    uri: image.path,
                                    name: image.filename ? image.filename : image.path.split("/").pop(),
                                    type: image.mime,
                                }
                            } else {
                                data.push({
                                    uri: image.path,
                                    name: image.filename ? image.filename : image.path.split("/").pop(),
                                    type: image.mime,
                                })
                            }
                            setImages([...data])
                        })
                    },
                },
                {
                    text: "Gallery", onPress: () => {
                        ImagePicker.openPicker({
                            width: Dimensions.get('screen').width,
                            height: Dimensions.get('screen').width,
                            cropping: true
                        }).then(image => {
                            let data = [...images]
                            if (data[data.length - 1].uri == require('../../../assets/camera.png')) {
                                data[data.length - 1] = {
                                    uri: image.path,
                                    name: image.filename ? image.filename : image.path.split("/").pop(),
                                    type: image.mime,
                                }
                            } else {
                                data.push({
                                    uri: image.path,
                                    name: image.filename ? image.filename : image.path.split("/").pop(),
                                    type: image.mime,
                                })
                            }
                            setImages([...data])
                        }).catch(err => {
                            console.log("Image picker error : ", err)
                        })
                    }
                },
            ]
        );
    }

    const updateImage = (index) => {
        let imagesData = [...images]
        Alert.alert(
            "LifeSuite",
            "Pick image from...",
            [
                {
                    text: "Cancel", onPress: () => { }, style: 'cancel'
                },
                {
                    text: "Camera",
                    onPress: () => {
                        ImagePicker.openCamera({
                            width: Dimensions.get('screen').width,
                            height: Dimensions.get('screen').width,
                            cropping: true
                        }).then(image => {
                            imagesData[index] = {
                                uri: image.path,
                                name: image.filename ? image.filename : image.path.split("/").pop(),
                                type: image.mime,
                            }
                            setImages([...imagesData])
                        })
                    },
                },
                {
                    text: "Gallery", onPress: () => {
                        ImagePicker.openPicker({
                            width: Dimensions.get('screen').width,
                            height: Dimensions.get('screen').width,
                            cropping: true
                        }).then(image => {
                            imagesData[index] = {
                                uri: image.path,
                                name: image.filename ? image.filename : image.path.split("/").pop(),
                                type: image.mime,
                            }
                            setImages([...imagesData])
                        }).catch(err => {
                            console.log("Image picker error : ", err)
                        })
                    }
                },
            ]
        );
    }

    const next = () => {
        if (images[0].uri !== require('../../../assets/camera.png')) {
            dispatch(setAddServiceData({ data: { ...addServiceData, images: images } }))
            props.navigation.navigate('SelectLocation', { subService: subService })
        } else {
            showToast("Please select certificate or licence image")
        }
        // saveNewService()
    }

    const saveNewService = () => {
        if (images[0].uri !== require('../../../assets/camera.png')) {
            setLoading(true)
            let headers = {
                'Content-Type': 'multipart/form-data',
                "Authorization": `Bearer ${access_token}`
            }

            var formdata = new FormData();
            formdata.append("user_id", user.id);
            formdata.append("service_id", addServiceData.service_id);
            formdata.append("json_data", JSON.stringify({ ...addServiceData.json_data, products: [] }));

            images.forEach((item, index) => {
                if (!item.uri.startsWith(BASE_URL)) {
                    formdata.append('license_file[]', {
                        uri: Platform.OS == "ios" ? item.uri.replace('file:///', '') : item.uri,
                        name: item.name,
                        type: item.type,
                    })
                }
            })

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
                        getMyJobs(true)
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
            showToast("Please select certificate or licence image")
        }
    }

    const getMyJobs = (shouldNavigate) => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }

        let user_data = {
            "user_id": user.id
        }

        let config = {
            headers: headers,
            data: JSON.stringify({ ...user_data }),
            endPoint: '/api/providerAddedServicesList',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    dispatch(setMyJobs({ data: [...response.data] }))
                    dispatch(setAddServiceMode({ data: false }))
                    setLoading(false)
                    if (shouldNavigate) {
                        props.navigation.navigate('HomeScreen')
                    }
                }
                else {
                    setLoading(false)
                    if (shouldNavigate) {
                        props.navigation.navigate('HomeScreen')
                    }
                }
            }).catch(err => {
                setLoading(false)
            })
    }

    const removeImage = (index) => {
        let temp = [...images]
        temp.splice(index, 1)
        setImages([...temp])
    }

    const removeLicense = (item, index) => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }

        let user_data = {
            "user_id": user.id,
            "license_id": item.id
        }

        let config = {
            headers: headers,
            data: JSON.stringify({ ...user_data }),
            endPoint: '/api/licenseRemoved',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    getMyJobs(false)
                }
            }).catch(err => {
            }).finally(() => {
                setLoading(false)
                removeImage(index)
            })
    }

    const onImagePress = (image, index) => {
        if (images[0].uri == require('../../../assets/camera.png')) {
            pickImage()
        } else {
            updateImage(index)
        }
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
                                        props.navigation.goBack()
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
                        <Text style={styles.service}>{subService.upload_type == 2 ? "Upload Driver or State License" : "Upload Certificate or Business Certificate"}</Text>
                        {
                            images.map((item, index) => {
                                return (
                                    <TouchableOpacity activeOpacity={0.7} onPress={() => onImagePress(item, index)} key={index} style={{ width: '50%', aspectRatio: 1, borderWidth: 2, borderColor: LS_COLORS.global.divider, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                                        {
                                            item.uri == require('../../../assets/camera.png')
                                                ?
                                                <Image style={{ height: '25%', width: '25%' }} resizeMode="contain" source={require('../../../assets/camera.png')} />
                                                :
                                                <Image style={{ height: '100%', width: '100%' }} resizeMode={resizeMode} source={{ uri: item.uri }} />
                                        }
                                        {images.length > 1 && <TouchableOpacity activeOpacity={0.7} onPress={() => removeLicense(item, index)} style={{ height: 30, aspectRatio: 1, position: 'absolute', top: -15, right: -15 }}>
                                            <Image source={require('../../../assets/cancel.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                                        </TouchableOpacity>}
                                    </TouchableOpacity>
                                )
                            })
                        }

                        <View style={{ flex: 1 }} />
                        <View style={{ paddingBottom: '15%' }}>
                            <CustomButton
                                title={"Add Picture"}
                                customStyles={{ width: '50%', borderRadius: 6, backgroundColor: LS_COLORS.global.white, borderWidth: 1, borderColor: LS_COLORS.global.green }}
                                customTextStyles={{ color: LS_COLORS.global.green }}
                                action={() => pickImage()}
                            />
                        </View>                        
                    </Content>
                    <View style={{ paddingBottom: '2.5%', }}>
                            <CustomButton
                                title={"NEXT"}
                                customStyles={{ width: '50%', borderRadius: 6 }}
                                action={() => next()}
                            />
                        </View>
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