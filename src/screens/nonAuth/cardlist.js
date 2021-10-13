import React, { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity, Alert, FlatList, Pressable, ImageBackground, StyleSheet } from 'react-native'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import Header from '../../components/header'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useFocusEffect } from '@react-navigation/native'

import { getApi } from '../../api/api'
import { useSelector } from 'react-redux'
import Loader from '../../components/loader'
import LS_COLORS from '../../constants/colors'
import LS_FONTS from '../../constants/fonts'
import { ActivityIndicator } from 'react-native-paper'
import { showToast, storeItem } from '../../components/validators';
export default function CardList({ navigation, route }) {
    const [loader, setLoader] = useState(false)
    const [cards, setCards] = React.useState([])
    const access_token = useSelector(state => state.authenticate.access_token)


    const getCards = () => {
        setLoader(true)
        let headers = {
            Accept: "application/json",
            "Authorization": `Bearer ${access_token}`
        }

        let config = {
            headers: headers,
            data: JSON.stringify({}),
            endPoint: '/api/customerSaveCardList',
            type: 'post'
        }

        getApi(config)
            .then((response) => {
                console.log("Card List", response)
                if (response.status == true && response.data) {
                    setCards(response.data)
                }
                else {

                }
            })
            .catch(err => {
                setLoader(false)
            }).finally(() => {
                setLoader(false)
            })
    }
    const deleteCard = (id) => {
        setLoader(true)
        let headers = {
            "Authorization": `Bearer ${access_token}`
        }
        const formdata = new FormData()
        formdata.append("card_id", id)
        let config = {
            headers: headers,
            data: formdata,
            endPoint: '/api/customerCardRemove',
            type: 'post'
        }
        console.log(config)
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    showToast("Card removed.", 'danger')
                    getCards()
                }
                else {
                    showToast(response.message, 'danger')
                }
            })
            .catch(err => {

            }).finally(() => {
                setLoader(false)
            })
    }

    useFocusEffect(React.useCallback(() => {
        getCards()
    }, []))

    useEffect(() => {
        getCards()
    }, [])


    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <Header imageUrl={require("../../assets/back.png")}
                    action={() => navigation.goBack()}
                    // imageUrl1={require("../../assets/home.png")}
                    // action1={() => props.navigation.navigate("HomeScreen")}
                    title={'Manage Card'} />
                <FlatList
                    style={{ flex: 1 }}
                    data={cards}
                    ListHeaderComponent={loader && <ActivityIndicator color={LS_COLORS.global.green} />}
                    ListEmptyComponent={<View style={[styles.saveText, { justifyContent: "center", alignItems: "center", marginTop: 20 }]}><Text style={[styles.saveText, { color: "gray" }]}>No Cards</Text></View>}
                    renderItem={({ item }) => {
                        return (
                            <Pressable key={item.id} onLongPress={() => {
                                Alert.alert("Delete", "Do you really want to remove this card ?", [
                                    {
                                        text: "No"
                                    },
                                    {
                                        text: "Yes",
                                        onPress: () => {
                                            deleteCard(item.id)
                                        }
                                    }
                                ])
                            }}>
                                <ImageBackground
                                    source={require('../../assets/card.png')}
                                    style={{
                                        width: widthPercentageToDP(90),
                                        justifyContent: "flex-end",
                                        height: 200,
                                        alignSelf: 'center',
                                        overflow: "hidden",
                                        borderRadius: 20,
                                        marginTop: 40
                                    }}
                                    resizeMode="cover"
                                >
                                    <View style={{ marginHorizontal: 15, flexDirection: "row", marginBottom: 20, justifyContent: "space-between" }}>
                                        <View>
                                            <Text style={[styles.saveText, { color: "white" }]}>{item.brand}</Text>
                                            <Text style={[styles.saveText, { color: "white" }]}>********{item.last4}</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.saveText, { color: "white" }]}>Expires :</Text>
                                            <Text style={[styles.saveText, { color: "white" }]}>0{item.exp_month}/{item.exp_year}</Text>
                                        </View>
                                    </View>
                                </ImageBackground>
                            </Pressable>)
                    }
                    }
                />
                <TouchableOpacity
                    style={styles.save}
                    activeOpacity={0.7}
                    onPress={() => {
                        navigation.navigate("AddCard")
                    }}
                >
                    <Text style={styles.saveText}>Add Card</Text>
                </TouchableOpacity>
            </SafeAreaView>
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
    }
})
