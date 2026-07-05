import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeftIcon,
  PencilSimpleIcon,
  PillIcon,
  TrashIcon,
} from "phosphor-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMedicine,
  selectMedicineById,
} from "../../store/slices/medicinesSlice";

const Meddetail = () => {
  const { id } = useLocalSearchParams();

  const medicine = useSelector(selectMedicineById(id));
  const [medicineData, setMedicineData] = useState(medicine);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    setMedicineData(medicine);
  }, [medicine]);

  const handleBack = () => {
    router.push("/medicines");
  };

  const handleEditMedicine = () => {
    router.push({
      pathname: "/addmedicine",
      params: {
        id: id,
      },
    });
  };

  const handleDeleteMedicine = () => {
    dispatch(deleteMedicine(id));
    handleBack();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 p-4">
        <ScrollView className="">
          <View className="flex-1 flex-row justify-between mb-6">
            <Pressable onPress={handleBack}>
              <ArrowLeftIcon size={25} />
            </Pressable>

            <View className="flex flex-row gap-5">
              <Pressable onPress={handleEditMedicine}>
                <PencilSimpleIcon size={25} />
              </Pressable>
              <Pressable onPress={handleDeleteMedicine}>
                <TrashIcon size={25} />
              </Pressable>
            </View>
          </View>

          <View className="my-5">
            <View className="bg-gray-200 rounded-full p-4 self-center">
              <PillIcon size={45} color="#2D6A4F" />
            </View>
            <View>
              <Text className="text-center my-2 text-2xl font-medium">
                {medicineData?.name}
              </Text>
              <Text className="text-center mb-2 text-gray-500">
                {medicineData?.dose}
              </Text>
            </View>
          </View>

          <View className="my-10">
            <Text className="text-gray-600 font-medium mb-2">SCHEDULE</Text>
            {medicineData?.times?.map((time, idx) => (
              <View
                key={idx}
                className="bg-gray-50 border border-gray-300 rounded-lg p-4 my-2"
              >
                <Text>
                  {medicineData?.frequency.charAt(0).toUpperCase() +
                    medicineData?.frequency.slice(1)}
                  {" • "}
                  {""}
                  {time}
                </Text>
              </View>
            ))}
          </View>

          <View>
            <Text className="text-gray-600 font-medium mb-2">
              RECENT HISTORY
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Meddetail;
