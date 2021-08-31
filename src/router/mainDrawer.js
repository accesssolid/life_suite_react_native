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
import { Dimensions, Image, Text } from 'react-native';
import Profile from '../screens/nonAuth/profile';
import { SafeAreaView } from 'react-native-safe-area-context';
import OrderHistory from '../screens/nonAuth/orderHistory';
import OrderHistory1 from '../screens/nonAuth/orderHistory1';
import Favourites from '../screens/nonAuth/favourites';
import TermsModal from '../components/termsModal';

const Drawer = createDrawerNavigator();

const MainDrawer = () => {
    const user = useSelector(state => state.authenticate.user)
    const [termsVisible, setTermsVisible] = useState(false)

    return (
        <>
            <Drawer.Navigator
                drawerContent={(props) => <CustomDrawerContent {...props} setTermsVisible={setTermsVisible} />}
                drawerStyle={{
                    width: Dimensions.get('screen').width / 1.3
                }}
                initialRouteName="Home"
                screenOptions={{
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
                    name="Home"
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
        </>
    )
}

export default MainDrawer;

const CustomDrawerContent = (props) => {
    return (
        <DrawerContentScrollView {...props}>
            <View style={{ height: Dimensions.get('screen').height / 7, padding: '7%' }}>
                <Image source={require('../assets/splash/logo.png')} resizeMode={"contain"} style={{ height: '100%', width: '100%' }} />
            </View>
            <DrawerItemList {...props} />
            <DrawerItem
                style={{ marginTop: '-10%' }}
                label="Legal"
                labelStyle={{
                    fontFamily: LS_FONTS.PoppinsMedium,
                    fontSize: 14,
                    color: LS_COLORS.global.darkBlack,
                }}
                icon={({ focused, color }) => <Image resizeMode="contain" source={require('../assets/legal.png')} style={{ height: 15, width: 15 }} />}
                onPress={() => null}
            />
            <View style={{ width: '84%', alignSelf: 'flex-end' }}>
                <DrawerItem
                    label="Terms & Conditions"
                    labelStyle={{
                        fontFamily: LS_FONTS.PoppinsMedium,
                        fontSize: 11,
                        color: LS_COLORS.global.darkBlack,
                        marginLeft: '-15%'
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
                        marginLeft: '-15%'
                    }}
                    icon={({ focused, color }) => <Image resizeMode="contain" source={require('../assets/copyIcon.png')} style={{ height: 15, width: 15 }} />}
                    onPress={() => props.navigation.toggleDrawer()}
                />
                <DrawerItem
                    label="Privacy Policy"
                    labelStyle={{
                        fontFamily: LS_FONTS.PoppinsMedium,
                        fontSize: 11,
                        color: LS_COLORS.global.darkBlack,
                        marginLeft: '-15%'
                    }}
                    icon={({ focused, color }) => <Image resizeMode="contain" source={require('../assets/privacyIcon.png')} style={{ height: 15, width: 15 }} />}
                    onPress={() => props.navigation.toggleDrawer()}
                />
                <DrawerItem
                    label="Software license"
                    labelStyle={{
                        fontFamily: LS_FONTS.PoppinsMedium,
                        fontSize: 11,
                        color: LS_COLORS.global.darkBlack,
                        marginLeft: '-15%'
                    }}
                    icon={({ focused, color }) => <Image resizeMode="contain" source={require('../assets/licenceIcon.png')} style={{ height: 15, width: 15 }} />}
                    onPress={() => props.navigation.toggleDrawer()}
                />
            </View>
        </DrawerContentScrollView>
    )
}

const Test = () => {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>WORK IN PROGRESS</Text>
    </View>
}