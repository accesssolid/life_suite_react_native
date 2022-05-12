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
import { Container, Content } from 'native-base'
import { BASE_URL, getApi } from '../../../api/api';
import CustomButton from '../../../components/customButton';
import Loader from '../../../components/loader';
import { showToast } from '../../../components/validators';
import { Dimensions } from 'react-native';
import CustomTextInput from '../../../components/customTextInput';
import { getMyJobsThunk } from '../../../redux/features/provider';

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

    const [coordinates, setCoordinates] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.25,
        longitudeDelta: 0.012134,
    })

    useEffect(() => {
        setCoordinates({
            ...coordinates,
            latitudeDelta: 0.25,
            longitudeDelta: 0.012134,
        })
    }, [travelDistance])

    useEffect(() => {
        setInitialData()
    }, [])

    const setInitialData = () => {
        let coords = {
            latitude: Number(subService.travel_data.lat),
            longitude: Number(subService.travel_data.long),
        }
        setAddress(subService.travel_data?.address_text)
        setCoordinates({ ...coordinates, ...coords })
        setTravelDistance(String(subService.travel_data?.travel_distance))
    }



    const next = async () => {
        try {
            setLoading(true)
            let headers = {
                "Authorization": `Bearer ${access_token}`
            }

            const formdata = new FormData()
            formdata.append("service_id", subService.id)
            formdata.append("travel_distance", travelDistance)
            formdata.append("address_text", address)
            formdata.append("lat", coordinates.latitude)
            formdata.append("long", coordinates.longitude)
            console.log(formdata)
            let config = {
                headers: headers,
                data: formdata,
                endPoint: '/api/providerServiceLocationUpdate',
                type: 'post'
            }
            let response = await getApi(config)
            if (response.status) {
                showToast(response.message)
                dispatch(getMyJobsThunk(user.id, access_token))
                props.navigation.navigate("HomeScreen")
            } else {
                showToast(response.message, 'danger')
            }

        } catch (err) {
            console.error("Error",err)
        } finally {
            setLoading(false)

        }
    }



    const onLocation = (location, coords) => {
        setAddress(location)
        setCoordinates({
            ...coords,
            latitudeDelta: 0.25,
            longitudeDelta: 0.012134,
        })
    }

    return (
        <>
            <StatusBar 
           // translucent 
            // backgroundColor={"transparent"} 
            backgroundColor={LS_COLORS.global.green}
            barStyle="light-content" />
            <View style={{ width: '100%', height: '30%' }}>
                <ImageBackground
                    resizeMode="stretch"
                    source={{ uri: BASE_URL + subService?.image }}
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
                                    // containerStyle={{backgroundColor:LS_COLORS.global.cyan}}

                                />
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: "center", height: "33%" }}>
                                <Text maxFontSizeMultiplier={1.5} style={{ fontSize: 29, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.white }}>{subService?.name}</Text>
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
                                }}>
                                {travelDistance !== '' && <MapView.Circle
                                    key={(coordinates.latitude + coordinates.longitude).toString()}
                                    center={coordinates}
                                    radius={Number(travelDistance * 1.60934) * 1000}
                                    strokeWidth={1}
                                    strokeColor={'red'}
                                    fillColor={'rgba(230,238,255,0.1)'}
                                />}
                                <Marker
                                    coordinate={{ ...coordinates }}
                                />
                            </MapView>
                        </View>
                        <View style={{ flex: 1, padding: 20 }}>
                            <TouchableOpacity
                                style={{
                                    marginBottom: 30,
                                    marginHorizontal: '10%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: '100%',
                                    backgroundColor: LS_COLORS.global.lightGrey,
                                    borderRadius: 28,
                                    alignSelf: 'center',
                                    paddingVertical: 15,
                                    paddingHorizontal: '10%',
                                }}
                                activeOpacity={0.7}
                                onPress={() => props.navigation.navigate('MapScreen', { onConfirm: onLocation.bind(this), coords: coordinates })}>
                                <Text maxFontSizeMultiplier={1.5}  numberOfLines={1} style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsRegular, }}>{address}</Text>
                                <View style={{ aspectRatio: 1, position: 'absolute', right: '5%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                    <Image source={require('../../../assets/location.png')} resizeMode="contain" style={{ height: '70%', width: '100%', backgroundColor: LS_COLORS.global.lightGrey }} />
                                </View>
                            </TouchableOpacity>
                            <Text maxFontSizeMultiplier={1.5}  style={{ fontFamily: LS_FONTS.PoppinsMedium }}>Travel Distance to provide service(Miles)</Text>
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