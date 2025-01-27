import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, Text, Platform} from 'react-native';

/* Constants */
import LS_COLORS from '../../constants/colors';

/* Packages */
import {useDispatch, useSelector} from 'react-redux';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';

/* Methods */
import {retrieveItem, showToast} from '../../components/validators';
import {loginReducer, setAuthToken} from '../../redux/features/loginReducer';
import {getApi} from '../../api/api';
import {getJsonData, storeJsonData} from '../../asyncStorage/async';
import {
  StackActions,
  NavigationActions,
  CommonActions,
} from '@react-navigation/native';
import {role} from '../../constants/globals';
import messaging from '@react-native-firebase/messaging';
const Splash = props => {
  const dispatch = useDispatch();
  const access_token = useSelector(state => state.authenticate.access_token);
  const user = useSelector(state => state.authenticate.user);

  useEffect(() => {
    BiometricsAuth();
  }, []);

  useEffect(() => {
    if (access_token !== null) {
      getUser(user.id);
    }
  }, [access_token]);

  React.useEffect(() => {}, []);

  const getUser = id => {
    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    };
    let user_data = {
      user_id: id,
    };
    let config = {
      headers: headers,
      data: JSON.stringify(user_data),
      endPoint:
        user.user_role == role.customer
          ? '/api/customer_detail'
          : '/api/provider_detail',
      type: 'post',
    };

    console.log('Config', config);

    getApi(config)
      .then(response => {
        if (response.status == true) {
          dispatch(loginReducer(response.data));
          setTimeout(() => {
            props.navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{name: 'MainDrawer'}],
              }),
            );
          }, 2000);
        } else {
          // props.navigation.navigate('WelcomeScreen')
          if (response.message !== 'The user id field is required.') {
          }
          setLoader(false);
        }
      })
      .catch(err => {
        // props.navigation.navigate('WelcomeScreen')
      });
  };

  const checkAuth = () => {
    retrieveItem('user').then(data => {
      if (data) {
        dispatch(loginReducer(data));
        retrieveItem('access_token').then(res => {
          dispatch(setAuthToken({data: res}));
        });
      } else {
        setTimeout(() => {
          props.navigation.navigate('WelcomeScreen');
        }, 2000);
      }
    });
  };

  const BiometricsAuth = async () => {
    const pass = await getJsonData('passcode');
    console.log(pass, 'pass===>>>>');
    const bioVerification = await getJsonData('fingerPrintVerification');

    console.log(bioVerification, 'bioVerification===>>>>');

    if (pass) {
      const rnBiometrics = new ReactNativeBiometrics();

      rnBiometrics.isSensorAvailable().then(async resultObject => {
        console.log(resultObject, 'resultObject==>>>');
        const {available, biometryType} = resultObject;

        if (Platform.OS === 'ios') {
          console.log('yess111==>>>>');

          if (bioVerification) {
            if (biometryType === BiometryTypes.TouchID) {
              rnBiometrics.simplePrompt({
                promptMessage: 'Confirm fingerprint',
              })
                .then(resultObject => {
                  const {success} = resultObject;
                  if (success) {
                    checkAuth();
                  } else {
                    setTimeout(() => {
                      props.navigation.navigate('Passcode');
                    }, 1000);
                  }
                })
                .catch(() => {
                  setTimeout(() => {
                    props.navigation.navigate('Passcode');
                  }, 1000);
                });
            } else if (biometryType === BiometryTypes.FaceID) {
              rnBiometrics.simplePrompt({
                promptMessage: 'Confirm face',
              })
                .then(resultObject => {
                  const {success} = resultObject;
                  if (success) {
                    checkAuth();
                  } else {
                    setTimeout(() => {
                      props.navigation.navigate('Passcode');
                    }, 1000);
                  }
                })
                .catch(() => {
                  setTimeout(() => {
                    props.navigation.navigate('Passcode');
                  }, 1000);
                });
            } else {
              setTimeout(() => {
                props.navigation.navigate('Passcode');
              }, 1000);
            }
          } else {
            setTimeout(() => {
              props.navigation.navigate('Passcode');
            }, 1000);
          }
        } else {
          console.log('yess==>>>>');

          if (bioVerification) {
          console.log(bioVerification,"bioVerification==>>>:::");

            if (biometryType === BiometryTypes.Biometrics) {
              console.log("(((((");
              rnBiometrics.simplePrompt({
                promptMessage: 'Confirm fingerprint',
              })
                .then(resultObject => {
                  const {success} = resultObject;
                  if (success) {
                    checkAuth();
                  } else {
                    setTimeout(() => {
                      props.navigation.navigate('Passcode');
                    }, 1000);
                  }
                })
                .catch(() => {
                  setTimeout(() => {
                    props.navigation.navigate('Passcode');
                  }, 1000);
                });
            } else {
              setTimeout(() => {
                props.navigation.navigate('Passcode');
              }, 1000);
            }
          } else {
            setTimeout(() => {
              props.navigation.navigate('Passcode');
            }, 1000);
          }
        }
      });
    } else {
      setTimeout(async () => {
        checkAuth();
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          resizeMode="contain"
          style={styles.image}
          source={require('../../assets/splash/life.png')}
        />
      </View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LS_COLORS.global.white,
  },
  logoContainer: {
    width: '80%',
    height: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
