import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Icon from 'react-native-vector-icons/Ionicons';
import * as firebase from 'firebase';

export default class HeaderScreen extends React.Component{

  state = {
    email: "",
    displayName: ""
  }

  componentDidMount() {
    const { email, displayName } = firebase.auth().currentUser;
    this.setState({email, displayName});
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

  handleLogout = () => {
    firebase.auth().signOut();
  };

  render(){
    return(
      <View>
        <View style={styles.header}>
          <Text style={{fontSize:20, fontWeight:'bold', letterSpacing: 2, color: 'white'}}>Hi, {this.state.displayName}</Text>


          <Menu
            ref={this.setMenuRef}
            button={<Text onPress={this.showMenu}>
            <Icon name='ios-more' size={30} color='white'/>
            </Text>}
          >
              <MenuItem onPress={this.hideMenu}>Profile</MenuItem>
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
