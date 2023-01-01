import { Box, Button, Image, Input, Text } from "native-base";
import { useState } from "react";
import { showMessage } from "react-native-flash-message";
import { useMutation } from "react-query";
import AuthImage from "../../assets/auth.png";
import { API } from "../../config/api";

function Register({ navigation }) {
  const [dataRegister, setDataRegister] = useState({
    email: "",
    firstName: "",
    password: "",
  });

  function handleChangeText(name, value) {
    setDataRegister({
      ...dataRegister,
      [name]: value,
    });
  }

  const handleSubmit = useMutation(async (e) => {
    e.preventDefault();
    try {
      if (
        dataRegister.email.trim() === "" ||
        dataRegister.email.trim() === null
      ) {
        return showMessage({
          message: "Register failed",
          description: "Email must be filled!",
          type: "danger",
        });
      }

      if (
        dataRegister.firstName.trim() === "" ||
        dataRegister.firstName.trim() === null
      ) {
        return showMessage({
          message: "Register failed",
          description: "Name must be filled",
          type: "danger",
        });
      }

      if (dataRegister.password === "" || dataRegister.password === null) {
        return showMessage({
          message: "Register failed",
          description: "Password must be filled",
          type: "danger",
        });
      }

      const response = await API.post(
        "/auth/register",
        {
          email: dataRegister.email.trim(),
          firstName: dataRegister.firstName.trim(),
          password: dataRegister.password,
        },
        {
          validateStatus: () => true,
        }
      );

      if (response.status >= 400) {
        return showMessage({
          message: "Register failed!",
          description: `${response.data.message}`,
          type: "danger",
        });
      }

      showMessage({
        message: "Register Success",
        type: "success",
      });

      navigation.navigate("Login");
    } catch (err) {
      showMessage({
        message: "Register failed",
        description: `${err}`,
        type: "danger",
      });
    }
  });

  return (
    <Box display="flex" flex={1} alignItems="center" bg="white">
      <Image
        source={AuthImage}
        width={275}
        height={275}
        resizeMode="contain"
        alt="Auth"
      />
      <Box display="flex" w={"90%"}>
        <Text fontWeight="bold" fontSize={30}>
          Register
        </Text>
        <Box display="flex" w={"100%"} mt={5} alignItems="center">
          <Input
            w={"100%"}
            bg="muted.200"
            placeholder="Name"
            py={3}
            mt={5}
            fontSize={15}
            borderRadius="sm"
            borderColor="muted.500"
            onChangeText={(value) => handleChangeText("firstName", value)}
            value={dataRegister?.firstName}
          />
          <Input
            w={"100%"}
            bg="muted.200"
            placeholder="Email"
            py={3}
            mt={5}
            keyboardType={"email-address"}
            fontSize={15}
            borderRadius="sm"
            borderColor="muted.500"
            onChangeText={(value) => handleChangeText("email", value)}
            value={dataRegister?.email}
          />
          <Input
            w={"100%"}
            bg="muted.200"
            placeholder="Password"
            py={3}
            mt={5}
            fontSize={15}
            secureTextEntry={true}
            borderRadius="sm"
            borderColor="muted.500"
            onChangeText={(value) => handleChangeText("password", value)}
            value={dataRegister?.password}
          />
          <Button
            w={"100%"}
            mt={5}
            bg="error.500"
            _hover={{ backgroundColor: "error.600" }}
            py={3}
            _text={{
              fontSize: "md",
              fontWeight: "bold",
            }}
            onPress={(e) => handleSubmit.mutate(e)}
          >
            Register
          </Button>
          <Text mt={3}>
            Joined us before ?
            <Text
              color="danger.500"
              fontWeight="bold"
              mx={2}
              onPress={() => navigation.navigate("Login")}
            >
              Login
            </Text>
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

export default Register;
