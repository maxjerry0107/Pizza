import React, {Component} from 'react';
import {View,  Image,Text,Dimensions,TouchableOpacity} from 'react-native';
import InputSpinner from './myspinner';
import { Icon } from 'native-base';

import {RFPercentage, RFValue} from 'react-native-responsive-fontsize'
var {height, width} = Dimensions.get('window');

export default class Carditem extends Component { 

    cartitem_change_quantity = (num) =>{
        this.props.cartitem_change_quantity(num, this.props.data.index);
    }

render () {
    let data=this.props.data;
    console.log(data);
    return (
        <View style={{flex:1,backgroundColor:'#fff', marginVertical:5, marginHorizontal:5,flexDirection:'column'}}>
            <View style={{flex:1, flexDirection:'row',}}>
                <View style={{flex:1,padding:10,justifyContent:'center', alignItems:'center'}}>
                    <Image style={{width:'80%', height:RFPercentage(15), borderWidth:1, borderColor:'#0f0'}} resizeMode={'cover'} source={{uri:data.img}}/>
                </View>
                <View style={{flex:1.3, flexDirection:'column',padding:10,justifyContent:'space-between'}}>
                    <Text style={{ color:'#000', fontSize:RFPercentage(2.8), fontWeight:'bold',}}>{data.name}</Text>
                    <View style={{flexDirection:'row', alignItems:'stretch', }}>
                        <View style={{flexDirection:'column', flex:1}}>
                            <Text style={{ color:'#000', fontSize:RFPercentage(2.5), fontWeight:'bold', flex:1,}}>$ {data.price} 
                            </Text>
                            <Text style={{ color:'#000', fontSize:RFPercentage(2.2), fontWeight:'bold'}}>{data.type_name.replace("\\","\"")}
                            </Text>
                        </View>
                        <TouchableOpacity style={{alignSelf:'flex-end', marginRight:RFPercentage(2),}} onPress={()=>this.props.onitempress(data.index)}>
                            <Icon name="trash-o" type="FontAwesome" style={{fontSize:RFPercentage(3)}}></Icon>
                        </TouchableOpacity>
                    </View>
                    {data.attributes.length!=0&&
                    <Text style={{color:'#000', fontSize:RFPercentage(2.4)}}>
                        {data.attributes.map((attr,key)=>{
                            if(attr.count==1)
                                return "Yes "+attr.name+"\n";
                            else
                                return "Extra "+attr.name+"\n";
                           // return attr.name+"  $"+attr.cost+"  X"+attr.count+"\n";
                        })}  
                    </Text> 
                    }
                    <InputSpinner max={100} style={{borderWidth:1, borderColor:'#000', alignSelf:"flex-end", marginRight:RFPercentage(2)}}
                        min={1} types={true}
                        step={1} width={RFPercentage(10)} height={RFPercentage(3)}
                        color={"#000"}  onChange={(num)=>this.cartitem_change_quantity(num)}
                        textColor={"#000"} fontSize={RFPercentage(2.6)} inputStyle={{padding:0}}
                        showBorder={true} rounded={false} colorLeft={'#fff'} colorRight={'#fff'}
                        buttonTextColor={"#000"} buttonFontSize={RFPercentage(2.4)}
                        value={data.quantity}/>
                </View>
            </View>
            
        </View>
    )}
}