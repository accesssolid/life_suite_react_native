import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native'

/* Packages */
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

/* Cnstants */
import LS_COLORS from '../constants/colors';

/* Components */
import Loader from '../components/loader';

/* Methods */
import { useSelector } from 'react-redux';

/* Screens */
import Splash from '../screens/splash';
import Welcomescreen from '../screens/auth/welcomeScreen';
import FaceId from '../screens/auth/faceId';
import TouchId from "../screens/auth/touchId/index"
import LoginScreen from '../screens/auth/loginScreen';
import SignUpScreen from '../screens/auth/signUp';
import HomeScreen from '../screens/nonAuth/homeScreen';
import HomeServices from '../screens/nonAuth/homeServices';
import Automative from '../screens/nonAuth/automative';
import Events from '../screens/nonAuth/events';
import PersonalCare from '../screens/nonAuth/personalCare';
import Profile from '../screens/nonAuth/profile';
import AddJob from '../screens/nonAuth/addJob';
import MechanicServicesProvided from '../screens/nonAuth/mechanicServicesProvided';
import ServiceProfile from '../screens/nonAuth/serviceProfile';
import Calendar from '../screens/nonAuth/calendar';
import MechanicLocation from '../screens/nonAuth/mechanicLocation';
import OrderHistory from '../screens/nonAuth/orderHistory';
import Mechanics from '../screens/nonAuth/mechanics';
import Client from '../screens/nonAuth/client';
import CnfSch from '../screens/nonAuth/cnfSch';
import ServicesProvided from '../screens/nonAuth/servicesOffered';
import DeclineConfirmation from '../screens/nonAuth/declineConfirmation';
import OrderHistory1 from '../screens/nonAuth/orderHistory1';
import VerificationCode from '../screens/auth/verificationScreen';
import OtpScreen from '../screens/nonAuth/otpScreen';

const Stack = createStackNavigator();

const Router = () => {
  const loading = useSelector(state => state.authenticate.loading)
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator headerMode={'none'}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="WelcomeScreen" component={Welcomescreen} />
          <Stack.Screen name="FaceId" component={FaceId} />  
          <Stack.Screen name="TouchId" component={TouchId} />   
          <Stack.Screen name="LoginScreen" component={LoginScreen} />  
          <Stack.Screen name="VerificationCode" component={VerificationCode} /> 
          <Stack.Screen name="OtpScreen" component={OtpScreen} />    
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />   
          <Stack.Screen name="HomeScreen" component={HomeScreen} />  
          <Stack.Screen name="AddJob" component={AddJob} />  
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
          <Stack.Screen name="CnfSch" component={CnfSch} />  
          <Stack.Screen name="ServicesProvided" component={ServicesProvided} /> 
          <Stack.Screen name="DeclineConfirmation" component={DeclineConfirmation} /> 
          <Stack.Screen name="OrderHistory1" component={OrderHistory1} /> 
        </Stack.Navigator>
      </NavigationContainer>
      {loading && <Loader />}
    </>
  )
}

export default Router;

