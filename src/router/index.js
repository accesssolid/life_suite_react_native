import React, { useState } from 'react';

/* Packages */
import { NavigationContainer } from '@react-navigation/native';
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

const Stack = createStackNavigator();

const Router = () => {
  const loading = useSelector(state => state.authenticate.loading)

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator headerMode={'none'}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="WelcomeScreen" component={Welcomescreen} />  
          <Stack.Screen name="AuthStack" component={AuthStack} />
          <Stack.Screen name="UserStack" component={UserStack} />
          <Stack.Screen name="ProviderStack" component={ProviderStack} />
          <Stack.Screen name="Passcode" component={Passcode} />
        </Stack.Navigator>
      </NavigationContainer>
      {loading && <Loader />}
    </>
  )
}

export default Router;

