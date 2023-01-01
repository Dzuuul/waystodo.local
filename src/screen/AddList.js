import {
  Box,
  Button,
  Input,
  Select,
  Text,
  TextArea,
  Pressable,
  HStack,
} from "native-base";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { showMessage } from "react-native-flash-message";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "react-query";
import { API } from "../../config/api";

function AddList({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [text, setText] = useState("Choose Date");

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);

    const tempDate = new Date(currentDate);
    const formatDate =
      tempDate.getDate() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getFullYear();
    setText(formatDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const [dataList, setDataList] = useState({
    name: "",
    date: date,
    description: "",
    category_id: "",
    is_done: 0,
  });

  let { data: list, refetch: listRefetch } = useQuery(
    "listCaches",
    async () => {
      let listResponse = await API.get("/List");
      return listResponse.data;
    }
  );

  let { data: category, refetch: categoryRefetch } = useQuery(
    "categoryCaches",
    async () => {
      let categoryResponse = await API.get("/Category");
      return categoryResponse.data;
    }
  );

  function handleChangeText(name, value) {
    setDataList({
      ...dataList,
      [name]: value,
    });
  }

  const handleSubmit = useMutation(async (e) => {
    e.preventDefault();
    try {
      if (dataList.name.trim() == "" || dataList.name.trim() == null) {
        return showMessage({
          message: "List name must be filled!",
          type: "danger",
        });
      }
      if (dataList.date == null || dataList.date == "") {
        return showMessage({
          message: "List date must be filled!",
          type: "danger",
        });
      }
      if (dataList.description == "" || dataList.description == null) {
        return showMessage({
          message: "List description must be filled!",
          type: "danger",
        });
      }
      if (dataList.category_id == "" || dataList.category_id == null) {
        return showMessage({
          message: "List Category must be filled",
          type: "danger",
        });
      }

      console.log(onChangeDate);

      const listData = {
        name: dataList.name,
        date: date,
        description: dataList.description,
        category_id: dataList.category_id,
        is_done: 0,
      };
      const response = await API.post("/List", listData);
      showMessage({
        message: "Success to add list!",
        type: "success",
      });
      setDataList({
        name: "",
        date: date,
        description: "",
        category_id: "",
        is_done: 0,
      });

      listRefetch();
      navigation.navigate("Main");
    } catch (err) {
      showMessage({
        message: "Failed to add List!",
        type: "danger",
      });
    }
  });

  return (
    <Box
      display="flex"
      flex={1}
      bg="white"
      px={3}
      py={5}
      w={"100%"}
      alignItems="center"
    >
      <Box display="flex" w={"90%"} mt={5}>
        <Text fontWeight="bold" fontSize={30}>
          Add List
        </Text>
        <Box display="flex" w={"100%"} mt={5}>
          <Input
            w={"100%"}
            bg="muted.200"
            placeholder="Name"
            py={3}
            my={2}
            value={dataList.name}
            fontSize={15}
            borderRadius="sm"
            borderColor="muted.500"
            onChangeText={(value) => handleChangeText("name", value)}
          />
          <Select
            defaultValue={dataList.category_id}
            placeholder="Select category..."
            w={"100%"}
            h={50}
            bg="muted.200"
            py={3}
            my={2}
            fontSize={15}
            borderRadius="sm"
            borderColor="muted.500"
            _selectedItem={{
              bg: "muted.500",
            }}
            mt={1}
            onValueChange={(value) => handleChangeText("category_id", value)}
          >
            {category?.map((item, i) => (
              <Select.Item label={item.name} value={item._id} key={i} />
            ))}
          </Select>
          <Pressable
            title="DatePicker"
            onPress={() => showMode("date")}
            p={3}
            h={47}
            bg="muted.200"
            borderRadius={8}
            borderWidth={2}
            borderColor="muted.400"
            mb={5}
            w="100%"
          >
            <HStack justifyContent="space-between">
              <Text fontSize="sm" color="blueGray.400">
                {text}
              </Text>
              <Text color="blueGray.400">
                <Ionicons name="calendar-outline" />
              </Text>
            </HStack>
          </Pressable>
          <TextArea
            w={"100%"}
            h={100}
            bg="muted.200"
            placeholder="Description"
            py={3}
            my={2}
            value={dataList.description}
            fontSize={15}
            borderRadius="sm"
            borderColor="muted.500"
            onChangeText={(value) => handleChangeText("description", value)}
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
            Add List
          </Button>
        </Box>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            display="default"
            onChange={onChangeDate}
          />
        )}
      </Box>
    </Box>
  );
}

export default AddList;
