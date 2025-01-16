import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonItem,
  IonList,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonLabel,
  IonImg,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonLoading,
} from "@ionic/react";
import Notyfy from "../components/Notyfy";
import { getNotifications, getPicOfNotification } from "../service/services";
import { getImageByName } from "../utils/imagesUtil";
import { call } from 'ionicons/icons';
import moment from "moment";

const Messages: React.FC = () => {
  const [allNotification, setAllNotification] = useState<any>([]);
  const [isParentLoading, setIsParentLoading] = useState<boolean>(false)

  useEffect(() => {
    handleNotification();
  }, []);

  // async function handleNotification() {
  //   try {
  //     const response = await getNotifications();
  //     if (response.isSuccess) {
        
  //       setAllNotification(response?.result);
  //     } else {
  //       console.log("error");
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }

  async function handleNotification() {
    try {
      setIsParentLoading(true)
      const response = await getNotifications();
  
      if (response.isSuccess) {
        let notificationsWithImages = [...response.result];
        await Promise.all(
          notificationsWithImages.map(async (notification) => {
            if (notification.isImage) {
              const imageResult = await handleGetImageOfNotification(notification._id);
              notification.allImages = imageResult; 
            }
          })
        );
  
        setAllNotification(notificationsWithImages);
        setIsParentLoading(false)
      } else {
        console.log("Error in fetching notifications.");
        setIsParentLoading(false)
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  

  console.log("all Notifications: ", allNotification);

  async function handleGetImageOfNotification(id:any){
    try {
      const response = await getPicOfNotification(id);
      if (response.isSuccess) {
        return response?.result
      } else {
        console.log("error");
      }
    } catch (e) {
      console.error(e);
    }
  }

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    handleNotification().finally(() => {
      // Complete the refresh operation after fetching data
      event.detail.complete();
    });
  };

  if (isParentLoading) {
    return <IonLoading isOpen={true} className="bg-white"/>;
  }

  return (
    <IonPage className="bg-white">
      <IonContent>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent
          
        />
      </IonRefresher>
        <div className="flex flex-col justify-center items-center flex-1  mt-3 ">
          {/* <div className='flex justify-between w-full'>
            <IonText style={{ fontFamily: "Open Sans", fontSize: "14px" }} className='ml-5 font-semibold'>Appointment</IonText>
            <IonText style={{ fontFamily: "Open Sans", fontSize: "12px" }} className='mr-5 font-normal'>12-Mar-24 07:43 AM</IonText>
          </div> */}

          {/* <Notyfy /> */}
        </div>

        {allNotification && allNotification.length > 0 ?
          allNotification.map((item: any, index: number) => {
            return item?.isImage ? (
              <div className="photo" key={index}>
                <div className="flex flex-col mx-8 mt-5 justify-around items-center"> 
                  <div
                    style={{ fontFamily: "Open Sans" }}
                    className="relative flex items-center mt-5 w-full"
                  >
                    <IonText className="absolute -top-5 left-0 font-semibold text-xs pr-10">
                      {item?.title?.length > 20 ? `${item.title.slice(0, 20)}...` : item.title}
                    </IonText>
                    <IonText className="absolute -top-5 text-xs right-0">
                      {moment(item?.date).format("DD-MMM-YY hh:mm A")}
                    </IonText>
                  </div>

                  <IonCard
                    style={{
                      
                      background: "transparent",
                      boxShadow: "none",
                      borderRadius:"5px"
                    }}
                    className="w-[100%] items-center mt-0"
                  >
                    
                    {item?.allImages.map((item:any, index:number)=>(
                      <img
                      alt={item?.image_base_url}
                      src={item?.image_base_url || getImageByName("defaultDogNotif")}
                      className="w-full"
                    />))}
                    <IonCardContent
                      className="font-bold"
                      style={{
                        fontFamily: "Segoe UI",
                        border: "1px solid rgba(25, 35, 131, 0.29)",
                        borderBottomLeftRadius:"5px",
                        borderBottomRightRadius:"5px",
                        fontSize: "11px",
                        color: "#000",
                      }}
                    >
                      {item?.description}
                    </IonCardContent>
                  </IonCard>
                </div>
              </div>
            ) : item?.slotType ? (
              (item?.doctorSlotList && item?.doctorSlotList.length > 0 ?
              <div className="slot" key={index}>
                <div
                  style={{ fontFamily: "Open Sans" }}
                  className="flex justify-between items-center mx-8 mt-5"
                >
                  <IonText className="font-semibold text-xs">{item?.doctor?.clinicName.length > 30 ? `${item?.doctor?.clinicName.slice(0, 30)}...` : item?.doctor?.clinicName}
                  <a href={`tel:${item?.doctor?.phoneNumber}`}><IonIcon icon={call} className="ml-1 text-[blue]" /></a>
                  </IonText>
                  <IonText className="text-xs">{moment(item?.date).format("DD-MMM-YY hh:mm A")}</IonText>
                </div>

                <IonCard
                  style={{
                    border: "1px solid rgba(25, 35, 131, 0.29)",
                    borderRadius:"5px",
                    background: "transparent",
                    boxShadow: "none",
                  }}
                  className="mx-8 mt-0"
                >
                  <IonCardContent
                    className="bg-white w-full"
                    style={{
                      fontFamily: "Open Sans",
                      // border: "1px solid rgba(25, 35, 131, 0.29)",
                      color: "#000",
                      padding: "0",
                      margin: 0,
                      borderRadius:"5px"
                      
                    }}
                  >
                    <div
                      className=" flex items-center text-center justify-center"
                      style={{
                        borderRadius: "5px 5px 0px 0px",
                        background:
                          "linear-gradient(90deg, rgba(119, 125, 184, 0.06) 34%, rgba(191, 50, 126, 0.25) 100%)",
                      }}
                    >
                      <IonText
                        style={{ color: "#000" }}
                        className="font-bold text-[12px] flex items-center text-center"
                      >
                        Clinic will not be operational on the following slots<br/> on{" "}
                        <>{moment(item?.slotDate).format("DD MMM YYYY")}</>
                      </IonText>
                    </div>
                    <IonList className="grid grid-cols-2 gap-y-1 justify-center mx-auto text-center items-center w-full">
                      {item?.doctorSlotList.map((slot: any, index: number) => (
                        <div
                          key={index}
                          style={{
                            border: "1px solid #BCC000",
                            fontFamily: "Open Sans",
                          }}
                          className="rounded-md h-[33px] w-[115px] flex justify-center items-center mx-auto"
                        >
                          <IonText className="font-semibold rounded-md text-xxs font-inter">
                            {slot?.timeSlot?.dispaly}
                          </IonText>
                        </div>
                      ))}
                    </IonList>

                    {/* <div
            className="flex flex-wrap items-center m-1 gap-x-9 gap-y-1 px-5 max-h-[115px] overflow-auto"
            style={{ justifyContent: "flex-start" }} // Adjust this for alignment
          >
            {item?.doctorSlotList &&
              item?.doctorSlotList.map((time: any, index: number) => (
                <IonText
                  // style={{ fontFamily: "Inter" }
                  key={index}
                  className={`border w-[140px] h-[33px] flex justify-center items-center font-semibold text-xs rounded-[0.188rem] ${
                    
                      "border-2 border-[#BCC000]"
                     
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
          </div> */}
                  </IonCardContent>
                </IonCard>
              </div> :
              <div className="slot" key={index}>
              <div
                style={{ fontFamily: "Open Sans" }}
                className="flex justify-between items-center mx-8 mt-5"
              >
                <IonText className="font-semibold text-xs">{item?.doctor?.clinicName.length > 30 ? `${item?.doctor?.clinicName.slice(0, 30)}...` : item?.doctor?.clinicName}
                <a href={`tel:${item?.doctor?.phoneNumber}`}><IonIcon icon={call} className="ml-1 text-[blue]" /></a>
                </IonText>
                <IonText className="text-xs">{moment(item?.date).format("DD-MMM-YY hh:mm A")}</IonText>
              </div>

              <IonCard
                style={{
                  border: "1px solid rgba(25, 35, 131, 0.29)",
                  borderRadius:"5px",
                  background: "transparent",
                  boxShadow: "none",
                }}
                className="mx-8 mt-0"
              >
                <IonCardContent
                  className="bg-white w-full"
                  style={{
                    fontFamily: "Open Sans",
                    // border: "1px solid rgba(25, 35, 131, 0.29)",
                    color: "#000",
                    padding: "0",
                    margin: 0,
                    borderRadius:"5px"
                    
                  }}
                >
                  <div
                    className=" flex items-center text-center justify-center"
                    style={{
                      borderRadius: "5px 5px 0px 0px",
                      background:
                        "linear-gradient(90deg, rgba(119, 125, 184, 0.06) 34%, rgba(191, 50, 126, 0.25) 100%)",
                    }}
                  >
                    <IonText
                      style={{ color: "#000" }}
                      className="font-bold text-[12px] flex items-center text-center"
                    >
                      Clinic will not be operational at the {item?.slotType} slots on<br/>
                    </IonText>
                  </div>
                  <IonList className="flex justify-center text-center items-center w-full font-bold text-xs">
                  <>{moment(item?.slotDate).format("DD MMM YYYY")}</>
                  </IonList>

                  {/* <div
          className="flex flex-wrap items-center m-1 gap-x-9 gap-y-1 px-5 max-h-[115px] overflow-auto"
          style={{ justifyContent: "flex-start" }} // Adjust this for alignment
        >
          {item?.doctorSlotList &&
            item?.doctorSlotList.map((time: any, index: number) => (
              <IonText
                // style={{ fontFamily: "Inter" }
                key={index}
                className={`border w-[140px] h-[33px] flex justify-center items-center font-semibold text-xs rounded-[0.188rem] ${
                  
                    "border-2 border-[#BCC000]"
                   
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
        </div> */}
                </IonCardContent>
              </IonCard>
            </div> 
            )
            ) : (
              <div className="" key={index}>
                <div
                  style={{ fontFamily: "Open Sans" }}
                  className="flex justify-between items-center mt-5 mx-8"
                >
                  <IonText className="font-semibold text-xs">
                    {item?.title?.length > 30 ? `${item.title.slice(0, 30)}...` : item.title}
                  </IonText>
                  <IonText className="text-xs">{moment(item?.date).format("DD-MMM-YY hh:mm A")}</IonText>
                </div>

                <IonCard
                  style={{
                    border: "none",
                    background: "transparent",
                    boxShadow: "none",
                  }}
                  className="mt-0"
                >
                  <IonCardContent
                    style={{
                      fontFamily: "Segoe UI",
                      border: "1px solid rgba(25, 35, 131, 0.29)",
                      fontSize: "10px",
                      color: "#000",
                      borderRadius:"5px"
                    }}
                    className="bg-white ml-5 mr-5 mt-0"
                  >
                    <p className="font-bold">
                      {item?.description}
                    </p>
                  </IonCardContent>
                </IonCard>
              </div>
            );
          }):
          <div className="mx-7 my-2 text-black font-semibold font-openSans">No Messages Available !</div>}
      </IonContent>
    </IonPage>
  );
};

export default Messages;
