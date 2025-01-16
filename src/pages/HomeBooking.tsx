import { IonButton, IonCard, IonCardContent, IonContent, IonFooter, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonPage, IonSelect, IonSelectOption, IonText } from '@ionic/react'
import { documentTextOutline, eye, leaf, pawOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useHistory } from 'react-router';
import rupee from "../assets/Rupee.svg"
import brief from "../assets/Brief.svg";
import catImg from "../assets/cat-img.png"
import dropDown from "../assets/Drop Down.svg";

const HomeBooking = () => {
    const history = useHistory();

    const handleSummaryClick = () => {
        history.push('/dashboard/Summary');
    };
    const [selectedOption, setSelectedOption] = useState('');

    const handleSelectChange = (event: any) => {
        setSelectedOption(event.detail.value);
    };
    return (
        <IonPage >
            <IonContent fullscreen className='flex flex-col justify-center items-center w-full' >




                <div className='flex justify-center items-center my-6'>
                    <IonText className='text-xs font-segoe font-semibold text-[#BE1111] custom-text'>View all services offered at you home</IonText>
                    <IonIcon src={dropDown} className='h-8 w-8 ml-1' />
                </div>



                <IonText className="text-xxs font-semibold text-center custom-text mx-5">Select Pet(s) to Schedule Home Services!</IonText>
                <div className='h-[700px] max-h-[320px] overflow-y-auto'>
                    <div className=' flex  justify-center h-96 '>

                        <div className='bg=[#fff]  ' style={{
                            width: '327px',
                            height: '115px',
                            flexShrink: 0,
                            borderRadius: '10px',
                            border: '1.5px solid #D3D2D2',
                            background: '#FFF'
                        }}>

                            <div className='flex justify-between items-center border-b-[1.5px] border-[#CBC8C8] font-bold  '>
                                <IonText className='mx-2 my' >CRP</IonText>
                                <IonText className='mx-2 my'>Total:₹ 1000.00</IonText>
                            </div>

                            {/* edit */}

                            <div className='flex flex-col  mx-2  '>
                                <div className='flex  justify-between items-center overflow-x-auto max-h-10 h-[40px]   '>
                                    <div className='flex justify-center items-center  bg-[#CBC8C8] mr-3 ' style={{
                                        borderRadius: '0px 10px 10px 0px',
                                        borderLeft: '3px solid #FE4D4D',
                                        background: 'rgba(206, 233, 226, 0.16)',
                                        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                                        width: '115px',
                                        height: '31px',
                                        flexShrink: 0
                                    }}>

                                        <IonImg src={catImg} className='h-[35px] w-[30]' />
                                        <div className='flex flex-col justify-center items-center '>
                                            <IonText className='' style={{
                                                color: '#000',
                                                textAlign: 'center',
                                                fontFamily: "Open Sans",
                                                fontSize: '9px',
                                                fontStyle: 'normal',
                                                fontWeight: '600',
                                                lineHeight: 'normal',
                                            }}>Fluss</IonText>
                                            <div className="flex items-center">
                                                <div className=" w-16 h-[1px] left-0 bg-[#FE4D4D]"></div>
                                                <div className="w-[6px]  h-[6px] bg-[#FE4D4D] rounded-full"></div>
                                            </div>
                                            <IonText className='text-[9px]'>12 days OverDue</IonText>
                                        </div>
                                    </div>

                                    <div className='flex justify-center items-center  bg-[#CBC8C8] mr-3' style={{
                                        borderRadius: '0px 10px 10px 0px',
                                        borderLeft: '3px solid #BCC000',
                                        background: 'rgba(206, 233, 226, 0.16)',
                                        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                                        width: '115px',
                                        height: '31px',
                                        flexShrink: 0
                                    }}>

                                        <IonImg src={catImg} className='h-[30px] w-[30]' />
                                        <div className='flex flex-col justify-center items-center '>
                                            <IonText className='text-[9px]'>Fluss</IonText>
                                            <div className="flex items-center">
                                                <div className=" w-16 h-[1px] left-0 bg-[#FAFF00]"></div>
                                                <div className="w-[6px]  h-[6px] bg-[#FAFF00] rounded-full"></div>
                                            </div>
                                            <IonText className='text-[9px]'>12 days OverDue</IonText>
                                        </div>
                                    </div>



                                    <div className='flex justify-center items-center  bg-[#CBC8C8] mr-3 ' style={{
                                        borderRadius: '0px 10px 10px 0px',
                                        borderLeft: '3px solid #22A676',
                                        background: 'rgba(206, 233, 226, 0.16)',
                                        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                                        width: '115px',
                                        height: '31px',
                                        flexShrink: 0
                                    }}>

                                        <IonImg src={catImg} className='h-[30px] w-[30]' />
                                        <div className='flex flex-col justify-center items-center '>
                                            <IonText className='text-[9px]'>Fluss</IonText>
                                            <div className="flex items-center">
                                                <div className=" w-16 h-[1px] left-0 bg-[#FE4D4D]"></div>
                                                <div className="w-[6px]  h-[6px] bg-[#FE4D4D] rounded-full"></div>
                                            </div>
                                            <IonText className='text-[9px]'>12 days OverDue</IonText>
                                        </div>
                                    </div>
                                </div>



                                <div className='flex  items-center  overflow-x-auto max-h-10 h-[40px] '>


                                    <div className='flex justify-center items-center  bg-[#CBC8C8] mr-3 ' style={{
                                        borderRadius: '0px 10px 10px 0px',
                                        borderLeft: '3px solid #FE4D4D',
                                        background: 'rgba(206, 233, 226, 0.16)',
                                        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                                        width: '115px',
                                        height: '31px',
                                        flexShrink: 0
                                    }}>

                                        <IonImg src={catImg} className='h-[30px] w-[30]' />
                                        <div className='flex flex-col justify-center items-center '>
                                            <IonText className='text-[9px]'>Fluss</IonText>
                                            <div className="flex items-center">
                                                <div className=" w-16 h-[1px] left-0 bg-[#FE4D4D]"></div>
                                                <div className="w-[6px]  h-[6px] bg-[#FE4D4D] rounded-full"></div>
                                            </div>
                                            <IonText className='text-[9px]'>12 days OverDue</IonText>
                                        </div>
                                    </div>

                                    <div className='flex justify-center items-center  bg-[#CBC8C8] mr-3' style={{
                                        borderRadius: '0px 10px 10px 0px',
                                        borderLeft: '3px solid #22A676',
                                        background: 'rgba(206, 233, 226, 0.16)',
                                        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                                        width: '115px',
                                        height: '31px',
                                        flexShrink: 0
                                    }}>

                                        <IonImg src={catImg} className='h-[30px] w-[30px' />
                                        <div className='flex flex-col justify-center items-center '>
                                            <IonText className='text-[9px]'>Fluss</IonText>
                                            <div className="flex items-center">
                                                <div className=" w-16 h-[1px] left-0 bg-[#FE4D4D]"></div>
                                                <div className="w-[6px]  h-[6px] bg-[#FE4D4D] rounded-full"></div>
                                            </div>
                                            <IonText className='text-[9px]'>12 days OverDue</IonText>
                                        </div>
                                    </div>


                                </div>

                            </div>




                            <div className=' bg=[#fff]   mt-6 ' style={{
                                width: '327px',
                                height: '115px',
                                flexShrink: 0,
                                borderRadius: '10px',
                                border: '1.5px solid #D3D2D2',
                                background: '#FFF'
                            }}>

                                <div className='flex justify-between items-center border-b-[1.5px] border-[#CBC8C8] font-bold  '>
                                    <IonText className='mx-2 my' >Anti Rabbis</IonText>
                                    <IonText className='mx-2 my'>Total:₹ 500.00</IonText>
                                </div>

                                {/* edit */}

                                <div className='flex flex-col justify-evenly mx-2 '>

                                    <div className='flex  justify-between items-center overflow-x-auto max-h-10 h-[40px] '>


                                        <div className='flex justify-center items-center  bg-[#CBC8C8] mr-3 ' style={{
                                            borderRadius: '0px 10px 10px 0px',
                                            borderLeft: '3px solid #22A676',
                                            background: 'rgba(206, 233, 226, 0.16)',
                                            boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                                            width: '115px',
                                            height: '31px',
                                            flexShrink: 0
                                        }}>

                                            <IonImg src={catImg} className='h-[30px] w-[30]' />
                                            <div className='flex flex-col justify-center items-center '>
                                                <IonText className='text-[9px]'>Fluss</IonText>
                                                <div className="flex items-center">
                                                    <div className=" w-16 h-[1px] left-0 bg-[#FE4D4D]"></div>
                                                    <div className="w-[6px]  h-[6px] bg-[#FE4D4D] rounded-full"></div>
                                                </div>
                                                <IonText className='text-[9px]'>12 days OverDue</IonText>
                                            </div>
                                        </div>

                                        <div className='flex justify-center items-center  bg-[#CBC8C8] mr-3' style={{
                                            borderRadius: '0px 10px 10px 0px',
                                            borderLeft: '3px solid #BCC000',
                                            background: 'rgba(206, 233, 226, 0.16)',
                                            boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                                            width: '115px',
                                            height: '31px',
                                            flexShrink: 0
                                        }}>

                                            <IonImg src={catImg} className='h-[30px] w-[30]' />
                                            <div className='flex flex-col justify-center items-center '>
                                                <IonText className='text-[9px]'>Fluss</IonText>
                                                <div className="flex items-center">
                                                    <div className=" w-16 h-[1px] left-0 bg-[#FAFF00]"></div>
                                                    <div className="w-[6px]  h-[6px] bg-[#FAFF00] rounded-full"></div>
                                                </div>
                                                <IonText className='text-[9px]'>12 days OverDue</IonText>
                                            </div>
                                        </div>



                                        <div className='flex justify-center items-center  bg-[#CBC8C8] mr-3 ' style={{
                                            borderRadius: '0px 10px 10px 0px',
                                            borderLeft: '3px solid #22A676',
                                            background: 'rgba(206, 233, 226, 0.16)',
                                            boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                                            width: '115px',
                                            height: '31px',
                                            flexShrink: 0
                                        }}>

                                            <IonImg src={catImg} className='h-[30px] w-[30]' />
                                            <div className='flex flex-col justify-center items-center '>
                                                <IonText className='text-[9px]'>Fluss</IonText>
                                                <div className="flex items-center">
                                                    <div className=" w-16 h-[1px] left-0 bg-[#FE4D4D]"></div>
                                                    <div className="w-[6px]  h-[6px] bg-[#FE4D4D] rounded-full"></div>
                                                </div>
                                                <IonText className='text-[9px]'>12 days OverDue</IonText>
                                            </div>
                                        </div>
                                    </div>



                                    <div className='flex  items-center overflow-x-auto max-h-10 h-[40px]'>


                                        <div className='flex justify-center items-center  bg-[#CBC8C8] mr-3 ' style={{
                                            borderRadius: '0px 10px 10px 0px',
                                            borderLeft: '3px solid #22A676',
                                            background: 'rgba(206, 233, 226, 0.16)',
                                            boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                                            width: '115px',
                                            height: '31px',
                                            flexShrink: 0
                                        }}>

                                            <IonImg src={catImg} className='h-[30px] w-[30]' />
                                            <div className='flex flex-col justify-center items-center '>
                                                <IonText className='text-[9px]'>Fluss</IonText>
                                                <div className="flex items-center">
                                                    <div className=" w-16 h-[1px] left-0 bg-[#FE4D4D]"></div>
                                                    <div className="w-[6px]  h-[6px] bg-[#FE4D4D] rounded-full"></div>
                                                </div>
                                                <IonText className='text-[9px]'>12 days OverDue</IonText>
                                            </div>
                                        </div>

                                        <div className='flex justify-center items-center  bg-[#CBC8C8] mr-3' style={{
                                            borderRadius: '0px 10px 10px 0px',
                                            borderLeft: '3px solid #22A676',
                                            background: 'rgba(206, 233, 226, 0.16)',
                                            boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                                            width: '115px',
                                            height: '31px',
                                            flexShrink: 0
                                        }}>

                                            <IonImg src={catImg} className='h-[30px] w-[30px' />
                                            <div className='flex flex-col justify-center items-center '>
                                                <IonText className='text-[9px]'>Fluss</IonText>
                                                <div className="flex items-center">
                                                    <div className=" w-16 h-[1px] left-0 bg-[#22A676]"></div>
                                                    <div className="w-[6px]  h-[6px] bg-[#22A676] rounded-full"></div>
                                                </div>
                                                <IonText className='text-[9px]'>12 days OverDue</IonText>
                                            </div>
                                        </div>
                                    </div>

                                </div>




                                <div className='bg=[#fff]   mt-6 ' style={{
                                    width: '327px',
                                    height: '115px',
                                    flexShrink: 0,
                                    borderRadius: '10px',
                                    border: '1.5px solid #D3D2D2',
                                    background: '#FFF'
                                }}>

                                    <div className='flex justify-between items-center border-b-[1.5px] border-[#CBC8C8] font-bold overflow-x-auto '>
                                        <IonText className='mx-2 ' >Anti Rabbis</IonText>
                                        <IonText className='mx-2 '>Total:₹ 500.00</IonText>
                                    </div>

                                    {/* edit */}

                                    <div className='flex flex-col justify-evenly mx-2'>

                                        <div className='flex  justify-between items-center overflow-x-auto max-h-10 h-[40px] '>


                                            <div className='flex justify-center items-center  bg-[#CBC8C8] mr-3 ' style={{
                                                borderRadius: '0px 10px 10px 0px',
                                                borderLeft: '3px solid #FE4D4D',
                                                background: 'rgba(206, 233, 226, 0.16)',
                                                boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                                                width: '115px',
                                                height: '31px',
                                                flexShrink: 0
                                            }}>

                                                <IonImg src={catImg} className='h-[30px] w-[30]' />
                                                <div className='flex flex-col justify-center items-center '>
                                                    <IonText className='text-[9px]'>Fluss</IonText>
                                                    <div className="flex items-center">
                                                        <div className=" w-16 h-[1px] left-0 bg-[#FE4D4D]"></div>
                                                        <div className="w-[6px]  h-[6px] bg-[#FE4D4D] rounded-full"></div>
                                                    </div>
                                                    <IonText className='text-[9px]'>12 days OverDue</IonText>
                                                </div>
                                            </div>

                                            <div className='flex justify-center items-center  bg-[#CBC8C8] mr-3' style={{
                                                borderRadius: '0px 10px 10px 0px',
                                                borderLeft: '3px solid #BCC000',
                                                background: 'rgba(206, 233, 226, 0.16)',
                                                boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                                                width: '115px',
                                                height: '31px',
                                                flexShrink: 0
                                            }}>

                                                <IonImg src={catImg} className='h-[30px] w-[30]' />
                                                <div className='flex flex-col justify-center items-center '>
                                                    <IonText className='text-[9px]'>Fluss</IonText>
                                                    <div className="flex items-center">
                                                        <div className=" w-16 h-[1px] left-0 bg-[#FAFF00]"></div>
                                                        <div className="w-[6px]  h-[6px] bg-[#FAFF00] rounded-full"></div>
                                                    </div>
                                                    <IonText className='text-[9px]'>12 days OverDue</IonText>
                                                </div>
                                            </div>



                                            <div className='flex justify-center items-center  bg-[#CBC8C8] mr-3 ' style={{
                                                borderRadius: '0px 10px 10px 0px',
                                                borderLeft: '3px solid #22A676',
                                                background: 'rgba(206, 233, 226, 0.16)',
                                                boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                                                width: '115px',
                                                height: '31px',
                                                flexShrink: 0
                                            }}>

                                                <IonImg src={catImg} className='h-[30px] w-[30]' />
                                                <div className='flex flex-col justify-center items-center '>
                                                    <IonText className='text-[9px]'>Fluss</IonText>
                                                    <div className="flex items-center">
                                                        <div className=" w-16 h-[1px] left-0 bg-[#FE4D4D]"></div>
                                                        <div className="w-[6px]  h-[6px] bg-[#FE4D4D] rounded-full"></div>
                                                    </div>
                                                    <IonText className='text-[9px]'>12 days OverDue</IonText>
                                                </div>
                                            </div>
                                        </div>



                                        <div className='flex  items-center overflow-x-auto max-h-10 h-[40px]'>


                                            <div className='flex justify-center items-center  bg-[#CBC8C8] mr-3 ' style={{
                                                borderRadius: '0px 10px 10px 0px',
                                                borderLeft: '3px solid #FE4D4D',
                                                background: 'rgba(206, 233, 226, 0.16)',
                                                boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                                                width: '115px',
                                                height: '31px',
                                                flexShrink: 0
                                            }}>

                                                <IonImg src={catImg} className='h-[30px] w-[30]' />
                                                <div className='flex flex-col justify-center items-center '>
                                                    <IonText className='text-[9px]'>Fluss</IonText>
                                                    <div className="flex items-center">
                                                        <div className=" w-16 h-[1px] left-0 bg-[#FE4D4D]"></div>
                                                        <div className="w-[6px]  h-[6px] bg-[#FE4D4D] rounded-full"></div>
                                                    </div>
                                                    <IonText className='text-[9px]'>12 days OverDue</IonText>
                                                </div>
                                            </div>

                                            <div className='flex justify-center items-center  bg-[#CBC8C8] mr-3' style={{
                                                borderRadius: '0px 10px 10px 0px',
                                                borderLeft: '3px solid #22A676',
                                                background: 'rgba(206, 233, 226, 0.16)',
                                                boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                                                width: '115px',
                                                height: '31px',
                                                flexShrink: 0
                                            }}>

                                                <IonImg src={catImg} className='h-[30px] w-[30px' />
                                                <div className='flex flex-col justify-center items-center '>
                                                    <IonText className='text-[9px]'>Fluss</IonText>
                                                    <div className="flex items-center">
                                                        <div className=" w-16 h-[1px] left-0 bg-[#22A676]"></div>
                                                        <div className="w-[6px]  h-[6px] bg-[#22A676] rounded-full"></div>
                                                    </div>
                                                    <IonText className='text-[9px]'>12 days OverDue</IonText>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>
                        


                        {/* bottom  */}
                        <div className='border-t border-[#2C60AF57] bottom-0 h-40 fixed w-full bg-[#fff]   '>

                            <div className='flex flex-col items-center justify-center mt-3  '>
                                <IonText className='custom-text text-[12px] font-inter flex justify-between items-center'>
                                    <span className='font-medium'>Sub Total →</span>
                                    <span className='font-bold'>₹ 500</span>
                                </IonText>
                                <IonText className='custom-text my-3 text-[12px] font-inter font-medium flex justify-between items-center'>
                                    <span>Services Selected →</span>
                                    <span> 1</span>
                                </IonText>
                                <IonText className='custom-text text-[12px] font-inter font-medium flex justify-between items-center' >
                                    <span>Approximate service time →</span>
                                    <span> 05 Minutes</span>
                                </IonText>
                            </div>


                            <div className=' bg-[#D9D9D9] h-[36px] w-full fixed bottom-4 flex justify-center'>
                                <div className='flex justify-between items-center w-full max-w-md'>

                                    <div className='flex justify-between items-center text-center border border-[#BCBCBC] bg-white h-[35px] rounded-3xl mx-2'>
                                        <IonText
                                            className='ml-3 mr-1'
                                            style={{
                                                color: '#000',
                                                fontFamily: "Open Sans",
                                                fontSize: '12px',
                                                fontStyle: 'italic',
                                                fontWeight: '700',
                                                lineHeight: 'normal'
                                            }}
                                        >
                                            Rates
                                        </IonText>
                                        <IonImg src={rupee} className="" />
                                    </div>

                                    <div
                                        onClick={handleSummaryClick}
                                        className='flex justify-between items-center border border-[#BCBCBC] bg-white p-2 h-[35px] rounded-3xl mx-2'
                                    >
                                        <IonText
                                            style={{
                                                color: '#2B369D',
                                                fontFamily: "Open Sans",
                                                fontSize: '12px',
                                                fontStyle: 'italic',
                                                fontWeight: '600',
                                                lineHeight: 'normal'
                                            }}
                                        >
                                            See Available Slots
                                        </IonText>
                                        <IonIcon src={brief} className='h-[25px] w-[25px]' />
                                    </div>

                                </div>
                            </div>


                        </div>



                    </div>
                </div>

            </IonContent>
        </IonPage>
    )
}

export default HomeBooking;
