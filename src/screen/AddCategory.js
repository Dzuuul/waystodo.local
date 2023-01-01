import { Box, Button, Input, Text } from "native-base";
import { useState } from "react";
import { showMessage } from "react-native-flash-message";
import { useMutation, useQuery } from "react-query";
import { API } from "../../config/api";

function AddCategory({ navigation }) {
  const [dataCategory, setDataCategory] = useState({
    name: "",
  });

  let { data: category, refetch: categoryRefetch } = useQuery(
    "categoryCaches",
    async () => {
      let categoryResponse = await API.get("/Category");
      return categoryResponse.data;
    }
  );

  function handleChangeText(name, value) {
    setDataCategory({
      ...dataCategory,
      [name]: value,
    });
  }

  const categoryColor = [
    {
      index: 0,
      bgColor: "primary.500",
    },
    {
      index: 1,
      bgColor: "purple.500",
    },
    {
      index: 2,
      bgColor: "green.500",
    },
    {
      index: 3,
      bgColor: "danger.500",
    },
    {
      index: 4,
      bgColor: "warning.500",
    },
  ];

  const handleSubmit = useMutation(async (e) => {
    e.preventDefault();
    try {
      if (dataCategory.name.trim() == "") {
        return showMessage({
          message: "Category name must be filled!",
          type: "danger",
        });
      }
      const response = await API.post("/Category", dataCategory);
      showMessage({
        message: "Category success added!",
        type: "success",
      });
      setDataCategory({
        name: "",
      });
      categoryRefetch();
    } catch (err) {
      showMessage({
        message: "Failed add category!",
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
          Add Category
        </Text>
        <Box display="flex" w={"100%"} mt={5}>
          <Input
            w={"100%"}
            bg="muted.200"
            placeholder="Name"
            py={3}
            fontSize={15}
            borderRadius="sm"
            borderColor="muted.500"
            value={dataCategory.name}
            onChangeText={(value) => handleChangeText("name", value)}
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
            Add Category
          </Button>
        </Box>
        <Text fontWeight="bold" fontSize={30} mt={30}>
          List Category
        </Text>

        <Box
          mt={5}
          display="flex"
          flexDirection="row"
          flex={1}
          w={"100%"}
          flexWrap={"wrap"}
        >
          {category?.map((item, i) => {
            return (
              <Box
                p={3}
                borderRadius={10}
                display="flex"
                alignItems="center"
                justifyContent="center"
                key={i}
                mr={2}
                my={2}
                h={12}
                bg={
                  categoryColor?.find(
                    (item) =>
                      item?.index === i % (categoryColor.length)
                  ).bgColor
                }
              >
                <Text 
                color="white" 
                fontSize={20}>
                  {/* find same id category  then return name */}
                  {item.name}
                </Text>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

export default AddCategory;
