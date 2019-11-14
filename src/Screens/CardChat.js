import React, {Component, Fragment} from 'react';
import {View, Text, StyleSheet, TouchableHighlight, Image} from 'react-native';

class CardChat extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <Fragment>
        <TouchableHighlight
          underlayColor="whitesmoke"
          onPress={() =>
            this.props.navigation.navigate('Chat', this.props.data)
          }
          style={styles.card}>
          <>
            <View style={styles.img}>
              <View style={styles.avatar}>
                <Image
                  source={{uri: this.props.data.photo}}
                  style={{flex: 1, width: '100%', resizeMode: 'cover'}}
                />
              </View>
            </View>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                width: '78%',
                borderBottomWidth: 1,
                borderColor: 'whitesmoke',
              }}>
              <View style={styles.desc}>
                <Text style={styles.name}>{this.props.data.username}</Text>
                <Text style={styles.msg}>{this.props.data.fullname}</Text>
              </View>
              <View
                style={{
                  width: '20%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {this.props.data.status === 'Online' ? (
                  <Text style={{color: 'green'}}>Online</Text>
                ) : (
                  <Text style={{color: 'silver'}}>Offline</Text>
                )}
              </View>
            </View>
          </>
        </TouchableHighlight>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  msg: {
    color: 'grey',
  },
  name: {
    fontSize: 18,

    fontWeight: '700',
  },
  avatar: {
    backgroundColor: 'silver',
    width: '100%',
    height: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  img: {
    width: 70,
    paddingHorizontal: 7,
    paddingBottom: 12,
    paddingTop: 3,
  },
  desc: {
    width: 'auto',
    marginLeft: 15,
  },
  card: {
    height: 80,
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
});
