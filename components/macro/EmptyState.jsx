import { router } from "expo-router";
import { PlusIcon } from "phosphor-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

const EmptyState = () => {
  const addMedicine = () => {
    router.navigate("/addmedicine");
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <PlusIcon size={35} color={"#2D6A4F"} weight="bold" />
      </View>

      <View>
        <Text style={styles.title}>No medicines yet</Text>
        <Text style={styles.subTitle}>
          Add your first one to start getting reminders
        </Text>
      </View>

      <Pressable style={styles.btn} onPress={addMedicine}>
        <PlusIcon size={16} color={"white"} weight="bold" />
        <Text style={styles.btnTxt}>Add Medicine</Text>
      </Pressable>
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    // borderWidth: 1,
    padding: 20,
    gap: 30,
  },
  iconContainer: {
    backgroundColor: "lightgray",
    height: 100,
    width: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    marginBlockEnd: 10,
  },
  subTitle: {
    textAlign: "center",
    fontWeight: 600,
    color: "gray",
  },
  btn: {
    width: "70%",
    backgroundColor: "#2D6A4F",
    alignSelf: "center",
    paddingVertical: 18,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  btnTxt: {
    color: "white",
    fontSize: 18,
    fontWeight: 600,
  },
});
