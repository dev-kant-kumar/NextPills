import { Image, ScrollView, StyleSheet, View } from "react-native";

import MedImage from "../../assets/logo.png";

const AddMedicine = () => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* image view */}
        <View style={styles.medImageContainer}>
          <Image source={MedImage} style={styles.medImage} />
        </View>

        {/* form view */}
      </ScrollView>
    </View>
  );
};

export default AddMedicine;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#eeee",
  },
  medImageContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  medImage: {
    height: 150,
    width: "50%",
  },
});
