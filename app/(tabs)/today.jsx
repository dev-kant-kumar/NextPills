import { Pressable, ScrollView, Text, View } from "react-native";

import { PillIcon } from "phosphor-react-native";
import { useDispatch, useSelector } from "react-redux";
import EmptyState from "../../components/macro/EmptyState";
import GreetUserHeader from "../../components/macro/GreetUserHeader";
import { recordMedicineAction } from "../../store/slices/historySlice";
import { selectMedicineToTakeToday } from "../../store/slices/medicinesSlice";

const Today = () => {
  const medicinesToTakeToday = useSelector(selectMedicineToTakeToday);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   AsyncStorage.clear();
  // }, []);

  const handleMedAction = ({ forHistory }) => {
    dispatch(recordMedicineAction(forHistory));
  };

  return (
    <View className="flex-1">
      <ScrollView>
        <GreetUserHeader />

        <View className="p-5">
          {medicinesToTakeToday?.length > 0 ? (
            medicinesToTakeToday.map((med) => (
              <View
                className="border border-gray-400 rounded-xl p-4 mb-2 flex-1 flex-row gap-5 items-center"
                key={`${med._id}-${med.time}`}
              >
                <View className="bg-gray-200 rounded-full p-3">
                  <PillIcon size={20} />
                </View>

                {/* med details */}
                <View className="flex-1 flex-row justify-between">
                  <View>
                    <Text className="text-lg font-medium">{med?.name}</Text>
                    <View className="flex flex-row gap-2">
                      <Text className="text-sm text-gray-500">{med?.dose}</Text>
                      <Text className="text-gray-500">•</Text>
                      <Text className="text-sm text-gray-500">
                        {med?.scheduledTime}
                      </Text>
                    </View>
                  </View>

                  {/* action buttons */}
                  <View className="flex flex-row gap-2 items-center">
                    <Pressable
                      className="bg-green-700 px-4 py-2 rounded-lg"
                      onPress={() =>
                        handleMedAction({
                          forHistory: { ...med, action: "taken" },
                        })
                      }
                    >
                      <Text className="text-gray-200 font-medium text-sm">
                        Taken
                      </Text>
                    </Pressable>

                    <Pressable
                      className="px-4 py-2 border border-gray-400 rounded-lg"
                      onPress={() =>
                        handleMedAction({
                          forHistory: { ...med, action: "skip" },
                        })
                      }
                    >
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
