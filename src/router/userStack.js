import React, { useState } from 'react';

/* Packages */
import { createStackNavigator } from '@react-navigation/stack';

/* Screens */
import HomeScreen from '../screens/nonAuth/homeScreen';
import HomeServices from '../screens/nonAuth/homeServices';
import Automative from '../screens/nonAuth/automative';
import Events from '../screens/nonAuth/events';
import PersonalCare from '../screens/nonAuth/personalCare';
import Profile from '../screens/nonAuth/profile';
import MechanicServicesProvided from '../screens/nonAuth/mechanicServicesProvided';
import ServiceProfile from '../screens/nonAuth/serviceProfile';
import Calendar from '../screens/nonAuth/calendar';
import MechanicLocation from '../screens/nonAuth/mechanicLocation';
import OrderHistory from '../screens/nonAuth/orderHistory';
import Mechanics from '../screens/nonAuth/mechanics';
import Client from '../screens/nonAuth/client';
import InProgress from '../screens/nonAuth/inProgress';

const Stack = createStackNavigator();

const UserStack = () => {
    return (
        <Stack.Navigator headerMode={'none'}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="HomeServices" component={HomeServices} />
            <Stack.Screen name="Automative" component={Automative} />
            <Stack.Screen name="Events" component={Events} />
            <Stack.Screen name="PersonalCare" component={PersonalCare} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="ServiceProfile" component={ServiceProfile} />
            <Stack.Screen name="MechanicServicesProvided" component={MechanicServicesProvided} />
            <Stack.Screen name="Calendar" component={Calendar} />
            <Stack.Screen name="MechanicLocation" component={MechanicLocation} />
            <Stack.Screen name="OrderHistory" component={OrderHistory} />
            <Stack.Screen name="Mechanics" component={Mechanics} />
            <Stack.Screen name="Client" component={Client} />
            <Stack.Screen name="InProgress" component={InProgress} />
        </Stack.Navigator>
    )
}

export default UserStack;

