import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import UpdateCertificateServiceList from '../screens/nonAuth/updateCertificateServiceList';
import UpdateCertificates from "../screens/nonAuth/updateCertificates";
const Stack=createStackNavigator()

export default function UpdateCertificateStack(){
    return(
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen component={UpdateCertificates} name="UpdateCertificates" />
            <Stack.Screen component={UpdateCertificateServiceList} name="UpdateCertificateServiceList" />
        </Stack.Navigator>
    )
}