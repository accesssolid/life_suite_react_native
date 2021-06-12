import React from 'react';
import { StatusBar } from 'react-native'

/* Packages */
import { Provider as StoreProvider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/* Constants */
import LS_COLORS from './src/constants/colors';

/* Redux Store */
import store from './src/redux/store'

/* Root Navigator */
import Router from './src/router';

const App = () => {
  return (
    <StoreProvider store={store}>
      <StatusBar backgroundColor={LS_COLORS.global.cyan} barStyle="dark-content" />
      <SafeAreaProvider>
        <Router />
      </SafeAreaProvider>
    </StoreProvider>
  );
};

export default App;
