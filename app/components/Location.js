// import React, {Component} from 'react';
// import {View,  ImageBackground,StatusBar,Image,TextInput,Text,TouchableOpacity,SafeAreaView, BackHandler} from 'react-native';

// import MapboxGL from '@react-native-mapbox-gl/maps';
// import Geolocation from '@react-native-community/geolocation';
// import MapboxClient from 'mapbox'
// import Spinner from 'react-native-loading-spinner-overlay';

// const destination = {latitude: 26.4910765, longitude: -81.9426475};

// MapboxGL.setAccessToken('pk.eyJ1IjoibWF4amVycnkwMTA3IiwiYSI6ImNqemo3OHBpMDA1OWwzYm9zN3VpM2VucGsifQ.H2gdRfuyHM9_ddrDbwNHzw');

// const mapboxClient = new MapboxClient("pk.eyJ1IjoibWF4amVycnkwMTA3IiwiYSI6ImNqemo3OHBpMDA1OWwzYm9zN3VpM2VucGsifQ.H2gdRfuyHM9_ddrDbwNHzw");


// export default class Location extends Component { 
// constructor (props){
//   super(props);
//   this.state={
//     loading:true,
//     origin:{latitude: 25.4910, longitude: -81.9426},
//     directions:[],
//   };
//   this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
// }

// componentWillUnmount() {
//   BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
// }

// handleBackButtonClick() {
//   this.props.navigation.goBack();
//   return true;
// }

// componentDidMount () {
//   BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
//   Geolocation.getCurrentPosition(async info => {
//     console.log(info);
//     const pos={
//       latitude:info.coords.latitude,
//       longitude:info.coords.longitude
//     };

//     this.setState({origin:pos});

//     console.log(pos);

//     let res = null;
//       try {
//         res = await mapboxClient.getDirections([
//           pos,
//           destination,
//         ]);
//       } catch (e) {
//         console.log(e);
//       }

//       console.log(res);
      
//       if (res !== null) {
//         const directions = res.entity.routes[0];
//         this.setState({ directions: directions });
//         this.setState({loading:false})
//       }
//       console.log(this.state.directions.geometry);
//   });

//   }
  
//     render() {
//       return (
//         <View style={{flex:1}}>
//           <StatusBar hidden />          
//           <ImageBackground source={require('../assets/images/sign/bg.png')} style={{ width: '100%', height: '100%' }}>
//             <SafeAreaView style={{width:'100%', height:100, alignItems:'center', paddingTop:0}}>
//               <Image source={require('../assets/images/menu/menu_header.png')} style={{height:'100%', width:'70%',}} resizeMode={"contain"}></Image>
//             </SafeAreaView>
//             <View style={{flex:1, flexDirection:'column',}}>
//               <Spinner color={'#000'}
//                 visible={this.state.loading} 
//                 textContent={'Loading...'}
//                 textStyle={{color:'#000'}}
//               />
//               {!this.state.loading&&
//                 <MapboxGL.MapView
//                       styleURL={MapboxGL.StyleURL.Street}
//                       zoomEnabled={true}
//                       logoEnabled={false}
//                       compassEnabled={true}
//                       style={{width:'100%', height:'100%'}}>
//                       <MapboxGL.Camera
//                         zoomLevel={15}
//                         centerCoordinate={[this.state.origin.longitude, this.state.origin.latitude]}
//                       />
//                         <MapboxGL.ShapeSource id='mapbox-directions-source' shape={this.state.directions.geometry}>
//                           <MapboxGL.LineLayer
//                             id='mapbox-directions-line'
//                             style={{
//                               lineColor: 'red',
//                               lineCap: MapboxGL.LineJoin.Round,
//                               lineWidth: 3,
//                               lineOpacity: 0.84,}}
//                             />
//                         </MapboxGL.ShapeSource> 
//                   </MapboxGL.MapView>
//                 }
//             </View>
//           </ImageBackground>
//         </View>
//       );
//     }
//   }
  

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  StatusBar,
  PermissionsAndroid,
} from "react-native";
import Geolocation from '@react-native-community/geolocation';
import NavigationView from "./NavigationView";
import Spinner from 'react-native-loading-spinner-overlay';

export default class Location extends Component {
  constructor(props){
    super(props);    
    this.state = {
      granted: Platform.OS === "ios",
      fromLat: 26.4910765,
      fromLong: -81.9426475,
      toLat: 26.4910765,
      toLong: -81.9426475,
      loaded:false,
    };
    Geolocation.getCurrentPosition(info => {
      this.setState({
        fromLat:info.coords.latitude,
        fromLong:info.coords.longitude,
        loaded:true,
      })
    });
    if (!this.state.granted) {
      this.requestFineLocationPermission();
    }
  }

  componentDidMount() {
  }

  async requestFineLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "ACCESS_FINE_LOCATION",
          message: "Mapbox navigation needs ACCESS_FINE_LOCATION"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({ granted: true });
      } else {
        console.log("ACCESS_FINE_LOCATION permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }

  render() {
    return (
      <View style={{flex:1, backgroundColor:'#fff'}}>
          <StatusBar hidden />
          <Spinner color={'#000'}
            visible={this.state.loading} 
            textContent={'Loading...'}
            textStyle={{color:'#000'}}
          />
          {/* <ImageBackground source={require('../assets/images/sign/bg.png')} style={{width:'100%', height:'100%', resizeMode:'repeat'}}>
              <SafeAreaView style={{width:'100%', height:100, alignItems:'center', paddingTop:0, borderBottomWidth:1, borderColor:'#888'}}>
                <Image source={require('../assets/images/menu/menu_header.png')} style={{height:'100%', width:'70%',}} resizeMode={"contain"}></Image>
              </SafeAreaView> */}
              {this.state.granted && this.state.loaded &&(
                <NavigationView
                  style={styles.navigation}
                  destination={{
                    lat: this.state.toLat,
                    long: this.state.toLong
                  }}
                  origin={{
                    lat: this.state.fromLat,
                    long: this.state.fromLong
                  }}
                />
              )}
        {/* </ImageBackground> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: "whitesmoke"
  },
  subcontainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "whitesmoke"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  navigation: {
    backgroundColor: "gainsboro",
    flex: 1
  }
});
