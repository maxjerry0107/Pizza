import React, { Component } from "react";
import {
  View,
  ImageBackground,
  StatusBar,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  Linking,
  Dimensions
} from "react-native";
import { StyleSheet } from "react-native";
import NavigationService from "../../NavigationService";
import { SafeAreaView, NativeModules } from "react-native";
import { Button } from "native-base";
import axios from "./Axios";
import Geolocation from "@react-native-community/geolocation";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
const screenWidth = Dimensions.get("window").width;
import Modal from "react-native-modal";
import { TextField } from "react-native-material-textfield";
import Toast from "react-native-root-toast";
import AsyncStorage from "@react-native-community/async-storage";
const styles = StyleSheet.create({
  btnStyle: {
    minHeight: 70,
    width: "75%",
    backgroundColor: "#f11",
    borderWidth: 5,
    borderColor: "#f11",
    alignItems: "center",
    justifyContent: "center"
  },
  btnTextStyle: {
    fontFamily: "Raleway-Bold",
    fontSize: RFPercentage(4),
    color: "white"
  }
});

storeData = async phonenumber => {
  try {
    await AsyncStorage.setItem("@verified", "ok");
    await AsyncStorage.setItem("@phonenumber", phonenumber);
  } catch (e) {
    // saving error
  }
};

getData = async () => {
  try {
    const isVerified = await AsyncStorage.getItem("@verified");
    const phonenumber = await AsyncStorage.getItem("@phonenumber");
    if (isVerified !== null) {
      if (isVerified == "ok") {
        global.myphonenumber = phonenumber;
        return false;
      } else return true;
    } else return true;
  } catch (e) {
    return true;
  }
};

let height = Dimensions.get("window").height;

export default class Intro extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPhonesign: false,
      sign_step: 1,
      verifyCode: ""
    };
  }

  componentDidMount = async () => {
    var isPhonesign = await getData();
    this.setState({ isPhonesign: isPhonesign });
    setTimeout(() => {
      if (this.state.isPhonesign) this._sign_phonenum.focus();
    }, 100);
    global.mycart = [];
    global.signup = {
      type: ""
    };
    axios
      .get("?req=get-pizza-location")
      .then(response => {
        let res = response.data;
        console.log(res);
        if (res.status == true) {
          global.pizza_location = res.location;
        } else {
          global.pizza_location = {
            lat: 26.4910765,
            long: -81.9426475
          };
        }
      })
      .catch(function(error) {
        global.pizza_location = {
          lat: 26.4910765,
          long: -81.9426475
        };
      });
  };
  dialCall = () => {
    let phoneNumber = "";

    if (Platform.OS === "android") {
      phoneNumber = "tel:${2398888881}";
    } else {
      phoneNumber = "telprompt:${2398888881}";
    }

    Linking.openURL(phoneNumber);
  };

  gotoLocation = () => {
    Geolocation.getCurrentPosition(info => {
      console.log(NativeModules);
      NativeModules.MapboxNavigation.navigate(
        info.coords.latitude,
        info.coords.longitude,
        global.pizza_location.lat,
        global.pizza_location.long
      );
    });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden />
        <Modal
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          backdropOpacity={0.8}
          isVisible={this.state.isPhonesign}
          onBackdropPress={() => {
            this.setState({ phonesign: false });
          }}
        >
          <View
            style={{ width: "80%", flexDirection: "column", borderRadius: 10 }}
          >
            <ImageBackground
              source={require("../assets/images/intro/back1.png")}
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center"
              }}
              imageStyle={{ borderRadius: 10, resizeMode: "cover" }}
            >
              <Image
                source={require("../assets/images/intro/intro_header.png")}
                style={{ width: "90%", height: "40%" }}
                resizeMode={"contain"}
              />
              <View
                style={{
                  paddingBottom: 20,
                  paddingVertical: 10,
                  paddingHorizontal: 20
                }}
              >
                <Text
                  style={{
                    fontSize: RFPercentage(3),
                    alignSelf: "center",
                    color: "#f00"
                  }}
                >
                  Phone Verification
                </Text>

                {this.state.sign_step == 1 && (
                  <TextField
                    ref={c => (this._sign_phonenum = c)}
                    keyboardType="numeric"
                    autoCapitalize="none"
                    autoCorrect={false}
                    fontSize={RFPercentage(2.6)}
                    labelFontSize={RFPercentage(2.2)}
                    label="Phone Number"
                  />
                )}
                {this.state.sign_step == 2 && (
                  <View>
                    <Text
                      style={{ fontSize: RFPercentage(2), alignSelf: "center" }}
                    >
                      We've sent code to your phone.
                    </Text>
                    <TextField
                      ref={c => (this._sign_password = c)}
                      keyboardType="numeric"
                      secureTextEntry={true}
                      fontSize={RFPercentage(2.6)}
                      labelFontSize={RFPercentage(2.2)}
                      label="Verification Code"
                    />
                  </View>
                )}
                <View
                  style={{ width: "100%", flexDirection: "row", marginTop: 10 }}
                >
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        if (this.state.sign_step == 1)
                          this.setState({ isPhonesign: false });
                        else {
                          this.setState({ sign_step: 1 });
                          setTimeout(() => {
                            this._sign_phonenum.setNativeProps({
                              editable: true
                            });
                            this._sign_phonenum.focus();
                          }, 200);
                        }
                      }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <Text
                          style={{
                            color: "#939598",
                            fontSize: RFPercentage(2.5),
                            marginLeft: 3
                          }}
                        >
                          {"<"}
                        </Text>
                        <Text
                          style={{ color: "#f00", fontSize: RFPercentage(2.5) }}
                        >
                          Back
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        if (this.state.sign_step == 1) {
                          if (this._sign_phonenum.value() != "") {
                            let url = "login.php";
                            axios
                              .post(url, {
                                phone: this._sign_phonenum.value()
                              })
                              .then(response => {
                                let res = response.data;
                                if (res.status) {
                                  global.myphonenumber = this._sign_phonenum.value();
                                  this.setState({ verifyCode: res.code });
                                  this.setState({ sign_step: 2 });
                                  //   this._sign_phonenum.setNativeProps({editable:false});
                                  setTimeout(() => {
                                    this._sign_password.focus();
                                  }, 200);
                                } else {
                                  alert(
                                    "Can't send verify code to your phonenum. Try again"
                                  );
                                }
                              })
                              .catch(error => {
                                alert(
                                  "Can't send verify code to your phonenum. Try again"
                                );
                              });
                          }
                        } else {
                          if (
                            this._sign_password.value() == this.state.verifyCode
                          ) {
                            Toast.show("Verification Success!", {
                              position: Toast.positions.CENTER,
                              shadow: true,
                              animation: true,
                              hideOnPress: true,
                              delay: 0
                            });
                            storeData(global.myphonenumber);
                            this.setState({ isPhonesign: false });
                          } else {
                            Toast.show("Verification Failed! Try again", {
                              position: Toast.positions.CENTER,
                              shadow: true,
                              animation: true,
                              hideOnPress: true,
                              delay: 0
                            });
                          }
                        }
                      }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <Text
                          style={{ color: "#f00", fontSize: RFPercentage(2.5) }}
                        >
                          Next
                        </Text>
                        <Text
                          style={{
                            color: "#939598",
                            fontSize: RFPercentage(2.5),
                            marginLeft: 3
                          }}
                        >
                          >
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>
        </Modal>

        <ImageBackground
          source={require("../assets/images/intro/back1.png")}
          style={{ width: "100%", height: "100%" }}
        >
          <SafeAreaView
            style={[{ flex: 1 }]}
            forceInset={{ bottom: "always", top: "never" }}
          >
            <ImageBackground
              source={require("../assets/images/intro/back2.png")}
              style={{ width: "100%", height: "101%" }}
              imageStyle={{ resizeMode: "stretch" }}
            >
              <View style={{ flex: 1, flexDirection: "column", paddingTop: 0 }}>
                <View
                  style={{
                    flex: 1,
                    alignContent: "center",
                    alignItems: "center",
                    paddingTop: 0,
                    zIndex: 8,
                    justifyContent: "center"
                  }}
                >
                  <Image
                    source={require("../assets/images/intro/intro_header.png")}
                    resizeMode={"contain"}
                    style={{ height: "80%", width: "95%", zIndex: 10 }}
                  ></Image>
                  <Image
                    source={require("../assets/images/intro/satelite.png")}
                    resizeMode={"contain"}
                    style={{
                      height: "90%",
                      width: "58%",
                      zIndex: 8,
                      position: "absolute",
                      top: "65%",
                      left: "-3%"
                    }}
                  ></Image>
                </View>
                <View style={{ flex: 2, zIndex: 1, flexDirection: "column" }}>
                  <View style={{ flex: 0.3, flexDirection: "column" }}></View>
                  <View
                    style={{
                      flex: 2,
                      flexDirection: "column",
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                      flexDirection: "column"
                    }}
                  >
                    <TouchableOpacity
                      style={[styles.btnStyle, { height: screenWidth * 0.13 }]}
                      onPress={() => {
                        NavigationService.navigate("PickupSign");
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.btnTextStyle}>PICK UP</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.btnStyle, { height: screenWidth * 0.13 }]}
                      onPress={() => {
                        NavigationService.navigate("DeliverySign");
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.btnTextStyle}>DELIVERY</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.btnStyle, { height: screenWidth * 0.13 }]}
                      onPress={() => {
                        NavigationService.navigate("OrderinSign");
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.btnTextStyle}>ORDER IN</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 1, flexDirection: "column" }}></View>
                </View>
              </View>
            </ImageBackground>
          </SafeAreaView>
          <ImageBackground
            source={require("../assets/images/intro/bg_footer.png")}
            style={{ width: "100%" }}
          >
            <SafeAreaView style={{ backgroundColor: "transparent", flex: 0 }}>
              <View
                style={{
                  height: RFPercentage(10),
                  width: "100%",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  <TouchableOpacity
                    style={{ flex: 1, padding: 10, alignItems: "center" }}
                    onPress={() => NavigationService.navigate("Menu")}
                  >
                    <Image
                      source={require("../assets/images/menu.png")}
                      style={{ height: RFPercentage(7) }}
                      resizeMode={"contain"}
                    ></Image>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex: 1, padding: 10, alignItems: "center" }}
                    onPress={() => NavigationService.navigate("Cart")}
                  >
                    <Image
                      source={require("../assets/images/cart.png")}
                      style={{ height: RFPercentage(7) }}
                      resizeMode={"contain"}
                    ></Image>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex: 1, padding: 10, alignItems: "center" }}
                    onPress={() => NavigationService.navigate("MyOrders")}
                  >
                    <Image
                      source={require("../assets/images/order-s.png")}
                      style={{ height: RFPercentage(7) }}
                      resizeMode={"contain"}
                    ></Image>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex: 1, padding: 10, alignItems: "center" }}
                    onPress={() => NavigationService.navigate("MyFavourites")}
                  >
                    <Image
                      source={require("../assets/images/fav.png")}
                      style={{ height: RFPercentage(7) }}
                      resizeMode={"contain"}
                    ></Image>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex: 1, padding: 10, alignItems: "center" }}
                    onPress={() => this.gotoLocation()}
                  >
                    <Image
                      source={require("../assets/images/direc.png")}
                      style={{ height: RFPercentage(7) }}
                      resizeMode={"contain"}
                    ></Image>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </ImageBackground>
        </ImageBackground>
      </View>
    );
  }
}
