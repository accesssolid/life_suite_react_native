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
import TextInputMask from 'react-native-text-input-mask';

/* Components */;
import Header from '../../../components/header';
import { Container, Content, InputGroup, Row, } from 'native-base'
import { TextInput } from 'react-native-gesture-handler';
import { BASE_URL, getApi } from '../../../api/api';
import CustomButton from '../../../components/customButton';
import { setAddServiceData } from '../../../redux/features/services';
import { showToast } from '../../../components/validators';
import ServiceItem from '../../../components/serviceItem';

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
        setInitialServiceData()
    }, [itemList])

    useEffect(() => {
        console.log("addServiceData =>> ", addServiceData)
    },[addServiceData])

    const getServiceItems = () => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json"
        }

        let user_data = {
            "service_id": subService.id
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

    const setCheckedData = (index, item) => {
        let arr = [...selectedItems]

        if (arr.includes(item.id)) {
            arr.splice(arr.indexOf(item.id), 1)
        } else {
            arr.push(item.id)
        }

        setSelectedItems([...arr])
    }

    const setInitialServiceData = () => {
        let newArr = itemList.map((item, index) => {
            return {
                "item_id": item.id,
                "price": "",
                "time_duration_h": "",
                "time_duration_m": "",
            }
        })
        setServicesData([...newArr])
        if (!isAddServiceMode && subService && subService.items && subService.items.length > 0) {
            setPreviousData(newArr)
        }
    }

    const setPreviousData = (arr) => {
        let temp = [...arr]
        arr.forEach((serviceElement, serviceIndex) => {
            subService.items.forEach((subElement) => {
                if (serviceElement.item_id == subElement.id) {
                    let hours = toHoursAndMinutes(subElement.time_duration, 'hours')
                    let minutes = toHoursAndMinutes(subElement.time_duration, 'minutes')
                    temp[serviceIndex] = {
                        "item_id": serviceElement.item_id,
                        "price": "$" + subElement.price,
                        "time_duration_h": String(minutes),
                        "time_duration_m": String(hours),
                    }
                }
            });
        });

        setServicesData([...temp])
    }

    const next = () => {
        let services = []
        let products = [...addServiceData.json_data.products]
        let newProducts = [...addServiceData.json_data.new_products]
        let isValidData = false
        if (selectedItems.length > 0) {
            servicesData.forEach((itemm, index) => {
                if (selectedItems.includes(itemm.item_id)) {
                    if (itemm.price.trim() !== "" && itemm.time_duration_h.trim() !== "" && itemm.time_duration_m.trim() !== "") {
                        isValidData = true
                        var hoursDotMinutes = `${itemm.time_duration_h}:${itemm.time_duration_m}`;
                        var fieldArray = hoursDotMinutes.split(":");
                        var minutes = Number(fieldArray[0]) + 60 * Number(fieldArray[1]);

                        let obj = {
                            "item_id": itemm.item_id,
                            "price": Number(itemm.price.replace('$', '')),
                            "time_duration": minutes
                        }
                        services.push(obj)
                    } else {
                        isValidData = false
                    }
                }
            })
            if (!isValidData) {
                return showToast("Please enter data for selected services")
            }
        } else {
            showToast("Select Service first")
        }

        products.forEach(item => {
            if (item.price.replace("$", '').trim() == "") {
                return showToast("Please enter data for selected Products")
            }
        })

        newProducts.forEach(item => {
            if (item.price.replace("$", '').trim() == "" || item.name.trim() == '') {
                return showToast("Please enter data for added Products")
            }
        })

        dispatch(setAddServiceData({
            data: {
                ...addServiceData,
                user_id: user.id,
                service_id: subService.id,
                json_data: {
                    ...addServiceData.json_data,
                    services: [...services]
                }
            }
        }))

        verifyNewProducts(services)
    }

    function toHoursAndMinutes(minutes, type) {
        var mins = minutes % 60;
        var hrs = (minutes - mins) / 60;
        // alert(hrs + ":" + mins);
        if (type == 'hours') {
            return hrs
        } else {
            return mins
        }
    }

    const setText = (key, text, index) => {
        let temp = [...servicesData]
        if (key == "price") {
            let parsed = conTwoDecDigit(text.replace('$', ''))
            if (text == '') {
                temp[index].price = ''
            } else {
                temp[index].price = '$' + String(parsed)
            }
        } else if (key == 'time_duration_h') {
            temp[index].time_duration_h = text
        } else {
            temp[index].time_duration_m = text
        }

        setServicesData([...temp])
    }

    conTwoDecDigit = (digit) => {
        return digit.indexOf(".") > 0 ?
            digit.split(".").length >= 2 ?
                digit.split(".")[0] + "." + digit.split(".")[1].substring(-1, 2)
                : digit
            : digit
    }

    const verifyNewProducts = (services) => {
        const products = addServiceData.json_data.new_products.map((item, index) => {
            return {
                "item_id": item.item_id,
                "name": item.name,
                "price": item.price
            }
        })

        if (addServiceData.json_data.new_products.length > 0) {
            setLoading(true)
            let headers = {
                Accept: "application/json",
                "Content-Type": "application/json"
            }

            let user_data = {
                "user_id": user.id,
                "new_products": JSON.stringify([...addServiceData.json_data.new_products])
            }

            let config = {
                headers: headers,
                data: JSON.stringify({ ...user_data }),
                endPoint: '/api/newProductExist',
                type: 'post'
            }

            getApi(config)
                .then((response) => {
                    if (response.status == true) {
                        setLoading(false)
                        if (services.length > 0) {
                            props.navigation.navigate('AddLicense', { subService: subService })
                        } else {
                            showToast("Select Service first")
                        }
                    }
                    else {
                        setLoading(false)
                    }
                }).catch(err => {
                    setLoading(false)
                })
        } else {
            if (services.length > 0) {
                props.navigation.navigate('AddLicense', { subService: subService })
            } else {
                showToast("Select Service first")
            }
        }
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
                            <View style={{ height: "22%", justifyContent: 'flex-end', paddingTop: StatusBar.currentHeight + 20 }}>
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
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginBottom: '2%' }}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ ...styles.priceTime, marginRight: '20%' }}>Time</Text>
                            </View>
                            <View style={{ marginLeft: '5%' }}>
                                <Text style={styles.priceTime}>Price</Text>
                            </View>
                        </View>

                        {
                            isAddServiceMode
                                ?
                                itemList && itemList.length > 0
                                    ?
                                    itemList.map(((item, index) => {
                                        return (
                                            <ServiceItem
                                                key={index}
                                                item={item}
                                                index={index}
                                                onCheckPress={() => setCheckedData(index, item)}
                                                isSelected={selectedItems.includes(item.id)}
                                                setText={setText}
                                                serviceItem={servicesData[index]}
                                                subService={subService}
                                            />
                                        )
                                    }))
                                    :
                                    null
                                :
                                subService && subService.items
                                    ?
                                    subService.items.map(((item, index) => {
                                        return (
                                            <ServiceItem
                                                key={index}
                                                item={item}
                                                index={index}
                                                onCheckPress={() => setCheckedData(index, item)}
                                                isSelected={selectedItems.includes(item.id)}
                                                setText={setText}
                                                serviceItem={servicesData[index]}
                                            />
                                        )
                                    }))
                                    :
                                    null
                        }
                    </Content>
                    <View style={{ paddingBottom: '2.5%' }}>
                        <CustomButton title={isAddServiceMode ? "Next" : selectedItems.length > 0 ? "Next" : "Edit"} action={() => next()} />
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
        marginRight: '13%'
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





