import React, {Component} from 'react';
import {View,  ImageBackground,StatusBar,Image,Platform,Text,TouchableOpacity,Linking} from 'react-native';
import {StyleSheet} from 'react-native'
import NavigationService from '../../NavigationService'
import { SafeAreaView ,NativeModules} from 'react-native';
import { Button } from 'native-base';
import Geolocation from '@react-native-community/geolocation';


const styles = StyleSheet.create({
  btnStyle:{
    width:'75%', height:70, backgroundColor:'#f11', borderWidth:5, borderColor:'#f11', alignItems:'center', justifyContent:'center',
  },
  btnTextStyle:{
    fontFamily:'Raleway-Bold', fontSize:28, color:'white'
  }
});

export default class Intro extends Component { 
  componentDidMount = () =>{
    global.mycart=[];
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

  gotoLocation = () =>{
    Geolocation.getCurrentPosition(info => {      
      NativeModules.MapboxNavigation.navigate(
        info.coords.latitude,
        info.coords.longitude,
        26.4910765,
        -81.9426475
      );
    });    
  }

    render() {
      return (
        
        <View style={{flex:1}}>
          <StatusBar hidden />
          <ImageBackground source={require('../assets/images/intro/back1.png')} style={{width:'100%', height:'100%'}}>
            <SafeAreaView style={{flex:1}} forceInset={{bottom:'always', top:'always'}}>
              <ImageBackground source={require('../assets/images/intro/back2.png')} style={{width:'100%', height:'101%',}} imageStyle={{resizeMode:'stretch'}}>
              <View style={{flex:1, flexDirection:'column',paddingTop:10,}}>
                <View style={{flex:1, alignContent:'center', alignItems:'center', paddingTop:0, zIndex:8, }}>
                  <Image source={require('../assets/images/intro/intro_header.png')} resizeMode={'contain'} style={{height:'100%', width:'95%',zIndex:10}} ></Image>
                  <Image source={require('../assets/images/intro/satelite.png')} resizeMode={'contain'} style={{height:'90%', width:'58%',zIndex:8, position:'absolute', top:'65%', left:'-3%', zIndex:5,}} ></Image>
                </View>
                <View style={{flex:2, zIndex:1,flexDirection:'column'}}>
                  <View style={{flex:0.3, flexDirection:'column'}}>
                  </View>
                  <View style={{flex:2, flexDirection:'column', width:'100%', alignItems:'center', justifyContent:'space-evenly', flexDirection:'column',}}>
                    <TouchableOpacity style={styles.btnStyle} onPress={()=>{NavigationService.navigate('PickupSign')}} activeOpacity={0.8}>
                      <Text style={styles.btnTextStyle}>PICK UP</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnStyle} onPress={()=>{NavigationService.navigate('DeliverySign')}} activeOpacity={0.8}>
                      <Text style={styles.btnTextStyle}>DELIVERY</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnStyle}  onPress={()=>{NavigationService.navigate('OrderinSign')}} activeOpacity={0.8}>
                      <Text style={styles.btnTextStyle}>ORDER IN</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{flex:1, flexDirection:'column'}}>
                  </View>
                </View>
                
              </View>         
              </ImageBackground>
            </SafeAreaView>
            <ImageBackground source={require('../assets/images/intro/bg_footer.png')} style={{width:'100%',}}>
              <SafeAreaView style={{backgroundColor:'transparent',flex:0}}>            
               <View style={{height:60, width:'100%'}}>
                    <View style={{flex:1, flexDirection:'row'}}>
                      <TouchableOpacity style={{flex:1, padding:10, alignItems:'center'}} onPress={()=>NavigationService.navigate('Menu')}>
                        <Image source={require('../assets/images/menu.png')} style={{height:40,}} resizeMode={'contain'}></Image>
                      </TouchableOpacity>
                      <TouchableOpacity style={{flex:1, padding:10, alignItems:'center'}} onPress={()=>NavigationService.navigate('Cart')}>
                        <Image source={require('../assets/images/cart.png')} style={{height:40,}} resizeMode={'contain'}></Image>
                      </TouchableOpacity>
                      <TouchableOpacity style={{flex:1, padding:10, alignItems:'center'}} onPress={()=>NavigationService.navigate("MyOrders")}>
                        <Image source={require('../assets/images/order-s.png')} style={{height:40,}} resizeMode={'contain'}></Image>
                      </TouchableOpacity>
                      <TouchableOpacity style={{flex:1, padding:10, alignItems:'center'}} onPress={()=>NavigationService.navigate("MyFavourites")}>
                        <Image source={require('../assets/images/fav.png')} style={{height:40,}} resizeMode={'contain'}></Image>
                      </TouchableOpacity>
                      <TouchableOpacity style={{flex:1, padding:10, alignItems:'center'}} onPress={()=>this.gotoLocation()}>
                        <Image source={require('../assets/images/direc.png')} style={{height:40,}} resizeMode={'contain'}></Image>
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
  
