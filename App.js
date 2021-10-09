import React, { useEffect } from 'react';
import { Platform, StatusBar, LogBox } from 'react-native'

/* Packages */
import { Provider as StoreProvider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Root } from 'native-base';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import messaging from '@react-native-firebase/messaging';

/* Constants */
import LS_COLORS from './src/constants/colors';

/* Redux Store */
import store from './src/redux/store';

/* Root Navigator */
import Router from './src/router';
import UpdateOrder from './src/screens/nonAuth/updateOrder';

const App = () => {
  LogBox.ignoreAllLogs();

  // function for getting noti token from #liahs
  const getToken = async () => {
    try{
      let gg = await messaging().getToken()
      console.log(gg, "Token")
    }catch(err){
      
    }
    
  }

  useEffect(() => {
    // getToken()
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (Platform.OS == 'android') {
        PushNotification.createChannel(
          {
            channelId: "channel-id", // (required)
            channelName: "My channel", // (required)

          },
          (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
        PushNotification.localNotification({

          channelId: "channel-id", // (required) channelId, if the channel doesn't exist, notification will not trigger.
          title: remoteMessage.notification.title, // (optional)
          message: remoteMessage.notification.body, // (required)

        });
      }

    })

    messaging().onMessage(async remoteMessage => {
      if (Platform.OS == 'ios') {
        PushNotificationIOS.addNotificationRequest({
          id: 'test',
          title: remoteMessage.notification.title,

          body: remoteMessage.notification.body,

        });
      }

    })
  }, []);

  return (
    <Root>
      <StoreProvider store={store}>
        <StatusBar backgroundColor={LS_COLORS.global.cyan} barStyle="dark-content" />
        <SafeAreaProvider>
          <Router />
        </SafeAreaProvider>
      </StoreProvider>
    </Root>
  );
};

export default App;