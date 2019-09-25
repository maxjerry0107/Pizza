import React, { Component } from "react";
import PropTypes from "prop-types";
import { requireNativeComponent } from "react-native";
import {
  Platform,
  StyleSheet,
  View,
  StatusBar,
  PermissionsAndroid,
} from "react-native";
import Geolocation from '@react-native-community/geolocation';
import Spinner from 'react-native-loading-spinner-overlay';

type Props = {
  origin: {
    lat: number,
    long: number
  },
  destination: {
    lat: number,
    long: number
  },
  style?: Object
};

const MapboxNavigationView = requireNativeComponent(
  "MapboxNavigationView",
  NavigationView
);

export default class NavigationView extends Component<any, Props, any> {

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


  // render() {
  //   return <MapboxNavigationView style={this.props.style} {...this.props} />;
  // }
  render() {
    return (
      <View style={{flex:1, backgroundColor:'#fff'}}>
          <StatusBar hidden />
          <Spinner color={'#000'}
            visible={!this.state.loaded} 
            textContent={'Loading...'}
            textStyle={{color:'#000'}}
          />
          {this.state.granted && this.state.loaded &&(
            <MapboxNavigationView
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


NavigationView.propTypes = {
  origin: PropTypes.shape({
    lat: PropTypes.number,
    long: PropTypes.number
  }).isRequired,
  destination: PropTypes.shape({
    lat: PropTypes.number,
    long: PropTypes.number
  }).isRequired
};
