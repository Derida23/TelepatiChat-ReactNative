import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import LoadingScreen from '../Screens/LoadingScreen';
import LoginScreen from '../Screens/LoginScreen';
import RegisterScreen from '../Screens/RegisterScreen';
import AppScreen from '../Screens/AppScreen';
import SetProfileScreen from '../Screens/Main/SetProfileScreen';
import SetChatScreen from '../Screens/Main/SetChatScreen';

const AppStack = createStackNavigator ({
    App : AppScreen,
    SetProfile : SetProfileScreen,
    SetChat: SetChatScreen
  },
  {
    initialRouteName: 'App',
    headerMode: 'none',
  }
)

const AuthStack = createStackNavigator ({
    Login : LoginScreen,
    Register : RegisterScreen
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none',
  }
)

const Router = createSwitchNavigator (
  {
    Loading: LoadingScreen,
    App: AppStack,
    Auth: AuthStack
  },
  {
    initialRouteName: 'Loading',
    headerMode: 'none',
  }
)

export default createAppContainer(Router);
