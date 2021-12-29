import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, StatusBar, Platform, Image, TouchableOpacity, FlatList } from 'react-native'

/* Constants */
import LS_COLORS from '../../../constants/colors';
import LS_FONTS from '../../../constants/fonts';

/* Packages */
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import RNGooglePlaces from 'react-native-google-places';
import DateTimePickerModal from "react-native-modal-datetime-picker";

/* Components */;
import Header from '../../../components/header';
import DropDown from '../../../components/dropDown';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { Row } from 'native-base'
import { BASE_URL } from '../../../api/api';
import { Dimensions } from 'react-native';
import { showToast } from '../../../components/validators';
import { PermissionsAndroid } from 'react-native';
import { useSelector } from 'react-redux';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/core';

const ChatUsers = (props) => {
    const [search, setSearch] = useState('')
    const [done, setDone] = useState(false)
    const user = useSelector(state => state.authenticate.user)
    const [allChats, setAllChats] = useState([])
    const [data, setData] = useState([...allChats])
    const [array, setArray] = useState([])

    useFocusEffect(useCallback(() => {
        let unsubscribe = firestore()
            .collection('Chats')
            .onSnapshot(querySnapshot => {
                let _data = querySnapshot.docs.filter((i) => {
                    return i._data.roomid.includes(user.id.toString())
                })
                console.log(_data.sort((a, b) => b._data.lastMessageTime - a._data.lastMessageTime))
                setAllChats([..._data])
                let data1 = []
                data1 = querySnapshot._docs.filter((i) => {
                    let u1 = i._data.participants.user1
                    let u2 = i._data.participants.user2
                    if (u1.id == user.id.toString() || u2.id == user.id.toString()) {
                        if (u1.id == user.id.toString()) {
                            return i._data.readOffSet.user1.read > 0
                        } else {
                            return i._data.readOffSet.user2.read > 0
                        }
                    } else {
                        return false
                    }
                })
                if (data1.length > 0) {
                    //   dispatch(getRead(data1.length))
                }
                else {
                    //   dispatch(getRead(0))
                }
            });
        return () => unsubscribe();
    }, []))



    async function get_user() {

    }

    const renderData = (itemData) => {
        let otherUser = null
        let readcount = null
        let read11 = true
        if (itemData.item._data.participants.user1.id == user.id) {
            otherUser = itemData.item._data.participants.user2
            readcount = itemData.item._data.readOffSet.user1.read
            if (readcount == 0) {
                read11 = false
            }
        } else {
            otherUser = itemData.item._data.participants.user1
            readcount = itemData.item._data.readOffSet.user2.read
            if (readcount == 0) {
                read11 = false
            }
        }
        return (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 10,
                    marginTop: 15,
                    alignSelf: 'center',
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: '#4141411A',
                    width: "90%"
                }}
                activeOpacity={0.7}
                onPress={() => { props.navigation.navigate("ChatScreen", { item: otherUser }) }}
            >
                <View style={{ flexDirection: 'row' }}>
                    <Image
                        source={otherUser.profile_image !== null ? { uri: BASE_URL + otherUser.profile_image } : require("../../../assets/user.png")}
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 200,
                            overflow: 'hidden',
                        }}
                    />
                    <View style={{ marginLeft: '8%', alignSelf: 'center', width: "55%" }}>
                        <Text style={{ fontSize: 15, fontFamily: LS_FONTS.PoppinsMedium, color: 'black' }}>{otherUser.first_name}</Text>
                        <Text numberOfLines={1} style={{ fontSize: 12, fontFamily: LS_FONTS.PoppinsRegular, color: 'black' }}>{itemData.item._data.lastMessage}</Text>
                    </View>
                    <View style={{ width: "20%", justifyContent: "flex-start", alignItems: "flex-end" }}>
                        {readcount ?
                            <View style={{ height: 25, width: 25, borderRadius: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: LS_COLORS.global.green, alignSelf: "flex-end" }}>
                                <Text style={{ fontSize: 14, fontFamily: LS_FONTS.PoppinsRegular, color: 'white', alignSelf: 'center' }}>{readcount}</Text>
                            </View> : null}
                        <Text style={{ color: "grey", fontFamily: LS_FONTS.PoppinsRegular }}>{moment(itemData?.item?._data?.lastMessageTime).format('hh:mm A')}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }


    return (
        <>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <SafeAreaView style={{ flex: 1, backgroundColor: "#ACF0F2" }} edges={["top"]}>
                <Header
                    title="Chat"
                    imageUrl={require("../../../assets/back.png")}
                    action={() => {
                        props.navigation.goBack()
                    }}

                />
                <View style={{ flex: 1, backgroundColor: "white" }}>
                    <View style={{
                        width: "90%", alignSelf: 'center', paddingHorizontal: 10, height: 44, flexDirection: 'row', backgroundColor: '#F9F9F9', elevation: 5, shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.2,
                        shadowRadius: 0.8, marginTop: 20,
                        borderRadius: 10
                    }}>

                        <TextInput
                            style={{
                                color: "black",
                                fontFamily: LS_FONTS.PoppinsRegular,
                                width: '90%',
                            }}
                            onChangeText={(text) => {
                                setSearch(text)
                            }}
                            placeholder="Search"
                            value={search}
                        />
                        <View style={{ backgroundColor: '#ACF0F2', width: '13%', borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
                            <Image
                                style={{ height: 20, width: 20, resizeMode: 'contain', alignSelf: 'center' }}
                                source={require("../../../assets/searchs.png")}
                            />
                        </View>
                    </View>
                    {allChats?.length === 0 ?
                        <View style={{ flex: 1, backgroundColor: "white", justifyContent: 'center', alignItems: "center", marginTop: 10 }}>
                            <Text style={{ color: "black", fontFamily: LS_FONTS.PoppinsBold }}>No Chats Found</Text>
                        </View>
                        : <FlatList
                            data={allChats
                                .filter(data =>
                                    data._data.participants.user1.first_name
                                        .toLocaleLowerCase()
                                        .includes(search.toLocaleLowerCase()) ||
                                    data._data.participants.user2.first_name
                                        .toLocaleLowerCase()
                                        .includes(search.toLocaleLowerCase())
                                )
                            }
                            renderData={renderData}
                            renderItem={(itemData) => renderData(itemData)}
                        />
                    }
                </View>
            </SafeAreaView>
        </>
    )
}

export default ChatUsers
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: LS_COLORS.global.cyan,
    },
    container: {
        flex: 1,
        backgroundColor: LS_COLORS.global.white,
    },
})





