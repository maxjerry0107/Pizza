import React, {Component} from 'react';
import {View,  ImageBackground,StatusBar,Image,Text,BackHandler,Alert, SafeAreaView,TouchableOpacity,ScrollView} from 'react-native';
import NavigationService from '../../NavigationService'

export default class Temp extends Component { 

  constructor(props){
    super(props);
  }
    render() {
      return (
        <View style={{flex:1, backgroundColor:'#fff'}}>
          
          <ImageBackground source={require('../assets/images/sign/bg.png')} style={{width:'100%', height:'100%', resizeMode:'repeat'}}>
            
          <SafeAreaView style={{width:'100%', height:100, borderWidth:3,}}>

          </SafeAreaView>  
<View style={{flex:1, borderWidth:1, borderColor:'#f00', backgroundColor:'#fff'}}></View>
<ImageBackground source={require('../assets/images/intro/bg_footer.png')} style={{width:'100%', height:100, resizeMode:'repeat'}}>
          
          <SafeAreaView style={{width:'100%',  height:'100%',borderWidth:3,}}>
          
</SafeAreaView>  

</ImageBackground> 
          </ImageBackground>      
        </View>
        
      );
    }
  }
  
