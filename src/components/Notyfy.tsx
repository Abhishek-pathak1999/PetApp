import {
  IonAlert,
  IonCard,
  IonCardContent,
  IonImg,
  IonLabel,
  IonText,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { getWidthInPercentage } from "../utils/widthUtil";
import {
  deleteAppointment,
  getTreatmentDone,
  getUpComingAppointment,
} from "../service/services";
import moment from "moment";
import { getImageByName } from "../utils/imagesUtil";
import { useHistory } from "react-router";
import { Geolocation, PermissionStatus } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";
import { useIonToast } from '@ionic/react';
import { InAppBrowser } from "@ionic-native/in-app-browser"
import MapComponent from "./Gmap";

const ClinicUpcomingAppointment = ({
  setDisplayBookAppointment,
  setSelectedClinicData,
  doctorsData,
  setBlockAppointmentCreation,
  displayBookAppointment,
  upcomingTreatment,
  handleUpcomingAppointment,
}: any) => {
  const history = useHistory();
  
  const [permissionGranted, setPermissionGranted] = useState<any>(false);
  const [showAlert, setShowAlert] = useState(false);
  const [presentToast] = useIonToast();
  const [latLong, setLatLong] = useState<any>([{startLat:null, startLong:null}])

  useEffect(() => {
    handleUpcomingAppointment()
    checkPermissions();
  }, [displayBookAppointment]);

  

  console.log("upcoming: ", upcomingTreatment);

  async function handleDeleteAppointment(id: any) {
    try {
      const response = await deleteAppointment(id);
      if (response?.isSuccess) {
        presentToast({
          message: response?.message,
          duration: 2000,
          color: 'success',
        });
        handleUpcomingAppointment();
        setTimeout(() => {
          setSelectedClinicData({});
      }, 500);
      } else {
        presentToast({
          message: response?.message,
          duration: 2000,
          color: 'danger',
        });
      }
    } catch (error) {
      presentToast({
        message: 'An error occurred while deleting the appointment.',
        duration: 2000,
        color: 'danger',
      });
    }
  }

  const openGoogleMaps = async (startLatitude:any, startLongitude:any, endLatitude:any, endLongitude:any) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${26.37},${82.69}&destination=${endLatitude},${endLongitude}&travelmode=driving`;

    const browser = InAppBrowser.create(url, '_system'); // '_system' opens in the default external browser
    browser.show();
  };

  const getCurrentLocation = async (doctor:any) => {
    if (permissionGranted) {
      if (Capacitor.isNativePlatform()) {
        // For native platforms
        try {
          const position = await Geolocation.getCurrentPosition();
          const { latitude, longitude } = position.coords;
          console.log("Current Position (Native):", latitude, longitude);
          openGoogleMaps(latitude,longitude,doctor?.latitude, doctor?.longitude)
          setLatLong([{startLat: latitude, startLong:longitude, endLat:doctor?.latitude,endLong:doctor?.longitude}])
          // alert(`lat and long : ${latitude}, ${longitude}`);
          // Use latitude and longitude as needed
        } catch (error) {
          console.error("Error getting location (Native):", error);
        }
      } else {
        // For web platform using the browser's Geolocation API
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              console.log("Current Position :", latitude, longitude);
              // Use latitude and longitude as needed
              openGoogleMaps(latitude,longitude,doctor?.latitude, doctor?.longitude)
              // alert(`lat and long : ${latitude}, ${longitude}`);
            },
            (error) => {
              console.error("Error getting location (Web):", error);
            }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      }
    } else {
      console.error("Permission not granted. Cannot fetch location.");
    }
  };

  function handleDocLocationInvalid(){
    presentToast({
      message: "Doctor location not found !",
      duration: 2000,
      color: 'danger',
    });
  }

  
  const checkPermissions = async () => {
    if (Capacitor.isNativePlatform()) {
      const permissionStatus: PermissionStatus = await Geolocation.checkPermissions();

      if (permissionStatus.location === "granted") {
          const position = await Geolocation.getCurrentPosition();
          const { latitude, longitude } = position.coords;
          setLatLong([{startLat: latitude, startLong:longitude}])
          setPermissionGranted(true);
      } else {
        const requestPermissionStatus: PermissionStatus = await Geolocation.requestPermissions();
        if (requestPermissionStatus.location === "granted") {
          const position = await Geolocation.getCurrentPosition();
          const { latitude, longitude } = position.coords;
          setLatLong([{startLat: latitude, startLong:longitude}])
          setPermissionGranted(true);
        } else {
          console.error("Location permission not granted");
        }
      }
    } else {
      // For web, we assume permission will be granted via browser prompt
      setPermissionGranted(true);
    }
  };


  return (
    <>
      <div
        className="max-w-full overflow-x-scroll flex mx-5"
        style={{
          scrollSnapType: "x mandatory",
        }}
      >
        {upcomingTreatment &&
          upcomingTreatment.length > 0 &&
          upcomingTreatment.map((item: any, index: number) => (
            <div
              key={index}
              className="relative w-[320px] mx-5 flex-shrink-0"
              style={{
                border: "1px solid rgba(25, 35, 131, 0.29)",
                borderRadius: "5px",
                fontFamily: "Open Sans",
                scrollSnapAlign: "center", // Align each card to the center
                scrollSnapStop: "always", // Ensure the card snaps to center
              }}
            >
              <IonCard className="relative p-0 m-0">
                {/* <IonCardContent className="p-0 m-0 h-[120px]">
                  <IonImg
                    src={getImageByName("mapImage")}
                    className="w-full object-cover left-0 right-0"
                  ></IonImg>
                  <div className="absolute bottom-0 left-0 w-full bg-customBlueLite bg-opacity-50 text-white p-2 flex justify-between items-center">
                    <IonText
                      style={{ fontFamily: "Open Sans" }}
                      className="text-[12px] font-bold"
                    >
                      Dr. {item?.doctor?.first_name} {item?.doctor?.last_name} -{" "}
                      <span className="text-[12px] font-normal">
                        Services to be provided at Clinic
                      </span>
                    </IonText>
                  </div>
                </IonCardContent> */}
                {true ? <MapComponent 
                  startLat= { latLong?.startLat } 
                  startLng ={latLong?.startLong}  
                  endLat ={item?.doctor?.latitude} 
                  endLng={item?.doctor?.longitude} 
                  item={item} 
                />:
                <IonCardContent className="p-0 m-0 h-[120px]">
                  <IonImg
                    src={getImageByName("mapImage")}
                    className="w-full object-cover left-0 right-0"
                  ></IonImg>
                  <div className="absolute bottom-0 left-0 w-full bg-customBlueLite bg-opacity-50 text-white p-2 flex justify-between items-center">
                    <IonText
                      style={{ fontFamily: "Open Sans" }}
                      className="text-[12px] font-bold"
                    >
                      Dr. {item?.doctor?.first_name} {item?.doctor?.last_name} -{" "}
                      <span className="text-[12px] font-normal">
                        Services to be provided at Clinic
                      </span>
                    </IonText>
                  </div>
                </IonCardContent>}
              </IonCard>

              <div className="flex items-center p-3 -mb-2">
                <div className="flex flex-col items-start">
                  <IonText
                    className="text-[12px] text-[#2B369D] font-bold"
                    style={{ fontFamily: "Open Sans" }}
                  >
                    {moment(item?.appointmentDate).format("DD MMM YYYY")}
                  </IonText>
                  <IonText
                    className="text-[10px] text-[#2B369D] font-semibold"
                    style={{ fontFamily: "Open Sans" }}
                  >
                    {item?.checkedIntoClinicTime}
                  </IonText>
                  <div
                    className="flex flex-col items-center mt-2"
                    style={{ fontFamily: "Open Sans" }}
                    onClick={()=>{(item?.doctor?.latitude && item?.doctor?.longitude) ? getCurrentLocation(item?.doctor):handleDocLocationInvalid()}}
                  >
                    <IonImg
                      src={getImageByName("mapLogo")}
                      alt="Navigate"
                      className="h-[35px] w-[35px] mr-2 border rounded-full p-2 transition-transform duration-150 ease-in-out active:scale-95 touch-none active:bg-gray"
                    />
                    <IonLabel
                      style={{ color: "rgba(30, 57, 97, 0.65)" }}
                      className="text-[13px] font-medium"
                    >
                      Navigate
                    </IonLabel>
                  </div>
                </div>

                <div
                  className="flex justify-start w-[170px] ml-10 overflow-x-auto mb-10"
                  style={{ fontFamily: "Open Sans" }}
                >
                  <div className="flex flex-nowrap">
                    {item?.pets?.map((pet: any, index: number) => (
                      <div
                        key={index}
                        className="flex flex-col items-center mx-1 w-[45px]"
                      >
                        <IonLabel className="text-[10px] font-openSans text-black font-semibold">
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
                    ))}
                  </div>
                </div>
              </div>
              <div
                className="absolute right-2 bottom-0 flex justify-between items-center"
                style={{ fontFamily: "Open Sans" }}
              >
                <IonText
                  style={{
                    borderTop: "0.5px solid #4E539C",
                    borderRight: "0.2px solid #4E539C",
                    borderLeft: "0.2px solid #4E539C",
                    backgroundColor: "#FFF",
                    fontWeight: "700",
                  }}
                  onClick={() => setShowAlert(true)}
                  className="p-1 h-[30px] ml-2.5 flex justify-between items-center text-center text-[10px] text-[#C91818] transition-transform duration-150 ease-in-out active:bg-gray active:scale-95 touch-none"
                >
                  Cancel <br />
                  Appointment
                </IonText>
                <IonAlert
                  isOpen={showAlert}
                  onDidDismiss={() => setShowAlert(false)}
                  header={"Are you sure?"}
                  message={"Are you sure you want to cancel your appointment?"}
                  buttons={[
                    {
                      text: "No",
                      role: "cancel",
                      handler: () => {
                        setShowAlert(false);
                      },
                    },
                    {
                      text: "Cancel",
                      handler: () => {
                        handleDeleteAppointment(item._id);
                        setShowAlert(false); // Close the alert after deleting
                      },
                    },
                  ]}
                />
                <IonText
                  onClick={() => {
                    setDisplayBookAppointment(true);
                    doctorsData = { doctorsData };
                    setSelectedClinicData({
                      allAppointmentData: item,
                      flagType: "edit",
                    });
                  }}
                  style={{
                    borderTop: "0.5px solid #4E539C",
                    borderRight: "0.2px solid #4E539C",
                    borderLeft: "0.2px solid #4E539C",
                    backgroundColor: "#FFF",
                    fontWeight: "700",
                  }}
                  className="p-1 h-[30px] ml-2.5 flex justify-between items-center  text-center text-[10px] text-[#A79603] transition-transform duration-150 ease-in-out active:bg-gray active:scale-95 touch-none"
                >
                  Reschedule
                </IonText>
                <a href={`tel:${item?.doctor?.phoneNumber}`}>
                  <div
                    style={{
                      borderTop: "0.5px solid #4E539C",
                      borderRight: "0.2px solid #4E539C",
                      borderLeft: "0.2px solid #4E539C",
                      backgroundColor: "#FFF",
                      fontWeight: "600",
                    }}
                    className="p-1 h-[30px] ml-2.5 flex flex-row justify-between items-center text-center text-[10px] text-[#2B369D] transition-transform duration-150 ease-in-out active:bg-gray active:scale-95 touch-none"
                  >
                    <IonImg
                      src={getImageByName("phoneLogo")}
                      className="h-[20px] w-[20px] pl-1"
                    />
                    <IonText className="pt-1 text-[11px] pr-1">Call</IonText>
                  </div>
                </a>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default ClinicUpcomingAppointment;
