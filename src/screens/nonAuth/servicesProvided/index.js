import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ImageBackground, StatusBar, Platform, Image, TouchableOpacity, ScrollView } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { useDispatch } from 'react-redux';
import { CheckBox } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'

/* Components */;
import Header from '../../../components/header';
import DropDown from '../../../components/dropDown';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { Container, Content, Row, } from 'native-base'
import { TextInput } from 'react-native-gesture-handler';
import { BASE_URL, getApi } from '../../../api/api';
import Loader from '../../../components/loader';

const ServicesProvided = (props) => {
    const dispatch = useDispatch()
    const { subService, items } = props.route.params
    const [itemList, setItemList] = useState([...items])
    const [loading, setLoading] = useState(false)
    const [selectedItems, setSelectedItems] = useState([])

    useEffect(() => {
        if (!items.length > 0) {
            getServiceItems()
        }
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
            <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content" />
            <View style={{ width: '100%', height: '30%' }}>
                <ImageBackground
                    resizeMode="stretch"
                    source={{ uri: BASE_URL + subService.image }}
                    style={styles.image}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
                            <View style={{ height: "22%", justifyContent: 'flex-end', marginTop: StatusBar.currentHeight + 10 }}>
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
                <View style={styles.container}>
                    <Container style={{ marginTop: 26 }}>
                        <Text style={{ paddingLeft: '5%', fontFamily: LS_FONTS.PoppinsMedium, fontSize: 16, marginBottom: 10 }}>Select Services</Text>
                        {
                            itemList.length > 0
                                ?
                                <Content>
                                    {itemList.map((item, index) => {
                                        return (
                                            <View style={{ flexDirection: "row", paddingLeft: '5%' }}>
                                                <CheckBox
                                                    checked={selectedItems.includes(index)}
                                                    onPress={() => setCheckedData(index)}
                                                    checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/checked.png")} />}
                                                    uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/unchecked.png")} />}
                                                />
                                                <Text style={{ fontSize: 12, right: 10, fontFamily: LS_FONTS.PoppinsRegular, alignSelf: 'center', marginLeft: '4%' }}>{item.name}</Text>
                                            </View>
                                        )
                                    })}
                                    <TouchableOpacity
                                        style={styles.save}
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            props.navigation.navigate("MechanicLocation")
                                        }}>
                                        <Text style={styles.saveText}>Next</Text>
                                    </TouchableOpacity>
                                    <View style={{ height: 30 }}></View>
                                </Content>
                                :
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    {!loading && <Text style={{ fontFamily: LS_FONTS.PoppinsSemiBold, fontSize: 16 }}>No Services Available</Text>}
                                </View>
                        }

                    </Container>
                </View>
                {loading && <Loader />}
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
    }

})





