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
  Image
} from 'react-native';

export default class NutrientView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      foods: [],
    };
  }

  async componentWillMount() {
    const { foods } = this.props.navigation.state.params;
    reqs = Promise.all(foods.map((food) => fetch(
      `https://calorie-counter-182301.appspot.com/calorie-details?food=${food}`
    ).then(response => response.json()).catch(err => console.log(err))));

    let details = await reqs;
    console.log(details);
    this.setState({ foods: details });
  }

  render() {
    const { photo } = this.props.navigation.state.params;
    return (<View style={{flex: 1}}>
      <Image source={{uri: photo.uri}} style={{flex: 1}} />
      <BlurView
        tint="dark"
        intensity={70}
        style={StyleSheet.flatten([StyleSheet.absoluteFill, {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }])}
      >
        <Text style={styles.hero}>{
          this.state.foods.map(f => f.name).join(',').split('').map(c => c.toUpperCase()).join('')
        }</Text>
        <Text style={styles.heading}>Calorie Count</Text>
        <Text style={styles.result}>{this.state.foods.reduce((a, b) => {
          return a + parseInt(b.nutrients[1].Energy)
        }, 0)} calories</Text>
        <Text style={styles.heading}>Protein</Text>
        <Text style={styles.result}>{this.state.foods.reduce((a, b) => {
          return a + parseFloat(b.nutrients[3].Protein)
        }, 0)} grams</Text>
        <Text style={styles.heading}>Fat</Text>
        <Text style={styles.result}>{this.state.foods.reduce((a, b) => {
          return a + parseFloat(b.nutrients[4]["Total lipid (fat)"])
        }, 0)} grams</Text>
        <Text style={styles.heading}>Sugars</Text>
        <Text style={styles.result}>{this.state.foods.reduce((a, b) => {
          return a + parseFloat(b.nutrients[8]["Sugars, total"])
        }, 0)} grams</Text>
        <View style={{ marginTop: 50 }}>
          <Text style={styles.hero}>SOURCED ON OPEN DATA FROM</Text>
          <Image source={require('../assets/usda.png')}
            style={{ marginLeft: 'auto', marginRight: 'auto', scale: 0.3 }} />
        </View>
      </BlurView>
    </View>);
  }
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 36,
    fontWeight: '700',
    color: 'white',
    marginTop: 10
  },
  result: {
    fontSize: 24,
    fontWeight: '300',
    color: 'white',
  },
  hero: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  }
});