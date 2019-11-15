import React from 'react';
import { View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  AsyncStorage,

  StyleSheet,
  SafeAreaView,
} from 'react-native';

import {Database, Auth} from '../../Configs/Firechat';
import Icon from 'react-native-vector-icons/Ionicons'

export default class ProfileScreen extends React.Component {

  state = {
    userList: [],
    refreshing: false,
    uid: '',
    city:''
  };

  componentDidMount = async () => {
    const uid = await AsyncStorage.getItem('userid');
    this.setState({uid: uid, refreshing: true});
    await Database.ref('/user').on('child_added', data => {
      let person = data.val();
      if (person.id != uid) {
        this.setState(prevData => {
          return {userList: [...prevData.userList, person]};
        });
        this.setState({refreshing: false});
      }
    });

    console.log('asd',item.latitude);

    fetch('https://us1.locationiq.com/v1/reverse.php?key=d17151587b1e23&lat=' + this.state.person.latitude + '&lon=' + this.state.person.longitude + '&format=json')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({city: responseJson.address.state_district})
          // console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson));
    });
  };

  renderItem = ({item}) => {
    return (
      <View style={{marginHorizontal: 20}}>
        <TouchableOpacity
          onPress={() => this.props.screenProps.content.navigate('SetFriend',{item})}>
          <View style={styles.row}>
            <Image source={{uri: item.photo}} style={styles.pic} />
            <View>
              <View style={styles.nameContainer}>
                <Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail">
                  {item.name}
                </Text>
                <Icon name={'ios-arrow-dropright-circle'} size={25} color={'#694be2'}/>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        {item.status == 'Offline' ? (
        <View style={{position:'absolute', paddingTop: 15, paddingLeft: 10}}>
          <Icon name={'ios-disc'} size={18} color={'#C0392B'}/>
        </View>
        ) : (
          <View style={{position:'absolute', paddingTop: 15, paddingLeft: 10}}>
            <Icon name={'ios-disc'} size={18} color={'green'}/>
          </View>
        )}
      </View>
    );
  };

  render(){
    return (
      <>
      <SafeAreaView>
        {this.state.refreshing === true ? (
          <ActivityIndicator
            size="large"
            color="#05A0E4"
            style={{marginTop: 150}}
          />
        ) : (
          <FlatList
            data={this.state.userList}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </SafeAreaView>
      </>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#DCDCDC',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    padding: 10,
    paddingTop: 15
  },
  pic: {
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280,
  },
  nameTxt: {
    marginLeft: 15,
    fontWeight: '600',
    color: '#222',
    fontSize: 18,
    width: 170,
  },
  status: {
    fontWeight: '200',
    color: '#ccc',
    fontSize: 13,
  },
  on:{
    fontWeight: '200',
    color: 'green',
    fontSize: 13,
  },
  off:{
    fontWeight: '200',
    color: 'red',
    fontSize: 13,
  },
  msgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  email: {
    fontWeight: '400',
    color: '#008B8B',
    fontSize: 12,
    marginLeft: 15,
  },
});
