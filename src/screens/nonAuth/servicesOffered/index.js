import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ImageBackground, StatusBar, Platform, Image, TouchableOpacity, ScrollView, Alert } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import { globalStyles } from '../../../utils';
import LS_FONTS from '../../../constants/fonts';
import Loader from '../../../components/loader';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from "react-native-safe-area-context"

/* Components */;
import Header from '../../../components/header';
import { Container, Content, InputGroup, Row, } from 'native-base'
import { BASE_URL, getApi } from '../../../api/api';
import CustomButton from '../../../components/customButton';
import services, { setAddServiceData } from '../../../redux/features/services';
import { showToast } from '../../../components/validators';
import ServiceItem from '../../../components/serviceItem';
import _ from 'lodash';

const ServicesProvided = (props) => {
    const dispatch = useDispatch()
    const { subService } = props.route.params
    const user = useSelector(state => state.authenticate.user)
    const isAddServiceMode = useSelector(state => state.services.isAddServiceMode)
    const addServiceData = useSelector(state => state.services.addServiceData)
    const [itemListMaster, setItemListMaster] = useState([])
    const [itemList, setItemList] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedItems, setSelectedItems] = useState([])
    const [servicesData, setServicesData] = useState([])
    const [productsData, setProductsData] = useState([])
    const [newProductsData, setNewProductsData] = useState([])
    const [selectedProducts, setSelectedProducts] = useState([])
    const [selectedNewProducts, setSelectedNewProducts] = useState([])
    const [isOtherSelected, setIsOtherSelected] = useState(false)
    const [variants, setVariants] = useState([])
    const [selectedVariant, setSelectedVariant] = useState(null)
    const access_token = useSelector(state => state.authenticate.access_token)
    const [activeIndex, setActiveIndex] = useState(null)
    const [activeItem, setActiveItem] = useState(null)
    const itemRef = useRef(null)

    useEffect(() => {
        setServicesData([])
        getServiceItems()
    }, [])

    useEffect(() => {
        setInitialServiceData()
    }, [itemList])

    useEffect(() => {
        filterVariants()
    }, [selectedVariant, itemListMaster])

    const getServiceItems = () => {
        setLoading(true)
        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }

        let user_data = {
            "service_id": subService.id,
            "user_id": user.id
        }

        let config = {
            headers: headers,
            data: JSON.stringify({ ...user_data }),
            endPoint: '/api/providerSubServicesItemList',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    setLoading(false)
                    setItemListMaster([...response.data])
                    if (response.variant_data) {
                        setVariants(response.variant_data)
                        setSelectedVariant(response.variant_data[0].id)
                    }
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
        if (!selectedItems.length > 0) {
            let newArr = itemListMaster.map((item, index) => {
                if (variants.length > 0) {
                    return {
                        "item_id": item.id,
                        "price": "",
                        "time_duration_h": "",
                        "time_duration_m": "",
                        "variant_data": item.variant_data
                    }
                } else {
                    return {
                        "item_id": item.id,
                        "price": "",
                        "time_duration_h": "",
                        "time_duration_m": "",
                    }
                }
            })
            setServicesData([...newArr])
        }

        if (!isAddServiceMode) {
            let arr = []
            let selected = []
            if (variants.length > 0) {
                itemListMaster.forEach((item, index) => {
                    subService?.items?.forEach((ele, ind) => {
                        if (item.id == ele.id && item.variant_data == ele.variant_data) {
                            let hours = toHoursAndMinutes(ele.time_duration, 'hours')
                            let minutes = toHoursAndMinutes(ele.time_duration, 'minutes')
                            arr.push({
                                "item_id": item.id,
                                "price": "$" + ele.price,
                                "time_duration_h": String(minutes),
                                "time_duration_m": String(hours),
                                "variant_data": item.variant_data
                            })
                            selected.push(ele.id)
                        }
                    });
                });

                itemListMaster.forEach(item => {
                    if (!selected.includes(item.id)) {
                        arr.push({
                            "item_id": item.id,
                            "price": "",
                            "time_duration_h": "",
                            "time_duration_m": "",
                            "variant_data": item.variant_data
                        })
                    }
                })
            } else {
                itemListMaster.forEach((item, index) => {
                    subService?.items?.forEach((ele, ind) => {
                        if (item.id == ele.id) {
                            let hours = toHoursAndMinutes(ele.time_duration, 'hours')
                            let minutes = toHoursAndMinutes(ele.time_duration, 'minutes')
                            arr.push({
                                "item_id": item.id,
                                "price": "$" + ele.price,
                                "time_duration_h": String(minutes),
                                "time_duration_m": String(hours),
                            })
                            selected.push(ele.id)
                        }
                    });
                });

                itemListMaster.forEach(item => {
                    if (!selected.includes(item.id)) {
                        arr.push({
                            "item_id": item.id,
                            "price": "",
                            "time_duration_h": "",
                            "time_duration_m": "",
                        })
                    }
                })
            }

            setServicesData([...arr])
            setSelectedItems([...selected])
        }

        setInitialProductsData()
    }

    const setInitialProductsData = () => {
        if (!selectedProducts.length > 0 && !selectedNewProducts.length > 0) {
            let newArr = []
            let selected = []
            itemListMaster.map((item, index) => {
                item.products.forEach(element => {
                    newArr.push({
                        "id": element.id,
                        "name": element.name,
                        "price": !isAddServiceMode ? getPrice(element.item_id, element.id) : "",
                        "item_id": element.item_id
                    })
                    if (getPrice(element.item_id, element.id) !== "") {
                        selected.push({
                            "id": element.id,
                            "name": element.name,
                            "price": !isAddServiceMode ? getPrice(element.item_id, element.id) : "",
                            "item_id": element.item_id
                        })
                    }
                });
            })

            setProductsData([...newArr])
            setSelectedProducts([...selected])
        }
    }

    const getPrice = (item_id, id) => {
        let price = ""
        if (subService.items) {
            subService.items.forEach(element => {
                element.products.forEach(prod => {
                    if (prod.id == id && prod.item_id == item_id) {
                        price = prod.price.startsWith("$") ? prod.price : "$" + prod.price
                    }
                });
            });
        }

        return price
    }

    const next = () => {
        dispatch(setAddServiceData({
            data: {
                ...addServiceData,
                user_id: user.id,
                service_id: subService.id,
                json_data: {
                    ...addServiceData.json_data,
                    products: [],
                    new_products: [],
                    services: [],
                }
            }
        }))

        let services = []
        servicesData.forEach((itemm, index) => {
            if (selectedItems.includes(itemm.item_id)) {
                var hoursDotMinutes = `${itemm.time_duration_h}:${itemm.time_duration_m}`;
                var fieldArray = hoursDotMinutes.split(":");
                var minutes = Number(fieldArray[0]) + 60 * Number(fieldArray[1]);

                let obj = {
                    "item_id": itemm.item_id,
                    "price": Number(itemm.price.replace('$', '')),
                    "time_duration": minutes
                }
                services.push(obj)
            }
        })

        dispatch(setAddServiceData({
            data: {
                ...addServiceData,
                user_id: user.id,
                service_id: subService.id,
                json_data: {
                    ...addServiceData.json_data,
                    products: [...productsData],
                    new_products: [...newProductsData],
                    services: [...services],
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

    const setText = (key, text, indexx, incomingItem) => {
        if (variants.length > 0) {
            let temp = [...servicesData.filter(item => item.variant_data == selectedVariant)]
            let otherItems = [...servicesData.filter(item => item.variant_data !== selectedVariant)]
            temp.forEach((ele, index) => {
                if (ele.item_id == incomingItem.item_id) {
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
                }
            })

            setServicesData([...temp, ...otherItems])
        } else {
            let temp = [...servicesData]
            let item = temp.filter(item => item.item_id == incomingItem.item_id)[0]

            if (key == "price") {
                let parsed = conTwoDecDigit(text.replace('$', ''))
                if (text == '') {
                    item['price'] = ''
                } else {
                    item['price'] = '$' + String(parsed)
                }
            } else if (key == 'time_duration_h') {
                item['time_duration_h'] = text
            } else {
                item['time_duration_m'] = text
            }

            temp.forEach((element, index) => {
                if (element.item_id == incomingItem.item_id) {
                    temp[index] = item
                }
            });

            setServicesData([...temp])
        }
    }

    const conTwoDecDigit = (digit) => {
        return digit.indexOf(".") > 0 ?
            digit.split(".").length >= 2 ?
                digit.split(".")[0] + "." + digit.split(".")[1].substring(-1, 2)
                : digit
            : digit
    }

    const verifyNewProducts = (services) => {
        if (addServiceData.json_data.new_products.length > 0) {
            setLoading(true)
            let headers = {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
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
                    } else {
                        showToast(response.message)
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

    const onPressItem = (index, item) => {
        if (!selectedItems.includes(item.id)) {
            setCheckedData(null, item)
        }
        if (activeItem == null) {
            setActiveIndex(index)
            setActiveItem(item)
            let filtered = selectedNewProducts.filter(itemm => itemm.item_id == item.id)
            if (filtered.length > 0) {
                setIsOtherSelected(true)
            } else {
                setIsOtherSelected(false)
            }
        } else {
            if (getSelectedProducts().length > 0 || getSelectedNewProducts().length > 0) {
                Alert.alert(
                    "Lifesuite",
                    "Remove selected items ?",
                    [
                        {
                            text: "Cancel",
                            onPress: () => { },
                            style: "cancel"
                        },
                        { text: "OK", onPress: () => discardItem(item) }
                    ]
                );
            } else {
                setCheckedData(null, item)
                setActiveIndex(null)
                setActiveItem(null)
            }
        }
    }

    const discardItem = (item) => {
        let pdata = selectedProducts.filter(element => element.item_id !== item.id)
        let pdataNew = selectedNewProducts.filter(itemm => itemm.item_id !== item.id)

        setSelectedProducts([...pdata])
        setSelectedNewProducts([...pdataNew])

        let newArr = []
        itemListMaster.map((item, index) => {
            item.products.forEach(element => {
                if (element.item_id == item.id) {
                    newArr.push({
                        "id": element.id,
                        "name": element.name,
                        "price": "",
                        "item_id": element.item_id
                    })
                } else {
                    newArr.push({
                        "id": element.id,
                        "name": element.name,
                        "price": !isAddServiceMode ? getPrice(element.item_id, element.id) : "",
                        "item_id": element.item_id
                    })
                }
            });
        })
        setProductsData([...newArr])

        let temp = []
        temp.forEach((element, index) => {
            if (element.item_id == item.id) {
                if (type == "name") {
                    temp[index].name = ''
                    temp[index].price = ''
                }
            }
        })
        setNewProductsData([...temp])

        let arr = itemListMaster.map((ele, index) => {
            if (ele.id == item.id) {
                return {
                    "item_id": item.id,
                    "price": "",
                    "time_duration_h": "",
                    "time_duration_m": "",
                    "variant_data": item.variant_data
                }
            } else {
                return ele
            }
        })

        setServicesData([...arr])
        setIsOtherSelected(false)
        setActiveItem(null)
        setActiveIndex(null)
        setCheckedData(null, item)
    }

    const saveRequest = () => {
        let hasSubProducts = false
        const selectedItemsss = itemListMaster.filter(item => selectedItems.includes(item.id))
        selectedItemsss.forEach(element => {
            if (element.products.length > 0) {
                hasSubProducts = true
            }
        });

        if (hasSubProducts && selectedProducts.length == 0 && selectedNewProducts.length == 0) {
            return showToast("Please select at least one item")
        }

        let isValidData = false
        if (variants.length > 0) {
            servicesData.filter(item => item.variant_data == selectedVariant).forEach((itemm, index) => {
                if (selectedItems.includes(itemm.item_id)) {
                    if (itemm.price.trim() !== "" && itemm.time_duration_h.trim() !== "" && itemm.time_duration_m.trim() !== "") {
                        isValidData = true
                    } else {
                        isValidData = false
                    }
                }
            })
        } else {
            servicesData.forEach((itemm, index) => {
                if (selectedItems.includes(itemm.item_id)) {
                    console.log("itemm =>> ", itemm)
                    if (itemm.price.trim() !== "" && itemm.time_duration_h.trim() !== "" && itemm.time_duration_m.trim() !== "") {
                        isValidData = true
                    } else {
                        isValidData = false
                    }
                }
            })
        }

        let selected = getSelectedProducts()
        console.log("selected =>> ", selected)
        productsData.filter(item => selected.includes(item.id)).forEach(element => {
            if (element.price.trim() == "") {
                isValidData = false
            }
        });

        let selectedNew = getSelectedNewProducts()
        console.log("selectedNew =>> ", selectedNew)
        newProductsData.filter(item => selectedNew.includes(item.id)).forEach(element => {
            if (element.price.trim() == "" || element.name.trim() == "") {
                isValidData = false
            }
        });

        if (!isValidData) {
            return showToast("Please enter data for selected services")
        } else {
            setActiveItem(null)
            setActiveIndex(null)
        }
    }

    const filterVariants = () => {
        let data = itemListMaster.filter(item => item.variant_data == selectedVariant)

        setItemList([...data])
    }

    const toggleVariant = (variant) => {
        if (activeItem !== null) {
            showToast("Please save or discard current selection")
        } else {
            setActiveItem(null)
            setActiveIndex(null)
            setSelectedVariant(variant.id)
            setIsOtherSelected(false)
        }
    }

    const onPressProduct = (item) => {
        let arr = [...selectedProducts]
        let selectedIndex = null
        arr.forEach((element, index) => {
            if (element.id == item.id) {
                selectedIndex = index
            }
        });
        if (selectedIndex !== null) {
            arr.splice(selectedIndex, 1)
        } else {
            arr.push(item)
        }
        setSelectedProducts([...arr])
    }

    const onPressNewProduct = (item) => {
        let arr = [...selectedNewProducts]
        let selectedIndex = null
        arr.forEach((element, index) => {
            if (element.temp_id == item.temp_id) {
                selectedIndex = index
            }
        });
        if (selectedIndex !== null) {
            arr.splice(selectedIndex, 1)
        } else {
            arr.push(item)
        }
        setSelectedNewProducts([...arr])
    }

    const getSelectedProducts = () => {
        let arr = selectedProducts.filter(item => item.item_id == activeItem.id)
        let selected = arr.map(item => item.id)
        return selected;
    }

    const getSelectedNewProducts = () => {
        let arr = selectedNewProducts.filter(item => item.item_id == activeItem.id)
        let selected = arr.map(item => item.temp_id)
        return selected;
    }

    const setProductText = (item, text) => {
        let temp = _.cloneDeep(productsData)
        temp.forEach((element, index) => {
            if (element.id == item.id && element.item_id == item.item_id) {
                let parsed = conTwoDecDigit(text.replace('$', ''))
                if (text == '') {
                    temp[index].price = ''
                } else {
                    temp[index].price = '$' + String(parsed)
                }
            }
        })

        setProductsData([...temp])
    }

    const setNewProductText = (item, text, type) => {
        let temp = _.cloneDeep(newProductsData)

        temp.forEach((element, index) => {
            if (element.temp_id == item.temp_id && element.item_id == item.item_id) {
                if (type == "name") {
                    temp[index].name = text
                } else {
                    let parsed = conTwoDecDigit(text.replace('$', ''))
                    if (text == '') {
                        temp[index].price = ''
                    } else {
                        temp[index].price = '$' + String(parsed)
                    }
                }
            }
        })

        setNewProductsData([...temp])
    }

    const onSelectOther = () => {
        setIsOtherSelected(!isOtherSelected)
        let filtered = newProductsData.filter(item => item.item_id == activeItem.id)
        if (filtered.length === 0) {
            addNewProduct()
        }
    }

    const removeNewproduct = (item) => {
        let temp = _.cloneDeep(newProductsData)

        temp.forEach((element, index) => {
            if (element.temp_id == item.temp_id && element.item_id == item.item_id) {
                temp.splice(index, 1)
            }
        })

        if (temp.length == 0) {
            setIsOtherSelected(false)
        }
        setNewProductsData([...temp])
    }

    const addNewProduct = () => {
        let arr = [...newProductsData]
        arr.push({
            "item_id": activeItem.id,
            "name": "",
            "price": "",
            "temp_id": String(Math.floor((Math.random() * 10000000) + 1000))
        })
        setNewProductsData([...arr])
        let filtered = arr.filter(item => item.item_id == activeItem.id)
        if (filtered.length == 1) {
            onPressNewProduct(filtered[0])
        }
    }

    const onBackPress = () => {
        if (activeItem !== null) {
            onPressItem(activeIndex, activeItem)
        } else {
            props.navigation.goBack()
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
                            <View style={{ height: "22%", justifyContent: 'flex-end', paddingTop: StatusBar.currentHeight + 10 }}>
                                <Header
                                    imageUrl={require("../../../assets/backWhite.png")}
                                    action={() => onBackPress()}
                                    imageUrl1={require("../../../assets/homeWhite.png")}
                                    action1={() => props.navigation.navigate("HomeScreen")}
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
                    <Text style={styles.service}>SERVICES</Text>
                    <View style={{ marginVertical: 10, flexDirection: 'row', overflow: 'scroll', paddingHorizontal: '5%', justifyContent: 'center' }}>
                        {variants.length > 0 && variants.map((item, index) => {
                            return (
                                <TouchableOpacity activeOpacity={0.7} onPress={() => toggleVariant(item)} key={index}
                                    style={{
                                        backgroundColor: selectedVariant == item.id ? LS_COLORS.global.green : LS_COLORS.global.white,
                                        marginHorizontal: 10,
                                        paddingHorizontal: 15,
                                        paddingVertical: 5,
                                        borderRadius: 100,
                                        borderWidth: selectedVariant == item.id ? 1 : 1,
                                        borderColor: selectedVariant == item.id ? LS_COLORS.global.green : LS_COLORS.global.green
                                    }}>
                                    <Text style={{
                                        fontFamily: LS_FONTS.PoppinsMedium,
                                        fontSize: 14,
                                        textTransform: 'uppercase',
                                        color: selectedVariant == item.id ? LS_COLORS.global.white : LS_COLORS.global.black,
                                    }}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                    {activeItem !== null && <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: '2%' }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ ...styles.priceTime, marginRight: '20%' }}>Time</Text>
                        </View>
                        <View style={{ marginLeft: '5%' }}>
                            <Text style={styles.priceTime}>Price</Text>
                        </View>
                    </View>}
                    <Content showsVerticalScrollIndicator={false}>
                        {activeItem !== null &&
                            <ServiceItem
                                ref={itemRef}
                                item={activeItem}
                                index={activeIndex}
                                onCheckPress={() => onPressItem(activeIndex, activeItem)}
                                isSelected={selectedItems.includes(activeItem.id)}
                                setText={setText}
                                setProductText={setProductText}
                                setNewProductText={setNewProductText}
                                serviceItem={variants.length > 0 ? servicesData.filter(item => item.variant_data == selectedVariant && item.item_id == activeItem.id)[0] : servicesData.filter(item => item.item_id == activeItem.id)[0]}
                                subService={subService}
                                showInputs
                                products={productsData.filter(item => item.item_id == activeItem.id)}
                                newProducts={newProductsData.filter(item => item.item_id == activeItem.id)}
                                selectedProducts={getSelectedProducts()}
                                selectedNewProducts={getSelectedNewProducts()}
                                onPressProduct={(item) => onPressProduct(item)}
                                onPressNewProduct={(item) => onPressNewProduct(item)}
                                onSelectOther={onSelectOther}
                                isOtherSelected={isOtherSelected}
                                removeNewproduct={removeNewproduct}
                                addNewProduct={addNewProduct}
                            />}
                        {activeItem == null && itemList && itemList.length > 0 &&
                            itemList.map(((item, index) => {
                                return (
                                    <ServiceItem
                                        key={index}
                                        item={item}
                                        index={index}
                                        onCheckPress={() => { onPressItem(index, item) }}
                                        isSelected={selectedItems.includes(item.id)}
                                    />
                                )
                            }))}
                    </Content>
                    <View style={{ paddingBottom: '2.5%' }}>
                        {activeItem == null
                            ?
                            selectedItems.length > 0 && <CustomButton title={"Next"} action={() => next()} />
                            :
                            <CustomButton title={"Save"} action={() => saveRequest()} />
                        }
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





