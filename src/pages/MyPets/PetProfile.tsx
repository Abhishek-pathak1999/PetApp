import { useState, useEffect, useRef } from 'react';
import { IonPage, IonContent, IonCard, IonCardContent, IonImg, IonText, IonButton, useIonViewDidEnter } from '@ionic/react';
import Pet1 from "../../assets/man-take-pic-dog.png"
import { useHistory, useLocation } from 'react-router';
import { Preferences } from "@capacitor/preferences";
import backArrow1 from "../../assets/Back Arrow (1).png"
import backArrow2 from "../../assets/Back Arrow.png";
import { createGesture } from '@ionic/core';
import EditPetDetails from './EditPetDetails';


const PetProfile = ({ details, handlePetById, setDefaultImage, setEditPageEnable, editPageEnable} : any) => {
  const location = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Start index from 1
  const [token, setToken] = useState<null | string>(null);
  
  const history = useHistory();
  const prom = location?.state
  console.log("recieve data : ", prom)
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useIonViewDidEnter(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  });

  useEffect(() => {
    (async () => {
      const tokenValue = await Preferences.get({ key: "token" });
      setToken(tokenValue.value!);
    })();
  }, []);

  useEffect(()=>{
    if(details?.result?._id){
      handlePetById(details?.result._id)
    }
    
  }, [editPageEnable])

  useEffect(()=>{
    setCurrentImageIndex(0)
  },[details])

  useEffect(()=>{
    async function changeIndex() {
      if(currentImageIndex){
        await Preferences.set({ key: 'imageIndex', value: String(currentImageIndex) });
      }
    }
    changeIndex()
  },[currentImageIndex])

  const gestureRef = useRef(null);

  useEffect(() => {
    if (gestureRef.current) {
      const gesture = createGesture({
        el: gestureRef.current,
        threshold: 15,
        gestureName: 'swipe',
        onStart: () => {},
        onMove: () => {},
        onEnd: (ev) => {
          if (ev.deltaX > 0) {
            if (currentImageIndex !== 0) {
              handlePrevImage();
            }
          } else {
            if (currentImageIndex !== (details?.result?.images?.length - 1) && details?.result?.images?.length > 0) {
              handleNextImage();
            }
          }
        }
      });
      gesture.enable();
      return () => gesture.destroy();
    }
  }, [currentImageIndex, details]);


  const handleNextImage = () => {

          setCurrentImageIndex(currentImageIndex + 1);
  };


  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };
  console.log("index: ", currentImageIndex)
  console.log("petsInfooo : ", details)

  return (
    <>{editPageEnable ? (<EditPetDetails details={details} setDefaultImage={setDefaultImage} currentImageIndex={currentImageIndex} setEditPageEnable={setEditPageEnable} />):
    <IonPage>
      <IonContent className="flex justify-center items-center bg-gray-100">
      <div className="w-full mt-1 mb-12" >
      {(details == null || details?.result) && (
        <IonCard className="p-0 m-0">
          <IonCardContent className="p-0 m-0" style={{ fontFamily: "Open Sans" }}>
            <div ref={gestureRef}>
              {details?.result?.images && details?.result?.images?.length > 0 ? (
                <IonImg
                  src={details?.result?.images[currentImageIndex]?.uploadImageUrl}
                  className="w-full h-[61vh] z-10 object-cover m-0 p-0"
                />
              ) : (
                <div>
                  <div>
                    <IonImg src={Pet1} className="w-full h-[40vh]" />
                  </div>
                  <div className="flex justify-center items-center h-[21vh]">
                    <IonText
                      style={{
                        color: '#B53598',
                        fontFamily: "Open Sans",
                        fontSize: '16px',
                        fontStyle: 'normal',
                        fontWeight: '700',
                        lineHeight: 'normal'
                      }}
                      className="uppercase"
                    >
                      UPLOAD {details?.result?.pet_name}'s PICTURE
                    </IonText>
                  </div>
                </div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-opacity-50 text-white p-2 flex justify-between items-center"
                 style={{ fontFamily: "Open Sans", background: 'rgba(18, 32, 81, 0.45)' }}>
              <div onClick={handlePrevImage} className="text-center">
                <IonImg src={backArrow1} style={{ opacity: currentImageIndex === 0 ? 0.5 : 1 }} />
              </div>
              <div className="text-left">
                <IonText className="block">{details?.result?.pet_name}</IonText>
                <IonText className="block">{details?.result?.gender} - {details?.result?.animal_type}</IonText>
              </div>

              <div>
                <IonText className="block">{details?.result?.age} Yrs</IonText>
                <IonText className="block">{details?.result?.weight} Kg</IonText>
              </div>
              <div className="text-center">
                <IonText className="block">{details?.result?.breed}</IonText>
                <IonText className="block">{details?.result?.chip_number}</IonText>
              </div>
              <div onClick={(currentImageIndex === (details?.result?.images?.length - 1)) || (details?.result?.images?.length == 0) ? () => {} : handleNextImage} className="text-center">
                <IonImg src={backArrow2} style={{ opacity: (currentImageIndex === (details?.result?.images?.length - 1)) || (details?.result?.images?.length == 0) ? 0.5 : 1 }} />
              </div>
            </div>
          </IonCardContent>
        </IonCard>
      )}
      </div>
      <div ref={bottomRef}/>
      <div className='w-[100%] h-2 relative'>
        <div className='w-[100%] flex items-center justify-between mt-[38px] h-[60px] fixed bottom-0 left-0 bg-[#fff] '>
          <IonButton
            onClick={() => setEditPageEnable(true)}
            shape="round"
            className="fixed bottom-3 left-[130px] capitalize w-[110px] flex justify-center items-center mx-auto mt-[18px] text-[#000000] font-bold col"
            style={{ fontFamily: "Open Sans" }}
          >
            Edit
          </IonButton>

        </div>
      </div>
      
      </IonContent>
    </IonPage>
}</>
  );
};

export default PetProfile;