import { IonModal, IonButton, IonText, IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import BillModel from "./BillModel";
import { useState } from "react";

interface SlotBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SlotBookingModal: React.FC<SlotBookingModalProps> = ({ isOpen, onClose }) => {
  const [isBillModal, setIsBillModal] =
    useState<boolean>(false);
  return (
    <IonModal className="slotBooking " isOpen={isOpen} onDidDismiss={onClose}>
     
      <div className="h-[49vh]  w-[76%] bg-white flex items-center justify-center m-auto relative">
        <IonIcon onClick={onClose} className=" absolute right-3 top-2  h-7 w-7  " icon={closeOutline} />
        <div className="flex flex-col justify-center items-center my-auto">

          <IonText className="text-center">
            <p className="text-[#E731D4] font-openSans text-[13px] custom-text font-extrabold text-center ">
              Your Home Vaccine service is<br /> recorded!
            </p>
            <p className="text-[#4E539C] custom-text font-openSans text-[12px] font-bold mt-4">Time: 6:30 PM</p>
            <p className="text-customPurple custom-text font-openSans text-[12px] font-bold ">Date: 25th Apr 2024</p>
            <p className="text-customPurple font-openSans text-[14px] font-bold my-3">Payment Summary:</p>
            <p className="text-customPurple font-openSans text-[14px] font-bold ">Vaccines: ₹ 2000</p>
            <p className="text-customPurple font-openSans text-[12px] font-bold  my-3">Vaccines: ₹ 2000</p>
            <p className="text-customPink font-openSans text-xs italic font-normal leading-normal  my-3">To be paid to the visiting Vet after the service</p>
            <p className="custom-text text-[#000] font-openSans text-[14px] font-extrabold  leading-normal my-3">Total: ₹ 2300</p>
          </IonText>

          <IonButton onClick={() => setIsBillModal(true)} color={"none"} className="bg-[#4E539C] rounded-lg border-[5px] border-gray" >Confirm Booking!</IonButton>
        </div>
      </div>

      <BillModel
        isOpen={isBillModal}
        onClose={() => setIsBillModal(false)}
      />
    </IonModal >


  );
};

export default SlotBookingModal;
