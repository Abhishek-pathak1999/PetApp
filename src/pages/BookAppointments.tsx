import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonDatetime,
  IonItem,
  IonList,
  IonModal,
  IonPage,
  IonSegmentButton,
  IonText,
  IonSelectOption,
  IonSelect,
  IonIcon,
} from "@ionic/react";

import { useQuery } from "react-query";
import { useEffect, useRef, useState } from "react";
import { Preferences } from "@capacitor/preferences";
import NotifyDoctorModal from "../components/NotifyDoctorModal";
import defaultPet from "../assets/rounded-cat-demo.png";
import {
  createAppointmentByPetOwner,
  getSlotsdata,
  handleGetAllPets,
  handleGetDoctors,
} from "../service/services";
import { arrowBack } from "ionicons/icons";
import { getImageByName } from "../utils/imagesUtil";
import { useHistory, useLocation } from "react-router";
import moment from "moment";

const BookAppointments = ({setDisplayBookAppointment, selectedClinicData, doctorsData, handleUpcomingAppointment}:any) => {
  const doctorRefs = useRef<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [dates, setDates] = useState<any>([]);
  const [flag, setFlag] = useState<any>(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedPet, setSelectedPet] = useState<Array<any>>([]);
  const [availbleSlots, setAvailableSlots] = useState<any>(null);
  const [slotType, setSlotType] = useState<any>("day");
  const [selectedSlots, setSelectedSlots] = useState<any>(null);
  const [isNotifyDoctorModal, setIsNotifyDoctorModal] =
    useState<boolean>(false);
  const history = useHistory();
  const [token, setToken] = useState<null | string>(null);
  const location = useLocation();
  // const { allAppointmentData , flagType} : any= location.state || {};
  const allAppointmentData = selectedClinicData.allAppointmentData || {}
  const flagType = selectedClinicData.flagType || {}
  const [selectedDoctorByEdit, setSelectedDoctorByEdit] = useState<any>([]);
  const [selectedDate, setSelectedDate] = useState<any>(flagType === "edit" ? undefined : 0);
  console.log("selectedDoctorByEdit : ", selectedDoctorByEdit)
  const d = new Date();

  useEffect(() => {
    const getNext14Days = () => {
      const currentDate = new Date();
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const dates = [];
      for (let i = 0; i < 11; i++) {
        const date = new Date();
        date.setDate(currentDate.getDate() + i);
        const day = days[date.getDay()];
        const dayOfMonth = date.getDate();
        const month = months[date.getMonth()];
        dates.push({ day, dayOfMonth, month });
      }
      setDates(dates);
    };

    getNext14Days();
  }, []);

  const formatDate = (
    day: string,
    dayOfMonth: number,
    month: string
  ): string => {
    const months: { [key: string]: number } = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };

    
    d.setDate(dayOfMonth);
    d.setMonth(months[month]);
    while (
      d.getDay() !==
      [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ].indexOf(day)
    ) {
      d.setDate(d.getDate() + 1);
    }

    return d.toISOString();
  };

  useEffect(() => {
    (async () => {
      const tokenValue = await Preferences.get({ key: "token" });
      setToken(tokenValue.value!);
    })();
  }, []);

  // const { data: allPetsData } = useQuery<any>(["allPets", token]);
  const { data: allPetsData } = useQuery(["allPets", token, flag], {
    queryFn: () => handleGetAllPets(token),
    retry: 3,
    enabled: !!token,
  });

  console.log("allPrts :", allPetsData);

  useEffect(() => {
    if (allPetsData?.result && allPetsData?.result.length === 1) {
      const pet = allPetsData.result[0].pet; // Accessing the pet object inside result
      if (!selectedPet?.some((datum) => datum.petId === pet._id)) {
        setSelectedPet([
          ...selectedPet,
          {
            [pet._id]: true,
            petId: pet._id,
            petName: pet.pet_name,
            animalType: pet.animal_type, // Adding animal type if needed
            petImage: pet.user_image, // Adding pet image if needed
          },
        ]);
      }
    }
  }, [allPetsData]);
  
  console.log("Selected availbleSlots data: ", selectedDoctorByEdit)

  function dateConverter(currentdate: any) {
    const currentDate = currentdate;
    let formatDate1 : any;
    if(currentDate){
      formatDate1 = formatDate(
      currentDate?.day,
      currentDate?.dayOfMonth,
      currentDate?.month
    );}
    const date = new Date(formatDate1);
    // date.setHours(0, 0, 0, 0);
    let slotDate;
    if(date){
      slotDate = date.toISOString();
    }
    console.log("Date : ", slotDate);
    return slotDate;
  }

  function dateConverterAndSetHourMinuteZero(currentdate: any) {
    const currentDate = currentdate;
    let formatDate1 : any;
    if(currentDate){
      formatDate1 = formatDate(
      currentDate?.day,
      currentDate?.dayOfMonth,
      currentDate?.month
    );}
    const date = new Date(formatDate1);
    date.setHours(0, 0, 0, 0);
    let slotDate;
    if(date){
      slotDate = date.toISOString();
    }
    console.log("Date : ", slotDate);
    return slotDate;
  }

  const { data: slotsData } = useQuery({
    queryKey: [selectedDoctor, selectedDate],
    queryFn: () =>
      getSlotsdata(
        selectedDoctor?.doctor?._id,
        slotType,
        dateConverterAndSetHourMinuteZero(dates[selectedDate])
      ),
    enabled: !!selectedDoctor?.doctor?._id,
  });

  useEffect(() => {
    if (slotsData) {
      setAvailableSlots(slotsData.daySlots);
    }
  }, [slotsData]);

  console.log("slotsData: ", selectedSlots);
  const handleDateChange = (event: CustomEvent) => {
    setSelectedDate(event.detail.value);
  };
  console.log("pet: ", selectedPet);
  const handleIconClick = () => {
    setShowModal(true); // Set showModal to true to open the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Set showModal to false to close the modal
  };

  async function bookAppointment() {
    setIsNotifyDoctorModal(!isNotifyDoctorModal);
  }

console.log("allAppointment: ", allAppointmentData)
  useEffect(() => {
    if (allAppointmentData) {
      async function handleAllData() {
        let newSelectedDoctor = selectedDoctor;
        let newSelectedPet = selectedPet;
        let newSelectedSlots = selectedSlots;
        let newSelectedDate = selectedDate;
  
        if (allAppointmentData?.doctor && !selectedDoctor?.[allAppointmentData.doctor._id] && doctorsData) {
          newSelectedDoctor = await {
            ...selectedDoctor,
            [allAppointmentData.doctor._id]: true,
            doctor: allAppointmentData.doctor,
          };
        }
  
        if (allAppointmentData?.pets) {
          const pets = await allAppointmentData.pets || [];
          pets.forEach((pet: any) => {
            if (!selectedPet.some((datum) => datum.petId === pet._id)) {
              newSelectedPet = [
                ...newSelectedPet,
                {
                  [pet._id]: true,
                  petId: pet._id,
                  petName: pet.pet_name,
                },
              ];
            }
          });
        }
  
        if (allAppointmentData?.doctorSlot && !selectedSlots?.[allAppointmentData.doctorSlot._id]) {
          newSelectedSlots = {
            ...selectedSlots,
            [allAppointmentData.doctorSlot._id]: true,
            slotsData: allAppointmentData.doctorSlot,
          };
        }
  
        if (allAppointmentData?.appointmentDate && dates) {
          const appointmentDate = await allAppointmentData.appointmentDate;
          const appointmentDayOfMonth = moment(appointmentDate).date();
          const appointmentMonth = moment(appointmentDate).format('MMMM');
  
          console.log("date: ", appointmentDayOfMonth, appointmentMonth);
  
          const matchingIndex = dates && dates.findIndex((date: any) =>
            date.dayOfMonth === appointmentDayOfMonth && date.month === appointmentMonth
          );
  
          if (matchingIndex !== -1) {
            newSelectedDate = matchingIndex;
          }
        }

        // Batch update states
        if (newSelectedDoctor !== selectedDoctor) {
          setSelectedDoctorByEdit(newSelectedDoctor?.doctor);
          setSelectedDoctor(newSelectedDoctor)
        }
  
        if (newSelectedPet !== selectedPet) {
          setSelectedPet(newSelectedPet);
        }
  
        if (newSelectedSlots !== selectedSlots) {
          setSelectedSlots(newSelectedSlots);
        }
  
        if (newSelectedDate !== selectedDate) {
          setSelectedDate(newSelectedDate);
        }
      }
  
      handleAllData();
    }
  }, [allAppointmentData, dates]);
  
  
  console.log("selected Date index :", dates)

  useEffect(()=>{
    if(flagType == "new"){
      setSelectedDoctor(null);
      setSelectedSlots(null);
      setSelectedPet([]);
      setSelectedDate(0);
    }
  },[flagType])

  async function appointmentt() {
    try {
      // setIsLoading(true);
      const petIds = selectedPet && selectedPet?.map((pet) => pet.petId);

      const params: any = {
        doctor: selectedDoctor?.doctor?._id,
        appointmentDate: dateConverter(dates[selectedDate]),
        treatmentDoneTime: selectedSlots?.slotsData?.timeSlot?.startText,
        timeslot: selectedSlots?.slotsData?.timeSlot?.dispaly,
        doctorSlot: selectedSlots?.slotsData?._id,
        checkedIntoClinicTime: selectedSlots?.slotsData?.timeSlot?.startText,
        pets: petIds,
      };
      if(allAppointmentData){
        params["_id"] = allAppointmentData._id;
      }

      const response = await createAppointmentByPetOwner(params);
      console.log("response created: ", response);
      console.log("params created: ", params);
      handleUpcomingAppointment()
      return true;
    } catch (err) {
      throw err;
    }
    
  }
  const isButtonDisabled = (selectedSlots: any, selectedPet: any) => {
    if (!selectedSlots) return true; // Check if selectedSlots is null or undefined

    const hasFalseValue = Object.values(selectedSlots).includes(false);
    const isSlotsDataNull = selectedSlots.slotsData === null;

    return hasFalseValue || isSlotsDataNull || selectedPet.length === 0;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id : any = entry.target.getAttribute("data-id");
            setSelectedDoctor({
              [id]: true,
              doctor: doctorsData.find((doc: any) => doc._id === id)?.doctor,
            });
          }
        });
      },
      {
        threshold: 0.5, // Adjust this value to determine when the doctor is "visible enough"
      }
    );

    doctorRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      doctorRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [doctorsData, setSelectedDoctor]);

  return (
    <IonPage>
      <IonContent className="bg-white h-full">
        <div className="mt-3 relative">
        <div className="absolute -top-2 left-3" onClick={()=> setDisplayBookAppointment(false)}><IonIcon src={arrowBack} /></div>
          <IonText
            style={{
              color: "#211F1F",
              fontFamily: "Inter",
              fontSize: "11px",
              fontStyle: "normal",
              fontWeight: "600",
              lineHeight: "normal",
            }}
            className="ml-9 font-bold"
          >
            Select Doctor →
          </IonText>
          {flagType !== "edit" ? (
            <div
            className={`max-w-[100%] flex mx-7 scroll-snap-x-mandatory overflow-x-scroll `}
            style={{ scrollSnapType: "x mandatory" }}
          >
            {doctorsData &&
              doctorsData.map((item: any, index: number) => (
                <div
                  key={index}
                  data-id={item._id}
                  ref={(el) => (doctorRefs.current[index] = el)}
                  style={{ fontFamily: "Inter", scrollSnapAlign: "start" }}
                  className={` mb-2 font-light w-full ${
                    selectedDoctor?.[item._id] && selectedDoctor?.[item._id]
                      ? "border-[#20B13F] border-[2px]"
                      : "border-[#4460A999] border-[1px]"
                  } h-[10vh] rounded-[5px] mx-7 items-center flex justify-center bg-white
                 `}
                >
                  <div className="flex items-center justify-between rounded-lg w-[360px]">
                    <div className="flex flex-col items-center w-[40%]">
                      <div className="w-[3.125rem] h-[3.125rem]">
                        <img
                          src={
                            item?.doctor?.image_base_url ||
                            getImageByName("genricMenImage")
                          }
                          className="w-[100%] h-[100%] rounded-full bg-[#CBCBCB]"
                        />
                      </div>
                      <IonText
                        style={{
                          color: "#392F2F",
                          fontFamily: "Open Sans",
                          fontSize: "12px",
                          fontStyle: "normal",
                          fontWeight: "600",
                          lineHeight: "normal",
                        }}
                      >
                        Dr. {item?.doctor?.first_name} {item?.doctor?.last_name}
                      </IonText>
                    </div>
                    <div className="w-[58%] flex py-[5px] flex-col">
                      <IonText
                        style={{
                          color: "#1B1919",
                          fontFamily: "Inter",
                          fontSize: "11px",
                          fontStyle: "normal",
                          fontWeight: "300",
                          lineHeight: "normal",
                        }}
                      >
                        {item?.doctor?.address}
                      </IonText>
                      <IonText className="text-[10px]">
                        {item?.doctor?.landmark} - 110078
                      </IonText>
                      <IonText
                        style={{
                          color: "#2B2626",
                          fontFamily: "Inter",
                          fontSize: "10px",
                          fontStyle: "normal",
                          fontWeight: "600",
                          lineHeight: "normal",
                        }}
                      >
                        Contact No:
                      </IonText>
                      <div className="flex">
                        <IonText className="text-[10px] underline text-[blue]">
                          {item?.doctor?.phoneNumber}
                        </IonText>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>):(
            <div
            className={`max-w-[100%] flex mx-7 scroll-snap-x-mandatory ${
              flagType === "edit" ? "overflow-x-hidden" : "overflow-x-scroll"
            }`}
            style={{ scrollSnapType: "x mandatory" }}
          >
          
                {selectedDoctorByEdit&& <div
                  // ref={(el) => (doctorRefs.current[index] = el)}
                  style={{ fontFamily: "Inter", scrollSnapAlign: "start" }}
                  className={` mb-2 font-light w-full border-[#20B13F] border-[2px]
                  } h-[10vh] rounded-[5px] mx-7 items-center flex justify-center bg-white
                  ${
                  flagType === "edit" ? "pointer-events-none opacity-50" : ""
                }`}
                >
                  <div className="flex items-center justify-between rounded-lg w-[360px]">
                    <div className="flex flex-col items-center w-[40%]">
                      <div className="w-[3.125rem] h-[3.125rem]">
                        <img
                          src={
                            selectedDoctorByEdit?.image_base_url ||
                            getImageByName("genricMenImage")
                          }
                          className="w-[100%] h-[100%] rounded-full bg-[#CBCBCB]"
                        />
                      </div>
                      <IonText
                        style={{
                          color: "#392F2F",
                          fontFamily: "Open Sans",
                          fontSize: "12px",
                          fontStyle: "normal",
                          fontWeight: "600",
                          lineHeight: "normal",
                        }}
                      >
                        Dr. {selectedDoctorByEdit?.first_name} {selectedDoctorByEdit?.last_name}
                      </IonText>
                    </div>
                    <div className="w-[58%] flex py-[5px] flex-col">
                      <IonText
                        style={{
                          color: "#1B1919",
                          fontFamily: "Inter",
                          fontSize: "11px",
                          fontStyle: "normal",
                          fontWeight: "300",
                          lineHeight: "normal",
                        }}
                      >
                        {selectedDoctorByEdit?.address}
                      </IonText>
                      <IonText className="text-[10px]">
                        {selectedDoctorByEdit?.landmark} - 110078
                      </IonText>
                      <IonText
                        style={{
                          color: "#2B2626",
                          fontFamily: "Inter",
                          fontSize: "10px",
                          fontStyle: "normal",
                          fontWeight: "600",
                          lineHeight: "normal",
                        }}
                      >
                        Contact No:
                      </IonText>
                      <div className="flex">
                        <IonText className="text-[10px] underline text-[blue]">
                          {selectedDoctorByEdit?.phoneNumber}
                        </IonText>
                      </div>
                    </div>
                  </div>
                </div>}
              
          </div>
          )}
        </div>

        <div className="mt-0">
          <IonText
            style={{
              color: "#211F1F",
              fontFamily: "Inter",
              fontSize: "11px",
              fontStyle: "normal",
              fontWeight: "700",
              lineHeight: "normal",
            }}
            className="ml-9 font-bold"
          >
            Select Pet(s) →{" "}
          </IonText>

          <div
            className="h-[8.375vh] mx-7 rounded-md items-center flex justify-cente "
            style={{
              borderRadius: "5px",
              border: "1px solid rgba(68, 96, 169, 0.60)",
              background: "rgba(217, 217, 217, 0.00)",
            }}
          >
            <div className="flex overflow-x-scroll">
              {allPetsData &&
                allPetsData?.result?.map((petData: any, index: number) => {
                  const pet = petData.pet; // Access the 'pet' object inside 'petData'
                  const isSelected = selectedPet?.some((datum) => datum.petId === pet._id); // Check if the pet is selected

                  return (
                    <div
                      key={index}
                      style={{
                        minWidth: "50px",
                        minHeight: "50px",
                        fontFamily: "Open Sans",
                      }}
                      className="flex flex-col justify-evenly items-center"
                      onClick={() => {
                        if (isSelected) {
                          // If the pet is already selected, remove it from selectedPet
                          const filteredPet = selectedPet?.filter(
                            (data) => data.petId !== pet._id
                          );
                          setSelectedPet(filteredPet);
                        } else {
                          // If the pet is not selected, add it to selectedPet
                          setSelectedPet([
                            ...selectedPet,
                            {
                              petId: pet?._id,
                              petName: pet?.pet_name,
                            },
                          ]);
                        }
                      }}
                    >
                      <IonText
                        style={{
                          color: "#000",
                          textAlign: "center",
                          fontFamily: "Open Sans",
                          fontSize: "10px",
                          fontWeight: "600",
                        }}
                      >
                        {pet?.pet_name}
                      </IonText>
                      <img
                        src={pet?.image_base_url || getImageByName(pet?.animal_type === "Cat" ? "catfree" : pet?.animal_type === "Dog" ? "dogfree" : "otherfree")}
                        style={{
                          border: isSelected ? "3.5px solid green" : "",
                          borderRadius: "100%",
                        }}
                        onError={(e: any) => {
                          // Check animal type for default image if the image fails to load
                          if (pet?.animal_type === "Cat") {
                            e.currentTarget.src = getImageByName("catfree");
                          } else if (pet?.animal_type === "Dog") {
                            e.currentTarget.src = getImageByName("dogfree");
                          } else {
                            e.currentTarget.src = getImageByName("otherfree");
                          }
                        }}
                        className="w-[40px] h-[40px] object-cover"
                      />
                    </div>
                  );
                })}
            </div>
            {/* </div> */}
          </div>
        </div>

        <div className="flex mt-0 justify-between items-center h-[12.5vh] mx-7 bg-white gap-x-3 overflow-auto">
          {dates &&
            dates?.map((item: any, index: number) => (
              <div
                key={index}
                onClick={() => setSelectedDate(index)}
                style={{
                  fontFamily: "Open Sans",
                  boxShadow:
                    selectedDate === index
                      ? "0px 4px 4px 0px rgba(14, 14, 14, 0.80) inset"
                      : "",
                }}
                className={`h-[55px] min-w-[35px]  ${
                  selectedDate === index ? "bg-[#43BAAC]" : " bg-[#4E539C]"
                }  text-white flex flex-col justify-between items-center rounded-[10px] py-1`}
              >
                <IonText
                  style={{
                    color: "#FFF",
                    textFamily: "Open Sans",
                    fontSize: "9px",
                    fontStyle: "normal",
                    fontWeight: "500",
                    lineHeight: "normal;",
                  }}
                >
                  {item.day.substring(0,2)}
                </IonText>
                <IonText
                  style={{
                    color: "#FFF",
                    textAlign: "center",
                    fontFamily: "Open Sans",
                    fontSize: "15px",
                    fontStyle: "normal",
                    fontWeight: "500",
                    lineHeight: "normal",
                  }}
                >
                  {item.dayOfMonth}
                </IonText>
                <IonText
                  style={{
                    color: "#FFF",
                    textAlign: "center",
                    fontFamily: "Open Sans",
                    fontSize: "10px",
                    fontStyle: "italic",
                    fontWeight: "500",
                    lineHeight: "normal",
                  }}
                >
                  {item.month.substring(0, 3)}
                </IonText>
              </div>
            ))}
        </div>

        <div
          className="mt-0 mx-4 flex justify-around gap-x-28 text-[#454892] mb-1"
          style={{ fontFamily: "Open Sans" }}
        >
          <IonText
            onClick={() => {
              setSlotType("day");
              setAvailableSlots(slotsData?.daySlots);
            }}
            style={{
              width: "27.77%",
              height: "4.375vh",
              flexShrink: 0,
              borderBottom: "1px solid rgba(0, 0, 0, 0.34)",
              boxShadow:
                slotType == "day"
                  ? "0px 4px 4px 0px rgba(0, 0, 0, 0.45) inset"
                  : " ",
            }}
            className="border-b items-start p-2 text-center text-[13px] font-bold"
          >
            Day Slots
          </IonText>
          <IonText
            onClick={() => {
              setSlotType("evening");
              setAvailableSlots(slotsData?.eveningSlots);
            }}
            className=" text-center text-[13px] font-bold items-end pt-2"
            style={{
              width: "27.77%",
              height: "4.375vh",
              borderBottom: "1px solid rgba(0, 0, 0, 0.34)",
              boxShadow:
                slotType == "evening"
                  ? "0px 4px 4px 0px rgba(0, 0, 0, 0.45) inset"
                  : " ",
              flexShrink: 0,
            }}
          >
            Evening Slots
          </IonText>
        </div>

        <div
          style={{ border: "1px solid #8FA0CB", height: "200px" }}
          className="mx-auto py-2 border-y bg-white text-center"
        >
          <div
            className="flex flex-wrap items-center gap-x-9 gap-y-1 px-5 max-h-[185px] overflow-auto"
            style={{ justifyContent: "flex-start" }} // Adjust this for alignment
          >
            {availbleSlots &&
              availbleSlots.map((time: any, index: number) => (
                <IonText
                  // style={{ fontFamily: "Inter" }}
                  onClick={() => {
                    if (!time?.slotFull) {
                      setSelectedSlots({
                        [time?._id]: !selectedSlots?.[time?._id],
                        slotsData: time,
                      });
                    }
                  }}
                  key={index}
                  className={`border w-[140px] ${time?.slotFull ? "bg-gray opacity-70": ""} h-[33px] flex justify-center items-center font-semibold text-xs rounded-[0.188rem] ${
                    selectedSlots?.[time?._id]
                      ? "border-2 border-[#BCC000]"
                      : !time?.slotFull ? "border-[#2132C3]" : "border-gray"
                  }`}
                  style={{
                    fontFamily: "Inter",
                    marginLeft: index % 2 === 0 ? "0" : "auto",
                    marginRight: index % 2 === 0 ? "auto" : "0",
                  }} // Alternate alignment
                >
                  {time?.timeSlot?.dispaly}
                </IonText>
              ))}
          </div>
        </div>
        
        <div className="relative w-full h-[50px] mt-[50px]">
          <div className="mt-1 w-full h-[50px] bg-white z-10 fixed bottom-0 py-8 left-0 flex items-center justify-center">
            <IonButton
              onClick={() => bookAppointment()}
              className="w-[57.5%] h-[4.375vh] notifyButton rounded-[60px]"
              disabled={isButtonDisabled(selectedSlots, selectedPet)}
            >
              Click to Notify Doctor
            </IonButton>
          </div>
        </div>

        {isNotifyDoctorModal && (
          <NotifyDoctorModal
            pets={selectedPet}
            date={dateConverter(dates[selectedDate])}
            timeSlot={selectedSlots?.slotsData?.timeSlot?.startText ?? ""}
            isOpen={isNotifyDoctorModal}
            token={token}
            onClose={() => {
              setIsNotifyDoctorModal(!isNotifyDoctorModal);
            }}
            onSubmmision={() => {
              appointmentt();
              setIsNotifyDoctorModal(!isNotifyDoctorModal);
              setSelectedDoctor(null);
              setSelectedSlots(null);
              setSelectedPet([]);
              setSelectedDate(0);
              setFlag(true);
              setDisplayBookAppointment(false)
            }}
          />
        )}
      </IonContent>
    </IonPage>
  );
};

export default BookAppointments;
