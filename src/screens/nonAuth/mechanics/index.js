import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ImageBackground, StatusBar, Platform, Image, TouchableOpacity, ScrollView } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import { globalStyles, showToast } from '../../../utils';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import { CheckBox } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

/* Components */;
import Header from '../../../components/header';
import { Card, Container, Content, Row, Toast, } from 'native-base'
import Loader from '../../../components/loader';
import { BASE_URL, getApi } from '../../../api/api';
import { Rating } from 'react-native-ratings';
import SureModal from '../../../components/sureModal';
import SureModal1 from '../../../components/sureModal1';;
import TimeFrame from '../../../components/timeFrame';


const Mechanics = (props) => {
    const { data, subService, extraData } = props.route.params
    const [loading, setLoading] = useState(false)
    const [providers, setProviders] = useState([])
    const [selectedProviders, setSelectedProviders] = useState([])
    const access_token = useSelector(state => state.authenticate.access_token)
    const user = useSelector(state => state.authenticate.user)
    const [price, setPrice] = useState(false)
    const [time, setTime] = useState(false)
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(false)
    const [open1, setOpen1] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [selectedItems, setSelectedItems] = useState([])
    const [selectedItemsWithProviders, setSelectedItemsWithProviders] = useState([])
    const [selectedProducts, setSelectedProducts] = useState([])
    const [apiData, setApiData] = useState([])

    console.log("===>>>", selectedItemsWithProviders)

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
            endPoint: '/api/providerListOrder',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    let proData = Object.keys(response.data).map((item, index) => {
                        return response.data[item]
                    })
                    setProviders(proData)
                    setLoading(false)
                }
                else {
                    setOpen1(!open)
                    setLoading(false)
                }
            }).catch(err => {
                setLoading(false)
            })
    }

    const add = () => {
        let json_data = {
            "provider_id": selectedItemsWithProviders[0]?.providerId,
            "estimated_reached_time": "0",
            "order_start_time": "2021-09-26 08:00:00",
            "order_end_time": "2021-09-26 11:00:00",
            "items": selectedItemsWithProviders.map((i) => { return String(i.itemId) }),
            "products": ["1"],
            "other_options": [
                // {
                //     "item_id": "",
                //     "product_id": "",
                //     "other": "",
                //     "have_own": "",
                //     "need_recommendation": ""
                // }
            ]
        }
        let arr = [...apiData]
        { json_data.provider_id ? arr.push(json_data) : null }
        setApiData([...arr])
    }

    const placeOrder = () => {
        setLoading(true)
        var formdata = new FormData();
        apiData.forEach((item, index) => {
            formdata.append('items_data', JSON.stringify([{ ...item }]))
        })
        // formdata.append("items_data", JSON.stringify([
        //     {
        //         "provider_id": "30",
        //         "estimated_reached_time": "0",
        //         "order_start_time": "2021-09-26 08:00:00",
        //         "order_end_time": "2021-09-26 11:00:00",
        //         "items": ["18"],
        //         "products": ["1"],
        //         "other_options": [
        //             // {
        //             //     "item_id": "",
        //             //     "product_id": "",
        //             //     "other": "",
        //             //     "have_own": "",
        //             //     "need_recommendation": ""
        //             // }
        //         ]
        //     }
        // ]))
        formdata.append("order_placed_address", data.order_placed_address)
        formdata.append("order_placed_lat", data.order_placed_lat.toString())
        formdata.append("order_placed_long", data.order_placed_long.toString())
        formdata.append("order_from_address", data.order_from_address)
        formdata.append("order_from_lat", data.order_from_lat.toString())
        formdata.append("order_from_long", data.order_from_long.toString())
        setLoading(true)
        let headers = {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${access_token}`
        }
        let config = {
            headers: headers,
            data: formdata,
            endPoint: '/api/createOrder',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    setLoading(false)
                }
                else {
                    setLoading(false)
                }
            }).catch(err => {
                console.log(err)
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

    const onSelecItems = (item) => {
        let Items = { providerId: item.user_id, itemId: item.service_item_id, service_name: item.service_items_name, price: item.productTotalPrice, name: item.name, duration: item.time_duration }
        let x = {}
        let z = {}
        let data = []
        let realData = []
        for (let index = 0; index < selectedItemsWithProviders.length; index++) {
            const items = selectedItemsWithProviders[index];
            if (items.itemId == item.service_item_id && items.providerId == item.user_id) {
                x = { item: items, flag: false }
                data.push(x)
            }
            else if (items.itemId != item.service_item_id && items.providerId == item.user_id) {
                if (Items.providerId == items.providerId && Items.itemId == items.itemId) {
                    x = { item: items, flag: false }
                }
                else {
                    x = { item: items, flag: true }
                }
                data.push(x)
                if (Items.providerId == items.providerId && Items.itemId == items.itemId) {
                    z = { item: Items, flag: false }
                }
                else {
                    let f = true
                    for (let index = 0; index < data.length; index++) {
                        const elements = data[index];
                        if (elements.item.itemId == Items.itemId) {
                            f = false
                        }
                    }
                    if (f) {
                        z = { item: Items, flag: true }
                    }
                    else {
                        z = { item: Items, flag: false }
                    }
                }
                data.push(z)
            }
            else if (items.itemId == item.service_item_id && items.providerId != item.user_id) {
                x = { item: items, flag: false }
                z = { item: Items, flag: true }
                data.push(x)
                data.push(z)
            }
            else if (items.itemId != item.service_item_id && items.providerId != item.user_id) {
                x = { item: items, flag: true }
                data.push(x)
            }
        }
        if (selectedItemsWithProviders.length == 0) {
            data.push({ item: Items, flag: true })
        }
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            if (element.flag) {
                realData.push(element.item)
            }
        }
        setSelectedItemsWithProviders([...realData])
        // add()
        console.log("after", data)
    }

    const checkIncludes = (item) => {
        let flag = false;
        for (let index = 0; index < selectedItemsWithProviders.length; index++) {
            const element = selectedItemsWithProviders[index];
            if (item.service_item_id == element.itemId && element.providerId == item.user_id) {
                flag = true
            }
        }
        if (flag) {
            return true
        }
        else {
            return false
        }
    }

    const checkIncludesProduct = (item) => {
        let flag = false;
        for (let index = 0; index < selectedItems.length; index++) {
            const element = selectedItems[index];
            if (item.service_item_id == element.itemId && element.providerId == item.user_id) {
                flag = true
            }
        }
        if (flag) {
            return true
        }
        else {
            return false
        }
    }

    const onSelectProducts = (item) => {
        let temp = [...selectedProducts]
        if (selectedProducts.includes(item.item_product_id)) {
            temp.splice(temp.indexOf(item.item_product_id), 1)
        } else {
            temp.push(item.item_product_id)
        }
        setSelectedProducts(temp)
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
                    showToast(response.message)
                }
                else {
                }
            }).catch(err => {
                console.log("error", err)
            })
    }

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <View style={{ width: '100%', height: '30%' }}>
                <SureModal1
                    title="No provider available on selected date or time.Kindly change the time or select different date"
                    pressHandler={() => {
                        setOpen1(!open1);
                    }}
                    visible={open1}
                    action={() => {
                        props.navigation.goBack()
                        setOpen1(!open1);
                    }}
                />
                <TimeFrame
                    visible={open2}
                    action={() => {
                        setOpen2(!open2);
                    }}
                    pressHandler={() => {
                        setOpen2(!open2);
                    }}
                    serviceData={selectedItemsWithProviders}
                />
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
                        <Content showsVerticalScrollIndicator={false} bounces={false} >
                            <View style={{ height: 40, width: '90%', alignSelf: "center", justifyContent: 'space-between', flexDirection: 'row' }}>
                                {/* <TouchableOpacity onPress={() => { setOpen2(!open2) }} style={{ justifyContent: "center", alignItems: "center" }}>
                                    <Image style={{ height: 30, width: 30, alignSelf: "center" }} source={require("../../../assets/filter.png")} />
                                </TouchableOpacity> */}
                                <TouchableOpacity onPress={() => { setPrice(!price), price ? providers.sort((a, b) => a.totalPrice - b.totalPrice) : providers.sort((a, b) => b.totalPrice - a.totalPrice) }} style={styles.upper} >
                                    <Text style={styles.upperText}>Price</Text>
                                    <Image style={{ height: 10, width: 10 }} source={require("../../../assets/sort.png")} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setTime(!time), time ? providers.sort((a, b) => a.timeDuration - b.timeDuration) : providers.sort((a, b) => b.timeDuration - a.timeDuration) }} style={styles.upper} >
                                    <Text style={styles.upperText}>Time</Text>
                                    <Image style={{ height: 10, width: 10 }} source={require("../../../assets/sort.png")} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setRating(!rating), rating ? providers.sort((a, b) => a.rating - b.rating) : providers.sort((a, b) => b.rating - a.rating) }} style={styles.upper} >
                                    <Text style={styles.upperText}>Rating</Text>
                                    <Image style={{ height: 10, width: 10 }} source={require("../../../assets/sort.png")} />
                                </TouchableOpacity>
                            </View>
                            {providers.length > 0 ?
                                providers.map((item, index) => {
                                    let country = item?.current_address?.split(",")
                                    let countryName = country[country?.length - 1]
                                    let x = item.timeDuration / 60
                                    let time_format = ""
                                    if (x > 1) {
                                        time_format = parseInt(x) + " hr " + item.timeDuration % 60 + " min"
                                    } else {
                                        time_format = item.timeDuration + " min"
                                    }
                                    let name = item.first_name
                                    // setName(name)
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
                                            {/* <View style={{ flexDirection: "row", marginTop: 20 }}>
                                                <CheckBox
                                                    checked={selectedProviders.includes(item.id)}
                                                    onPress={() => onSelect(item)}
                                                    checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/checked.png")} />}
                                                    uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/unchecked.png")} />}
                                                />
                                                <Text style={{ fontSize: 16, fontFamily: LS_FONTS.PoppinsSemiBold, color: LS_COLORS.global.green, marginTop: 15, right: 15 }}>{"$" + item.itemTotalPrice}</Text>
                                            </View> */}
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
                                            let x = i.time_duration / 60
                                            let time_format = ""
                                            if (x > 1) {
                                                time_format = parseInt(x) + " hr " + i.time_duration % 60 + " min"
                                            } else {
                                                time_format = i.time_duration + " min"
                                            }
                                            return (
                                                <>
                                                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                                        <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium, }}>{i.service_items_name + "(Service)"}</Text>
                                                        <View style={{ height: 25, flexDirection: "row", }}>
                                                            <Text style={{ fontSize: 12, marginLeft: 10, fontFamily: LS_FONTS.PoppinsMedium }}>{"$" + i.productTotalPrice}</Text>
                                                            <CheckBox
                                                                checked={checkIncludes(i)}
                                                                onPress={() => onSelecItems({ ...i, name: name })}
                                                                checkedIcon={<Image style={{ height: 18, width: 17, resizeMode: 'contain', bottom: 5 }} source={require("../../../assets/checked.png")} />}
                                                                uncheckedIcon={<Image style={{ height: 18, width: 17, resizeMode: 'contain', bottom: 5 }} source={require("../../../assets/unchecked.png")} />}
                                                            />
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
                                                                    <CheckBox
                                                                        checked={checkIncludesProduct(itemData)}
                                                                        onPress={() => onSelectProducts(itemData)}
                                                                        checkedIcon={<Image style={{ height: 18, width: 17, bottom: 5, resizeMode: 'contain' }} source={require("../../../assets/checked.png")} />}
                                                                        uncheckedIcon={<Image style={{ height: 18, width: 17, bottom: 5, resizeMode: 'contain' }} source={require("../../../assets/unchecked.png")} />}
                                                                    />
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
                            }
                            <TouchableOpacity
                                style={styles.save}
                                activeOpacity={0.7}
                                onPress={() => {
                                    setOpen2(!open2)
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





