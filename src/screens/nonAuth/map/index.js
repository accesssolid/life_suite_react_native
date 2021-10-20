import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, StatusBar, Platform, Image, TouchableOpacity, PermissionsAndroid ,Text} from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import RNGooglePlaces from 'react-native-google-places';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { SafeAreaView } from 'react-native-safe-area-context';

/* Components */;
import { Container } from 'native-base'
import CustomButton from '../../../components/customButton';
import Loader from '../../../components/loader';
import { ScrollView } from 'react-native-gesture-handler';
import { showToast } from '../../../components/validators';

const MapScreen = (props) => {
    const dispatch = useDispatch()
    const mapRef = useRef(null)
    const queryString = require('query-string');
    const { onConfirm, coords } = props.route.params
    const placesRef = useRef();
    const user = useSelector(state => state.authenticate.user)
    const [loading, setLoading] = useState(false)
    const isAddServiceMode = useSelector(state => state.services.isAddServiceMode)
    const [address, setAddress] = useState('')
    const [focused, setFocused] = useState(false)
    // #liahs for permanent button clicked checked
    const [isPermanentClicked, setIsPermanetClicked] = React.useState(false)

    const [coordinates, setCoordinates] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    })

    useEffect(() => {
        if (coords == null) {
            getLocationPermission()
        } else {
            setCoordinates(coords)
            mapRef.current.animateToRegion({
                ...coords
            })
        }
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
            getCurrentPlace()
        } else {
            alert("Location permission denied")
        }
    }

    const getCurrentPlace = () => {
        setLoading(true)
        RNGooglePlaces.getCurrentPlace(['placeID', 'location', 'name', 'address'])
            .then((results) => {
                setAddress(results[0].address)
                placesRef.current.setAddressText(results[0].address)
                if (results[0].location.latitude) {
                    setCoordinates({ ...coordinates, latitude: results[0].location.latitude, longitude: results[0].location.longitude })
                    mapRef.current.animateToRegion({ ...coordinates, latitude: results[0].location.latitude, longitude: results[0].location.longitude })
                }
            })
            .catch((error) => console.log("results error => ", error.message))
            .finally(() => {
                setLoading(false)
            })
    }

    const reverseGeocode = (lat, lng) => {
        // #liahs for name of adderess won't change if the permananet address is clicked
        if (isPermanentClicked) {
            setTimeout(() => {
                setIsPermanetClicked(false)
            }, 2000)
            return
        }
        try {
            let params = {
                key: 'AIzaSyBoK4icaIuqCEWdbq-D4LdrsbK4X_Fa1Fg',
                latlng: `${lat},${lng}`,
            };
            let qs = queryString.stringify(params);
            return fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?${qs}`)
                .then((res) => res.json())
                .then((json) => {
                    if (json.status !== 'OK') {
                        throw new Error(`Geocode error: ${json.status}`);
                    }
                    setAddress(json.results[0].formatted_address)
                    placesRef.current.setAddressText(json.results[0].formatted_address)
                }).catch(err => {
                    console.log("reverseGeocode err => ", err)
                    showToast("Error fetching location details, please try again")
                })
        } catch (error) {
            console.log("reverseGeocode err => ", error)
        }
    }
    const onZoomInPress = () => {
        mapRef?.current?.getCamera().then((cam: Camera) => {
            cam.zoom += 1;
            map?.current?.animateCamera(cam);
        });
    };
    
    return (
        <>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <SafeAreaView style={styles.safeArea}>
                <Container>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => props.navigation.goBack()}
                        style={{ height: 50, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', position: 'absolute', zIndex: 1000, backgroundColor: LS_COLORS.global.green, top: '2.5%', left: '4%', borderRadius: 6 }}>
                        <Image style={{ height: '50%', width: '50%' }} resizeMode="contain" source={require('../../../assets/backWhite.png')} />
                    </TouchableOpacity>
                    <GooglePlacesAutocomplete
                        ref={placesRef}
                        styles={{
                            container: { borderColor: "green", borderWidth: 1, position: 'absolute', width: '75%', zIndex: 500, alignSelf: 'flex-end', right: '5%', top: '2.5%', backgroundColor: LS_COLORS.global.white, borderRadius: 6 },
                            listView: { paddingVertical: 5 },
                            separator: {}
                        }}
                        placeholder='Search'
                        fetchDetails={true}
                        onPress={(data, details) => {
                            if (details?.geometry?.location?.lat) {
                                setCoordinates({
                                    ...coordinates,
                                    latitude: details?.geometry?.location?.lat,
                                    longitude: details.geometry?.location?.lng
                                })
                                setAddress(data?.description)
                                placesRef.current.blur()
                                mapRef.current.animateToRegion({
                                    ...coordinates,
                                    latitude: details?.geometry?.location?.lat,
                                    longitude: details.geometry?.location?.lng
                                })
                            }

                            if (Platform.OS == "ios") {
                                setFocused(false)
                            }
                        }}
                        textInputProps={{
                            onFocus: () => setFocused(true),
                            onblur: () => setFocused(false),

                            blurOnSubmit: true,
                            onSubmitEditing: () => setFocused(false),
                        }}
                        query={{
                            key: 'AIzaSyBRpW8iA1sYpuNb_gzYKKVtvaVbI-wZpTM',
                            language: 'en',
                        }}
                    />
                    {/* </ScrollView> */}
                    <View style={styles.mapContainer}>
                        <View style={{ position: 'absolute', width: '100%', height: 60, flexDirection: 'row', justifyContent: 'space-around', top: focused ? '15%' : '10%', alignItems: 'center', paddingHorizontal: '10%', zIndex: 1 }}>
                            {user?.address[0]?.address_line_1 !== '' && <CustomButton
                                title={user.user_role == 2 ? "Home" : "Permanent"}
                                customTextStyles={{ fontSize: 14, color: LS_COLORS.global.white }}
                                customStyles={{
                                    width: '100%',
                                    height: 40,
                                    paddingHorizontal: '5%',
                                    backgroundColor: LS_COLORS.global.green,
                                }}
                                action={() => {
                                    // #liahs checked to permaned to true
                                    // setIsPermanetClicked(true)
                                    setAddress(`${user.address[0].address_line_1}`)
                                    placesRef.current.setAddressText(`${user.address[0].address_line_1}`)
                                    setCoordinates({
                                        ...coordinates,
                                        latitude: Number(user?.address[0]?.lat),
                                        longitude: Number(user?.address[0]?.long)
                                    })
                                    mapRef.current.animateToRegion({
                                        ...coordinates,
                                        latitude: Number(user?.address[0]?.lat),
                                        longitude: Number(user?.address[0]?.long)
                                    })
                                }}
                            />}
                            {user?.address[1]?.address_line_1 !== '' && <CustomButton
                                title={user.user_role == 2 ? "Work" : "Mailing"}
                                customTextStyles={{ fontSize: 14, color: LS_COLORS.global.white }}
                                customStyles={{
                                    width: '100%',
                                    height: 40,
                                    paddingHorizontal: '5%',
                                    backgroundColor: LS_COLORS.global.green,
                                }}
                                action={() => {
                                    // #liahs checked to permaned to true
                                    // setIsPermanetClicked(true)
                                    setAddress(`${user.address[1].address_line_1}`)
                                    placesRef.current.setAddressText(`${user.address[1].address_line_1}`)
                                    setCoordinates({
                                        ...coordinates,
                                        latitude: Number(user?.address[1]?.lat),
                                        longitude: Number(user?.address[1]?.long)
                                    })
                                    mapRef.current.animateToRegion({
                                        ...coordinates,
                                        latitude: Number(user?.address[1]?.lat),
                                        longitude: Number(user?.address[1]?.long)
                                    })
                                }}
                            />}
                        </View>
                        <MapView
                            ref={mapRef}
                            initialRegion={{
                                ...coordinates,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                            // camera={{ ...coordinates,
                            //     latitudeDelta: 0.0922,
                            //     longitudeDelta: 0.0421,
                            //  }}
                            onRegionChange={(reg) => {
                             
                            }}
                            onRegionChangeComplete={(reg) => {
                                setCoordinates({ ...reg })
                                reverseGeocode(reg.latitude, reg.longitude)
                            }}
                            style={styles.map}
                            region={{
                                ...coordinates,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                        >
                            {/* <Marker
                                pinColor={"black"}
                                coordinate={coordinates}
                            /> */}
                        </MapView>

                        <View pointerEvents="none" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
                            <Image pointerEvents="none" style={{ height: 40, aspectRatio: 1 }} source={require('../../../assets/pin.png')} />
                        </View>
                        <TouchableOpacity onPress={()=>{
                            onZoomInPress()
                        }}>
                            <Text>+</Text>
                            </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => {
                            // setIsPermanetClicked(true)
                            getLocationPermission()
                        }} style={{ position: 'absolute', height: 30, aspectRatio: 1, bottom: '15%', right: '10%' }}>
                            <Image style={{ height: '100%', aspectRatio: 1, tintColor: LS_COLORS.global.green }} source={require('../../../assets/gps.png')} resizeMode="contain" />
                        </TouchableOpacity>
                        <View style={{ paddingBottom: '5%', position: 'absolute', bottom: 0, width: '100%' }}>
                            <CustomButton
                                title={"Submit"}
                                customStyles={{ width: '50%', borderRadius: 6 }}
                                action={() => { onConfirm(address, coordinates), props.navigation.goBack() }}
                            />
                        </View>
                    </View>
                </Container>
                {loading && <Loader />}
            </SafeAreaView >
        </>
    )
}

export default MapScreen;

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
        // height: Dimensions.get('window').height,
        // width: Dimensions.get('window').width,
        flex: 1
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
})