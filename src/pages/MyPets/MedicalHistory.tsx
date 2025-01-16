import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonModal,
  IonPage,
  IonPopover,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonText,
  RefresherEventDetail,
} from "@ionic/react";
import graphStart from "../../assets/graph-start.svg";
import { useEffect, useRef, useState } from "react";
import addIconBlue from "../../assets/add-icon-blue.svg";
import { useQuery } from "react-query";
import { Preferences } from "@capacitor/preferences";
import graph from "../../assets/graph.svg";
import cloud from "../../assets/Upload to Cloud.png";
import {
  getTreatmentDatelist,
  getTreatmentHistory,
  postMedicalCard,
  postPrescription,
  postReportCard,
  treatementHistoryofPet,
} from "../../service/services";
import { getImageByName } from "../../utils/imagesUtil";
import { caretDownOutline, pawOutline, recording } from "ionicons/icons";
import Modal from "./Modal";
import ModalForReport from "./Modal";
import moment from "moment";

const MedicalHistory = ({ details }: any) => {
  // /api/treatment/history/item
  const [dates, setDates] = useState<any>([]);
  const [dateList, setDateList] = useState<any>([]);
  const [selectedDate, setSelectedDate] = useState<any>();
  const [treatementHistory, setTreatmentHistory] = useState<any>([]);
  const [clickedRowIndex, setClickedRowIndex] = useState(null);
  const [dateForDisplay, setDateForDisplay] = useState<string>("");
  const [totalCost, setTotalCost] = useState<any>();
  const [token, setToken] = useState<null | string>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [treatmenthistoryForButton, setTreatmenthistoryForButton] = useState<any>([])
  const [showAdditionalModal, setShowAdditionalModal] = useState<{
    show: boolean;
    type: string;
  }>({
    show: false,
    type: "",
  });


  useEffect(()=>{
    setShowOptions(false)
  },[details,selectedDate])

  useEffect(() => {
    (async () => {
      const tokenValue = await Preferences.get({ key: "token" });
      setToken(tokenValue.value!);
    })();
  }, []);

  useEffect(() => {
    console.log("details", details);
    if (details?.result?._id) {
      handleGetTreatmentDate();
    }
  }, [details]);

  async function handleGetTreatmentDate() {
    const response = await getTreatmentDatelist(details?.result?._id);
    setDateList(response?.data);
    setSelectedDate(response?.data[0])
  }

  console.log("dataIn ters: ", dateList);

  useEffect(() => {
    const totalUnitCost =
      treatementHistory &&
      treatementHistory?.data?.reduce((total: any, item: any) => {
        return total + item.unit_cost;
      }, 0);
    if (treatementHistory) {
      setTotalCost(totalUnitCost);
    }
  }, [treatementHistory]);

  // useEffect(() => {
  //   const getNext14Days = () => {
  //     const currentDate = new Date();
  //     const days = [
  //       "Sunday",
  //       "Monday",
  //       "Tuesday",
  //       "Wednesday",
  //       "Thursday",
  //       "Friday",
  //       "Saturday",
  //     ];
  //     const months = [
  //       "January",
  //       "February",
  //       "March",
  //       "April",
  //       "May",
  //       "June",
  //       "July",
  //       "August",
  //       "September",
  //       "October",
  //       "November",
  //       "December",
  //     ];

  //     const datess = [];
  //     for (let i = 0; i < dateList.length; i++) {
  //       const date = new Date(dateList[i]);
  //       const day = days[date.getDay()];
  //       const dayOfMonth = date.getDate();
  //       const month = months[date.getMonth()];
  //       datess.push({ day, dayOfMonth, month });
  //     }
  //     setDates(datess);
  //   };
  //   if (dateList) {
  //     getNext14Days();
  //   }
  // }, [dateList]);

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

    const d = new Date();
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

  function dateConverter(currentdate: any) {
    const formatDate1 = currentdate;
    console.log("format date : ", formatDate1);
    const date = new Date(formatDate1);
    date.setHours(0, 0, 0, 0);

    const slotDate = date.toISOString();
    console.log("Date : ", slotDate);
    return slotDate;
  }

  const handleImageClick = () => {
    setShowOptions(!showOptions);
  };

  useEffect(() => {
    if (details?.result?._id && selectedDate) {
      treatmentHistory();
      setDateForDisplay(selectedDate);
    }
  }, [selectedDate]);


  async function treatmentHistory() {
    const response = await getTreatmentHistory(
      details?.result?._id,
      dateConverter(selectedDate)
    );
    setTreatmenthistoryForButton(response)
    console.log("details here: ", response)
    
    const groupedProductsByPetId = response && response?.data?.reduce((acc: any, currentItem: any) => {
      const petId = currentItem.pet._id;

      if (!acc[petId]) {
        acc[petId] = {
          pet: currentItem.pet,
          products: [],
          total_amount: 0
        };
      }

      // Add the current product to the products array
      acc[petId].products.push({
        ...currentItem.product,
        quantity: currentItem.quantity,
        cost: currentItem.cost
      });
      // acc[petId].products.push(currentItem.product);

      // Add the unit_cost of the current product to total_amount
      acc[petId].total_amount += (currentItem.cost);

      return acc;
    }, {});

    // Convert the object into an array of objects, where each object contains pet data, the corresponding products, and the total amount
    const result = Object.keys(groupedProductsByPetId).map(petId => ({
      pet: groupedProductsByPetId[petId].pet,
      products: groupedProductsByPetId[petId].products,
      total_amount: groupedProductsByPetId[petId].total_amount
    }));

    setTreatmentHistory(result)
  }
  console.log("trestment date : ", treatementHistory);

  const truncateText = (text: any, maxLength: any) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };
  const handleRowClick = (index: any) => {
    setClickedRowIndex(clickedRowIndex === index ? null : index);
  };

  useEffect(()=>{
    if(dateList && dateList.length == 0){
      setTreatmentHistory([])
    }
  },[dateList])

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    if (details?.result?._id) {
      handleGetTreatmentDate().finally(() => {
        event.detail.complete();
      })
    };
  };

  return (
    <IonPage className="">
      <IonContent className="mt-0">
      {/* <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent
          pullingIcon="arrow-down-circle-outline"
          pullingText="Pull to refresh"
          refreshingSpinner="circles"
          refreshingText="Refreshing..."
          className="bg-white h-[100px]"
        />
      </IonRefresher> */}
        <div className="flex items-center h-[12.5vh] mx-7 bg-white gap-x-3 overflow-auto mt-0 mb-0">
          {dateList && dateList.length > 0 ? (
            dateList?.map((item: any, index: number) => (
              <div
                onClick={() => setSelectedDate(item)}
                style={{
                  fontFamily: "Open Sans",
                  boxShadow:
                    selectedDate === item
                      ? "0px 4px 4px 0px rgba(14, 14, 14, 0.80) inset"
                      : "",
                }}
                className={`h-[55px] min-w-[35px]  ${
                  selectedDate === item ? "bg-[#43BAAC]" : "bg-[#4E539C]"
                }  text-white flex flex-col justify-between items-center rounded-[10px] py-1`}
              >
                <IonText
                  style={{
                    color: "#FFF",
                    textFamily: "Open Sans",
                    fontSize: "9px",
                    fontStyle: "normal",
                    fontWeight: "500",
                  }}
                >
                  {moment(item)
                  .format("dddd")
                  .substring(0,2)}
                  {/* {item.day.substring(0,2)} */}
                </IonText>
                <IonText
                  style={{
                    color: "#FFF",
                    textAlign: "center",
                    fontFamily: "Open Sans",
                    fontSize: "13px",
                    fontStyle: "normal",
                    fontWeight: "500",
                    lineHeight: "normal",
                  }}
                >
                  {moment(item).format("DD")}
                  {/* {item.dayOfMonth} */}
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
                  {moment(item).format("MMM")}
                  {/* {item.month.substring(0, 3)} */}
                </IonText>
              </div>
            ))
          ) : (
            <div>No dates available</div>
          )}
        </div>

        <div className="flex justify-center items-center mt-0 mb-0">
          <IonCard
            className="bg-white w-[90%] mt-0 mb-0 border border-[#97AADC] h-[17rem] rounded-lg"
            style={{ boxShadow: "none" }}
          >
            <IonCardContent>
              <div
                className="flex justify-between items-center border-b border-[#97AADC] p-2"
                style={{
                  color: "#000",
                  fontFamily: "Open Sans",
                  fontSize: "10px",
                  fontWeight: "600",
                  lineHeight: "110%",
                  letterSpacing: "1.6px",
                }}
              >
                <IonText className="text-sm font-bold text-[#000000]">
                  Date : {moment(dateForDisplay).format("DD-MM-YYYY")}
                </IonText>
                <IonText className="font-bold text-sm text-[#000000]">
                  Total : ₹ {treatementHistory[0]?.total_amount}
                </IonText>
              </div>

              <IonGrid className="overflow-auto max-h-[190px] mt-5 m-0 p-0 w-full">
                {/* Table Header */}
                <IonRow
                  style={{
                    fontFamily: "Open Sans",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 800,
                    lineHeight: "110%",
                    letterSpacing: "1.92px",
                    textTransform: "uppercase",
                    color: "#000",
                  }}
                  className="flex justify-between items-center"
                >
                  <IonText>Item Name </IonText>
                  <IonText>Item Type</IonText>
                  <IonText>Cost</IonText>
                </IonRow>

                {/* Table Rows */}

                {treatementHistory &&
                  treatementHistory[0]?.products?.map((item: any, index: number) => (
                    <IonRow
                      className="flex justify-between items-center my-3"
                      style={{
                        fontFamily: "Open Sans",
                        fontSize: "12px",
                        fontStyle: "normal",
                        fontWeight: "600",
                        lineHeight: "110%",
                        letterSpacing: "1.92px",
                        textTransform: "uppercase",
                        color: "#000",
                      }}
                      key={index}
                      onClick={() => handleRowClick(index)}
                    >
                      <IonText
                        style={{
                          height: clickedRowIndex === index ? "auto" : "auto",
                          width: "37%",
                        }}
                      >
                        {clickedRowIndex === index
                          ? item?.name
                          : truncateText(item?.name, 8)}
                      </IonText>
                      <IonText
                        style={{
                          width: "30%",
                          height: clickedRowIndex === index ? "auto" : "auto",
                        }}
                      >
                        {clickedRowIndex === index
                          ? item?.category
                          : truncateText(item.category, 8)}
                      </IonText>
                      <IonText
                        style={{
                          height: clickedRowIndex === index ? "auto" : "auto",
                          width: "20%",
                          textAlign: "right",
                        }}
                      >
                        {(item.cost).toFixed(2)}
                      </IonText>
                    </IonRow>
                  ))}

                {/* <IonRow className="flex justify-between items-center" style={{
                  fontFamily: "Open Sans",
                  fontSize: '12px',
                  fontStyle: 'normal',
                  fontWeight: '600',
                  lineHeight: '110%',
                  letterSpacing: '1.92px',
                  textTransform: 'uppercase',
                  color: '#000'
                }}>
                  <IonText className=" ">ANOTHER ITEM</IonText>
                  <IonText className="">SUPPLEMENT</IonText>
                  <IonText className=" ">100.00</IonText>
                </IonRow> */}
              </IonGrid>
            </IonCardContent>
          </IonCard>
        </div>
        <div className="relative w-full">
          <div className="fixed bottom-3 left-0 flex justify-center items-center w-full px-5">
            {/* <div className="flex justify-center mt-10 items-center w-1/2">
              <IonIcon src={getImageByName("recordingIcon")} className="w-[55px] h-[55px] mr-3" />
              <IonImg src={graph} className="w-52 mr-6 bg-[#ECEFF8]" />
            </div> */}
            <div className="flex justify-center mt-10 items-center w-1/3">
              <div className="w-[55px] h-[55px] mr-3" /> 
              <div className="w-52 mr-6 bg-[#ECEFF8]" />
            </div>
            <div className="relative flex justify-center items-center w-full">
              <div className="">
              {showOptions && (
                <div className="text-xxs font-semibold font-openSans custom-text absolute z-10 flex flex-col items-end right-5 bottom-0">
                  <IonText
                    onClick={() =>
                      {
                        setShowOptions(false);
                        setShowAdditionalModal({
                        show: !showAdditionalModal?.show,
                        type: "Medical Card",
                      })}
                    }
                    className={`transition-transform duration-150 active:bg-gray ease-in-out active:scale-95 touch-none border border-[#BCB4B4] ${treatmenthistoryForButton?.medicalCardUploadFlag ? 'bg-[#43BAAC] text-white' : 'bg-[#fff]'} p-2 text-[12px] rounded-full w-[160px] h-[31px] flex items-center justify-center`}
                  >
                    {treatmenthistoryForButton?.medicalCardUploadFlag ? "Medical Card Uploaded" :"Medical Card"}
                  </IonText>
                  <IonText
                    onClick={() =>
                    {
                      setShowOptions(false);
                      setShowAdditionalModal({
                        show: !showAdditionalModal?.show,
                        type: "Lab Report",
                      })
                    }}
                    className={`transition-transform duration-150 active:bg-gray ease-in-out active:scale-95 touch-none border border-[#BCB4B4] mt-1 ${treatmenthistoryForButton?.reportUploadFlag ? 'bg-[#43BAAC] text-white' : 'bg-[#fff]'} p-2 text-[12px] rounded-full w-[160px] h-[31px] flex items-center justify-center`}
                  >
                    {treatmenthistoryForButton?.reportUploadFlag ? "Lab Report Uploaded" :"Lab Report"}
                  </IonText>
                  <IonText
                    onClick={() =>
                    {
                      setShowOptions(false);
                      setShowAdditionalModal({
                        show: !showAdditionalModal?.show,
                        type: "Prescription",
                      })
                    }}
                    className={`transition-transform duration-150 active:bg-gray ease-in-out active:scale-95 touch-none border border-[#BCB4B4] mt-1 ${treatmenthistoryForButton?.prescriptionUploadFlag ? 'bg-[#43BAAC] text-white' : 'bg-[#fff]'} p-2 text-[12px] rounded-full w-[160px] h-[31px] flex items-center justify-center`}
                  >
                    {treatmenthistoryForButton?.prescriptionUploadFlag ? "Prescription Uploaded" :"Prescription"} 
                  </IonText>
                </div>
              )}

              <IonImg
                src={addIconBlue}
                onClick={()=> dateList.length >0 ? handleImageClick() : {}}
                className="absolute h-[55px] w-[55px] right-0 top-0 z-10 transition-transform duration-75 ease-in-out active:scale-95 touch-none"
                style={{opacity: dateList && dateList.length >0 ? 1:0.5}}
              />

              <IonText
                className="custom-text absolute mt-[13px] right-[3.5rem] text-[#000] font-bold text-[13px]"
                style={{ fontFamily: "Segoe UI" ,opacity: dateList && dateList.length >0 ? 1:0.5}}
                
              >
              Upload Documents
              </IonText>
              </div>
              {/* <IonCard
                className="bg-white w-full "
                style={{
                  border: "none",
                  background: "transparent",
                  boxShadow: "none",
                  margin: 0,
                }}
              >
                <IonCardContent>
                  <div className="flex justify-between items-center w-full">
                    <div
                      onClick={() =>
                        setShowAdditionalModal({
                          show: !showAdditionalModal?.show,
                          type: "Medical Report",
                        })
                      }
                      className="flex flex-col items-center space-y-1"
                    >
                      <div className="h-[75px] w-[90px] bg-customGray border-b-2 border-b-gray1 rounded-lg flex items-center justify-center p-1 text-xs">
                        <IonText
                          className="text-center"
                          style={{
                            fontFamily: "Open Sans",
                            color: "#000",
                            textAlign: "center",
                            fontSize: "10px",
                            fontStyle: "normal",
                            fontWeight: "600",
                            lineHeight: "110%",
                            letterSpacing: "1.6px",
                            textTransform: "uppercase",
                          }}
                        >
                          Upload Med Card
                        </IonText>
                      </div>
                      <div className="h-8 w-14">
                        <IonImg src={cloud} />
                      </div>
                    </div>

                    <div
                      onClick={() =>
                        setShowAdditionalModal({
                          show: !showAdditionalModal?.show,
                          type: "Lab Report",
                        })
                      }
                      className="flex flex-col items-center space-y-1"
                    >
                      <div className="h-[75px] w-[90px] bg-customGray border-b-2 border-b-gray1 rounded-lg flex items-center justify-center p-1 text-xs">
                        <IonText
                          className="text-center"
                          style={{
                            fontFamily: "Open Sans",
                            color: "#000",
                            textAlign: "center",
                            fontSize: "10px",
                            fontStyle: "normal",
                            fontWeight: "600",
                            lineHeight: "110%",
                            letterSpacing: "1.6px",
                            textTransform: "uppercase",
                          }}
                        >
                          Upload Lab reports
                        </IonText>
                      </div>
                      <div className="h-8 w-14">
                        <IonImg src={cloud} />
                      </div>
                    </div>

                    <div
                      onClick={() =>
                        setShowAdditionalModal({
                          show: !showAdditionalModal?.show,
                          type: "Prescription Report",
                        })
                      }
                      className="flex flex-col items-center space-y-1"
                    >
                      <div className="h-[75px] w-[90px] bg-customGray border-b-2 border-b-gray1 rounded-lg flex items-center justify-center p-1 text-xs">
                        <IonText
                          className="text-center"
                          style={{
                            fontFamily: "Open Sans",
                            color: "#000",
                            textAlign: "center",
                            fontSize: "10px",
                            fontStyle: "normal",
                            fontWeight: "600",
                            lineHeight: "110%",
                            letterSpacing: "1.6px",
                            textTransform: "uppercase",
                          }}
                        >
                          Upload Prescription
                        </IonText>
                      </div>
                      <div className="h-8 w-14">
                        <IonImg src={cloud} />
                      </div>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard> */}
            </div>
          </div>
        </div>
        
        {(showAdditionalModal.show == true && dateForDisplay ) && <ModalForReport 
        showDropdown= {showDropdown}
        showAdditionalModal = {showAdditionalModal} 
        setShowAdditionalModal = {setShowAdditionalModal} 
        setShowDropdown= {setShowDropdown}
        petId= {details?.result?._id}
        date = {dateConverter(selectedDate)}
        handleGetTreatmentDate = {treatmentHistory}
        />}
      </IonContent>
    </IonPage>
  );
};

export default MedicalHistory;
