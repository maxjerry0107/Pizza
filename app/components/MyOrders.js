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
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

function capitalizeFirstLetter(string) {
  try {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } catch (e) {
    return "";
  }
}

export default class OrderTracking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      orders: [],
      smoke_orders: [],
      type: 1
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount = () => {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    console.log(DeviceInfo);
    this.getPizzaOrder();
  };

  getSmokeOrder() {
    this.setState({ loading: true });
    smoke_api
      .get("?req=get-orders&phonenum=" + global.myphonenumber)
      .then(response => {
        console.log(response);
        let res = response.data;
        console.log(res);
        if (res.status == true) {
          this.setState({ loading: false, smoke_orders: res.orders });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(function(error) {
        console.log(error);
        this.setState({ loading: false });
      });
  }

  async getPizzaOrder() {
    this.setState({ loading: true });
    const uniqueId = await DeviceInfo.getUniqueID();
    console.log(uniqueId);
    axios
      .get("?req=get-orders&phoneid=" + uniqueId)
      .then(response => {
        console.log(response);
        let res = response.data;
        console.log(res);
        if (res.status == true) {
          this.setState({ loading: false, orders: res.orders });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(function(error) {
        console.log(error);
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
                My Orders
              </Text>
            </TouchableOpacity>
            {/* 
              <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', borderTopWidth:1 }}>
                <TouchableOpacity activeOpacity={0.7} onPress={()=>{
                  this.getPizzaOrder();
                  this.setState({type:1});
                }}>
                  <Text style={[{fontSize:RFPercentage(3), fontWeight:'bold'},this.state.type==1?{color:'#00f'}:{color:'#000'}]} >Pizza</Text>
                </TouchableOpacity>
                {global.myphonenumber!=undefined&&
                <TouchableOpacity activeOpacity={0.7} onPress={()=>{
                  this.getSmokeOrder();
                  this.setState({type:2});
                }}>
                  <Text style={[{fontSize:RFPercentage(3), fontWeight:'bold'},this.state.type==2?{color:'#00f'}:{color:'#000'}]}>Gift Shop</Text>
                </TouchableOpacity>}
              </View> */}

            <ScrollView
              style={{ flex: 1, flexDirection: "column", paddingTop: 10 }}
            >
              {this.state.orders.reverse().map((item, key) => {
                return (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      marginBottom: 10,
                      backgroundColor: "rgba(255,255,255,0.6)",
                      borderColor: "#888",
                      borderBottomWidth: 0.5,
                      borderTopWidth: 0.5
                    }}
                    key={key}
                  >
                    <TouchableOpacity
                      style={{ flexDirection: "row" }}
                      onPress={() =>
                        NavigationService.navigate("OrderTracking", {
                          orderid: item.orders_id
                        })
                      }
                    >
                      <Image
                        source={require("../assets/images/ordericon.png")}
                        style={{ width: "20%", aspectRatio: 1 }}
                      ></Image>
                      <View
                        style={{
                          flexDirection: "column",
                          justifyContent: "center"
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "left",
                            fontSize: RFPercentage(2.8)
                          }}
                        >
                          {" "}
                          Order ID - {item.orders_id}
                        </Text>
                        <Text
                          style={{
                            textAlign: "left",
                            fontSize: RFPercentage(2.4)
                          }}
                        >
                          {" "}
                          {item.created_on}{" "}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "column",
                          justifyContent: "center",
                          marginRight: 20,
                          flex: 1
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "right",
                            fontSize: RFPercentage(2.4)
                          }}
                        >
                          {" "}
                          {capitalizeFirstLetter(item.order_type)}{" "}
                        </Text>
                        <Text
                          style={{
                            textAlign: "right",
                            fontSize: RFPercentage(2.8)
                          }}
                        >
                          {" "}
                          ${item.order_total}{" "}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <View>
                      {item[0].map((product_item, key1) => {
                        return (
                          <TouchableOpacity
                            key={"item" + item.orders_id + key1}
                            style={{
                              flexDirection: "row",
                              paddingHorizontal: 10,
                              borderTopWidth: 0.3,
                              paddingVertical: 5,
                              justifyContent: "center"
                            }}
                            activeOpacity={0.7}
                            onPress={() =>
                              NavigationService.navigate("Product", {
                                product_id: product_item.products_id,
                                type: product_item.product_type
                              })
                            }
                          >
                            <Image
                              source={{ uri: product_item.img }}
                              style={{ width: "20%", aspectRatio: 1 }}
                            ></Image>
                            <View
                              style={{
                                flex: 1,
                                flexDirection: "column",
                                paddingHorizontal: 10,
                                justifyContent: "center"
                              }}
                            >
                              <Text style={{ fontSize: RFPercentage(2.4) }}>
                                {" "}
                                {capitalizeFirstLetter(product_item.name)}{" "}
                              </Text>
                              <Text style={{ fontSize: RFPercentage(2.8) }}>
                                {" "}
                                ${product_item.price} X {product_item.qty}{" "}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </SafeAreaView>
        </ImageBackground>
      </View>
    );
  }
}
