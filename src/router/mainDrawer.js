import React, { useState } from 'react';

/* Packages */
import { createDrawerNavigator, DrawerItemList, DrawerContentScrollView, DrawerItem, useIsDrawerOpen } from '@react-navigation/drawer';

/* Screens */
import LS_FONTS from '../constants/fonts';
import LS_COLORS from '../constants/colors';
import { View } from 'native-base';
import UserStack from './userStack';
import { useSelector } from 'react-redux';
import ProviderStack from './providerStack';
import { Dimensions, Image, Text, TouchableOpacity } from 'react-native';
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
import { getApi } from '../api/api';
import { role } from '../constants/globals';
import { useDispatch } from 'react-redux';
import { updateBankModelData } from '../redux/features/bankModel'
import { loadNotificaitonsThunk } from '../redux/features/notification'
import { showToast, storeItem } from '../components/validators';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import firestore from '@react-native-firebase/firestore';

const Drawer = createDrawerNavigator();

const MainDrawer = (props) => {
    const user = useSelector(state => state.authenticate.user)
    const [termsVisible, setTermsVisible] = useState(false)
    const [privacyVisible, setPrivacyVisible] = useState(false)
    const [copyVisible, setCopyVisible] = useState(false)
    const [softwareVisible, setSoftwareVisible] = useState(false)
    const navigation = useNavigation()
    const access_token = useSelector(state => state.authenticate.access_token)
    const notifications = useSelector(state => state.notification)?.data
    const dispatch = useDispatch()
    const [unSeen, setUnSeen] = React.useState(0)
    // get badge component
    const GetBadge = () => {
        if (notifications?.filter(x => x.is_read == "0").length == 0) {
            return null
        }
        return (<View style={{ height: 20, borderRadius: 20, backgroundColor: "red", marginLeft: 10, justifyContent: "center" }} >
            <Text style={{ color: LS_COLORS.global.white, marginHorizontal: 5 }}>{notifications?.filter(x => x.is_read == "0").length}</Text>
        </View>
        )
    }

    const MessageBadge=()=>{
        if(unSeen==0){
            return null
        }
        return(
            <View style={{ height: 20, borderRadius: 20, backgroundColor: "red", marginLeft: 10, justifyContent: "center" }} >
            <Text style={{ color: LS_COLORS.global.white, marginHorizontal: 5 }}>{unSeen}</Text>
        </View>
        )
    }

    React.useEffect(() => {
        dispatch(loadNotificaitonsThunk())
        let unsubscribe = firestore()
            .collection('Chats')
            .onSnapshot(querySnapshot => {
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
                setUnSeen(data1.length)
            });
        return () => unsubscribe();
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
                console.log(response)
                if (response.status == true) {
                    if (response.data) {
                        if (response.data.email && response.data.details_submitted) {

                        } else {
                            dispatch(updateBankModelData({
                                data: {
                                    title: "Select Account",
                                    subtitle: "You do not have any active accounts.",
                                    buttonTitle: "Add Stripe Money",
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
                console.log(response)
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
        if (user.user_role == role.customer) {
            getCards()
        } else if (user.user_role == role.provider) {
            getConnectAccountDetail()
        }
        // notification thunk dispatch
        dispatch(loadNotificaitonsThunk())
    }, [])

    return (
        <>
            <Drawer.Navigator
                drawerContent={(props) => <CustomDrawerContent {...props} setTermsVisible={setTermsVisible} setPrivacyVisible={setPrivacyVisible} setCopyVisible={setCopyVisible} setSoftwareVisible={setSoftwareVisible} />}
                drawerStyle={{
                    width: Dimensions.get('screen').width / 1.3
                }}
                initialRouteName="HomeScreen"
                screenOptions={{
                    unmountOnBlur: true
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
                    }}
                />
                <Drawer.Screen
                    name="Orders"
                    component={user.user_role == role.customer ? OrderHistory1 : OrderHistory}
                    // component={OrderHistory}
                    
                    options={{
                        drawerLabel:"My Orders",
                        drawerIcon: ({ focused, color }) => <Image resizeMode="contain" source={require('../assets/note.png')} style={{ height: 20, width: 20 }} />,
                    }}
                />
                <Drawer.Screen
                    name="Messages"
                    component={ChatUsers}

                    options={{
                        drawerIcon: ({ focused, color }) => <Image resizeMode="contain" source={require('../assets/message.png')} style={{ height: 20, width: 20 }} />,
                        drawerLabel: ({ focused, color }) => <View style={{ flexDirection: "row" }}><Text style={{
                            fontFamily: LS_FONTS.PoppinsMedium,
                            fontSize: 14,
                            color: LS_COLORS.global.darkBlack,
                        }}>Messages</Text>
                            <MessageBadge />
                        </View>,
                    }}
                />
                <Drawer.Screen
                    name="Favorites"
                    component={Favourites}

                    options={{

                        drawerIcon: ({ focused, color }) => <Image resizeMode="contain" source={require('../assets/heartGreen.png')} style={{ height: 20, width: 20 }} />,
                    }}
                />
                <Drawer.Screen
                    name="Notification"
                    component={Notification}
                    options={{
                        drawerLabel: ({ focused, color }) => <View style={{ flexDirection: "row" }}><Text style={{
                            fontFamily: LS_FONTS.PoppinsMedium,
                            fontSize: 14,
                            color: LS_COLORS.global.darkBlack,
                        }}>Notification</Text>
                            <GetBadge />
                        </View>,
                        drawerIcon: ({ focused, size, color }) => <FontAwesome name="bell" color={color} size={20} />,
                    }}
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
                    component={Test}
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
                    name="UpdateCertificateStack"
                    component={UpdateCertificateStack}
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
            <BankModal />
        </>
    )
}

export default MainDrawer;

const CustomDrawerContent = (props) => {
    const user = useSelector(state => state.authenticate.user)
    const navigation = useNavigation()
    return (
        <DrawerContentScrollView {...props}>
            <View >
                <Image source={require('../assets/splash/logo.png')} resizeMode="contain" style={{ height: 100, width: '80%', marginLeft: 10, }} />
                <Text style={{ fontFamily: LS_FONTS.PoppinsSemiBold, fontSize: 15, marginLeft: 10 }}>{user?.user_role == role.customer ? "Customer" : "Service Provider"}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 10, backgroundColor: LS_COLORS.global.drawer_name, paddingVertical: 5 }}>
                <Text style={{ fontFamily: LS_FONTS.PoppinsSemiBold, fontSize: 15, marginLeft: 10 }}>{user?.first_name} {user?.last_name}</Text>
            </View>
            <DrawerItemList {...props} />
            {user?.user_role == role.provider &&<DrawerItem
                style={{ marginTop: -185 }}
                label="Update Certificate"
                labelStyle={{
                    fontFamily: LS_FONTS.PoppinsMedium,
                    fontSize: 14,
                    color: LS_COLORS.global.darkBlack,
                }}
                icon={({ focused, color }) => <Image resizeMode="cover" source={require('../assets/legal.png')} style={{ height: 20, width: 20 }} />}
                onPress={() => {
                    navigation.navigate("UpdateCertificateStack",{screen:"UpdateCertificateServiceList"})
                }}
            />}
            <DrawerItem
                style={{ marginTop: user?.user_role == role.customer?-185:0 }}
                // style={{ marginTop: -155 }}
                label="Legal"
                labelStyle={{
                    fontFamily: LS_FONTS.PoppinsMedium,
                    fontSize: 14,
                    color: LS_COLORS.global.darkBlack,
                }}
                icon={({ focused, color }) => <Image resizeMode="cover" source={require('../assets/legal.png')} style={{ height: 20, width: 20 }} />}
                onPress={() => null}
            />
            <View style={{ width: '84%', alignSelf: 'flex-end' }}>
                <DrawerItem
                    label="Terms & Conditions"
                    labelStyle={{
                        fontFamily: LS_FONTS.PoppinsMedium,
                        fontSize: 11,
                        color: LS_COLORS.global.darkBlack,
                        marginLeft: -20
                    }}
                    icon={({ focused, color }) => <Image resizeMode="contain" source={require('../assets/termsIcon.png')} style={{ height: 15, width: 15 }} />}
                    onPress={() => { props.navigation.toggleDrawer(), props.setTermsVisible(true) }}
                />
                <DrawerItem
                    label="Copyright"
                    labelStyle={{
                        fontFamily: LS_FONTS.PoppinsMedium,
                        fontSize: 11,
                        color: LS_COLORS.global.darkBlack,
                        marginLeft: -20
                    }}
                    icon={({ focused, color }) => <Image resizeMode="contain" source={require('../assets/copyIcon.png')} style={{ height: 15, width: 15 }} />}
                    onPress={() => { props.navigation.toggleDrawer(), props.setCopyVisible(true) }}
                />
                <DrawerItem
                    label="Privacy Policy"
                    labelStyle={{
                        fontFamily: LS_FONTS.PoppinsMedium,
                        fontSize: 11,
                        color: LS_COLORS.global.darkBlack,
                        marginLeft: -20
                    }}
                    icon={({ focused, color }) => <Image resizeMode="contain" source={require('../assets/privacyIcon.png')} style={{ height: 15, width: 15 }} />}
                    onPress={() => { props.navigation.toggleDrawer(), props.setPrivacyVisible(true) }}
                />
                <DrawerItem
                    label="Software license"
                    labelStyle={{
                        fontFamily: LS_FONTS.PoppinsMedium,
                        fontSize: 11,
                        color: LS_COLORS.global.darkBlack,
                        marginLeft: -20
                    }}
                    icon={({ focused, color }) => <Image resizeMode="contain" source={require('../assets/licenceIcon.png')} style={{ height: 15, width: 15 }} />}
                    onPress={() => { props.navigation.toggleDrawer(), props.setSoftwareVisible(true) }}
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
        <Text>WORK IN PROGRESS</Text>

    </View>
}