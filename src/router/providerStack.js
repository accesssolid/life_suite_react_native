import React, { useState } from 'react';

/* Packages */
import { createNativeStackNavigator } from "@react-navigation/native-stack";

/* Screens */
import HomeScreen from '../screens/nonAuth/homeScreen';
import CnfSch from '../screens/nonAuth/cnfSch';
import DeclineConfirmation from '../screens/nonAuth/declineConfirmation';
import OrderHistory1 from '../screens/nonAuth/orderHistory1';
import ServicesProvided from '../screens/nonAuth/servicesOffered';
import ServiceProfile from '../screens/nonAuth/serviceProfile';
import addJob from '../screens/nonAuth/addJob';
import Profile from '../screens/nonAuth/profile';
import SubServices from '../screens/nonAuth/subServices';
import AddLicense from '../screens/nonAuth/addLicense';
import Search from '../screens/nonAuth/search';
import AddTimeFrame from '../screens/nonAuth/addTimeFrame';
import Settings from '../screens/nonAuth/settings';
import SetPassCode from '../screens/nonAuth/setPassCode';
import ConfirmSetPassCode from '../screens/nonAuth/confirmSetPassCode';
import SelectLocation from '../screens/nonAuth/selectLocation';
import MechanicLocation from '../screens/nonAuth/mechanicLocation';
import MapScreen from '../screens/nonAuth/map';
import ChatScreen from '../screens/nonAuth/chatScreen';
import OrderClientDetail from '../screens/nonAuth/orderDetail';
import CustomWebView from '../screens/nonAuth/CustomWebView';
import UpdateOrderItems from '../screens/nonAuth/updateOrderItem';
import AddDiscount from '../screens/nonAuth/addDiscount';
import LocationServiceSelect from '../screens/nonAuth/locationSelect/selectService'
import LocationUpdate from '../screens/nonAuth/locationSelect/location'
import ScheduleTime from '../screens/nonAuth/schedule_time';
import AddTimeFrameForService from '../screens/nonAuth/schedule_time/AddTimeForService';
import DeleteAccount from '../screens/nonAuth/deleteAccount';
const Stack = createNativeStackNavigator();

const ProviderStack = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown:false}} headerMode={'none'}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="DeleteAccount" component={DeleteAccount} />

            <Stack.Screen name="CnfSch" component={CnfSch} />
            <Stack.Screen name="DeclineConfirmation" component={DeclineConfirmation} />
            <Stack.Screen name="OrderHistory1" component={OrderHistory1} />
            <Stack.Screen name="ServicesProvided" component={ServicesProvided} />
            <Stack.Screen name="ServiceProfile" component={ServiceProfile} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="SubServices" component={SubServices} />
            <Stack.Screen name="AddLicense" component={AddLicense} />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="AddTimeFrame" component={AddTimeFrame} />
            <Stack.Screen name="ScheduleTime" component={ScheduleTime} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="SetPassCode" component={SetPassCode} />
            <Stack.Screen name="ConfirmSetPassCode" component={ConfirmSetPassCode} />
            <Stack.Screen name="SelectLocation" component={SelectLocation} />
            {/* <Stack.Screen name="MechanicLocation" component={MechanicLocation} /> */}
            <Stack.Screen name="MapScreen" component={MapScreen} />
            <Stack.Screen name="OrderDetail" component={OrderClientDetail} />
            <Stack.Screen name="CustomWebView" component={CustomWebView} />
            <Stack.Screen name="UpdateOrderItems" component={UpdateOrderItems} />
            <Stack.Screen name="AddDiscount" component={AddDiscount} />
           
            <Stack.Screen name="LocationServiceSelect" component={LocationServiceSelect} />
            <Stack.Screen name="LocationUpdate" component={LocationUpdate} />
            <Stack.Screen name="AddTimeFrameForService" component={AddTimeFrameForService} />
        </Stack.Navigator>
    )
}

export default ProviderStack;

