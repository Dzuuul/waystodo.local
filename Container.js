import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext, useEffect, useState } from "react";
import FlashMessage from "react-native-flash-message";
import Spinner from "react-native-loading-spinner-overlay";
import { UserContext } from "./context/UserContext";
import Auth from "./src/screen/Auth";
import Register from "./src/screen/Register";
import Login from "./src/screen/Login";
import Home from "./src/screen/Home";
import AddCategory from "./src/screen/AddCategory";
import AddList from "./src/screen/AddList";
import DetailList from "./src/screen/DetailList";

function Container() {
  const NativeStack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const [state, dispatch] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  async function checkAuth() {
    try {
      let token = await AsyncStorage.getItem("token");

      if (token) setAuthorization(token);

      await API.post("/auth/verify-token", {
        validateStatus: () => true,
      })
        .then((response) => {
          if (response.status >= 400) {
            return dispatch({
              type: "AUTH_ERROR",
            });
          }

          const payload = response.data;
          dispatch({
            type: "AUTH_SUCCESS",
            payload,
          });
        })
        .catch((error) => {
          dispatch({
            type: "AUTH_ERROR",
          });
        });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  async function isAsyncTokenExist() {
    await AsyncStorage.getItem("token");
    checkAuth();
  }

  useEffect(() => {
    isAsyncTokenExist();
  }, []);

  function BottomTab() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarLabel: () => {
            return null;
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconType;
            let iconName;
            let iconColor;
            if (route.name === "Home") {
              iconType = "fa5";
              iconName = "clipboard-list";
              iconColor = focused ? "#FF5555" : "#D9D9D9";
            }
            if (route.name === "AddList") {
              iconType = "material-icon";
              iconName = "playlist-add";
              iconColor = focused ? "#FF5555" : "#D9D9D9";
            }
            if (route.name === "AddCategory") {
              iconType = "material-icon";
              iconName = "category";
              iconColor = focused ? "#FF5555" : "#D9D9D9";
            }

            return iconType == "fa5" ? (
              <FontAwesome5 name={iconName} size={size} color={iconColor} />
            ) : (
              <MaterialIcons name={iconName} size={size} color={iconColor} />
            );
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="AddList"
          component={AddList}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="AddCategory"
          component={AddCategory}
          options={{
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    );
  }
  return (
    <>
      {isLoading ? (
        <Spinner visible={isLoading} />
      ) : state.isLogin ? (
        <>
          <NativeStack.Navigator initialRouteName="Main">
            <NativeStack.Screen
              name="Main"
              component={BottomTab}
              options={{
                headerShown: false,
              }}
            />
            <NativeStack.Screen
              name="DetailList"
              component={DetailList}
              options={{
                headerShown: false,
              }}
            />
          </NativeStack.Navigator>
        </>
      ) : (
        <>
          <NativeStack.Navigator initialRouteName="Welcome">
            <NativeStack.Screen
              name="Auth"
              component={Auth}
              options={{
                headerShown: false,
              }}
            />
            <NativeStack.Screen
              name="Login"
              component={Login}
              options={{
                headerShown: false,
              }}
            />
            <NativeStack.Screen
              name="Register"
              component={Register}
              options={{
                headerShown: false,
              }}
            />
          </NativeStack.Navigator>
        </>
      )}
      <FlashMessage position="top" />
    </>
  );
}

export default Container;
