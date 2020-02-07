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
  KeyboardAvoidingView
} from "react-native";
import NavigationService from "../../NavigationService";
import { SafeAreaView } from "react-navigation";
import Toast from "react-native-root-toast";
import Cartitem from "./Cartitem";

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Icon } from "native-base";
import { from } from "rxjs";

export default class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      // mycart:this.getCarts(1),
      mycart: global.mycart,
      type: 1,
      signup: {
        type: ""
      }
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  getCarts = type => {
    let res = [];
    for (let i = 0; i < global.mycart.length; i++) {
      if (global.mycart[i].product_type == type) {
        res.push(global.mycart[i]);
      }
    }
    return res;
  };

  componentDidMount = () => {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );

    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      let i = 0;

      for (i = 0; i < global.mycart.length; i++) {
        global.mycart[i].index = i;
      }

      console.log(global.mycart);
      //   this.setState({mycart:this.getCarts(1)});
      this.setState({ mycart: global.mycart });
      this.setState({ type: 1 });
      this.setState({ signup: global.signup });
    });
  };

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    NavigationService.navigate("Menu");
    return true;
  }

  setActiveTab(index) {
    this.setState({ activeTab: index });
  }

  calculatePrice = data => {
    let sum = 0;
    let i = 0;
    for (i = 0; i < data.attributes.length; i++) {
      att = data.attributes[i];
      sum += att.count * att.cost;
    }
    sum += Number(data.price);
    return sum.toFixed(2);
  };

  getTotalCost = () => {
    let sum = 0;
    let i = 0;
    for (i = 0; i < this.state.mycart.length; i++) {
      let cartitem = this.state.mycart[i];
      let ind_cost = this.calculatePrice(cartitem) * cartitem.quantity;
      sum += ind_cost;
    }
    return sum.toFixed(2);
  };

  itemRemove = value => {
    let arr = this.state.mycart;
    let temp = [];

    for (let i = 0; i < arr.length; i++) {
      if (i != value) temp.push(arr[i]);
    }

    this.setState({ mycart: temp });
    global.mycart.length = 0;
    global.mycart = temp;
  };

  onitempress = index => {
    Alert.alert(
      "",
      "Do you want remove this item from Cart?",
      [
        { text: "No", onPress: () => {}, style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            this.itemRemove(index);
          }
        }
      ],
      { cancelable: false }
    );
  };

  cartitem_change_quantity = (num, index) => {
    let arr = this.state.mycart;

    arr[index].quantity = num;

    this.setState({ mycart: arr });
    //   global.mycart.length=0;
    global.mycart = arr;
  };

  onGotoOrderDetail = () => {
    // if(this.state.type==2)
    // {
    //   if(this.getCarts(2).length==0)//||global.signup==undefined)
    //   {
    //     Toast.show('Your cart is empty', {
    //       position:Toast.positions.CENTER,
    //       shadow: true,
    //       animation: true,
    //       hideOnPress: true,
    //       delay: 0,
    //     });
    //     return;
    //   }
    //   NavigationService.navigate("OrderDetail_SMOKE");
    // }
    // else
    // {
    if (global.mycart.length == 0) {
      //||global.signup==undefined)
      Toast.show("Your cart is empty", {
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0
      });
      return;
    }

    if (global.signup == undefined || global.signup.type == "") {
      Alert.alert(
        "",
        "Select the Delivery method",
        [
          {
            text: "Pickup",
            onPress: () => {
              NavigationService.navigate("PickupSign", { return: 1 });
            }
          },
          {
            text: "Delivery",
            onPress: () => {
              NavigationService.navigate("DeliverySign", { return: 1 });
            }
          }
        ],
        { cancelable: false }
      );
      return;
    }
    if (global.signup.type == "pickup") {
      NavigationService.navigate("OrderDetail_PICKUP");
    } else if (global.signup.type == "delivery") {
      NavigationService.navigate("OrderDetail_DELIVERY");
    } else if (global.signup.type == "orderin") {
      NavigationService.navigate("OrderDetail_ORDERIN");
    }
    // }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden />
        <ImageBackground
          source={require("../assets/images/sign/bg.png")}
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            paddingTop: 0,
            resizeMode: "repeat"
          }}
        >
          <SafeAreaView
            style={{
              width: "100%",
              flex: 1,
              alignItems: "center",
              paddingTop: 0
            }}
          >
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
                CART
              </Text>
            </TouchableOpacity>

            {/*               
              <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', borderTopWidth:1, width:'100%' }}>
                <TouchableOpacity activeOpacity={0.7} onPress={()=>{
                  this.setState({mycart:this.getCarts(1)});
                  this.setState({type:1});
                }}>
                  <Text style={[{fontSize:RFPercentage(3), fontWeight:'bold'},this.state.type==1?{color:'#00f'}:{color:'#000'}]} >Pizza</Text>
                </TouchableOpacity>
                {global.myphonenumber!=undefined&&
                <TouchableOpacity activeOpacity={0.7} onPress={()=>{                  
                  this.setState({mycart:this.getCarts(2)});
                  this.setState({type:2});
                }}>
                  <Text style={[{fontSize:RFPercentage(3), fontWeight:'bold'},this.state.type==2?{color:'#00f'}:{color:'#000'}]}>Gift Shop</Text>
                </TouchableOpacity>}
              </View>
             */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#eeffff",
                height: RFPercentage(5)
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center"
                }}
                activeOpacity={0.7}
                onPress={() => {
                  NavigationService.navigate("PickupSign", { return: "cart" });
                }}
              >
                <View style={{ width: "30%", height: "100%" }}>
                  {(this.state.signup.type != "pickup" ||
                    global.signup == undefined) && (
                    <Image
                      source={require("../assets/images/sign/pickup.png")}
                      style={{ width: "100%", height: "80%" }}
                      resizeMode={"contain"}
                    ></Image>
                  )}
                  {this.state.signup.type == "pickup" && (
                    <Image
                      source={require("../assets/images/sign/pickup_green.png")}
                      style={{ width: "100%", height: "80%" }}
                      resizeMode={"contain"}
                    ></Image>
                  )}
                </View>
                <Text
                  style={[
                    { fontSize: RFPercentage(3) },
                    this.state.signup.type != "pickup"
                      ? { color: "#f00" }
                      : { color: "#00a651" }
                  ]}
                >
                  Pick Up
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center"
                }}
                activeOpacity={0.7}
                onPress={() => {
                  NavigationService.navigate("DeliverySign", {
                    return: "cart"
                  });
                }}
              >
                <View style={{ width: "30%", height: "100%" }}>
                  {this.state.signup.type == "delivery" && (
                    <Image
                      source={require("../assets/images/sign/car_green.png")}
                      style={{ height: "70%", width: "100%" }}
                      resizeMode={"contain"}
                    ></Image>
                  )}
                  {(this.state.signup.type != "delivery" ||
                    global.signup == undefined) && (
                    <Image
                      source={require("../assets/images/sign/car.png")}
                      style={{ width: "100%", height: "80%" }}
                      resizeMode={"contain"}
                    ></Image>
                  )}
                </View>
                <Text
                  style={[
                    { fontSize: RFPercentage(3) },
                    this.state.signup.type != "delivery"
                      ? { color: "#f00" }
                      : { color: "#00a651" }
                  ]}
                >
                  DELIVERY
                </Text>
              </TouchableOpacity>
            </View>
            {this.state.signup.type == "delivery" && (
              <View
                style={{
                  width: "100%",
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  flexDirection: "row",
                  backgroundColor: "#fff",
                  alignItems: "center"
                }}
              >
                <Icon
                  type="FontAwesome"
                  name="address-card"
                  style={{ fontSize: RFPercentage(2.8) }}
                ></Icon>
                <Text
                  style={{
                    textAlign: "left",
                    color: "#000",
                    fontSize: RFPercentage(2.8),
                    marginLeft: 10
                  }}
                >
                  {this.state.signup.data.street +
                    " " +
                    this.state.signup.data.address +
                    " " +
                    this.state.signup.data.city +
                    " " +
                    this.state.signup.data.state}
                </Text>
              </View>
            )}
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                width: "100%",
                backgroundColor: "#eeffff"
              }}
            >
              <FlatList
                style={{
                  width: "100%",
                  backgroundColor: "#eeffff",
                  marginHorizontal: 0
                }}
                data={this.state.mycart}
                renderItem={({ item }) => (
                  <Cartitem
                    data={item}
                    cost={this.calculatePrice(item)}
                    onitempress={this.onitempress}
                    cartitem_change_quantity={this.cartitem_change_quantity}
                  />
                )}
                numColumns={1}
                keyExtractor={(item, index) => index}
              />
            </View>
          </SafeAreaView>
          <SafeAreaView
            style={{ width: "100%", padding: 5, backgroundColor: "#eeffff" }}
          >
            <View
              style={{
                width: "100%",
                height: RFPercentage(8),
                backgroundColor: "#43bc55",
                borderRadius: 8,
                flexDirection: "row"
              }}
            >
              <TouchableOpacity
                onPress={() => this.onGotoOrderDetail()}
                style={{
                  flex: 1,
                  padding: 5,
                  flexDirection: "row",
                  justifyContents: "center"
                }}
              >
                <View
                  style={{
                    backgroundColor: "#44aa44",
                    width: RFPercentage(7),
                    justifyContent: "center",
                    borderRadius: 3
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: RFPercentage(2.5),
                      textAlign: "center",
                      textAlignVertical: "center"
                    }}
                  >
                    {this.state.mycart.length}
                  </Text>
                </View>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: RFPercentage(2.5),
                      textAlign: "center",
                      textAlignVertical: "center"
                    }}
                  >
                    Checkout
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#44aa44",
                    justifyContent: "center",
                    borderRadius: 3
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: RFPercentage(2.2),
                      textAlign: "center",
                      textAlignVertical: "center",
                      paddingHorizontal: 5
                    }}
                  >
                    ${this.getTotalCost()}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </View>
    );
  }
}
