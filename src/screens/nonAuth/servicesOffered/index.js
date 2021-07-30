import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ImageBackground, StatusBar, Platform, Image, TouchableOpacity, ScrollView } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import { globalStyles } from '../../../utils';
import LS_FONTS from '../../../constants/fonts';
import Loader from '../../../components/loader';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import { CheckBox } from 'react-native-elements'

/* Components */;
import Header from '../../../components/header';
import { Container, Content, Row, } from 'native-base'
import { TextInput } from 'react-native-gesture-handler';
import { BASE_URL, getApi } from '../../../api/api';
import CustomButton from '../../../components/customButton';
import { setAddServiceData } from '../../../redux/features/services';
import { showToast } from '../../../components/validators';

const ServicesProvided = (props) => {
    const dispatch = useDispatch()
    const { subService } = props.route.params
    const user = useSelector(state => state.authenticate.user)
    const isAddServiceMode = useSelector(state => state.services.isAddServiceMode)
    const addServiceData = useSelector(state => state.services.addServiceData)
    const [itemList, setItemList] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedItems, setSelectedItems] = useState([])
    const [servicesData, setServicesData] = useState([])

    useEffect(() => {
        getServiceItems()
    }, [])

    useEffect(() => {
        console.log("servicesData =>", itemList)
    }, [itemList])

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
        let arr2 = [...servicesData]
        if (arr.includes(index)) {
            arr.splice(arr.indexOf(index), 1)
            arr2.splice(arr2.indexOf(index), 1)
        } else {
            arr.push(index)
            arr2.push({
                "item_id": itemList[index].id,
                "price": "",
                "time_duration": "",
            })
        }
        setSelectedItems([...arr])
        setServicesData([...arr2])
    }

    const next = () => {
        let isValid = true
        servicesData.map(item => {
            if (item.price.trim() == "" || item.time_duration.trim() == "") {
                isValid = false                
            }
        })
        if(!isValid){
            return showToast("Please fill in data for selected services")
        }
        if (isAddServiceMode) {
            let services = []
            selectedItems.forEach(element => {
                services.push(itemList[element])
            });
            dispatch(setAddServiceData({
                data: {
                    ...addServiceData,
                    user_id: user.id,
                    service_id: subService.id,
                    json_data: {
                        ...addServiceData.json_data,
                        services: [...servicesData]
                    }
                }
            }))
            if (selectedItems.length > 0) {
                props.navigation.navigate('AddLicense', { subService: subService })
            } else {
                showToast("No items selected")
            }
        } else {

        }
    }

    const setText = (key, text, index) => {
        let temp = [...servicesData]
        if (key == "price") {
            if(text !== ''){
                const replaced = replaceAll(text,"$","");     
                temp[index].price = '$' + replaced + '.00'
            } else {
                temp[index].price = text
            }                        
        } else {
            temp[index].time_duration = text
        }

        setServicesData([...temp])
    }

    function replaceAll(str, find, replace) {
        var escapedFind=find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return str.replace(new RegExp(escapedFind, 'g'), replace);
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
                    <Content showsVerticalScrollIndicator={false}>
                        <Text style={styles.service}>SERVICES</Text>
                        <View style={styles.price}>
                            <Text style={{ ...styles.priceTime, marginRight: '16%' }}>Price</Text>
                            <Text style={styles.priceTime}>Time</Text>
                        </View>
                        {itemList.map(((item, index) => {
                            return (
                                <>
                                    <View key={index} style={{ width: '100%', flexDirection: "row", alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-start' }}>
                                            <CheckBox
                                                checked={selectedItems.includes(index)}
                                                onPress={() => setCheckedData(index)}
                                                checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/checked.png")} />}
                                                uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/unchecked.png")} />}
                                            />
                                            <Text numberOfLines={1} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: 'center', width: '70%' }}>{item.name}</Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
                                            <View style={styles.fromContainer}>
                                                <TextInput
                                                    style={styles.inputStyle}
                                                    color="black"
                                                    placeholder="$000"
                                                    editable={selectedItems.includes(index)}
                                                    onChangeText={(text) => setText("price", text, index)}
                                                    keyboardType="numeric"
                                                    value={servicesData[index]?.price}
                                                />
                                            </View>
                                            <View style={{ ...styles.fromContainer, width: 40, marginRight: '5%' }}>
                                                <TextInput
                                                    style={styles.inputStyle}
                                                    color="black"
                                                    placeholder="HH"
                                                    editable={selectedItems.includes(index)}
                                                    onChangeText={(text) => setText("time_duration", text, index)}
                                                    maxLength={2}
                                                    keyboardType="numeric"
                                                />
                                            </View>
                                            <View style={{ ...styles.fromContainer, width: 40, marginRight: '5%' }}>
                                                <TextInput
                                                    style={styles.inputStyle}
                                                    color="black"
                                                    placeholder="MM"
                                                    editable={selectedItems.includes(index)}
                                                    onChangeText={(text) => setText("time_duration", text, index)}
                                                    maxLength={2}
                                                    keyboardType="numeric"
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </>
                            )
                        }))}
                    </Content>
                    <View style={{ paddingBottom: '2.5%' }}>
                        <CustomButton title={isAddServiceMode ? "Next" : "Save"} action={() => next()} />
                    </View>
                </Container>
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
        marginRight: '11%'
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
        height: 40,
        width: 75,
        alignItems: 'center',
        borderColor: LS_COLORS.global.lightTextColor,
        justifyContent: "center",
        backgroundColor: '#ECECEC',
        paddingHorizontal: 5,
        marginRight: '10%'
    },
    inputStyle: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        textAlign: 'center'
    },
})





