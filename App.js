import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Button,
    Alert,
    TouchableOpacity,
    Platafrom
} from 'react-native';
import image from './assets/Ruby.png';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from 'anonymous-files';


const App = () => {

    const [selectedImage, setSelectedImage] = useState(null)

    let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false){
        alert('Permission to access camera is required');
        return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync()

    if(pickerResult.cancelled === true){
        return;
    }

    if(Platafrom.OS === 'web'){
        const remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri)
        setSelectedImage({localUri: pickerResult.uri, remoteUri})
    }else{
     setSelectedImage({localUri: pickerResult.uri})
    }
    };

    const openShareDialog = async () => {
        if(!(await Sharing.isAvailableAsync())){
            alert("Sharing is not Available in Your Platafrom");
            return;
        }
        await Sharing.shareAsync(selectedImage.localUri);
    };

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Pick an Image</Text>
            <TouchableOpacity onPress={openImagePickerAsync}>
                <Image
                    source={{
                        uri:
                            selectedImage !== null
                            ? selectedImage.localUri
                            : 'https://picsum.photos/200/200'
                        }}
                    style={styles.image}
                    />
            </TouchableOpacity>
            {selectedImage ? (
                <TouchableOpacity
                    style={styles.button}
                    onPress={openShareDialog}
                >
                    <Text>Share</Text>
                </TouchableOpacity>
                ) : (
                  <View />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex:1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#292929"
    },
    title: {
        fontSize: 30,
        color: "#fff"
    },
    image: {
        height: 200,
        width: 200,
        borderRadius: 100,
        resizeMode: 'contain'
    },
    button: {
        alignItems: "center",
        padding: 10,
        backgroundColor: "#841584",
        borderRadius: 5,
        marginTop: 10
    },
});

export default App;
