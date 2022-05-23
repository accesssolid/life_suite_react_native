// #liahs updateOrderItems
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, ImageBackground, StatusBar, Platform, KeyboardAvoidingView, Modal, Image, TextInput, TouchableOpacity, Dimensions, Linking, ScrollView, Alert, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckBox } from 'react-native-elements';
import { Content, Container } from 'native-base'
import { Card, Avatar } from 'react-native-elements'
import TextInputMask from 'react-native-text-input-mask'
/* Components */;
import Header from '../../../components/header';
import DropDown from '../../../components/dropDown';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { BASE_URL, getApi } from '../../../api/api';
import { showToast } from '../../../components/validators';
import { useSelector } from 'react-redux';
import Loader from '../../../components/loader'
// placeholder image
import _ from 'lodash'
import moment from 'moment';
import CustomInput from '../../../components/textInput'
import CustomButton from '../../../components/customButton';



const OrderClientDetail = (props) => {
    const { subService, item } = props.route.params

    const [data, setData] = useState(null)
    const user = useSelector(state => state.authenticate.user)
    const access_token = useSelector(state => state.authenticate.access_token)
    const [loading, setLoading] = React.useState(false)
    const [selected, setSelected] = React.useState(0)
    const [items, setItems] = React.useState([])
    const [order_items, setOrderItems] = React.useState([])
    const [order_id, setOrderId] = React.useState(null)
    // 
    const [selectedItems, setSelectedItems] = React.useState([])
    const [selectedProducts, setSelectedProducts] = React.useState([])
    const [otherProducts, setOtherProducts] = React.useState([])
    const [selectedItem, setSelectedItem] = React.useState(null)
    const [productShow, setProductShow] = React.useState(false)
    // for checking if there is data updation or not
    const [selectedItems1, setSelectedItems1] = React.useState([])
    const [selectedProducts1, setSelectedProducts1] = React.useState([])
    // 
    const [openModal, setOpenModal] = React.useState(false)
    useEffect(() => {
        setOrderId(item.id)
    }, [])

    const [discount, setDiscount] = React.useState({
        discount_type: "",
        discount_amount: ""
    })
    const [totalPrice, setTotalPrice] = React.useState(0)
    const [newTimeNeeded, setTimeNeeded] = React.useState("")

    React.useEffect(() => {
        let otherProductPrice = otherProducts.reduce((a, b) => a + Number(b.product_price), 0)
        let productsPrice = 0
        let itemsPrice = 0
        let timesNeeded = 0
        for (let item of items) {
            if (selectedItems.includes(item.id)) {
                itemsPrice += Number(item.price)
                timesNeeded += Number(item.time_duration)
                productsPrice += item.products.reduce((a, b) => a + Number(b.price), 0)
            }
        }
        setTimeNeeded(timesNeeded)
        setTotalPrice(otherProductPrice + productsPrice + itemsPrice)
    }, [selectedProducts, selectedItems, otherProducts])

    React.useEffect(() => {
        if (data?.order_items) {
            setOrderItems(data?.order_items)
            let i = []
            let p = []
            let extras = []
            for (let item of data?.order_items) {
                i.push(item.item_id)
                for (let product of item.product?.map(x => x.product_id)) {
                    p.push(product)
                }
                for (let product of item.extra_product) {
                    extras.push({ item_id: item.item_id, product_name: product.product_name, product_price: product.product_price })
                }
            }
            setSelectedItems(i)
            setSelectedProducts(p)
            setSelectedProducts1(p)
            setSelectedItems1(i)
            setOtherProducts(extras)
        }
    }, [data])

    const checkTimeFrameIncrease = () => {
        if (moment(data.order_start_time).add(newTimeNeeded, "minutes").toDate() > moment(data.requested_end_time).toDate()) {
            return moment(data.order_start_time).add(newTimeNeeded, "minutes").format("YYYY-MM-DD HH:mm:[00]")
        } else {
            return data.requested_end_time
        }
    }

    const checkforUpdate = () => {
        let si = [...selectedItems].sort((a, b) => Number(a) - Number(b)).join("")
        let si1 = [...selectedItems1].sort((a, b) => Number(a) - Number(b)).join("")
        let pi = [...selectedProducts].sort((a, b) => Number(a) - Number(b)).join("")
        let pi1 = [...selectedProducts1].sort((a, b) => Number(a) - Number(b)).join("")
        if (pi == pi1 && si == si1 && otherProducts.length == 0) {
            return true
        }
        return false
    }

    const submitOrderUpdateDetail = () => {

        if (checkforUpdate()) {
            return
        }
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }


        let newServices = items.filter(x => String(x.id).startsWith("new")).map(x => {
            return (
                {
                    item_name: x.name,
                    price: x.price,
                    time_duration: Number(x?.time_duration_h) * 60 + Number(x?.time_duration_m),
                    variant_data: x.variant_data,
                    products: otherProducts.filter(p => String(p.item_id).startsWith("new"))
                }
            )
        })

        let config = {
            headers: headers,
            data: JSON.stringify({
                order_id: order_id,
                items_data: JSON.stringify({
                    estimated_reached_time: data.estimated_reached_time,
                    order_start_time: data.order_start_time,
                    order_end_time: moment(data.order_start_time).add(newTimeNeeded, "minutes").format("YYYY-MM-DD HH:mm:[00]"),
                    items: [...new Set(selectedItems.filter(x => !String(x).startsWith("new")))],
                    products: selectedProducts,
                    requested_start_time: data.requested_start_time,
                    requested_end_time: checkTimeFrameIncrease(),
                    other_options: [],
                    extra_products: otherProducts.filter(x => !String(x.item_id).startsWith("new")),
                    new_services: newServices
                }),
                order_placed_address: data.order_placed_address,
                order_placed_lat: data.order_placed_lat,
                order_placed_long: data.order_placed_long,
                order_from_lat: data.order_from_lat,
                order_from_long: data.order_from_long,
                order_from_address: data.order_from_address,
                // discount_type: discount.discount_type,
                // discount_amount: discount.discount_amount,

            }),
            endPoint: '/api/providerOrderUpdate',
            type: 'post'
        }

        getApi(config)
            .then((response) => {

                if (response.status == true) {
                    showToast(response.message)
                    props.navigation.pop()
                } else {
                    showToast(response.message)
                }
            }).catch(err => {
            }).finally(() => {
                setLoading(false)
            })
    }


    const getOrderDetail = (order_id) => {

        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
        let config = {
            headers: headers,
            data: JSON.stringify({ order_id }),
            endPoint: '/api/providerOrderUpdateDetail',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    if (response.data) {
                        setData(response.data)
                        if (response?.added_services_list[0]) {
                            let o_is = response.data.order_items
                            let selected = []
                            let unselected = []
                            for (let s of response?.added_services_list[0].items) {
                                if (o_is.map(i => i.item_id).includes(s.id)) {
                                    selected.push(s)
                                } else {
                                    unselected.push(s)
                                }
                            }
                            setItems(selected.concat(unselected))
                        }
                    } else {

                    }
                } else {
                    showToast(response.message)
                }
            }).catch(err => {
            }).finally(() => {
                setLoading(false)
            })
    }




    useEffect(() => {
        if (item.id) {
            getOrderDetail(item.id)
        }
    }, [item])


    const addNewService = (data) => {
        setItems([...items, data])
    }

    return (
        <View style={{ flex: 1, backgroundColor: LS_COLORS.global.white }}>
            <StatusBar
                backgroundColor={LS_COLORS.global.green}
                barStyle="light-content" />
            <HeaderView action={() => {
                if (productShow) {
                    if (otherProducts.filter(x => x.product_name.trim() == "" || x.product_price.trim() == "").length > 0) {
                        showToast("Don't leave other product name and price empty!")
                        return
                    }
                    setProductShow(false)
                    setSelectedItem(null)
                } else {
                    props.navigation.goBack()
                }
            }} data={data} navigation={props.navigation} subService={subService} />
            <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
                <View style={{ flexDirection: "row", justifyContent: "space-around", backgroundColor: "white", paddingTop: 10 }}>
                    <TouchableOpacity
                        style={[styles.save, { borderRadius: 40, height: 35, marginTop: 0 }]}
                        activeOpacity={0.7}
                        onPress={() => { props.navigation.navigate("AddDiscount", { totalPrice, setDiscount: setDiscount.bind(this), discount: discount, order_id: item.id }) }}>
                        <Text maxFontSizeMultiplier={1.2} style={styles.saveText}>Add Discount</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.container}>
                    {/* <RenderView /> */}
                    <ScrollView contentContainerStyle={{ paddingVertical: 16 }}>
                        {/* items view */}
                        <ItemsView
                            items={items}
                            selectedItems={selectedItems}
                            selectedProducts={selectedProducts}
                            otherProducts={otherProducts}
                            selectedItem={selectedItem}
                            productShow={productShow}
                            setItems={setItems}
                            setProductShow={setProductShow}
                            setSelectedItem={setSelectedItem}
                            setSelectedItems={setSelectedItems}
                            setSelectedProducts={setSelectedProducts}
                            setOtherProducts={setOtherProducts}
                        />
                        {!productShow && <CustomButton title="Add Service"
                            action={() => {
                                setOpenModal(true)
                            }}
                            customStyles={{
                                height: 40,
                                width: "35%",
                                borderRadius: 5,
                                marginBottom: 15
                            }}
                            customTextStyles={{
                                fontSize: 13,
                                fontFamily: LS_FONTS.PoppinsRegular
                            }}
                            textProps={{
                                maxFontSizeMultiplier: 1.2
                            }}
                        />}
                    </ScrollView>
                    <View style={{ flexDirection: "row", justifyContent: "space-around", marginHorizontal: 20, marginVertical: 5 }}>
                        {selectedItem == null && <TouchableOpacity
                            style={styles.save}
                            activeOpacity={0.7}
                            onPress={() => { submitOrderUpdateDetail() }}>
                            <Text maxFontSizeMultiplier={1.2} style={styles.saveText}>Update Order Item</Text>
                        </TouchableOpacity>}
                        {selectedItem && <TouchableOpacity
                            style={styles.save}
                            activeOpacity={0.7}
                            onPress={() => {
                                if (otherProducts.filter(x => x.product_name.trim() == "" || x.product_price.trim() == "").length > 0) {
                                    showToast("Don't leave other product name and price empty!")
                                    return
                                }
                                setProductShow(false)
                                setSelectedItem(null)
                            }}>
                            <Text maxFontSizeMultiplier={1.2} style={styles.saveText}>Save</Text>
                        </TouchableOpacity>}
                    </View>
                </View>
            </SafeAreaView >
            {loading && <Loader />}
            <CheckServiceNameModal setLoading={setLoading} items={items} addNewService={addNewService} visible={openModal} setVisible={setOpenModal} />

        </View>
    )
}

export default OrderClientDetail;



const ItemsView = ({ items, selectedItem, setItems, productShow, setProductShow, setSelectedItem, selectedItems, selectedProducts, otherProducts, setSelectedItems, setSelectedProducts, setOtherProducts }) => {

    const [showItems, setShowItems] = React.useState([])

    React.useEffect(() => {
        if (selectedItem) {
            setShowItems(items.filter(x => x.id == selectedItem))
        } else {
            setShowItems(items)
        }
    }, [items, selectedItem])

    return (
        <>
            <View style={styles.itemViewContainerStyle}>
                <View style={styles.itemNameContainerStyle} />
                <View style={{ flex: 1, flexDirection: "row", paddingHorizontal: 20 }}>
                    <Text maxFontSizeMultiplier={1.2} style={[styles.itemTextStyle, { width: "55%" }]}>Estimated Time</Text>
                    <Text maxFontSizeMultiplier={1.2} style={[styles.itemTextStyle, { width: "45%" }]}>Price</Text>
                </View>
            </View>
            {showItems.map(x => {
                let isSelected = selectedItems.includes(x.id)
                const otherProductsForItem = otherProducts.map((oth, index) => ({ ...oth, index })).filter(other => other.item_id == x.id)
                const totalSelectedProductForItem = x.products.filter(p => selectedProducts.includes(p.id))

                return (<ItemView
                    otherProductsForItem={otherProductsForItem}
                    setSelectedItems={setSelectedItems}
                    setSelectedProducts={setSelectedProducts}
                    setOtherProducts={setOtherProducts}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                    item={x}
                    isSelected={isSelected}
                    setItems={setItems}
                    productShow={productShow}
                    setProductShow={setProductShow}
                    totalSelectedProductForItem={totalSelectedProductForItem}
                    selectedProducts={selectedProducts} />)
            })}

        </>
    )
}





const ItemView = ({
    item,
    isSelected,
    selectedProducts,
    selectedItem,
    totalSelectedProductForItem,
    otherProductsForItem,
    setSelectedProducts,
    setSelectedItems,
    setSelectedItem,
    setItems,
    productShow,
    setProductShow,
    setOtherProducts }) => {
    return (
        <>
            <View style={styles.itemViewContainerStyle}>
                <View style={[styles.itemNameContainerStyle]}>
                    <CheckBox
                        checked={isSelected}
                        onPress={() => {
                            setSelectedItem(item.id)
                            setProductShow(true)
                            if (isSelected) {
                                if (productShow) {
                                    setSelectedItems(state => state.filter(x => x != item.id))
                                    setOtherProducts(state => state.filter(x => x.item_id != item.id))

                                    if (item?.products) {
                                        item.products.forEach(p => {
                                            setSelectedProducts(state => state.filter(x => p.id != x))
                                        })
                                    }
                                }
                            } else {
                                setSelectedItems(state => [...new Set([...state, item.id])])
                            }
                        }}
                        checkedIcon={<Image style={{ height: 23, width: 23 }} resizeMode="contain" source={require("../../../assets/checked.png")} />}
                        uncheckedIcon={<Image style={{ height: 23, width: 23 }} resizeMode="contain" source={require("../../../assets/unchecked.png")} />}
                    />
                    <Text maxFontSizeMultiplier={1.2} style={[styles.itemTextStyle, { flex: 1 }]}>{item?.name}</Text>
                </View>
                {String(item?.id)?.startsWith("new") && productShow ? <View style={{ flexDirection: "row", justifyContent: "space-around", flex: 1, paddingHorizontal: 20 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TextInput value={item?.time_duration_h}
                            onChangeText={t => {
                                setItems(state => {
                                    let d = _.cloneDeep(state).filter(x => x.id != item.id)
                                    return ([...d, { ...item, time_duration_h: t }])
                                })
                            }}
                            placeholder="hh"
                            keyboardType="numeric"
                            maxFontSizeMultiplier={1.1}
                            style={[styles.itemTextStyle, { height: 40, minWidth: 35, maxWidth: 40, paddingVertical: 4, color: LS_COLORS.global.black, backgroundColor: LS_COLORS.global.lightGrey }]} />
                        <TextInput value={item?.time_duration_m}
                            onChangeText={t => {
                                setItems(state => {
                                    let d = _.cloneDeep(state).filter(x => x.id != item.id)
                                    return ([...d, { ...item, time_duration_m: t }])
                                })
                            }}
                            placeholder="mm"
                            keyboardType="numeric"
                            maxFontSizeMultiplier={1.1}
                            style={[styles.itemTextStyle, { minWidth: 37, maxWidth: 40, height: 40, marginLeft: 5, marginRight: 10, paddingVertical: 4, color: LS_COLORS.global.black, backgroundColor: LS_COLORS.global.lightGrey }]} />
                    </View>
                    <TextInput
                        value={"$" + (item?.price == 0 ? "" : item?.price)}
                        onChangeText={t => {
                            let textD = t.replace(/\$/g, "")
                            setItems(state => {
                                let d = _.cloneDeep(state).filter(x => x.id != item.id)
                                return ([...d, { ...item, price: textD }])
                            })
                        }}
                        placeholder="$"
                        maxFontSizeMultiplier={1.1}
                        keyboardType="numeric"
                        style={[styles.itemTextStyle, { minWidth: 35, maxWidth: 40, height: 40, paddingVertical: 4, color: LS_COLORS.global.black, backgroundColor: LS_COLORS.global.lightGrey }]} />
                </View> : <View style={{ flexDirection: "row", flex: 1, paddingHorizontal: 20 }}>
                    <Text maxFontSizeMultiplier={1.2} style={[styles.itemTextStyle, { width: "50%", color: LS_COLORS.global.green }]}>{checkNewOrNot(item?.time_duration_h, item?.time_duration_m, item?.time_duration)}</Text>
                    <Text maxFontSizeMultiplier={1.2} style={[styles.itemTextStyle, { width: "50%", color: LS_COLORS.global.green }]}>${item.price}</Text>
                </View>
                }
            </View>
            {/* products */}
            {productShow &&
                <><View style={{ marginLeft: 20 }}>
                    {item?.products.map(product => {
                        let isSelected1 = selectedProducts.includes(product.id)
                        return (
                            <View style={styles.itemViewContainerStyle}>
                                <View style={styles.itemNameContainerStyle}>
                                    <CheckBox
                                        checked={isSelected1}
                                        onPress={() => {
                                            if (isSelected1) {
                                                let data = selectedProducts.filter(x => x != product.id)
                                                if (totalSelectedProductForItem.length == 1 && otherProductsForItem.length == 0) {
                                                    setSelectedItems(state => state.filter(x => x != item.id))
                                                }
                                                setSelectedProducts(data)
                                            } else {
                                                if (totalSelectedProductForItem.length == 0) {
                                                    setSelectedItems(state => [...state, item.id])
                                                }
                                                setSelectedProducts(state => [...state, product.id])
                                            }
                                        }}
                                        checkedIcon={<Image style={{ height: 23, width: 23 }} resizeMode="contain" source={require("../../../assets/checked.png")} />}
                                        uncheckedIcon={<Image style={{ height: 23, width: 23 }} resizeMode="contain" source={require("../../../assets/unchecked.png")} />}
                                    />
                                    <Text maxFontSizeMultiplier={1.2} style={[styles.itemTextStyle, { flex: 1 }]}>{product?.name}</Text>
                                </View>
                                <View style={{ flexDirection: "row", flex: 1, justifyContent: "flex-end", paddingHorizontal: 20 }}>
                                    <Text maxFontSizeMultiplier={1.2} style={[styles.itemTextStyle, { width: "50%", color: LS_COLORS.global.green }]}>${product.price}</Text>
                                </View>
                            </View>
                        )
                    })}
                    {/* other */}
                    <View style={styles.itemViewContainerStyle}>
                        <View style={styles.itemNameContainerStyle}>
                            <CheckBox
                                checked={otherProductsForItem.length > 0}
                                onPress={() => {
                                    if (otherProductsForItem.length <= 0) {
                                        setOtherProducts(state => [...state, { item_id: item.id, product_name: "", product_price: "" }])
                                        if (!isSelected) {
                                            setSelectedItems(state => [...state, item.id])
                                        }
                                    } else {
                                        setOtherProducts(state => state.filter(other => other.item_id != item.id))
                                        if (isSelected && totalSelectedProductForItem.length == 0) {
                                            setSelectedItems(state => state.filter(i => i != item.id))
                                        }
                                    }
                                }}
                                checkedIcon={<Image style={{ height: 23, width: 23 }} resizeMode="contain" source={require("../../../assets/checked.png")} />}
                                uncheckedIcon={<Image style={{ height: 23, width: 23 }} resizeMode="contain" source={require("../../../assets/unchecked.png")} />}
                            />
                            <Text maxFontSizeMultiplier={1.2} numberOfLines={1} style={[styles.itemTextStyle]}>Other</Text>
                        </View>
                        <View style={{ flexDirection: "row", flex: 1, justifyContent: "flex-end", paddingHorizontal: 20 }}>
                        </View>
                    </View>
                </View>
                    {otherProductsForItem.map(other => {
                        return <AddOtherProduct removeItemFromSelected={() => {
                            if (isSelected && totalSelectedProductForItem.length == 0 && otherProductsForItem.length == 1) {
                                setSelectedItems(state => state.filter(i => i != item.id))
                            }
                        }} otherProductsForItem={otherProductsForItem} other={other} setOtherProducts={setOtherProducts} />
                    })}
                    {otherProductsForItem.length > 0 && <TouchableOpacity
                        onPress={() => {
                            setOtherProducts(state => [...state, { item_id: item.id, product_name: "", product_price: "" }])
                        }}
                        style={{ alignSelf: "center", marginTop: 10 }}
                    >
                        <Image source={require('../../../assets/addgreen.png')} resizeMode="contain" style={{ height: 20, width: 20 }} />
                    </TouchableOpacity>}
                </>
            }

        </>
    )
}

const AddOtherProduct = ({ item, setOtherProducts, other, removeItemFromSelected }) => {
    return (
        <View key={"S"} style={{ flexDirection: 'row', width: '85%', alignSelf: 'flex-end', justifyContent: 'space-evenly', alignItems: 'center' }}>
            <View style={{ marginRight: '2.5%' }}>
                <TextInput
                    // style={[styles.inputStyle, , { width: 120, height: 40 }]}
                    style={[styles.itemTextStyle, { width: 120, height: 40, color: LS_COLORS.global.black, backgroundColor: LS_COLORS.global.lightGrey }]}
                    color="black"
                    placeholder="Product Name"
                    // editable={props.selectedNewProducts.includes(item.temp_id)}
                    onChangeText={(text) => {
                        setOtherProducts(state => {
                            let data = _.cloneDeep(state)
                            data[other.index].product_name = text
                            return data
                        })
                    }}
                    value={other?.product_name}
                    returnKeyType={"default"}
                    placeholderTextColor={LS_COLORS.global.placeholder}
                    maxFontSizeMultiplier={1.2}
                />
            </View>
            <View style={{ marginRight: '2%' }}>
                <TextInput
                    // style={[styles.inputStyle, { width: 60, height: 40 }]}
                    style={[styles.itemTextStyle, { width: 60, height: 40, color: LS_COLORS.global.black, backgroundColor: LS_COLORS.global.lightGrey }]}
                    color="black"
                    placeholder="$000"
                    onChangeText={(text) => {
                        let d = text.replace(/\$/g, "")
                        setOtherProducts(state => {
                            let data = _.cloneDeep(state)
                            data[other.index].product_price = d
                            return data
                        })
                    }}
                    keyboardType="numeric"
                    value={"$" + other?.product_price}
                    returnKeyType={'done'}
                    placeholderTextColor={LS_COLORS.global.placeholder}
                    maxFontSizeMultiplier={1.2}
                />
            </View>
            <TouchableOpacity onPress={() => {
                setOtherProducts(state => {
                    let data = [...state]
                    data.splice(other.index, 1)
                    return data
                })
                removeItemFromSelected()
            }} activeOpacity={0.7} style={{ height: 40, aspectRatio: 1, padding: 10, marginRight: '2%' }}>
                <Image source={require('../../../assets/cancel.png')} resizeMode="contain" style={{ height: '100%', width: '100%', tintColor: "red" }} />
            </TouchableOpacity>
        </View>)
}


const convertMinsToHrsMins = (mins) => {
    let h = Math.floor(mins / 60);
    let m = Math.round(mins % 60);
    h = (h < 10) ? ('0' + h) : (h);
    m = (m < 10) ? ('0' + m) : (m);
    if (h <= 0) {
        return `${m} min`
    }
    return `${h} hr ${m} min`;
}

const checkNewOrNot = (hour, mins, duration) => {
    if (Boolean(Number(hour)) || Boolean(Number(mins))) {
        return convertMinsToHrsMins(Number(mins) + Number(hour) * 60)
    } else {
        return convertMinsToHrsMins(Number(duration))
    }
}

const HeaderView = ({ subService, navigation, data, action }) => {
    return (
        <View style={{ width: '100%', height: '20%', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, overflow: "hidden" }}>
            <ImageBackground
                resizeMode="cover"
                source={{ uri: BASE_URL + data?.order_items[0]?.services_image }}
                style={[styles.image]}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
                        <View style={{ height: "100%", justifyContent: 'center' }}>
                            <Header
                                imageUrl={require("../../../assets/backWhite.png")}
                                action={() => {
                                    if (action) {
                                        action()
                                    } else {
                                        navigation.goBack()
                                    }

                                }}
                                title={data?.order_items && data?.order_items[0]?.services_name}
                                titleStyle={{ color: "white" }}
                                imageUrl1={require("../../../assets/homeWhite.png")}
                                action1={() => {
                                    navigation.navigate("MainDrawer", { screen: "HomeScreen" })
                                }}
                                imageStyle1={{ tintColor: "white" }}
                            />
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: "center", height: "33%" }}>
                            <Text maxFontSizeMultiplier={1.2} style={{ fontSize: 29, fontFamily: LS_FONTS.PoppinsMedium, color: LS_COLORS.global.white }}>{subService?.name}</Text>
                        </View>
                    </SafeAreaView>
                </View>
            </ImageBackground>
        </View>
    )
}



const CheckServiceNameModal = ({ visible, setVisible, addNewService, items, setLoading }) => {
    const [service_name, setServiceName] = React.useState("")
    const access_token = useSelector(state => state.authenticate.access_token)
    const [service_id, setServiceID] = React.useState(null)
    const [variant_id, setVariantID] = React.useState(null)
    React.useEffect(() => {
        if (items[0]) {
            setServiceID(items[0]?.service_id)
            setVariantID(items[0]?.variant_data)
        }
    }, [items])

    React.useEffect(() => {
        if (visible) {
            setServiceName("")
        }
    }, [visible])

    const checkName = async () => {
        try {
            setLoading(true)
            let headers = {
                "Authorization": `Bearer ${access_token}`
            }
            let body = new FormData()
            body.append("service_id", service_id)
            body.append("name", service_name)
            let config = {
                headers: headers,
                data: body,
                endPoint: '/api/addProviderItemExist',
                type: 'post'
            }
            let res = await getApi(config)
            if (res.status) {
                setVisible(false)
                addNewService(
                    {
                        id: "new-" + Date.now(),
                        "name": service_name,
                        "price": 0,
                        "time_duration": 0,
                        time_duration_h: 0,
                        time_duration_m: 0,
                        "variant_data": variant_id,
                        "is_product_mandatory": "0",
                        "service_id": 14,
                        "products": [
                        ],
                        "list_type": "global",
                        "request_status": "",
                        "added_by_provider": null,
                        "status": 1,
                        "created_at": "2021-10-15 20:42:42",
                        "updated_at": "2021-10-15 20:42:42",
                    }
                )

            } else {
                showToast(res.message)
            }
        } catch (err) {

        } finally {
            setLoading(false)

        }
    }

    return (
        <Modal
            visible={visible}
            transparent={true}
        >
            <Pressable onPress={() => setVisible(false)} style={{ flex: 1, justifyContent: "center", backgroundColor: "#0005" }}>
                <Pressable style={{ backgroundColor: "white", padding: 10, borderRadius: 10, marginHorizontal: 15 }}>
                    <Text maxFontSizeMultiplier={1.2} style={{ textAlign: "center", fontFamily: LS_FONTS.PoppinsRegular, color: "black", fontSize: 16 }}>Enter Service name</Text>
                    <CustomInput
                        text="Service Name"
                        customContainerStyles={{ marginTop: 20 }}
                        value={service_name}
                        onChangeText={t => setServiceName(t)}
                    />
                    <CustomButton
                        title="Submit"
                        action={() => {
                            checkName()
                        }}
                        customStyles={{ height: 40, width: "35%", borderRadius: 5, marginTop: 20 }}
                        customTextStyles={{ fontSize: 12 }}
                    />
                </Pressable>
            </Pressable>
        </Modal>
    )
}

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
    service: {
        fontSize: 18,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: "black",
        alignSelf: 'center',
        paddingVertical: '3%'
    },
    variantContainerStyle: {
        backgroundColor: LS_COLORS.global.white,
        marginHorizontal: 10,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: LS_COLORS.global.green

    },
    varinatTextStyle: {
        fontFamily: LS_FONTS.PoppinsMedium,
        fontSize: 14,
        textTransform: 'uppercase',
        color: LS_COLORS.global.black,
    },
    save: {
        justifyContent: "center",
        alignItems: 'center',
        height: 45,
        width: "40%",
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
    client_info_text: {
        textAlign: "center",
        fontSize: 16,
        fontFamily: LS_FONTS.PoppinsBold,
        color: LS_COLORS.global.black,
        textTransform: "uppercase"
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
    },
    fromContainer: {
        height: 50,
        width: "100%",
        alignSelf: 'center',
        borderColor: LS_COLORS.global.lightTextColor,
        borderRadius: 3,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        overflow: 'hidden',
        paddingLeft: '5%'
    },
    inputStyle: {
        height: 30,
        width: 100,
        paddingHorizontal: 10,
        textAlign: "center",
        borderWidth: 1,
        borderRadius: 5,
        borderColor: LS_COLORS.global.green
    },
    mapContainer: {
        height: Dimensions.get('screen').height / 4,
        width: Dimensions.get('screen').width,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    greenTextStyle: {
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.green
    },
    baseTextStyle: {
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.black
    },
    itemViewContainerStyle: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    itemViewContainerCStyle: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    itemTextStyle: {
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        alignSelf: 'center',
        textAlign: "center"
    },
    itemNameContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        width: '50%'
    }
})





