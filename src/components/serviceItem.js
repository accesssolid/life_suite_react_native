import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ImageBackground, StatusBar, Platform, Image, TouchableOpacity, ScrollView } from 'react-native'

/* Constants */
import LS_COLORS from '../constants/colors';
import LS_FONTS from '../constants/fonts';

/* Packages */
import { useDispatch, useSelector } from 'react-redux';
import { CheckBox } from 'react-native-elements'
import TextInputMask from 'react-native-text-input-mask';

/* Components */;
import { TextInput } from 'react-native-gesture-handler';
import { setAddServiceData } from '../redux/features/services';
import _, { forEach } from 'lodash'

const ServiceItem = (props) => {
    const dispatch = useDispatch()
    const addServiceData = useSelector(state => state.services.addServiceData)
    const isAddServiceMode = useSelector(state => state.services.isAddServiceMode)
    const user = useSelector(state => state.authenticate.user)

    const priceRef = useRef(null)
    const hourRef = useRef(null)
    const minRef = useRef(null)
    const nameRef = useRef(null)
    const priceNewRef = useRef(null)

    /* Products */
    const [products, setProducts] = useState([])
    const [selectedItems, setSelectedItems] = useState([])

    /* New Products */
    const [newProducts, setNewProducts] = useState([])
    const [selectedNewItems, setSelectedNewItems] = useState([])

    const [isOtherSelected, setIsOtherSelected] = useState(false)

    useEffect(() => {
        setInitialServiceData()
    }, [])

    useEffect(() => {
        updateAddServiceData()
    }, [products, newProducts, selectedItems, selectedNewItems])

    const setCheckedData = (index, item) => {
        let arr = [...selectedItems]
        if (arr.includes(item.id)) {
            arr.splice(arr.indexOf(item.id), 1)
        } else {
            arr.push(item.id)
        }
        setSelectedItems([...arr])
    }

    const setCheckedDataNewItem = (item, index) => {
        let arr = [...selectedNewItems]
        if (arr.includes(item.temp_id)) {
            arr.splice(arr.indexOf(item.temp_id), 1)
        } else {
            arr.push(item.temp_id)
        }
        setSelectedNewItems([...arr])
    }

    const setInitialServiceData = () => {
        let selectedPrev = []
        let newArr = props.item.products.map((item, index) => {
            selectedPrev.push(item.id)
            return {
                "id": item.id,
                "name": item.name,
                "price": item.price ? item.price : ""
            }
        })
        if (!isAddServiceMode) {
            setSelectedItems([...selectedPrev])
        }
        setProducts([...newArr])
    }

    const addNewProduct = () => {
        let temp = [...newProducts]
        temp.push({
            "item_id": props.item.id,
            "name": "",
            "price": "",
            "temp_id": String(Math.floor((Math.random() * 10000000) + 1000))
        })
        setNewProducts([...temp])
    }

    const removeNewProduct = (index) => {
        let temp = [...newProducts]

        temp.splice(index, 1)
        if (temp.length == 0) {
            onSelectOther()
        }
        setNewProducts([...temp])
    }

    const onSelectOther = () => {
        setIsOtherSelected(!isOtherSelected)
        if (newProducts.length === 0) {
            addNewProduct()
        }
    }

    const onchangeTextProduct = (text, index) => {
        let temp = _.cloneDeep(products)

        let parsed = conTwoDecDigit(text.replace('$', ''))
        if (text == '') {
            temp[index].price = ''
        } else {
            temp[index].price = '$' + String(parsed)
        }

        setProducts([...temp])
    }

    const onchangeTextNewProduct = (text, index, type) => {
        let temp = _.cloneDeep(newProducts)
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
        setNewProducts([...temp])
    }

    const updateAddServiceData = () => {
        const pro = products.filter(item => selectedItems.includes(item.id))
        const newpro = newProducts.filter((item, index) => selectedNewItems.includes(item.temp_id))

        let allProducts = [...addServiceData.json_data.products]
        let allNewProducts = [...addServiceData.json_data.new_products]

        products.forEach(element1 => {
            allProducts.forEach((element2, index) => {
                if (element1.id == element2.id) {
                    allProducts.splice(index, 1)
                }
            });
        });

        allNewProducts.forEach((element1, index) => {
            newProducts.forEach((element2) => {
                if (element1.temp_id == element2.temp_id) {
                    allNewProducts.splice(index, 1)
                }
            });
        });

        if (newpro.length == 0) {
            allNewProducts.forEach((element, index) => {
                if (element.item_id == props.item.id) {
                    allNewProducts.splice(index, 1)
                }
            })
        }

        allProducts = [...allProducts, ...pro]
        allNewProducts = [...allNewProducts, ...newpro]

        dispatch(setAddServiceData({
            data: {
                ...addServiceData,
                user_id: user.id,
                service_id: props.subService.id,
                json_data: {
                    ...addServiceData.json_data,
                    products: [...allProducts],
                    new_products: [...allNewProducts]
                }
            }
        }))
    }

    const conTwoDecDigit = (digit) => {
        return digit.indexOf(".") > 0 ?
            digit.split(".").length >= 2 ?
                digit.split(".")[0] + "." + digit.split(".")[1].substring(-1, 2)
                : digit
            : digit
    }

    return (
        <>
            <View key={props.index} style={{ width: '98%', flexDirection: "row", alignItems: 'center', alignSelf: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', overflow: 'hidden', width: '45%' }}>
                    <CheckBox
                        checked={props.isSelected}
                        onPress={props.onCheckPress}
                        checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/checked.png")} />}
                        uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/unchecked.png")} />}
                    />
                    <Text numberOfLines={1} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: 'center', width: '50%' }}>{props.item.name}</Text>
                </View>

                <View style={{ flexDirection: 'row', width: '55%', justifyContent: 'flex-end' }}>
                    <View style={{ ...styles.fromContainer, width: 50, marginRight: '5%' }}>
                        <TextInputMask
                            onChangeText={(formatted, extracted) => {
                                props.setText("time_duration_h", extracted, props.index)
                            }}
                            mask={"[00]"}
                            color="black"
                            placeholder="HH"
                            keyboardType="numeric"
                            editable={props.isSelected}
                            style={styles.inputStyle}
                            value={props.serviceItem?.time_duration_h}
                            ref={hourRef}
                            returnKeyType={Platform.OS == "ios" ? 'done' : "next"}
                            onSubmitEditing={() => minRef.current.focus()}
                            placeholderTextColor={LS_COLORS.global.placeholder}
                        />
                    </View>
                    <View style={{ ...styles.fromContainer, width: 50, marginRight: '5%' }}>
                        <TextInputMask
                            onChangeText={(formatted, extracted) => {
                                props.setText("time_duration_m", extracted, props.index)
                            }}
                            mask={"[00]"}
                            color="black"
                            placeholder="MM"
                            keyboardType="numeric"
                            editable={props.isSelected}
                            style={styles.inputStyle}
                            value={props.serviceItem?.time_duration_m}
                            ref={minRef}
                            returnKeyType={Platform.OS == "ios" ? 'done' : "next"}
                            onSubmitEditing={() => priceRef.current.focus()}
                            placeholderTextColor={LS_COLORS.global.placeholder}
                        />
                    </View>
                    <View style={styles.fromContainer}>
                        <TextInput
                            style={styles.inputStyle}
                            color="black"
                            placeholder="$000"
                            editable={props.isSelected}
                            onChangeText={(text) => props.setText("price", text, props.index)}
                            keyboardType="numeric"
                            value={props.serviceItem?.price}
                            ref={priceRef}
                            numberOfLines={1}
                            returnKeyType={Platform.OS == "ios" ? 'done' : "next"}
                            placeholderTextColor={LS_COLORS.global.placeholder}
                        />
                    </View>
                </View>
            </View>
            {props.isSelected && products.map((item, index) => {
                return <View key={index} style={{ flexDirection: 'row', width: '85%', alignSelf: 'flex-end', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-start' }}>
                        <CheckBox
                            checked={selectedItems.includes(item.id)}
                            onPress={() => setCheckedData(index, item)}
                            checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/checked.png")} />}
                            uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/unchecked.png")} />}
                        />
                        <Text numberOfLines={1} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: 'center', width: '55%' }}>{item.name}</Text>
                    </View>
                    <View style={{ ...styles.fromContainer, marginRight: '8%' }}>
                        <TextInput
                            style={styles.inputStyle}
                            color="black"
                            placeholder="$000"
                            editable={selectedItems.includes(item.id)}
                            onChangeText={(text) => onchangeTextProduct(text, index)}
                            keyboardType="numeric"
                            value={item.price}
                            returnKeyType={Platform.OS == "ios" ? 'done' : "next"}
                            placeholderTextColor={LS_COLORS.global.placeholder}
                        />
                    </View>
                </View>
            })}
            {props.isSelected && <View style={{ flexDirection: 'row', width: '85%', alignSelf: 'flex-end', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-start' }}>
                    <CheckBox
                        checked={isOtherSelected}
                        onPress={() => onSelectOther()}
                        checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/checked.png")} />}
                        uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/unchecked.png")} />}
                    />
                    <Text numberOfLines={1} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: 'center', width: '55%', }}>Other</Text>
                </View>
            </View>}
            {props.isSelected && isOtherSelected && newProducts.map((item, index) => {
                return <View key={index} style={{ flexDirection: 'row', width: '85%', alignSelf: 'flex-end', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-start' }}>
                        <CheckBox
                            checked={selectedNewItems.includes(item.temp_id)}
                            onPress={() => setCheckedDataNewItem(item, index)}
                            checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/checked.png")} />}
                            uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/unchecked.png")} />}
                        />
                    </View>
                    <View style={{ ...styles.fromContainer, marginRight: '2.5%', width: '40%' }}>
                        <TextInput
                            style={styles.inputStyle}
                            color="black"
                            placeholder="Product name"
                            editable={selectedNewItems.includes(item.temp_id)}
                            onChangeText={(text) => onchangeTextNewProduct(text, index, "name")}
                            value={item.name}
                            ref={nameRef}
                            returnKeyType={"next"}
                            onSubmitEditing={() => priceNewRef.current.focus()}
                            placeholderTextColor={LS_COLORS.global.placeholder}
                        />
                    </View>
                    <View style={{ ...styles.fromContainer, marginRight: '2%' }}>
                        <TextInput
                            style={styles.inputStyle}
                            color="black"
                            placeholder="$000"
                            editable={selectedNewItems.includes(item.temp_id)}
                            onChangeText={(text) => onchangeTextNewProduct(text, index, "price")}
                            keyboardType="numeric"
                            value={item.price}
                            ref={priceNewRef}
                            returnKeyType={'done'}
                            placeholderTextColor={LS_COLORS.global.placeholder}
                        />
                    </View>
                    <TouchableOpacity onPress={() => removeNewProduct(index)} activeOpacity={0.7} style={{ height: 40, aspectRatio: 1, padding: 10, marginRight: '2%' }}>
                        <Image source={require('../assets/cancel.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                    </TouchableOpacity>
                </View>
            })}
            {props.isSelected && isOtherSelected && <View style={{ width: '85%', alignItems: 'center', alignSelf: 'flex-end' }}>
                <TouchableOpacity onPress={() => addNewProduct()} activeOpacity={0.7} style={{ height: 40, aspectRatio: 1, marginRight: '8%', padding: 5 }}>
                    <Image source={require('../assets/addgreen.png')} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
                </TouchableOpacity>
            </View>}
        </>
    )
}

export default ServiceItem;

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