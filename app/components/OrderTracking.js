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
import Toast from "react-native-root-toast";
import { Icon } from "native-base";
import axios from "./Axios";
import Spinner from "react-native-loading-spinner-overlay";
import { RFPercentage } from "react-native-responsive-fontsize";
import smoke_api from "./Smoke_Axios";

export default class OrderTracking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      myorder: [],
      orderid: ""
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount = () => {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );

    const orderid = this.props.navigation.getParam("orderid", "");
    //const product_type=this.props.navigation.getParam("product_type",-1)
    this.setState({ orderid: orderid });
    if (orderid == "") {
      this.props.navigation.goBack();
      return;
    }

    //if(product_type==1)
    {
      axios
        .get("?req=get-order-by-id&orders_id=" + orderid)
        .then(response => {
          let res = response.data;
          console.log(res);
          if (res.status == true) {
            this.setState({ loading: false, myorder: res });
          } else {
            Toast.show("Can't get Data from server. Try again.", {
              position: Toast.positions.CENTER,
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 0,
              onHidden: () => {
                this.props.navigation.goBack(null);
              }
            });
          }
        })
        .catch(function(error) {
          Toast.show("Can't connect to server.", {
            position: Toast.positions.TOP,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            onHidden: () => {
              this.props.navigation.goBack(null);
            }
          });
        });
    }
    // if(product_type==2)
    // {
    //   smoke_api.get('?req=get-order-by-id&orders_id='+orderid)
    //     .then(response => {
    //     let res=response.data;
    //     console.log(res);
    //     if(res.status==true)
    //     {
    //         this.setState({loading:false, myorder:res});
    //     }
    //     else
    //     {
    //       Toast.show('Can\'t get Data from server. Try again.', {
    //         position:Toast.positions.CENTER,
    //         shadow: true,
    //         animation: true,
    //         hideOnPress: true,
    //         delay: 0,
    //         onHidden: () => {
    //           this.props.navigation.goBack(null);
    //         }
    //       });
    //     }
    //   })
    //   .catch(function (error) {
    //     Toast.show('Can\'t connect to server.', {
    //       position:Toast.positions.TOP,
    //       shadow: true,
    //       animation: true,
    //       hideOnPress: true,
    //       delay: 0,
    //       onHidden: () => {
    //         this.props.navigation.goBack(null);
    //       }
    //     });
    //   });
    // }
  };

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    NavigationService.navigate("MyOrders");
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
          {!this.state.loading && (
            <View style={{ flex: 1 }}>
              <SafeAreaView style={{ width: "100%", flex: 1, paddingTop: 0 }}>
                <TouchableOpacity
                  style={{
                    width: "100%",
                    height: RFPercentage(10),
                    alignItems: "center"
                  }}
                  activeOpacity={0.8}
                  onPress={() => NavigationService.navigate("MyOrders")}
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
                    Order Tracking
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    width: "100%",
                    paddingVertical: 10,
                    textAlign: "center",
                    backgroundColor: "#fff",
                    fontSize: RFPercentage(2.8),
                    borderBottomWidth: 1,
                    borderColor: "#888"
                  }}
                >
                  ORDER ID - {this.state.orderid}
                </Text>
                <ScrollView style={{ flex: 1, flexDirection: "column" }}>
                  <ImageBackground
                    source={require("../assets/images/orderpic.png")}
                    style={{
                      height: RFPercentage(50),
                      width: RFPercentage(50),
                      alignItems: "center",
                      alignSelf: "center",
                      justifyContent: "center",
                      resizeMode: "contain"
                    }}
                  >
                    <Text style={{ fontSize: RFPercentage(2.8) }}>
                      ORDER RECEIVED
                    </Text>
                  </ImageBackground>
                  <Text
                    style={{
                      width: "100%",
                      paddingVertical: 10,
                      textAlign: "center",
                      backgroundColor: "#fff",
                      fontSize: RFPercentage(2.8),
                      borderBottomWidth: 1,
                      borderTopWidth: 1,
                      borderColor: "#888"
                    }}
                  >
                    {this.state.myorder.orderinfo.order_type == "delivery" &&
                      "DELIVERY ADDRESS"}
                    {this.state.myorder.orderinfo.order_type == "pickup" &&
                      "PICK UP INFORMATION"}
                    {this.state.myorder.orderinfo.order_type == "orderin" &&
                      "ORDER IN, SIT IN INFORMATION"}
                    {this.state.myorder.orderinfo.order_type == "smoke" &&
                      "GIFT SHOP"}
                  </Text>
                  {this.state.myorder.orderinfo.order_type == "pickup" && (
                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        paddingVertical: 10,
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Icon
                        type="FontAwesome"
                        name="user"
                        style={{ fontSize: RFPercentage(2.8) }}
                      ></Icon>
                      <Text
                        style={{
                          textAlign: "left",
                          color: "#000",
                          fontSize: RFPercentage(2.5),
                          marginLeft: 5
                        }}
                      >
                        {this.state.myorder.customerinfo.fname +
                          " " +
                          this.state.myorder.customerinfo.lname}
                      </Text>
                      {/* <Icon type="FontAwesome5" name='mobile-alt' style={{fontSize:RFPercentage(2.5), marginLeft:20,}}></Icon>
                  <Text style={{ textAlign:'left', color:'#000', fontSize:RFPercentage(2.5), marginLeft:5,}}>{this.state.myorder.customerinfo.contact}</Text> */}
                      {/* <Icon type="MaterialIcons" name='access-time' style={{fontSize:RFPercentage(2.8), marginLeft:20,}}></Icon>
                  <Text style={{ textAlign:'left', color:'#000', fontSize:RFPercentage(2.5), marginLeft:5,}}>{this.state.myorder.orderinfo.pickup_time.substring(0,16)}</Text> */}
                    </View>
                  )}
                  {this.state.myorder.orderinfo.order_type == "orderin" && (
                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        paddingVertical: 10,
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Icon
                        type="FontAwesome"
                        name="user"
                        style={{ fontSize: RFPercentage(2.8) }}
                      ></Icon>
                      <Text
                        style={{
                          textAlign: "left",
                          color: "#000",
                          fontSize: RFPercentage(2.5),
                          marginLeft: 5
                        }}
                      >
                        {this.state.myorder.customerinfo.fname +
                          " " +
                          this.state.myorder.customerinfo.lname}
                      </Text>
                      {/* <Icon type="FontAwesome5" name='mobile-alt' style={{fontSize:RFPercentage(2.5), marginLeft:20,}}></Icon>
                  <Text style={{ textAlign:'left', color:'#000', fontSize:RFPercentage(2.5), marginLeft:5,}}>{this.state.myorder.customerinfo.contact}</Text> */}
                    </View>
                  )}
                  {this.state.myorder.orderinfo.order_type == "delivery" && (
                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        paddingVertical: 10,
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: RFPercentage(2.8)
                      }}
                    >
                      <Icon
                        type="FontAwesome"
                        name="user"
                        style={{ fontSize: RFPercentage(2.8) }}
                      ></Icon>
                      <Text
                        style={{
                          textAlign: "left",
                          color: "#000",
                          fontSize: RFPercentage(2.5),
                          marginLeft: 5
                        }}
                      >
                        {this.state.myorder.customerinfo.fname +
                          " " +
                          this.state.myorder.customerinfo.lname}
                      </Text>
                      <Icon
                        type="FontAwesome"
                        name="address-card"
                        style={{ fontSize: RFPercentage(2.8), marginLeft: 10 }}
                      ></Icon>
                      <Text
                        style={{
                          textAlign: "left",
                          color: "#000",
                          fontSize: RFPercentage(2.8),
                          marginLeft: 10
                        }}
                      >
                        {this.state.myorder.customerinfo.street +
                          " " +
                          this.state.myorder.customerinfo.city +
                          " " +
                          this.state.myorder.customerinfo.state}
                      </Text>
                    </View>
                  )}
                  <Text
                    style={{
                      width: "100%",
                      paddingVertical: 10,
                      textAlign: "center",
                      backgroundColor: "#fff",
                      fontSize: RFPercentage(2.8),
                      borderBottomWidth: 1,
                      borderTopWidth: 1,
                      borderColor: "#888"
                    }}
                  >
                    BASKET SUMMERY
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      borderBottomWidth: 1,
                      paddingVertical: 10,
                      marginHorizontal: 10,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "left",
                        paddingLeft: 20,
                        fontSize: RFPercentage(3),
                        textAlignVertical: "center"
                      }}
                    >
                      Munchin Franks
                    </Text>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#fff",
                        height: RFPercentage(5),
                        marginLeft: "auto",
                        marginRight: 20,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                        borderWidth: 1,
                        paddingHorizontal: 10,
                        borderColor: "#cccccc"
                      }}
                      activeOpacity={0.7}
                      onPress={() => {
                        NavigationService.navigate("MyOrders");
                      }}
                    >
                      <Text
                        style={{
                          color: "#66ccdd",
                          fontSize: RFPercentage(2.8)
                        }}
                      >
                        Go to Orders
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      paddingVertical: 10,
                      marginHorizontal: 10
                    }}
                  >
                    {this.state.myorder.order_data.map((item, key) => {
                      return (
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            borderBottomColor: "#888",
                            borderBottomWidth: 0.7,
                            marginBottom: 10
                          }}
                          key={key}
                        >
                          <Text
                            style={{
                              textAlign: "left",
                              fontSize: RFPercentage(2.8),
                              flex: 3
                            }}
                          >
                            {" "}
                            {item.name}
                          </Text>
                          <Icon
                            type="AntDesign"
                            name="edit"
                            style={{
                              color: "#4ebdc8",
                              fontSize: RFPercentage(3)
                            }}
                          ></Icon>
                          <Text
                            style={{
                              textAlign: "left",
                              fontSize: RFPercentage(2.4),
                              marginLeft: 20
                            }}
                          >
                            {" "}
                            x{item.qty}{" "}
                          </Text>
                          <Text
                            style={{
                              textAlign: "right",
                              fontSize: RFPercentage(2.8),
                              flex: 1,
                              marginRight: 0
                            }}
                          >
                            {" "}
                            ${item.total}{" "}
                          </Text>
                        </View>
                      );
                    })}

                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        borderBottomColor: "#888",
                        borderTopWidth: 1,
                        borderTopColor: "#000",
                        marginBottom: 10,
                        paddingTop: 10
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
                          flex: 1,
                          marginRight: 0
                        }}
                      >
                        {" "}
                        ${this.state.myorder.orderinfo.sub_total}{" "}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        borderBottomColor: "#888",
                        borderBottomWidth: 0.7,
                        borderTopWidth: 1,
                        borderTopColor: "#000",
                        marginBottom: 10,
                        paddingTop: 10
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
                        TAX
                      </Text>
                      <Text
                        style={{
                          textAlign: "right",
                          fontSize: RFPercentage(2.8),
                          flex: 1,
                          marginRight: 0
                        }}
                      >
                        {" "}
                        ${this.state.myorder.orderinfo.tax_amount}{" "}
                      </Text>
                    </View>
                    {this.state.myorder.orderinfo.tip != undefined && (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          alignItems: "center",
                          borderBottomColor: "#888",
                          borderBottomWidth: 0.7,
                          marginBottom: 10
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
                          TIP
                        </Text>
                        <Text
                          style={{
                            textAlign: "right",
                            fontSize: RFPercentage(2.8),
                            flex: 1,
                            marginRight: 0
                          }}
                        >
                          {" "}
                          ${this.state.myorder.orderinfo.tip}{" "}
                        </Text>
                      </View>
                    )}
                    {this.state.myorder.orderinfo.order_type == "delivery" && (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          alignItems: "center",
                          borderBottomColor: "#888",
                          borderBottomWidth: 0.7,
                          marginBottom: 10
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
                          Delivery fee
                        </Text>
                        <Text
                          style={{
                            textAlign: "right",
                            fontSize: RFPercentage(2.8),
                            flex: 1,
                            marginRight: 0
                          }}
                        >
                          {" "}
                          ${this.state.myorder.orderinfo.delivery_charges}{" "}
                        </Text>
                      </View>
                    )}
                  </View>
                </ScrollView>
              </SafeAreaView>

              <View
                style={{
                  flexDirection: "row",
                  paddingVertical: 5,
                  marginHorizontal: 10,
                  marginBottom: 15,
                  borderTopWidth: 1
                }}
              >
                <Text
                  style={{
                    flex: 2,
                    textAlign: "left",
                    paddingLeft: 20,
                    fontSize: RFPercentage(3),
                    textAlignVertical: "center"
                  }}
                >
                  Total
                </Text>
                <Text
                  style={{
                    flex: 1,
                    textAlign: "right",
                    paddingRight: 20,
                    fontSize: RFPercentage(3),
                    textAlignVertical: "center"
                  }}
                >
                  $
                  {this.state.myorder.orderinfo.order_total != undefined
                    ? this.state.myorder.orderinfo.order_total
                    : this.state.myorder.orderinfo.total_amount}
                </Text>
              </View>
            </View>
          )}
        </ImageBackground>
      </View>
    );
  }
}
