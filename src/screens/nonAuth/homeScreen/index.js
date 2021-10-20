import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Image, Text, SafeAreaView,ScrollView, TouchableOpacity, FlatList, BackHandler, Platform, PermissionsAndroid, Pressable } from 'react-native'

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
import { setServices } from '../../../redux/features/loginReducer';
import Loader from '../../../components/loader';
import { setMyJobs } from '../../../redux/features/provider';
import { showToast } from '../../../components/validators';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { setAddServiceMode } from '../../../redux/features/services';
import Geolocation from 'react-native-geolocation-service';
import RNGooglePlaces from 'react-native-google-places';

const HomeScreen = (props) => {
    const dispatch = useDispatch()
    const navigation = useNavigation();
    const user = useSelector(state => state.authenticate.user)
    const services = useSelector(state => state.authenticate.services)
    const myJobs = useSelector(state => state.provider.myJobs)
    const access_token = useSelector(state => state.authenticate.access_token)
    const [isAddJobActive, setIsAddJobActive] = useState(false)
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState([...services])
    const [order, setOrder] = useState([])
    const [orders, setOrders] = useState()
    const [scrollEnabled,setScrollEnabled]=React.useState(true)
    useEffect(() => {
        const backAction = () => {
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    }, []);

    useEffect(() => (
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
        })
    ), [navigation]);

    useEffect(() => {
        getServices()
        if (user.user_role == 3) {
            getMyJobs()
        }
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            if (user.user_role == 3) {
                getLocationPermission()
            }
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            dispatch(setAddServiceMode({ data: false }))
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            if (props.route?.params) {
                if (props.route?.params.addJobClear) {
                    setIsAddJobActive(false)
                }
            }
        }, [props.route])
    );

    const getServices = () => {
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
            endPoint: user.user_role == 2 ? '/api/servicesList' : '/api/providerServicesList',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                console.log(response)
                if (response.status == true) {
                    dispatch(setServices({ data: [...response.data] }))
                    setItems([...response.data])
                    setLoading(false)
                }
                else {
                    showToast(response.message, 'danger')
                    setLoading(false)
                }
            }).catch(err => {
                setLoading(false)
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
                        setLoading(false)
                    }
                    else {
                        showToast(response.message, 'danger')
                        setLoading(false)
                    }
                }).catch(err => {
                    console.log("error", err)
                    setLoading(false)
                })
        } catch (err) {
            console.log("Error", err)
        }

    }

    const getMyJobs = () => {
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
            Accept: "application/json",
            "Content-Type": "application/json",
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
                console.log("updateLocation err =>> ", err)
            })
    }

    return (
        <SafeAreaView style={globalStyles.safeAreaView}>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={{ ...styles.image, overflow: 'hidden', /* TEMP -> */ borderRadius: 0, width: 30 /* <- TEMP */ }}
                        onPress={() => { props.navigation.openDrawer() /* props.navigation.navigate("Profile") */ }}>
                        <Image
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="contain"
                            source={require('../../../assets/menu.png') /* user.profile_image ? { uri: BASE_URL + user.profile_image } : require("../../../assets/user.png") */}
                        />
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
                {user.user_role == 3 && <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 25, marginBottom: 15, backgroundColor: isAddJobActive ? 'rgba(0,0,0,0.2)' : LS_COLORS.global.white, alignSelf: 'flex-start', padding: 5, borderRadius: 8 }} activeOpacity={0.7} onPress={() => setIsAddJobActive(!isAddJobActive)}>
                    <View style={{ height: 30, aspectRatio: 1 }}>
                        <Image source={require('../../../assets/addgreen.png')} resizeMode="contain" style={{ width: '100%', height: '100%' }} />
                    </View>
                    <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 18, letterSpacing: 0.36, color: LS_COLORS.global.black, marginLeft: 11 }}>ADD JOB</Text>
                </TouchableOpacity>}
                {user.user_role == 3
                    ?
                    isAddJobActive
                        ?
                        <View style={{ flex: 1, paddingTop: '5%' }}>
                            <FlatList
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
                                                item.itemsData.length > 0
                                                    ?
                                                    goToItems(item)
                                                    :
                                                    props.navigation.navigate("SubServices", { service: item })
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
                                columnWrapperStyle={{ justifyContent: 'space-between' }}
                                renderItem={({ item, index }) => {
                                    return (
                                        <Cards
                                            title1={item.name}
                                            imageUrl={{ uri: BASE_URL + item.image }}
                                            action={() => {
                                                props.navigation.navigate("ServicesProvided", { subService: item });
                                            }}
                                        />
                                    )
                                }}
                                keyExtractor={(item, index) => index}
                            />
                            :
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                {!loading && <Text style={{ fontFamily: LS_FONTS.PoppinsSemiBold, fontSize: 16 }}>No Jobs Added Yet</Text>}
                            </View>
                    :
                    <ScrollView scrollEnabled={scrollEnabled} showsVerticalScrollIndicator={false}>
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
                                            item.itemsData.length > 0
                                                ?
                                                props.navigation.navigate("ServicesProvided", { subService: item, items: [...item.itemsData] })
                                                :
                                                props.navigation.navigate("SubServices", { service: item })
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
                    <View style={styles.orderContainer}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => props.navigation.navigate("Orders")}>
                            <Text style={styles.order}>
                                ORDER
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {user.user_role == 3 && <View style={styles.orderContainer}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => showToast("WORK IN PROGRESS")}>
                            <Text style={styles.order}>
                                LOCATION
                            </Text>
                        </TouchableOpacity>
                    </View>}
                    {user.user_role == 3 && <View style={styles.orderContainer}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => props.navigation.navigate('AddTimeFrame', { serviceData: {} })}>
                            <Text style={styles.order}>
                                SCHEDULE
                            </Text>
                        </TouchableOpacity>
                    </View>}
                </View>}
            </View>
            {loading && <Loader />}
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
        height: 32,
        width: 111,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 28,
        alignSelf: 'center', width: '30%'
    },
    order: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    }
})


