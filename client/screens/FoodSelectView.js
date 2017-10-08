import React from 'react';
import Expo from 'expo';
import { BlurView } from 'expo';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator,
  Image,
  ListView
} from 'react-native';
import CheckBox from 'react-native-check-box';

export default class FoodSelectView extends React.Component {
  constructor(props) {
    super(props);
    const { uploader, photo } = this.props.navigation.state.params;
    this._ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.checked !== r2.checked
    });

    this.state = {
      photo,
      foods: [],
      uploading: true,
      dataSource: this._ds.cloneWithRows([]),
    };

    this.uploader = uploader;
  }

  async componentDidMount() {
    const uploader = this.uploader;
    const photo = this.state.photo;

    let data = await uploader.upload(photo.base64, photo.uri);
    this.setState({ uploading: false });

    let url = await uploader.getUrl(data);
    let foods = await fetch(
      `https://calorie-counter-182301.appspot.com/food-data?sourceImageUrl=${encodeURIComponent(url)}`
    ).then(response => response.json());

    this.setState({
      foods: foods.map((f) => {
        return { food: f, checked: false }
      }),
      dataSource: this._ds.cloneWithRows(foods)
    });
  }

  render() {
    const { uploading, foods, photo } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {uploading || foods.length == 0 ?
        <View style={{ flex: 1 }}>
          <Image source={{uri: photo.uri}} style={{ flex: 1 }} />
          <BlurView
            tint="dark"
            intensity={70}
            style={StyleSheet.absoluteFill}>
            <View style={{ marginTop: '55%' }}>
            <ActivityIndicator
              animating={true}
              color="white"
              size="large"
            />
            <Text style={{
              fontSize: 36,
              fontWeight: '700',
              color: 'white',
              textAlign: 'center',
            }}>
              {this.state.uploading
                ? "Uploading image..." : "Finding foods..."}
            </Text>
            </View>
          </BlurView>
        </View> :

        <View style={{ flex: 1 }}>
          <Image source={{uri: photo.uri}} style={{ flex: 1 }} />
          <BlurView
            tint="dark"
            intensity={70}
            style={{
              position: 'absolute',
              zIndex: 10,
              bottom: 0,
              width: '100%',
              height: 200
            }}
          >
            <ListView
              dataSource={this.state.dataSource}
              renderRow={(food, sId, rId) => {
                return (<View style={{paddingTop: 30, paddingLeft: 30}}>
                  <CheckBox
                    style={{flex: 1, padding: 10}}
                    onClick={() => {
                      let foods = JSON.parse(JSON.stringify(this.state.foods));
                      foods[rId].checked = !foods[rId].checked;
                      console.log(foods)
                      this.setState({ dataSource: this._ds.cloneWithRows(foods), foods });
                    }}
                    isChecked={this.state.foods[rId].checked}
                    rightText={this.state.foods[rId].food}
                    rightTextStyle={{color: 'white', fontSize: 24}}
                    checkBoxColor="white"
                  />
                </View>);
              }}
            />
          </BlurView>
        </View>}
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
