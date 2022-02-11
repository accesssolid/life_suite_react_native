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
import { getMyJobsThunk, setMyJobs } from '../../../redux/features/provider';
import { setAddServiceData, setAddServiceMode } from '../../../redux/features/services';
import { Alert } from 'react-native';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get("window")
const upload_types = [
    { id: 1, text: "Upload Certificate or Business Certificate", button_text: "Add Certificate" },
    { id: 2, text: "Upload Driver or State License", button_text: "Add License" },
    { id: 3, text: "Upload Certificate and License " }
]



const AddLicense = (props) => {
    const dispatch = useDispatch()
    const { subService } = props.route.params
    const user = useSelector(state => state.authenticate.user)
    const [loading, setLoading] = useState(false)
    const isAddServiceMode = useSelector(state => state.services.isAddServiceMode)
    const addServiceData = useSelector(state => state.services.addServiceData)
    const access_token = useSelector(state => state.authenticate.access_token)
    const [resizeMode, setresizemode] = useState("cover")
    const [upload_type, setUploadType] = React.useState(upload_types[2])
    const [selected, setSelected] = React.useState(0)
    const [showSelector, setShowSelector] = React.useState(false)
    const [images, setImages] = useState([{
        uri: require('../../../assets/camera.png'),
        name: '',
        type: '',
    }])

    const [images1, setImages1] = useState([{
        uri: require('../../../assets/camera.png'),
        name: '',
        type: '',
    }])

    useEffect(() => {
        toggleResize()
    }, [])

    useEffect(() => {
        if (showSelector) {
            if (selected == 0) {
                setUploadType(upload_types[0])
            } else if (selected == 1) {
                setUploadType(upload_types[1])
            }
        }
    }, [selected, showSelector])

    useEffect(() => {
        if (subService?.upload_type > 0) {
            if (subService.upload_type <= 3) {
                let d = upload_types.find(x => x.id == subService.upload_type)
                if (d) {
                    if (d.id == 3) {
                        setShowSelector(true)
                    } else {
                        setUploadType(d)
                    }

                }
            }
        }
    }, [subService])

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
            console.log("Service data", subService)
            const imageData = subService.license_data?.filter(x => x.file_type == "license")?.map((item, index) => {
                return {
                    id: item.id,
                    uri: BASE_URL + item.file_url,
                    name: item.file_url.split("/")[item.file_url.split("/").length - 1],
                    type: 'image/png',
                }
            })

            const imagesData1 = subService?.license_data?.filter(x => x.file_type == "certificate")?.map((item, index) => {
                return ({
                    id: item.id,
                    uri: BASE_URL + item.file_url,
                    name: item.file_url.split("/")[item.file_url.split("/").length - 1],
                    type: 'image/png',
                })
            })
            if (imagesData1.length > 0) {
                setImages1(imagesData1)
            }
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
                            if (upload_type.id == 1) {
                                data = [...images1]
                            }
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
                            if (upload_type.id == 1) {
                                setImages1([...data])
                            } else if (upload_type.id == 2) {
                                setImages([...data])
                            }

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
                            if (upload_type.id == 1) {
                                data = [...images1]
                            }
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
                            if (upload_type.id == 1) {
                                setImages1([...data])
                            } else if (upload_type.id == 2) {
                                setImages([...data])
                            }
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
        if (upload_type.id == 1) {
            imagesData = [...images1]
        }
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
                            if (upload_type.id == 1) {
                                setImages1([...imagesData])
                            } else if (upload_type.id == 2) {
                                setImages([...imagesData])
                            }

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
                            if (upload_type.id == 1) {
                                setImages1([...imagesData])
                            } else if (upload_type.id == 2) {
                                setImages([...imagesData])
                            }
                        }).catch(err => {
                            console.log("Image picker error : ", err)
                        })
                    }
                },
            ]
        );
    }

    const next = () => {
        let goToNext = false
        if (showSelector) {
            if (images1[0].uri !== require('../../../assets/camera.png') && images[0].uri !== require('../../../assets/camera.png')) {
                goToNext = true
            }
        } else {
            if (upload_type.id == 1) {
                if (images1[0].uri !== require('../../../assets/camera.png')) {
                    goToNext = true
                }
            } else if (upload_type.id == 2) {
                if (images[0].uri !== require('../../../assets/camera.png')) {
                    goToNext = true
                }
            }
        }

        if (goToNext) {
            dispatch(setAddServiceData({ data: { ...addServiceData, images: images, certificates: images1 } }))
            props.navigation.navigate('SelectLocation', { subService: subService })
        } else {
            showToast("Please select certificate or licence image")
        }
        // saveNewService()
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
        if (upload_type.id == 1) {
            temp = [...images1]
        }
        temp.splice(index, 1)
        if (upload_type.id == 1) {
            setImages1([...temp])
        } else if (upload_type.id == 2) {
            setImages([...temp])

        }
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
        if (upload_type.id == 1) {
            if (images1[0].uri == require('../../../assets/camera.png')) {
                pickImage()
            } else {
                updateImage(index)
            }
        } else if (upload_type.id == 2) {
            if (images[0].uri == require('../../../assets/camera.png')) {
                pickImage()
            } else {
                updateImage(index)
            }
        }

    }

    const saveData=async()=>{
        try{
            setLoading(true)

            let headers={
                "Authorization": `Bearer ${access_token}`
            }
            let formdata=new FormData()
            formdata.append("service_id",subService.id)
            let json_data={
                products: addServiceData?.json_data?.products?.map(x=>({item_product_id:x.id,price:x.price})),
                new_products:addServiceData?.json_data?.new_products,
                services:addServiceData?.json_data?.services,
                new_services:addServiceData?.json_data?.new_services
            }
            formdata.append("json_data",JSON.stringify(json_data))
            for(let i of images){
                if (i.name != "") {
                    let PATH_TO_THE_FILE = Platform.OS == "ios" ? i.uri.replace('file:///', '') : i.uri
                    if (!String(i.uri).startsWith(BASE_URL)) {
                        formdata.append('license_file[]', {
                            uri: PATH_TO_THE_FILE,
                            name: i.name,
                            type: i.type,
                        })
                    }
                }
            }
            for(let item of images1){
                if (item.name != "") {
                    let PATH_TO_THE_FILE = Platform.OS == "ios" ? item.uri.replace('file:///', '') : item.uri
                    if (!String(item.uri).startsWith(BASE_URL)) {
                        formdata.append('certificate_file[]', {
                            uri: PATH_TO_THE_FILE,
                            name: item.name,
                            type: item.type,
                        })
                    }
                }
            }
            const config={
                headers,
                data:formdata,
                endPoint: '/api/providerServicesLicenseSaveIndividually',
                type: 'post'
            }
            let res=await getApi(config)
            if(res.status){
                showToast(res.message)
                dispatch(getMyJobsThunk(user.id,access_token))
                props.navigation.navigate("HomeScreen")
            }else{
                showToast(res.message)

            }
        }catch(err){
            console.error(err)
        }finally{
            setLoading(false)
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
                        <Text style={styles.service}>{upload_type.text}</Text>
                        {showSelector && <View style={{ flexDirection: "row", borderWidth: 1, borderColor: LS_COLORS.global.green, marginHorizontal: 20, marginBottom: 10 }}>
                            <TouchableOpacity onPress={() => setSelected(0)} style={{ padding: 10, flex: 1, alignItems: "center", backgroundColor: selected == 0 ? LS_COLORS.global.green : "white" }}>
                                <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, color: selected == 0 ? "white" : "black" }}>Upload Certificate</Text>
                            </TouchableOpacity>
                            <View style={{ width: 1, backgroundColor: LS_COLORS.global.green }} />
                            <TouchableOpacity onPress={() => setSelected(1)} style={{ padding: 10, flex: 1, alignItems: "center", backgroundColor: selected == 1 ? LS_COLORS.global.green : "white" }}>
                                <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, color: selected == 1 ? "white" : "black" }}>Upload License</Text>
                            </TouchableOpacity>
                        </View>}
                        {upload_type.id == 2 && images.map((item, index) => {
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
                        {upload_type.id == 1 && images1.map((item, index) => {
                            return (
                                <TouchableOpacity activeOpacity={0.7} onPress={() => onImagePress(item, index)} key={index} style={{ width: '50%', aspectRatio: 1, borderWidth: 2, borderColor: LS_COLORS.global.divider, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                                    {
                                        item.uri == require('../../../assets/camera.png')
                                            ?
                                            <Image style={{ height: '25%', width: '25%' }} resizeMode="contain" source={require('../../../assets/camera.png')} />
                                            :
                                            <Image style={{ height: '100%', width: '100%' }} resizeMode={resizeMode} source={{ uri: item.uri }} />
                                    }
                                    {images1.length > 1 && <TouchableOpacity activeOpacity={0.7} onPress={() => removeLicense(item, index)} style={{ height: 30, aspectRatio: 1, position: 'absolute', top: -15, right: -15 }}>
                                        <Image source={require('../../../assets/cancel.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                                    </TouchableOpacity>}
                                </TouchableOpacity>
                            )
                        })}

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
                        {isAddServiceMode ? <CustomButton
                            title={"NEXT"}
                            customStyles={{ width: '50%', borderRadius: 6 }}
                            action={() => next()}
                        /> :
                            <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 10, marginHorizontal: 10 }}>
                                <CustomButton title={"Save"} action={() => {
                                        saveData()
                                }} customStyles={{ width: width * 0.45, borderRadius: 6 }} />
                                <CustomButton title={"Next"} action={() => next()} customStyles={{ width: width * 0.45, borderRadius: 6 }} />
                            </View>
                        }
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