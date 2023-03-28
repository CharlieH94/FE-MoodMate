import React, { useContext } from 'react';
import { useForm, useController } from 'react-hook-form';
import { Text, TextInput, View, Alert, StyleSheet, Button } from 'react-native';
import { AuthContext } from '../App';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Input = ({ name, control, secureTextEntry }) => {
    const {field, } = useController({
        control,
        defaultValue: '',
        name,
    });
    return (
        <TextInput
            value={field.value}
            onChangeText={field.onChange}
            secureTextEntry={secureTextEntry}
            style={styles.field} 
        />
    )
}

export default function SignUpForm() {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const { setUser } = useContext(AuthContext);
    
    const onSubmit = (data) => {
        const { firstName, lastName, email, password, confirmPassword } = data;
        console.log(data);
        if (confirmPassword !== ''&&
            email !== '' &&
            firstName !== '' &&
            lastName !== '' &&
            password !== '') {
            
            setUser(true);
        }
        else { alert("Input details!") }
    };
  
    return (
        <KeyboardAwareScrollView style={styles.layout}>
            <Text>First Name</Text>
            <Input name='firstName' control={control} secureTextEntry={false} />
            <Text>Last Name</Text>
            <Input name='lastName' control={control} secureTextEntry={false} />
            <Text>Email</Text>
            <Input name='email' control={control} secureTextEntry={false} />
            <Text>Password</Text>
            <Input name='password' control={control} secureTextEntry={true} />
            <Text>Confirm Password</Text>
            <Input name='confirmPassword' control={control} secureTextEntry={true} />
            <Button title="Submit & Login" onPress={handleSubmit(onSubmit)} />
        </KeyboardAwareScrollView>
  );
}

  const styles = StyleSheet.create({
    layout: {
      flex: 1,
    //   justifyContent: 'center',
    //   alignItems: 'center',
    },
      title: {
          fontSize: 32,
          marginBottom: 16,
          padding: 64,
      },
      field: {
          backgroundColor: 'silver'
      }
});