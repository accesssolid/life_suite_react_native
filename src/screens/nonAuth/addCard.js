import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Image, TouchableOpacity, Alert, FlatList, Pressable, ImageBackground, StyleSheet } from 'react-native'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import Header from '../../components/header'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useFocusEffect } from '@react-navigation/native'
import { CreditCardInput, CardView } from "react-native-credit-card-input";
import TextInputMask from 'react-native-text-input-mask';

import { getApi } from '../../api/api'
import { useSelector } from 'react-redux'
import Loader from '../../components/loader'
import LS_COLORS from '../../constants/colors'
import LS_FONTS from '../../constants/fonts'
import { Container, Content } from 'native-base'
import { showToast } from '../../components/validators';
import creditCardType from 'credit-card-type';


export default function CardList({ navigation, route }) {
    const [loader, setLoader] = useState(false)
    const access_token = useSelector(state => state.authenticate.access_token)
    const [cardDetails, setCardDetails] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
    })

    const [address, setAddress] = React.useState({
        address_line1: "",
        address_line2: "",
        address_city: "",
        address_state: "",
        address_zip: "",
        address_country: ""
    })

    const cardNameRef = useRef(null)
    const cardNumberRef = useRef(null)
    const cardDateRef = useRef(null)
    var cards = creditCardType(cardDetails.number);

    const Type = type => {
        if (cards) {
            switch (cards[0]?.type) {
                case 'visa':
                    return require('../../assets/Images1/visa.png');
                case 'mastercard':
                    return require('../../assets/Images1/master.png');
                case 'american-express':
                    return require('../../assets/Images1/american.png');
                case 'discover':
                    return require('../../assets/Images1/discover.png');
                case 'jcb':
                    return require('../../assets/Images1/jcb.png');
                case 'unionpay':
                    return require('../../assets/Images1/unionpay.png');
                case 'diners_club':
                    return require('../../assets/Images1/dinner_club.png');
                case 'mir':
                    return require('../../assets/Images1/mir.png');
                case 'elo':
                    return require('../../assets/Images1/elo.png');
                case 'hiper':
                    return require('../../assets/Images1/hiper.png');
                case 'hipercards':
                    return require('../../assets/Images1/hipercard.png');
                case 'maestro':
                    return require('../../assets/Images1/maestro.png');
                default:
                    return require('../../assets/Images1/invalid.png');
            }
        } else {
            return require('../../assets/Images1/invalid.png');
        }
    };

    const generateCardToken = async () => {
        try {
            setLoader(true)
            const card = `card[number]=${cardDetails.number.replace(/ /g, "")}&card[exp_month]=${cardDetails.expiry.split("/")[0]}&card[exp_year]=${cardDetails.expiry.split("/")[1]}&card[cvc]=${cardDetails.cvv}&card[address_line1]=${address.address_line1}&card[address_line2]=${address.address_line2}&card[address_city]=${address.address_city}&card[address_zip]=${address.address_zip}&card[address_state]=${address.address_state}&card[address_country]=${address.address_country}`
            let response = await fetch('https://api.stripe.com/v1/tokens', {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    // Use the Stripe publishable key as Bearer
                    Authorization: `Bearer pk_test_51JKvYmBlfwj1B9UxRZugpwJP7OSpAw22SqDhkvjaIR5Lz78NAwAiOU8SirA3Z3AGUJC8P5Uy0fqeETeWBxRgGyyr00ySqSSS3c`
                },
                method: 'post',
                body: card
            })
            let data = await response.json()
            if (response.ok) {
                if (data.id) {
                    saveCard(data.id)
                } else {
                    showToast(data.error?.message)
                }
            } else {
                showToast(data.error?.message)
            }

            console.log(data)
        } catch (err) {
            showToast("Server Error")
            // showToast
        } finally {
            setLoader(false)
        }

    }

    const saveCard = async (token) => {
        setLoader(true)
        let headers = {
            "Authorization": `Bearer ${access_token}`
        }
        const formdata = new FormData()
        formdata.append("source", token)

        let config = {
            headers: headers,
            data: formdata,
            endPoint: '/api/customerSaveCard',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                console.log("Card Save", response)
                if (response.status == true) {
                    showToast("Successfully, card added.")
                    navigation.pop()
                }
                else {
                    showToast(response?.message)
                }
            })
            .catch(err => {
                setLoader(false)
            }).finally(() => {
                setLoader(false)
            })
    }

    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <Header imageUrl={require("../../assets/back.png")}
                    action={() => navigation.goBack()}
                    // imageUrl1={require("../../assets/home.png")}
                    // action1={() => props.navigation.navigate("HomeScreen")}
                    title={'Add Card'} />
                <Container>
                    <Content>
                        <View style={{ alignItems: "center" }}>
                            <View style={{ position: "relative" }}>
                                <CardView
                                    number={cardDetails.number}
                                    name={cardDetails.name}
                                    expiry={cardDetails.expiry}
                                    imageFront={require("../../assets/card.png")}

                                    onChange={(e => { })} />
                                {cardDetails.number.length == 0 ? null : (
                                    <Image style={{ height: 40, width: 40, position: "absolute", left: 10, top: 15 }} resizeMode="contain" source={Type()} />
                                )}
                            </View>

                            <View style={{ marginTop: 20 }} />
                            <View style={{ flexDirection: "row" }}>
                                <TextInputMask
                                    style={styles.inputMaskStyle}
                                    placeholder={'Credit Card Number'}
                                    placeholderTextColor={"gray"}
                                    onChangeText={(formatted, extracted) => {
                                        setCardDetails({ ...cardDetails, number: formatted })
                                    }}
                                    mask={"[0000] [0000] [0000] [0000]"}
                                    keyboardType="numeric"
                                    ref={cardNumberRef}
                                    returnKeyType="next"

                                    onSubmitEditing={() => cardNameRef.current.focus()}
                                />
                                {cardDetails.number.length == 0 ? null : (
                                    <Image style={{ height: 40, width: 40, position: "absolute", right: 10, top: 15 }} resizeMode="contain" source={Type()} />
                                )}
                            </View>
                            <TextInputMask
                                style={styles.inputMaskStyle}
                                placeholder={'Credit Card Holder Name'}
                                placeholderTextColor={"gray"}
                                onChangeText={(formatted, extracted) => {
                                    setCardDetails({ ...cardDetails, name: formatted })
                                }}
                                ref={cardNameRef}
                                returnKeyType="next"
                                onSubmitEditing={() => cardDateRef.current.focus()}
                            />
                            <TextInputMask
                                style={styles.inputMaskStyle}
                                placeholder={'Expiry Date(MM/YY)'}
                                placeholderTextColor={"gray"}
                                onChangeText={(formatted, extracted) => {
                                    setCardDetails({ ...cardDetails, expiry: formatted })
                                }}
                                mask={"[00]/[00]"}
                                keyboardType="numeric"
                                ref={cardDateRef}
                                returnKeyType="done"
                            />

                            <TextInputMask
                                style={styles.inputMaskStyle}
                                placeholder={'CVV'}
                                placeholderTextColor={"gray"}
                                onChangeText={(formatted, extracted) => {
                                    setCardDetails({ ...cardDetails, cvv: extracted })
                                }}
                                mask={"[000]"}
                                keyboardType="numeric"
                                ref={cardDateRef}
                                returnKeyType="done"
                            />
                            {/* <Text style={[styles.saveText, { color: "gray", fontSize: 16, textAlign: "left", width: "80%", marginTop: 10 }]}>Address : (Optional)</Text> */}
                            <TextInputMask
                                style={styles.inputMaskStyle}
                                placeholder={'Address'}
                                placeholderTextColor={"gray"}
                                keyboardType="default"
                                onChangeText={(formatted, extracted) => {
                                    setAddress({ ...address, address_line1: formatted })
                                }}
                            />
                            {/* <TextInputMask
                                style={styles.inputMaskStyle}
                                placeholder={'Address 2'}
                                placeholderTextColor={"gray"}
                                keyboardType="default"
                                onChangeText={(formatted, extracted) => {
                                    setAddress({ ...address, address_line2: formatted })
                                }}
                            />
                            <TextInputMask
                                style={styles.inputMaskStyle}
                                placeholder={'City'}
                                placeholderTextColor={"gray"}
                                keyboardType="default"
                                onChangeText={(formatted, extracted) => {
                                    setAddress({ ...address, address_city: formatted })
                                }}
                            />
                            <TextInputMask
                                style={styles.inputMaskStyle}
                                placeholder={'State'}
                                placeholderTextColor={"gray"}
                                keyboardType="default"
                                onChangeText={(formatted, extracted) => {
                                    setAddress({ ...address, address_state: formatted })
                                }}
                            />
                            <TextInputMask
                                style={styles.inputMaskStyle}
                                placeholder={'ZipCode'}
                                placeholderTextColor={"gray"}
                                keyboardType="numeric"
                                onChangeText={(formatted, extracted) => {
                                    setAddress({ ...address, address_zip: formatted })
                                }}
                            />
                              <TextInputMask
                                style={styles.inputMaskStyle}
                                placeholder={'Country'}
                                placeholderTextColor={"gray"}
                                keyboardType="default"
                                onChangeText={(formatted, extracted) => {
                                    setAddress({ ...address, address_country: formatted })
                                }}
                            /> */}
                        </View>
                    </Content>
                </Container>
                <TouchableOpacity
                    style={styles.save}
                    activeOpacity={0.7}
                    onPress={() => {
                        generateCardToken()
                    }}
                >
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </SafeAreaView>
            {loader && <Loader />}
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
    },
    text: {
        fontSize: 16,
        fontFamily: LS_FONTS.PoppinsBold,
        marginTop: 16,
        alignSelf: 'center'
    },
    text1: {
        fontSize: 18,
        fontFamily: LS_FONTS.PoppinsMedium,
        marginTop: 16,
        alignSelf: 'center',
        color: LS_COLORS.global.green
    },
    text2: {
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsRegular,
        alignSelf: 'center',
        color: '#5A5A5A'
    },
    personalContainer: {
        maxHeight: '100%',
        marginTop: "3%",
        width: "90%",
        elevation: 200,
        shadowColor: '#00000029',
        backgroundColor: 'white',
        shadowColor: '#00000029',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        borderRadius: 10,
        alignSelf: 'center',
    },
    save: {
        justifyContent: "center",
        alignItems: 'center',
        height: 40,
        width: 111,
        backgroundColor: LS_COLORS.global.green,
        borderRadius: 28,
        alignSelf: 'center',
        marginVertical: 15
    },
    saveText: {
        fontSize: 12,
        fontFamily: LS_FONTS.PoppinsMedium,
        color: LS_COLORS.global.white
    },
    inputMaskStyle: {
        borderRadius: 7,
        borderColor: LS_COLORS.global.textInutBorderColor,
        paddingLeft: 16,
        width: '80%',
        alignSelf: 'center',
        color: LS_COLORS.global.black,
        height: 50,
        fontFamily: LS_FONTS.PoppinsMedium,
        fontSize: 16,
        borderWidth: 1,
        marginTop: 10
    }
})
