import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import ChatScreen from '../Screens/Main/ChatScreen';
import MapsScreen from '../Screens/Main/MapsScreen';
import ProfileScreen from '../Screens/Main/ProfileScreen';

const AppStack = createMaterialTopTabNavigator ({
    Chat : ChatScreen,
    Maps : MapsScreen,
    Friend : ProfileScreen,
  },
  {
    initialRouteName: 'Chat',
    tabBarOptions: {
      activeTintColor: '#FFB20A',
      inactiveTintColor: '#F9F3EC',
      showIcon:true,
      showLabel:true,
      style: {
          backgroundColor:'#694be2'
      },
      labelStyle: {
        textAlign: 'center',
        fontWeight:'bold',
        fontSize: 17
      },
      indicatorStyle: {
        borderBottomColor: '#FFB20A',
        borderBottomWidth: 4,
      },
    },
  }
)

const HeaderRouter = createSwitchNavigator (
  {
    App: AppStack,
  },
  {
    initialRouteName: 'App',
    headerMode: 'none',
  },
)

export default createAppContainer(HeaderRouter);
