import React, { useContext } from "react";
import { useForm, useController } from "react-hook-form";
import { Text, TextInput, View, StyleSheet, Button } from "react-native";
import { saveQuote } from "../utils/api";
import { AuthContext } from "../contexts/User";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Props {
  name: string;
  control: any;
  secureTextEntry: boolean;
  text?: string;
}

const Input = (props: Props) => {
  const { name, control, secureTextEntry, text } = props;
  const { field } = useController({
    control,
    defaultValue: text || "",
    name,
  });

  return (
    <TextInput
      value={field.value}
      onChangeText={field.onChange}
      secureTextEntry={secureTextEntry}
      style={styles.field}
      multiline={true}
    />
  );
};

export default function UploadForm({ text }: { text: string }) {
  // const { userToken } = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any): void => {
    const { quoteBody, author } = data;
    if (quoteBody !== "" && author !== "") {
      AsyncStorage.getItem("userToken")
        .then((userToken) => {
          AsyncStorage.getItem("userId")
            .then((userId) => {
              const quoteData = { ...data, user: userId };
              saveQuote(quoteData, userToken)
                .then((response) => {
                  // Handle successful quote save
                })
                .catch((error) => {
                  console.error(error);
                  // Handle error while saving quote
                });
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <View style={styles.form}>
      <Text>Detected Quote</Text>
      <Input
        name="quoteBody"
        control={control}
        secureTextEntry={false}
        text={text}
      />
      <Text>Author</Text>
      <Input name="author" control={control} secureTextEntry={false} />
      <Button title="Submit Quote" onPress={handleSubmit(onSubmit)} />
    </View>
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
    backgroundColor: "silver",
    height: 60,
    padding: 8,
  },
  form: {},
});
