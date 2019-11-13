import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import MainNavigation from './src/Navigations/MainNavigation'

export default class App extends React.Component {
  render() {
    return (
      <>
        <StatusBar backgroundColor='#694be2' />
        <MainNavigation />
      </>
    )
  }
}
