import { IonBackButton, IonButton, IonIcon, IonImg, IonModal, IonText } from "@ionic/react";

import Logo from "../assets/myPetBook.svg";
import downArrow from "../assets/Down Arrow.svg";
import { API_BASE_URL } from "../../config";
import moment from "moment";
import { getImageByName } from "../../utils/imagesUtil";
import cancel from "../../assets/Cancel.svg";

interface FavrouiteLinkk {
  isOpen: boolean;
  data: any;
  onClose: () => void;
}

const FavrouiteLink = ({
  isOpen,
  data,
  onClose,
}: FavrouiteLinkk) => {

  // console.log("date: ", date)
  console.log("date: ", data)
  //Create appointment

  return (
    <IonModal className="notifyDoctorModal m-auto" isOpen={isOpen} onClick={onClose}>
      <div className="h-[420px] w-[76%] bg-[#fff] rounded-[5px] mx-auto mt-[23vh] flex flex-col justify-center items-center" onClick={(e) => e.stopPropagation()}>
        <div onClick={onClose} className="flex justify-end pr-5 w-full">
            <IonIcon src={cancel} className="h-5 w-5"/>
        </div>
        <div className="flex w-[300px] h-[350px] flex-col items-center mx-2">
          <IonText className="font-openSans font-bold text-[#124899] text-[14px] leading-normal mb-3">
            Your Data is recorded
          </IonText>

          <IonText className="overflow-scroll break-words w-[250px] h-[500px] flex-col justify-center items-center text-[14px] mb-5 font-openSans font-bold text-[#124899]">
            <span>data: {data}</span>
            
          </IonText>

         
        </div>

        {/* <IonIcon src={downArrow} className="h-[35px] w-[35px] ml-32"/> */}

        
      </div>
    </IonModal>

  );
};

export default FavrouiteLink;
