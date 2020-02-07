import React, {Component} from 'react';
import {View,  ImageBackground,StatusBar,Image,Dimensions,Text,TouchableOpacity,FlatList,TextInput,ListView,ScrollView,BackHandler} from 'react-native';
import {StyleSheet} from 'react-native'
import NavigationService from '../../NavigationService'
import {Item, Icon, Input, Button} from 'native-base'
import Carousel,{Pagination} from 'react-native-snap-carousel';
import { NativeModules } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { SafeAreaView } from 'react-navigation';
import Toast from 'react-native-root-toast'
import axios from './Axios'
import Spinner from 'react-native-loading-spinner-overlay';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize'

var {height, width} = Dimensions.get('window');

export default class Menu extends Component { 

  constructor(props){
    super(props);
    this.state={
      loading:true,
      slider1ActiveSlide: 0,
      sliderimages:[],
      serviceItems:[],
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
    NavigationService.navigate("Intro");
    return true;
  }

  componentDidMount = ()=>{
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    axios.get('?req=category-list')
    .then(response => {
    let res=response.data;
    console.log(res);
    if(res.status==true)
    {
        this.setState({loading:false, sliderimages:res.sliders, serviceItems:res.cat_list})
    }
    else
    {
      Toast.show('Can\'t get Data from server. Try again.', {
        position:Toast.positions.CENTER,
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

  searchProduct = (keyword)=>{
    NavigationService.navigate("Submenu",{keyword:keyword});
  }
  
  setActiveSlide(index) {
    this.setState({slider1ActiveSlide:index});
  }

  _renderItem ({item, index}) {
    return (
        <View style={{flex:1, backgroundColor:'#000'}}>
          <ImageBackground source={{uri:item.img_url}} imageStyle={{resizeMode:'stretch'}} style={{width:'100%', height:'100%'}}>
            {/* <LinearGradient start={{x:0, y: 1}} end={{x: 0, y: 0.6}} colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0)']} style={{flex:1}}>
            </LinearGradient> */}
          </ImageBackground>
        </View>
    );
}

    render() {
      return (

        
      <View style={{flex:1, backgroundColor:'#eeffff'}}>
          <Spinner color={'#000'}
            visible={this.state.loading} 
            textContent={'Loading...'}
            textStyle={{color:'#000'}}
          />
          
          <StatusBar hidden />
          {/* <View style={{width:'100%', height:100,}}>
            <ImageBackground source={require('../assets/images/sign/bg.png')} style={{width:'100%', height:'100%', alignItems:'center', paddingTop:0, resizeMode:'repeat'}}>
              <SafeAreaView style={{width:'100%', alignItems:'center', paddingTop:0,}}>
                <Image source={require('../assets/images/menu/menu_header.png')} style={{height:'100%', width:'70%',}} resizeMode={"contain"}></Image>
                <Text style={{color:'#000',fontFamily:'Gotham-Black',fontSize:22, position:'absolute', bottom:5, fontWeight:'bold'}}>MUNCHIN MENU</Text>
              </SafeAreaView>
            </ImageBackground>
          </View> */}
          <View style={{flex:1, flexDirection:'column', alignItems:'center', paddingTop:0, width:'100%' }}>
            {/* <Item rounded style={{paddingLeft:10, height:40, width:'95%', borderColor:'#aaa',fontFamily:'Gotham-Medium', borderRadius:8, marginBottom:5, }}>
              <Icon active name='search' />
              <TextInput placeholder='Search For Products' style={{paddingVertical:0,}} onSubmitEditing={(event) => this.searchProduct( event.nativeEvent.text)} ref={(c)=>this._keyword=c}/>
            </Item> */}
            
               {/* <FlatList style={{marginBottom:0,width:'100%'}}
                data={this.state.serviceItems}
                renderItem={({ item, key}) => (
                  <TouchableOpacity activeOpacity={1} onPress={()=>{
                    if(item.active == "1")
                      NavigationService.navigate("Submenu",{menuname:item.name, catId:item.categories_id})
                    else
                    Toast.show('Coming Soon...', {
                      position:Toast.positions.CENTER,
                      shadow: true,
                      animation: true,
                      hideOnPress: true,
                      delay: 0
                    });
                  }} style={{flex:1, width:'100%', padding:0, marginVertical:-1}} key={key}>
                      <Image style={{width:'100%', height:'105%'}} 
                      source={ {uri:item.featured_img}}
                      >
                      </Image>
                  </TouchableOpacity>
                )}
                numColumns={1}
              /> */}
              {this.state.serviceItems.map((item, index)=>{
                return (
                <TouchableOpacity activeOpacity={1} onPress={()=>{
                    if(item.active == "1")
                      NavigationService.navigate("Submenu",{menuname:item.name, catId:item.categories_id})
                    else
                    Toast.show('Coming Soon...', {
                      position:Toast.positions.CENTER,
                      shadow: true,
                      animation: true,
                      hideOnPress: true,
                      delay: 0
                    });
                  }} style={{flex:1, width:'100%', padding:0, marginVertical:-1}} key={index}>
                      <Image style={{width:'100%', height:'105%'}} 
                      source={ {uri:item.featured_img}}
                      >
                      </Image>
                  </TouchableOpacity>);
              })

              }
            </View>
          
          <ImageBackground source={require('../assets/images/intro/bg_footer.png')} style={{width:'100%',}}>
            <SafeAreaView style={{backgroundColor:'transparent',flex:0, alignItems:'center', justifyContent:'center'}} forceInset={{bottom:'always', top:'never'}}>            
               <View style={{height:RFPercentage(10), width:'100%', alignItems:'center',}}>
                    <View style={{flex:1, flexDirection:'row', alignItems:'center'}}>
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
        </View>
      
      );
    }
  }
  
