import React, { useState } from 'react';

/* Packages */
import { createDrawerNavigator, DrawerItemList, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

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
import CopyRightModal from '../components/copyrightModal';
import SoftwareModal from '../components/softwareModal';
import AboutUs from '../screens/nonAuth/aboutUs';
import { Header } from 'react-native/Libraries/NewAppScreen';
import { useNavigation } from '@react-navigation/core';

const Drawer = createDrawerNavigator();

const MainDrawer = (props) => {
    const user = useSelector(state => state.authenticate.user)
    const [termsVisible, setTermsVisible] = useState(false)
    const [privacyVisible, setPrivacyVisible] = useState(false)
    const [copyVisible, setCopyVisible] = useState(false)
    const [softwareVisible, setSoftwareVisible] = useState(false)
    const navigation = useNavigation()

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
                    // component={user.user_role == 2 ? OrderHistory : OrderHistory1}
                    component={OrderHistory}
                    options={{
                        drawerIcon: ({ focused, color }) => <Image resizeMode="contain" source={require('../assets/note.png')} style={{ height: 20, width: 20 }} />,
                    }}
                />
                <Drawer.Screen
                    name="Messages"
                    component={Test}
                    options={{
                        drawerIcon: ({ focused, color }) => <Image resizeMode="contain" source={require('../assets/message.png')} style={{ height: 20, width: 20 }} />,
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
                    component={user.user_role == 2 ? UserStack : ProviderStack}
                    options={{
                        drawerIcon: ({ focused, color }) => null,
                        drawerLabel: ({ focused, color }) => null,
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
        </>
    )
}

export default MainDrawer;

const CustomDrawerContent = (props) => {
    const navigation = useNavigation()
    return (
        <DrawerContentScrollView {...props}>
            <View style={{ height: Dimensions.get('screen').height / 7, padding: '7%' }}>
                <Image source={require('../assets/splash/logo.png')} resizeMode={"contain"} style={{ height: '100%', width: '100%' }} />
            </View>
            <DrawerItemList {...props} />
            <DrawerItem
                style={{ marginTop: -25 }}
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
    return <View style={{ flex: 1, alignItems: 'center',justifyContent:"center" }}>
        <TouchableOpacity onPress = {() => navigation.goBack()} style = {{position:"absolute",top:30,left:20}}> 
            <Image 
            source = {require('../assets/back.png')}/>
        </TouchableOpacity>
        <Text>WORK IN PROGRESS</Text>

    </View>
}