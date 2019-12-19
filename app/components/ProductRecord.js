import React, {Component} from 'react';
import {View,  Image,Text,Dimensions,TouchableOpacity,ImageBackground} from 'react-native';

import {RFPercentage, RFValue} from 'react-native-responsive-fontsize'
import { Icon } from 'native-base';
var {height, width} = Dimensions.get('window');

export default class ProductRecord extends Component { 
    constructor () {
        super()
        this.state = {
            showButton:true,
            count:0,
        }
    }

    setCount = (num)=>{
        this.setState({count:num});
        this.props.onCountChange(num);
    }
    render () {
    console.log(this.props.data);
return (
    <ImageBackground source={require('../assets/images/sign/bg.png')} style={{flex:1, paddingTop:0, resizeMode:'repeat'}}>
    <View style={{flex:1, backgroundColor:'rgba(0,0,0,0)', flexDirection:'row', padding:5, borderBottomWidth:1, borderBottomColor:'grey'}}>
        <View style={{flex:3, flexDirection:'row', alignItems:'center'}}>            
            {/* <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Image style={{width:'90%',height:width/6}} resizeMode={'contain'} source={{uri:this.props.data.img}}/>
            </View> */}
            <View style={{flexDirection:'column',paddingLeft:10, backgroundColor:'rgba(0,0,0,0)',justifyContent:'flex-start',}}>
                <Text style={[{  fontSize:RFPercentage(2.5), fontWeight:'bold'},this.state.count!=0?{color:'#0a0',}:{color:'#a00'}]}>{this.props.data.name}</Text>
                {/* <Text style={[{fontSize:14, fontWeight:'bold'},this.state.count!=0?{color:'#0a0',}:{color:'#a00'}]}>  {this.props.data.description}
                </Text>                 */}
                <Text style={[{ fontSize:RFPercentage(2.4), fontWeight:'bold'},this.state.count!=0?{color:'#0a0',}:{color:'#a00'}]}>Cost:${this.props.data.cost}    X{this.state.count.toString()}
                </Text>
            </View>
            {this.state.count!=0&&
            <Icon type={"AntDesign"} name="check" style={{fontSize:RFPercentage(4), color:'#0a0', marginLeft:RFPercentage(3)}} />
    }
        </View>
         <View style={{flex:1.5, marginRight:10,alignItems:'center', justifyContent:'center'}}>
             {this.state.showButton&&
             <View style={{flex:1, justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
            <TouchableOpacity style={[{padding:5, borderBottomLeftRadius:10,borderTopLeftRadius:10},this.state.count==1?{backgroundColor:'#008c62'}:{backgroundColor:'#8a0400'}]}><Text style={{color:'#fff', fontSize:RFPercentage(2.5)}} onPress={()=>this.setCount(1)}>Yes</Text></TouchableOpacity>
            <TouchableOpacity style={[{ padding:5,},this.state.count==0?{backgroundColor:'#008c62'}:{backgroundColor:'#8a0400'}]} onPress={()=>this.setCount(0)}><Text style={{color:'#fff', fontSize:RFPercentage(2.5), }}>No</Text></TouchableOpacity>
            <TouchableOpacity style={[{padding:5, borderBottomRightRadius:10,borderTopRightRadius:10},this.state.count>1?{backgroundColor:'#008c62'}:{backgroundColor:'#8a0400'}]} onPress={()=>this.setCount(this.state.count+1)}><Text style={{color:'#fff', fontSize:RFPercentage(2.5), }}>Extra</Text></TouchableOpacity>
            </View>
             }
         </View>
    </View>
    </ImageBackground>
)}
}