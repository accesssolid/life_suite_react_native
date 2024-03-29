import React, { useEffect, useState } from 'react';

/* Packages */
import { createDrawerNavigator, DrawerItemList, DrawerContentScrollView, DrawerItem, useIsDrawerOpen } from '@react-navigation/drawer';

/* Screens */
import LS_FONTS from '../constants/fonts';
import LS_COLORS from '../constants/colors';
// import { View } from 'native-base';

import UserStack from './userStack';
import { useSelector } from 'react-redux';
import ProviderStack from './providerStack';
import { Dimensions, Image, Platform, Text, TouchableOpacity,View } from 'react-native';
import Profile from '../screens/nonAuth/profile';
import OrderHistory from '../screens/nonAuth/orderHistory';
import Favourites from '../screens/nonAuth/favourites';
import TermsModal from '../components/termsModal';
import PrivacyModal from '../components/privacyModal';
import BankModal from '../components/bankModal';
import CopyRightModal from '../components/copyrightModal';
import SoftwareModal from '../components/softwareModal';
import AboutUs from '../screens/nonAuth/aboutUs';
import { Header } from 'react-native/Libraries/NewAppScreen';
import { useNavigation } from '@react-navigation/core';
import ChatUsers from '../screens/nonAuth/chatUsers';
import Notification from '../screens/nonAuth/notification';
import ServicesProvided from '../screens/nonAuth/servicesOffered';
import AddLicense from '../screens/nonAuth/addLicense';
import SelectLocation from '../screens/nonAuth/selectLocation';
import MapScreen from '../screens/nonAuth/map';
import AddTimeFrame from '../screens/nonAuth/addTimeFrame';
import OrderHistory1 from '../screens/nonAuth/orderHistory1';
import UpdateCertificateStack from './updateCertificateStack';
import UpdateQuestionaireStack from './updateQuestionaireStack';

import { getApi } from '../api/api';
import { role } from '../constants/globals';
import { useDispatch } from 'react-redux';
import { updateBankModelData } from '../redux/features/bankModel'
import { loadNotificaitonsThunk } from '../redux/features/notification'
import { showToast, storeItem } from '../components/validators';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import firestore from '@react-native-firebase/firestore';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import { logoutAll } from '../redux/features/loginReducer';
import PushNotification from 'react-native-push-notification';
import ShortcutBadge from 'react-native-app-badge';
import { changeSwitched } from '../redux/features/switchTo';
import AboutUsModal from '../components/aboutUsModal';
import FAQ from '../screens/nonAuth/faq';
import ContactUs from '../screens/nonAuth/contactus';
import SignUpModal from '../components/signupModal';
import { updateSignupModal } from '../redux/features/signupModal';
import BlockModal from '../components/blockModal';
import BlockModel, { updateBlockModal } from '../redux/features/blockModel';
import BlockMessageModal from '../components/BlockMessageModal';
import { updateDot } from '../redux/features/showDot';
import CDCModal from '../components/cdcModal';

const Drawer = createDrawerNavigator();

const MainDrawer = (props) => {
    const user = useSelector(state => state.authenticate.user)
    const userType = useSelector(state => state.authenticate.type)
    const [termsVisible, setTermsVisible] = useState(false)
    const [privacyVisible, setPrivacyVisible] = useState(false)
    const [copyVisible, setCopyVisible] = useState(false)
    const [softwareVisible, setSoftwareVisible] = useState(false)
    const [softwareVisible1, setSoftwareVisible1] = useState(false)
    const [cdcVisible, setCDCVisible] = useState(false)

    const navigation = useNavigation()
    const access_token = useSelector(state => state.authenticate.access_token)
    const authenticate = useSelector(state => state.authenticate)?.authenticate
    const notifications = useSelector(state => state.notification)?.data
    const dispatch = useDispatch()
    const [unSeen, setUnSeen] = React.useState(0)
    // get badge component



    useEffect(() => {
        if (userType !== "guest") {
            let noti_number = notifications?.filter(x => x.is_read == "0").length
            let totalNoti = 0
            if (unSeen > 0) {
                totalNoti += Number(unSeen)
            }
            if (noti_number > 0) {
                totalNoti += Number(noti_number)
            }
            if (!authenticate) {
                totalNoti = 0
            }
            if (totalNoti > 0) {
                dispatch(updateDot(true))
            } else {
                dispatch(updateDot(false))
            }
            if (Platform.OS == "android") {
                ShortcutBadge.getCount().then((count) => {
                    ShortcutBadge.setCount(totalNoti)
                })
            } else {
                PushNotification.setApplicationIconBadgeNumber(totalNoti)
            }
        } else {
            dispatch(updateDot(false))
        }
        // if(ShortcutBadge.supported){

        // }
    }, [notifications, unSeen, authenticate, userType])



    React.useEffect(() => {
        if (userType !== "guest") {
            dispatch(loadNotificaitonsThunk())
            let unsubscribe = firestore()
                .collection('Chats')
                .onSnapshot(querySnapshot => {
                    let data1 = []
                    data1 = querySnapshot._docs.filter((i) => {
                        let u1 = i._data.participants.user1
                        let u2 = i._data.participants.user2
                        if (u1.id == user?.id?.toString() || u2.id == user?.id?.toString()) {
                            if (u1.id == user?.id?.toString()) {
                                return i._data.readOffSet.user1.read > 0
                            } else {
                                return i._data.readOffSet.user2.read > 0
                            }
                        } else {
                            return false
                        }
                    })
                    setUnSeen(data1.length)
                });
            return () => unsubscribe();
        }
    }, [props])

    const getConnectAccountDetail = () => {
        try {
            let headers = {
                'Content-Type': 'multipart/form-data',
                "Authorization": `Bearer ${access_token}`
            }
            let config = {
                headers: headers,
                data: JSON.stringify({}),
                endPoint: '/api/isAccountSetupDetail',
                type: 'post'
            }
            getApi(config).then(response => {
                if (response.status == true) {
                    if (response.data) {
                        if (response.data.email && response.data.details_submitted) {

                        } else {
                            dispatch(updateBankModelData({
                                data: {
                                    title: "Select Account",
                                    subtitle: "You do not have any active accounts.",
                                    buttonTitle: "Add Stripe Account",
                                    type: "provider",
                                    open: true
                                }
                            }))
                        }
                    }
                }
                else {
                    showToast(response.message, 'danger')
                }
            })
                .catch(err => {

                })
        } catch (err) {

        }
    }
    const getAccountLink = () => {
        try {
            let headers = {
                'Content-Type': 'multipart/form-data',
                "Authorization": `Bearer ${access_token}`
            }
            let config = {
                headers: headers,
                data: JSON.stringify({}),
                endPoint: '/api/addConnectAccountLink',
                type: 'post'
            }
            getApi(config).then(response => {
                if (response.status == true) {
                    if (response.data) {
                        props.navigation.navigate("UserStack", { screen: "CustomWebView", params: { uri: response.data.url } })
                    }
                }
                else {
                    showToast(response.message, 'danger')
                }
            })
                .catch(err => {

                })
        } catch (err) {

        }
    }
    const getCards = () => {

        let headers = {
            "Authorization": `Bearer ${access_token}`
        }

        let config = {
            headers: headers,
            endPoint: '/api/customerSaveCardList',
            type: 'get'
        }

        getApi(config)
            .then((response) => {
                if (response.status == true && response.data) {
                    if (response.data.length == 0) {
                        dispatch(updateBankModelData({
                            data: {
                                title: "Add Cards",
                                subtitle: "You do not have any active cards to start order.",
                                buttonTitle: "Add Card",
                                type: "customer",
                                open: true
                            }
                        }))
                    }
                }
                else {
                    dispatch(updateBankModelData({
                        data: {
                            title: "Add Cards",
                            subtitle: "You do not have any active cards to start order.",
                            buttonTitle: "Add Card",
                            type: "customer",
                            open: true
                        }
                    }))
                }
            })
            .catch(err => {
                console.log(err)
            }).finally(() => {
            })
    }
    React.useEffect(() => {
        if (userType !== "guest") {
            if (user?.user_status == 1) {
                if (user.user_role == role.customer) {
                    getCards()
                } else if (user.user_role == role.provider) {
                    getConnectAccountDetail()
                }
            } else if (user?.user_status == 3) {
                dispatch(updateBlockModal(true))
            }
            // notification thunk dispatch
            dispatch(loadNotificaitonsThunk())
        }
    }, [])

    return (
        <>
            <Drawer.Navigator
                drawerContent={(props) => <CustomDrawerContent {...props} setTermsVisible={setTermsVisible} setPrivacyVisible={setPrivacyVisible} setCopyVisible={setCopyVisible} setSoftwareVisible={setSoftwareVisible} unSeen={unSeen} notifications={notifications} setCDCVisible={setCDCVisible} setSoftwareVisible1={setSoftwareVisible1} />}
                drawerStyle={{
                    width: Dimensions.get('screen').width / 1.3
                }}
                initialRouteName="HomeScreen"
                screenOptions={{
                    unmountOnBlur: true,
                    headerShown:false
                }}
                drawerContentOptions={{
                    labelStyle: {
                        fontFamily: LS_FONTS.PoppinsMedium,
                        fontSize: 14,
                        color: LS_COLORS.global.darkBlack,
                    },
                    itemStyle: {
                        marginVertical: 0,
                    },
                    activeTintColor: LS_COLORS.global.white,
                    inactiveTintColor: LS_COLORS.global.green
                }}>
                <Drawer.Screen
                    name="Profile"
                    component={Profile}
                    options={{
                        drawerIcon: ({ focused, color }) => <Image resizeMode="contain" source={require('../assets/userGreen.png')} style={{ height: 20, width: 20 }} />,
                        drawerLabel: ({ focused, color }) => <View style={{ flexDirection: "row" }}><Text style={{
                            fontFamily: LS_FONTS.PoppinsMedium,
                            fontSize: 14,
                            color: LS_COLORS.global.darkBlack,
                        }} maxFontSizeMultiplier={1.7}>Profile</Text>
                        </View>,
                    }}
                />
                <Drawer.Screen
                    name="Orders"
                    component={user.user_role == role.customer ? OrderHistory1 : OrderHistory}
                    // component={OrderHistory}
                    options={{
                        drawerIcon: ({ focused, color }) => <Image resizeMode="contain" source={require('../assets/note.png')} style={{ height: 20, width: 20 }} />,
                        drawerLabel: ({ focused, color }) => <View style={{ flexDirection: "row" }}><Text style={{
                            fontFamily: LS_FONTS.PoppinsMedium,
                            fontSize: 14,
                            color: LS_COLORS.global.darkBlack,
                        }} maxFontSizeMultiplier={1.7}>My Orders</Text>
                        </View>,
                    }}
                />
                <Drawer.Screen
                    name="Messages"
                    component={ChatUsers}

                // options={{
                //     drawerIcon: ({ focused, color }) => <Image resizeMode="contain" source={require('../assets/message.png')} style={{ height: 20, width: 20 }} />,
                //     drawerLabel: ({ focused, color }) => <View style={{ flexDirection: "row" }}><Text style={{
                //         fontFamily: LS_FONTS.PoppinsMedium,
                //         fontSize: 14,
                //         color: LS_COLORS.global.darkBlack,
                //     }} maxFontSizeMultiplier={1.7}>Messages</Text>
                //         {/* <MessageBadge /> */}
                //     </View>
                // }}
                />
                <Drawer.Screen
                    name="Favorites"
                    component={Favourites}
                    options={{
                        drawerIcon: ({ focused, color }) => <Image resizeMode="contain" source={require('../assets/heartGreen.png')} style={{ height: 20, width: 20 }} />,
                        drawerLabel: ({ focused, color }) => <View style={{ flexDirection: "row" }}><Text style={{
                            fontFamily: LS_FONTS.PoppinsMedium,
                            fontSize: 14,
                            color: LS_COLORS.global.darkBlack,
                        }} maxFontSizeMultiplier={1.7}>Favorites</Text>
                        </View>,
                    }}
                />
                <Drawer.Screen
                    name="Notification"
                    component={Notification}
                // options={{
                //     drawerLabel: ({ focused, color }) => <View style={{ flexDirection: "row" }}><Text style={{
                //         fontFamily: LS_FONTS.PoppinsMedium,
                //         fontSize: 14,
                //         color: LS_COLORS.global.darkBlack,
                //     }} maxFontSizeMultiplier={1.7}>Notification</Text>
                //         {/* <GetBadge /> */}
                //     </View>,
                //     drawerIcon: ({ focused, size, color }) => <FontAwesome name="bell" color={color} size={20} />,
                // }}
                />
                <Drawer.Screen
                    name="About Us"
                    component={AboutUs}
                    options={{
                        drawerIcon: ({ focused, color }) => <Image resizeMode="contain" source={require('../assets/aboutUs.png')} style={{ height: 20, width: 20 }} />
                    }}
                />
                <Drawer.Screen
                    name="Contact Us"
                    component={ContactUs}
                    options={{
                        drawerIcon: ({ focused, color }) => <Image resizeMode="contain" source={require('../assets/contactUs.png')} style={{ height: 20, width: 20 }} />,
                    }}
                />
                <Drawer.Screen
                    name="HomeScreen"
                    component={user.user_role == role.customer ? UserStack : ProviderStack}
                    options={{
                        drawerIcon: ({ focused, color }) => null,
                        drawerLabel: ({ focused, color }) => null,
                    }}
                />
                <Drawer.Screen
                    name="ServicesProvided"
                    component={ServicesProvided}
                    options={{
                        drawerIcon: ({ focused, color }) => <View style={{ height: 0 }} />,
                        drawerLabel: ({ focused, color }) => <Text style={{ height: 0 }}></Text>,
                    }}
                />
                <Drawer.Screen
                    name="AddLicense"
                    component={AddLicense}
                    options={{
                        drawerIcon: ({ focused, color }) => <View style={{ height: 0 }} />,
                        drawerLabel: ({ focused, color }) => <Text style={{ height: 0 }}></Text>,
                    }}
                />
                <Drawer.Screen
                    name="SelectLocation"
                    component={SelectLocation}
                    options={{
                        drawerIcon: ({ focused, color }) => <View style={{ height: 0 }} />,
                        drawerLabel: ({ focused, color }) => <Text style={{ height: 0 }}></Text>,
                    }}
                />
                <Drawer.Screen
                    name="MapScreen"
                    component={MapScreen}
                    options={{
                        drawerIcon: ({ focused, color }) => <View style={{ height: 0 }} />,
                        drawerLabel: ({ focused, color }) => <Text style={{ height: 0 }}></Text>,
                    }}
                />
                <Drawer.Screen
                    name="AddTimeFrame"
                    component={AddTimeFrame}
                    options={{
                        drawerIcon: ({ focused, color }) => <View style={{ height: 0 }} />,
                        drawerLabel: ({ focused, color }) => <Text style={{ height: 0 }}></Text>,
                    }}
                />
                <Drawer.Screen
                    name="FAQ"
                    component={FAQ}
                    options={{
                        drawerIcon: ({ focused, color }) => <View style={{ height: 0 }} />,
                        drawerLabel: ({ focused, color }) => <Text style={{ height: 0 }}></Text>,
                    }}
                />
                <Drawer.Screen
                    name="UpdateCertificateStack"
                    component={UpdateCertificateStack}
                    options={{
                        drawerIcon: ({ focused, color }) => <View style={{ height: 0 }} />,
                        drawerLabel: ({ focused, color }) => <Text style={{ height: 0 }}></Text>,
                    }}
                />
                 <Drawer.Screen
                    name="UpdateQuestionaireStack"
                    component={UpdateQuestionaireStack}
                    options={{
                        drawerIcon: ({ focused, color }) => <View style={{ height: 0 }} />,
                        drawerLabel: ({ focused, color }) => <Text style={{ height: 0 }}></Text>,
                    }}
                />
            </Drawer.Navigator>
            <TermsModal
                isVisible={termsVisible}
                setVisible={setTermsVisible}
            />
            <PrivacyModal
                isVisible={privacyVisible}
                setVisible={setPrivacyVisible}
            />
            <CopyRightModal
                isVisible={copyVisible}
                setVisible={setCopyVisible}
            />
            <SoftwareModal
                isVisible={softwareVisible}
                setVisible={setSoftwareVisible}
            />
            <AboutUsModal
                isVisible={softwareVisible1}
                setVisible={setSoftwareVisible1}
            />
             <AboutUsModal
                isVisible={softwareVisible1}
                setVisible={setSoftwareVisible1}
            />
             <CDCModal
                isVisible={cdcVisible}
                setVisible={setCDCVisible}
            />
            <BankModal />
            <SignUpModal />
            <BlockMessageModal />
        </>
    )
}

export default MainDrawer;

const CustomDrawerContent = (props) => {
    const user = useSelector(state => state.authenticate.user)
    const userType = useSelector(state => state.authenticate.type)

    const access_token = useSelector(state => state.authenticate.access_token)
    const { state, ...rest } = props;
    const newState = { ...state }
    newState.routes = newState.routes.filter(item => item.name !== 'About Us' && item.name != "FAQ" && item.name != "Contact Us")

    const navigation = useNavigation()
    const dispatch = useDispatch()
    const [loader, setLoader] = React.useState(false)
    function logout() {
        props.navigation.closeDrawer()
        // props.navigation.pop()
        // return
        setLoader(true)
        let headers = {
            "Authorization": `Bearer ${access_token}`
        }
        var formdata = new FormData();
        formdata.append("device_id", getUniqueId());

        let config = {
            headers: headers,
            data: formdata,
            endPoint: user.user_role == role.customer ? '/api/customerLogout' : '/api/providerLogout',
            type: 'post'
        }
        getApi(config)
            .then((response) => {
                if (response.status == true) {
                    storeItem('user', null)
                    storeItem('passcode', null)
                    navigation.navigate('WelcomeScreen1')
                    dispatch(logoutAll())
                }
                else {
                    setLoader(false)
                    // showToast(response.message, 'danger')
                    storeItem('user', null)
                    storeItem('passcode', null)
                    navigation.navigate('WelcomeScreen1')
                    dispatch(logoutAll())
                }
            })
            .catch(err => {

            }).finally(() => {

                // setLoader(false)
                // // showToast(response.message, 'danger')
                // storeItem('user', null)
                // storeItem('passcode', null)
                // navigation.navigate('WelcomeScreen')
                // dispatch(logoutAll())
            })
    }
    const MessageBadge = () => {
        if (props?.unSeen == 0) {
            return null
        }
        return (
            <View style={{ borderRadius: 200, backgroundColor: "red", marginLeft: 10, justifyContent: "center" }} >
                <Text maxFontSizeMultiplier={1.5} style={{ color: LS_COLORS.global.white, aspectRatio: 1, textAlign: "center", marginHorizontal: 5 }}>{props?.unSeen}</Text>
            </View>
        )
    }

    const GetBadge = () => {
        if (props?.notifications?.filter(x => x.is_read == "0").length == 0) {
            return null
        }
        return (<View style={{ borderRadius: 200, backgroundColor: "red", marginLeft: 10, justifyContent: "center" }} >
            <Text maxFontSizeMultiplier={1.5} style={{ color: LS_COLORS.global.white, aspectRatio: 1, textAlign: "center", marginHorizontal: 5 }}>{props?.notifications?.filter(x => x.is_read == "0")?.length}</Text>
        </View>
        )
    }
    return (
        <DrawerContentScrollView {...props}>
            <View >
                <Image source={require('../assets/splash/logo.png')} resizeMode="contain" style={{ height: 100, width: '80%', marginLeft: 10, }} />
                <Text maxFontSizeMultiplier={1.7} style={{ fontFamily: LS_FONTS.PoppinsSemiBold, fontSize: 15, marginLeft: 10 }}>{user?.user_role == role.customer ? "Customer" : "Service Provider"}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 10, backgroundColor: LS_COLORS.global.green, paddingVertical: 5 }}>
                <Text maxFontSizeMultiplier={1.7} style={{ fontFamily: LS_FONTS.PoppinsSemiBold, color: "white", fontSize: 18, marginLeft: 10 }}>{user?.first_name} {user?.last_name}</Text>
            </View>
            <View onTouchEnd={() => {
                // if(userType=="guest"){
                //     props.navigation.toggleDrawer()
                //     dispatch(updateSignupModal(true))
                //     return
                // }
                logout()
                dispatch(changeSwitched(true))
            }} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 10, backgroundColor: LS_COLORS.global.green, paddingVertical: 5 }}>
                <Text maxFontSizeMultiplier={1.7} style={{ fontFamily: LS_FONTS.PoppinsSemiBold, color: "white", fontSize: 14, marginLeft: 10 }}>Switch to {user?.user_role == role.provider ? "Customer" : "Provider"}</Text>
            </View>
            {/* <DrawerItemList state={newState} {...rest} /> */}

            <DrawerItem
                style={{ marginTop: 0 }}
                label={(props) => <Text
                    style={{
                        fontFamily: LS_FONTS.PoppinsMedium,
                        fontSize: 14,
                        color: LS_COLORS.global.darkBlack,
                    }}
                    maxFontSizeMultiplier={1.7}
                >Profile
                </Text>}
                icon={({ focused, color }) => <Image resizeMode="contain" source={require('../assets/userGreen.png')} style={{ height: 20, width: 20 }} />}
                onPress={() => {
                    props.navigation.toggleDrawer()
                    if (userType == "guest") {
                        dispatch(updateSignupModal(true))
                    } else {
                        navigation.navigate("Profile")
                    }

                }}
            />
            <DrawerItem
                style={{ marginTop: 0 }}

                label={(props) => <Text
                    style={{
                        fontFamily: LS_FONTS.PoppinsMedium,
                        fontSize: 14,
                        color: LS_COLORS.global.darkBlack,
                    }}
                    maxFontSizeMultiplier={1.7}
                >My Orders
                </Text>}

                icon={({ focused, color }) => <Image resizeMode="contain" source={require('../assets/note.png')} style={{ height: 20, width: 20 }} />}
                onPress={() => {
                    props.navigation.toggleDrawer()
                    if (userType == "guest") {
                        dispatch(updateSignupModal(true))

                    } else {
                        navigation.navigate("Orders")
                    }

                }}
            />
            <DrawerItem
                style={{ marginTop: 0 }}

                label={(props) =>
                    <View style={{ flexDirection: "row" }}><Text
                        style={{
                            fontFamily: LS_FONTS.PoppinsMedium,
                            fontSize: 14,
                            color: LS_COLORS.global.darkBlack,
                        }}
                        maxFontSizeMultiplier={1.7}
                    >Messages
                    </Text>
                        {userType != "guest" && <MessageBadge />}
                    </View>
                }
                icon={({ focused, color }) => <Image resizeMode="contain" source={require('../assets/message.png')} style={{ height: 20, width: 20 }} />}
                onPress={() => {
                    props.navigation.toggleDrawer()
                    if (userType == "guest") {
                        dispatch(updateSignupModal(true))

                    } else {
                        navigation.navigate("Messages")
                    }

                }}
            />
            <DrawerItem
                style={{ marginTop: 0 }}

                label={(props) => <Text
                    style={{
                        fontFamily: LS_FONTS.PoppinsMedium,
                        fontSize: 14,
                        color: LS_COLORS.global.darkBlack,
                    }}
                    maxFontSizeMultiplier={1.7}
                >Favorites
                </Text>}

                icon={({ focused, color }) => <Image resizeMode="contain" source={require('../assets/heartGreen.png')} style={{ height: 20, width: 20 }} />}
                onPress={() => {
                    props.navigation.toggleDrawer()
                    if (userType == "guest") {
                        dispatch(updateSignupModal(true))

                    } else {
                        navigation.navigate("Favorites")
                    }


                }}
            />

            <DrawerItem
                style={{ marginTop: 0 }}

                label={(props) => <View style={{ flexDirection: "row" }}><Text
                    style={{
                        fontFamily: LS_FONTS.PoppinsMedium,
                        fontSize: 14,
                        color: LS_COLORS.global.darkBlack,
                    }}
                    maxFontSizeMultiplier={1.7}
                >Notification</Text>
                    {userType != "guest" && <GetBadge />}
                </View>}
                icon={({ focused, color }) => <FontAwesome name="bell" color={LS_COLORS.global.green} size={20} />}
                onPress={() => {
                    props.navigation.toggleDrawer()

                    if (userType == "guest") {
                        dispatch(updateSignupModal(true))

                    } else {
                        navigation.navigate("Notification")
                    }
                }}
            />

            <DrawerItem
                style={{ marginTop: 0 }}
                label={(props) => <Text
                    style={{
                        fontFamily: LS_FONTS.PoppinsMedium,
                        fontSize: 14,
                        color: LS_COLORS.global.darkBlack,
                    }}
                    maxFontSizeMultiplier={1.7}
                >About Us
                </Text>}

                icon={({ focused, color }) => <Image resizeMode="contain" source={require('../assets/aboutUs.png')} style={{ height: 20, width: 20 }} />}
                onPress={() => {
                    props.navigation.toggleDrawer()
                    props.setSoftwareVisible1(true)
                }}
            />
            <DrawerItem
                style={{ marginTop: 0 }}
                label={(props) => <Text
                    style={{
                        fontFamily: LS_FONTS.PoppinsMedium,
                        fontSize: 14,
                        color: LS_COLORS.global.darkBlack,
                    }}
                    maxFontSizeMultiplier={1.7}
                >Contact Us
                </Text>}
                icon={({ focused, color }) => <Image resizeMode="contain" source={require('../assets/contactUs.png')} style={{ height: 20, width: 20 }} />}
                onPress={() => {
                    navigation.navigate("Contact Us")
                }}
            />
            <DrawerItem
                style={{ marginTop: 0 }}
                label={(props) => <Text
                    style={{
                        fontFamily: LS_FONTS.PoppinsMedium,
                        fontSize: 14,
                        color: LS_COLORS.global.darkBlack,
                    }}
                    maxFontSizeMultiplier={1.7}
                >FAQ
                </Text>}
                icon={({ focused, color }) => <Image resizeMode="contain" source={require('../assets/faq.png')} style={{ height: 20, width: 20 }} />}
                onPress={() => {
                    props.navigation.toggleDrawer()
                    navigation.navigate("FAQ")
                }}
            />
            {user?.user_role == role.provider && <DrawerItem
                style={{ marginTop: 0 }}
                label={(props) => <Text
                    style={{
                        fontFamily: LS_FONTS.PoppinsMedium,
                        fontSize: 14,
                        color: LS_COLORS.global.darkBlack,
                    }}
                    maxFontSizeMultiplier={1.7}
                >Update Insurance/License
                </Text>}
                icon={({ focused, color }) => <Image resizeMode="cover" source={require('../assets/certs.png')} style={{ height: 20, width: 20 }} />}
                onPress={() => {
                    navigation.navigate("UpdateCertificateStack", { screen: "UpdateCertificateServiceList" })
                }}
            />}
            {user?.user_role == role.provider && <DrawerItem
                style={{ marginTop: 0 }}
                label={(props) => <Text
                    style={{
                        fontFamily: LS_FONTS.PoppinsMedium,
                        fontSize: 14,
                        color: LS_COLORS.global.darkBlack,
                    }}
                    maxFontSizeMultiplier={1.7}
                >Update Questionaire
                </Text>}
                icon={({ focused, color }) => <Image resizeMode="cover" source={require('../assets/q.png')} style={{ height: 20, width: 20 }} />}
                onPress={() => {
                    navigation.navigate("UpdateQuestionaireStack", { screen: "UpdateQServiceList" })
                }}
            />}
            <DrawerItem
                style={{ marginTop: user?.user_role == role.customer ? 0 : 0 }}
                label={(props) => <Text
                    style={{
                        fontFamily: LS_FONTS.PoppinsMedium,
                        fontSize: 14,
                        color: LS_COLORS.global.darkBlack,
                    }}
                    maxFontSizeMultiplier={1.7}
                >Legal</Text>}
                icon={({ focused, color }) => <Image resizeMode="cover" source={require('../assets/legal.png')} style={{ height: 20, width: 20 }} />}
                onPress={() => null}
            />
            <View style={{ width: '84%', alignSelf: 'flex-end' }}>
                <DrawerItem
                    label={(props) => <Text
                        style={{
                            fontFamily: LS_FONTS.PoppinsMedium,
                            fontSize: 11,
                            color: LS_COLORS.global.darkBlack,
                            marginLeft: -20
                        }}
                        maxFontSizeMultiplier={1.7}
                    >Terms & Conditions
                    </Text>}
                    icon={({ focused, color }) => <Image resizeMode="contain" source={require('../assets/termsIcon.png')} style={{ height: 15, width: 15 }} />}
                    onPress={() => { props.navigation.toggleDrawer(), props.setTermsVisible(true) }}
                />
                <DrawerItem
                    label={(props) => <Text
                        style={{
                            fontFamily: LS_FONTS.PoppinsMedium,
                            fontSize: 11,
                            color: LS_COLORS.global.darkBlack,
                            marginLeft: -20
                        }}
                        maxFontSizeMultiplier={1.7}
                    >Copyright
                    </Text>}
                    icon={({ focused, color }) => <Image resizeMode="contain" source={require('../assets/copyIcon.png')} style={{ height: 15, width: 15 }} />}
                    onPress={() => { props.navigation.toggleDrawer(), props.setCopyVisible(true) }}
                />
                <DrawerItem
                    label={(props) => <Text
                        style={{
                            fontFamily: LS_FONTS.PoppinsMedium,
                            fontSize: 11,
                            color: LS_COLORS.global.darkBlack,
                            marginLeft: -20
                        }}
                        maxFontSizeMultiplier={1.7}
                    >Privacy Policy
                    </Text>}
                    icon={({ focused, color }) => <Image resizeMode="contain" source={require('../assets/privacyIcon.png')} style={{ height: 15, width: 15 }} />}
                    onPress={() => { props.navigation.toggleDrawer(), props.setPrivacyVisible(true) }}
                />
                <DrawerItem
                    label={(props) => <Text
                        style={{
                            fontFamily: LS_FONTS.PoppinsMedium,
                            fontSize: 11,
                            color: LS_COLORS.global.darkBlack,
                            marginLeft: -20
                        }}
                        maxFontSizeMultiplier={1.7}
                    >Software License
                    </Text>}
                    icon={({ focused, color }) => <Image resizeMode="contain" source={require('../assets/licenceIcon.png')} style={{ height: 15, width: 15 }} />}
                    onPress={() => { props.navigation.toggleDrawer(), props.setSoftwareVisible(true) }}
                />
                <DrawerItem
                    label={(props) => <Text
                        style={{
                            fontFamily: LS_FONTS.PoppinsMedium,
                            fontSize: 11,
                            color: LS_COLORS.global.darkBlack,
                            marginLeft: -20
                        }}
                        maxFontSizeMultiplier={1.7}
                    >CDC Guidelines
                    </Text>}
                    icon={({ focused, color }) => <Image resizeMode="contain" source={require('../assets/licenceIcon.png')} style={{ height: 15, width: 15 }} />}
                    onPress={() => { props.navigation.toggleDrawer(), props.setCDCVisible(true) }}
                />
            </View>
        </DrawerContentScrollView>
    )
}

const Test = () => {
    const navigation = useNavigation()
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: "absolute", top: 30, left: 20 }}>
            <Image
                source={require('../assets/back.png')} />
        </TouchableOpacity>
        <Text maxFontSizeMultiplier={1.7}>WORK IN PROGRESS</Text>

    </View>
}