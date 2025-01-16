import { IonModal, IonButton, IonText, IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";

interface BillModelProps {
    isOpen: boolean;
    onClose: () => void;
}

const BillModel: React.FC<BillModelProps> = ({ isOpen, onClose }) => {
    return (
        <IonModal className="slotBooking " isOpen={isOpen} onDidDismiss={onClose}>
            <div className="h-[49vh] w-[90%] bottom-0 fixed bg-white mx-5 rounded-t-2xl">
                <IonIcon onClick={onClose} className=" absolute right-3 top-2  h-7 w-7  " icon={closeOutline} />
                <div className=" flex items-center justify-center mt-8">
                    <table className=" w-full mx-3">
                        <thead className="custom-table ">
                            <tr>
                                <th className="px-1 py-3">S No</th>
                                <th className="px-1 py-3">Service</th>
                                <th className="px-1 py-3">Category</th>
                                <th className="px-1 py-3">Cost (₹)</th>
                            </tr>
                            <tr className="border-b border-[#2C7D43]" style={{ boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)' }} />

                        </thead>

                        <tbody className="custom-table italic ">
                            <tr className="">
                                <td className="pt-3" >1</td>
                                <td className="pt-3">Crp</td>
                                <td className="pt-3 ">Vaccine</td>
                                <td className="pt-3">500.00</td>
                            </tr>
                            <tr className="">
                                <td className="pt-3">2</td>
                                <td className="pt-3">Anti-rabies</td>
                                <td className="pt-3">Vaccine</td>
                                <td className="pt-3">500.00</td>
                            </tr>
                            <tr>
                                <td className="pt-3">3</td>
                                <td className="pt-3">De-worming</td>
                                <td className="pt-3">Vaccine</td>
                                <td className="pt-3">500.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="border-t border-[#2C7D43] w-[90%] fixed bottom-0 h-20 bg-white  flex flex-col justify-between p-2">
                    <IonText className="text-black font-openSans text-[12px] font-bold leading-110 tracking-wideCustom ml-1 uppercase">
                        Visiting Charges
                    </IonText>
                    <div className="flex justify-center items-start">
                        <IonText className="flex flex-col justify-center items-center text-center text-[#144572]">
                            Additional ₹ 300.00 Home Visit Charges to<br />Be Paid Online, During Slot Booking
                        </IonText>
                    </div>
                </div>

            </div>
        </IonModal >
    );
};

export default BillModel;
