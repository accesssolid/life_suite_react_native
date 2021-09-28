import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ImageBackground, StatusBar, Platform, Image, TouchableOpacity, ScrollView } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import { globalStyles, showToast } from '../../../utils';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { CheckBox } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

/* Components */;
import Header from '../../../components/header';
import {  Container, Content, Row, Toast, } from 'native-base'
import Loader from '../../../components/loader';
import { Card } from 'react-native-elements';
import { BASE_URL, getApi } from '../../../api/api';
import { Rating } from 'react-native-ratings';
import SureModal from '../../../components/sureModal';
import SureModal1 from '../../../components/sureModal1';;
import TimeFrame from '../../../components/timeFrame';


const UpdateOrder = (props) => {
    const [loading, setLoading] = useState(false)
    const [providers, setProviders] = useState([])
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(false)

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <View style={{ width: '100%', height: '20%' }}>
                <ImageBackground
                    resizeMode="cover"
                    source={require("../../../assets/dj.png")}
                    // source={{ uri: BASE_URL + subService.image }}
                    style={styles.image}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
                            <View style={{ height: "35%", justifyContent: 'flex-end' }}>
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
                            <View style={{ justifyContent: 'center', alignItems: "center" }}>
                                <Text style={{ fontSize: 29, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.white }}>{"Mechanic"}</Text>
                            </View>
                        </SafeAreaView>
                    </View>
                </ImageBackground>
            </View>
            <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
                <View style={styles.container}>
                    <Container style={{ marginTop: "5%" }}>
                        <Content showsVerticalScrollIndicator={false} bounces={false} >
                            <Text style={{ alignSelf: 'center', color: 'black', fontSize: 16, fontFamily: LS_FONTS.PoppinsBold }}>ORDER UPDATE</Text>
                            <Card style={{ width: '90%', alignSelf: "center",  backgroundColor: "white", marginTop: "5%" }}></Card>
                            {/* {providers.length > 0 ?
                                providers.map((item, index) => {
                                    return <Card key={index} style={styles.alexiContainer}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View style={{ width: "75%", flexDirection: 'row' }}>
                                                <View style={{ height: 80, width: 80, borderRadius: 50, overflow: 'hidden', borderWidth: 0.5, borderColor: LS_COLORS.global.placeholder }}>
                                                    <Image
                                                        style={{ height: '100%', width: '100%' }}
                                                        source={item.profile_image !== null ? { uri: BASE_URL + item.profile_image } : require('../../../assets/user.png')}
                                                        resizeMode='cover'
                                                    />
                                                </View>
                                                <View style={{ flexDirection: 'column', marginLeft: "5%", alignSelf: "center" }}>
                                                    <Text style={{ fontSize: 16, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.green }}>{item.first_name}</Text>
                                                    <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsRegular }}>{countryName.trim()}</Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity onPress={() => { like(item.id) }} style={{ height: 20, width: 25, justifyContent: "center", alignItems: 'center', position: "absolute", right: 5 }}>
                                                {item.is_favourite === 1
                                                    ?
                                                    <Image style={{ height: 18, width: 21 }} source={require('../../../assets/heartGreen.png')} resizeMode="cover" />
                                                    :
                                                    <Image style={{ height: 18, width: 21 }} source={require('../../../assets/whiteHeart.png')} resizeMode="cover" />
                                                }
                                            </TouchableOpacity>
                                          
                                        </View>
                                        {!open ?
                                            <Text numberOfLines={1} onPress={() => setOpen(!open)} style={{ fontSize: 14, marginLeft: 10, marginTop: 10, fontFamily: LS_FONTS.PoppinsRegular }}>{item.about}</Text>
                                            :
                                            <Text onPress={() => setOpen(!open)} style={{ fontSize: 14, marginLeft: 10, marginTop: 10, fontFamily: LS_FONTS.PoppinsRegular }}>{item.about}</Text>
                                        }
                                        <View style={{ width: 120, flexDirection: "row", overflow: "hidden", justifyContent: "space-evenly", alignItems: "center" }}>
                                            <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsRegular, color: LS_COLORS.global.green, }}> {"Rating"}</Text>
                                            <Rating
                                                readonly={true}
                                                imageSize={10}
                                                type="custom"
                                                ratingBackgroundColor="white"
                                                ratingColor="#04BFBF"
                                                tintColor="white"
                                                startingValue={parseInt(item.rating)}
                                            />
                                        </View>
                                        <View style={{ height: 1, width: '95%', alignSelf: 'center', borderWidth: 0.7, borderColor: "#00000029", marginTop: 10 }}></View>
                                        {item.item_list.map((i) => {
                                            return (
                                                <>
                                                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                                        <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium, }}>{i.service_items_name + "(Service)"}</Text>
                                                        <View style={{ height: 25, flexDirection: "row", }}>
                                                            <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium }}>{"$" + i.productTotalPrice}</Text>
                                                        </View>
                                                    </View>
                                                    {i.products.map((itemData) => {
                                                        return (
                                                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }} >
                                                                <View style={{}} >
                                                                    <Text style={{ marginLeft: 20 }}>
                                                                        <Text style={{ fontSize: 12, marginLeft: 15, fontFamily: LS_FONTS.PoppinsMedium, }}>{itemData.item_products_name + "(Product)"}</Text>
                                                                    </Text>
                                                                </View>
                                                                <View style={{ height: 20, flexDirection: "row" }}>
                                                                    <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium }}>{"$" + itemData.price}</Text>
                                                                </View>
                                                            </View>
                                                        )
                                                    })}
                                                </>
                                            )
                                        })
                                        }
                                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                            <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.green }}>Estimated Time</Text>
                                            <Text style={{ fontSize: 12, marginRight: 15, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.green }}>{time_format}</Text>
                                        </View>
                                    </Card>
                                })
                                :
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    {!loading && <Text style={{ fontFamily: LS_FONTS.PoppinsMedium, fontSize: 16 }}>No Providers Found</Text>}
                                </View>
                            } */}
                            <View style={{ width: "90%", alignSelf: "center", flexDirection: "row", justifyContent: "space-between", marginTop: '5%' }}>
                                <Text style={{ textAlign: "center", color: 'black', fontFamily: LS_FONTS.PoppinsMedium, fontSize: 12 }} >User Requested Time Frame</Text>
                                <Text style={{ textAlign: "center", color: 'black', fontFamily: LS_FONTS.PoppinsMedium, fontSize: 12 }} >10:00 am - 02:00 pm</Text>
                            </View>
                            <Text style={{ textAlign: "center", color: '#F92525', fontFamily: LS_FONTS.PoppinsMedium, fontSize: 12, marginTop: "5%" }} >Adding new service requires 1 hour extra</Text>
                            <View style={{ flexDirection: 'row', width: '70%', justifyContent: "space-between", alignSelf: "center", marginTop: '5%' }}>
                                <TouchableOpacity
                                    style={styles.save}
                                    activeOpacity={0.7}
                                    onPress={() => {

                                    }}>
                                    <Text style={styles.saveText}>Accept</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ ...styles.save, backgroundColor: 'white', borderWidth: 1, borderColor: "#04BFBF" }}
                                    activeOpacity={0.7}
                                    onPress={() => {

                                    }}>
                                    <Text style={{ ...styles.saveText, color: "#04BFBF" }}>Decline</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: 30 }}></View>
                        </Content>
                    </Container>
                </View>
                {loading && <Loader />}
            </SafeAreaView>
        </>
    )
}

export default UpdateOrder;

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
        marginTop: 10,
        overflow: 'hidden'
    },
    upper: {
        justifyContent: "center",
        alignItems: 'center',
        height: 30,
        width: 100,
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





