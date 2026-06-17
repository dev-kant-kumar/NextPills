import { PlusIcon } from "phosphor-react-native";
import { Pressable, StyleSheet, View } from "react-native";

const AddButton = ({ style, ...props }) => {
  return (
    <View style={[style, style.container]}>
      <Pressable style={styles.btn} {...props}>
        <PlusIcon size={25} color="white" />
      </Pressable>
    </View>
  );
};

export default AddButton;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    top: -30,
    backgroundColor: "#2D6A4F",
    height: 56,
    width: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
