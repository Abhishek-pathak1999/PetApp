import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonImg, IonPage, IonRow, IonText } from '@ionic/react'
import React, { useEffect, useRef, useState } from 'react'
import { TIME_SLOTS } from '../constants';
import { useQuery } from 'react-query';
import { API_BASE_URL } from '../config';
import { Preferences } from '@capacitor/preferences';
import { useHistory } from 'react-router';
import SlotBooking from '../components/SlotBookingModal';
import SlotBookingModal from '../components/SlotBookingModal';

const Summary = () => {
    const history = useHistory();

    const handleHomeBookingClick = () => {
        history.push('/dashboard/home-booking');
    };
    const [isSlotBookingModal, setIsSlotBookingModal] =
        useState<boolean>(false);

    const [button, setButtton] = useState(false);

    useState<boolean>(false);

    const [token, setToken] = useState<null | string>(null);

    useEffect(() => {
        (async () => {
            const tokenValue = await Preferences.get({ key: "token" });
            setToken(tokenValue.value!);
        })();
    }, []);





    const [activeText, setActiveText] = useState<string>('inClinic'); // Default to 'inClinic'


    const handleTextClick = (textType: string) => {
        setActiveText(textType);
        // Remove navigation logic from here as it's now handled by the image click
    };
    return (
        <IonPage>
            <IonContent>

                <IonText className='flex justify-center items-center my-2' style={{
                    color: '#000',

                    fontFamily: "Open Sans",
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: '600',
                    lineHeight: 'normal'
                }}>
                    <span>Verify service selection and select time slot</span>
                </IonText>

                <div className='border border-[#4E539C] rounded-lg mx-3 h-[210px] relative'>
                    <table className="min-w-full w-full m-3" style={{

                        fontFamily: 'Open Sans',
                        fontSize: '12px',
                        fontStyle: 'normal',
                        fontWeight: '600',
                        lineHeight: '110%', /* 13.2px */
                        letterSpacing: '1.92px',

                    }}>
                        <thead className="">
                            <tr >
                                <th className="sumText pb-2 text-left">
                                    sno
                                </th>
                                <th className="sumText pb-2 text-left ">
                                    SERVICE
                                </th>

                                <th className="sumText pb-2 text-left">
                                    PET
                                </th>
                                <th className="sumText pb-2 text-left ">
                                    TOTAL
                                </th>
                            </tr>
                        </thead>
                        <tbody  >
                            <tr>
                                <td className="sumText2 py-2">1</td>
                                <td className="sumText2  py-2">CRP</td>
                                <td className="sumText2 py-2 ">FLUFF</td>
                                <td className="sumText2 py-2">₹500</td>
                            </tr>
                            <tr>
                                <td className="sumText2 pb-2 ">2</td>
                                <td className="sumText2 pb-2 ">CRP</td>
                                <td className="sumText2 pb-2 ">PIDDI</td>
                                <td className="sumText2 pb-2">₹500</td>
                            </tr>
                            <tr>
                                <td className="sumText2 pb-2 ">3</td>
                                <td className="sumText2 pb-2 ">ANTI-RABBIES</td>
                                <td className="sumText2 pb-2 ">PIDDI</td>
                                <td className="sumText2 pb-2 ">₹250</td>
                            </tr>
                            <tr>
                                <td className="sumText  pb-2 ">4</td>
                                <td className="sumText2  pb-2">CANNINE COVID</td>
                                <td className="sumText2  pb-2">ZORO</td>
                                <td className="sumText2 pb-2">₹300</td>
                            </tr>

                        </tbody>
                    </table>
                    <div className=" rounded-b-lg  bottom-0 left-0 h-8 w-full bg-[#2B3189]  text-white flex justify-around items-center absolute">
                        <IonText style={{
                            fontFamily: "Open Sans", color: '#FFFCFC',
                            textAlign: 'center',

                            fontSize: '14px',
                            fontStyle: 'normal',
                            fontWeight: '700',
                            lineHeight: 'normal'
                        }}>Total :</IonText>
                        <IonText style={{
                            fontFamily: "Open Sans", color: '#1BEA16',

                            fontSize: '11px',
                            fontStyle: 'normal',
                            fontWeight: '700',
                            lineHeight: 'normal'
                        }}>Service</IonText>
                        <IonText style={{
                            fontFamily: "Open Sans", color: '#FFFCFC',
                            textAlign: 'center',

                            fontSize: '14px',
                            fontStyle: 'normal',
                            fontWeight: '600',
                            lineHeight: 'normal'
                        }}>: ₹ 2000 +</IonText>
                        <IonText style={{
                            fontFamily: "Open Sans",
                            color: '#FAFF00',

                            fontSize: '11px',
                            fontStyle: 'normal',
                            fontWeight: '700',
                            lineHeight: 'normal',
                        }}>visiting Charge </IonText>
                        <IonText style={{
                            fontFamily: "Open Sans", color: '#FFFCFC',
                            textAlign: 'center',

                            fontSize: '14px',
                            fontStyle: 'normal',
                            fontWeight: '600',
                            lineHeight: 'normal'
                        }}>: ₹ 2000</IonText>
                    </div>
                </div>

                <div className='mt-3'>
                    <div className='border border-[#6168A642] w-full'></div>

                    <div className="flex justify-between items-center h-[12.5%]  bg-white my-5  mx-6">

                        {Array(7).fill(null).map((_, index) => (
                            <div key={index} className="h-[55px] w-[35px] bg-[#4E539C] text-white flex flex-col justify-center items-center  rounded-[10px] font-bold">
                                <IonText style={{ color: '#FFF', textFamily: "Open Sans", fontSize: '9px', fontStyle: 'normal', fontWeight: '500', lineHeight: 'normal;', }}>
                                    M
                                </IonText>
                                <IonText style={{ color: '#FFF', textAlign: 'center', fontFamily: "Open Sans", fontSize: '13px', fontStyle: 'normal', fontWeight: '500', lineHeight: 'normal', }}>
                                    23
                                </IonText>
                                <IonText style={{ color: '#FFF', textAlign: 'center', fontFamily: "Open Sans", fontSize: '10px', fontStyle: 'italic', fontWeight: '500', lineHeight: 'normal', }}>
                                    Apr
                                </IonText>
                            </div>
                        ))}

                    </div>
                </div>


                <div className="flex justify-between items-center  mb-3 mt-2 text-[#454892] mx-7" style={{ fontFamily: "Open Sans" }}>
                    <IonText
                        style={{
                            boxShadow: activeText === 'inClinic' ? "0px 4px 4px 0px rgba(0, 0, 0, 0.45) inset" : "none"
                        }}
                        className="border-b border-[#00000057] p-2 text-center text-[12px] font-bold w-[100px]"
                        onClick={() => handleTextClick('inClinic')}
                    >
                        Day Slots
                    </IonText>
                    <IonText
                        style={{
                            boxShadow: activeText === 'homeAppointment' ? "0px 4px 4px 0px rgba(0, 0, 0, 0.45) inset" : "none"
                        }}
                        className="border-b border-[#00000057] p-2 text-center text-[12px] font-bold w-[100px]"
                        onClick={() => handleTextClick('homeAppointment')}
                    >
                        Evening Slots
                    </IonText>
                </div>


                <div style={{ border: "1px solid #8FA0CB" }} className="flex flex-wrap justify-around mx-auto py-2 border-y bg-white text-center">

                    <div className='grid grid-cols-2 gap-x-8 gap-y-[5px] justify-around items-center w-full h-[10rem] overflow-y-auto  px-5'>
                        {TIME_SLOTS.map((time) => (

                            <IonText style={{ fontFamily: "Open Sans" }} onClick={() => setButtton(!button)} key={time} className={`border p-2 font-semibold text-[12px] rounded-[4px] ${!button ? 'border-[#2132C3]' : 'border-[#BCC000]'}`}>{time}</IonText>

                        ))}
                    </div>





                </div>
















                <div className='bg-[#D9D9D9] h-[36px] absolute bottom-3 w-full'>
                    <div className='flex justify-between text-center items-center h-[35px] mx-5'>
                        <div onClick={handleHomeBookingClick} className='flex justify-between items-center text-center border border-[#BCBCBC] bg-white h-[36px] rounded-3xl '>
                            <IonText className='ml-2 mr-1' style={{
                                color: '#000',
                                fontFamily: "Open Sans",
                                fontSize: '12px',
                                fontWeight: '700',
                                lineHeight: 'normal'
                            }}>Modify Selection</IonText>
                            <IonImg src='src/assets/Transfer.svg' className="mr-2" />
                        </div>
                        <div onClick={() => setIsSlotBookingModal(true)} className='flex justify-between items-center border border-[#BCBCBC] bg-white p-2 h-[35px] rounded-3xl'>
                            <IonText style={{

                                fontFamily: "Open Sans",
                                fontSize: '12px',
                                fontStyle: 'normal',
                                fontWeight: '600',
                                lineHeight: 'normal'
                            }}>Book Time Slot</IonText>
                            <IonIcon src='src/assets/Wall Clock.svg' className='h-[25px] w-[25px] ml-1' />
                        </div>
                        <SlotBookingModal
                            isOpen={isSlotBookingModal}
                            onClose={() => setIsSlotBookingModal(false)}
                        />
                    </div>
                </div>

            </IonContent>
        </IonPage>
    )
}

export default Summary
