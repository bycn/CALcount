import React from 'react';
import Expo from 'expo';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Button
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

  async onLogout() {
    await AsyncStorage.removeItem('accessToken');
    this.setState({ loggedIn: false, token: null });
  }

  async authWithGoogleAsync() {
    try {
      const result = await Expo.Google.logInAsync({
        iosClientId: '8901212433-1p726ntk73dqrsc2lob5926ajp6ebb14.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });

      console.log(result);

      if (result.type === 'success') {
        return { success: true, token: result.idToken };
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
        <Button style={{
          borderRadius: 10,
          backgroundColor: 'green',
          width: '80%'
        }} title="Continue"
          onPress={() => this.onPress()} />
        {loggedIn ?
        <Button style={{
          backgroundColor: 'red',
          width: '80%'
        }} onPress={() => this.onLogout()}
          title="Logout"
          color="red"/> :
        <TouchableOpacity style={{
          borderRadius: 10,
          backgroundColor: 'blue',
          width: '80%',
          borderRadius: 10,
          borderWidth: 1,
          paddingTop: 10,
          paddingBottom: 10,
          borderColor: 'white'
        }} onPress={() => this.onLogin()}>
          <Text style={{color: 'white', fontSize: 20, textAlign: 'center'}}>
            Login with Google
          </Text>
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
