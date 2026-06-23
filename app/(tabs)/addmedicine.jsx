import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import {
  ArrowRightIcon,
  BellIcon,
  PlusIcon,
  XIcon,
} from "phosphor-react-native";
import { useState } from "react";

const howOften = [
  {
    id: 1,
    title: "Daily",
    frequency: "daily",
  },
  {
    id: 2,
    title: "Specific days",
    frequency: "specific-days",
  },
];

const daysOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const AddMedicine = () => {
  const [medicineData, setMedicineData] = useState({
    name: "",
    dose: "",
    frequency: "daily",
    days: [],
    times: [],
    reminderSound: "",
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickedTime, setPickedTime] = useState(new Date());

  const handleFormData = (field, value) => {
    setMedicineData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitForm = () => {
    console.log("form data : ", medicineData);
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);

    if (selectedTime) {
      setPickedTime(selectedTime);
      const timeReceived = new Date(pickedTime);
      const selected = `${timeReceived.getHours() % 12 || 12} : ${timeReceived.getMinutes()?.toString().padStart(2, "0")} ${timeReceived.getHours() >= 12 ? "pm" : "am"}`;
      console.log("setting this time : ", selected);

      handleFormData(
        "times",
        !medicineData.times.includes(selected) && [
          ...medicineData.times,
          selected,
        ],
      );
    }
  };

  return (
    <View className="flex-1">
      <ScrollView className="">
        {/* form view */}
        <View className="p-5">
          <View className="mb-5">
            <Text className="mb-2 font-semibold">Medicine Name</Text>
            <TextInput
              className="bg-slate-50 rounded-lg px-5"
              placeholder="e.g. Paracetamol"
              value={medicineData.name}
              onChangeText={(name) => handleFormData("name", name)}
            />
            {/* <Text>Errors</Text> */}
          </View>

          <View className="mb-5">
            <Text className="mb-2 font-semibold">Dosage</Text>
            <TextInput
              className="bg-slate-50 rounded-lg px-5"
              placeholder="e.g. 500mg"
              value={medicineData.dose}
              onChangeText={(dose) => handleFormData("dose", dose)}
            />
            {/* <Text>Errors</Text> */}
          </View>

          <View className="mb-5">
            <Text className="mb-2 font-semibold">How Often?</Text>
            <View className="bg-slate-50 p-2 rounded-lg flex-row">
              {howOften?.map((f) => (
                <Pressable
                  className={` ${medicineData.frequency === f.frequency && "bg-green-800"} py-2 rounded-lg w-1/2`}
                  key={f.id}
                  onPress={() => handleFormData("frequency", f.frequency)}
                >
                  <Text
                    className={`${medicineData.frequency === f.frequency ? "text-gray-50" : "text-slate-500"}  text-center`}
                  >
                    {f.title}
                  </Text>
                </Pressable>
              ))}
            </View>
            {medicineData.frequency === "specific-days" && (
              <View className="my-5 flex-row justify-around">
                {daysOptions?.map((d) => (
                  <Pressable
                    onPress={() =>
                      handleFormData(
                        "days",

                        medicineData.days.includes(d)
                          ? medicineData.days.filter((day) => day !== d)
                          : [...medicineData.days, d],
                      )
                    }
                    key={d}
                    className={`${medicineData.days.includes(d) ? "bg-green-800 border-green-700" : ""} border px-3 rounded-full`}
                  >
                    <Text
                      className={`${medicineData.days.includes(d) ? "text-green-100" : ""} text-sm`}
                    >
                      {d}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View>
            <Text className="mb-2 font-semibold">Whats Time(s)?</Text>
            <Pressable
              className="flex-row items-center gap-2 border border-dotted rounded-lg px-5 py-2 w-[35%]"
              onPress={() => setShowTimePicker(true)}
            >
              <PlusIcon size={14} weight="bold" color="gray" />
              <Text className="text-gray-500">Add time</Text>
            </Pressable>

            <View className="mb-10 mt-4">
              {medicineData?.times?.map((time, idx) => (
                <View
                  key={idx}
                  className="bg-gray-50 my-2 py-2 px-5 rounded-lg flex-row items-center justify-between"
                >
                  <Text>{time}</Text>
                  <Pressable
                    className=""
                    onPress={() =>
                      handleFormData(
                        "times",
                        medicineData?.times?.filter((t) => t !== time),
                      )
                    }
                  >
                    <XIcon size={15} />
                  </Pressable>
                </View>
              ))}
            </View>
          </View>

          <Pressable className="bg-gray-200 rounded-lg flex-row gap-5 items-center px-5 py-3 mb-10 border border-gray-300">
            <BellIcon size={20} color="gray" />
            <View className="flex-row justify-between gap-44 items-center">
              <View>
                <Text>Reminder Sound</Text>
                <Text className="text-sm text-gray-500">
                  Zen Garden (Default)
                </Text>
              </View>
              <View>
                <ArrowRightIcon size={20} color="gray" />
              </View>
            </View>
          </Pressable>

          <Pressable
            className="bg-green-800 p-4 rounded-lg"
            onPress={handleSubmitForm}
          >
            <Text className="text-gray-50 text-center font-semibold">
              Save Medicine
            </Text>
          </Pressable>
        </View>
        {showTimePicker && (
          <DateTimePicker
            value={pickedTime}
            mode="time"
            onChange={(event, selectedTime) =>
              handleTimeChange(event, selectedTime)
            }
          />
        )}
      </ScrollView>
    </View>
  );
};

export default AddMedicine;
