import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Text, ImageBackground, StatusBar, Platform, Image, TouchableOpacity, PermissionsAndroid, Alert, Pressable, ScrollView } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import { globalStyles, showToast } from '../../../utils';
import LS_FONTS from '../../../constants/fonts';
import * as RNLocalize from "react-native-localize";

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import { CheckBox } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

/* Components */;
import Header from '../../../components/header';
import { Card, Container, Content, Row, Toast, } from 'native-base'
import Loader from '../../../components/loader';
import { BASE_URL, getApi } from '../../../api/api';
import { Rating } from 'react-native-ratings';
import SureModal from '../../../components/sureModal';
import SureModal1 from '../../../components/sureModal1';;
import TimeFrame, { FilterModal } from '../../../components/timeFrame';
import _ from 'lodash'
import moment from 'moment';
import Geolocation from 'react-native-geolocation-service';
import RNGooglePlaces from 'react-native-google-places';
import { useFocusEffect } from '@react-navigation/native';
import lodash from 'lodash'
import { setFavList } from '../../../redux/features/favorites';
// #liahs_provider_list

const Mechanics = (props) => {
    const { data, subService, extraData } = props.route.params
    const [loading, setLoading] = useState(false)
    const [providers, setProviders] = useState([])
    const access_token = useSelector(state => state.authenticate.access_token)
    const user = useSelector(state => state.authenticate.user)
    const [price, setPrice] = useState(false)
    const [time, setTime] = useState(false)
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(false)
    const [open1, setOpen1] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [selectedItemsWithProviders, setSelectedItemsWithProviders] = useState([])
    const ordered_variant = useSelector(state => state.variant)
    const [mycords, setMyCords] = useState({
        latitude: 37.785834,
        longitude: -122.406417
    })
    const [mile_distanceP, setMileDistanceP] = React.useState({})
    const [current_address, setCurrentAddress] = useState({
        country: "USA",
        city: "",
        state: ""
    })
    //    #liahs
    const [dupProviders, setDupProviders] = React.useState([])
    const [filterModal, setFilterModal] = React.useState(false)

    useFocusEffect(useCallback(() => {
        getFavProvider()
    }, []))
    useEffect(()=>{
        console.log(subService,"======---")
    },[subService])
    React.useEffect(() => {
        let z = []
        for (let i of providers) {
            let changedItems = _.cloneDeep(i.item_list).map(x => {
                let service_id = x.service_item_id
                let other_options = extraData?.find(e => e.parent_id == service_id)
                let other = null
                let have_own = null
                let need_recommendation = null
                if (other_options) {
                    if (other_options.other?.trim() != "") {
                        other = {
                            created_at: "2021-10-11T07:46:35.000000Z",
                            id: service_id + 111111111111,
                            item_product_id: service_id + 111111111111,
                            item_products_name: other_options.other,
                            item_id: service_id,
                            type: "other",
                            product_id: "",
                            other: other_options.other,
                            price: 0,
                            updated_at: null,
                            user_id: x.user_id,
                            checked: false
                        }
                    }
                    if (other_options.have_own?.trim() != "") {
                        have_own = {
                            created_at: "2021-10-11T07:46:35.000000Z",
                            id: service_id + 1111111111111,
                            item_product_id: service_id + 1111111111111,
                            item_products_name: other_options.have_own,
                            item_id: service_id,
                            type: "have_own",
                            product_id: "",
                            have_own: other_options.have_own,
                            price: 0,
                            updated_at: null,
                            user_id: x.user_id,
                            checked: false
                        }
                    }
                    if (other_options.need_recommendation) {
                        need_recommendation = {
                            created_at: "2021-10-11T07:46:35.000000Z",
                            id: service_id + 11111111111111,
                            item_product_id: service_id + 11111111111111,
                            item_products_name: "Need recommendation",
                            item_id: service_id,
                            type: "need_recommendation",
                            product_id: "",
                            need_recommendation: true,
                            price: 0,
                            updated_at: null,
                            user_id: x.user_id,
                            checked: false
                        }
                    }
                }
                x.checked = false;
                x.products = _.cloneDeep(x.products).map(y => { y.checked = false; return y })
                if (other) {
                    x.products.push(other)
                }
                if (have_own) {
                    x.products.push(have_own)
                }
                if (need_recommendation) {
                    x.products.push(need_recommendation)
                }


                return x
            })
            let d = _.cloneDeep(i)
            d.item_list = changedItems
            d.checked = false
            z.push(d)
        }
        setDupProviders(z)
    }, [providers, extraData])

    useEffect(() => {
        console.log("Providers", JSON.stringify(providers))
    }, [providers])

    useEffect(() => {
        getProviders()
        getLocationPermission()
    }, [])
    const getLocationPermission = async () => {
        let hasLocationPermission = false
        if (Platform.OS == "ios") {
            Geolocation.requestAuthorization('always').then((res) => {
                if (res == "granted") {
                    hasLocationPermission = true
                    getCurrentLocation(hasLocationPermission)
                } else {
                    hasLocationPermission = false
                    getCurrentLocation(hasLocationPermission)
                }
            })
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Lifesuite Location Permission",
                        message:
                            "Lifesuite needs to access your location ",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    hasLocationPermission = true
                    getCurrentLocation(hasLocationPermission)
                } else {
                    hasLocationPermission = false
                    getCurrentLocation(hasLocationPermission)
                }
            } catch (err) {
                console.warn(err);
            }
        }
    }
    const getCurrentLocation = (hasLocationPermission) => {
        if (hasLocationPermission) {
            Geolocation.getCurrentPosition(
                (position) => {
                    setMyCords({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    })
                    getCurrentPlace()
                },
                (error) => {
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        } else {
            showToast("Location permission not granted")
        }
    }
    const getCurrentPlace = () => {
        RNGooglePlaces.getCurrentPlace(['location', 'address'])
            .then((results) => {
                if (results.length > 0) {
                    let res = results[0].address?.split(",")
                    if (res.length == 3) {
                        setCurrentAddress({
                            city: res[0],
                            state: res[1],
                            country: res[2]
                        })
                    } else {
                        setCurrentAddress({
                            city: res[1],
                            state: res[2],
                            country: res[3]
                        })
                    }
                }
            })
            .catch((error) => console.log(error.message));
    }

    const getMilesBetweenCords = async (toCoordinates, fromCoordinates) => {
        try {
            let response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${toCoordinates.latitude}%2C${toCoordinates.longitude}&origins=${fromCoordinates.latitude}%2C${fromCoordinates.longitude}&key=AIzaSyA8vPYceBJX2Mt43IKubB1Gpa2EcZ6Mg_g`)
            let res = await response.json()
            console.log(res,"=============")
            if (res?.rows[0]) {
                let element = res.rows[0].elements[0]
                if (element?.distance?.value) {
                    return (element?.distance?.value * 0.000621371)
                }
            }
            return 0
        } catch (err) {
            console.err(err)
        }

    }

    React.useEffect(() => {
        if (mycords.latitude && mycords.longitude && dupProviders?.length > 0) {
            locationMileDistanceUpdate()
        }
    }, [dupProviders, mycords])


    const locationMileDistanceUpdate = async () => {
        let d = { ...mile_distanceP }
        console.log("Data", data)
        for (let provider of dupProviders) {
            let x = await getMilesBetweenCords({ latitude: provider?.address?.lat, longitude: provider?.address?.long }, { latitude: data.order_placed_lat, longitude: data.order_placed_long })
            d[`${provider.id}`] = x
        }

        setMileDistanceP(d)
    }

    const getProviders = (rangeData = {}, showRangeResult = false, my_location = false) => {
        // console.log("Data",data)
        // return
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let config = {
            headers: headers,
            data: JSON.stringify({ ...data, ...rangeData }),
            endPoint: '/api/providerListOrder',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
               
                if (response.status == true) {
                    let proData = Object.keys(response.data).map((item, index) => {
                        return response.data[item]
                    })
                    if (my_location) {
                        proData = proData.filter(x => Number(x.service_is_at_address) == 0)
                    }
                    setProviders(proData)
                    setLoading(false)
                }
                else {
                    if (!showRangeResult) {
                        setOpen1(!open)
                    } else {
                        setProviders([])
                    }
                    setLoading(false)
                }
            }).catch(err => {
                setLoading(false)
            }).finally(() => {
                setLoading(false)
            })
    }

    const [cards, setCards] = React.useState([])

    useFocusEffect(useCallback(() => {
        getCards()
    }, []))

    const getCards = () => {
        let headers = {
            "Authorization": `Bearer ${access_token}`
        }

        let config = {
            headers: headers,
            endPoint: '/api/customerSaveCardList',
            type: 'get'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    setCards(response.data)
                }
                else {
                    setCards([])
                }
            })
            .catch(err => {

            }).finally(() => {
            })
    }


    const placeOrder = (jsonData, continuous_order = 0) => {

        setLoading(true)
        var formdata = new FormData();
        formdata.append("items_data", JSON.stringify(jsonData))
        formdata.append("timezone", RNLocalize.getTimeZone())
        formdata.append("country", current_address.country)
        formdata.append("state", current_address.state)
        formdata.append("city", current_address.city)
        formdata.append("ordered_variant", JSON.stringify(ordered_variant))
        // console.log("JSONDATA",JSON.stringify(jsonData))
        // setLoading(false)
        // return
        if (continuous_order) {
            formdata.append("continuous_order", continuous_order)
        }
        setLoading(true)
        let headers = {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${access_token}`
        }
        let config = {
            headers: headers,
            data: formdata,
            endPoint: '/api/createOrder',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    setLoading(false)
                    props.navigation.navigate("MainDrawer", { screen: "Orders" })
                }
                else {

                    if (response?.data == "payment_failure_error") {
                        Alert.alert("Order not placed", response.message, [
                            {
                                text: "Cancel"
                            },
                            {
                                text: "Manage Cards",
                                onPress: () => {
                                    props.navigation.navigate("UserStack", { screen: "CardList" })
                                }
                            }])
                    } else {
                        showToast(response.message)
                    }
                    if (response.warning_alert == 1) {
                        Alert.alert("Continue Order", "Are you sure you want to continue?", [
                            {
                                text: "no"
                            },
                            {
                                text: "yes",
                                onPress: () => placeOrder(jsonData, 1)
                            }])
                    }
                    setLoading(false)
                }
            }).catch(err => {
                setLoading(false)
            })
    }



    //value boolean true or false and pIndex is provider index and iIndex is item index and prIndex is product Index
    const onCheckBoxClicked = (value, pIndex, iIndex, prIndex) => {
        let d = _.cloneDeep(dupProviders)
        let provider = d[pIndex]
        let item = provider.item_list[iIndex]

        // checking for service id if it is already there
        if (value) {
            for (let z of d.filter(x => x.id != provider.id)) {
                for (let s of z.item_list) {
                    if (s.service_item_id == item.service_item_id && s.checked) {
                        showToast("You can not have same service or products from different provider.")
                        return
                    }
                }
            }
        }

        // if prIndex is passed i.e product index
        if (typeof prIndex === "number") {
            let product = item.products[prIndex]
            product.checked = value
            if (item.products.filter(x => x.checked).length > 0) {
                item.checked = true
            } else {
                item.checked = false
            }
        } else {
            item.checked = value
            item.products = item.products.map(x => {
                x.checked = value
                return x
            })
        }
        setDupProviders(d)
    }
    // onGlobal check box clicked
    const onGlobCheckBoxClicked = (pIndex) => {
        let d = _.cloneDeep(dupProviders)
        let provider = d[pIndex]
        let items = provider.item_list
        let changedItems = _.cloneDeep(items).map(x => {
            x.checked = false;
            x.products = _.cloneDeep(x.products).map(y => { y.checked = false; return y })
            return x
        })
        provider.item_list = changedItems
        setDupProviders(d)

    }

    const like = (id, value) => {
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let user_data = {
            "provider_id": id,
        }
        let config = {
            headers: headers,
            data: JSON.stringify({ ...user_data }),
            endPoint: user.user_role == 2 ? '/api/favouriteProviderAdd' : '/api/favouriteProviderAdd',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    let d = _.cloneDeep(dupProviders)
                    let providerIndex = d.findIndex(x => x.id == id)
                    d[providerIndex].is_favourite = value == 1 ? 0 : 1
                    setDupProviders(d)
                    showToast(response.message)
                }
                else {
                }

            }).catch(err => {
                console.log("error", err)
            }).finally(() => {
                getFavProvider()
            })
    }
    const dispatch = useDispatch()
    const favs = useSelector(state => state.favorites)?.list
    useEffect(() => {
        let d = _.cloneDeep(dupProviders)
        let fvs = favs?.map(x => x.id)
        d = d.map(x => {
            if (fvs.includes(x.id)) {
                return { ...x, is_favourite: 1 }
            } else {
                return { ...x, is_favourite: 0 }
            }
        })
        setDupProviders(d)
    }, [favs])
    const getFavProvider = () => {
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let config = {
            headers: headers,
            endPoint: '/api/favouriteProviders',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                if (response.status == true) {

                    dispatch(setFavList([...response.data]))
                }
                else {
                    dispatch(setFavList([]))
                }
            }).catch(err => {
            })
    }
    const checkShowAddress = (d) => {
        return Boolean(d)
    }

    const [provider_prices, setProviderPrices] = React.useState([])

    const getTimeInHours = (minute) => {
        let d = parseInt(minute / 60) == 0 ? "" : parseInt(minute / 60) + " Hr"
        if (minute % 60 !== 0) {
            d += ` ${parseInt(minute % 60)} Mins`
        }
        if (Number(minute) == 0) {
            return "0 Mins"

        }
        return `${d}`
    }
    React.useEffect(() => {
        let p_p = []
        if (dupProviders.length > 0) {
            for (let item of dupProviders) {
                let totalServicePrice = item.item_list.filter(x => x.checked).map(x => Number(x.price)).reduce((a, b) => a + b, 0)
                let totalProductPrice = 0
                for (let z of item.item_list) {
                    for (let p of z.products) {
                        if (p.checked) {
                            totalProductPrice += Number(p.price)
                        }
                    }
                }
                let totalPrice = totalServicePrice + totalProductPrice
                p_p.push({ id: item.id, price: totalPrice })
            }
        }
        setProviderPrices(p_p)
    }, [dupProviders])
    return (
        <>
            <StatusBar
                // translucent 
                // backgroundColor={"transparent"} 
                backgroundColor={LS_COLORS.global.green}
                barStyle="light-content" />
            <View style={{ width: '100%', height: '30%' }}>
                <SureModal1
                    title="No provider available on selected date or time.Kindly change the time or select different date"
                    pressHandler={() => {
                        setOpen1(!open1);
                    }}
                    visible={open1}
                    action={() => {
                        props.navigation.goBack()
                        setOpen1(!open1);
                    }}
                />
                <TimeFrame
                    visible={open2}
                    data={dupProviders}
                    starting_time={data.order_start_time}
                    ending_time={data.order_end_time}
                    orderPreviousData={data}
                    mile_distanceP={mile_distanceP}
                    provider_prices={provider_prices}
                    location={data?.order_placed_address}
                    action={(jsonData) => {
                        placeOrder(jsonData)
                        setOpen2(!open2);
                    }}
                    pressHandler={() => {
                        setOpen2(!open2);
                    }}
                    serviceData={selectedItemsWithProviders}
                />

                <ImageBackground
                    resizeMode="cover"
                    source={{ uri: BASE_URL + subService?.image }}
                    style={styles.image}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
                            <View style={{ height: "22%", justifyContent: 'flex-end' }}>
                                <Header
                                    imageUrl={require("../../../assets/backWhite.png")}
                                    action={() => {
                                        props.navigation.navigate("HomeScreen")
                                    }}
                                    imageUrl1={require("../../../assets/homeWhite.png")}
                                    action1={() => {
                                        props.navigation.navigate("HomeScreen")
                                    }}
                                />
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: "center", height: "60%" }}>
                                <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 29, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.white }}>{subService?.name}</Text>
                            </View>
                        </SafeAreaView>
                    </View>
                </ImageBackground>
            </View>
            <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
                <View style={styles.container}>
                    <View style={{ marginTop: 26 }}>
                        <ScrollView showsVerticalScrollIndicator={false} bounces={false} >
                            <View style={{ height: 40, width: '90%', alignSelf: "center", justifyContent: 'space-between', flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => { setFilterModal(true) }} style={{ justifyContent: "center", alignItems: "center", marginRight: 5 }}>
                                    <Image style={{ height: 30, width: 30, alignSelf: "center" }} source={require("../../../assets/filter.png")} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    setPrice(!price)
                                    let data = _.cloneDeep(dupProviders)
                                    if (price) {
                                        data.sort((a, b) => a.totalPrice - b.totalPrice)
                                    }
                                    else {
                                        data.sort((a, b) => b.totalPrice - a.totalPrice)
                                    }
                                    setDupProviders(data)
                                }} style={styles.upper} >
                                    <Text maxFontSizeMultiplier={1.5} style={styles.upperText}>Price</Text>
                                    <Image style={{ height: 10, width: 10 }} source={require("../../../assets/sort.png")} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    setTime(!time)
                                    let data = _.cloneDeep(dupProviders)
                                    if (time) {
                                        data.sort((a, b) => a.timeDuration - b.timeDuration)
                                    } else {
                                        data.sort((a, b) => b.timeDuration - a.timeDuration)
                                    }
                                    setDupProviders(data)
                                }} style={[styles.upper, { marginHorizontal: 5 }]} >
                                    <Text maxFontSizeMultiplier={1.5} style={styles.upperText}>Time</Text>
                                    <Image style={{ height: 10, width: 10 }} source={require("../../../assets/sort.png")} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    setRating(!rating)
                                    let data = _.cloneDeep(dupProviders)
                                    if (rating) {
                                        data.sort((a, b) => a.rating - b.rating)
                                    } else {
                                        data.sort((a, b) => b.rating - a.rating)
                                    }
                                    setDupProviders(data)
                                }} style={styles.upper} >
                                    <Text maxFontSizeMultiplier={1.5} style={styles.upperText}>Rating</Text>
                                    <Image style={{ height: 10, width: 10 }} source={require("../../../assets/sort.png")} />
                                </TouchableOpacity>
                            </View>
                            {/* providers changed to dupProviders */}
                            {dupProviders.length > 0 ?
                                dupProviders.map((item, index) => {
                                    let country = item?.current_address?.split(",")
                                    let countryName = country && country.length > 0 ? country[country.length - 1] : ""
                                    let x = item.timeDuration / 60
                                    let time_format = ""
                                    let itemsLists = item.item_list
                                    let totalTimeOfService = 0
                                    let showTBD = true
                                    for (let i of itemsLists) {
                                        if (i?.time_duration == "" || i?.time_duration == null || i?.time_duration == undefined) {

                                        } else {
                                            totalTimeOfService = Number(totalTimeOfService) + Number(i?.time_duration)
                                            time_format = getTimeInHours(totalTimeOfService)
                                            showTBD = false
                                        }
                                    }
                                    if (showTBD) {
                                        time_format = "To be determined"
                                    }
                                    let totalServicePrice = item.item_list.filter(x => x.checked).map(x => Number(x.price)).reduce((a, b) => a + b, 0)
                                    let totalProductPrice = 0

                                    let showDistanceOrNot = false
                                    for (let z of item.item_list) {
                                        for (let p of z.products) {
                                            if (p.item_products_is_per_mile == "1") {
                                                showDistanceOrNot = true
                                            }
                                            if (p.checked) {
                                                let p_price = p.price
                                                if (p.item_products_is_per_mile == "1") {
                                                    p_price = Number(p.price) * lodash.round(Number(data.mile_distance), 2)
                                                }
                                                totalProductPrice = lodash.round(totalProductPrice, 2) + lodash.round(p_price, 2)

                                            }
                                        }
                                    }
                                    let totalPrice = 3.5
                                    totalPrice += Number(totalServicePrice) + Number(totalProductPrice)
                                    let is_business_licensed = false
                                    let is_certified = false
                                    let is_insauranced = false
                                    if (item?.questionnaire_data?.length > 0) {
                                        is_business_licensed = item?.questionnaire_data[0]?.is_business_licensed == "1"
                                        is_certified = item?.questionnaire_data[0]?.is_certified == "1"
                                        is_insauranced = item?.questionnaire_data[0]?.is_insauranced == "1"
                                    }
                                    let checked_g = item.item_list.filter(i => i.checked).length > 0
                                    return <View key={index} style={[styles.alexiContainer,{shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.23,
                                    shadowRadius: 2.62,
                                    
                                    elevation: 4,}]}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Pressable onPress={() => {
                                                props.navigation.navigate("ProviderDetail", { providerId: item.id, service: subService?.name, service_id: subService?.id, list: true })
                                            }} style={{ flexDirection: 'row' }}>
                                                <View style={{ height: 80, width: 80, borderRadius: 50, overflow: 'hidden', borderWidth: 0.5, borderColor: LS_COLORS.global.placeholder }}>
                                                    <Image
                                                        style={{ height: '100%', width: '100%' }}
                                                        source={item.profile_image !== null ? { uri: BASE_URL + item.profile_image } : require('../../../assets/user.png')}
                                                        resizeMode='cover'
                                                    />
                                                </View>
                                                <View style={{ flexDirection: 'column', marginLeft: "5%", }}>
                                                    <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 16, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.green }}>{item.first_name}</Text>
                                                    {Boolean(item?.business_name) && <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 16, fontStyle: "italic", color: LS_COLORS.global.black }}>{item?.business_name}</Text>}
                                                    <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsRegular }}>{countryName.trim()}</Text>
                                                </View>
                                            </Pressable>
                                            <View style={{ paddingTop: 10, flex: 1, alignItems: "flex-end" }}>
                                                <TouchableOpacity onPress={() => { like(item.id, item.is_favourite) }} style={{ height: 20, width: 25, justifyContent: "center", alignItems: 'center' }}>
                                                    {item.is_favourite === 1
                                                        ?
                                                        <Image style={{ height: 18, width: 21 }} source={require('../../../assets/heartGreen.png')} resizeMode="cover" />
                                                        :
                                                        <Image style={{ height: 18, width: 21 }} source={require('../../../assets/whiteHeart.png')} resizeMode="cover" />
                                                    }
                                                </TouchableOpacity>
                                                {checked_g && <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                                    <CheckBox
                                                        checked={checked_g}
                                                        onPress={() => {
                                                            onGlobCheckBoxClicked(index)
                                                        }}
                                                        containerStyle={{ marginHorizontal: 0, paddingHorizontal: 0 }}
                                                        checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/checked.png")} />}
                                                        uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/unchecked.png")} />}
                                                    />
                                                    <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 16, fontFamily: LS_FONTS.PoppinsSemiBold, color: LS_COLORS.global.green, marginTop: 15 }}>${Number(totalPrice).toFixed(2)}</Text>
                                                </View>}
                                            </View>
                                        </View>
                                        {!open ?
                                            <Text maxFontSizeMultiplier={1.5} numberOfLines={1} onPress={() => setOpen(!open)} style={{ fontSize: 14, marginLeft: 10, marginTop: 10, fontFamily: LS_FONTS.PoppinsRegular }}>{item.tagline}</Text>
                                            :
                                            <Text maxFontSizeMultiplier={1.5} onPress={() => setOpen(!open)} style={{ fontSize: 14, marginLeft: 10, marginTop: 10, fontFamily: LS_FONTS.PoppinsRegular }}>{item.tagline}</Text>
                                        }
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 10 }}>
                                            {is_certified && <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 5, }}>
                                                <Image source={require("../../../assets/profile/certify.png")} style={{ height: 15, width: 12 }} resizeMode="contain" />
                                                <Text maxFontSizeMultiplier={1.2} style={{ textAlign: "center", fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.global.black, marginLeft: 5 }}>Certified</Text>
                                            </View>}
                                            {is_business_licensed && <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 5, }}>
                                                <Image source={require("../../../assets/profile/license.png")} style={{ height: 15, width: 15 }} resizeMode="contain" />
                                                <Text maxFontSizeMultiplier={1.2} style={{ textAlign: "center", fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.global.black, marginLeft: 5 }}>Licensed</Text>
                                            </View>}
                                            {is_insauranced && <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 5, }}>
                                                <Image source={require("../../../assets/profile/insured.png")} style={{ height: 15, width: 15 }} resizeMode="contain" />
                                                <Text maxFontSizeMultiplier={1.2} style={{ textAlign: "center", fontFamily: LS_FONTS.PoppinsRegular, fontSize: 12, color: LS_COLORS.global.black, marginLeft: 5 }}>Insured</Text>
                                            </View>}
                                        </View>
                                        <View style={{ width: 120, flexDirection: "row", overflow: "hidden", justifyContent: "space-evenly", alignItems: "center" }}>
                                            <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.green, }}> {"Rating"}</Text>

                                            <Rating
                                                readonly={true}
                                                imageSize={10}
                                                type="custom"
                                                // ratingBackgroundColor="white"
                                                ratingColor="#04BFBF"
                                                // tintColor="white"
                                                startingValue={Number(item.rating ?? 0)}
                                            />
                                        </View>
                                        {checkShowAddress(Number(item?.address_is_public) && Number(item?.service_is_at_address)) && <Text maxFontSizeMultiplier={1.5} style={{ marginHorizontal: 10, fontSize: 13, fontFamily: LS_FONTS.PoppinsRegular }}>Services will be provided at this address : <Text style={{ textAlign: "right" }}>{item?.address?.address_line_1}</Text></Text>}
                                        {(checkShowAddress(Number(item?.service_is_at_address)) || showDistanceOrNot) && <Text maxFontSizeMultiplier={1.5} style={{ marginHorizontal: 10, fontSize: 13, fontFamily: LS_FONTS.PoppinsRegular }}>Distance : {checkShowAddress(Number(item?.service_is_at_address)) ? lodash.round(mile_distanceP[`${item?.id}`] ?? 0, 2) : lodash.round(data.mile_distance, 2)} miles</Text>}

                                        <View style={{ marginLeft: 10 }}>
                                            {Boolean(ordered_variant?.variant_title) && <Text maxFontSizeMultiplier={1.5}
                                                style={[{ color: LS_COLORS.global.green, fontFamily: LS_FONTS.PoppinsRegular, }, { textAlign: "left", fontSize: 13, }]}><Text style={{ color: "black" }}>{ordered_variant?.variant_title}:</Text> {String(ordered_variant?.variant).toUpperCase()}</Text>}
                                            <View style={{}}>
                                                {ordered_variant?.variant_title == "Vehicle Type" && <Text maxFontSizeMultiplier={1.5}
                                                    style={[{ color: LS_COLORS.global.green, fontFamily: LS_FONTS.PoppinsRegular, }, { textAlign: "left", fontSize: 13, }]}><Text style={{ color: "black" }}>Make:</Text> {ordered_variant?.make}</Text>}
                                                {ordered_variant?.variant_title == "Vehicle Type" && <Text maxFontSizeMultiplier={1.5}
                                                    style={[{ color: LS_COLORS.global.green, fontFamily: LS_FONTS.PoppinsRegular, }, { textAlign: "left", fontSize: 13, }]}><Text style={{ color: "black" }}>Model:</Text> {ordered_variant?.model}</Text>}
                                                {ordered_variant?.variant_title == "Vehicle Type" && <Text maxFontSizeMultiplier={1.5}
                                                    style={[{ color: LS_COLORS.global.green, fontFamily: LS_FONTS.PoppinsRegular, }, { textAlign: "left", fontSize: 13, }]}><Text style={{ color: "black" }}>Year:</Text> {ordered_variant?.year}</Text>}
                                            </View>
                                        </View>

                                        {/* <Text  maxFontSizeMultiplier={1.5} style={{ marginHorizontal: 10, fontSize: 13, fontFamily: LS_FONTS.PoppinsRegular }}>Distance : {data.mile_distance?.toFixed(2)} miles</Text> */}
                                        <View style={{ height: 1, width: '95%', alignSelf: 'center', borderWidth: 0.7, borderColor: "#00000029", marginTop: 10 }}></View>
                                        {item.item_list.map((i, iIndex) => {
                                            let x = i.time_duration / 60
                                            let time_format = ""
                                            if (x > 1) {
                                                time_format = parseInt(x) + " hr " + i.time_duration % 60 + " min"
                                            } else {
                                                time_format = i.time_duration + " min"
                                            }
                                            let service_id = i.service_item_id
                                            let extra = extraData?.find(x => x.parent_id == service_id)
                                            return (
                                                <>
                                                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10, alignItems: "center" }}>
                                                        <Text maxFontSizeMultiplier={1.4} style={{ fontSize: 12, flex: 1, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium, }}>{i.service_items_name + "(Service)"}</Text>
                                                        <View style={{ height: 25, flexDirection: "row", }}>
                                                            <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium }}>{i.price == "" ? "TBD" : "$" + Number(i.price).toFixed(2)}</Text>
                                                            <CheckBox
                                                                checked={i.checked}
                                                                onPress={() => {
                                                                    onCheckBoxClicked(!i.checked, index, iIndex, null)
                                                                }}
                                                                checkedIcon={<Image style={{ height: 18, width: 17, resizeMode: 'contain', bottom: 5 }} source={require("../../../assets/checked.png")} />}
                                                                uncheckedIcon={<Image style={{ height: 18, width: 17, resizeMode: 'contain', bottom: 5 }} source={require("../../../assets/unchecked.png")} />}
                                                            />
                                                        </View>
                                                    </View>
                                                    {i.products.map((itemData, prIndex) => {
                                                        let productTitle = "(Product)"
                                                        let price = itemData?.price
                                                        if (itemData.item_products_is_per_mile == "1") {
                                                            productTitle = `(Product) $${price}/Mile`
                                                            let m = 0
                                                            m = lodash.round(Number(data?.mile_distance), 2)
                                                            price = lodash.round(lodash.round(Number(itemData?.price), 2) * m, 2)

                                                        }
                                                        let type = itemData.type
                                                        let isPriced = true
                                                        if (type == "other") {
                                                            productTitle = "(Other Product)"
                                                            isPriced = false
                                                        } else if (type == "have_own") {
                                                            productTitle = "(Have Own Product)"
                                                            isPriced = false
                                                        } else if (type == "need_recommendation") {
                                                            productTitle = ""
                                                            isPriced = false
                                                        }
                                                        return (
                                                            <View style={{ justifyContent: 'space-between', alignItems: "center", flexDirection: 'row', marginTop: 10 }} >
                                                                <View style={{ flex: 1 }} >
                                                                    <Text maxFontSizeMultiplier={1.5} style={{ marginLeft: 20 }}>
                                                                        <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 12, marginLeft: 15, fontFamily: LS_FONTS.PoppinsMedium, }}>{itemData.item_products_name + productTitle}</Text>
                                                                    </Text>
                                                                </View>
                                                                <View style={{ height: 20, flexDirection: "row" }}>
                                                                    {isPriced && <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium }}>{price == "" ? "TBD" : "$" + Number(price).toFixed(2)}</Text>}
                                                                    <CheckBox
                                                                        checked={itemData.checked}
                                                                        onPress={() => {
                                                                            onCheckBoxClicked(!itemData.checked, index, iIndex, prIndex)
                                                                        }}
                                                                        checkedIcon={<Image style={{ height: 18, width: 17, bottom: 5, resizeMode: 'contain' }} source={require("../../../assets/checked.png")} />}
                                                                        uncheckedIcon={<Image style={{ height: 18, width: 17, bottom: 5, resizeMode: 'contain' }} source={require("../../../assets/unchecked.png")} />}
                                                                    />
                                                                </View>
                                                            </View>
                                                        )
                                                    })}
                                                </>
                                            )
                                        })}
                                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                            <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.green }}>Estimated Time</Text>
                                            <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 12, marginRight: 15, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.green }}>{time_format}</Text>
                                        </View>
                                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                            <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.green }}>LyfeSuite Application Fee</Text>
                                            <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 12, marginRight: 15, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.green }}>$3.50</Text>
                                        </View>
                                    </View>
                                })
                                :
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    {!loading && <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 16, marginTop: 10 }}>No Providers Found</Text>}
                                </View>
                            }
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.save}
                            activeOpacity={0.7}
                            onPress={() => {
                                // props.navigation.navigate("MainDrawer",{screen:"Orders"})
                                if (cards.length == 0) {
                                    showToast("Please add payment method before requesting any service")
                                    props.navigation.navigate("AddCard", { type: "add" })
                                    return
                                }
                                let requiredSevices = JSON.parse(data.json_data)?.items
                                let z = []
                                for (let p of dupProviders) {
                                    for (let item of p.item_list) {
                                        if (item.checked) {
                                            z.push(item.service_item_id)
                                        }
                                    }
                                }
                                //    console.log(z)
                                // if (_.isEqual(requiredSevices.sort((a, b) => a - b), z.sort((a, b) => a - b))) {
                                if (z.length > 0) {
                                    setOpen2(!open2)
                                } else {
                                    showToast("Please select atleast on service from service provider list.")
                                    // showToast("Please select service provider for all the service listed.")
                                }
                            }}>
                            <Text maxFontSizeMultiplier={1.5} style={styles.saveText}>Request</Text>
                        </TouchableOpacity>
                        <View style={{ height: 10 }}></View>
                    </View>
                </View>
                {loading && <Loader />}
            </SafeAreaView>
            <FilterModal
                visible={filterModal}
                setVisible={setFilterModal}
                getFilteredData={(data, my_location) => getProviders(data, true, my_location)}
            />
        </>
    )
}

export default Mechanics;





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
    save: {
        justifyContent: "center",
        alignItems: 'center',
        height: 45,
        width: 122,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 6,
        alignSelf: 'center',
        marginTop: Platform.OS =='ios'?4:10
    },
    saveText: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    },
    alexiContainer: {
        width: "90%",
        alignSelf: 'center',
        borderRadius: 6,
        padding: 10,
        marginTop: 10,
    },
    upper: {
        justifyContent: "center",
        alignItems: 'center',
        height: 30,
        width: 85,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 100,
        alignSelf: 'center',
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    upperText: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsRegular,
        color: LS_COLORS.global.white
    }

})





