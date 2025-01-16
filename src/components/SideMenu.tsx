import { IonAvatar, IonImg, IonMenu, IonMenuToggle, IonText } from '@ionic/react';
import JyotiShuklaImg from '../assets/genricImage.jpg';
import { useHistory, useLocation } from 'react-router';
import { useQueryClient } from 'react-query';
import { Preferences } from '@capacitor/preferences';
import React, { useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '../config';
import { handleGetParentData } from '../service/services';

const SideMenu = React.forwardRef(({ menuState, setMenuState, setSelectedTab  }: any) => {
  const history = useHistory();
  const queryClient = useQueryClient();
  const [parentImage, setParentImage] = useState<string | null>(null);
  const menuRef = useRef<HTMLIonMenuElement>(null);

  async function clearLocalStorage(){
    await Preferences.remove({ key: "token" });
    await Preferences.remove({ key: "refreshToken" });
    await Preferences.remove({ key: "mobileNumber" });
    queryClient.clear();
  }

  const handleLogout = async () => {
    clearLocalStorage()
    history.push("/login");
    window.location.reload();
  };

  const handleProfileClick = () => {
    
    history.push("/editUserProfile");
    setTimeout(()=>{
      setSelectedTab("inPetDetails")
    },400)
  };

  const handlePastAppClick = () => {
    
    history.push("/dashboard/appointments")
    setTimeout(()=>{
      setSelectedTab("appointments")
    },400)
  };

  const handleuserLicenseClick = () => {
    
    history.push("/dashboard/privacyPolicy")
    setSelectedTab("privacyPolicy")
  };

  function handleContactSupport(){
    history.push("/dashboard/contactSupport")
    setSelectedTab("privacyPolicy")
  }


  useEffect(() => {
  if(menuState){
    fetchParentDetails();
    menuRef?.current?.open();
  }else{
    menuRef?.current?.close();
  }
  }, [menuState]);


  const fetchParentDetails = async () => {
    try {
      const tokenValue = await Preferences.get({ key: "token" });
      if (tokenValue.value) {
        const response = await handleGetParentData(tokenValue)
        if (response.status != 200) {
          throw new Error('Failed to fetch parent details');
        }

        const data = response;
        console.log('API Response:', data);  // Log the API response

        const parentDetails = data?.result;
        if (parentDetails?.image_base_url
        ) {
          setParentImage(parentDetails.image_base_url
          );
        }
      }
    } catch (error) {
      console.error('Error fetching parent details:', error);
    }
  };

  
 console.log("profile img sk",parentImage)
  return (
    <IonMenu
      onIonDidClose={() => {
        setMenuState(!menuState);
      }}
      onClick={()=> menuRef?.current?.close()}
      side="end"
      contentId="main"
      type="overlay"
      className="my-6 mx-3 custom-design"
      style={{ height: '100%', margin: '0px' }}
      ref={menuRef}>
      <IonMenuToggle>
        <div className='relative'>
          <div
            className="absolute top-0 right-0 flex w-[48%] flex-col items-center text-center mt-12 mr-2 rounded-md overflow-y-auto"
            style={{ background: 'linear-gradient(180deg, #D6D8EA 0%, #3C4277 100%)' }}
          >
            <IonAvatar className="mt-1">
              <div className="overflow-hidden bg-white h-[57px] w-[57px] mt-1 rounded-full items-center justify-center flex">
                <img src={parentImage || JyotiShuklaImg} alt="img" className="w-full h-full object-cover " onError={(e) => {e.currentTarget.src = JyotiShuklaImg}}/>
              </div>

            </IonAvatar>
            <IonText
              onClick={()=>handleProfileClick()}
              color="light"
              className="transition-transform duration-150 ease-in-out active:scale-95 rounded-[25px] mt-1 w-[80%] custom-input2 border bg-white text-black font-bold text-[13px] flex items-center justify-center"
            >
              My Profile
            </IonText>
            <IonText
             onClick={()=> handleContactSupport()}
              color="light"
              className="transition-transform duration-150 ease-in-out active:scale-95 touch-none rounded-[25px] my-2 w-[80%] custom-input2 text-bold border text-center bg-white text-black font-bold text-[13px] flex items-center justify-center"
            >
              Contact Support
            </IonText>
            <IonText
              onClick={() => handlePastAppClick()}
              className="transition-transform duration-150 ease-in-out active:scale-95 touch-none rounded-[25px] w-[80%] custom-input2 text-bold border text-center bg-white text-black font-bold text-[13px] flex items-center justify-center"
            >
              Past Appointments
            </IonText>
            <IonText
              onClick={()=> handleuserLicenseClick()}
              color="light"
              className="transition-transform duration-150 ease-in-out active:scale-95 touch-none rounded-[25px] w-[80%] my-2 custom-input2 border text-bold text-center bg-white text-black font-bold text-[13px] flex items-center justify-center"
            >
              Privacy Policy
            </IonText>
            <IonText
              onClick={handleLogout}
              color="danger"
              className="transition-transform duration-150 ease-in-out active:scale-95 touch-none rounded-[25px] w-[80%] mb-3 custom-input2 border bg-[#E9BCB9] text-black font-bold text-[13px] flex items-center justify-center"
            >
              Log Out
            </IonText>
          </div>
        </div>
      </IonMenuToggle>
    </IonMenu>
  );
});

export default SideMenu;
