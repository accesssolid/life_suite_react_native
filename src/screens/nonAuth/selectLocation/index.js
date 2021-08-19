import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ImageBackground, StatusBar, Platform, Image, TouchableOpacity, PermissionsAndroid } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import RNGooglePlaces from 'react-native-google-places';

/* Components */;
import Header from '../../../components/header';
import { Container, Content, Row, } from 'native-base'
import { BASE_URL, getApi } from '../../../api/api';
import CustomButton from '../../../components/customButton';
import Loader from '../../../components/loader';
import { showToast } from '../../../components/validators';
import { setMyJobs } from '../../../redux/features/provider';
import { setAddServiceMode } from '../../../redux/features/services';
import { Dimensions } from 'react-native';
import CustomTextInput from '../../../components/customTextInput';

const SelectLocation = (props) => {
    const dispatch = useDispatch()
    const { subService } = props.route.params
    const user = useSelector(state => state.authenticate.user)
    const [loading, setLoading] = useState(false)
    const isAddServiceMode = useSelector(state => state.services.isAddServiceMode)
    const addServiceData = useSelector(state => state.services.addServiceData)
    const access_token = useSelector(state => state.authenticate.access_token)
    const [address, setAddress] = useState('')
    const [travelDistance, setTravelDistance] = useState('')
    const [selectedAddress, setSelectedAddress] = useState("current")
    const [selectedSavedAddress, setSelectedSavedAddress] = useState("permanent")
    const [coordinates, setCoordinates] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
    })

    useEffect(() => {
        if (selectedAddress == "current") {
            getLocationPermission()
        } else {
            if (selectedSavedAddress == "permanent") {
                let workAddress = `${user.address[0].address_line_1}, ${user.address[0].city_name}, ${user.address[0].state_name}, ${user.address[0].zip_code}, ${user.address[0].country_name}`
                setAddress(workAddress)
            } else {
                let mailingAddress = `${user.address[1].address_line_1}, ${user.address[1].city_name}, ${user.address[1].state_name}, ${user.address[1].zip_code}, ${user.address[1].country_name}`
                setAddress(mailingAddress)
            }
            setSelectedSavedAddress("permanent")
        }
    }, [selectedAddress])

    useEffect(() => {
        if (selectedSavedAddress == "permanent") {
            let workAddress = `${user.address[0].address_line_1}, ${user.address[0].city_name}, ${user.address[0].state_name}, ${user.address[0].zip_code}, ${user.address[0].country_name}`
            setAddress(workAddress)
        } else {
            let mailingAddress = `${user.address[1].address_line_1}, ${user.address[1].city_name}, ${user.address[1].state_name}, ${user.address[1].zip_code}, ${user.address[1].country_name}`
            setAddress(mailingAddress)
        }
    }, [selectedSavedAddress])

    useEffect(() => {
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
        if (isAddServiceMode) {
            if (hasLocationPermission) {
                Geolocation.getCurrentPosition(
                    (position) => {
                        getCurrentPlace()
                    },
                    (error) => {
                        console.log(error.code, error.message);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );
            } else {
                setSelectedAddress("saved")
                showToast("Location permission not granted")
            }
        } else {
            setSelectedAddress("saved")
            setPreviousAddress()
        }
    }

    const getCurrentPlace = () => {
        RNGooglePlaces.getCurrentPlace(['placeID', 'location', 'name', 'address'])
            .then((results) => {
                setAddress(results[0].address)
                setCoordinates({ ...coordinates, latitude: results[0].location.latitude, longitude: results[0].location.longitude })
            })
            .catch((error) => console.log(error.message));
    }

    const setPreviousAddress = () => {
        if (!isAddServiceMode && subService.travel_data.address_text) {
            setAddress(subService.travel_data.address_text)
            setTravelDistance(subService.travel_data.travel_distance)
            setCoordinates({ ...coordinates, latitude: Number(subService.travel_data.lat), longitude: Number(subService.travel_data.long) })
        }
    }

    const openSearchModal = () => {
        RNGooglePlaces.openAutocompleteModal({
            type: 'address'
        }, ['placeID', 'location', 'name', 'address'])
            .then((place) => {
                setAddress(place.address)
                setCoordinates({ ...coordinates, latitude: place.location.latitude, longitude: place.location.longitude })
            })
            .catch(error => console.log(error.message));
    }

    const next = () => {
        let travel_distance = {
            "travel_distance": travelDistance,
            "address_text": address,
            "lat": coordinates.latitude,
            "long": coordinates.longitude
        }
        if (travelDistance.trim() == "") {
            showToast("Please enter travel distance")
        } else if (address.trim() == "") {
            showToast("Please enter or select address")
        } else {
            try {
                setLoading(true)
                let headers = {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": `Bearer ${access_token}`
                }

                let newProd = addServiceData.json_data.new_products.map(item => {
                    return {
                        "item_id": item.item_id,
                        "name": item.name,
                        "price": item.price
                    }
                })

                let products = addServiceData.json_data.products.map(item => {
                    return {
                        "item_product_id": item.id,
                        "price": item.price
                    }
                })

                var formdata = new FormData();
                formdata.append("user_id", user.id);
                formdata.append("service_id", addServiceData.service_id);
                formdata.append("json_data", JSON.stringify({
                    "services": addServiceData.json_data.services,
                    "products": [...products],
                    "travel_distance": travel_distance,
                    "new_products": [...newProd]
                }));

                addServiceData.images.forEach((item, index) => {
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
            } catch (error) {

            } finally {
                setLoading(false)
            }
        }
    }

    const getMyJobs = (shouldNavigate) => {
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
                        <View style={styles.mapContainer}>
                            <MapView
                                style={styles.map}
                                region={{
                                    ...coordinates,
                                    latitudeDelta: 0.015,
                                    longitudeDelta: 0.0121,
                                }}>
                                <Marker
                                    coordinate={{ ...coordinates }}
                                />
                            </MapView>
                        </View>
                        <View style={{ flex: 1, padding: 20 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
                                <CustomButton
                                    title="Your Address"
                                    customTextStyles={{ fontSize: 14, color: selectedAddress !== "current" ? LS_COLORS.global.white : LS_COLORS.global.green, }}
                                    customStyles={{
                                        width: '100%',
                                        height: 40,
                                        paddingHorizontal: '5%',
                                        backgroundColor: selectedAddress == "current" ? LS_COLORS.global.white : LS_COLORS.global.green,
                                        borderColor: LS_COLORS.global.green,
                                        borderWidth: selectedAddress == "current" ? 1 : 0,
                                    }}
                                    action={() => setSelectedAddress("saved")}
                                />
                                <CustomButton
                                    title="Current Location"
                                    customTextStyles={{ fontSize: 14, color: selectedAddress == "current" ? LS_COLORS.global.white : LS_COLORS.global.green, }}
                                    customStyles={{
                                        width: '100%',
                                        height: 40,
                                        paddingHorizontal: '5%',
                                        backgroundColor: selectedAddress == "current" ? LS_COLORS.global.green : LS_COLORS.global.white,
                                        borderColor: LS_COLORS.global.green,
                                        borderWidth: selectedAddress == "current" ? 0 : 1,
                                    }}
                                    action={() => setSelectedAddress("current")}
                                />
                            </View>
                            {selectedAddress !== "current" &&
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
                                    <CustomButton
                                        title="Permanent"
                                        customTextStyles={{ fontSize: 14, color: selectedSavedAddress == "permanent" ? LS_COLORS.global.white : LS_COLORS.global.green, }}
                                        customStyles={{
                                            width: '100%',
                                            height: 40,
                                            paddingHorizontal: '5%',
                                            backgroundColor: selectedSavedAddress == "permanent" ? LS_COLORS.global.green : LS_COLORS.global.white,
                                            borderColor: LS_COLORS.global.green,
                                            borderWidth: selectedSavedAddress == "permanent" ? 0 : 1,
                                        }}
                                        action={() => setSelectedSavedAddress("permanent")}
                                    />
                                    <CustomButton
                                        title="Mailing"
                                        customTextStyles={{ fontSize: 14, color: selectedSavedAddress == "mailing" ? LS_COLORS.global.white : LS_COLORS.global.green, }}
                                        customStyles={{
                                            width: '100%',
                                            height: 40,
                                            paddingHorizontal: '5%',
                                            backgroundColor: selectedSavedAddress == "mailing" ? LS_COLORS.global.green : LS_COLORS.global.white,
                                            borderColor: LS_COLORS.global.green,
                                            borderWidth: selectedSavedAddress == "mailing" ? 0 : 1,
                                        }}
                                        action={() => setSelectedSavedAddress("mailing")}
                                    />
                                </View>}
                            <CustomTextInput
                                placeholder="Address"
                                value={address}
                                inlineImageLeft={<Image source={require('../../../assets/location.png')} resizeMode="contain" style={{ height: '50%', width: '100%', backgroundColor: LS_COLORS.global.lightGrey }} />}
                                onLeftPress={() => openSearchModal()}
                                customContainerStyle={{ marginHorizontal: '0%' }}
                                customInputStyle={{ paddingHorizontal: '7%' }}
                            />
                            <Text style={{ fontFamily: LS_FONTS.PoppinsMedium }}>Travel Distance to provide service(KM)</Text>
                            <CustomTextInput
                                placeholder="Travel Distance"
                                value={travelDistance}
                                keyboardType="numeric"
                                onChangeText={setTravelDistance}
                                customContainerStyle={{ marginHorizontal: '0%' }}
                                customInputStyle={{ paddingHorizontal: '7%' }}
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

export default SelectLocation;

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
    mapContainer: {
        height: Dimensions.get('screen').height / 4,
        width: Dimensions.get('screen').width,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
})