import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, FlatList, SafeAreaView, TouchableOpacity, Dimensions, Alert } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';
import { globalStyles, showToast } from '../../../utils';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign'
/* Components */
import Header from '../../../components/header';
import { Card, Container, Content } from 'native-base';
import { BASE_URL, getApi } from '../../../api/api';
import Cards from '../../../components/cards';

/* Icons */
import FontAwesome from 'react-native-vector-icons/MaterialIcons'
import CustomButton from '../../../components/customButton';
import Loader from '../../../components/loader';
import ImagePicker from 'react-native-image-crop-picker';


const upload_types = [
    { id: 1, text: "Upload General and/or Professional Liability Insurance", button_text: "Add Insurance" },
    { id: 2, text: "Upload Driver License", button_text: "Add License" },
    { id: 3, text: "Upload General and/or Professional Liability Insurance and License " }
]


export default function UpdateCertificates({ navigation, route }) {
    const myJobs = useSelector(state => state.provider.myJobs)
    const { title, service_id, service } = route.params
    const [current_upload_type, setCurrentUploadType] = React.useState(upload_types[0])
    const access_token = useSelector(state => state.authenticate.access_token)
    const [cerrtificates, setCertificates] = React.useState([])
    const [licences, setLicenses] = React.useState([])
    const [loader, setLoader] = React.useState(false)

    useEffect(() => {
        getCertificateList()
    }, [])

    useEffect(() => {
        if (service?.upload_type) {
            setCurrentUploadType(upload_types[service?.upload_type - 1])
            // setCurrentUploadType(upload_types[2])
        }
    }, [service])
    const getCertificateList = async () => {
        try {
            setLoader(true)
            let headers = {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            }
            let config = {
                headers: headers,
                data: JSON.stringify({ service_id }),
                endPoint: "/api/providerCertificateList",
                type: 'post'
            }
            let response = await getApi(config)
            console.log("certificates list", response)
            if (response.status) {
                if (response.data) {
                    setCertificates(response.data)
                }
            }
        } catch (Err) {

        } finally {
            setLoader(false)
        }
    }
    const deleteCertificate = async (certificate_id) => {
        try {
            setLoader(true)
            let headers = {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            }
            let config = {
                headers: headers,
                data: JSON.stringify({ service_id, certificate_id }),
                endPoint: "/api/providerDeleteCertificate",
                type: 'post'
            }
            let response = await getApi(config)
            console.log("response", response)
            if (response.status) {
                let certs = cerrtificates.filter(x => x.id !== certificate_id)
                setCertificates(certs)
                showToast("Deleted successfully.")
            } else {

            }
        } catch (Err) {

        } finally {
            setLoader(false)
        }
    }

    const addCertificate = async (data) => {
        try {
            setLoader(true)
            let headers = {
                "Authorization": `Bearer ${access_token}`
            }
            let config = {
                headers: headers,
                data: data,
                endPoint: "/api/providerAddCertificate",
                type: 'post'
            }
            let response = await getApi(config)
            if (response.status) {
                showToast(response.message)
                getCertificateList()
            } else {
                showToast(response.message)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoader(false)
        }
    }


    const pickImage = (type) => {
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
                            cropping: true,
                            forceJpg: true
                        }).then(image => {
                            let i = {
                                uri: image.path,
                                name: image.filename ? image.filename : image.path.split("/").pop(),
                                type: image.mime,
                            }
                            let formdata = new FormData()
                            formdata.append("service_id", service_id)
                            formdata.append("certificate", i)
                            if (type == 0) {
                                formdata.append("file_type", "certificate")
                            } else {
                                formdata.append("file_type", "license")
                            }
                            addCertificate(formdata)
                        })
                    },
                },
                {
                    text: "Gallery", onPress: () => {
                        ImagePicker.openPicker({
                            width: Dimensions.get('screen').width,
                            height: Dimensions.get('screen').width,
                            cropping: true,
                            forceJpg: true
                        }).then(image => {
                            let i = {
                                uri: image.path,
                                name: image.filename ? image.filename : image.path.split("/").pop(),
                                type: image.mime,
                            }
                            let formdata = new FormData()
                            formdata.append("service_id", service_id)
                            formdata.append("certificate", i)
                            if (type == 0) {
                                formdata.append("file_type", "certificate")
                            } else {
                                formdata.append("file_type", "license")
                            }
                            addCertificate(formdata)
                        }).catch(err => {
                            console.log("Image picker error : ", err)
                        })
                    }
                },
            ]
        );
    }

    const renderItem = ({ item, index }) => {
        return (<View
            style={{ height: 200, width: "90%", alignSelf: "center", marginTop: 10, borderRadius: 4, overflow: "hidden", backgroundColor: "#0005", borderWidth: 1, borderColor: LS_COLORS.global.green }}
        >
            <Image
                style={{ height: "100%", aspectRatio: 1, alignSelf: "center" }}
                source={{ uri: BASE_URL + item.file_url }}
                resizeMode='contain'
            />
            <FontAwesome
                onPress={() => {
                    Alert.alert("Delete", "Do you want to remove this insurance? ", [
                        { text: "no" },
                        { text: "yes", onPress: () => deleteCertificate(item.id) }])
                }}
                name='delete'
                color={LS_COLORS.global.danger}
                size={25}
                style={{ position: "absolute", right: 10, top: 10 }}
            />
        </View>)
    }

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <Header
                title={`${title}`}
                imageUrl={require("../../../assets/back.png")}
                action={() => {
                    navigation.goBack()
                }}
                imageUrl1={require("../../../assets/home.png")}
                action1={() => {
                    navigation.navigate("HomeScreen")
                }}
                containerStyle={{ backgroundColor: LS_COLORS.global.cyan }}

            />
            <View style={styles.container}>
            {current_upload_type.id != upload_types[2].id &&<Text style={styles.service}>{current_upload_type.text}</Text>}
                {current_upload_type.id !== upload_types[2].id && <><FlatList
                    data={cerrtificates}
                    keyExtractor={(item, index) => item.id + "" + index}
                    style={{ marginTop: 20 }}
                    renderItem={renderItem}
                />
                    <CustomButton action={() => {
                        if (current_upload_type.id == 1) {
                            pickImage(0)
                        } else {
                            pickImage(1)
                        }

                    }} title={current_upload_type.button_text} />
                </>
                }
                {current_upload_type.id == upload_types[2].id && <BothTab data={cerrtificates} renderItem={renderItem} pickImage={pickImage} />}
            </View>

            {loader && <Loader />}
        </SafeAreaView>
    )
}

const BothTab = ({ data, renderItem, pickImage }) => {
    const [certificates, setCertificates] = React.useState([])
    const [licenses, setLicenses] = React.useState([])
    const [selected, setSelected] = React.useState(0)

    React.useEffect(() => {
        if (data) {
            setCertificates(data.filter(x => x.file_type == "certificate"))
            setLicenses(data.filter(x => x.file_type == "license"))
        }
    }, [data])

    return (
        <View style={{ flex: 1 }}>
            <Text style={styles.service}>{selected==0?"Upload General and/or Professional Liability Insurance":"Upload Driver License"}</Text>
            <View style={{ flexDirection: "row", borderWidth: 1, borderColor: LS_COLORS.global.green }}>
                <TouchableOpacity onPress={() => setSelected(0)} style={{ padding: 10, flex: 1, alignItems: "center", backgroundColor: selected == 0 ? LS_COLORS.global.green : "white" }}>
                    <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, color: selected == 0 ? "white" : "black" }}>Upload Insurance</Text>
                </TouchableOpacity>
                <View style={{ width: 1, backgroundColor: LS_COLORS.global.green }} />
                <TouchableOpacity onPress={() => setSelected(1)} style={{ padding: 10, flex: 1, alignItems: "center", backgroundColor: selected == 1 ? LS_COLORS.global.green : "white" }}>
                    <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, color: selected == 1 ? "white" : "black" }}>Upload License</Text>
                </TouchableOpacity>
            </View>
            {selected == 0 ? <FlatList
                data={certificates}
                renderItem={renderItem}
                keyExtractor={(item, index) => index + "" + item.id}
            /> :
                <FlatList
                    data={licenses}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index + "" + item.id}
                />
            }
            <CustomButton action={() => {
                if (pickImage) {
                    pickImage(selected)
                }
            }} title={selected == 0 ? "Add Insurance" : "Add License"} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
        paddingHorizontal: 10,
        paddingBottom: 10
    },
    topContainer: {
        width: '90%',
        alignSelf: 'center',
        padding: 17,
        borderRadius: 10,
        backgroundColor: LS_COLORS.global.white,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        marginVertical: 5
    },
    service: {
        fontSize: 14,
        fontFamily: LS_FONTS.PoppinsRegular,
        color: "black",
        alignSelf: 'center',
        paddingVertical: '3%',
        marginTop: '10%',
        textAlign:"center"
    }
})
