import React from 'react';

/* Packages */
import { createStackNavigator } from '@react-navigation/stack';

/* Methods */
import { useSelector } from 'react-redux';

/* Screens */
import LoginScreen from '../screens/auth/loginScreen';
import SignUpScreen from '../screens/auth/signUp';
import VerificationCode from '../screens/auth/verificationScreen';
import OtpScreen from '../screens/nonAuth/otpScreen';
import ResetPassword from '../screens/auth/resetPassword';
import CovidScreen from '../screens/auth/CovidScreen';
import CustomWebView from '../screens/auth/signUp/CustomWebView';
import Welcomescreen from '../screens/auth/welcomeScreen';

const Stack = createStackNavigator();

const AuthStack = () => {
    const loading = useSelector(state => state.authenticate.loading)
    
    return (
        <Stack.Navigator headerMode={'none'}>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="VerificationCode" component={VerificationCode} />
            <Stack.Screen name="OtpScreen" component={OtpScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            <Stack.Screen name="CovidScreen" component={CovidScreen} />
            <Stack.Screen name="CustomWebView" component={CustomWebView} />
        </Stack.Navigator>
    )
}

export default AuthStack;

