import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import AppNavigation from '../Navigations/AppNavigation'
import HeaderScreen from './Main/HeaderScreen'

export default class AppScreen extends React.Component {
  render() {
    return (
      <>
        <HeaderScreen navigation={this.props.navigation}/>
        <AppNavigation screenProps={{content: this.props.navigation}}/>
      </>
    )
  }
}
