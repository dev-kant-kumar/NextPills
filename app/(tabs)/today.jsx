import { Pressable, ScrollView, Text, View } from "react-native";

import { PillIcon } from "phosphor-react-native";
import { useSelector } from "react-redux";
import EmptyState from "../../components/macro/EmptyState";
import GreetUserHeader from "../../components/macro/GreetUserHeader";
import { selectMedicines } from "../../store/slices/medicinesSlice";

const Today = () => {
  const medicines = useSelector(selectMedicines);

  const handleMedTaken = () => {};

  const handleMedSkip = () => {};

  return (
    <View className="flex-1">
      <ScrollView>
        <GreetUserHeader />

        <View className="p-5">
          {medicines?.length > 0 ? (
            medicines.map((m) => (
              <View
                className="border border-gray-400 rounded-xl p-4 mb-2 flex-1 flex-row gap-5 items-center"
                key={m.name}
              >
                <View className="bg-gray-200 rounded-full p-3">
                  <PillIcon size={20} />
                </View>

                {/* med details */}
                <View className="flex-1 flex-row justify-between">
                  <View>
                    <Text className="text-lg font-medium">{m.name}</Text>
                    <Text className="text-sm text-gray-500">{m.dose}</Text>
                  </View>

                  {/* action buttons */}
                  <View className="flex flex-row gap-2 items-center">
                    <Pressable className="bg-green-700 px-4 py-2 rounded-lg">
                      <Text className="text-gray-200 font-medium text-sm">
                        Taken
                      </Text>
                    </Pressable>

                    <Pressable className="px-4 py-2 border border-gray-400 rounded-lg">
                      <Text className="text-gray-500 font-medium text-sm">
                        Skip
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <EmptyState />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Today;
