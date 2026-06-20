import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const GreetUserHeader = () => {
  const [user, setUser] = useState("Dev");

  const greetOnTime = () => {
    let greetMsg = "";
    const today = new Date();
    const hour = today.getHours();

    const date = today.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    if (hour >= 5 && hour < 12) {
      greetMsg = "Good morning";
    } else if (hour >= 12 && hour < 17) {
      greetMsg = "Good afternoon";
    } else if (hour >= 17 && hour < 21) {
      greetMsg = "Good evening";
    } else {
      greetMsg = "Good night";
    }

    return { greetMsg, date };
  };
  return (
    <View style={styles.container}>
      <Text
        style={styles.greetMsg}
      >{`${greetOnTime().greetMsg}, ${user}`}</Text>
      <Text style={styles.today}>{greetOnTime().date}</Text>
    </View>
  );
};

export default GreetUserHeader;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingInline: 20,
    paddingBlock: 20,
  },
  greetMsg: {
    fontSize: 20,
    marginBlockEnd: 10,
  },
  today: {},
});
