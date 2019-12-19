import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import {Select, Option} from "react-native-chooser";
import Toast from 'react-native-root-toast'
import NavigationService from '../../NavigationService'
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize'

export default class SliderEntry extends Component {

    constructor(props){
        super(props);
        this.state={
            selectedPrice:-1,
            selecttypeText:"Please Select Size",
        }
    }
    
    convertText = (str) =>
    {
        str=str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g," ").replace(/<(.|\n)*?>/g, '').replace("\\","\"");
        return str;
    }

    
  getTypefromId = (id)=>{
    let type={};
    for(i=0;i<this.props.data.Prices.length;i++)
    {
      const element=this.props.data.Prices[i];
      if(element.attributes_id==id)
      {
        type=element;
        break;
      }
    }
    return type;
  }


    addTocart = ()=>{
            
        if(this.state.selectedPrice==-1)
        {
        Toast.show('Please select Size.', {
            position:Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
        });
        return;
        }

        const selectedType=this.getTypefromId(this.state.selectedPrice);
        let cartitem = {
            index:0,
            product_id:this.props.data.id,
            name:this.props.data.name,
            img:this.props.data.img,
            description:this.props.data.description,
            type:this.state.selectedPrice,
            type_name:selectedType.sizes+" "+selectedType.size,
            price:selectedType.price,
            product_type:1,
            quantity:1,
        };
        let attributes=[];

        cartitem={
        ...cartitem,
        attributes:attributes,
        };

        global.mycart.push(cartitem);
        
        NavigationService.navigate('Cart');
    }

    onSelect(value, label) {
        this.setState({
            selectedPrice:value,
            selecttypeText:label.join('')
        })
    }
    
    render () {
        let item=this.props.data;
        return (
        <View style={{flex:1, backgroundColor:'#000', height:'100%'}}>
          <Image  source={{uri:item.img}} resizeMode={'cover'} style={{width:'100%', height:'40%'}}></Image>
          <View style={{flex:1, backgroundColor:'#fff', flexDirection:'column'}}>
            <View style={{flex:4, alignItems:'center', alignContent:'center', justifyContent:'center', paddingHorizontal:20,}}>
              <Text style={{fontSize:RFPercentage(3), fontWeight:'bold', marginBottom:10, textAlign:'center'}}>{item.name}</Text>
              <Text style={{fontSize:RFPercentage(2.7), marginBottom:10,}}>{this.convertText(item.description)}</Text>

              <Select
                  onSelect = {this.onSelect.bind(this)}
                  defaultText={this.state.selecttypeText}
                  style = {{borderWidth : 1,borderColor:'#000', width:'100%', paddingVertical:3,}}
                  transparent={true}
                  backdropStyle={{backgroundColor:'rgba(0,0,0,0.7)'}}
                  textStyle = {{fontSize:RFPercentage(2.7)}}
                  optionListStyle = {{backgroundColor : "#F5FCFF", width:'80%'}}
                >
                  {
                  item.Prices.map((priceitem, key) => {
                    return(
                      <Option key={key} value = {priceitem.attributes_id}>{this.convertText(priceitem.sizes)} {this.convertText(priceitem.size)}   ${priceitem.price}</Option>
                    )
                    })
                  }
              </Select>

            </View>
            <View style={{flex:3, alignItems:'center', alignContent:'center', justifyContent:'center'}}>
              <TouchableOpacity activeOpacity={0.8} style={{width:'90%', borderWidth:1, borderRadius:10, height:RFPercentage(4), alignItems:'center', alignContent:'center', justifyContent:'center'}} onPress={()=>{this.addTocart();}}>
                <Text style={{fontSize:RFPercentage(2.5)}}>Add to Cart</Text>
              </TouchableOpacity>
              {item.is_customizable=="1"&&
              <TouchableOpacity style={{width:'90%', borderWidth:1, borderRadius:10, height:RFPercentage(4), alignItems:'center', alignContent:'center', justifyContent:'center', marginTop:10}} activeOpacity={0.8} onPress={()=>{
                NavigationService.navigate("Product", {product_id:item.id, type:1});
              }}>
                <Text style={{fontSize:RFPercentage(2.5)}}>Customize it</Text>
              </TouchableOpacity>}
            </View>
          </View>
        </View>
        )
    }
}