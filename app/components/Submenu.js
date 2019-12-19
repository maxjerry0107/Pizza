import React, {Component} from 'react';
import {View,  ImageBackground,StatusBar,Image,Dimensions,Text,TouchableOpacity,FlatList,TextInput,ScrollView, BackHandler} from 'react-native';
import {StyleSheet,SafeAreaView} from 'react-native'
import NavigationService from '../../NavigationService'
import {Item, Icon, Input,Button} from 'native-base'
import Carousel,{Pagination} from 'react-native-snap-carousel';
import Geolocation from '@react-native-community/geolocation';

import { NativeModules } from 'react-native';
var {height, width} = Dimensions.get('window');
import Toast from 'react-native-root-toast'
import axios from './Axios'
import Spinner from 'react-native-loading-spinner-overlay';
import SliderEntry from './SliderEntry';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize'


const styles = StyleSheet.create({
  imageStyle:{
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%', height:'100%', borderRadius:10
  }
});

export default class Submenu extends Component { 
  constructor(props){
    super(props);
    this.state={
      loading:true,
      sliderimages:[],
      serviceItems:[],
      menuname:"",
      keyword:"",
      slider1ActiveSlide:0,
    }
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  gotoLocation = () =>{
    Geolocation.getCurrentPosition(info => {      
      NativeModules.MapboxNavigation.navigate(
        info.coords.latitude,
        info.coords.longitude,
        global.pizza_location.lat,
        global.pizza_location.long
      );
    });    
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
    let keyword=this.props.navigation.getParam("keyword","");
    this.getList(keyword);
  }

  getList = (keyword)=>{
    this.setState({loading:true});
    this.setState({menuname:this.props.navigation.getParam("menuname","")});
    let catId=this.props.navigation.getParam("catId","");
    let url="";

    if(keyword=="")
    {
      url='?req=product-by-category&categories_id='+catId;
    }
    else
    {
      url='?req=product-search&categories_id='+catId+'&keyword='+keyword;
    }

    axios.get(url)
    .then(response => {
    let res=response.data;
    if(res.status==true)
    {
      console.log(res);
      this.setState({loading:false, sliderimages:res.sliders, serviceItems:res.products,});
      if(keyword!="")
        this.setState({menuname:"Search Results"});
      this._carousel.snapToItem(1); 
    }
    else
    {
      this.setState({loading:false, sliderimages:res.sliders, serviceItems:res.products,menuname:res.category_name});
      if(keyword!="")
        this.setState({menuname:"Search Results"});
      Toast.show('No data.', {
        position:Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }
  })
  .catch(function (error) {
    Toast.show('Can\'t connect to server.', {
      position:Toast.positions.TOP,
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


_renderItem ({item, index}) {
  return (
    <SliderEntry data={item} key={index}/>
  );
}

setActiveSlide(index) {
  console.log(index);
  this.setState({slider1ActiveSlide:index});
}

searchProduct = (keyword)=>{
  this.getList(keyword);
}
    render() {
      return (
        <View style={{flex:1, backgroundColor:'#eeffff'}}>
          <ImageBackground source={require('../assets/images/sign/bg.png')} style={{width:'100%', height:'100%',  paddingTop:10, resizeMode:'repeat'}}>
           <StatusBar hidden />
          <Spinner color={'#000'}
            visible={this.state.loading} 
            textContent={'Loading...'}
            textStyle={{color:'#000'}}
          />
          <SafeAreaView style={{width:'100%', flex:1,}}>
            <TouchableOpacity style={{width:'100%', height:RFPercentage(10),alignItems:'center', }} activeOpacity={0.8} onPress={()=>NavigationService.navigate("Menu")}>
               <Image source={require('../assets/images/menu/menu_header.png')} style={{height:'80%', width:'70%',}} resizeMode={"contain"}></Image>
               <Text style={{color:'#000',fontSize:RFPercentage(3), position:'absolute', bottom:0, fontWeight:'bold'}}>{this.state.menuname}</Text>         
              </TouchableOpacity>
          <View style={{flex:1, flexDirection:'column', alignItems:'center', backgroundColor:'#000'}}>
              <Carousel
                  ref={(c) => { this._carousel = c; }}
                  data={this.state.serviceItems}
                  renderItem={this._renderItem}
                  sliderWidth={width}
                  itemWidth={width*0.8} 
                  inactiveSlideScale={0.85}
                  inactiveSlideOpacity={0.5}
                  loop={true}
                  //firstItem={this.state.slider1ActiveSlide}
                  loopClonesPerSide={this.state.serviceItems.length}
                  autoplay={false} 
             //     onSnapToItem={(index) => {this.setActiveSlide(index);}}
              />
              
          </View>
          </SafeAreaView>
          <ImageBackground source={require('../assets/images/intro/bg_footer.png')} style={{width:'100%',}}>
            <SafeAreaView style={{backgroundColor:'transparent',flex:0}}>            
               <View style={{height:RFPercentage(10), width:'100%', alignItems:'center'}}>
                    <View style={{flex:1, flexDirection:'row'}}>
                      <TouchableOpacity style={{flex:1, padding:10, alignItems:'center'}} onPress={()=>NavigationService.navigate('Menu')}>
                        <Image source={require('../assets/images/menu.png')} style={{height:RFPercentage(7),}} resizeMode={'contain'}></Image>
                      </TouchableOpacity>
                      <TouchableOpacity style={{flex:1, padding:10, alignItems:'center'}} onPress={()=>NavigationService.navigate('Cart')}>
                        <Image source={require('../assets/images/cart.png')} style={{height:RFPercentage(7),}} resizeMode={'contain'}></Image>
                      </TouchableOpacity>
                      <TouchableOpacity style={{flex:1, padding:10, alignItems:'center'}} onPress={()=>NavigationService.navigate("MyOrders")}>
                        <Image source={require('../assets/images/order-s.png')} style={{height:RFPercentage(7),}} resizeMode={'contain'}></Image>
                      </TouchableOpacity>
                      <TouchableOpacity style={{flex:1, padding:10, alignItems:'center'}} onPress={()=>NavigationService.navigate("MyFavourites")}>
                        <Image source={require('../assets/images/fav.png')} style={{height:RFPercentage(7),}} resizeMode={'contain'}></Image>
                      </TouchableOpacity>
                      <TouchableOpacity style={{flex:1, padding:10, alignItems:'center'}} onPress={()=>this.gotoLocation()}>
                        <Image source={require('../assets/images/direc.png')} style={{height:RFPercentage(7),}} resizeMode={'contain'}></Image>
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
  
