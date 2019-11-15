import React from 'react';
import { View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  ToastAndroid,
  PermissionsAndroid,
  Platform
} from 'react-native';

import {Database, Auth} from '../Configs/Firechat';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';

import bgImage from '../Assets/Images/bgImage.jpg'
import loadingLogo from '../Assets/Images/TeleScreen.png'

export default class RegisterScreen extends React.Component{

  constructor(props) {
   super(props);
   this.state = {
     isVisible: false,
     name: '',
     email: '',
     password: '',
     latitude: null,
     longitude: null,
     errorMessage: null,
     loading: false,
     updatesEnabled: false,
   };
 }

 // GET LOCATION //

  componentDidMount = async () => {
   await this.getLocation();
  };

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
          console.warn(position);
        },
        error => {
          this.setState({errorMessage: error, loading: false});
          console.warn(error);
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

// POST SIGNUP //
  inputHandler = (name, value) => {
    this.setState(() => ({[name]: value}));
  };

  handleRegister = () => {
    const {email, name, password} = this.state;
    if (name.length < 1) {
      ToastAndroid.show('Please input your fullname', ToastAndroid.LONG);
    } else if (email.length < 6) {
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
      Auth.createUserWithEmailAndPassword(email, password)
        .then(response => {
          response.user.updateProfile({
          displayName: this.state.name
          })
          Database.ref('/user/' + response.user.uid)
            .set({
              name: this.state.name,
              status: 'Offline',
              email: this.state.email,
              photo: 'https://atasouthport.com/wp-content/uploads/2017/04/default-image.jpg',
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              id: response.user.uid,
            })
            .catch(error => {
              ToastAndroid.show(error.message, ToastAndroid.LONG);
              this.setState({
                name: '',
                email: '',
                password: '',
              });
            });
            ToastAndroid.show ('Your account is successfully registered!', ToastAndroid.LONG,);
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
            AsyncStorage.setItem('userid', response.user.uid);
            AsyncStorage.setItem('user',JSON.stringify(response.user));

        })
        .catch(error => {
          this.setState({
            errorMessage: error.message,
            name: '',
            email: '',
            password: '',
          });
          ToastAndroid.show(this.state.errorMessage.message, ToastAndroid.LONG);
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
          <View style={styles.form}>
            <View>
              <Text style={styles.inputTitle}> Full Name </Text>
              <TextInput
                style={styles.input}
                autoCapitalize='none'
                onChangeText={txt => this.inputHandler('name', txt)}
              >
              </TextInput>
            </View>

            <View style={{marginTop: 22}}>
              <Text style={styles.inputTitle}> Email Address </Text>
              <TextInput
                style={styles.input}
                autoCapitalize='none'
                onChangeText={txt => this.inputHandler('email', txt)}
              >
              </TextInput>
            </View>

            <View style={{marginTop: 22}}>
              <Text style={styles.inputTitle}> Password </Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                autoCapitalize='none'
                onChangeText={txt => this.inputHandler('password', txt)}
                value={this.state.password}
              >
              </TextInput>
            </View>
          </View>

      {/*READY BUTTON SUBMIT*/}
          <View style={styles.errorMessage}>
          </View>

          <TouchableOpacity style={styles.button} onPress={this.handleRegister}>
            <Text style={{color:'#FFF', fontWeight:'400'}}> Create Account </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Login")}
            style={{alignSelf: 'center', marginTop:22}}
          >
            <Text style={{color: '#414959', fontSize: 13}}>
              Already Have a Account? <Text style={{color: '#694be2', fontWeight: '500'}}>Login Now</Text>
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
