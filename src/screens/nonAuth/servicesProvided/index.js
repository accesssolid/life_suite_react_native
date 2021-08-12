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
import { showToast } from '../../../components/validators';

const ServicesProvided = (props) => {
    const dispatch = useDispatch()
    const { subService } = props.route.params
    const [itemList, setItemList] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedItems, setSelectedItems] = useState([])
    const [selectedProducts, setSelectedProducts] = useState([])
    const [variants, setVariants] = useState([])
    const [selectedVariant, setSelectedVariant] = useState(null)
    const [newProducts, setNewProducts] = useState([])
    const [selectedNewItems, setSelectedNewItems] = useState([])
    const [isOtherSelected, setIsOtherSelected] = useState(false)
    const [isHaveOwnSelected, setIsHaveOwnSelected] = useState(false)
    const [needRecommendationSelected, setNeedRecommendationSelected] = useState(false)

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
                    if (response.variant_data) {
                        setVariants(response.variant_data)
                    }
                }
                else {
                    setLoading(false)
                }
            }).catch(err => {
                setLoading(false)
            })
    }

    const setCheckedData = (item) => {
        let arr = [...selectedItems]
        if (arr.includes(item.id)) {
            arr.splice(arr.indexOf(item.id), 1)
        } else {
            arr.push(item.id)
        }
        setSelectedItems([...arr])
    }

    const setCheckedDataProducts = (item) => {
        let arr = [...selectedProducts]
        if (arr.includes(item.id)) {
            arr.splice(arr.indexOf(item.id), 1)
        } else {
            arr.push(item.id)
        }
        setSelectedProducts([...arr])
    }

    const next = () => {
        let servicedata = []
        itemList.forEach(element => {
            if (selectedItems.includes(element.id)) {
                servicedata.push({
                    "item_id": element.id,
                    "products": selectedProducts
                })
            }
        });
        props.navigation.navigate("MechanicLocation", { servicedata: servicedata, subService: subService })
    }

    const onSelectOther = () => {
        setIsOtherSelected(!isOtherSelected)
        // if (newProducts.length === 0) {
        //     addNewProduct()
        // }
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

    const addNewProduct = () => {
        let temp = [...newProducts]
        temp.push('x')
        setNewProducts(temp)
    }

    const removeNewProduct = (index) => {
        let temp = [...newProducts]

        temp.splice(index, 1)
        if (temp.length == 0) {
            onSelectOther()
        }
        setNewProducts([...temp])
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
                        <View style={{ marginVertical: 10, flexDirection: 'row', overflow: 'scroll', paddingHorizontal: '5%', justifyContent: 'center' }}>
                            {variants.length > 0 && variants.map((item, index) => {
                                return (
                                    <TouchableOpacity activeOpacity={0.7} onPress={() => setSelectedVariant(item.id)} key={index}
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
                                            {item.name}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                        {
                            itemList.length > 0
                                ?
                                <Content>
                                    {
                                        itemList && itemList.length > 0
                                            ?
                                            itemList.map((item, index) => {
                                                return (
                                                    <>
                                                        <View key={index} style={{ flexDirection: "row", paddingLeft: '5%' }}>
                                                            <CheckBox
                                                                checked={selectedItems.includes(item.id)}
                                                                onPress={() => setCheckedData(item)}
                                                                checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/checked.png")} />}
                                                                uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/unchecked.png")} />}
                                                            />
                                                            <Text style={{ fontSize: 12, right: 10, fontFamily: LS_FONTS.PoppinsRegular, alignSelf: 'center', marginLeft: '4%' }}>{item.name}</Text>
                                                        </View>
                                                        {selectedItems.includes(item.id) && <View>
                                                            {item.products.map((product, indexx) => {
                                                                return (
                                                                    <View key={indexx} style={{ flexDirection: "row", paddingLeft: '10%' }}>
                                                                        <CheckBox
                                                                            checked={selectedProducts.includes(product.id)}
                                                                            onPress={() => setCheckedDataProducts(product)}
                                                                            checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/checked.png")} />}
                                                                            uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/unchecked.png")} />}
                                                                        />
                                                                        <Text style={{ fontSize: 12, right: 10, fontFamily: LS_FONTS.PoppinsRegular, alignSelf: 'center', marginLeft: '4%' }}>{product.name}</Text>
                                                                    </View>
                                                                )
                                                            })}
                                                            {selectedItems.includes(item.id) && <View style={{ flexDirection: 'row', width: '85%', alignSelf: 'flex-end', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-start' }}>
                                                                    <CheckBox
                                                                        checked={isOtherSelected}
                                                                        onPress={() => onSelectOther()}
                                                                        checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/checked.png")} />}
                                                                        uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/unchecked.png")} />}
                                                                    />
                                                                    <Text numberOfLines={1} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: 'center', width: '55%', }}>Other</Text>
                                                                </View>
                                                            </View>}
                                                            {selectedItems.includes(item.id) && <View key={index} style={{ flexDirection: 'row', width: '85%', alignSelf: 'flex-end', justifyContent: 'space-between', alignItems: 'center', }}>
                                                                <View style={{ ...styles.fromContainer, width: '70%', alignSelf: 'flex-end', marginLeft: '20%' }}>
                                                                    <TextInput
                                                                        style={styles.inputStyle}
                                                                        color="black"
                                                                        placeholder="other products"
                                                                        placeholderTextColor={LS_COLORS.global.placeholder}
                                                                    />
                                                                </View>
                                                            </View>}
                                                            {selectedItems.includes(item.id) && <View style={{ flexDirection: 'row', width: '85%', alignSelf: 'flex-end', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-start' }}>
                                                                    <CheckBox
                                                                        checked={isHaveOwnSelected}
                                                                        onPress={() => setIsHaveOwnSelected(!isHaveOwnSelected)}
                                                                        checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/checked.png")} />}
                                                                        uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/unchecked.png")} />}
                                                                    />
                                                                    <Text numberOfLines={1} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: 'center', width: '55%', }}>I have my own</Text>
                                                                </View>
                                                            </View>}
                                                            {selectedItems.includes(item.id) && <View style={{ flexDirection: 'row', width: '85%', alignSelf: 'flex-end', justifyContent: 'space-between', alignItems: 'center', }}>
                                                                <View style={{ ...styles.fromContainer, width: '70%', alignSelf: 'flex-end', marginLeft: '20%' }}>
                                                                    <TextInput
                                                                        style={styles.inputStyle}
                                                                        color="black"
                                                                        placeholder="your products"
                                                                        placeholderTextColor={LS_COLORS.global.placeholder}
                                                                    />
                                                                </View>
                                                            </View>}
                                                            {selectedItems.includes(item.id) && <View style={{ flexDirection: 'row', width: '85%', alignSelf: 'flex-end', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-start' }}>
                                                                    <CheckBox
                                                                        checked={needRecommendationSelected}
                                                                        onPress={() => setNeedRecommendationSelected(!needRecommendationSelected)}
                                                                        checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/checked.png")} />}
                                                                        uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../../../assets/unchecked.png")} />}
                                                                    />
                                                                    <Text numberOfLines={1} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: 'center', width: '55%', }}>Need recommendation</Text>
                                                                </View>
                                                            </View>}
                                                        </View>}
                                                    </>
                                                )
                                            })
                                            :
                                            null
                                    }
                                    <TouchableOpacity
                                        style={styles.save}
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            selectedItems.length > 0
                                                ?
                                                next()
                                                :
                                                showToast("Select service first")
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
    },
    fromContainer: {
        height: 40,
        width: 75,
        alignItems: 'center',
        borderColor: LS_COLORS.global.lightTextColor,
        justifyContent: "center",
        backgroundColor: '#ECECEC',
        paddingHorizontal: 5,
        // marginRight: '10%'
    },
    inputStyle: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        // textAlign: 'center'
    },
})





