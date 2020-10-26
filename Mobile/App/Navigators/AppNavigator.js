import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import {Colors} from '../Theme';
import {
  IconNow,
  IconTrending,
  IconCreatePost,
  IconFunction,
  IconProfile,
} from '../Components';
import {Screens} from '../Utils/screens';
import NowScreen from '../Containers/Now/NowScreen';
import SurveyResultScreen from '../Containers/Now/SurveyResultScreen';
import ExploreScreen from '../Containers/Explore/ExploreScreen';
import PostDetailScreen from '../Containers/Now/PostDetailScreen';
import MenuPostScreen from '../Containers/CreatePost/MenuPostScreen';
import CreatePostScreen from '../Containers/CreatePost/Post/CreatePostScreen';
import MediaSelectScreen from '../Containers/CreatePost/PhotoAlbum/MediaSelectScreen';
import PhotoAlbumScreen from '../Containers/CreatePost/PhotoAlbum/PhotoAlbumScreen';
import CreateAlbumScreen from '../Containers/CreatePost/PhotoAlbum/CreateAlbumScreen';
import PreviewAlbumScreen from '../Containers/CreatePost/PhotoAlbum/PreviewAlbumScreen';
import SelectAlbumScreen from '../Containers/CreatePost/PhotoAlbum/SelectAlbumScreen';
import CreateSurveyScreen from '../Containers/CreatePost/Survey/CreateSurveyScreen';
import ProfileScreen from '../Containers/Profile/ProfileScreen';
import LoginScreen from '../Containers/Login/LoginScreen';
import RegisterScreen from '../Containers/Login/RegisterScreen';
import ResetPasswordScreen from '../Containers/Login/ResetPasswordScreen';
import TeamProfilelScreen from '../Containers/Function/TeamProfileScreen';
import TeamProfileDetailScreen from '../Containers/Function/TeamProfileDetailScreen';
import FuntionScreen from '../Containers/Function/FuntionScreen';
import Invite from '../Containers/Invite/InviteScreen';
import InviteEmail from '../Containers/Invite/InviteEmail';
import SettingScreen from '../Containers/Profile/SettingScreen';
import GeneralScreen from '../Containers/Profile/GeneralScreen';
import MemberListScreen from '../Containers/Function/MemberListScreen';
import EditProfileScreen from '../Containers/Profile/EditProfileScreen';
import SwitchTeamScreen from '../Containers/Function/SwitchTeamScreen';
import CreateTeamScreen from '../Containers/Function/CreateTeamScreen';
import ScanQRCode from '../Containers/Function/ScanQRCode';
import ProfileMemberScreen from '../Containers/Profile/ProfileMemberScreen';
import FollowingScreen from '../Containers/Profile/FollowingScreen';
import FolderScreen from '../Containers/Folder/FolderScreen';
import FolderDetailScreen from '../Containers/Folder/FolderDetailScreen';
import ChangePasswordScreen from '../Containers/Profile/ChangePasswordScreen';
import NotificationScreen from '../Containers/Profile/NotificationScreen';
import AccountingScreen from '../Containers/Accounting/AccountingScreen';
import AccountingDetailScreen from '../Containers/Accounting/AccountingDeatailScreen';
import AccountingCreateNewScreen from '../Containers/Accounting/AccountingCreateNewScreen';
import TodoListScreen from '../Containers/TodoList/TodoListScreen';
import TodoListDetailScreen from '../Containers/TodoList/TodoListDetailScreen';
import TodoListParentDetailScreen from '../Containers/TodoList/TodoListParentDetailScreen';
import UpgradeTeamScreen from '../Containers/Payment/UpgradeTeamScreen';
import ChatScreen from '../Containers/Chat/ChatScreen';
import NewMessageScreen from '../Containers/Chat/NewMessageScreen';
import MyFolderScreen from '../Containers/Folder/MyFolderScreen';
import MyFolderDetailScreen from '../Containers/Folder/MyFolderDetailScreen';
import ChatDetailScreen from '../Containers/Chat/ChatDetailScreen';
/**
 * The root screen contains the application's navigation.
 *
 * @see https://reactnavigation.org/docs/en/hello-react-navigation.html#creating-a-stack-navigator
 */
const defaultNavigationOptions = {
  headerShown: false,
};

const NowStackNavigator = createStackNavigator(
  {
    // The main application screen is our "WelcomeScreen". Feel free to replace it with your
    // own screen and remove the example.
    [Screens.NOW]: NowScreen,
    [Screens.POST_DETAIL]: PostDetailScreen,
    [Screens.CREATE_POST]: CreatePostScreen,
    [Screens.PREVIEW_ALBUM]: PreviewAlbumScreen,
    [Screens.PHOTO_ALBUM]: PhotoAlbumScreen,
    [Screens.MEDIA_SELECT]: MediaSelectScreen,
    [Screens.SURVEY_RESULT]: SurveyResultScreen,
    [Screens.CREATE_SURVEY]: CreateSurveyScreen,
  },
  {
    initialRouteName: Screens.NOW,
    defaultNavigationOptions,
  },
);

const ExploreStackNavigator = createStackNavigator(
  {
    // The main application screen is our "WelcomeScreen". Feel free to replace it with your
    // own screen and remove the example.
    [Screens.EXPLORE]: ExploreScreen,
    [Screens.POST_DETAIL]: PostDetailScreen,
  },
  {
    initialRouteName: Screens.EXPLORE,
    defaultNavigationOptions,
  },
);

const CreatePostStackNavigator = createStackNavigator(
  {
    // The main application screen is our "WelcomeScreen". Feel free to replace it with your
    // own screen and remove the example.
    [Screens.MENU_POST]: MenuPostScreen,
    [Screens.CREATE_POST]: CreatePostScreen,
    [Screens.MEDIA_SELECT]: MediaSelectScreen,
    [Screens.PHOTO_ALBUM]: PhotoAlbumScreen,
    [Screens.SELECT_ALBUM]: SelectAlbumScreen,
    [Screens.CREATE_ALBUM]: CreateAlbumScreen,
    [Screens.PREVIEW_ALBUM]: PreviewAlbumScreen,
    [Screens.CREATE_SURVEY]: CreateSurveyScreen,
  },
  {
    initialRouteName: Screens.MENU_POST,
    defaultNavigationOptions,
  },
);

const FunctionStackNavigator = createStackNavigator(
  {
    // The main application screen is our "WelcomeScreen". Feel free to replace it with your
    // own screen and remove the example.
    [Screens.FUNCTION]: FuntionScreen,
  },
  {
    initialRouteName: Screens.FUNCTION,
    defaultNavigationOptions,
  },
);

const ProfileStackNavigator = createStackNavigator(
  {
    // The main application screen is our "WelcomeScreen". Feel free to replace it with your
    // own screen and remove the example.
    [Screens.PROFILE]: ProfileScreen,
    [Screens.POST_DETAIL]: PostDetailScreen,
  },
  {
    initialRouteName: Screens.PROFILE,
    defaultNavigationOptions,
  },
);

const bottomTabNavigator = createBottomTabNavigator(
  {
    [Screens.NOW]: {
      screen: NowStackNavigator,
      navigationOptions: {
        tabBarIcon: ({focused}) => {
          return <IconNow focused={focused} />;
        },
      },
    },
    [Screens.EXPLORE]: {
      screen: ExploreStackNavigator,
      navigationOptions: {
        tabBarIcon: ({focused}) => {
          return <IconTrending focused={focused} />;
        },
      },
    },
    [Screens.MENU_POST]: {
      screen: CreatePostStackNavigator,
      navigationOptions: {
        tabBarIcon: ({focused}) => {
          return <IconCreatePost focused={focused} />;
        },
      },
    },
    [Screens.FUNCTION]: {
      screen: FunctionStackNavigator,
      navigationOptions: {
        tabBarIcon: ({focused}) => {
          return <IconFunction focused={focused} />;
        },
      },
    },
    [Screens.PROFILE]: {
      screen: ProfileStackNavigator,
      navigationOptions: {
        tabBarIcon: ({}) => {
          return <IconProfile />;
        },
        tabBarOptions: {
          activeBackgroundColor: Colors.primary,
          activeTintColor: Colors.white,
          showLabel: false,
        },
      },
    },
  },
  {
    // defaultNavigationOptions: ({ navigation }) => {},
    tabBarOptions: {
      activeTintColor: Colors.green,
      inactiveTintColor: Colors.gray,
      height: 120,
      showLabel: false,
    },
  },
);

const rootStackNavigator = createStackNavigator(
  {
    // The main application screen is our "WelcomeScreen". Feel free to replace it with your
    // own screen and remove the example.
    [Screens.NOW]: bottomTabNavigator,
    [Screens.LOGIN]: {
      screen: LoginScreen,
      navigationOptions: {
        gestureEnabled: false,
      },
    },
    [Screens.REGISTER]: RegisterScreen,
    [Screens.RESET_PASSWORD]: ResetPasswordScreen,
    [Screens.TEAM_PROFILE_DETAIL]: TeamProfileDetailScreen,
    [Screens.TEAM_PROFILE]: TeamProfilelScreen,
    [Screens.INVITE]: Invite,
    [Screens.INVITE_EMAIL]: InviteEmail,
    [Screens.SETTING]: SettingScreen,
    [Screens.GENERAL]: GeneralScreen,
    [Screens.MEMBER_LIST]: MemberListScreen,
    [Screens.EDIT_PROFILE]: EditProfileScreen,
    [Screens.SWITCH_TEAM]: SwitchTeamScreen,
    [Screens.CREATE_TEAM]: CreateTeamScreen,
    [Screens.SCAN_QR_CODE]: ScanQRCode,
    [Screens.PROFILE_MEMBER]: ProfileMemberScreen,
    [Screens.FOLLOWING]: FollowingScreen,
    [Screens.FOLDER]: FolderScreen,
    [Screens.FOLDER_DETAIL]: FolderDetailScreen,
    [Screens.CHANGE_PASSWORD]: ChangePasswordScreen,
    [Screens.NOTIFICATION]: NotificationScreen,
    [Screens.ACCOUNTING]: AccountingScreen,
    [Screens.ACCOUNTING_DETAIL]: AccountingDetailScreen,
    [Screens.ACCOUNTING_CREATE_NEW]: AccountingCreateNewScreen,
    [Screens.TODO_LIST]: TodoListScreen,
    [Screens.TODO_LIST_DETAIL]: TodoListDetailScreen,
    [Screens.TODO_LIST_PARENT_DETAIL]: TodoListParentDetailScreen,
    [Screens.UPGRADE_TEAM]: UpgradeTeamScreen,
    [Screens.CHAT_SCREEN]: ChatScreen,
    [Screens.NEW_MESSAGE]: NewMessageScreen,
    [Screens.MY_FOLDER]: MyFolderScreen,
    [Screens.MY_FOLDER_DETAIL]: MyFolderDetailScreen,
    [Screens.CHAT_DETAIL]: ChatDetailScreen,
  },
  {
    initialRouteName: Screens.NOW,
    defaultNavigationOptions,
  },
);

export default createAppContainer(rootStackNavigator);
