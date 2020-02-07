import React, { Component } from "react";
import {
  View,
  ImageBackground,
  StatusBar,
  Image,
  Text,
  BackHandler,
  Alert,
  FlatList,
  TouchableOpacity,
  ScrollView
} from "react-native";
import NavigationService from "../../NavigationService";
import { SafeAreaView } from "react-navigation";
import { Icon } from "native-base";
import axios from "./Axios";
import smoke_api from "./Smoke_Axios";
import Toast from "react-native-root-toast";
import DeviceInfo from "react-native-device-info";
import Spinner from "react-native-loading-spinner-overlay";
import { RFPercentage } from "react-native-responsive-fontsize";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default class MyFavourites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      favourites: [],
      smoke_favourties: [],
      type: 1
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount = () => {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );

    this.getPizzaFavourite();
    this.getSmokeFavourite();
  };

  getSmokeFavourite() {
    this.setState({ loading: true });
    smoke_api
      .get("?req=get-favourites&phonenum=" + global.myphonenumber)
      .then(response => {
        let res = response.data;
        console.log(res);
        if (res.status == true) {
          this.setState({ loading: false, smoke_favourties: res.favourites });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(function(error) {
        this.setState({ loading: false });
      });
  }

  async getPizzaFavourite() {
    this.setState({ loading: true });
    const uniqueId = await DeviceInfo.getUniqueID();
    console.log(uniqueId);
    axios
      .get("?req=get-favourites&phoneid=" + uniqueId)
      .then(response => {
        let res = response.data;
        console.log(res);
        if (res.status == true) {
          this.setState({ loading: false, favourites: res.favourites });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(function(error) {
        this.setState({ loading: false });
      });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    NavigationService.navigate("Intro");
    return true;
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar hidden />
        <Spinner
          color={"#000"}
          visible={this.state.loading}
          textContent={"Loading..."}
          textStyle={{ color: "#000" }}
        />
        <ImageBackground
          source={require("../assets/images/sign/bg.png")}
          style={{ width: "100%", height: "100%", resizeMode: "repeat" }}
        >
          <SafeAreaView style={{ width: "100%", flex: 1, paddingTop: 0 }}>
            <TouchableOpacity
              style={{
                width: "100%",
                height: RFPercentage(10),
                alignItems: "center"
              }}
              activeOpacity={0.8}
              onPress={() => NavigationService.navigate("Intro")}
            >
              <Image
                source={require("../assets/images/menu/menu_header.png")}
                style={{ height: "80%", width: "70%" }}
                resizeMode={"contain"}
              ></Image>
              <Text
                style={{
                  color: "#000",
                  fontSize: RFPercentage(3),
                  position: "absolute",
                  bottom: 0,
                  fontWeight: "bold"
                }}
              >
                My Favorites
              </Text>
            </TouchableOpacity>

            {/* <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', borderTopWidth:1 }}>
                <TouchableOpacity activeOpacity={0.7} onPress={()=>{
                  this.getPizzaFavourite();
                  this.setState({type:1});
                }}>
                  <Text style={[{fontSize:RFPercentage(3), fontWeight:'bold'},this.state.type==1?{color:'#00f'}:{color:'#000'}]} >Pizza</Text>
                </TouchableOpacity>
                {global.myphonenumber!=undefined&&
                <TouchableOpacity activeOpacity={0.7} onPress={()=>{
                  this.getSmokeFavourite();
                  this.setState({type:2});
                }}>
                  <Text style={[{fontSize:RFPercentage(3), fontWeight:'bold'},this.state.type==2?{color:'#00f'}:{color:'#000'}]}>Gift Shop</Text>
                </TouchableOpacity>}
              </View> */}
            {this.state.type == 1 && (
              <ScrollView
                style={{ flex: 1, flexDirection: "column", paddingTop: 10 }}
              >
                {this.state.favourites.map((item, key) => {
                  return (
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        padding: 10,
                        marginBottom: 10,
                        backgroundColor: "rgba(255,255,255,0.6)",
                        borderColor: "#888",
                        borderBottomWidth: 0.5,
                        borderTopWidth: 0.5
                      }}
                      key={key}
                      onPress={() =>
                        NavigationService.navigate("Product", {
                          product_id: item.products_id,
                          type: item.product_type
                        })
                      }
                    >
                      <Image
                        source={{ uri: item.img }}
                        style={{ width: "25%", aspectRatio: 1 }}
                      ></Image>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text
                          style={{
                            textAlign: "left",
                            fontSize: RFPercentage(2.8),
                            paddingLeft: 10,
                            textAlignVertical: "center"
                          }}
                        >
                          {" "}
                          {item.name}
                        </Text>
                        {item.stock != undefined && (
                          <Text
                            style={{
                              textAlign: "left",
                              fontSize: RFPercentage(2.8),
                              paddingLeft: 10,
                              textAlignVertical: "center"
                            }}
                          >
                            {" "}
                            In Stock : {item.stock}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
                {this.state.smoke_favourties.map((item, key) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        padding: 10,
                        marginBottom: 10,
                        backgroundColor: "rgba(255,255,255,0.6)",
                        borderColor: "#888",
                        borderBottomWidth: 0.5,
                        borderTopWidth: 0.5
                      }}
                      key={key}
                      onPress={() =>
                        NavigationService.navigate("Product", {
                          product_id: item.products_id,
                          type: 2
                        })
                      }
                    >
                      <Image
                        source={{ uri: item.img }}
                        style={{ width: "25%", aspectRatio: 1 }}
                      ></Image>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text
                          style={{
                            textAlign: "left",
                            fontSize: RFPercentage(2.8),
                            paddingLeft: 10,
                            textAlignVertical: "center"
                          }}
                        >
                          {" "}
                          {item.name}
                        </Text>
                        <Text
                          style={{
                            textAlign: "left",
                            fontSize: RFPercentage(2.8),
                            paddingLeft: 10,
                            textAlignVertical: "center"
                          }}
                        >
                          {" "}
                          In Stock : {item.stock}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </SafeAreaView>
        </ImageBackground>
      </View>
    );
  }
}
