import React, {Component, Fragment} from 'react';
import {AsyncStorage} from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  TouchableHighlight,
} from 'react-native';

import firebase from 'firebase';
import {Database} from '../../Configs/Firechat';

import {GiftedChat, Bubble, Composer, Send} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';

export default class SetChatScreen extends Component {

  state = {
    message: '',
    messageList: [],
    person: this.props.navigation.getParam('item'),
    status:''
  };


  onSend = async () => {
    if (this.state.message.length > 0) {
      let msgId = Database
        .ref('messages')
        .child(this.state.userId)
        .child(this.state.person.id)
        .push().key;
      let updates = {};
      let message = {
        _id: msgId,
        text: this.state.message,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        user: {
          _id: this.state.userId,
          name: this.state.userName,
          avatar: this.state.userAvatar,
        },
      };
      updates[
        'messages/' +
          this.state.userId +
          '/' +
          this.state.person.id +
          '/' +
          msgId
      ] = message;
      updates[
        'messages/' +
          this.state.person.id +
          '/' +
          this.state.userId +
          '/' +
          msgId
      ] = message;
      Database
        .ref()
        .update(updates);
      this.setState({message: ''});
    }
  };

  componentDidMount = async () => {
    const userId = await AsyncStorage.getItem('userid');
    const userName = await AsyncStorage.getItem('user.name');
    const userAvatar = await AsyncStorage.getItem('user.photo');
    this.setState({userId, userName, userAvatar});
    console.log(this.state.person.photo);
    Database
      .ref('messages')
      .child(this.state.userId)
      .child(this.state.person.id)
      .on('child_added', val => {
        this.setState(previousState => ({
          messageList: GiftedChat.append(previousState.messageList, val.val()),
        }));
      });
  };

  renderBubble(props) {
   return (
     <Bubble
       {...props}
       wrapperStyle={{
         right: {
           backgroundColor: '#694be2',
           borderTopLeftRadius:7,
           borderTopRightRadius:7,
           borderBottomRightRadius:7,
           borderBottomLeftRadius:0,
         },
         left: {
           borderTopLeftRadius:7,
           borderTopRightRadius:7,
           borderBottomRightRadius:7,
           borderBottomLeftRadius:0,
         },
       }}
     />
   );
 }

  renderSend(props) {
    return (
      <Send {...props}>
        <View
          style={{
            width: 54,
            height: 44,
            borderTopLeftRadius:25,
            borderBottomLeftRadius:25,
            marginBottom:0,
            marginHorizontal: 5,
            backgroundColor:'#694be2',
            justifyContent:'center',
            alignItems:'center'
          }}>
          <Icon name={'ios-send'} size={28} color={'white'}/>
        </View>
      </Send>
    );
  }

  render() {
    return (
      <Fragment>
        <View style={styles.header}>
          <>
            <View style={styles.img}>
              <Image source={{uri: this.state.person.photo}} style={styles.photo} />
            </View>
            <View style={{marginLeft: 5}}>
              <Text style={styles.heading}>{this.state.person.name}</Text>
              {this.state.person.status == 'Online' ? (
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <Icon name={'ios-disc'} size={10} color={'green'}/>
                  <Text style={styles.off}>{this.state.person.status}</Text>
                </View>
              ) : (
                <View style={{flexDirection:'row',  alignItems:'center'}}>
                  <Icon name={'ios-disc'} size={10} color={'#C0392B'}/>
                  <Text style={styles.off}>{this.state.person.status}</Text>
                </View>
              )}
            </View>
          </>
        </View>

        <GiftedChat
          renderBubble={this.renderBubble}
          renderSend={this.renderSend}
          text={this.state.message}
          onInputTextChanged={val => {
            this.setState({message: val});
          }}
          messages={this.state.messageList}
          onSend={() => this.onSend()}
          user={{
            _id: this.state.userId,
          }}
        />
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  photo: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  img: {
    backgroundColor: 'silver',
    width: 41,
    height: 41,
    borderRadius: 50,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  heading: {
    color: 'white',
    fontSize: 21,
    fontWeight: '700',
    width: 'auto',
  },
  header: {
    backgroundColor: '#694be2',
    height: 70,
    width: '100%',
    paddingHorizontal: 12,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  off:{
    fontWeight: '200',
    color: 'whitesmoke',
    fontSize: 13,
    paddingLeft: 5
  },
});
