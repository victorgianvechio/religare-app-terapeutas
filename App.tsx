import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
// import axios from 'axios';

import { API } from './api';

interface uploadData {
  data: {
    status: boolean,
    file: {
      fieldname: string,
      originalname: string,
      encoding: string,
      mimetype: string,
      size: number,
      bucket: string,
      key: string,
      acl: string,
      contentType: string,
      contentDisposition: string,
      storageClass: string,
      serverSideEncryption: string,
      metadata: string,
      location: string,
      etag: string,
    }
  }
}

const uploadS3 = async (uri: String | Blob) => {
  // const API_URL = 'http://192.168.86.8:8080/api/v1/upload';

  const uriParts = uri.toString().split('.');
  const fileType = uriParts[uriParts.length - 1];

  const formData = new FormData();
  formData.append('upload', {
    uri,
    name: `terapeuta_id.${fileType}`,
    type: `video/${fileType}`,
  });

  const options = {
    headers: {
      Accept: 'application/json',
      "Content-Type": `multipart/form-data`,
    }
  }

  try {
    // const response = await axios.post(API_URL, formData, options);
    const response = await API().post<uploadData>('/upload', formData, options)
    console.log(response.data);
  }
  catch(err) {
    console.log(err)
  }
}

const uploadFile = async () =>{
  const result = await DocumentPicker.getDocumentAsync({
    type: '*/*',
    copyToCacheDirectory: true,
    multiple: true,
  });
}

const uploadVideo = async () => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (permissionResult.granted === false) {
    alert("A permissão para acessar o rolo da câmera é necessária!");
    return;
  }

  const pickerResult = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Videos, //All
    assetsType: 'video',//['photo', 'video'],
    allowsEditing: true,
  });

  if(pickerResult.cancelled === true) return;

  uploadS3(pickerResult.uri);
}

export default function App() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => uploadFile()}>
        <Text style={styles.buttonText}>Escolher PDF</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => uploadVideo()}>
        <Text style={styles.buttonText}>Escolher Vídeo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 150,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#00AEBF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  buttonText: {
    color: '#FFF',
  }
});
