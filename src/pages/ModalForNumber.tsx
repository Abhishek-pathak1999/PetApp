import {
  IonBackButton,
  IonButton,
  IonIcon,
  IonImg,
  IonInput,
  IonModal,
  IonText,
} from "@ionic/react";

import Logo from "../assets/myPetBook.svg";
import downArrow from "../assets/Down Arrow.svg";
import { API_BASE_URL } from "../config";
import moment from "moment";
import { getImageByName } from "../utils/imagesUtil";

const ModalForNumber = ({ isOpen, onClose }: any) => {
  // console.log("date: ", date)
  //Create appointment

  return (
    <IonModal
      className="notifyDoctorModal m-auto"
      isOpen={isOpen}
    >
      <div>
        <div onClick={onClose} className="ml-8 mt-14">
          <img src={getImageByName("backArrow")} />
        </div>
        <div className="bg-[#37396C] w-full h-[81px] flex flex-col items-center justify-center">
          <IonText
            className="mx-10"
            style={{
              color: "#FFF",
              textAlign: "center",
              fontFamily: "Open Sans",
              fontSize: "12px",
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            To keep your app access recoverable, please answer these security
            questions.
          </IonText>
          <IonText
            className="mt-3"
            style={{
              color: "#FFF",
              textAlign: "center",
              fontFamily: "Open Sans",
              fontSize: "10px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "normal",
            }}
          >
            This is a one-time activity
          </IonText>
        </div>
        <div className="mt-3 w-full h-[271px] bg-[#37396C] flex flex-col items-center justify-center">
         
            <div className="text-center mt-2">
              <IonText
                className="text-[#fff]"
                style={{
                  textAlign: "center",
                  fontFamily: "Segoe UI",
                  fontSize: "12px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "normal",
                }}
              >
                What is your mother's first name?
              </IonText>
              <IonInput
                className="border mt-2"
                style={{
                  width: "320px",
                  height: "34px",
                  borderRadius: "5px",
                  border: "1px solid #FFF",
                  background: "rgba(217, 217, 217, 0.00)",
                  paddingLeft: "10px",
                }}
              />
            </div>
            <div className="text-center mt-2">
              <IonText
                className="text-[#fff]"
                style={{
                  textAlign: "center",
                  fontFamily: "Segoe UI",
                  fontSize: "12px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "normal",
                }}
              >
                In which city were you born?
              </IonText>
              <IonInput
                className="border mt-2"
                style={{
                  width: "320px",
                  height: "34px",
                  borderRadius: "5px",
                  border: "1px solid #FFF",
                  background: "rgba(217, 217, 217, 0.00)",
                  paddingLeft: "10px",
                }}
              />
            </div>
            <div className="flex flex-col items-center justify-center mt-10">
                <IonText className="text-[#fff]" style={{
                    fonFamily: "Open Sans",
                    fontSize: "11px",
                    fontStyle: "normal",
                    fontWeight: 700
                }}>IMPORTANT</IonText>
                <IonText className="mx-8 flex items-center justify-center" style={{
                    color: "#00FF37",
                    fontFamily: "Open Sans",
                    fontSize: "11px",
                    fontStyle: "normal",
                    fontWeight: 400
                }}>Please remember these responses for application access <br /> related support</IonText>
            </div>
        </div>
        <div className="h-[52px] w-full bg-[#37396C] flex items-center justify-center mt-4">
            <div 
            onClick={onClose}
             className="flex items-center justify-center" style={{
                color:"#fff",
                width: "110px",
                height: "35px",
                fontSize:"12px",
                borderRadius: "25px",
                // background: "radial-gradient(2840.14% 125.45% at 1.25% 57.14%, #246BFD0%, rgba(18, 197, 36, 0.00)100%)",
                // boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                background: "radial-gradient(2840.14% 125.45% at 1.25% 57.14%, #246BFD 0%, rgba(18, 197, 36, 0.00)100%)",
                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}>SAVE</div>
        </div>
      </div>
    </IonModal>
  );
};

export default ModalForNumber;
