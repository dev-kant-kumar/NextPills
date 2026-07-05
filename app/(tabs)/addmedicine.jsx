import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BellIcon,
  PlusIcon,
  WarningCircleIcon,
  XIcon,
} from "phosphor-react-native";
import { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { addMedicine } from "../../store/slices/medicinesSlice";

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

const getInitialMedicineData = () => ({
  name: "",
  dose: "",
  frequency: "daily",
  days: [],
  times: [],
  reminderSound: "Zen Garden",
});

const getInitialErrorsState = () => ({
  name: "",
  dose: "",
  frequency: "",
  days: "",
  times: "",
  reminderSound: "",
});

const AddMedicine = () => {
  const [medicineData, setMedicineData] = useState(getInitialMedicineData());
  const [errors, setErrors] = useState(getInitialErrorsState());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickedTime, setPickedTime] = useState(new Date());
  const dispatch = useDispatch();
  const router = useRouter();

  const handleFormData = (field, value) => {
    setMedicineData((prev) => ({
      ...prev,
      [field]: value,
    }));

    validateFormData(field, value);
  };

  const validateFormData = (field, value) => {
    let error = "";

    if (field === "name") {
      if (!value.trim()) {
        error = "Medicine name is required";
      } else if (value.trim().length < 2) {
        error = "Medicine name is too short";
      } else if (value.trim().length > 70) {
        error = "Medicine name is too long";
      }
    } else if (field === "dose") {
      if (!value.trim()) {
        error = "Medicine dosage is required";
      } else if (value.trim().length < 2) {
        error = "Medicine dosage is too short";
      } else if (value.trim().length > 70) {
        error = "Medicine dosage is too long";
      }
    } else if (field === "frequency") {
      // no need to check one will be always selected
    } else if (field === "days") {
      if (value.length < 1) {
        error = "Select atleast one day";
      }
    } else if (field === "times") {
      if (value.length < 1) {
        error = "Add at least one reminder time";
      }
    } else if (field === "reminderSound") {
      // no need to check , default sould is already there
    }

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));

    return error;
  };

  const isFormValid = () => {
    let hasErrors = false;

    for (const [key, value] of Object.entries(medicineData)) {
      const error = validateFormData(key, value);

      if (error && error.length > 0) {
        hasErrors = true;
      }
    }

    return hasErrors;
  };

  const resetForm = () => {
    setMedicineData(getInitialMedicineData());
    setErrors(getInitialErrorsState());
  };

  const handleSubmitForm = () => {
    if (!isFormValid()) {
      Alert.alert("Form Error", "check each field and fix their errors");
      return;
    }
    dispatch(addMedicine(medicineData));
    resetForm();
    router.push("/medicines");
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);

    if (selectedTime) {
      console.log("selected time : ", selectedTime);
      setPickedTime(selectedTime);

      const hours = (selectedTime.getHours() % 12 || 12)
        .toString()
        .padStart(2, "0");
      const mintues = selectedTime.getMinutes().toString().padStart(2, "0");
      const period = selectedTime.getHours() >= 12 ? "pm" : "am";

      const selected = `${hours} : ${mintues} ${period}`;

      console.log("setting this time : ", selected);

      if (medicineData.times.includes(selected)) {
        console.error(
          "this is already selected in times : ",
          medicineData.times,
        );
        return;
      } else {
        handleFormData("times", [...medicineData.times, selected]);
      }
      setPickedTime(new Date());
    }
  };

  const handleBack = () => {
    router.push("/medicines");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 p-4">
        <ScrollView className="">
          <View className="flex flex-row items-center gap-10 py-2 mb-6">
            <Pressable onPress={handleBack}>
              <ArrowLeftIcon size={25} />
            </Pressable>

            <Text className="text-xl">Add Medicine</Text>
          </View>

          {/* form view */}
          <View className="">
            <View className="mb-5">
              <Text className="mb-2 font-semibold">Medicine Name</Text>
              <TextInput
                className="bg-slate-50 rounded-lg px-5"
                placeholder="e.g. Paracetamol"
                value={medicineData.name}
                onChangeText={(name) => handleFormData("name", name)}
                onBlur={() => validateFormData("name", medicineData.name)}
              />
              {errors.name.length > 0 && (
                <View className="flex-row gap-2 items-center my-2">
                  <WarningCircleIcon size={15} color="red" />
                  <Text className="text-red-500">{errors.name}</Text>
                </View>
              )}
            </View>

            <View className="mb-5">
              <Text className="mb-2 font-semibold">Dosage</Text>
              <TextInput
                className="bg-slate-50 rounded-lg px-5"
                placeholder="e.g. 500mg"
                value={medicineData.dose}
                onChangeText={(dose) => handleFormData("dose", dose)}
                onBlur={() => validateFormData("dose", medicineData.dose)}
              />
              {errors.dose.length > 0 && (
                <View className="flex-row gap-2 items-center my-2">
                  <WarningCircleIcon size={15} color="red" />
                  <Text className="text-red-500">{errors.dose}</Text>
                </View>
              )}
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
                <View>
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
                  {errors.days.length > 0 && (
                    <View className="flex-row gap-2 items-center my-2">
                      <WarningCircleIcon size={15} color="red" />
                      <Text className="text-red-500">{errors.days}</Text>
                    </View>
                  )}
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

              {errors.times.length > 0 && (
                <View className="flex-row gap-2 items-center my-2">
                  <WarningCircleIcon size={15} color="red" />
                  <Text className="text-red-500">{errors.times}</Text>
                </View>
              )}

              <View className="mb-10 mt-4">
                {medicineData?.times?.length > 0 &&
                  medicineData?.times?.map((time, idx) => (
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

            {/* work on this later  */}
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
              is24Hour={false}
              onChange={(event, selectedTime) =>
                handleTimeChange(event, selectedTime)
              }
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default AddMedicine;
