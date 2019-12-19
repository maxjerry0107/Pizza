
import React, {Component} from 'react';
import {View,  ImageBackground,StatusBar,Image,TextInput,Text,TouchableOpacity,SafeAreaView, BackHandler, KeyboardAvoidingView} from 'react-native';
import {StyleSheet, Linking} from 'react-native'
import NavigationService from '../../NavigationService'
import { Header, Left, Title, Right, Content, Icon } from 'native-base';

import Toast from 'react-native-root-toast'


import {RFPercentage, RFValue} from 'react-native-responsive-fontsize'
import { ScrollView } from 'react-native-gesture-handler';
const styles = StyleSheet.create({
  btnStyle:{
    width:'70%', height:60, backgroundColor:'#f11', borderWidth:5, borderColor:'white', alignItems:'center', justifyContent:'center',
  },
  btnTextStyle:{
     fontSize:25, color:'white'
  },
  inputBoxView:{
    flex:1, flexDirection:'column', alignItems:'center', alignContent:'center', justifyContent:'center', paddingHorizontal:10
  },
  inputBoxView1:{
    flex:1, flexDirection:'row', alignItems:'center', alignContent:'center', justifyContent:'center', paddingHorizontal:10
  }
});


export default class DeliverySign extends Component { 
constructor (props){
  super(props);
  this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
}

componentWillUnmount() {
  BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
}

handleBackButtonClick() {
  this.props.navigation.goBack();
  return true;
}

componentDidMount = ()=>{
  BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
}
  deliverysignup = () => {

    var street=this._street._lastNativeText;
    var address="";
    var city=this._city._lastNativeText;
    var state=this._state._lastNativeText;
    var zipcode=this._zipcode._lastNativeText;
    var firstname=this._firstname._lastNativeText;
    var secondname=this._secondname._lastNativeText;
    var gatecode=this._gatecode._lastNativeText;

    if(street==undefined||city==undefined||state==undefined||zipcode==undefined||firstname==undefined||secondname==undefined)
    {
      Toast.show('Input information', {
        position:Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
      return;
    }
    global.signup={
      type:'delivery',
      data:{
        street:street,
        address:address,
        city:city,
        state:state,
        zipcode:zipcode,
        first:firstname,
        second:secondname,
        gatecode:gatecode,
        verifiedPhone:global.myphonenumber
      }
    };
    let return_url = this.props.navigation.getParam("return","");
    if(return_url == "")
      NavigationService.navigate('Menu')
    else
      this.props.navigation.goBack();
  }
  dialCall = () => {
 
    let phoneNumber = '';
  
    if (Platform.OS === 'android') {
      phoneNumber = 'tel:${2398888881}';
    }
    else {
      phoneNumber = 'telprompt:${2398888881}';
    }
  
    Linking.openURL(phoneNumber);
  };

    render() {
      return (
        <KeyboardAvoidingView style={{flex:1}} behavior="padding" >
          <StatusBar hidden />
          
        <ImageBackground source={require('../assets/images/sign/bg.png')} style={{ width: '100%', height: '100%' }}>
              <SafeAreaView style={{width:'100%', height:RFPercentage(15), alignItems:'center', paddingTop:0}}>
                <TouchableOpacity style={{width:'100%', height:'100%', alignItems:'center'}} onPress={()=>{
                  this.props.navigation.goBack();
                }}>
                  <Image source={require('../assets/images/menu/menu_header.png')} style={{height:'100%', width:'70%',}} resizeMode={"contain"}></Image>
                </TouchableOpacity>
              </SafeAreaView>
            <ScrollView style={{flex:1, flexDirection:'column', paddingVertical:10}}>
              <View style={{flex:1, alignContent:'center', alignItems:'center', flexDirection:'row'}}>
                <View style={{flex:1,  paddingLeft: '5%' }}>                  
                  <Image source={require('../assets/images/sign/marker.png')} style={{height:'70%',}} resizeMode={'contain'}></Image>
                </View>
                <View style={{flex:5, borderLeftColor:'#808285', borderLeftWidth:1 , paddingHorizontal:RFPercentage(2),}}>
                <Text style={{color:'#000', fontSize: RFPercentage(2.5),  alignSelf:'center', }}>
                  WE NEED A LITTLE MORE INFO BEFORE WE START
                </Text>
                </View>
              </View>
              <View style={{flex:6, alignItems:'center', justifyContent:'center', flexDirection:'column',marginVertical:RFPercentage(1.5)}}>
                <View style={{width:'90%', height:'100%', backgroundColor:'#fff', borderRadius:RFPercentage(4),flexDirection:'column',
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.27,
                shadowRadius: 4.65,
                padding:RFPercentage(1.5),
                elevation: 6}}>
                  <View style={{flex:1, flexDirection:'row', alignItems:'center', alignContent:'center', justifyContent:'center'}}>
                    <TouchableOpacity style={{flex:1, flexDirection:'row', alignItems:'center', alignContent:'center', justifyContent:'center'}} activeOpacity={0.7} onPress={()=>{
                      NavigationService.navigate("PickupSign")
                    }}>
                      <View style={{width:'30%', height:'100%'}}>
                      <Image source={require('../assets/images/sign/pickup.png')} style={{width:'100%', height: '80%',}} resizeMode={'contain'}></Image>
                      </View>
                      <Text style={{ color: '#f00', fontSize: RFPercentage(3),}}>Pick Up</Text>
                    </TouchableOpacity>
                    <View style={{flex:1, flexDirection:'row', alignItems:'center', alignContent:'center', justifyContent:'center'}}>
                    <View style={{width:'30%', height:'100%'}}>
                    <Image source={require('../assets/images/sign/car_green.png')} style={{height:'70%',width:'100%'}} resizeMode={'contain'}></Image>
                    </View>
                    <Text style={{color:'#00a651', fontSize:RFPercentage(3),}}>DELIVERY</Text>
                    </View>
                  </View>
                  <View style={styles.inputBoxView}>
                  <View style={styles.inputBoxView1}>
                    <View style={{ flex: 3, flexDirection: 'column' }}>
                      <Text style={{ fontSize: RFPercentage(2),  color: '#000' }}>FIRST</Text>
                    </View>
                    <View style={{ flex: 2, flexDirection: 'column' }}>
                      <Text style={{ fontSize: RFPercentage(2),  color: '#000' }}>LAST</Text>
                    </View>
                  </View>
                  <View style={[styles.inputBoxView1, { flex: 1 }]}>
                    <View style={{ flex: 3, flexDirection: 'column', alignItems: 'flex-start', alignContent: 'center', justifyContent: 'center' }}>
                      <TextInput ref={(c)=>this._firstname=c}
                        style={{ borderWidth: 1,fontSize: RFPercentage(2), borderColor: '#000', borderRadius: 7, width: '95%', height: '100%', paddingVertical: 5, paddingLeft: 10, }}
                        placeholder="First name" placeholderTextColor={'#a7a9ac'}
                      ></TextInput>
                    </View>
                    <View style={{ flex: 2, flexDirection: 'column', alignItems: 'flex-end', alignContent: 'center', justifyContent: 'center' }}>
                      <TextInput ref={(c)=>this._secondname=c}
                        style={{ borderWidth: 1, fontSize: RFPercentage(2),borderColor: '#000', borderRadius: 7, width: '95%', height: '100%', paddingVertical: 5, paddingLeft: 10 }}
                        placeholder="Last name" placeholderTextColor={'#a7a9ac'}></TextInput>
                    </View>
                  </View>
                </View>
                  <View style={styles.inputBoxView}>
                    <View style={styles.inputBoxView1}>
                      <View style={{flex:3,flexDirection:'column'}}>
                        <Text style={{ fontSize: RFPercentage(2),    color:'#000'}}>Street addess</Text>
                      </View>
                      <View style={{flex:2,flexDirection:'column'}}>
                      </View>
                    </View>
                    <View style={[styles.inputBoxView1, {flex:1}]}>
                      <View style={{flex:3,flexDirection:'column', alignItems:'flex-start', alignContent:'center', justifyContent:'center'}}>
                        <TextInput ref={(c)=>this._street=c}
                           style={{borderWidth:1, fontSize: RFPercentage(2),  borderColor:'#000', borderRadius:7, width:'100%', height:'100%', paddingVertical:5, paddingLeft:10, }}
                          placeholder="Street addess" placeholderTextColor={'#a7a9ac'}
                        ></TextInput>
                      </View>
                      {/* <View style={{flex:2,flexDirection:'column',alignItems:'center', alignContent:'center', justifyContent:'center'}}>
                        <TextInput  ref={(c)=>this._address=c}
                          style={{borderWidth:1, borderColor:'#000', borderRadius:7, width:'95%', height:'100%', paddingVertical:5, paddingLeft:10, }}
                          placeholder="Apt/Ste/Rm" placeholderTextColor={'#a7a9ac'}></TextInput>
                      </View> */}
                    </View>
                  </View>
                  <View style={styles.inputBoxView}>
                    <View style={styles.inputBoxView1}>
                      <View style={{flex:3,flexDirection:'column'}}>
                        <Text style={{ fontSize: RFPercentage(2),    color:'#000'}}>City</Text>
                      </View>
                      <View style={{flex:2,flexDirection:'column'}}>
                        <Text style={{ fontSize: RFPercentage(2),    color:'#000'}}>State</Text>
                      </View>
                    </View>
                    <View style={[styles.inputBoxView1, {flex:1}]}>
                      <View style={{flex:3,flexDirection:'column', alignItems:'flex-start', alignContent:'center', justifyContent:'center'}}>
                        <TextInput ref={(c)=>this._city=c} 
                           style={{borderWidth:1,fontSize: RFPercentage(2),   borderColor:'#000', borderRadius:7, width:'95%', height:'100%', paddingVertical:5, paddingLeft:10, }}
                          placeholder="City" placeholderTextColor={'#a7a9ac'}
                        ></TextInput>
                      </View>
                      <View style={{flex:2,flexDirection:'column',alignItems:'flex-end', alignContent:'center', justifyContent:'center'}}>
                        <TextInput  ref={(c)=>this._state=c}
                          style={{borderWidth:1, fontSize: RFPercentage(2),  borderColor:'#000', borderRadius:7, width:'95%', height:'100%', paddingVertical:5, paddingLeft:10, }}
                          placeholder="XX" placeholderTextColor={'#a7a9ac'}></TextInput>
                      </View>
                    </View>
                  </View>
                  <View style={styles.inputBoxView}>
                    <View style={[styles.inputBoxView1]}>    
                      <View style={{flex:3,flexDirection:'column'}}>
                        <Text style={{ fontSize: RFPercentage(2),    color:'#000'}}>Zip code</Text>
                        </View>
                      <View style={{flex:2,flexDirection:'column'}}>
                        <Text style={{ fontSize: RFPercentage(2),    color:'#000'}}>Gate Code</Text>
                      </View>                  
                    </View>
                    <View style={[styles.inputBoxView1, {flex:1}]}>
                      <View style={{flex:3,flexDirection:'column', alignItems:'flex-start', alignContent:'center', justifyContent:'center'}}>
                        <TextInput ref={(c)=>this._zipcode=c} 
                            style={{borderWidth:1, fontSize: RFPercentage(2),  borderColor:'#000', borderRadius:7, width:'95%', height:'100%', paddingVertical:5, paddingLeft:10, }}
                          placeholder="xxxxx" placeholderTextColor={'#a7a9ac'}
                        ></TextInput>
                      </View>
                      <View style={{flex:2,flexDirection:'column', alignItems:'flex-end', alignContent:'center', justifyContent:'center'}}>
                        <TextInput ref={(c)=>this._gatecode=c} 
                            style={{borderWidth:1, fontSize: RFPercentage(2),  borderColor:'#000', borderRadius:7, width:'95%', height:'100%', paddingVertical:5, paddingLeft:10, }}
                          placeholder="xxxxx" placeholderTextColor={'#a7a9ac'}
                        ></TextInput>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.inputBoxView, { paddingRight: '10%',paddingLeft: '10%', marginVertical:RFPercentage(1.5),  flexDirection:'row' }]}>
                  <TouchableOpacity onPress={() => {
                      NavigationService.navigate("Intro")
                    }} activeOpacity={0.7}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{  color: '#939598',fontSize: RFPercentage(2),   marginRight: 3 }}>{"<"}</Text>
                      <Text style={{  color: '#f00',fontSize: RFPercentage(2),   }}>BACK</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{flex:1}}></View>
                  <TouchableOpacity onPress={() => {
                      this.deliverysignup();
                    }} activeOpacity={0.7}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{  color: '#f00',fontSize: RFPercentage(2),   }}>NEXT</Text>
                      <Text style={{  color: '#939598',fontSize: RFPercentage(2),   marginLeft: 3 }}>></Text>
                    </View>
                  </TouchableOpacity>
                </View>
                </View>
              </View>
              <View style={{flex:4, alignItems:'center', paddingTop:20, width:'100%',}}>
                <TouchableOpacity onPress={()=>this.dialCall()} style={{width:'100%', alignItems:'center'}} >
                <Image source={require('../assets/images/sign/delivery_phonenum.png')} style={{ width:'80%', height:RFPercentage(20)}} resizeMode={'contain'}></Image>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </ImageBackground>
        </KeyboardAvoidingView>
      );
    }
  }
  