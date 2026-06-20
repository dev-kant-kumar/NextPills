import { ScrollView, StyleSheet, View } from "react-native";

import EmptyState from "../../components/macro/EmptyState";
import GreetUserHeader from "../../components/macro/GreetUserHeader";

const Today = () => {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ padding: 5 }}>
        <GreetUserHeader />
        <EmptyState />
      </ScrollView>
    </View>
  );
};

export default Today;

const styles = StyleSheet.create({});
