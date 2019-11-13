import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, Image } from 'react-native';
import * as firebase from 'firebase'

import firebaseSet from '../Configs/firebase';
import bgImage from '../Assets/Images/bgImage.jpg'
import loadingLogo from '../Assets/Images/TeleScreen.png'

export default class LoginScreen extends React.Component{

  state = {
    email:"",
    password:"",
    errorMessage:null
  };

  handleLogin = () => {
    const {email, password} = this.state;

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => this.setState({errorMessage: error.message}))
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
                onChangeText={email => this.setState({email})}
                value={this.state.email}
              >
              </TextInput>
            </View>

            <View style={{marginTop: 22}}>
              <Text style={styles.inputTitle}> Password </Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                autoCapitalize='none'
                onChangeText={password => this.setState({password})}
                value={this.state.password}
              >
              </TextInput>
            </View>
          </View>

      {/*READY BUTTON SUBMIT*/}
          <View style={styles.errorMessage}>
            {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
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
