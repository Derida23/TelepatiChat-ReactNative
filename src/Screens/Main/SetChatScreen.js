import React, {Component} from 'react';
import {AsyncStorage} from 'react-native';
// import styles from '../constant/styles';
import firebase from 'firebase';
import {GiftedChat} from 'react-native-gifted-chat';
import {Database} from '../../Configs/Firechat';

export default class SetChatScreen extends Component {

  state = {
    message: '',
    messageList: [],
    person: this.props.navigation.getParam('item'),
  };


  onSend = async () => {
    if (this.state.message.length > 0) {
      let msgId = firebase
        .database()
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
      firebase
        .database()
        .ref()
        .update(updates);
      this.setState({message: ''});
    }
  };

  componentDidMount = async () => {
    console.log('props',this.props.navigation.getParam('item', {}));
    const userId = await AsyncStorage.getItem('userid');
    const userName = await AsyncStorage.getItem('user.name');
    const userAvatar = await AsyncStorage.getItem('user.photo');
    this.setState({userId, userName, userAvatar});
    firebase
      .database()
      .ref('messages')
      .child(this.state.userId)
      .child(this.state.person.id)
      .on('child_added', val => {
        this.setState(previousState => ({
          messageList: GiftedChat.append(previousState.messageList, val.val()),
        }));
      });
  };
  render() {
    return (
      <GiftedChat
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
    );
  }
}
