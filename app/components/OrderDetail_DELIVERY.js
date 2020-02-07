import React, { Component } from "react";
import {
  View,
  ImageBackground,
  StatusBar,
  Image,
  Text,
  BackHandler,
  Alert,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";
import NavigationService from "../../NavigationService";
import { SafeAreaView } from "react-navigation";
import Toast from "react-native-root-toast";
import { Icon } from "native-base";
import axios from "./Axios";
import DeviceInfo from "react-native-device-info";
import Spinner from "react-native-loading-spinner-overlay";

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
export default class OrderDetail_DELIVERY extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      mycart: global.mycart,
      tip: 0,
      vat: 0.063,
      fee: 4,
      discount: 0
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount = () => {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );

    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      this.setState({ mycart: global.mycart });

      //get TAX and Fee
    });
  };

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  calculateSubTotal = () => {
    let sum = 0;
    for (i = 0; i < this.state.mycart.length; i++) {
      let orderitem = this.state.mycart[i];
      sum += this.calculatePrice(orderitem);
    }
    //   sum = sum * (100 - Number(discount)) / 100;
    return sum;
  };

  calculatePrice = data => {
    let sum = 0;
    let i = 0;
    for (i = 0; i < data.attributes.length; i++) {
      att = data.attributes[i];
      sum += att.count * att.cost;
    }
    sum += Number(data.price);

    return sum * data.quantity;
  };

  getTotalCost = discount => {
    let sum = 0;

    sum += (this.calculateSubTotal() * (100 - Number(discount))) / 100;
    sum +=
      ((this.calculateSubTotal() * (100 - Number(discount))) / 100) *
      this.state.vat;
    sum += this.state.fee;
    sum += this.state.tip;

    return sum; //.toFixed(2);
  };

  onChangeTip = tip => {
    let tmp = parseFloat(tip);
    if (isNaN(tmp)) tmp = 0;
    this.setState({ tip: tmp });
  };

  getCarts = type => {
    let res = [];
    for (let i = 0; i < global.mycart.length; i++) {
      if (global.mycart[i].product_type == type) {
        res.push(global.mycart[i]);
      }
    }
    return res;
  };

  onGotoOrder = async () => {
    global.signup.note = this._ordernote._lastNativeText;
    const uniqueId = await DeviceInfo.getUniqueID();
    global.signup.phoneid = uniqueId;
    global.signup.subtotalcost = this.calculateSubTotal();
    global.signup.discount = this.state.discount;
    global.signup.vat = this.calculateSubTotal() * this.state.vat;
    global.signup.fee = this.state.fee;
    global.signup.tip = this.state.tip;
    global.signup.totalcost = this.getTotalCost(this.state.discount).toFixed(2);
    Alert.alert(
      "",
      "Select Paymet type.",
      [
        {
          text: "Credit Card",
          onPress: () => {
            NavigationService.navigate("CreditCard");
          }
        },
        {
          text: "Cash on Delivery",
          onPress: () => {
            global.signup.payment_method = "cash";
            this.setState({ loading: true });
            axios
              .post("form.php", {
                orderinfo: JSON.stringify(global.signup),
                orderdata: JSON.stringify(global.mycart)
              })
              .then(response => {
                let res = response.data;
                console.log(res);
                if (res.status == true) {
                  this.setState({ loading: false });
                  var n = res.message.search(":");
                  var orderid = parseInt(res.message.slice(n + 1));
                  Toast.show("Success!" + res.message, {
                    position: Toast.positions.CENTER,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    delay: 0,
                    onHidden: () => {
                      global.signup = [];
                      global.mycart = [];
                      NavigationService.navigate("OrderTracking", {
                        orderid: orderid,
                        product_type: 1
                      });
                    }
                  });
                } else {
                  this.setState({ loading: false });
                  Toast.show("Try again!", {
                    position: Toast.positions.CENTER,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    delay: 0
                  });
                }
              })
              .catch(function(error) {
                console.log(error);
                Toast.show("Try again!", {
                  position: Toast.positions.CENTER,
                  shadow: true,
                  animation: true,
                  hideOnPress: true,
                  delay: 0
                });
              });
          }
        }
      ],
      { cancelable: false }
    );
  };

  submitCouponCode = () => {
    if (this._coupon._lastNativeText == undefined) {
      Toast.show("Please input code!", {
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0
      });
      return;
    }
    this.setState({ loading: true });
    axios
      .get(
        "?req=verify-coupon&code=" +
          this._coupon._lastNativeText +
          "&total=" +
          this.getTotalCost(0)
      )
      .then(response => {
        console.log(response);
        let res = response.data;
        console.log(res);
        if (res.status == true) {
          this.setState({ loading: false });
          this.setState({ discount: res.Discount });
        } else {
          this.setState({ loading: false });
          Toast.show("Wrong Code. Try again.", {
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0
          });
        }
      })
      .catch(function(error) {
        console.log(error);
        this.setState({ loading: false });
        Toast.show("Can't connect to server.", {
          position: Toast.positions.TOP,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0
        });
      });
  };

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <StatusBar hidden />
        <ImageBackground
          source={require("../assets/images/sign/bg.png")}
          style={{
            width: "100%",
            height: "100%",
            paddingTop: 0,
            resizeMode: "repeat"
          }}
        >
          <Spinner
            color={"#000"}
            visible={this.state.loading}
            textContent={"Loading..."}
            textStyle={{ color: "#000" }}
          />
          <SafeAreaView style={{ width: "100%", flex: 1, paddingTop: 0 }}>
            <TouchableOpacity
              style={{
                width: "100%",
                height: RFPercentage(10),
                alignItems: "center"
              }}
              activeOpacity={0.8}
              onPress={() => NavigationService.navigate("Cart")}
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
                Order Detail
              </Text>
            </TouchableOpacity>
            <View style={{ flex: 1, flexDirection: "column" }}>
              <ScrollView
                style={{
                  flex: 1,
                  width: "100%",
                  flexDirection: "column",
                  backgroundColor: "#eeffff"
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    paddingHorizontal: 10,
                    backgroundColor: "#eeffff"
                  }}
                >
                  <Text
                    style={{
                      flex: 1,
                      textAlign: "left",
                      color: "#000",
                      fontSize: RFPercentage(2.8)
                    }}
                  >
                    DELIVERY ADDRESS
                  </Text>
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => NavigationService.navigate("DeliverySign")}
                  >
                    <Text
                      style={{
                        textAlign: "right",
                        color: "#6db0b8",
                        fontSize: RFPercentage(2.8)
                      }}
                    >
                      Change address
                    </Text>
                  </TouchableOpacity>
                </View>
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
                    {global.signup.data.street +
                      " " +
                      global.signup.data.address +
                      " " +
                      global.signup.data.city +
                      " " +
                      global.signup.data.state}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    backgroundColor: "#eeffff"
                  }}
                >
                  <Text
                    style={{
                      flex: 1,
                      textAlign: "left",
                      color: "#000",
                      fontSize: RFPercentage(2.8),
                      paddingLeft: 10,
                      paddingVertical: 10
                    }}
                  >
                    BASKET SUMMERY
                  </Text>
                  <FlatList
                    style={{ width: "100%", backgroundColor: "#eeffff" }}
                    data={this.state.mycart}
                    renderItem={({ item }) => (
                      <View
                        style={{
                          flexDirection: "row",
                          backgroundColor: "#eeffff",
                          alignItems: "center",
                          borderBottomColor: "#888",
                          borderBottomWidth: 0.7,
                          marginBottom: 10,
                          marginHorizontal: 10
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "left",
                            fontSize: RFPercentage(2.8),
                            flex: 3
                          }}
                        >
                          {" "}
                          {item.name}{" "}
                        </Text>
                        <TouchableOpacity>
                          <Icon
                            type="AntDesign"
                            name="edit"
                            style={{ color: "#4ebdc8", fontSize: 22 }}
                          ></Icon>
                        </TouchableOpacity>
                        <Text
                          style={{
                            textAlign: "left",
                            fontSize: RFPercentage(2.4),
                            marginLeft: 20
                          }}
                        >
                          {" "}
                          x{item.quantity}{" "}
                        </Text>
                        <Text
                          style={{
                            textAlign: "right",
                            fontSize: RFPercentage(2.8),
                            flex: 1
                          }}
                        >
                          {" "}
                          ${this.calculatePrice(item).toFixed(2)}{" "}
                        </Text>
                      </View>
                    )}
                    numColumns={1}
                    keyExtractor={(item, index) => index}
                  />
                  <View
                    style={{
                      backgroundColor: "#fff",
                      flexDirection: "row",
                      paddingHorizontal: 10
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "left",
                        fontSize: RFPercentage(2.8),
                        flex: 3
                      }}
                    >
                      {" "}
                      Sub Total
                    </Text>
                    <Text
                      style={{
                        textAlign: "right",
                        fontSize: RFPercentage(2.8),
                        flex: 1
                      }}
                    >
                      {" "}
                      ${this.calculateSubTotal().toFixed(2)}{" "}
                    </Text>
                  </View>
                  {this.state.discount != 0 && (
                    <View
                      style={{
                        backgroundColor: "#fff",
                        flexDirection: "row",
                        paddingHorizontal: 10
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "left",
                          fontSize: RFPercentage(2.8),
                          flex: 3
                        }}
                      >
                        {" "}
                        Discount
                      </Text>
                      <Text
                        style={{
                          textAlign: "right",
                          fontSize: RFPercentage(2.8),
                          flex: 1
                        }}
                      >
                        {" "}
                        {this.state.discount}%{" "}
                      </Text>
                    </View>
                  )}
                  <View
                    style={{
                      backgroundColor: "#fff",
                      flexDirection: "row",
                      paddingHorizontal: 10
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "left",
                        fontSize: RFPercentage(2.8),
                        flex: 3
                      }}
                    >
                      {" "}
                      Tax (6.3%)
                    </Text>
                    <Text
                      style={{
                        textAlign: "right",
                        fontSize: RFPercentage(2.8),
                        flex: 1
                      }}
                    >
                      {" "}
                      $
                      {(
                        ((this.calculateSubTotal() *
                          (100 - Number(this.state.discount))) /
                          100) *
                        this.state.vat
                      ).toFixed(2)}{" "}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#fff",
                      flexDirection: "row",
                      paddingHorizontal: 10
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "left",
                        fontSize: RFPercentage(2.8),
                        flex: 3
                      }}
                    >
                      {" "}
                      Delivery Fee
                    </Text>
                    <Text
                      style={{
                        textAlign: "right",
                        fontSize: RFPercentage(2.8),
                        flex: 1
                      }}
                    >
                      {" "}
                      ${this.state.fee.toFixed(2)}{" "}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#fff",
                      flexDirection: "row",
                      paddingHorizontal: 10
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "left",
                        fontSize: RFPercentage(2.8),
                        marginRight: 30,
                        flex: 1
                      }}
                    >
                      {" "}
                      Tip
                    </Text>
                    <TextInput
                      style={{
                        fontSize: RFPercentage(2.8),
                        flex: 1,
                        borderWidth: 1,
                        paddingVertical: 0,
                        textAlign: "right"
                      }}
                      keyboardType={"numeric"}
                      onChangeText={this.onChangeTip}
                    ></TextInput>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#fff",
                      flexDirection: "row",
                      paddingHorizontal: 10,
                      marginTop: 5,
                      paddingVertical: 5,
                      borderTopWidth: 0.5,
                      borderBottomWidth: 0.5
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "left",
                        fontSize: RFPercentage(2.8),
                        flex: 3
                      }}
                    >
                      {" "}
                      Total
                    </Text>
                    <Text
                      style={{
                        textAlign: "right",
                        fontSize: RFPercentage(2.8),
                        flex: 1
                      }}
                    >
                      ${this.getTotalCost(this.state.discount).toFixed(2)}{" "}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#fff",
                      flexDirection: "row",
                      paddingHorizontal: 10,
                      marginTop: 5,
                      paddingVertical: 5,
                      borderTopWidth: 0.5,
                      borderBottomWidth: 0.5,
                      alignItems: "center"
                    }}
                  >
                    <Text
                      style={{ textAlign: "left", fontSize: RFPercentage(2.6) }}
                    >
                      {" "}
                      Coupon Code
                    </Text>
                    <TextInput
                      style={{
                        textAlign: "left",
                        fontSize: RFPercentage(2.6),
                        borderWidth: 1,
                        paddingVertical: 0,
                        flex: 1,
                        marginHorizontal: RFPercentage(1)
                      }}
                      ref={c => (this._coupon = c)}
                    ></TextInput>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{
                        backgroundColor: "#43bc55",
                        borderRadius: RFPercentage(1),
                        padding: RFPercentage(0.5)
                      }}
                      onPress={() => {
                        this.submitCouponCode();
                      }}
                    >
                      <Text
                        style={{ fontSize: RFPercentage(2.4), color: "#fff" }}
                      >
                        Apply
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={{
                      flex: 1,
                      textAlign: "left",
                      color: "#000",
                      fontSize: RFPercentage(2.8),
                      paddingLeft: 10,
                      paddingVertical: 10,
                      borderBottomWidth: 0.7,
                      borderTopWidth: 0.5
                    }}
                  >
                    ORDER INFO
                  </Text>
                  <View
                    style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}
                  >
                    <TextInput
                      style={{
                        flex: 1,
                        height: 100,
                        borderWidth: 0.5,
                        borderRadius: 10,
                        textAlignVertical: "top",
                        fontSize: RFPercentage(2.8),
                        paddingHorizontal: 10,
                        paddingVertical: 5
                      }}
                      placeholder="Write a note"
                      multiline={true}
                      ref={c => (this._ordernote = c)}
                    ></TextInput>
                  </View>
                </View>
              </ScrollView>
            </View>
          </SafeAreaView>
          <SafeAreaView
            style={{
              width: "100%",
              padding: RFPercentage(1),
              backgroundColor: "#eeffff"
            }}
          >
            <View
              style={{
                width: "100%",
                height: RFPercentage(8),
                backgroundColor: "#43bc55",
                borderRadius: RFPercentage(1),
                flexDirection: "row"
              }}
            >
              <TouchableOpacity
                onPress={() => this.onGotoOrder()}
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
                      fontSize: RFPercentage(2.8),
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
                      fontSize: RFPercentage(2.8),
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
                      fontSize: RFPercentage(2.4),
                      textAlign: "center",
                      textAlignVertical: "center",
                      paddingHorizontal: 5
                    }}
                  >
                    ${this.getTotalCost(this.state.discount).toFixed(2)}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}
