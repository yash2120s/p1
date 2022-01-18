import * as React from 'react'
import {Button,View,Text,Platform, Alert} from 'react-native'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'

export default class PickImage extends React.Component{
state = {
    image:null,
}

componentDidMount(){
this.getPermissionAsync    
}

getPermissionAsync = async()=>{
if(Platform.OS!=='web'){
    const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if(status!=='granted'){
        alert('Sorry We need Camera roll Permission')
    }
}
}

_pickImage = async()=>{
    try{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.All,allowsEditing : true,aspect:[4,3],quality:1
        });
        if(!result.cancelled){
            this.setState({image:result.data});
            console.log(result.uri)
            this.uploadImage(result.uri)

        }
     }
     catch(E){
        console.log('It Works')
     }
}

uploadImage = async(uri)=>{
    const data = new FormData()
    let filename = uri.split('/')[uri.split('/').length - 1]
    let type = `image/${uri.split('.')[uri.split('.').length - 1]}`
    const fileToUpload = {
        uri:uri,
        name:filename,
        type:type,
    };

    data.append("digit",fileToUpload);
    fetch("https://f292a3137990.ngrok.io/predict-digit",{
        method:"POST",
        body:data,
        headers:{
            "content-type":"multipart/form-data"
        },

    })
      .then((response)=>response.json())
      .then((result)=>{
          console.log("Sucess:",result)
         })
      .catch((error)=>{
          console.console.error("Error:",error);
      })
 
}
render(){
    let{image} = this.state
    return(
        <View style = {{flex : 1 , alignItems: 'center',justifyContent:'center'}}>
            <Button title='Pick An Image from Camera roll' onPress={this._pickImage} />
        </View>
    )
}

}