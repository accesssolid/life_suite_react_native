import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import UpdateQuestionaireServiceList from '../screens/nonAuth/updateQuestionaireServiceList';
import UpdateQ from '../screens/nonAuth/updateQuestionaireServiceList/updateQ';

const Stack=createStackNavigator()

export default function UpdateCertificateStack(){
    return(
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen component={UpdateQ} name="UpdateQ" />
            <Stack.Screen component={UpdateQuestionaireServiceList} name="UpdateQServiceList" />
        </Stack.Navigator>
    )
}