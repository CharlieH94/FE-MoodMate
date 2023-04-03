import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { useForm, useController } from "react-hook-form";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Button,
  // ActivityIndicator,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { loginUser } from "./../utils/api";
import { AuthContext } from "../contexts/User";
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import {Toast} from 'toastify-react-native';

interface Props {
  name: string;
  control: any;
  secureTextEntry: boolean;
}

const Input = (props: Props) => {
  const { name, control, secureTextEntry } = props;
  const { field } = useController({
    control,
    defaultValue: "",
    name,
  });
  return (
    <TextInput
      value={field.value}
      onChangeText={field.onChange}
      secureTextEntry={secureTextEntry}
      style={styles.field}
    />
  );
};

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { setUser } = useContext(AuthContext);
  const nav = useNavigation();

  const onSubmit = (data: any): void => {
    const { email, password } = data;

    if (email !== "" && password !== "") {
      setIsLoading(true);
      loginUser(data)
        .then(({ token, data: { user } }) => {
          const hasToken = token !== null;
          const { _id, firstname } = user;
          if (hasToken && _id !== null) {
            setUser({
              hasUser: true,
              userToken: token,
              userId: user._id,
              firstName: firstname,
            });
            setIsLoading(false);
          } else {
            throw new Error("Missing user data" );
          }
        })
        .catch((error) => {
          setIsLoading(false);
          if (error.response && error.response.status === 401) {
            Toast.warn("Incorrect email or password");
          } else {
            Toast.error(`Invalid login details`);
          }
        });
    } else {
      Toast.info("Input details");
    }
  };

  return isLoading ? (
    <View style={[styles.layout, { alignItems: "center" }]}>
      <Text style={{ fontSize: 16, paddingBottom: 16 }}>Signing In...</Text>
      <ActivityIndicator color={'#006D77'} />
    </View>
  ) : (
    <KeyboardAwareScrollView style={styles.layout}>
      <TouchableOpacity
        onPress={() => nav.navigate("Sign Up" as never)}
        style={styles.btn}
      >
        <Text style={{ textAlign: "center" }}>Sign Up</Text>
      </TouchableOpacity>
      <Text>Email</Text>
      <Input name="email" control={control} secureTextEntry={false} />
      <Text>Password</Text>
      <Input name="password" control={control} secureTextEntry={true} />
      <Button title="Login" onPress={handleSubmit(onSubmit)} />
      <Button title="Forgotten Password" onPress={() => {}} />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    margin: 24,
  },
  title: {
    fontSize: 32,
    marginBottom: 16,
    padding: 64,
  },
  field: {
    backgroundColor: "silver",
    marginTop: 4,
    marginBottom: 16,
    padding: 8,
  },
  btn: {
    alignSelf: "flex-end",
    borderRadius: 30,
    backgroundColor: "#60A9EE",
    width: 75,
    padding: 8,
  },
});
