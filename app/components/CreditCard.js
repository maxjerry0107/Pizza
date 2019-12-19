import React, {Component} from 'react';
import {View,  ImageBackground,StatusBar,Image,Text,BackHandler,Alert, FlatList,TouchableOpacity,KeyboardAvoidingView} from 'react-native';
import NavigationService from '../../NavigationService'
import { SafeAreaView } from 'react-navigation';
import {Icon} from 'native-base'
import axios from './Axios'
import smoke_api from './Smoke_Axios'
import Toast from 'react-native-root-toast'
import DeviceInfo from 'react-native-device-info';
import Spinner from 'react-native-loading-spinner-overlay';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {CreditCardInput} from 'react-native-credit-card-input'

export default class CreditCard extends Component { 

  constructor(props){
    super(props);
    this.state={
      cardData:null,
      loading:false,
    }
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount = ()=>{
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  goCheckOut(){

    if(this.state.cardData.valid != true )
    {
      Toast.show('Please input valid card data!', {
        position:Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
      return;
    }
    
    global.signup.payment_method="card";

    console.log({
      orderinfo: JSON.stringify(global.signup),
      orderdata: JSON.stringify(global.mycart),
      carddata: JSON.stringify(this.state.cardData.values),
    })

    this.setState({loading:true,});
    axios.post('form.php', {
      orderinfo: JSON.stringify(global.signup),
      orderdata: JSON.stringify(global.mycart),
      carddata: JSON.stringify(this.state.cardData.values),
    })
      .then(response => {              
      let res=response.data;
      console.log(res);
        this.setState({loading:false,});
        if(res.status == true)
        {
          Toast.show('Success!\n' + res.description, {
            position:Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            onHidden: () => {
              global.signup=[];
              global.mycart=[];
              NavigationService.navigate("OrderTracking",{orderid:res.orderID, product_type:1});
            }
          });
        }else{            
          Toast.show('Try again!', {
            position:Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
        Toast.show('Try again!', {
          position:Toast.positions.CENTER,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
      });
  }

  handleBackButtonClick() {
    this.props.navigation.goBack();
    return true;
  }

  

    render() {
      return (
        <KeyboardAvoidingView style={{flex:1, backgroundColor:'#fff'}}>
          <StatusBar hidden />
          <Spinner color={'#000'}
            visible={this.state.loading} 
            textContent={'Loading...'}
            textStyle={{color:'#000'}}
          />
          <ImageBackground source={require('../assets/images/sign/bg.png')} style={{width:'100%', height:'100%', resizeMode:'repeat'}}>
            <SafeAreaView  style={{width:'100%', flex:1, paddingTop:0,}}>
              <TouchableOpacity style={{width:'100%', height:RFPercentage(10),alignItems:'center', }} activeOpacity={0.8} onPress={()=>this.props.navigation.goBack()}>
                <Image source={require('../assets/images/menu/menu_header.png')} style={{height:'80%', width:'70%',}} resizeMode={"contain"}></Image>
                <Text style={{color:'#000',fontSize:RFPercentage(3), position:'absolute', bottom:0, fontWeight:'bold'}}>Credit Card</Text>
              </TouchableOpacity> 
                <View style={{flex:1, alignItems:'center', justifyContent:'center', paddingTop:RFPercentage(2)}}>
                  <CreditCardInput 
                    autoFocus
                    requiresName
                    requiresCVC
                    ref = {(c)=>this._card=c}
                    onChange = {(formData)=>{
                      this.setState({cardData:formData})
                    }} />
                </View>
            </SafeAreaView>
            <SafeAreaView style={{width:'100%',padding:RFPercentage(1), backgroundColor:'#eeffff'}}>
                <TouchableOpacity activeOpacity={0.7} style={{height:RFPercentage(8), backgroundColor:'#43bc55',borderRadius:8, alignItems:'center', justifyContent:'center',}} onPress={()=>{
                  this.goCheckOut();
                }}>
                  <Text style={{ color:'#fff', fontSize:RFPercentage(2.8), textAlign:'center', textAlignVertical:'center',  }}>
                    Continue to Checkout.
                  </Text>
                </TouchableOpacity>
                </SafeAreaView>
          </ImageBackground>
        
        </KeyboardAvoidingView>
        
      );
    }
  }
  
