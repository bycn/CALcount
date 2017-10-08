import React from 'react';
import Expo from 'expo';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';

export default class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: false, token: null };
  }

  onPress() {
    this.props.navigation.navigate('CameraView');
  }

  async componentWillMount() {
    let accessToken = await AsyncStorage.getItem('accessToken');
    if (accessToken !== null) {
      this.setState({ loggedIn: true, token: accessToken });
    }
  }

  async onLogin() {
    let result = await this.authWithGoogleAsync();
    if (result.success) {
      await AsyncStorage.setItem('accessToken', result.token);
      this.setState({
        loggedIn: true,
        token: result.token,
      });
    }
  }

  async authWithGoogleAsync() {
    try {
      const result = await Expo.Google.logInAsync({
        iosClientId: '8901212433-t9ob81muvov2crmk114im7hgaskeha16.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        return { success: true, token: result.accessToken };
      } else {
        return { cancelled: true };
      }
    } catch(e) {
      return { error: true };
    }
  }

  render() {
    const { loggedIn, token } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>
          Welcome to CalCounter
        </Text>
        <TouchableOpacity>
          <Text onPress={() => this.onPress()}>
            Continue
          </Text>
        </TouchableOpacity>
        {loggedIn ? (<Text>{token}</Text>) :
        <TouchableOpacity onPress={() => this.onLogin()}>
          <Text>Login with Google</Text>
        </TouchableOpacity>}
      </View>
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
