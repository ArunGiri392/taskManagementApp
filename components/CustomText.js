// CustomTextInput.js

import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {theme} from '../constants/theme';

const color = theme.colors.primaryColor
const CustomText = ({ icon='email', placeholder='Email', value, onChangeText, secureTextEntry=false,keyboardType='default', onBlur, customStyle, editable=true }) => {
    
    return (
    <View style={styles.container}>
      {icon && <Icon name={icon} size={24} color={color} style={styles.icon} />}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onBlur={onBlur}
        editable={editable}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: color,
    borderRadius: 8,
    padding: 10,
    marginVertical: '3%',
    shadowColor: color,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    width:'85%'
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: color,
  },
});

export default CustomText;
