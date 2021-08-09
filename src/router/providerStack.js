import React, { useState } from 'react';

/* Packages */
import { createStackNavigator } from '@react-navigation/stack';

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

const Stack = createStackNavigator();

const ProviderStack = () => {
    return (
        <Stack.Navigator headerMode={'none'}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="CnfSch" component={CnfSch} />
            <Stack.Screen name="DeclineConfirmation" component={DeclineConfirmation} />
            <Stack.Screen name="OrderHistory1" component={OrderHistory1} />
            <Stack.Screen name="ServicesProvided" component={ServicesProvided} />
            <Stack.Screen name="ServiceProfile" component={ServiceProfile} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="SubServices" component={SubServices} />
            <Stack.Screen name="AddLicense" component={AddLicense} />
            <Stack.Screen name="Search" component={Search} />
        </Stack.Navigator>
    )
}

export default ProviderStack;

