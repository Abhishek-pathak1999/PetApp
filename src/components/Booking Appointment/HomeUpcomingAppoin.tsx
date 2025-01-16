import React from "react";
import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonImg,
  IonLabel,
  IonRow,
  IonText,
} from "@ionic/react";
import { getWidthInPercentage } from "../../utils/widthUtil";
import { getImageByName } from "../../utils/imagesUtil";

const HomeUpcomingAppoin = () => {
  return (
    <div
      className="relative mx-5 h-[235px]"
      style={{
        border: "1px solid rgba(25, 35, 131, 0.29)",
        borderRadius: "5px",
        fontFamily: "Open Sans",
        width: getWidthInPercentage(319),
      }}
    >
      <IonCard className="relative p-0 m-0 mb-2 ">
        <IonCardContent className="p-0 m-0 h-[127px]">
          <IonImg
            src={getImageByName("homeUpcomingAppoi")}
            className="w-full object-cover left-0 right-0"
          ></IonImg>

          <div className="absolute bottom-0 h-[30px]  w-full bg-customBlueLite bg-opacity-50 p-2 flex justify-between items-center">
            <IonText
              className=" mx-auto text-[10px]"
              style={{ fontFamily: "Open Sans", color: "#fff" }}
            >
              Services to be Provided at your home{" "}
            </IonText>
          </div>
        </IonCardContent>
      </IonCard>

      <div className="flex  items-center justify-between mx-2   h-[95px] ">
        <div className="flex flex-col items-center  mb-4 mt-2 ">
          <IonText
            className="text-[10px] text-[#2B369D] "
            style={{ fontFamily: "Open Sans", fontWeight: "700" }}
          >
            22 Apr 2024
          </IonText>
          <IonText
            className="text-[9px] text-[#2B369D]"
            style={{ fontFamily: "Open Sans", fontWeight: "500" }}
          >
            11:30AM
          </IonText>

          <div
            className="flex flex-col items-center mt-1  "
            style={{ fontFamily: "Open Sans" }}
          >
            <div
              className="h-[45px] w-[45px] rounded-full border border-[#2B369D]"
              style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
            >
              <IonImg
                src={getImageByName("manLogo")}
                alt="img"
                className="h-full w-full object-cover rounded-full"
              />
            </div>
            <IonLabel
              style={{ color: "rgba(30, 57, 97, 0.65)" }}
              className="text-[10px] font-medium"
            >
              Visiting Vet
            </IonLabel>
          </div>
        </div>

        <div className="flex flex-col  justify-between items-center  mb-10 ">
          <div
            className="flex justify-between my-2 overflow-x-auto "
            style={{ fontFamily: "Open Sans", width: "220px" }}
          >
            <IonAvatar className="flex flex-col items-center mx-1">
              <IonLabel className="text-[13px]">Zoro</IonLabel>
              <IonImg
                src={getImageByName("catfree")}
                alt="Zoro"
                className="h-[35px] w-[35px] rounded-full"
              />
            </IonAvatar>

            <IonAvatar className="flex flex-col items-center mx-1">
              <IonLabel className="text-[13px]">Zoro</IonLabel>
              <IonImg
                src={getImageByName("catfree")}
                alt="Zoro"
                className="h-[35px] w-[35px] rounded-full"
              />
            </IonAvatar>

            <IonAvatar className="flex flex-col items-center mx-1">
              <IonLabel className="text-[13px]">Zoro</IonLabel>
              <IonImg
                src={getImageByName("catfree")}
                alt="Zoro"
                className="h-[35px] w-[35px] rounded-full"
              />
            </IonAvatar>

            <IonAvatar className="flex flex-col items-center mx-1">
              <IonLabel className="text-[13px]">Zoro</IonLabel>
              <IonImg
                src={getImageByName("catfree")}
                alt="Zoro"
                className="h-[35px] w-[35px] rounded-full"
              />
            </IonAvatar>
          </div>

          {/* <div className='flex justify-between items-center ' style={{ fontFamily: "Open Sans" }}>
            <IonText style={{ width: getWidthInPercentage(108), borderTop: '0.5px solid #4E539C', borderRight: '0.2px solid #4E539C', borderLeft: '0.2px solid #4E539C', backgroundColor: '#FFF', fontWeight: '700' }} className=' p-1 flex justify-between items-center text-center h-[4vh] text-[10px] leading-[10px] text-[#C91818] m-2' >Cancel <br />Appointment</IonText>
            <IonText style={{ width: getWidthInPercentage(108), borderTop: '0.5px solid #4E539C', borderRight: '0.2px solid #4E539C', borderLeft: '0.2px solid #4E539C', backgroundColor: '#FFF', fontWeight: '700' }} className='p-1 flex justify-between items-center  text-center h-[4vh] text-[10px] leading-[10px] text-[#A79603] m-2'>Reschedule</IonText>
            <div style={{ width: getWidthInPercentage(72), borderTop: '0.5px solid #4E539C', borderRight: '0.2px solid #4E539C', borderLeft: '0.2px solid #4E539C', backgroundColor: '#FFF', fontWeight: '600' }} className='flex flex-row justify-between items-center text-center h-[4vh] text-[10px] leading-[10px] text-[#2B369D] m-2'>
              <IonImg src="src/assets/Call male.png" className='h-[20px] w-[20px] pl-1' />
              <IonText className='pt-1 text-[11px] pr-1'>Call</IonText>
            </div>
          </div> */}
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
          className="p-1 h-[30px] ml-2.5 flex justify-between items-center text-center text-[10px] text-[#C91818]"
        >
          Cancel <br />
          Appointment
        </IonText>
        <IonText
          style={{
            borderTop: "0.5px solid #4E539C",
            borderRight: "0.2px solid #4E539C",
            borderLeft: "0.2px solid #4E539C",
            backgroundColor: "#FFF",
            fontWeight: "700",
          }}
          className="p-1 h-[30px] ml-2.5 flex justify-between items-center  text-center text-[10px] text-[#A79603]"
        >
          Reschedule
        </IonText>
        <div
          style={{
            borderTop: "0.5px solid #4E539C",
            borderRight: "0.2px solid #4E539C",
            borderLeft: "0.2px solid #4E539C",
            backgroundColor: "#FFF",
            fontWeight: "600",
          }}
          className="p-1 h-[30px] ml-2.5 flex flex-row justify-between items-center text-center text-[10px] text-[#2B369D]"
        >
          <IonImg
            src={getImageByName("phoneLogo")}
            className="h-[20px] w-[20px] pl-1"
          />
          <IonText className="pt-1 text-[11px] pr-1">Call</IonText>
        </div>
      </div>
    </div>
  );
};

export default HomeUpcomingAppoin;
