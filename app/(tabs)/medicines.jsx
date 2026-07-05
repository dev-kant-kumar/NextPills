import { useRouter } from "expo-router";
import { ArrowRightIcon, PillIcon } from "phosphor-react-native";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import EmptyState from "../../components/macro/EmptyState";
import { selectMedicines } from "../../store/slices/medicinesSlice";

const Medicines = () => {
  const medicines = useSelector(selectMedicines);
  const router = useRouter();

  const showMedDetails = (id) => {
    router.push({
      pathname: "/meddetail",
      params: {
        id: id,
      },
    });
  };

  return (
    <View className="flex-1 p-5">
      <Text className="text-2xl mb-10">Medicines</Text>
      {medicines?.length > 0 ? (
        <FlatList
          data={medicines}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => showMedDetails(item._id)}
              className="flex flex-row gap-5 items-center border border-gray-400 rounded-lg my-2 p-4"
            >
              <View className="bg-gray-200 p-4 rounded-full">
                <PillIcon size={25} />
              </View>
              <View className="flex-1 flex-row justify-between items-center">
                <View className="">
                  <Text className="text-xl font-semibold">{item.name}</Text>
                  <Text className="text-sm font-medium text-gray-500">
                    {`${item.dose} • ${
                      item.frequency.charAt(0).toUpperCase() +
                      item.frequency.slice(1)
                    } • ${item.times?.length}x  `}
                  </Text>
                </View>
                <View>
                  <ArrowRightIcon size={20} />
                </View>
              </View>
            </Pressable>
          )}
        />
      ) : (
        <EmptyState />
      )}
    </View>
  );
};

export default Medicines;

const styles = StyleSheet.create({});
