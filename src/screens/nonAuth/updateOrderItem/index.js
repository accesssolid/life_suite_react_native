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
    const [selectedData, setSelectedData] = React.useState(null)
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

    useEffect(() => {
        console.log(items)
    }, [items])

    React.useEffect(() => {
        let otherProductPrice = otherProducts.reduce((a, b) => a + Number(b.product_price), 0)
        let productsPrice = 0
        let itemsPrice = 0
        let timesNeeded = 0
        for (let item of items) {
            if (selectedItems.includes(item.id)) {
                itemsPrice += Number(item.price)
                timesNeeded += Number(item?.time_duration_h != "" ? item?.time_duration_h : 0) * 60 + Number(item?.time_duration_m != "" ? item?.time_duration_m : 0),
                    productsPrice += item.products.reduce((a, b) => a + Number(b.price), 0)
            }
        }
        setTimeNeeded(timesNeeded)
        setTotalPrice(otherProductPrice + productsPrice + itemsPrice)
    }, [selectedProducts, selectedItems, otherProducts, items])

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

    const [updated, setUpdated] = useState(false)

    const checkforUpdate = () => {
        let si = selectedItems ? [...selectedItems].sort((a, b) => Number(a??0) - Number(b??0)).join("") : ""
        let si1 = selectedItems1 ? [...selectedItems1].sort((a, b) => Number(a??0) - Number(b??0)).join("") : ""
        let pi = selectedProducts ? [...selectedProducts].sort((a, b) => Number(a??0) - Number(b)).join("") : ""
        let pi1 = selectedProducts1 ? [...selectedProducts1].sort((a, b) => Number(a??0) - Number(b??0)).join("") : ""
        if (pi == pi1 && si == si1 && otherProducts?.length == 0) {
            return true
        }
        return false
    }

    const convertHHMMToMinutes = (h, m) => {
        let h1 = 0
        let m1 = 0
        if (String(h)?.trim() != "") {
            h1 = String(h)?.trim()
        }
        if (String(m)?.trim() != "") {
            m1 = String(m)?.trim()
        }
        let hNumber = Number(h1) * 60
        let mNumber = Number(m1)
        return hNumber + mNumber
    }

    const submitOrderUpdateDetail = () => {

        if (checkforUpdate() && !updated) {
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
                    time_duration: (x?.time_duration_h?.trim()==""&&x?.time_duration_m?.trim()=="")?"":(Number(x?.time_duration_h != "" ? x?.time_duration_h : 0) * 60 + Number(x?.time_duration_m != "" ? x?.time_duration_m : 0)),
                    variant_data: x.variant_data,
                    products: otherProducts.filter(p => String(p.item_id).startsWith("new"))
                }
            )
        })
        let productsC = []
        let itemsC = [...new Set(selectedItems.filter(x => !String(x).startsWith("new")))].map(x => {
            let f = items.find(z => z.id == x)
            if (f) {
                let productsC1 = f?.products
                if (productsC1) {
                    for (let p of productsC1) {
                        if (selectedProducts?.includes(p.id)) {
                            productsC.push({
                                "product_id": p.id,
                                "price": p.price
                            })
                        }
                    }
                }
                return ({
                    "item_id": x,
                    "time_duration":(String(f?.time_duration_h)?.trim()==""&&String(f?.time_duration_m)?.trim()=="")? "":convertHHMMToMinutes(f?.time_duration_h, f?.time_duration_m),
                    "price": f?.price
                })
            }
            return null
        }).filter(x => x != null)
        // console.log(itemsC)
        // setLoading(false)
        // return
        let config = {
            headers: headers,
            data: JSON.stringify({
                order_id: order_id,
                items_data: JSON.stringify({
                    estimated_reached_time: data.estimated_reached_time,
                    order_start_time: data.order_start_time,
                    order_end_time: moment(data.order_start_time).add(newTimeNeeded, "minutes").format("YYYY-MM-DD HH:mm:[00]"),
                    items: itemsC,
                    products: productsC,
                    requested_start_time: data.requested_start_time,
                    requested_end_time: checkTimeFrameIncrease(),
                    other_options: [],
                    extra_products: otherProducts.filter(x => !String(x.item_id).startsWith("new")).map(x => ({ ...x, price: (x?.price?.trim() == "" || x?.price?.trim() == "$") ? "" : x.price })),
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

    function minutes_to_hhmm(numberOfMinutes) {
        //create duration object from moment.duration  
        var duration = moment.duration(numberOfMinutes, 'minutes');

        //calculate hours
        var hh = (duration.years() * (365 * 24)) + (duration.months() * (30 * 24)) + (duration.days() * 24) + (duration.hours());

        //get minutes
        var mm = duration.minutes();

        //return total time in hh:mm format
        return ({
            hh,
            mm
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
                        console.log("Response",JSON.stringify(response))
                        setData(response.data)
                        if (response?.added_services_list[0]) {
                            let o_is = response.data.order_items
                            console.log(o_is)
                            let selected = []
                            let unselected = []
                            for (let s of response?.added_services_list[0].items) {
                                if (o_is.map(i => i.item_id).includes(s.id)) {
                                    let omg = o_is.find(x => x.item_id == s.id)
                                    let d = _.cloneDeep(s)
                                    if (omg) {
                                        d.time_duration = omg.duration_time
                                        d.price = omg.price
                                    }
                                    d.products = d?.products?.map(x => {
                                        let p = _.cloneDeep(x)
                                        let oproduct = omg?.product?.find(o => o.product_id == x.id)
                                        console.log("OMG",oproduct)

                                        if (oproduct) {
                                            p.price = oproduct.price
                                        }
                                        if (x?.list_type == "orders" && x?.request_status != "accept") {
                                            return null
                                        }
                                        return p
                                    })
                                    d.products = d?.products?.filter(x => x != null)
                                    // console.log(,d.products)
                                    if (d?.list_type != "orders") {
                                        selected.push(d)
                                    } else {
                                        if (d?.request_status == "accept") {
                                            selected.push(d)
                                        }
                                    }
                                } else {
                                    let d = _.cloneDeep(s)
                                    d.products = d?.products?.map(x => {
                                        let p = _.cloneDeep(x)
                                        if (x?.list_type == "orders" && x?.request_status != "accept") {
                                            return null
                                        }
                                        return p
                                    })
                                    d.products = d?.products?.filter(x => x != null)
                                    if (s?.list_type != "orders") {
                                        unselected.push(d)
                                    } else {
                                        if (s?.request_status == "accept") {
                                            selected.push(d)
                                        }
                                    }
                                }
                            }
                            setItems(selected.concat(unselected).map(x => ({
                                ...x, time_duration_h: (x.time_duration == "" || x.time_duration == null || x.time_duration == "0") ? "" : (minutes_to_hhmm(Number(x.time_duration ?? 0)).hh ?? ""),
                                time_duration_m: (x.time_duration == "" || x.time_duration == null || x.time_duration == "0") ? "" : (minutes_to_hhmm(Number(x.time_duration ?? 0)).mm ?? ""),
                            })))
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
                    if (otherProducts.filter(x => x.product_name.trim() == "").length > 0) {
                        showToast("Don't leave other product name empty!")
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
                            selectedData={selectedData}
                            setSelectedData={setSelectedData}
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
                                if (otherProducts.filter(x => x.product_name.trim() == "").length > 0) {
                                    showToast("Don't leave other product name empty!")
                                    return
                                }
                                setUpdated(true)
                                setProductShow(false)
                                setSelectedItem(null)
                                setItems(state => {
                                    let d = _.cloneDeep(state)
                                    let indext = d.findIndex(x => x?.id == selectedData.id)
                                    d[indext] = selectedData
                                    return d
                                })
                                setSelectedData(null)
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



const ItemsView = ({ items, selectedItem, selectedData,
    setSelectedData, setItems, productShow, setProductShow, setSelectedItem, selectedItems, selectedProducts, otherProducts, setSelectedItems, setSelectedProducts, setOtherProducts }) => {
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
            {showItems.map((x, indexx) => {
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
                    selectedData={selectedData}
                    setSelectedData={setSelectedData}
                    isSelected={isSelected}
                    setItems={setItems}
                    productShow={productShow}
                    setProductShow={setProductShow}
                    totalSelectedProductForItem={totalSelectedProductForItem}
                    selectedProducts={selectedProducts}
                />)
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
    itemIndex,
    setOtherProducts, selectedData,
    setSelectedData, }) => {

    return (
        <>
            <View style={styles.itemViewContainerStyle}>
                <View style={[styles.itemNameContainerStyle]}>
                    <CheckBox
                        checked={isSelected}
                        onPress={() => {
                            setSelectedItem(item.id)
                            setProductShow(true)
                            setSelectedData(item)
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
                {productShow ? <View style={{ flexDirection: "row", justifyContent: "space-around", flex: 1, paddingHorizontal: 20 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TextInput value={String(selectedData?.time_duration_h)}
                            onChangeText={t => {
                                setSelectedData(state => {
                                    return ({ ...state, time_duration_h: t })
                                })
                            }}
                            placeholder="hh"
                            keyboardType="numeric"
                            maxFontSizeMultiplier={1.1}
                            style={[styles.itemTextStyle, { height: 40, minWidth: 35, maxWidth: 40, paddingVertical: 4, color: LS_COLORS.global.black, backgroundColor: LS_COLORS.global.lightGrey }]} />
                        <TextInput value={String(selectedData?.time_duration_m)}
                            onChangeText={t => {
                                setSelectedData(state => {
                                    return ({ ...state, time_duration_m: t })
                                })
                            }}
                            placeholder="mm"
                            keyboardType="numeric"
                            maxFontSizeMultiplier={1.1}
                            style={[styles.itemTextStyle, { minWidth: 37, maxWidth: 40, height: 40, marginLeft: 5, marginRight: 10, paddingVertical: 4, color: LS_COLORS.global.black, backgroundColor: LS_COLORS.global.lightGrey }]} />
                    </View>
                    <TextInput
                        value={"$" + selectedData?.price}
                        onChangeText={t => {
                            let textD = t.replace(/\$/g, "")
                            const validated = String(textD).match(/^(\d*\.{0,1}\d{0,2}$)/)
                            if (validated) {
                                setSelectedData(state => {
                                    return ({ ...state, price: textD })
                                })
                            }

                        }}
                        placeholder="$"
                        maxFontSizeMultiplier={1.1}
                        keyboardType="numeric"
                        style={[styles.itemTextStyle, { minWidth: 35, maxWidth: 40, height: 40, paddingVertical: 4, color: LS_COLORS.global.black, backgroundColor: LS_COLORS.global.lightGrey }]} />
                </View> : <View style={{ flexDirection: "row", flex: 1, paddingHorizontal: 20 }}>
                    <Text maxFontSizeMultiplier={1.2} style={[styles.itemTextStyle, { width: "50%", color: LS_COLORS.global.green }]}>{checkNewOrNot(item?.time_duration_h, item?.time_duration_m, item?.time_duration)}</Text>
                    <Text maxFontSizeMultiplier={1.2} style={[styles.itemTextStyle, { width: "50%", color: LS_COLORS.global.green }]}>{String(item.price)?.trim() == "" ? "TBD" : "$" + item.price}</Text>
                </View>
                }
            </View>
            {/* products */}
            {productShow &&
                <><View style={{ marginLeft: 20 }}>
                    {selectedData?.products.map((product, index) => {
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
                                    <TextInput
                                        style={[styles.itemTextStyle, { width: 60, height: 40, color: LS_COLORS.global.black, backgroundColor: LS_COLORS.global.lightGrey }]}
                                        color="black"
                                        placeholder="$000"
                                        onChangeText={(text) => {
                                            let d = text.replace(/\$/g, "")
                                            const validated = String(d).match(/^(\d*\.{0,1}\d{0,2}$)/)
                                            if (validated) {
                                                setSelectedData(state => {
                                                    let products = _.cloneDeep(selectedData?.products)
                                                    products[index] = { ...product, price: d }
                                                    return { ...state, products }
                                                })
                                            }

                                        }}
                                        keyboardType="numeric"
                                        value={"$" + product?.price}
                                        returnKeyType={'done'}
                                        editable={isSelected1}
                                        placeholderTextColor={LS_COLORS.global.placeholder}
                                        maxFontSizeMultiplier={1.2}
                                    />
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
                        const validated = String(d).match(/^(\d*\.{0,1}\d{0,2}$)/)
                        if (validated) {
                            setOtherProducts(state => {
                                let data = _.cloneDeep(state)
                                data[other.index].product_price = d
                                return data
                            })
                        }

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
    if (hour == "" && mins == "") {
        return "TBD"
    }
    if (Boolean(Number(hour)) || Boolean(Number(mins)) || Number(hour) >= 0 || Number(mins) >= 0) {
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
                        "price": "",
                        "time_duration": 0,
                        time_duration_h: "",
                        time_duration_m: "",
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





