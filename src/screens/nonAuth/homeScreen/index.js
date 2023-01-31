import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Image, Text, SafeAreaView, ScrollView, TouchableOpacity, FlatList, BackHandler, Platform, PermissionsAndroid, Pressable, RefreshControl } from 'react-native'
import messaging from '@react-native-firebase/messaging';
import { getUniqueId, getManufacturer } from 'react-native-device-info';

/* Constants */
import LS_COLORS from '../../../constants/colors';
import { globalStyles } from '../../../utils';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import SortableGrid from 'react-native-sortable-grid-with-fixed'

/* Components */
import Cards from '../../../components/cards';
import UserCards from '../../../components/userCards';
import { BASE_URL, getApi } from '../../../api/api';
import { loginReducer, setServices } from '../../../redux/features/loginReducer';
import Loader from '../../../components/loader';
import { setMyJobs } from '../../../redux/features/provider';
import { retrieveItem, showToast } from '../../../components/validators';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { setAddServiceMode } from '../../../redux/features/services';
import Geolocation from 'react-native-geolocation-service';
import RNGooglePlaces from 'react-native-google-places';
import { role } from '../../../constants/globals';
import { getStringData, storeStringData } from '../../../asyncStorage/async'
import moment from 'moment';
import { updateBankModelData } from '../../../redux/features/bankModel';
import { updateSignupModal } from '../../../redux/features/signupModal';
import { updateBlockModal } from '../../../redux/features/blockModel';
import ReviewBusiness from '../../../components/ReviewBusiness';
import { setQOpen, setQService, setQuestionTypes } from '../../../redux/features/questionaire.model';

const HomeScreen = (props) => {
    const dispatch = useDispatch()
    const navigation = useNavigation();
    const user = useSelector(state => state.authenticate.user)
    const userType = useSelector(state => state.authenticate.type)

    const services = useSelector(state => state.authenticate.services)
    const myJobs = useSelector(state => state.provider.myJobs)
    const access_token = useSelector(state => state.authenticate.access_token)
    const switched = useSelector(state => state.switchTo)?.switched
    const [isAddJobActive, setIsAddJobActive] = useState(false)
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState([...services])
    const [order, setOrder] = useState([])
    const [scrollEnabled, setScrollEnabled] = React.useState(true)
    const showDot = useSelector(state => state.dot)?.showDot

    useEffect(() => {
        // props.navigation.navigate("ProviderDetail", { providerId: 59, service: "eMas" })
        const backAction = () => {
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            // return
        })

    }, [navigation]);

    const GetToken = async () => {
        let updateDay = "0"
        try {
            updateDay = await getStringData("@last_fcm_updated")
        } catch (err) {

        }
        const authorizationStatus = await messaging().requestPermission();
        if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
            const token = await messaging().getToken()
            if (updateDay != moment().format("DD")) {
                updateFCMToken(token)
            }
        }
    }
    useEffect(() => {
        if (userType !== "guest") {
            getServices(true)
            if (switched == false) {
                if (user.user_role == 3) {
                    getMyJobs()
                }
            }
        }

    }, [switched, userType])

    useEffect(() => {
        if (userType != "guest") {
            getServices(true)
            if (user.user_role == 3) {
                getMyJobs()
            }
            setTimeout(() => {
                GetToken()
            }, 15000)
            setTimeout(() => {
                getConnectAccountDetail()
            }, 300);
        } else {
            getGuestServices(true)
        }
    }, [])
    const [allowJobAdd, setAllowedJobAdd] = React.useState(false)
    const [refreshload, setRefreshLoad] = React.useState(false)

    const getConnectAccountDetail = async () => {
        try {
            let headers = {
                'Content-Type': 'multipart/form-data',
                "Authorization": `Bearer ${access_token}`
            }
            let config = {
                headers: headers,
                data: JSON.stringify({}),
                endPoint: '/api/isAccountSetupDetail',
                type: 'post'
            }
            let response = await getApi(config)
            console.log("REsponse Account details", response)
            if (response.status == true) {
                if (response.data) {
                    if (response.data.email && response.data.details_submitted) {
                        setAllowedJobAdd(true)
                    } else {
                        setAllowedJobAdd(false)


                    }
                }
            }
            else {
                // showToast(response.message, 'danger')
                setAllowedJobAdd(false)
            }
            // setAllowedJobAdd(false)
        } catch (err) {
            setAllowedJobAdd(false)
            // return false
        }
    }
    useFocusEffect(
        React.useCallback(() => {
            if (userType !== "guest") {
                if (user.user_role == 3) {
                    setTimeout(() => {
                        getLocationPermission()
                    }, 2000)
                }
            }
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            if (userType !== "guest") {
                dispatch(setAddServiceMode({ data: false }))
            }

        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            if (userType != "guest") {
                if (props.route?.params) {
                    if (props.route?.params.addJobClear) {
                        setIsAddJobActive(false)
                    }
                }
                getServices(false)
            }

        }, [props.route,])
    );

    const updateFCMToken = (token) => {

        let headers = {
            "Authorization": `Bearer ${access_token}`
        }

        let data = new FormData()
        data.append("device_id", getUniqueId())
        data.append("fcm_token", token)

        let config = {
            headers: headers,
            data: data,
            endPoint: user.user_role == role.customer ? '/api/customerFcmUpdate' : '/api/providerFcmUpdate',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                console.log(response)
                if (response.status == true) {
                    storeStringData("@last_fcm_updated", moment().format("DD"))
                }
                else {


                }
            }).catch(err => {

            }).finally(() => {

            })
    }

    const getGuestServices = (load = true) => {

        setLoading(true)

        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
        }
        let user_data = {
            "user_id": user.id
        }
        let config = {
            headers: headers,
            data: JSON.stringify({ ...user_data }),
            endPoint: '/api/guestCustomerServicesList',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                console.log(response)
                if (response.status == true) {
                    dispatch(setServices({ data: [...response.data] }))
                    setItems([...response.data])
                }
                else {
                    // showToast(response.message, 'danger')

                }
            }).catch(err => {

            }).finally(() => {
                setLoading(false)
            })
    }

    const getServices = (load = true) => {
        if (load) {
            setLoading(true)
        }
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
            endPoint: user.user_role == 2 ? '/api/servicesList' : '/api/providerServicesList',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                console.log(response)
                if (response.status == true) {
                    dispatch(setServices({ data: [...response.data] }))
                    setItems([...response.data])

                }
                else {
                    // showToast(response.message, 'danger')

                }
            }).catch(err => {

            }).finally(() => {

                setTimeout(() => {
                    setLoading(false)
                    setRefreshLoad(false)
                }, 1500)
            })
    }

    const getList = (a) => {
        try {
            console.log("a", a)
            setLoading(true)
            let headers = {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${access_token}`
            }
            var formdata = new FormData();
            formdata.append("services_json", JSON.stringify(a));
            let config = {
                headers: headers,
                data: formdata,
                endPoint: '/api/customerServicesListingAdd',
                type: 'post'
            }
            getApi(config)
                .then((response) => {
                    console.log("Response===>>>", response)
                    if (response.status == true) {

                    }
                    else {
                        showToast(response.message, 'danger')

                    }
                }).catch(err => {
                    console.log("error", err)

                }).finally(() => {
                    setTimeout(() => {
                        setLoading(false)
                    }, 1500)

                })
        } catch (err) {
            console.log("Error", err)
            setLoading(false)
        }

    }

    const getMyJobs = (load = true) => {
        if (load) {
            setLoading(true)
        }

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
                console.log("/api/providerAddedServicesList", response)
                if (response.status == true) {
                    dispatch(setMyJobs({ data: [...response.data] }))
                    setLoading(false)
                }
                else {
                    setLoading(false)
                }
            }).catch(err => {
                setLoading(false)
            })
    }

    const deleteMyJob = (service_id) => {

        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let user_data = {
            "service_id": service_id
        }
        let config = {
            headers: headers,
            data: JSON.stringify(user_data),
            endPoint: '/api/deleteAddedServices',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    getMyJobs()
                }
                else {
                    showToast(response.message, "error")
                    setLoading(false)
                }
            }).catch(err => {
                setLoading(false)
            })
    }

    const goToItems = (item) => {
        dispatch(setAddServiceMode({ data: true })),
        props.navigation.navigate("ServicesProvided", { subService: item, items: [...item.itemsData] })
    }

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

    React.useEffect(() => {
        console.log("#liahs", "items", items, "mysJobs", myJobs)
    }, [items, myJobs])

    const getCurrentLocation = (hasLocationPermission) => {
        if (hasLocationPermission) {
            getCurrentPlace()
        } else {
            alert("Location permission denied")
        }
    }

    const getCurrentPlace = () => {
        RNGooglePlaces.getCurrentPlace(['placeID', 'location', 'name', 'address'])
            .then((results) => {
                let locationData = {
                    lat: results[0].location.latitude,
                    long: results[0].location.longitude,
                    address: results[0].address
                }
                updateLocation(locationData)
            })
            .catch((error) => console.log("results error => ", error.message))
            .finally(() => {
            })
    }

    const updateLocation = (data) => {
        let headers = {
            "Authorization": `Bearer ${access_token}`
        }

        var formdata = new FormData();
        formdata.append("address", data.address);
        formdata.append("lat", data.lat);
        formdata.append("long", data.long);

        let config = {
            headers: headers,
            data: formdata,
            endPoint: '/api/provider_location_update',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
            }).catch(err => {
                console.warn("updateLocation err =>> ", err)
            })
    }

    const getUserData = async () => {
        try {
            let headers = {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            }
            let user_data = {
                "user_id": user.id,
            }
            let config = {
                headers: headers,
                data: JSON.stringify(user_data),
                endPoint: user.user_role == role.customer ? '/api/customer_detail' : '/api/provider_detail',
                type: 'post'
            }
            const response = await getApi(config)
            if (response.status == true) {
                dispatch(loginReducer(response.data))
            }
        } catch (err) {
            console.warn(err)
        }

    }
    const [selectedItem, setSelectedItem] = useState(null)
    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={{ ...styles.image,  /* TEMP -> */ borderRadius: 0, width: 30 /* <- TEMP */ }}
                        onPress={() => { props.navigation.openDrawer() /* props.navigation.navigate("Profile") */ }}>
                        <Image
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="contain"
                            source={require('../../../assets/menu.png') /* user.profile_image ? { uri: BASE_URL + user.profile_image } : require("../../../assets/user.png") */}
                        />
                        {showDot && <View style={{ height: 10, width: 10, backgroundColor: "red", top: 0, right: 0, position: "absolute", borderRadius: 10 }} />}
                    </TouchableOpacity>
                    <View style={{ flex: 1, paddingHorizontal: '5%' }}>
                    </View>
                    {user.user_role == 2
                        ?
                        <TouchableOpacity style={styles.search}
                            activeOpacity={0.7}
                            onPress={() => { props.navigation.navigate('Search') }}>
                            <Image
                                style={styles.searchImage}
                                source={require("../../../assets/search.png")}
                            />
                        </TouchableOpacity>
                        :
                        null
                    }
                </View>
                {user.user_role == 3 && <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 25, marginBottom: 15, backgroundColor: isAddJobActive ? 'rgba(0,0,0,0.2)' : LS_COLORS.global.white, alignSelf: 'flex-start', padding: 5, borderRadius: 8 }} activeOpacity={0.7}
                    onPress={() => {
                        getConnectAccountDetail()
                        setIsAddJobActive(!isAddJobActive)
                    }}>
                    <View style={{ height: 30, aspectRatio: 1, justifyContent: "center", alignItems: "center" }}>
                        {!isAddJobActive && <Image source={require('../../../assets/addgreen.png')} resizeMode="contain" style={{ width: '100%', height: '100%' }} />}
                        {isAddJobActive && <View style={{ height: 30, width: 30, borderRadius: 20, backgroundColor: LS_COLORS.global.green, justifyContent: "center", alignItems: "center" }}>
                            <View style={{ height: 2, width: 18, backgroundColor: "white" }} />
                        </View>}
                    </View>
                    <Text maxFontSizeMultiplier={1.6} style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 18, letterSpacing: 0.36, color: LS_COLORS.global.black, marginLeft: 11 }}>ADD SERVICE</Text>
                </TouchableOpacity>}
                {user.user_role == 3
                    ?
                    isAddJobActive
                        ?
                        <View style={{ flex: 1, paddingTop: '5%' }}>
                            <FlatList
                                refreshControl={<RefreshControl
                                    refreshing={refreshload}
                                    onRefresh={() => {
                                        setRefreshLoad(true)
                                        getServices(false)
                                        getConnectAccountDetail()
                                        getUserData()
                                        getMyJobs(false)
                                    }}
                                />}
                                data={items}
                                numColumns={2}
                                columnWrapperStyle={{ justifyContent: 'space-between' }}
                                renderItem={({ item, index }) => {
                                    return (
                                        <Cards
                                            title1={item.name}
                                            title2="SERVICES"
                                            imageUrl={{ uri: BASE_URL + item.image }}
                                            action={() => {
                                                if (user?.user_status == 3) {
                                                    dispatch(updateBlockModal(true))
                                                    return
                                                }
                                                if (allowJobAdd) {
                                                    item.itemsData.length > 0
                                                        ?
                                                        goToItems(item)
                                                        :
                                                        props.navigation.navigate("SubServices", { service: item })
                                                } else {
                                                    dispatch(updateBankModelData({
                                                        data: {
                                                            title: "Select Account",
                                                            subtitle: "You do not have any active accounts.",
                                                            buttonTitle: "Add Stripe Account",
                                                            type: "provider",
                                                            open: true
                                                        }
                                                    }))
                                                }

                                            }}
                                        />
                                    )
                                }}
                                keyExtractor={(item, index) => index}
                            />
                        </View>
                        :
                        myJobs.length > 0
                            ?
                            <FlatList
                                data={[...myJobs]}
                                numColumns={2}
                                refreshControl={<RefreshControl
                                    refreshing={refreshload}
                                    onRefresh={() => {
                                        setRefreshLoad(true)
                                        getServices(false)
                                        getConnectAccountDetail()
                                        getMyJobs()
                                        getUserData()
                                    }}
                                />}
                                columnWrapperStyle={{ justifyContent: 'space-between' }}
                                renderItem={({ item, index }) => {
                                    return (
                                        <Cards
                                            title1={item.name}
                                            imageUrl={{ uri: BASE_URL + item.image }}
                                            action={() => {
                                                // console.log()
                                                console.log(item)
                                                if (user?.user_status == 3) {
                                                    dispatch(updateBlockModal(true))
                                                } else {
                                                    setSelectedItem(item)
                                                    // if (item?.is_certified == "1" || item?.is_insauranced == "1" || item?.is_business_licensed == "1") {
                                                    //     dispatch(setQService(item?.id))
                                                    //     dispatch(setQuestionTypes({ is_certified: Number(item?.is_certified), is_insauranced: Number(item?.is_insauranced), is_business_licensed: Number(item?.is_business_licensed) }))
                                                    //     dispatch(setQOpen(true))
                                                    // } else {
                                                        props.navigation.navigate("ServicesProvided", { subService: item });
                                                    // }
                                                }

                                            }}
                                            showDelete={true}
                                            deleteService={() => {
                                                deleteMyJob(item.id)
                                            }}
                                        />
                                    )
                                }}
                                keyExtractor={(item, index) => index}
                            />
                            :
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                {!loading && <Text maxFontSizeMultiplier={1.7} style={{ fontFamily: LS_FONTS.PoppinsSemiBold, fontSize: 16 }}>No Jobs Added Yet</Text>}
                            </View>
                    :
                    <ScrollView
                        refreshControl={<RefreshControl refreshing={refreshload} onRefresh={() => {
                            setRefreshLoad(true)
                            if (userType != "guest") {
                                getServices(false)
                                getUserData()
                            } else {
                                getGuestServices(false)

                            }
                        }} />}
                        scrollEnabled={scrollEnabled}
                        showsVerticalScrollIndicator={false}>
                        <View style={{ flex: 1, paddingTop: '5%' }}>
                            <SortableGrid
                                blockTransitionDuration={400}
                                activeBlockCenteringDuration={500}
                                itemsPerRow={2}
                                dragActivationTreshold={300}
                                onDragRelease={(itemOrder) => {
                                    setScrollEnabled(true)
                                    let arr = []
                                    itemOrder.itemOrder.map((itemData,) => {
                                        arr.push(items[itemData.key].id)
                                        setOrder(arr)
                                    })
                                    console.log("arr", arr)
                                    getList(arr)
                                    console.log("Drag was released, the blocks are in the following order: ", arr)
                                }}
                                onDragStart={() => {
                                    setScrollEnabled(false)
                                }}>
                                {items.map((item, index) =>
                                    <View key={index}
                                        style={{ alignItems: 'center', justifyContent: 'center' }}
                                        onTap={() => {
                                            if (user?.user_status == 3) {
                                                dispatch(updateBlockModal(true))
                                            } else {
                                                item.itemsData.length > 0
                                                    ?
                                                    props.navigation.navigate("ServicesProvided", { subService: item, items: [...item.itemsData] })
                                                    :
                                                    props.navigation.navigate("SubServices", { service: item })
                                            }

                                        }}
                                    >
                                        <UserCards
                                            title1={item.name}
                                            title2="SERVICES"
                                            imageUrl={{ uri: BASE_URL + item.image }}
                                        />
                                    </View>
                                )}
                            </SortableGrid>
                        </View>
                    </ScrollView>
                }
                {!loading && <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => {
                        if (userType == "guest") {
                            dispatch(updateSignupModal(true))
                        } else {
                            props.navigation.navigate("Orders")
                        }


                    }} style={[styles.orderContainer, { paddingHorizontal: 3 }]}>
                        <View

                        >
                            <Text maxFontSizeMultiplier={1.4} style={[styles.order]}>
                                MY ORDERS
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {user.user_role == 3 && <TouchableOpacity activeOpacity={0.7} onPress={() => {
                        if (user?.user_status == 1) {
                            props.navigation.navigate("LocationServiceSelect")
                        } else {
                            dispatch(updateBlockModal(true))
                        }

                    }} style={[styles.orderContainer, { paddingHorizontal: 3, marginHorizontal: 5 }]}>
                        <View

                        >
                            <Text maxFontSizeMultiplier={1.4} style={styles.order}>
                                LOCATION
                            </Text>
                        </View>
                    </TouchableOpacity>}
                    {user.user_role == 3 && <TouchableOpacity activeOpacity={0.7}
                        onPress={() => {
                            if (user?.user_status == 1) {
                                props.navigation.navigate('ScheduleTime', { serviceData: {} })
                            } else {
                                dispatch(updateBlockModal(true))
                            }
                        }} style={[styles.orderContainer, { paddingHorizontal: 3 }]}>
                        <View
                        >
                            <Text maxFontSizeMultiplier={1.4} style={[styles.order]}>
                                SCHEDULE
                            </Text>
                        </View>
                    </TouchableOpacity>}
                </View>}
            </View>
            {loading && <Loader />}
            <ReviewBusiness
                pressHandler={() => {
                    dispatch(setQOpen(false))
                }}
                onPressNext={() => {
                    dispatch(setQOpen(false))
                    props.navigation.navigate("ServicesProvided", { subService: selectedItem });
                }} />
        </SafeAreaView>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
        padding: 20
    },
    image: {
        resizeMode: 'contain',
        width: 44,
        // height: 44,
        aspectRatio: 1,
        borderRadius: 50
    },
    search: {
        width: 44,
        height: 44,
        borderRadius: 100,
        borderColor: LS_COLORS.global.lightGrey,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchImage: {
        resizeMode: 'contain',
        width: 17,
        height: 17,
    },
    orderContainer: {
        justifyContent: "center",
        alignItems: 'center',
        // position: 'absolute',
        // bottom: "4%",
        minHeight: 32,
        // width: 110,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 28,
        alignSelf: 'center',
        width: '30%'
    },
    order: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    }
})


