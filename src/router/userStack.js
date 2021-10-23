import React, { useState } from 'react';

/* Packages */
import { createStackNavigator } from '@react-navigation/stack';

/* Screens */
import HomeScreen from '../screens/nonAuth/homeScreen';
import SubServices from '../screens/nonAuth/subServices';
import Automative from '../screens/nonAuth/automative';
import Events from '../screens/nonAuth/events';
import PersonalCare from '../screens/nonAuth/personalCare';
import Profile from '../screens/nonAuth/profile';
import ServicesProvided from '../screens/nonAuth/servicesProvided';
import ServiceProfile from '../screens/nonAuth/serviceProfile';
import Calendar from '../screens/nonAuth/calendar';
import MechanicLocation from '../screens/nonAuth/mechanicLocation';
import OrderHistory from '../screens/nonAuth/orderHistory';
import Mechanics from '../screens/nonAuth/mechanics';
import Client from '../screens/nonAuth/client';
import InProgress from '../screens/nonAuth/inProgress';
import SuspendInProgress from '../screens/nonAuth/suspendInProgress';
import UpcomingOrder from '../screens/nonAuth/upcomingOrder';
import CancelConfirmation from '../screens/nonAuth/cancelConfirmation';
import Search from '../screens/nonAuth/search';
import Settings from '../screens/nonAuth/settings';
import ConfirmSetPassCode from '../screens/nonAuth/confirmSetPassCode';
import SetPassCode from '../screens/nonAuth/setPassCode';
import SelectLocation from '../screens/nonAuth/selectLocation';
import MapScreen from '../screens/nonAuth/map';
import ChatScreen from '../screens/nonAuth/chatScreen';
import CustomWebView from '../screens/nonAuth/CustomWebView'
import CardList from '../screens/nonAuth/cardlist';
import AddCard from '../screens/nonAuth/addCard'
import OrderDetailCustomer from '../screens/nonAuth/orderDetailCustomer';
import OrderSuspend from '../screens/nonAuth/orderSuspend'
const Stack = createStackNavigator();

const UserStack = () => {
    return (
        <Stack.Navigator headerMode={'none'}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="SubServices" component={SubServices} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="ServiceProfile" component={ServiceProfile} />
            <Stack.Screen name="ServicesProvided" component={ServicesProvided} />
            <Stack.Screen name="Calendar" component={Calendar} />
            <Stack.Screen name="MechanicLocation" component={MechanicLocation} />
            <Stack.Screen name="OrderHistory" component={OrderHistory} />
            <Stack.Screen name="Mechanics" component={Mechanics} />
            <Stack.Screen name="Client" component={Client} />
            <Stack.Screen name="InProgress" component={InProgress} />
            <Stack.Screen name="SuspendInProgress" component={SuspendInProgress} />
            <Stack.Screen name="UpcomingOrder" component={UpcomingOrder} />
            <Stack.Screen name="CancelConfirmation" component={CancelConfirmation} />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="SetPassCode" component={SetPassCode} />
            <Stack.Screen name="ConfirmSetPassCode" component={ConfirmSetPassCode} />
            <Stack.Screen name="MapScreen" component={MapScreen} />
            <Stack.Screen name="CustomWebView" component={CustomWebView} />
            <Stack.Screen name="CardList" component={CardList} />
            <Stack.Screen name="AddCard" component={AddCard} />
            <Stack.Screen name="OrderDetailCustomer" component={OrderDetailCustomer} />
            <Stack.Screen name="OrderSuspend" component={OrderSuspend} />
        </Stack.Navigator>
    )
}

export default UserStack;

