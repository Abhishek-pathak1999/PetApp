import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonText,
  IonLabel,
  IonImg,
  IonRouterLink,
  IonItem,
  IonNavLink,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonLoading,
} from "@ionic/react";
import { getWidthInPercentage } from "../utils/widthUtil";
import "tailwindcss/tailwind.css"; // Ensure TailwindCSS is imported
import { useHistory, useLocation } from "react-router";
import Notyfy from "../components/Notyfy";
import TreatmentsCompleteModel from "../components/TreatmentsCompleteModel";
import addIconBlue from "../assets/add-icon-blue.svg";
import catImg from "../assets/cat-img.png";
import HomeUpcomingAppoin from "../components/Booking Appointment/HomeUpcomingAppoin";
import ClinicUpcomingAppointment from "../components/Notyfy";
import { getTreatmentDone, getUpComingAppointment, handleGetDoctors } from "../service/services";
import { getImageByName } from "../utils/imagesUtil";
import moment from "moment";
import BookAppointments from "./BookAppointments";
import { useQuery } from "react-query";

const Appointments: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { done }: any = location.state || {};
  const [isTreatmentsCompleteModel, setIsTreatmentsCompleteModel] =
    useState<any>({ type: false, data: null });
  const [flag, setFlag] = useState(false);
  const [blockAppointmentCreation, setBlockAppointmentCreation] = useState<any>(false)
  const [showOptions, setShowOptions] = useState(false);
  const [activeText, setActiveText] = useState<string>("inClinic");
  const [previousTreatment, setPreviousTreatment] = useState<any>([]);
  const [displayBookAppointment, setDisplayBookAppointment] = useState(false);
  const [selectedClinicData, setSelectedClinicData] = useState<any>({});
  const [upcomingTreatment, setUpcomingTreatment] = useState<any>([]);
  const [isParentLoading, setIsParentLoading] = useState<boolean>(false)
  const [enableRefresh, setEnableRefresh] = useState(false);

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    const startY = touch.clientY;
    setEnableRefresh(startY < 350);
  };

  useEffect(() => {
    handlePreviousAppointment();
  }, [done]);

  console.log("previous: ", previousTreatment);

  const handleImageClick = () => {
    setShowOptions(!showOptions);
  };

  const handleSucessClick = () => {
    history.push("/dashboard/treatment-success");
  };

  const handleTextClick = (textType: string) => {
    setActiveText(textType);
    if (textType == "homeAppointment") {
      setFlag(true);
    } else {
      setFlag(false);
    }
  };

  async function handlePreviousAppointment() {
    try {
      setIsParentLoading(true)
      const response = await getTreatmentDone();
      console.log("satatus ", response);
      if (response?.isSuccess) {
        setPreviousTreatment(response?.result);
        setIsParentLoading(false)
      } else {
        console.error("Failed to fetch products:", response);
        setIsParentLoading(false)
      }
    } catch (error) {
      console.error("An error occurred while fetching products:", error);
      setIsParentLoading(false)
    }
  }
  const { data: doctorsData } = useQuery({
    queryKey: ["getDoctors"],
    queryFn: () => handleGetDoctors(),
    
  });

  async function handleUpcomingAppointment() {
    try {
      const response = await getUpComingAppointment();
      console.log("satatus ", response);
      if (response?.isSuccess) {
        setUpcomingTreatment(response?.result);
        if(response?.result.length>0){
          setBlockAppointmentCreation(true)
        }else{
          setBlockAppointmentCreation(false)
        }
      } else {
        console.error("Failed to fetch products:", response);
      }
    } catch (error) {
      console.error("An error occurred while fetching products:", error);
    }
  }

  console.log("page: ", doctorsData)
  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    handlePreviousAppointment().finally(() => {
      // setDisplayBookAppointment(false);
      handleUpcomingAppointment()
      event.detail.complete();
    });
  };

  if (isParentLoading) {
    return <IonLoading isOpen={true} className="bg-white"/>;
  }
  console.log("selectedClinicData: ", selectedClinicData, doctorsData, displayBookAppointment)

  return (
    <IonPage>
      <IonContent onTouchStart={handleTouchStart} className="flex flex-col h-full overflow-y-auto">
      {enableRefresh && <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent
          
        />
      </IonRefresher>}
        <>
          {displayBookAppointment && Object.keys(selectedClinicData).length > 0 && doctorsData.length>0 ? (
            <BookAppointments handleUpcomingAppointment={handleUpcomingAppointment} doctorsData={doctorsData} setDisplayBookAppointment={setDisplayBookAppointment} selectedClinicData={selectedClinicData}/>
          ) : (
            <div className="flex flex-col justify-center items-center flex-1">
              {upcomingTreatment.length > 0 && <IonText
                className="mt-3 mb-3 text-[#000]"
                style={{
                  fontFamily: "Segoe UI",
                  fontWeight: 700,
                  fontSize: "12px",
                }}
              >
                Upcoming Appointments
              </IonText>}

              {activeText === "homeAppointment" && <HomeUpcomingAppoin />}
              {activeText === "inClinic" && (
                <ClinicUpcomingAppointment handleUpcomingAppointment={handleUpcomingAppointment} upcomingTreatment={upcomingTreatment} displayBookAppointment={displayBookAppointment} setBlockAppointmentCreation={setBlockAppointmentCreation} setDisplayBookAppointment={setDisplayBookAppointment} doctorsData={doctorsData} setSelectedClinicData={setSelectedClinicData} />
              )}
              {upcomingTreatment.length == 0 && activeText === "inClinic" &&
              <div className="flex flex-col justify-center items-center mt-16">
                
                <IonText
                  className="custom-text mt-[1.70rem] text-[#555] text-[12px] font-bold "
                  style={{ fontFamily: "Segoe UI" }}
                >
                  Create Appoinment
                </IonText>
                <div className="w-[156px] h-[104px] flex justify-center items-center transition-transform duration-75 ease-in-out active:scale-95"
                  style={{boxShadow:"0px 4px 3px 1px #4460A9", border:"0.5px solid rgba(68, 96, 169, 0.60)", borderRadius:"10px"}}
                  onClick={handleImageClick}
                >
                  <IonImg
                    src={getImageByName("vetranDoctor")}
                    
                    className=" h-[55px] w-[55px]"
                  />
                </div>
                {showOptions && (
                <div className="text-xxs font-semibold font-openSans custom-text pt-2 flex flex-col items-center">
                  {/* <div className="absolute top-9 -left-[160px]">
                    {blockAppointmentCreation && <div className="text-[red] text-xxs"> 
                      *Already appointment created,<br/> delete this and create new one
                    </div>}
                  </div> */}
                  <IonText
                    onClick={() => {
                      if (!blockAppointmentCreation) {
                        setDisplayBookAppointment(true);
                        setSelectedClinicData({ allAppointmentData: null, flagType: "new" });
                        setShowOptions(false);
                      }
                    }}
                    className={`border border-[#BCB4B4] ${blockAppointmentCreation ? 'bg-[#9d9d9d]' : 'bg-[#fff]'} p-2 text-[12px] rounded-full w-[143px] h-[31px] flex items-center justify-center ${blockAppointmentCreation ? 'opacity-25' : 'opacity-100'}`}
                  >
                    In Clinic Appointment
                  </IonText>
                  <IonText
                    onClick={() => history.push("/dashboard/home-booking")}
                    className="border border-[#BCB4B4] mt-1 bg-[#fff] p-2 text-[12px] rounded-full w-[172px] h-[31px] flex items-center justify-center"
                  >
                    Home Service Appointment
                  </IonText>
                </div>
                )}
              </div>}
            </div>
          )}
          

          <div className="h-[55%] w-full bottom-0 fixed">
      
            <div className="absolute top-10 h-full w-full flex flex-col justify-center items-center border-t border-[#6168A642] overflow-hidden">
              <div className="bg-[#4E539C] w-full h-[30px] mb-2 flex justify-center items-center">
                <IonText
                  className="text-center my-2 mb-3 text-[12px] font-bold"
                  style={{
                    fontFamily: "Segoe UI",
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  Previous Appointments
                </IonText>
              </div>
              <div className="flex justify-between items-center">
                <IonText
                  className="mr-4"
                  onClick={() => handleTextClick("inClinic")}
                  style={{
                    width: "148px",
                    height: "35px",
                    flexShrink: "0",
                    color: "rgba(69, 72, 146, 0.81)",
                    textAlign: "center",
                    fontFamily: "Open Sans",
                    fontSize: "12px",
                    fontWeight: "600",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.34)",
                    boxShadow:
                      activeText === "inClinic"
                        ? "0px 4px 4px 0px rgba(0, 0, 0, 0.45) inset"
                        : "none",
                  }}
                >
                  In Clinic <br /> Appointment
                </IonText>

                <IonText
                  onClick={() => handleTextClick("homeAppointment")}
                  style={{
                    width: "148px",
                    height: "35px",
                    flexShrink: "0",
                    color: "rgba(69, 72, 146, 0.81)",
                    textAlign: "center",
                    fontFamily: "Open Sans",
                    fontSize: "12px",
                    fontWeight: "600",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.34)",
                    boxShadow:
                      activeText === "homeAppointment"
                        ? "0px 4px 4px 0px rgba(0, 0, 0, 0.45) inset"
                        : "none",
                  }}
                >
                  At Home
                  <br /> Appointment
                </IonText>
              </div>

              <div className="w-full mt-3 mb-10 h-[250px] max-h-[250px] overflow-auto">
                {previousTreatment &&
                  previousTreatment.map((item: any, index: number) => (
                    (item?.status == 'TREATMENT_SAVE' ? <IonCard
                      key={index}
                      style={{ border: "none", boxShadow: "none" }}
                      className="ion-no-padding"
                    >
                      <IonCardContent
                        onClick={() =>
                          setIsTreatmentsCompleteModel({
                            type: true,
                            data: item,
                          })
                        }
                        className="flex h-[75px] p-1 rounded-xl items-center mx-3 transition-transform duration-150 ease-in-out active:scale-95"
                        style={{
                          border: "1px solid rgba(68, 96, 169, 0.60)",
                          background: "rgba(202, 221, 221, 0.15)",
                        }}
                      >
                        <div className="h-[55px] w-[35px] bg-[#4E539C] text-[#fff] rounded-[10px] flex flex-col justify-center items-center">
                          <IonText
                            style={{
                              color: "#FFF",
                              fontFamily: "Open Sans",
                              fontSize: "10px",
                              fontWeight: "500",
                            }}
                          >
                            {moment(item?.treatmentDone)
                              .format("dddd")
                              .substring(0,2)}
                          </IonText>
                          <IonText
                            style={{
                              color: "#FFF",
                              textAlign: "center",
                              fontFamily: "Open Sans",
                              fontSize: "13px",
                              fontWeight: "500",
                            }}
                          >
                            {moment(item?.treatmentDone).format("DD")}
                          </IonText>
                          <IonText
                            style={{
                              color: "#FFF",
                              textAlign: "center",
                              fontFamily: "Open Sans",
                              fontSize: "10px",
                              fontStyle: "italic",
                              fontWeight: "500",
                            }}
                          >
                            {moment(item?.treatmentDone).format("MMM")}
                          </IonText>
                        </div>

                        <div
                          className="flex flex-col mx-2 overflow-x-auto"
                          style={{ fontFamily: "Open Sans" }}
                        >
                          <IonText className="custom-text font-bold text-[#2C60AF] text-xxs">
                            Treatment done at - Dr.{" "}
                            {item?.appointment?.doctor?.first_name}{" "}
                            {item?.appointment?.doctor?.last_name}
                          </IonText>
                          <div className="flex items-center ml-2">
                            {item?.appointment?.pets.map(
                              (pet: any, petIndex: number) => (
                                <div
                                  key={petIndex}
                                  className="flex flex-col justify-center items-center mr-2"
                                >
                                  <IonLabel className="custom-text font-semibold text-[10px] text-[#000]">
                                    {pet?.pet_name}
                                  </IonLabel>
                                  <img
                                    src={
                                      pet?.image_base_url 
                                        ? pet.image_base_url
                                        : pet?.animal_type === "Cat"
                                        ? getImageByName("catfree")
                                        : pet?.animal_type === "Dog"
                                        ? getImageByName("dogfree")
                                        : getImageByName("otherfree")
                                    }
                                    style={{ borderRadius: "100%" }}
                                    onError={(e: any) => {
                                      if (pet?.animal_type === "Cat") {
                                        e.currentTarget.src =
                                          getImageByName("catfree");
                                      } else if (pet?.animal_type === "Dog") {
                                        e.currentTarget.src =
                                          getImageByName("dogfree");
                                      } else {
                                        e.currentTarget.src =
                                          getImageByName("otherfree");
                                      }
                                    }}
                                    className="w-[40px] h-[40px] object-cover"
                                  />
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </IonCardContent>
                    </IonCard>
                    :
                    <IonCard
                    key={index}
                    style={{ border: "none", boxShadow: "none" }}
                    className="ion-no-padding"
                    >
                    <IonCardContent
                      className="relative flex h-[75px] p-1 rounded-xl items-center mx-3 bg-gray"
                      style={{
                        border: "1px solid rgba(68, 96, 169, 0.60)",
                      }}
                    >
                      <div style={{borderRadius:"2px"}} className="absolute top-1.5 right-2 px-1 h-5 bg-white flex justify-between items-center"><span className="opacity-100 text-black font-bold">Cancelled</span></div>
                      <div className="h-[55px] w-[35px] bg-[#4E539C] text-[#fff] rounded-[10px] flex flex-col justify-center items-center">
                        <IonText
                          style={{
                            color: "#FFF",
                            fontFamily: "Open Sans",
                            fontSize: "10px",
                            fontWeight: "500",
                          }}
                        >
                          {moment(item?.appointmentDate)
                            .format("dddd")
                            .substring(0,2)}
                        </IonText>
                        <IonText
                          style={{
                            color: "#FFF",
                            textAlign: "center",
                            fontFamily: "Open Sans",
                            fontSize: "13px",
                            fontWeight: "500",
                          }}
                        >
                          {moment(item?.appointmentDate).format("DD")}
                        </IonText>
                        <IonText
                          style={{
                            color: "#FFF",
                            textAlign: "center",
                            fontFamily: "Open Sans",
                            fontSize: "10px",
                            fontStyle: "italic",
                            fontWeight: "500",
                          }}
                        >
                          {moment(item?.appointmentDate).format("MMM")}
                        </IonText>
                      </div>

                      <div
                        className="flex flex-col mx-2 overflow-x-auto"
                        style={{ fontFamily: "Open Sans" }}
                      >
                        <IonText className="custom-text font-bold text-[#2C60AF] text-xxs">
                          Treatment done at - Dr.{" "}
                          {item?.doctor?.first_name}{" "}
                          {item?.doctor?.last_name}
                        </IonText>
                        <div className="flex items-center ml-2">
                          {item?.pets.map(
                            (pet: any, petIndex: number) => (
                              <div
                                key={petIndex}
                                className="flex flex-col justify-center items-center mr-2"
                              >
                                <IonLabel className="custom-text font-semibold text-[10px] text-[#000]">
                                  {pet?.pet_name}
                                </IonLabel>
                                <img
                                  src={
                                    pet?.image_base_url 
                                      ? pet.image_base_url
                                      : pet?.animal_type === "Cat"
                                      ? getImageByName("catfree")
                                      : pet?.animal_type === "Dog"
                                      ? getImageByName("dogfree")
                                      : getImageByName("otherfree")
                                  }
                                  style={{ borderRadius: "100%" }}
                                  onError={(e: any) => {
                                    if (pet?.animal_type === "Cat") {
                                      e.currentTarget.src =
                                        getImageByName("catfree");
                                    } else if (pet?.animal_type === "Dog") {
                                      e.currentTarget.src =
                                        getImageByName("dogfree");
                                    } else {
                                      e.currentTarget.src =
                                        getImageByName("otherfree");
                                    }
                                  }}
                                  className="w-[40px] h-[40px] object-cover"
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </IonCardContent>
                    </IonCard>
                    )

                  ))}
              </div>

              {isTreatmentsCompleteModel?.type && (
                <TreatmentsCompleteModel
                  isOpen={isTreatmentsCompleteModel?.type}
                  onClose={() =>
                    setIsTreatmentsCompleteModel({ type: false, data: null })
                  }
                  data={isTreatmentsCompleteModel?.data}
                />
              )}
            </div>
          </div>
        </>
      </IonContent>
    </IonPage>
  );
};

export default Appointments;
