import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UpdateCertificateServiceList from '../screens/nonAuth/updateCertificateServiceList';
import UpdateCertificates from "../screens/nonAuth/updateCertificates";
const Stack=createNativeStackNavigator()

export default function UpdateCertificateStack(){
    return(
        <Stack.Navigator  screenOptions={{headerShown:false}}>
            <Stack.Screen component={UpdateCertificates} name="UpdateCertificates" />
            <Stack.Screen component={UpdateCertificateServiceList} name="UpdateCertificateServiceList" />
        </Stack.Navigator>
    )
}