import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { StackNavigator } from 'react-navigation';

import MainView from './screens/MainView';
import CameraView from './screens/CameraView';

const MainStackNavigator = StackNavigator({
  MainView: {
    screen: MainView,
  },
  CameraView: {
    screen: CameraView,
  }
}, {
    navigationOptions: {
      header: null,
    },
    initialRouteName: 'MainView',
});

export default class App extends React.Component {
  render() {
    return (
      <MainStackNavigator />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
  },
});
