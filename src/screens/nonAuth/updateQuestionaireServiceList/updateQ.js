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
import { CheckBox } from 'react-native-elements';


let list = [{ title: "Are you certified to perform this service?", type: "is_certified" }, { title: "Do you have business license for this service?", type: "is_business_licensed" }, { title: "Do you have insurance for this service?", type: "is_insauranced" }]



export default function UpdateCertificates({ navigation, route }) {
    const myJobs = useSelector(state => state.provider.myJobs)
    const { title, service_id, service } = route.params
    const access_token = useSelector(state => state.authenticate.access_token)
    const [questions, setQuestions] = useState([])
    const [loader, setLoader] = React.useState(false)
    const [data, setData] = useState({
        is_certified: 0,
        is_insauranced: 0,
        is_business_licensed: 0
    })


    useEffect(() => {
        getCertificateList()
    }, [])
    const [responseData,setResponseData]=useState(null)
    useEffect(() => {
        let l = []
        let d={
            is_certified: 0,
            is_insauranced: 0,
            is_business_licensed: 0
        }
        if (service?.is_certified == "1") {
            l.push(list[0])
            if(responseData?.is_certified){
                d.is_certified=responseData?.is_certified
            }
        }
        if (service?.is_business_licensed == "1") {
            l.push(list[1])
            if(responseData?.is_business_licensed){
                d.is_business_licensed=responseData?.is_business_licensed
            }
        }
        if (service?.is_insauranced == "1") {
            l.push(list[2])
            if(responseData?.is_insauranced){
                d.is_insauranced=responseData?.is_insauranced
            }
        }
        setData(d)
        setQuestions(l)
    }, [service,responseData])

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
                endPoint: "/api/serviceQuestionnaire",
                type: 'post'
            }
            let response = await getApi(config)
            if (response.status) {
                if (response.data) {
                    if (response.data[0]) {
                        setResponseData({
                            is_certified: response.data[0]?.is_certified == "0" ? 0 : 1,
                            is_insauranced: response.data[0]?.is_insauranced == "0" ? 0 : 1,
                            is_business_licensed: response.data[0]?.is_business_licensed == "0" ? 0 : 1
                        })
                    }
                }
            }
        } catch (Err) {

        } finally {
            setLoader(false)
        }
    }

    const updateAddQuestionaire = async () => {
        try {
            setLoader(true)
            let headers = {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            }
            let config = {
                headers: headers,
                data: JSON.stringify({ service_id, ...data }),
                endPoint: "/api/addUpdateQuestionnaire",
                type: 'post'
            }
            let response = await getApi(config)
            if (response.status) {
                showToast(response.message)
                navigation.goBack()
            }
        } catch (Err) {

        } finally {
            setLoader(false)
        }
    }


    const renderItem = ({ item, index }) => {
        return (<View style={{ padding: 20 }}>
            <Text maxFontSizeMultiplier={1.3} style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 15, color: LS_COLORS.global.darkBlack }}>{item?.title}</Text>
            <View style={{ flexDirection: "row", marginTop: 20 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <CheckBox
                        style={{}}
                        containerStyle={{ width: 25, padding: 0, marginLeft: 0, marginRight: 0 }}
                        wrapperStyle={{}}
                        checked={data[`${item?.type}`] == 1}
                        onPress={() => {
                            setData({
                                ...data,
                                [`${item?.type}`]: 1
                            })
                        }}
                        checkedIcon={<View style={{ height: 20, width: 20, backgroundColor: LS_COLORS.global.cyan, borderRadius: 20, justifyContent: "center", alignItems: "center" }} >
                            <View style={{ height: 10, width: 10, borderRadius: 10, backgroundColor: "white" }} />
                        </View>}
                        uncheckedIcon={<View style={{ height: 20, width: 20, borderRadius: 20, borderWidth: 1, borderColor: LS_COLORS.global.darkGray }} />}
                    />
                    <Text maxFontSizeMultiplier={1.3} style={{ fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.darkBlack }}>Yes</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: "20%" }}>
                    <CheckBox
                        style={{}}
                        containerStyle={{ width: 25, padding: 0, marginLeft: 0, marginRight: 0 }}
                        wrapperStyle={{}}
                        checked={data[`${item?.type}`] == 0}
                        onPress={() => {
                            setData({
                                ...data,
                                [`${item?.type}`]: 0
                            })
                        }}
                        checkedIcon={<View style={{ height: 20, width: 20, backgroundColor: LS_COLORS.global.cyan, borderRadius: 20, justifyContent: "center", alignItems: "center" }} >
                            <View style={{ height: 10, width: 10, borderRadius: 10, backgroundColor: "white" }} />
                        </View>}
                        uncheckedIcon={<View style={{ height: 20, width: 20, borderRadius: 20, borderWidth: 1, borderColor: LS_COLORS.global.darkGray }} />}
                    />
                    <Text maxFontSizeMultiplier={1.3} style={{ fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.darkBlack }}>No</Text>
                </View>
            </View>
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
                <Text maxFontSizeMultiplier={1.3} style={styles.service}>Update Business Questionaire</Text>
                <FlatList
                    data={questions}
                    keyExtractor={(item, index) => "" + index}
                    style={{ marginTop: 20 }}
                    renderItem={renderItem}
                    ListFooterComponent={() => {
                        return <CustomButton customTextStyles={{fontSize:13}} customStyles={{minHeight:40,width:100,}} maxFont={1.1} containerStyle={{height:40,width:100,alignSelf:"center",marginTop:20}} action={() => {
                            updateAddQuestionaire()
                        }} title={"Save"} />
                    }}
                />

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
            }} title={selected == 0 ? "Add Certificate" : "Add License"} />
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
        fontSize: 15,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: "black",
        alignSelf: 'center',
        // paddingVertical: '3%',
        marginTop: '5%'
    }
})
