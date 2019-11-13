import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image
} from 'react-native';

import * as firebase from 'firebase'
import loadingLogo from '../Assets/Images/TeleScreen.png'

class LoadingScreen extends React.Component {

  componentDidMount() {
    setTimeout(() => {
      firebase.auth().onAuthStateChanged(user => {
        this.props.navigation.navigate(user ? "App" : "Auth")
      });
    }, 2500)
  }

  render(){
    return (
      <>
        <View style={styles.container}>
          <Image source={loadingLogo} style={{width:120, height: 120}}/>
        </View>
      </>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#694be2'
  }
})

export default LoadingScreen;
