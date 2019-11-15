import React from 'react';
import { View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Image
} from 'react-native';

import * as firebase from 'firebase';
import Icon from 'react-native-vector-icons/Ionicons'
import iconChat from '../../Assets/Images/chat-tele.jpg'

export default class SetFriend extends React.Component {
  constructor(props) {
    super(props)
      this.state = {
        person: props.navigation.getParam('item'),
        items: props.navigation.getParam('item'),
        userId: null,
        city:''
      }
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount(){
    fetch('https://us1.locationiq.com/v1/reverse.php?key=d17151587b1e23&lat=' + this.state.person.latitude + '&lon=' + this.state.person.longitude + '&format=json')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({city: responseJson.address.state_district})
          // console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson));
    })
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

  render(){
    return (
      <>
        <View>
          <View style={{height:270}}>
            <Image source={{uri: this.state.person.photo}}
              style={{height: 270,}}
            />

          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal:28, marginTop:45}} >
            <View>
              <Text style={{fontSize:16, color:'grey', letterSpacing:2}}>Full Name</Text>
              <Text style={{fontSize:23, fontWeight:'500', letterSpacing:1, color:'#404040'}}>{this.state.person.name}</Text>
            </View>
            <View style={{justifyContent:'center'}}>
                <Icon name={'ios-person'} size={18} color={'#404040'}/>
            </View>
          </View>

          <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal:28, marginTop:30}} >
            <View>
              <Text style={{fontSize:16, color:'grey', letterSpacing:2}}>Email</Text>
              <Text style={{fontSize:23, fontWeight:'500', letterSpacing:1, color:'#404040'}}>{this.state.person.email}</Text>
            </View>
            <View style={{justifyContent:'center'}}>
              <Icon name={'ios-mail-unread'} size={18} color={'#404040'}/>
            </View>
          </View>

          <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal:28, marginTop:30}} >
            <View>
              <Text style={{fontSize:16, color:'green', letterSpacing:2}}>Location</Text>
              <Text style={{fontSize:23, fontWeight:'500', letterSpacing:1, color:'#404040'}}>{this.state.city}</Text>
            </View>
            <View style={{justifyContent:'center'}}>
              <Icon name={'md-locate'} size={18} color={'#404040'}/>
            </View>
          </View>
        </View>
        <TouchableOpacity style={{width: 55, height: 55, borderRadius:100, position: 'absolute', right: "5%", top: "31%"}}
          onPress={() =>
            this.props.navigation.navigate('SetChat', {
              item: this.state.person,
            })}
        >
          <Image source={iconChat}
            style={{borderWidth: 3, borderColor: 'white', width: 55, height: 55, borderRadius:100}}
          />
        </TouchableOpacity>
        {this.state.person.status == 'Online' ? (
          <View style={{backgroundColor:'rgba(255, 255, 255, 0.8)', flexDirection:'row', alignItems:'center', borderRadius:10, marginLeft:9, position: 'absolute', right: '67%', top: '31%'}}>
            <Icon style={{paddingLeft:10}} name={'ios-disc'} size={10} color={'gren'}/>
            <Text style={{paddingLeft:5, paddingRight:10}}>Status : {this.state.person.status}</Text>
          </View>
        ) : (
          <View style={{backgroundColor:'rgba(255, 255, 255, 0.8)', flexDirection:'row', alignItems:'center', borderRadius:10, marginLeft:9, position: 'absolute', right: '67%', top: '31%'}}>
            <Icon style={{paddingLeft:10}} name={'ios-disc'} size={10} color={'red'}/>
            <Text style={{paddingLeft:5, paddingRight:10}}>Status : {this.state.person.status}</Text>
          </View>
        )}
      </>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
