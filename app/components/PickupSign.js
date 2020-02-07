import React, { Component } from "react";
import {
  View,
  ImageBackground,
  StatusBar,
  Image,
  TextInput,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  SafeAreaView,
  BackHandler,
  Linking
} from "react-native";
import { StyleSheet } from "react-native";
import NavigationService from "../../NavigationService";
import { Header, Left, Title, Right, Content, Icon } from "native-base";
import DateTimePicker from "react-native-modal-datetime-picker";

import Toast from "react-native-root-toast";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const styles = StyleSheet.create({
  btnStyle: {
    width: "70%",
    height: 60,
    backgroundColor: "#f11",
    borderWidth: 5,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center"
  },
  btnTextStyle: {
    fontSize: RFPercentage(4),
    color: "white"
  },
  inputBoxView: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    paddingHorizontal: 10
  },
  inputBoxView1: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    paddingHorizontal: 10
  }
});

export default class PickupSign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pickuptime: new Date(),
      show: false
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  dialCall = () => {
    let phoneNumber = "";

    if (Platform.OS === "android") {
      phoneNumber = "tel:${2398888881}";
    } else {
      phoneNumber = "telprompt:${2398888881}";
    }

    Linking.openURL(phoneNumber);
  };
  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    this.props.navigation.goBack();
    return true;
  }

  componentDidMount = () => {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  };
  setDate = date => {
    date = date || this.state.date;

    this.setState({
      show: false,
      pickuptime: date
    });
  };

  getTimeValue = () => {
    var hours = this.state.pickuptime.getHours();
    var minutes = this.state.pickuptime.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };

  picksignup = () => {
    var first = this._firstname._lastNativeText;
    var second = this._secondname._lastNativeText;
    var phonenum = this._phonenum._lastNativeText;
    var time = this.getTimeValue();

    if (
      first == undefined ||
      second == undefined ||
      phonenum == undefined ||
      time == undefined
    ) {
      Toast.show("Input information", {
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0
      });
      return;
    }

    global.signup = {
      type: "pickup",
      data: {
        first: first,
        second: second,
        phonenum: phonenum,
        time: time,
        verifiedPhone: global.myphonenumber
      }
    };
    let return_url = this.props.navigation.getParam("return", "");
    if (return_url == "") NavigationService.navigate("Menu");
    else this.props.navigation.goBack();
  };

  showTimePicker = () => {
    this.setState({ show: true });
  };
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#f1f2f2" }}>
        <StatusBar hidden />

        <ImageBackground
          source={require("../assets/images/sign/bg.png")}
          style={{ width: "100%", height: "100%" }}
        >
          <SafeAreaView
            style={{
              width: "100%",
              height: RFPercentage(15),
              alignItems: "center",
              paddingTop: 0
            }}
          >
            <TouchableOpacity
              style={{ width: "100%", height: "100%", alignItems: "center" }}
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <Image
                source={require("../assets/images/menu/menu_header.png")}
                style={{ height: "100%", width: "70%" }}
                resizeMode={"contain"}
              ></Image>
            </TouchableOpacity>
          </SafeAreaView>

          <DateTimePicker
            value={this.state.pickuptime}
            isVisible={this.state.show}
            mode={"time"}
            onConfirm={this.setDate}
            onCancel={() => {}}
          />

          <View
            style={{ flex: 1, flexDirection: "column", paddingVertical: 10 }}
          >
            <View
              style={{
                flex: 1,
                alignContent: "center",
                alignItems: "center",
                flexDirection: "row"
              }}
            >
              <View style={{ flex: 1, paddingLeft: "5%" }}>
                <Image
                  source={require("../assets/images/sign/marker.png")}
                  style={{ height: "70%" }}
                  resizeMode={"contain"}
                ></Image>
              </View>
              <View
                style={{
                  flex: 5,
                  borderLeftColor: "#808285",
                  borderLeftWidth: 1,
                  paddingHorizontal: 20
                }}
              >
                <Text
                  style={{
                    color: "#000",
                    fontSize: RFPercentage(2.5),
                    alignSelf: "center"
                  }}
                >
                  WE NEED A LITTLE MORE INFO BEFORE WE START
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 3.4,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column"
              }}
            >
              <View
                style={{
                  width: "90%",
                  height: "100%",
                  backgroundColor: "#fff",
                  borderRadius: RFPercentage(4),
                  flexDirection: "column",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 3
                  },
                  shadowOpacity: 0.27,
                  shadowRadius: 4.65,

                  elevation: 6
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    alignContent: "center",
                    justifyContent: "center"
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      alignContent: "center",
                      justifyContent: "center"
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={{ width: "30%", height: "100%" }}>
                      <Image
                        source={require("../assets/images/sign/pickup_green.png")}
                        style={{ width: "100%", height: "80%" }}
                        resizeMode={"contain"}
                      ></Image>
                    </View>
                    <Text
                      style={{ color: "#00a651", fontSize: RFPercentage(3) }}
                    >
                      Pick Up
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      alignContent: "center",
                      justifyContent: "center"
                    }}
                    onPress={() => {
                      NavigationService.navigate("DeliverySign");
                    }}
                  >
                    <View style={{ width: "30%", height: "100%" }}>
                      <Image
                        source={require("../assets/images/sign/car.png")}
                        style={{ height: "70%", width: "100%" }}
                        resizeMode={"contain"}
                      ></Image>
                    </View>
                    <Text style={{ color: "#f00", fontSize: RFPercentage(3) }}>
                      DELIVERY
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.inputBoxView}>
                  <View style={styles.inputBoxView1}>
                    <View style={{ flex: 3, flexDirection: "column" }}>
                      <Text
                        style={{ fontSize: RFPercentage(2), color: "#000" }}
                      >
                        FIRST
                      </Text>
                    </View>
                    <View style={{ flex: 2, flexDirection: "column" }}>
                      <Text
                        style={{ fontSize: RFPercentage(2), color: "#000" }}
                      >
                        LAST
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.inputBoxView1, { flex: 1 }]}>
                    <View
                      style={{
                        flex: 3,
                        flexDirection: "column",
                        alignItems: "flex-start",
                        alignContent: "center",
                        justifyContent: "center"
                      }}
                    >
                      <TextInput
                        ref={c => (this._firstname = c)}
                        style={{
                          borderWidth: 1,
                          fontSize: RFPercentage(2),
                          borderColor: "#000",
                          borderRadius: 7,
                          width: "95%",
                          height: "100%",
                          paddingVertical: 5,
                          paddingLeft: 10
                        }}
                        placeholder="First name"
                        placeholderTextColor={"#a7a9ac"}
                      ></TextInput>
                    </View>
                    <View
                      style={{
                        flex: 2,
                        flexDirection: "column",
                        alignItems: "center",
                        alignContent: "center",
                        justifyContent: "center"
                      }}
                    >
                      <TextInput
                        ref={c => (this._secondname = c)}
                        style={{
                          borderWidth: 1,
                          fontSize: RFPercentage(2),
                          borderColor: "#000",
                          borderRadius: 7,
                          width: "95%",
                          height: "100%",
                          paddingVertical: 5,
                          paddingLeft: 10
                        }}
                        placeholder="Last name"
                        placeholderTextColor={"#a7a9ac"}
                      ></TextInput>
                    </View>
                  </View>
                </View>
                <View style={styles.inputBoxView}>
                  <View style={styles.inputBoxView1}>
                    <View style={{ flex: 3, flexDirection: "column" }}>
                      <Text
                        style={{ fontSize: RFPercentage(2), color: "#000" }}
                      >
                        PHONE
                      </Text>
                    </View>
                    <View style={{ flex: 2, flexDirection: "column" }}>
                      <Text
                        style={{ fontSize: RFPercentage(2), color: "#000" }}
                      >
                        PICK UP TIME
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.inputBoxView1, { flex: 1 }]}>
                    <View
                      style={{
                        flex: 3,
                        flexDirection: "column",
                        alignItems: "flex-start",
                        alignContent: "center",
                        justifyContent: "center"
                      }}
                    >
                      <TextInput
                        ref={c => (this._phonenum = c)}
                        style={{
                          borderWidth: 1,
                          fontSize: RFPercentage(2),
                          borderColor: "#000",
                          borderRadius: 7,
                          width: "95%",
                          height: "100%",
                          paddingVertical: 5,
                          paddingLeft: 10
                        }}
                        placeholder="xxxx"
                        placeholderTextColor={"#a7a9ac"}
                        keyboardType={"numeric"}
                      ></TextInput>
                    </View>
                    <View
                      style={{
                        flex: 2,
                        flexDirection: "column",
                        alignItems: "center",
                        alignContent: "center",
                        justifyContent: "center"
                      }}
                    >
                      <TouchableOpacity
                        style={{ width: "95%", height: "100%" }}
                        onPress={() => {
                          this.showTimePicker();
                        }}
                      >
                        <Text
                          ref={c => (this._pickuptime = c)}
                          style={{
                            borderWidth: 1,
                            fontSize: RFPercentage(2),
                            borderColor: "#000",
                            borderRadius: 7,
                            width: "100%",
                            height: "100%",
                            paddingVertical: 5,
                            paddingLeft: 10,
                            color: "#000"
                          }}
                          placeholder="5:15 PM"
                          placeholderTextColor={"#a7a9ac"}
                        >
                          {this.getTimeValue()}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View
                  style={[
                    styles.inputBoxView,
                    {
                      paddingRight: "10%",
                      paddingLeft: "10%",
                      flexDirection: "row"
                    }
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      NavigationService.navigate("Intro");
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          color: "#939598",
                          fontSize: RFPercentage(2),
                          marginRight: 3
                        }}
                      >
                        {"<"}
                      </Text>
                      <Text
                        style={{ color: "#f00", fontSize: RFPercentage(2) }}
                      >
                        BACK
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{ flex: 1 }}></View>
                  <TouchableOpacity
                    onPress={() => {
                      this.picksignup();
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{ color: "#f00", fontSize: RFPercentage(2) }}
                      >
                        NEXT
                      </Text>
                      <Text
                        style={{
                          color: "#939598",
                          fontSize: RFPercentage(2),
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
            <View
              style={{
                flex: 5,
                alignItems: "center",
                paddingTop: 40,
                justifyContent: "flex-start"
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.dialCall();
                }}
              >
                <Image
                  source={require("../assets/images/sign/delivery_phonenum.png")}
                  style={{ height: "70%", marginBottom: 0 }}
                  resizeMode={"contain"}
                ></Image>
              </TouchableOpacity>
              <Text style={{ color: "#000", fontSize: RFPercentage(3) }}>
                #SMOKINFRANKS
              </Text>
              <Text style={{ color: "#000", fontSize: RFPercentage(3) }}>
                #MUNCHINFRANKS
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
