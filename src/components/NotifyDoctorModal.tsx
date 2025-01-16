import { IonBackButton, IonButton, IonIcon, IonImg, IonModal, IonText } from "@ionic/react";

import Logo from "../assets/myPetBook.svg";
import downArrow from "../assets/Down Arrow.svg";
import { API_BASE_URL } from "../config";
import moment from "moment";
import { getImageByName } from "../utils/imagesUtil";

interface NotifyDoctorModalProps {
  isOpen: boolean;
  date: any;
  pets: Array<any>;
  doctor?: {
    name: string;
    id: string;
  };
  timeSlot: string;
  token: string | null;
  onClose: () => void;
  onSubmmision: ()=>void;
}

const NotifyDoctorModal = ({
  isOpen,
  date,
  pets,
  doctor,
  timeSlot,
  token,
  onClose,
  onSubmmision,
}: NotifyDoctorModalProps) => {

  // console.log("date: ", date)
  console.log("pet: ", pets)
  console.log("timeSlot: ", timeSlot)
  console.log("date: ", date)
  //Create appointment

  return (
    <IonModal className="notifyDoctorModal m-auto" isOpen={isOpen} onClick={onClose}>
      <div className="h-[420px] w-[76%] bg-[#fff] rounded-[5px] mx-auto mt-[23vh] flex flex-col justify-center items-center" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col justify-center items-center mx-2">
          <IonImg src={getImageByName('logoPng')} className="h-12 w-32 mb-8" />
          <IonText className="font-openSans font-bold text-[#124899] text-[14px] leading-normal mb-3">
            Your Appointment is recorded
          </IonText>

          <IonText className="flex flex-col justify-center items-center text-[14px] mb-5 font-openSans font-bold text-[#124899] leading-normal">
            <span>Time: {timeSlot}</span>
            <span>Date: {moment(date).format('DD MMMM YYYY')}</span>
          </IonText>

          <IonText className="font-openSans font-bold text-[#124899] text-[12px] w-[200px] mb-3">
            Pet Name(s): {pets && pets.map((item: any) => item.petName).join(', ')}
          </IonText>

          <IonText className="font-openSans text-[12px] font-[600] text-[#FF017B] leading-normal text-center mt-3 mx-2">
            Please aim to arrive around your <br />scheduled appointment time<br />for your convenience and that of others.
          </IonText>
          <IonText className="font-openSans text-[12px] font-bold text-[#FF017B] leading-normal text-center mt-3 mx-2">
            Please note that pets will be treated on a first-come, first-served basis within your chosen time slot.
          </IonText>
        </div>

        {/* <IonIcon src={downArrow} className="h-[35px] w-[35px] ml-32"/> */}

        <IonButton onClick={onSubmmision} className="w-[200px] h-[35px] notifyButton rounded-[60px] mt-2">
          Ok
        </IonButton>
      </div>
    </IonModal>

  );
};

export default NotifyDoctorModal;
