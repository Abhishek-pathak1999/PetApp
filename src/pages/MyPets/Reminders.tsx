import { IonAvatar, IonContent, IonImg, IonLabel, IonPage, IonText, useIonToast } from "@ionic/react";
import catImg from "../../assets/cat-img.png";
import blackCat from "../../assets/black-cat.png";
import home from "../../assets/Home.png"
import bgVideo from "../../assets/reminderVideo.mp4"
import comming from '../../assets/comingSoon.mp4'
import { getImageByName } from "../../utils/imagesUtil";
import { useEffect, useState } from "react";
import { getProductForRemainder, requestHome } from "../../service/services";
import moment from "moment";
import { useLocation } from 'react-router-dom';
import { useTabContext } from "../../TabContext";

const Reminders = ({details}: any) => {
  const location = useLocation();
  const [remainderData, setRemainderData] = useState<any>([])
  const [presentToast] = useIonToast();
  const { selectedTabb } = useTabContext();

  useEffect(()=>{
    if(details && details?.result?._id){
      getRemainderData()
    }
  },[details])

  async function getRemainderData(){
    try{
      console.log("details?.result?._id", details?.result?._id)
      const data = await getProductForRemainder(details?.result?._id);
      setRemainderData(data)
    }catch(e){
      console.error(e)
    }
  }
  console.log("detailsOf Pet: ", remainderData.result)

  function checkIconByDate(firstDate :any, secondDate:any){
    const followUpDate = moment(firstDate).add(secondDate, 'days');
    const today = moment();
    const daysDiff = followUpDate.diff(today, 'days'); // Difference in days between follow-up date and today

    let icon;
    if (daysDiff < 0) {
      // Follow-up date has passed
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="11" viewBox="0 0 10 11" fill="none" className="mr-2">
        <circle cx="5" cy="5.25" r="4.5" fill="#E66969" stroke="black"/>
        </svg>
      );
    } else if (daysDiff >= 0 && daysDiff <= 7) {
      // Follow-up date is within the next week
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="11" viewBox="0 0 10 11" fill="none" className="mr-2">
        <circle cx="5" cy="5.25" r="4.5" fill="#DCE669" stroke="black"/>
        </svg>
      );
    } else {
      // Follow-up date is more than a week away
      icon = (

        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="11" viewBox="0 0 10 11" fill="none" className="mr-2">
        <circle cx="5" cy="5.25" r="4.5" fill="#22A676" stroke="black"/>
        </svg>
      );
    }
    return icon;
  }

  async function requestForHomeServices(){
    try{
      const data = await requestHome();
      if(data.isSuccess){
        presentToast({
          message: data?.message,
          duration: 2000,
          color: 'success',
        });
      }else{
        presentToast({
          message: data?.message,
          duration: 2000,
          color: 'success',
        });
      }
    }catch(e){
      console.error(e)
    }
  }

  console.log('Current Route:', selectedTabb);

  return (
    <IonPage>
      <IonContent fullscreen scrollY={false}>

        <div className="flex flex-col justify-between items-center h-screen">

        

        <div className="bg-white w-full h-[35%] relative">
          {/* <IonImg className=" absolute -mt-[74px]" src={blackCat} alt="cat-img" /> */}
          <div className="flex justify-around items-center border-b-[1px] border-[#0000003D] bg-[#182C4F]">
            <IonText className=" text-[12px] font-extrabold my-1 font-segoe text-white">Upcoming Vaccinations and Services for </IonText>
            <div className="absolute -top-[43px] right-7">
              <IonAvatar className="h-[35px] w-[35px] mt-3">
                
              </IonAvatar>
              <IonLabel className="font-extrabold text-xs absolute ml-1 capitalize text-[#FAFF00]">{details?.result?.pet_name}</IonLabel>
            </div>
          </div>


          <div className="min-w-full mt-2 px-4" style={{
              fontFamily: 'Open Sans',
              fontStyle: 'normal',
              fontWeight: '700',
          }}>
            <div className="flex justify-between ml-6">
              <div className="text-[#000] uppercase font-bold" style={{
                fontSize: '12px',
                letterSpacing: '1.92px'
              }}>Service</div>
              <div className="text-[#000] uppercase font-bold ml-3" style={{
                fontSize: '12px',
                letterSpacing: '1.92px'
              }}>Given On</div>
              <div className="pr-3 text-[#000] uppercase font-bold" style={{
                fontSize: '12px',
                letterSpacing: '1.92px'
              }}>Next</div>
            </div>

            <div className="max-h-[160px] overflow-y-auto">

            {remainderData?.result?.length > 0 && remainderData.result.map((item:any, index:number) => (
              <div key={index} className="mt-1 p-1 flex justify-between items-center" style={{
                background: "rgba(114, 166, 215, 0.05)",
                borderRadius: "8px",
                border: "0.1px solid #72A6D7"
              }}>
                <div className="flex items-center font-segoe w-[110px] max-w-[110px] overflow-hidden">
                {checkIconByDate(item?.treatmentItem?.treatment?.treatmentDone,item?.treatmentItem?.product?.followUpDays)}
                  <IonText className="uppercase truncate" style={{ fontSize: '12px', letterSpacing: '1.6px' }}>
                    {item?.treatmentItem?.product?.name}
                  </IonText>
                </div>
                <div className="text-[10px] uppercase" style={{
                  fontWeight: '600',
                  letterSpacing: '1.6px'
                }}>
                  {item?.treatmentItem?.product?.followUp ? moment(item?.treatmentItem?.treatment?.treatmentDone).format("DD-MM-YYYY") : "NAN"}
                </div>
                <div className="text-[10px] uppercase" style={{
                  fontWeight: '600',
                  letterSpacing: '1.6px'
                }}>
                  {item?.treatmentItem?.product?.followUp ? moment(item?.treatmentItem?.treatment?.treatmentDone).add(item?.treatmentItem?.product?.followUpDays, 'days').format("DD-MM-YYYY"): "NAN"}
                </div>
              </div>
            ))}
            </div>
          </div>


        </div>

        {selectedTabb != "appointments" && <div className="relative flex flex-col justify-center items-center w-full h-[65%]">
          {/* Video Background */}
          <video
            autoPlay
            loop
            muted
            className="absolute inset-0 w-full h-[22px] object-cover"
          >
            <source src={comming} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <video
            autoPlay
            loop
            muted
            className="absolute inset-0 w-full h-full object-cover mt-6"
          >
            <source src={bgVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Content in front of the video */}
          <div className="absolute top-0 z-10 flex flex-col justify-center items-center mt-2.5">
          
            <div
              className="relative border p-2 h-[27px] rounded-[30px] mt-11 flex items-center w-[190px] transition-transform duration-75 ease-in-out active:bg-gray active:scale-95"
              style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)", background:"rgba(249, 252, 109, 0.90)" }}
              onClick={requestForHomeServices}
            >
              <IonImg src={home} className="h-[30px] w-[30px] mt-1.5 -ml-[11px] absolute" />
              <IonText
                style={{ fontFamily: "Open Sans" }}
                className="text-[#22288D] font-bold text-[14px] ml-10"
              >
                Home Vaccination
              </IonText>
            </div>

            <div
              className="flex flex-col justify-center items-center mt-1"
              style={{ fontFamily: "Segoe UI" }}
            >
              
              <IonText
                className="text-center font-bold text-[16px] text-[#fff]"
              >
                Click the button to express your <br/> interest in this feature.
              </IonText>
            </div>
          </div>
        </div>}
        </div>


      </IonContent>
    </IonPage>

  );
};

export default Reminders;
