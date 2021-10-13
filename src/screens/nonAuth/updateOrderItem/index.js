// #liahs updateOrderItems
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, ImageBackground, StatusBar, Platform, Image, TouchableOpacity, Dimensions, Linking, ScrollView, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, Avatar } from 'react-native-elements'
/* Components */;
import Header from '../../../components/header';
import DropDown from '../../../components/dropDown';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { BASE_URL, getApi } from '../../../api/api';
import { showToast } from '../../../components/validators';
import { PermissionsAndroid } from 'react-native';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Loader from '../../../components/loader'
// placeholder image
import _ from 'lodash'








const OrderClientDetail = (props) => {
    const { subService, item } = props.route.params
    const [data, setData] = useState(null)
    const [variantAndServiceData, setVariantAndServiceData] = React.useState(null)
    const user = useSelector(state => state.authenticate.user)
    const access_token = useSelector(state => state.authenticate.access_token)
    const [loading, setLoading] = React.useState(false)

    const [selectedVariant, setSelectedVariant] = React.useState(0)

    const getOrderDetail = (order_id) => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let config = {
            headers: headers,
            data: JSON.stringify({ order_id }),
            endPoint: '/api/providerOrderUpdateDetail',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                console.log("/api/providerOrderUpdateDetail", response)
                if (response.status == true) {
                    if (response.data) {
                        setData(response.data)
                        if (response?.added_services_list[0]) {
                            setVariantAndServiceData(response?.added_services_list[0])
                        }
                    } else {

                    }
                } else {
                    showToast(response.message)
                }
            }).catch(err => {
            }).finally(() => {
                setLoading(false)
            })
    }




    useEffect(() => {
        if (item.id) {
            getOrderDetail(item.id)
        }
    }, [item])


    return (
        <View style={{ flex: 1, backgroundColor: LS_COLORS.global.white }}>
            <StatusBar translucent backgroundColor={"transparent"} barStyle="light-content" />
            <HeaderView data={data} navigation={props.navigation} subService={subService} />
            <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
                <View style={styles.container}>
                    {/* <RenderView /> */}
                    <ScrollView contentContainerStyle={{ paddingVertical: 16 }}>
                        <Text style={styles.service}>SERVICES</Text>
                        <View style={{ marginVertical: 10, flexDirection: 'row', overflow: 'scroll', paddingHorizontal: '5%', justifyContent: 'center' }}>
                            {variantAndServiceData?.variant_data.length > 0 && variantAndServiceData?.variant_data.map((item, index) => {
                                const isSelected = selectedVariant == item.id
                                return (
                                    <TouchableOpacity activeOpacity={0.7} onPress={() => setSelectedVariant(item.id)} key={index}
                                        style={[styles.variantContainerStyle, { backgroundColor: isSelected ? LS_COLORS.global.green : LS_COLORS.global.white }]}>
                                        <Text style={[styles.varinatTextStyle, { color: isSelected ? LS_COLORS.global.white : LS_COLORS.global.black }]}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>


                    </ScrollView>
                    <View style={{ flexDirection: "row", justifyContent: "space-around", marginHorizontal: 20, marginVertical: 5 }}>
                        <TouchableOpacity
                            style={styles.save}
                            activeOpacity={0.7}
                            onPress={() => { props.navigation.navigate("UpdateOrderItems") }}>
                            <Text style={styles.saveText}>Update Order Item</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView >
            {loading && <Loader />}
        </View>
    )
}

export default OrderClientDetail;

const HeaderView=({subService,navigation,data})=>{
    return(
        <View style={{ width: '100%', height: '20%', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, overflow: "hidden" }}>
        <ImageBackground
            resizeMode="cover"
            source={{ uri: BASE_URL + data?.order_items[0]?.services_image }}
            style={[styles.image]}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
                    <View style={{ height: "100%", justifyContent: 'center' }}>
                        <Header
                            imageUrl={require("../../../assets/backWhite.png")}
                            action={() => {
                               navigation.goBack()
                            }}
                            title={data?.order_items && data?.order_items[0]?.services_name}
                            titleStyle={{ color: "white" }}
                            imageUrl1={require("../../../assets/homeWhite.png")}
                            action1={() => {
                                navigation.navigate("MainDrawer", { screen: "HomeScreen" })
                            }}
                            imageStyle1={{ tintColor: "white" }}
                        />
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: "center", height: "33%" }}>
                        <Text style={{ fontSize: 29, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.white }}>{subService?.name}</Text>
                    </View>
                </SafeAreaView>
            </View>
        </ImageBackground>
    </View>
    )
}

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
    service: {
        fontSize: 18,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: "black",
        alignSelf: 'center',
        paddingVertical: '3%'
    },
    variantContainerStyle: {
        backgroundColor: LS_COLORS.global.white,
        marginHorizontal: 10,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: LS_COLORS.global.green

    },
    varinatTextStyle: {
        fontFamily: LS_FONTS.PoppinsMedium,
        fontSize: 14,
        textTransform: 'uppercase',
        color: LS_COLORS.global.black,
    },
    save: {
        justifyContent: "center",
        alignItems: 'center',
        height: 45,
        width: "40%",
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
    client_info_text: {
        textAlign: "center",
        fontSize: 16,
        fontFamily: LS_FONTS.PoppinsBold,
        color: LS_COLORS.global.black,
        textTransform: "uppercase"
    },
    item: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 20,
    },
    checkBoxTxt: {
        marginLeft: 20,
    },
    dropdownBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: widthPercentageToDP(28),
        paddingHorizontal: 15,
        borderRadius: 30,
        paddingVertical: 5,
        marginHorizontal: 5
    },
    fromContainer: {
        height: 50,
        width: "100%",
        alignSelf: 'center',
        borderColor: LS_COLORS.global.lightTextColor,
        borderRadius: 3,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        overflow: 'hidden',
        paddingLeft: '5%'
    },
    inputStyle: {
        height: '100%',
        width: "90%"
    },
    mapContainer: {
        height: Dimensions.get('screen').height / 4,
        width: Dimensions.get('screen').width,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    greenTextStyle: {
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.green
    },
    baseTextStyle: {
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.black
    }
})





