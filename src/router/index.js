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
import OrderHistory from '../screens/nonAuth/orderHistory';

const Stack = createStackNavigator();

const Router = () => {
  const loading = useSelector(state => state.authenticate.loading)

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator headerMode={'none'}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="OrderHistory" component={OrderHistory} />     
        </Stack.Navigator>
      </NavigationContainer>
      {loading && <Loader />}
    </>
  )
}

export default Router;

