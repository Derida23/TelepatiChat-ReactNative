import React from 'react';
import { View,
  Text,
  Image,
  ToastAndroid,
  PermissionsAndroid,
  Dimensions,
  TouchableOpacity,
  TextInput,
  BackHandler
} from 'react-native';

import take from '../../Assets/Images/take.jpg'
import Icon from 'react-native-vector-icons/Ionicons'

import { Dialog } from 'react-native-simple-dialogs';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-picker';
import Geocoder from 'react-native-geocoding';

export default class SetProfileScreen extends React.Component {
  constructor(props) {
   super(props)
    this.state = {
      userId: null,
      permissionsGranted: null,
      errorMessage: null,
      loading: false,
      updatesEnabled: false,
      location: [],
      photo: null,
      imageUri: null,
      imgSource: '',
      uploading: false,
      dialogVisible: false,
      city:''
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

    setDialogVisible(visible) {
      this.setState({dialogVisible: visible});
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
      const userAvatar = await AsyncStorage.getItem('user.photo');
      const userEmail = await AsyncStorage.getItem('user.email');
      this.setState({userId, userName, userAvatar, userEmail});

      firebase.database()
      .ref(`/user/${userId}`)
      .on('value', (snapshot) => {
        let data = snapshot.val();
        let location = Object.values(data);
        this.setState({location});
      });

      fetch('https://us1.locationiq.com/v1/reverse.php?key=d17151587b1e23&lat=' + this.state.location[2] + '&lon=' + this.state.location[3] + '&format=json')
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({city: responseJson.address.state_district})
      })

    };

    requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            ])
            return granted === PermissionsAndroid.RESULTS.GRANTED
        } catch (err) {
            console.log(err);
            return false
        }
    }

    changeImage = async type => {
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo',
    };

    let cameraPermission =
      (await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)) &&
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ) &&
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
    if (!cameraPermission) { console.log('camera');
      cameraPermission = await this.requestCameraPermission();
    } else { console.log('image');
      ImagePicker.showImagePicker(options, response => {
        ToastAndroid.show(
          'Rest asure, your photo is flying to the shiny cloud',
          ToastAndroid.LONG,
        );
        let uploadBob = null;
        const imageRef = firebase
          .storage()
          .ref('avatar/' + this.state.userId)
          .child('photo');
        fs.readFile(response.path, 'base64')
          .then(data => {
            return Blob.build(data, {type: `${response.mime};BASE64`});
          })
          .then(blob => {
            uploadBob = blob;
            return imageRef.put(blob, {contentType: `${response.mime}`});
          })
          .then(() => {
            uploadBob.close();
            return imageRef.getDownloadURL();
          })
          .then(url => {
            ToastAndroid.show(
              'Your cool avatar is being uploaded, its going back to your phone now',
              ToastAndroid.LONG,
            );
            firebase
              .database()
              .ref('user/' + this.state.userId)
              .update({photo: url});
            this.setState({userAvatar: url});
            AsyncStorage.setItem('user.photo', this.state.userAvatar);
          })

          .catch(err => console.log(err));
      })
    }
  }

  render(){
    return (
      <>
        <Dialog
          visible={this.state.dialogVisible}
          title="Insert Your Name"
          onTouchOutside={() => this.setState({dialogVisible: false})} >
          <View>
              <TextInput style={{borderBottomColor: '#694be2', borderBottomWidth: 2, height: 40, width:300, fontSize: 15,color: '#694be2'}}
                autoCapitalize='none'
              >
            </TextInput>
          </View>

          <View style={{marginTop: 20, flexDirection:'row'}} >
            <TouchableOpacity onPress={() => {this.setDialogVisible(!this.state.dialogVisible);}}
              style={{width:50, height: 30, borderRadius: 8, borderWidth: 1, borderColor: '#694be2', alignItems:'center', justifyContent:'center'}}>
              <Text style={{fontWeight:'bold'}}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{marginLeft:10,width:50, height: 30, borderRadius: 8, backgroundColor: '#694be2', alignItems:'center', justifyContent:'center'}}>
              <Text style={{fontWeight:'bold', color:'#FFF'}}>Edit</Text>
            </TouchableOpacity>
          </View>
        </Dialog>

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
            <TouchableOpacity
              onPress={() => {
                this.setDialogVisible(true);
              }}
            >
              <Icon name={'md-create'} size={18} color={'#404040'}/>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal:28, marginTop:30}} >
          <View>
            <Text style={{fontSize:16, color:'grey', letterSpacing:2}}>Email</Text>
            <Text style={{fontSize:23, fontWeight:'500', letterSpacing:1, color:'#404040'}}>{this.state.userEmail}</Text>
          </View>
          <View style={{justifyContent:'center'}}>
            <Icon name={'ios-mail-unread'} size={18} color={'#404040'}/>
          </View>
        </View>

        <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal:28, marginTop:30}} >
          <View>
            <Text style={{fontSize:16, color:'grey', letterSpacing:2}}>Location</Text>
            <Text style={{fontSize:23, fontWeight:'500', letterSpacing:1, color:'#404040'}}>{this.state.city}</Text>
          </View>
          <View style={{justifyContent:'center'}}>
            <Icon name={'md-locate'} size={18} color={'#404040'}/>
          </View>
        </View>
        <TouchableOpacity style={{width: 55, height: 55, borderRadius:100, position: 'absolute', right: "5%", top: "31%"}}
          onPress={this.changeImage}
        >
          <Image source={take}
            style={{borderWidth: 3, borderColor: 'white', width: 55, height: 55, borderRadius:100}}
          />
        </TouchableOpacity>
      </>
    );
  }
};
