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

const ServiceItemUser = (props) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.authenticate.user)

    const [isOtherSelected, setIsOtherSelected] = useState(false)
    const [otherText, setOtherText] = useState('')
    const [isHaveOwnSelected, setIsHaveOwnSelected] = useState(false)
    const [haveOwnText, setHaveOwnText] = useState('')
    const [isNeedRecommendationSelected, setIsNeedRecommendationSelected] = useState(false)

    useEffect(() => {
        let extraData = {
            isOtherSelected: isOtherSelected,
            other: otherText,
            isHaveOwnSelected: isHaveOwnSelected,
            have_own: haveOwnText,
            need_recommendation: isNeedRecommendationSelected
        }
        props.setExtraData(extraData, props.item)
    }, [otherText, haveOwnText, isNeedRecommendationSelected, isOtherSelected, isHaveOwnSelected])

    return (
        <>
            <View key={props.index} style={{ flexDirection: "row", paddingLeft: '5%' }}>
                <CheckBox
                    checked={props.isSelected}
                    onPress={props.onCheckPress}
                    checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/checked.png")} />}
                    uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/unchecked.png")} />}
                />
                <Text style={{ fontSize: 12, right: 10, fontFamily: LS_FONTS.PoppinsRegular, alignSelf: 'center', marginLeft: '4%' }}>{props.item.name}</Text>
            </View>
            {props.activeMode && <View style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                    {props.item.products.map((product, indexx) => {
                        return (
                            <View key={indexx} style={{ flexDirection: "row", paddingLeft: '10%' }}>
                                <CheckBox
                                    checked={props.selectedProducts.includes(product.id)}
                                    onPress={() => props.onSelectProduct(product)}
                                    checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/checked.png")} />}
                                    uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/unchecked.png")} />}
                                />
                                <Text style={{ fontSize: 12, right: 10, fontFamily: LS_FONTS.PoppinsRegular, alignSelf: 'center', marginLeft: '4%' }}>{product.name}</Text>
                            </View>
                        )
                    })}

                    <View style={{ flexDirection: 'row', width: '90%', alignSelf: 'flex-end', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-start' }}>
                            <CheckBox
                                checked={isOtherSelected}
                                onPress={() => setIsOtherSelected(!isOtherSelected)}
                                checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/checked.png")} />}
                                uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/unchecked.png")} />}
                            />
                            <Text numberOfLines={1} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: 'center', width: '55%', }}>Other</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', width: '90%', alignSelf: 'flex-end', justifyContent: 'space-between', alignItems: 'center', }}>
                        <View style={{ ...styles.fromContainer, width: '70%', alignSelf: 'flex-end', marginLeft: '20%' }}>
                            <TextInput
                                value={otherText}
                                onChangeText={setOtherText}
                                style={styles.inputStyle}
                                color="black"
                                placeholder="other products"
                                placeholderTextColor={LS_COLORS.global.placeholder}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', width: '90%', alignSelf: 'flex-end', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-start' }}>
                            <CheckBox
                                checked={isHaveOwnSelected}
                                onPress={() => setIsHaveOwnSelected(!isHaveOwnSelected)}
                                checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/checked.png")} />}
                                uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/unchecked.png")} />}
                            />
                            <Text numberOfLines={1} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: 'center', width: '55%', }}>I have my own</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', width: '90%', alignSelf: 'flex-end', justifyContent: 'space-between', alignItems: 'center', }}>
                        <View style={{ ...styles.fromContainer, width: '70%', alignSelf: 'flex-end', marginLeft: '20%' }}>
                            <TextInput
                                value={haveOwnText}
                                onChangeText={setHaveOwnText}
                                style={styles.inputStyle}
                                color="black"
                                placeholder="your products"
                                placeholderTextColor={LS_COLORS.global.placeholder}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', width: '90%', alignSelf: 'flex-end', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-start' }}>
                            <CheckBox
                                checked={isNeedRecommendationSelected}
                                onPress={() => setIsNeedRecommendationSelected(!isNeedRecommendationSelected)}
                                checkedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/checked.png")} />}
                                uncheckedIcon={<Image style={{ height: 23, width: 23 }} source={require("../assets/unchecked.png")} />}
                            />
                            <Text numberOfLines={1} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsMedium, alignSelf: 'center', width: '55%', }}>Need recommendation</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>}
        </>
    )
}

export default ServiceItemUser;

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
        borderWidth: 0.5,
        justifyContent: "center",
        backgroundColor: LS_COLORS.global.white,
        paddingHorizontal: 5,
        marginRight: '10%',
        borderRadius: 6
    },
    inputStyle: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        textAlign: 'center'
    },
})