import React from 'react';
import {
  AsyncStorage,
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { Camera, Permissions } from 'expo';
import UploaderService from '../UploaderService';

export default class CameraView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPermission: null,
    };
  }

  async onPress() {
    const token = AsyncStorage.getItem('accessToken');
    const uploader = new UploaderService(token);
    let photo = await this.camera.takePictureAsync({ base64: true });
    let data = await uploader.upload(photo.base64, photo.uri);
    console.log(data);
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasPermission: status === 'granted' });
  }

  render() {
    const hasPermission = this.state.hasPermission;
    if (hasPermission === null) {
      return <View />;
    } else if (!hasPermission) {
      return <Text>Permission to camera denied!</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            type={Camera.Constants.Type.back}
            style={{ flex: 1 }}
            ref={ref => { this.camera = ref }}
          >
            <View style={styles.cameraOverlay}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={() => this.onPress()}
              >
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  cameraOverlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  captureButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    width: 80,
    height: 80,
    borderRadius: 100,
    borderWidth: 10,
    borderColor: 'white',
  },
});
