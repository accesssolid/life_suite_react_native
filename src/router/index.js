import React, { useState } from 'react';

/* Packages */
import { createStackNavigator } from '@react-navigation/stack';

/* Components */
import Loader from '../components/loader';

/* Methods */
import { useSelector } from 'react-redux';

/* Screens */
import Splash from '../screens/splash';
import Welcomescreen from '../screens/auth/welcomeScreen';
import AuthStack from './authStack';
import UserStack from './userStack';
import ProviderStack from './providerStack';
import Passcode from '../screens/nonAuth/passCode';
import MainDrawer from './mainDrawer';
import ChatScreen from '../screens/nonAuth/chatScreen';
import ChatMembers from '../screens/nonAuth/chatMembers';
import OrderHistoryCustomer from '../screens/nonAuth/orderHistoryCustomer'
import OrderHistoryProvider from '../screens/nonAuth/orderHistoryProvider'

const Stack = createStackNavigator();

const Router = () => {
  const loading = useSelector(state => state.authenticate.loading)

  return (
    <>
     
        <Stack.Navigator headerMode={'none'}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="WelcomeScreen" component={Welcomescreen} />
          <Stack.Screen name="AuthStack" component={AuthStack} />
          <Stack.Screen name="UserStack" component={UserStack} />
          <Stack.Screen name="ProviderStack" component={ProviderStack} />
          <Stack.Screen name="Passcode" component={Passcode} />
          <Stack.Screen name="MainDrawer" component={MainDrawer} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="ChatMembers" component={ChatMembers} />
          <Stack.Screen name="OrderHistoryCustomer" component={OrderHistoryCustomer} />
          <Stack.Screen name="OrderHistoryProvider" component={OrderHistoryProvider} />
        </Stack.Navigator>
     
      {loading && <Loader />}
    </>
  )
}

export default Router;

