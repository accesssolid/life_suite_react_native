import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ImageBackground, StatusBar, Platform, Image, TouchableOpacity, ScrollView } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import { globalStyles } from '../../../utils';
import LS_FONTS from '../../../constants/fonts';
import CustomDropDown from '../../../components/dropDown';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import { CheckBox } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

/* Components */;
import Header from '../../../components/header';
import DropDown from '../../../components/dropDown';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { Card, Container, Content, Row, } from 'native-base'
import Loader from '../../../components/loader';
import { BASE_URL, getApi } from '../../../api/api';
var _ = require('lodash');

const Mechanics = (props) => {
    const { data, subService } = props.route.params
    const [checked1, setChecked1] = useState(false)
    const [checked2, setChecked2] = useState(false)
    const [checked3, setChecked3] = useState(false)
    const [loading, setLoading] = useState(false)
    const [providers, setProviders] = useState([])
    const [selectedProviders, setSelectedProviders] = useState([])
    const access_token = useSelector(state => state.authenticate.access_token)
    const user = useSelector(state => state.authenticate.user)
    const [price, setPrice] = useState(false)
    const [time, setTime] = useState(false)
    const [rating, setRating] = useState(false)

    useEffect(() => {
        const apple = [...providers]
        apple.sort((a, b) => b.price - a.price)
        console.log(apple, "jadnfjkl")
    }, [providers])

    useEffect(() => {
        getProviders()
    }, [])

    const getProviders = () => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }

        let config = {
            headers: headers,
            data: JSON.stringify({ ...data }),
            endPoint: '/api/orderProviderList',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    let proData = Object.keys(response.data).map((item, index) => {
                        return response.data[item][0]
                    })
                    setProviders(proData)
                    setLoading(false)
                }
                else {
                    setLoading(false)
                }
            }).catch(err => {
                setLoading(false)
            })
    }


    const onSelect = (item) => {
        let temp = [...selectedProviders]
        if (selectedProviders.includes(item.id)) {
            temp.splice(temp.indexOf(item.id), 1)
        } else {
            temp.push(item.id)
        }
        setSelectedProviders(temp)
    }
    const like = (id) => {
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
                    getProviders()
                }
                else {

                }
            }).catch(err => {
            })
    }

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <View style={{ width: '100%', height: '30%' }}>
                <ImageBackground
                    resizeMode="cover"
                    source={{ uri: BASE_URL + subService.image }}
                    style={styles.image}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
                            <View style={{ height: "22%", justifyContent: 'flex-end' }}>
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
                            <View style={{ justifyContent: 'center', alignItems: "center", height: "60%" }}>
                                <Text style={{ fontSize: 29, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.white }}>{subService.name}</Text>
                            </View>
                        </SafeAreaView>
                    </View>
                </ImageBackground>
            </View>
            <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
                <View style={styles.container}>
                    <Container style={{ marginTop: 26 }}>
                        <Content>
                            <View style={{ height: 40, width: '90%', left: 10, justifyContent: 'space-between', flexDirection: 'row' }}>
                                <Image
                                    style={{ alignSelf: 'center', height: 30, width: 30, resizeMode: 'contain' }}
                                    source={require("../../../assets/filter.png")}
                                />
                                <TouchableOpacity onPress={() => { setPrice(!price), price ? providers.sort((a, b) => a.price - b.price) : providers.sort((a, b) => b.price - a.price) }} style={styles.upper} >
                                    <Text style={styles.upperText}>Price</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setTime(!time), time ? providers.sort((a, b) => a.time_duration - b.time_duration) : providers.sort((a, b) => b.time_duration - a.time_duration) }} style={styles.upper} >
                                    <Text style={styles.upperText}>Time</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setRating(!rating), rating ? providers.sort((a, b) => a.provider_rating - b.provider_rating) : providers.sort((a, b) => b.provider_rating - a.provider_rating) }} style={styles.upper} >
                                    <Text style={styles.upperText}>Rating</Text>
                                </TouchableOpacity>
                            </View>
                            {
                                providers.length > 0
                                    ?
                                    providers.map((item, index) => {
                                        console.log(item.rating)
                                        let x = item.time_duration / 60
                                        let time_format = ""
                                        if (x > 1) {
                                            time_format = parseInt(x) + " hr " + item.time_duration % 60 + " min"
                                        } else {
                                            time_format = item.time_duration + " min"
                                        }
                                        let y = new Array(parseInt(item.provider_rating)).fill("*").join("")

                                        return <Card key={index} style={styles.alexiContainer}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <View style={{ height: 80, width: 80, borderRadius: 50, overflow: 'hidden', borderWidth: 0.5, borderColor: LS_COLORS.global.placeholder }}>
                                                    <Image
                                                        style={{ height: '100%', width: '100%' }}
                                                        source={item.provider_profile_image !== null ? { uri: BASE_URL + item.provider_profile_image } : require('../../../assets/user.png')}
                                                        resizeMode='cover'
                                                    />
                                                </View>
                                                <View style={{ top: "5%", right: 30 }}>
                                                    <Text style={{ fontSize: 16, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.green }}>{item.provider_first_name}</Text>
                                                    <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsRegular }}>Australia</Text>
                                                </View>
                                                <TouchableOpacity onPress={() => { like(item.user_id) }} style={{ height: 20, width: 25, justifyContent: "center", alignItems: 'center', position: "absolute", right: 5 }}>
                                                    <Image
                                                        style={{ height: 18, width: 21, }}
                                                        source={require('../../../assets/whiteHeart.png')}
                                                        resizeMode="cover"
                                                    />
                                                </TouchableOpacity>
                                                <View style={{ flexDirection: "row", marginTop: 20 }}>
                                                    <CheckBox
                                                        checked={selectedProviders.includes(item.id)}
                                                        onPress={() => onSelect(item)}
                                                        checkedIcon={<Image style={{ height: 23, width: 23, }} source={require("../../../assets/checked.png")} />}
                                                        uncheckedIcon={<Image style={{ height: 23, width: 23, }} source={require("../../../assets/unchecked.png")} />}
                                                    />
                                                    <Text style={{ fontSize: 16, fontFamily: LS_FONTS.PoppinsSemiBold, color: LS_COLORS.global.green, marginTop: 15 }}>${item.price}</Text>
                                                </View>
                                            </View>
                                            <Text style={{ fontSize: 14, marginLeft: 10, marginTop: 10, fontFamily: LS_FONTS.PoppinsRegular }}>I am a Professional Mechanic having 4y exp.</Text>
                                            <Text style={{ fontSize: 14, marginLeft: 10, marginTop: 10, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.green, }}> {"Rating" + y}</Text>
                                            <View style={{ height: 1, width: '95%', alignSelf: 'center', borderWidth: 0.7, borderColor: "#00000029", marginTop: 10 }}></View>
                                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                                <Text style={{ marginLeft: 10 }}>
                                                    <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium, }}>Oil Change   </Text>
                                                    <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsRegular, }}>(Service Charge)</Text>
                                                </Text>
                                                <View style={{ height: 20, width: "20%", flexDirection: "row" }}>
                                                    <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium }}>$10</Text>
                                                    <CheckBox
                                                        checked={checked1}
                                                        onPress={() => {
                                                            setChecked1(!checked1)
                                                        }}
                                                        checkedIcon={<Image style={{ height: 17, width: 17, bottom: 5 }} source={require("../../../assets/checked.png")} />}
                                                        uncheckedIcon={<Image style={{ height: 17, width: 17, bottom: 5 }} source={require("../../../assets/unchecked.png")} />}
                                                    />
                                                </View>
                                            </View>
                                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                                <View>
                                                    <Text style={{ marginLeft: 20 }}>
                                                        <View style={{ height: 10, width: 10, borderRadius: 100, backgroundColor: "#CACACA", justifyContent: "center", alignItems: "center" }}></View>

                                                        <Text style={{ fontSize: 12, marginLeft: 15, fontFamily: LS_FONTS.PoppinsMedium, }}>5W - 20           </Text>
                                                        <Text style={{ fontSize: 12, marginLeft: 15, fontFamily: LS_FONTS.PoppinsRegular, }}>(Product)</Text>
                                                    </Text>
                                                </View>
                                                <View style={{ height: 20, width: "20%", flexDirection: "row" }}>
                                                    <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium }}>$15</Text>
                                                    <CheckBox
                                                        checked={checked2}
                                                        onPress={() => {
                                                            setChecked2(!checked2)
                                                        }}
                                                        checkedIcon={<Image style={{ height: 17, width: 17, bottom: 5 }} source={require("../../../assets/checked.png")} />}
                                                        uncheckedIcon={<Image style={{ height: 17, width: 17, bottom: 5 }} source={require("../../../assets/unchecked.png")} />}
                                                    />
                                                </View>
                                            </View>

                                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                                <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium, }}>Task 3</Text>
                                                <View style={{ height: 20, width: "20%", flexDirection: "row" }}>
                                                    <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium }}>$50</Text>
                                                    <CheckBox
                                                        checked={checked3}
                                                        onPress={() => {
                                                            setChecked3(!checked3)
                                                        }}
                                                        checkedIcon={<Image style={{ height: 17, width: 17, bottom: 5, right: 3 }} source={require("../../../assets/checked.png")} />}
                                                        uncheckedIcon={<Image style={{ height: 17, width: 17, bottom: 5, right: 3 }} source={require("../../../assets/unchecked.png")} />}
                                                    />
                                                </View>
                                            </View>
                                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                                <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.green }}>Total Time</Text>
                                                <Text style={{ fontSize: 12, marginRight: 10, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.green }}>{time_format}</Text>
                                            </View>
                                        </Card>
                                    })
                                    :
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        {!loading && <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 16 }}>No Providers Found</Text>}
                                    </View>
                            }
                            <TouchableOpacity
                                style={styles.save}
                                activeOpacity={0.7}
                                onPress={() => {
                                    props.navigation.navigate("HomeScreen")
                                }}>
                                <Text style={styles.saveText}>Request</Text>
                            </TouchableOpacity>
                            <View style={{ height: 30 }}></View>
                        </Content>
                    </Container>
                </View>
                {loading && <Loader />}
            </SafeAreaView>
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
        marginTop: 20
    },
    saveText: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    },
    alexiContainer: {
        maxHeight: '100%',
        width: "90%",
        alignSelf: 'center',
        borderRadius: 6,
        padding: 10,
        marginTop: 10
    },
    upper: {
        justifyContent: "center",
        alignItems: 'center',
        height: 25,
        width: 75,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 100,
        alignSelf: 'center'
    },
    upperText: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsRegular,
        color: LS_COLORS.global.white
    }

})





