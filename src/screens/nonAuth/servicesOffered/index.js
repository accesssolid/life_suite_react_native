import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ImageBackground, StatusBar, Platform, Image, TouchableOpacity, ScrollView } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import { globalStyles } from '../../../utils';
import LS_FONTS from '../../../constants/fonts';
import CustomDropDown from '../../../components/dropDown';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import { CheckBox } from 'react-native-elements'

/* Components */;
import Header from '../../../components/header';
import { Container, Content, Row, } from 'native-base'
import { TextInput } from 'react-native-gesture-handler';
import { BASE_URL, getApi } from '../../../api/api';

const ServicesProvided = (props) => {
    const dispatch = useDispatch()
    const { subService } = props.route.params

    useEffect(() => {
        console.log("subService =>", subService)
    }, [])

    const [itemList, setItemList] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedItems, setSelectedItems] = useState([])

    useEffect(() => {
        getServiceItems()
    }, [])

    const getServiceItems = () => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json"
        }

        let user_data = {
            "service_parent_id": subService.id
        }

        let config = {
            headers: headers,
            data: JSON.stringify({ ...user_data }),
            endPoint: '/api/subServicesItemList',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    setLoading(false)
                    setItemList([...response.data])
                }
                else {
                    setLoading(false)
                }
            }).catch(err => {
                setLoading(false)
            })
    }

    const setCheckedData = (index) => {
        let arr = [...selectedItems]
        if (arr.includes(index)) {
            arr.splice(arr.indexOf(index), 1)
        } else {
            arr.push(index)
        }
        setSelectedItems([...arr])
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
                            <View style={{ height: "22%", justifyContent: 'flex-end' }}>
                                <Header
                                    imageUrl={require("../../../assets/backWhite.png")}
                                    action={() => {
                                        props.navigation.pop()
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
                    <Content>
                        <Text style={styles.service}>SERVICES</Text>
                        <View style={styles.price}>
                            <Text style={styles.priceTime}>Price</Text>
                            <Text style={styles.priceTime}>Time</Text>
                        </View>
                        {itemList.map(((item, index) => {
                            return (
                                <View key={index} style={{ width: '100%', flexDirection: "row" }}>
                                    <CheckBox
                                        checked={selectedItems.includes(index)}
                                        onPress={() => setCheckedData(index)}
                                        checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/checked.png")} />}
                                        uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/unchecked.png")} />}
                                    />
                                    <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: 'center' }}>{item.name}</Text>
                                    <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>
                                        <View style={styles.fromContainer}>
                                            <TextInput
                                                style={styles.inputStyle}
                                                color="black"
                                                onChangeText={(text) => { }}
                                            />
                                        </View>
                                        <View style={styles.fromContainer}>
                                            <TextInput
                                                style={styles.inputStyle}
                                                color="black"
                                                placeholder="HH:MM"
                                                onChangeText={(text) => {  }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            )
                        }))}

                        <View style={{ height: 30 }}></View>
                    </Content>
                </Container>
                {/* </View> */}
            </SafeAreaView >
        </>
    )
}

export default ServicesProvided;

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
    mechanic: {
        fontSize: 29,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    },
    price: {
        width: '100%',
        alignSelf: 'center',
        height: 40,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    priceTime: {
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: "black",
        marginRight: 49
    },
    service: {
        fontSize: 18,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: "black",
        alignSelf: 'center',
        paddingVertical: '3%'
    },
    save: {
        justifyContent: "center",
        alignItems: 'center',
        height: 45,
        width: 174,
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
    fromContainer: {
        height: 32,
        width: 68,
        alignSelf: 'center',
        borderColor: LS_COLORS.global.lightTextColor,
        flexDirection: 'row',
        justifyContent: "space-between",
        padding: 10,
        backgroundColor: '#ECECEC',
        marginRight: 20
    },
    inputStyle: {
    },
})





