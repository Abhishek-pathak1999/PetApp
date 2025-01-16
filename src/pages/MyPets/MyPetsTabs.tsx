import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonPopover,
  IonButton,
  IonItem,
  IonImg,
  IonContent,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route, useHistory, useLocation } from "react-router";
import { Preferences } from "@capacitor/preferences";
import { SetStateAction, useEffect, useState } from "react";
import MedicalHistory from "./MedicalHistory";
import Reminders from "./Reminders";
import Favourites from "./Favourites";
import { caretDownOutline, pawOutline } from "ionicons/icons";
import EditPetDetails from "./EditPetDetails";
import { handlePetsInfo } from "../../service/services";
import Pet1 from "../../assets/pet1.png"
import PetProfile from "./PetProfile";
import ActiveCatFoot from "../../assets/cat-footprint-active.png"
import InActiveCatFoot from "../../assets/cat-footprint.png"
import NewPet from "./NewPet";
import { useTabContext } from "../../TabContext";


interface ProfileProps {
  details: PetInfo | null;
}

interface PetInfo {

  result?: {
    image_base_url: string;
    pet_name: string;
    gender: string;
    animal_type: string;
    age: string;
    weight: string;
    breed: string;
    chip_number: string;
  };

}

const MyPetsTabs = () => {
  const location: any = useLocation();
  const history = useHistory();
  const { handleTabClickk } = useTabContext();

  const handleNewPetClick = () => {
    history.push('/dashboard/new-pet');
  };

  const [token, setToken] = useState<null | string>(null);
  const [petsInfo, setPetsInfo] = useState<null | PetInfo>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPet, setSelectedPet] = useState<any>([]); // State to manage the selected pet
  const [defaultImage, setDefaultImage] = useState<any>(location?.state?.url)
  const [editPageEnable, setEditPageEnable] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const tokenValue = await Preferences.get({ key: "token" });
      setToken(tokenValue.value!);
    })();
  }, []);

  useEffect(() => {
    if (token) {
      handlePetById(location?.state?.id);
    }
  }, [token]);

  useEffect(() => {
    if (selectedPet) {
      handlePetById(selectedPet._id)
    }
  }, [selectedPet])
  console.log("OKK", location?.state?.id)

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSelectPet = (pet: any) => {
    
    setSelectedPet(pet);
    setDefaultImage("")
    setShowDropdown(false); // Close dropdown after selection
    setEditPageEnable(false)
  };
  console.log("petsInfo: ", petsInfo)

  async function handlePetById(id: any) {
    if(id){
      const data = await handlePetsInfo(id);
      setPetsInfo(data);
    } 
  }

  const [selectedTab, setSelectedTab] = useState('my-pets');

  const handleTabClick = (tab: SetStateAction<string>) => {
    setSelectedTab(tab);
    

  };
  return (
    <IonReactRouter>
      {/* <Headers title="My Pets" /> */}
      <IonTabs className="z-50 relative flex flex-row h-full">
        <IonRouterOutlet>
          <Redirect
            exact={true}
            path="/dashboard/my-pets/details"
            to="/dashboard/my-pets/profile"
          />
          <Route
            path="/dashboard/my-pets/profile"
            render={() => <PetProfile key={"petProfilehere"} details={petsInfo} handlePetById={handlePetById} setDefaultImage={setDefaultImage} setEditPageEnable={setEditPageEnable} editPageEnable={editPageEnable}/>}
            exact={true}
          />
          <Route
            path="/dashboard/my-pets/medical-history"
            render={() => <MedicalHistory key={"medicalHostory"} details={petsInfo}/>}
            exact={true}
          />
          <Route
            path="/dashboard/my-pets/reminders"
            render={() => <Reminders key={"reminder"} details={petsInfo}/>}
            exact={true}
          />
          <Route
            path="/dashboard/my-pets/favourites"
            render={() => <Favourites key={"favroutie"} details={petsInfo}/>}
            exact={true}
          />
          {/* <Route
            path="/dashboard/edit-pet"
            render={() => <EditPetDetails/>}
            exact={true}
          /> */}
        </IonRouterOutlet>

        <IonTabBar slot="top" className={`custom-tab-bar relative  justify-between h-[70px]  `}>
          <IonTabButton tab="" className="pl-5" >

            <div>

              <div id="auto-trigger" onClick={toggleDropdown} className="flex justify-center items-center relative w-[40px]">
                <div className="flex flex-col justify-center items-center">
                  <div className="flex items-center h-9" style={{
                    borderRadius: "20px 20px 20px 20px",
                    border: "0.5px solid #B5A5A5",
                    background: "rgba(217, 217, 217, 0.37)"
                  }}>
                    
                      <div className="overflow-hidden rounded-full h-7.5 w-[28px]">
                        <img src={defaultImage || selectedPet?.image_base_url || Pet1} onError={(e) => {e.currentTarget.src = Pet1}} className="h-full w-full object-cover" />
                      </div>

                    <IonIcon  className="ml mr-1" icon={caretDownOutline} style={{ fontSize: '18px', color:"#2B369D" }} />
                  </div>
                  <IonLabel style={{color:"#2B369D"}} className="custom-label">{selectedPet?.pet_name || petsInfo?.result?.pet_name}</IonLabel>
                </div>
              </div>


              <IonPopover trigger="auto-trigger" isOpen={showDropdown} onDidDismiss={() => setShowDropdown(false)}>
                <IonContent className="ion-padding m-4 h-56">
                  {location?.state?.allData && location?.state?.allData.result.map((pet: any) => (
                    <IonItem button key={pet.pet?._id} onClick={() => { handleSelectPet(pet?.pet) }} className="mt-5">
                      <div className="flex items-center ">
                        <img src={pet?.pet?.image_base_url || Pet1} alt="pet image" onError={(e) => {e.currentTarget.src = Pet1}} className="h-10 w-10 mb-2" />
                        <IonLabel className="ml-2">{pet.pet?.pet_name}</IonLabel>
                      </div>
                    </IonItem>
                  ))}
                </IonContent>
                
                <div className=" flex justify-center my-3 items-center">
                    <IonButton shape="round" color="success" className="items-center text-center " onClick={() => {
                
                history.push("/dashboard/new-pet");
                setShowDropdown(false)
              }}>Add New Pet</IonButton>
                  </div>
              </IonPopover>

            </div>

          </IonTabButton>

          <IonTabButton tab="my-pets" href="/dashboard/my-pets/profile" onClick={() => { handleTabClick('my-pets'); setEditPageEnable(false) }}>
            <IonImg src={selectedTab === 'my-pets' ? ActiveCatFoot : InActiveCatFoot} />
            <IonLabel className="custom-label">Profile</IonLabel>
          </IonTabButton>

          <IonTabButton tab="medicalHistory" href="/dashboard/my-pets/medical-history" onClick={() => { handleTabClick('medicalHistory'); }}>
            <IonImg src={selectedTab === 'medicalHistory' ? ActiveCatFoot : InActiveCatFoot} className="w-[30px] h-[30px]" />
            <IonLabel className="custom-label">Med History</IonLabel>
          </IonTabButton>

          <IonTabButton tab="reminders" href="/dashboard/my-pets/reminders" onClick={() => { handleTabClick('reminders'); handleTabClickk("reminders") }}>
            <IonImg src={selectedTab === 'reminders' ? ActiveCatFoot : InActiveCatFoot} className="w-[30px] h-[30px]" />
            <IonLabel className="custom-label">Reminders</IonLabel>
          </IonTabButton>

          <IonTabButton className="pr-5" tab="favourites" href="/dashboard/my-pets/favourites" onClick={() => { handleTabClick('favourites'); }}>
            <IonImg src={selectedTab === 'favourites' ? ActiveCatFoot : InActiveCatFoot} className="w-[30px] h-[30px]" />
            <IonLabel className="custom-label">Favourites</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};

export default MyPetsTabs;
