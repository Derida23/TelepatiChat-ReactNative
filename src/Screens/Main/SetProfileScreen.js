import React from 'react';
import { View,
  Text,
  Image
} from 'react-native';

import take from '../../Assets/Images/take.jpg'
import Icon from 'react-native-vector-icons/Ionicons'

import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';

export default class SetProfileScreen extends React.Component {

  state = {
   userId: null,
  };

  componentDidMount = async () => {
    const userId = await AsyncStorage.getItem('userid');
    const userName = await AsyncStorage.getItem('user.name');
    const userAvatar = await AsyncStorage.getItem('user.photo');
    const userEmail = await AsyncStorage.getItem('user.email');
    this.setState({userId, userName, userAvatar, userEmail});
  };

  render(){
    return (
      <>
        <View style={{height:270}}>
          <Image source={{uri: this.state.userAvatar}}
            style={{height: 270,}}
          />
        </View>
        <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal:28, marginTop:45}} >
          <View>
            <Text style={{fontSize:16, color:'grey', letterSpacing:2}}>Full Name</Text>
            <Text style={{fontSize:23, fontWeight:'500', letterSpacing:1, color:'#404040'}}>{this.state.userName}</Text>
          </View>
          <View style={{justifyContent:'center'}}>
            <Icon name={'md-create'} size={18} color={'#404040'}/>
          </View>
        </View>

        <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal:28, marginTop:30}} >
          <View>
            <Text style={{fontSize:16, color:'grey', letterSpacing:2}}>Email</Text>
            <Text style={{fontSize:23, fontWeight:'500', letterSpacing:1, color:'#404040'}}>{this.state.userEmail}</Text>
          </View>
          <View style={{justifyContent:'center'}}>
            <Icon name={'md-create'} size={18} color={'#404040'}/>
          </View>
        </View>

        <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal:28, marginTop:30}} >
          <View>
            <Text style={{fontSize:16, color:'grey', letterSpacing:2}}>Location</Text>
            <Text style={{fontSize:23, fontWeight:'500', letterSpacing:1, color:'#404040'}}>Yogyakarta</Text>
          </View>
          <View style={{justifyContent:'center'}}>
            <Icon name={'md-navigate'} size={18} color={'#404040'}/>
          </View>
        </View>
        <Image source={take}
          style={{borderWidth: 3, borderColor: 'white', width: 55, height: 55, borderRadius:100, position: 'absolute', right: 20, top: 242}}
        />
      </>
    );
  }
};
