import React from 'react';
import { View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
 Platform,
 PermissionsAndroid,
 ToastAndroid,
} from 'react-native';

import {Database, Auth} from '../Configs/Firechat';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';

import bgImage from '../Assets/Images/bgImage.jpg'
import loadingLogo from '../Assets/Images/TeleScreen.png'

export default class LoginScreen extends React.Component{

  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      email: '',
      password: '',
      errorMessage: null,
    };
  }

// GET LOCATION //
  componentDidMount = async () => {
    this._isMounted = true;
    await this.getLocation();
  };

  componentWillUnmount() {
    this._isMounted = false;
    Geolocation.clearWatch();
    Geolocation.stopObserving();
  }

  inputHandler = (name, value) => {
    this.setState(() => ({[name]: value}));
  };

// GET LOCATION PERMISSIONS //
  hasLocationPermission = async () => {
    if (
      Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)
    ) {
      return true;
    }
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location Permission Denied By User.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location Permission Revoked By User.',
        ToastAndroid.LONG,
      );
    }
    return false;
  };

// SET LOCATION //
  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) {
      return;
    }

    this.setState({loading: true}, () => {
      Geolocation.getCurrentPosition(
        position => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            loading: false,
          });
        },
        error => {
          this.setState({errorMessage: error});
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 8000,
          distanceFilter: 50,
          forceRequestLocation: true,
        },
      );
    });
  };

  handleChange = key => val => {
    this.setState({[key]: val});
  };

  handleLogin = async () => {
    const {email, password} = this.state;
    if (email.length < 6) {
      ToastAndroid.show(
        'Please input a valid email address',
        ToastAndroid.LONG,
      );
    } else if (password.length < 6) {
      ToastAndroid.show(
        'Password must be at least 6 characters',
        ToastAndroid.LONG,
      );
    } else {
      Database.ref('user/')
        .orderByChild('/email')
        .equalTo(email)
        .once('value', result => {
          let data = result.val();
          if (data !== null) {
            let user = Object.values(data);

            AsyncStorage.setItem('user.email', user[0].email);
            AsyncStorage.setItem('user.name', user[0].name);
            AsyncStorage.setItem('user.photo', user[0].photo);
          }
        });

      Auth.signInWithEmailAndPassword(email, password)
        .then(async response => {
          Database.ref('/user/' + response.user.uid).update({
            status: 'Online',
            latitude: this.state.latitude || null,
            longitude: this.state.longitude || null,
          });

          ToastAndroid.show('Login success', ToastAndroid.LONG);
          await AsyncStorage.setItem('userid', response.user.uid);
          await AsyncStorage.setItem('user', JSON.stringify(response.user));
        })
        .catch(error => {
          console.warn(error);
          this.setState({
            errorMessage: error.message,
          });
          ToastAndroid.show(this.state.errorMessage, ToastAndroid.LONG);
        });
    }
  };

  render(){
    return (
      <>
        <ImageBackground source={bgImage} style={styles.backgroundContainer}>
        <Image source={loadingLogo} style={{width:120, height: 120}}/>

      {/*READY lOGIN*/}
        <Text style={styles.welcome}>Can't Talk, Telepati Now</Text>

      {/*READY FORM INPUT*/}
        <Text style={{marginBottom:40, fontSize:20, fontWeight:'bold', color:"#694be2"}}>LOGIN</Text>
          <View style={styles.form}>
            <View>
              <Text style={styles.inputTitle}> Email Address </Text>
              <TextInput
                style={styles.input}
                autoCapitalize='none'
                onChangeText={this.handleChange('email')}
              >
              </TextInput>
            </View>

            <View style={{marginTop: 22}}>
              <Text style={styles.inputTitle}> Password </Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                autoCapitalize='none'
                onChangeText={this.handleChange('password')}
                value={this.state.password}
              >
              </TextInput>
            </View>
          </View>

      {/*READY BUTTON SUBMIT*/}
          <View style={styles.errorMessage}>
          </View>

          <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
            <Text style={{color:'#FFF', fontWeight:'400'}}> Sign in </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Register")}
            style={{alignSelf: 'center', marginTop:22}}
          >
            <Text style={{color: '#414959', fontSize: 13}}>
              New to Telepati Chat? <Text style={{color: '#694be2', fontWeight: '500'}}>Register Now</Text>
            </Text>
          </TouchableOpacity>
        </ImageBackground>
      </>
    );
  }
};

const styles = StyleSheet.create({
  backgroundContainer:{
    flex: 1,
    width: null,
    height: null,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome:{
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    color:'#FFF',
    marginTop:2,
    marginBottom: 120
  },
  errorMessage:{
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30
  },
  error: {
    color: '#E9446A',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center'
  },
  form: {
    marginHorizontal: 30,
  },
  inputTitle: {
    color: '#8A8F9E',
    fontSize: 10,
    textTransform: 'uppercase'
  },
  input: {
    borderBottomColor: '#694be2',
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    width:300,
    fontSize: 15,
    color: '#694be2'
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: '#694be2',
    borderRadius: 4,
    height: 52,
    width:300,
    alignItems: 'center',
    justifyContent:'center'
  }
})
