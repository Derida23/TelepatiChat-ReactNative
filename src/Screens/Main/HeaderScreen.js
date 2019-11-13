import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  ToastAndroid,
  BackHandler
} from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Icon from 'react-native-vector-icons/Ionicons';

import {Database, Auth} from '../../Configs/Firechat';
import AsyncStorage from '@react-native-community/async-storage';

export default class HeaderScreen extends React.Component{

  constructor(props) {
    super(props)
      this.state = {
        userId: null,
      }
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

// {/* BACK HANDLER */}
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  componentDidMount = async () => {
    const userId = await AsyncStorage.getItem('userid');
    const userName = await AsyncStorage.getItem('user.name');
    this.setState({userId, userName});
  };

// {/* REACT MATERIAL MENU */}
  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

  handleLogout = async () => {
    await AsyncStorage.getItem('userid')
      .then(async userid => {
        Database.ref('user/' + userid).update({status: 'Offline'});
        await AsyncStorage.clear();
        Auth.signOut();
        ToastAndroid.show('Logout success', ToastAndroid.LONG);
      })
      .catch(error => this.setState({errorMessage: error.message}));
  };

// {/* NAVIGATE TO MY PROFILE */}
  toSetProfile = () => {
    this.props.navigation.push('SetProfile');
    this._menu.hide();
  };

  render(){
    return(
      <View>
        <View style={styles.header}>
          <Text style={{fontSize:20, fontWeight:'bold', letterSpacing: 2, color: 'white'}}>Hi, {this.state.userName}</Text>


          <Menu
            ref={this.setMenuRef}
            button={<Text onPress={this.showMenu}>
            <Icon name='ios-more' size={30} color='white'/>
            </Text>}
          >
              <MenuItem onPress={this.toSetProfile}>Profile</MenuItem>
              <MenuItem onPress={this.handleLogout}>Logout</MenuItem>
          </Menu>

        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
      flex: 1,
  },
  header:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#694be2',
      paddingHorizontal: 32,
      paddingTop: 15,
  }
});
