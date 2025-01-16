import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonPage,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route, useLocation, useHistory } from "react-router";
import { Preferences } from "@capacitor/preferences";
import { useQueryClient } from "react-query";
import { SetStateAction, useEffect, useState } from "react";
import { decodeJwt } from "../helpers";
import MyPets from "./MyPets";
import MyPetsTabs from "./MyPets/MyPetsTabs";
import Headers from "../components/Headers";
import Profile from "./Profile";
import BookAppointments from "./BookAppointments";
import Appointments from "./Appointments";
import SideMenu from "../components/SideMenu";
import HomeBooking from "./HomeBooking";
import Summary from "./Summary";
import NewPet from "./MyPets/NewPet";
import EditUserProfile from "./EditUserProfile";
import IntroVideos from "./IntroVideos";
import Videos from "./Videos";

import AnimalShelterActive from '../assets/animal-shelter.svg';
import AnimalShelter from '../assets/Animal Shelter.svg';
import CalendarPlusActive from '../assets/calendar-plus.svg';
import CalendarPlus from '../assets/Calendar Plus.svg';
import PushNotificationsActive from '../assets/push-notifications.svg';
import PushNotifications from '../assets/Push Notifications.svg';
import CircledPlayActive from '../assets/circled-play.svg';
import CircledPlay from "../assets/Circled Play.svg"
import Messages from "./CitiPetClinicPage";
import { useTabContext } from "../TabContext";
import { setupIonicReact } from '@ionic/react';
import { App as CapacitorApp } from '@capacitor/app';
import PrivacyPolicy from "./UserLicense";
import ContactSupport from "./ContactSupport";
import PrivacyPolicyPopup from "./UserLicense";
setupIonicReact();

const Dashboard = () => {
  const queryCache = useQueryClient();
  const history = useHistory()
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const { handleTabClickk } = useTabContext();
  const [lastBackPress, setLastBackPress] = useState<number>(0);

  useEffect(() => {
    const backButtonListener = CapacitorApp.addListener('backButton', (event) => {
      const currentTime = new Date().getTime();

      
        // If on the root page, handle double back press
        if (currentTime - lastBackPress < 500) {
          CapacitorApp.exitApp(); // Exit the app
        } else {
          setLastBackPress(currentTime);
        }
      
    });

    return () => {
      backButtonListener.remove(); // Clean up the listener
    };
  }, [history, lastBackPress]);

  useEffect(() => {
    (async () => {
      const tokenValue = await Preferences.get({ key: "token" });
      setToken(tokenValue.value!);
      setLoading(false);
    })();
  }, []);

  const { result = {} }: any = loading ? {} : decodeJwt(token);
  const [heightUpdate, setHeightUpdate] = useState<boolean>(false)

  const [selectedTab, setSelectedTab] = useState('my-pets');

  const handleTabClick = (tab: SetStateAction<string>) => {
    setSelectedTab(tab);
  };

  const location: any = useLocation();
  console.log("selectedTab: ", selectedTab)

  function reloadHome(){
    handleTabClick('my-pets'); 
    history.push("/dashboard/my-pets/display")
  }

  return (

    <IonReactRouter  >
        {selectedTab !== "my-pets" && <Headers setSelectedTab={setSelectedTab} setHeightUpdate={setHeightUpdate} selectedTab={selectedTab} reloadHome={reloadHome} user={result} />}
        <IonTabs className={`flex flex-row relative h-[100%] ${selectedTab=="my-pets"? "bg-[#ECF2FF]" : "bg-white"}`}>

          <IonRouterOutlet>
            <Redirect exact={true} path="/dashboard" to="/dashboard/my-pets/display" />
            <Route
              path="/dashboard/my-pets/display"
              render={() => <MyPets key={"my-pets"} setSelectedTab={setSelectedTab} setHeightUpdate={setHeightUpdate} heightUpdate={heightUpdate} user={result} selectedTab={selectedTab}/>}
              exact={true}
            />

            <Route
              path="/dashboard/appointments"
              render={() => <Appointments key={"appoinm"}/>}
              exact={true}
            />
            {/* <Route
              path="/dashboard/book-appointments"
              render={() => <BookAppointments />}
              exact={true}
            /> */}

            <Route
              path="/dashboard/notifications"
              render={() => <Messages key={"notification"}/>}
              exact={true}
            />
            <Route
              path="/dashboard/privacyPolicy"
              render={() => <PrivacyPolicy key={"privacyPolicy"}/>}
              exact={true}
            /> 
            <Route
              path="/dashboard/contactSupport"
              render={() => <ContactSupport key={"contactSupport"}/>}
              exact={true}
            /> 
            <Route
              path="/dashboard/video"
              render={() => <Videos />}
              exact={true}
            />


            <Route path="/profile" render={() => <Profile />} exact={true} />

            <Route
              path="/editUserProfile"
              render={() => <EditUserProfile key={"editUserProfile"}/>}
              exact={true}
            />

            <Route path="/video" render={() => <IntroVideos />} exact={true} />

            <Route
              path="/dashboard/my-pets/details"
              render={() =>
                <MyPetsTabs key={"my-petsdetails"}/>}
              exact={true}
            />

            <Route
              path="/dashboard/home-booking"
              render={() =>
                <HomeBooking key={selectedTab}/>}
              exact={true}
            />

            <Route
              path="/dashboard/summary"
              render={() =>
                <Summary key={"summary"}/>}
              exact={true}
            />

            <Route
              path="/dashboard/new-pet"
              render={() =>
                <NewPet key={"newPet"}/>}
              exact={true}
            />


          </IonRouterOutlet>

          
              <IonTabBar slot="bottom" className={`custom-tab-bar2 sk justify-between h-[52px] mx-5 ${selectedTab=="my-pets"? "mb-[20px]" : "mb-[102px]"} rounded-lg`}>

                <IonTabButton
                  tab="my-pets"
                  href="/dashboard/my-pets/display"
                  onClick={() => { reloadHome() }}
                  className="flex flex-col items-center"
                >
                  <IonIcon className="h-[30px] w-[30px] mb-0 pb-0" src={selectedTab === 'my-pets' ? AnimalShelterActive : AnimalShelter} />
                  <IonLabel className="text-center mt-0 pt-0 text-sm">My Pets</IonLabel>
                </IonTabButton>
                <IonTabButton
                  tab="appointments"
                  href="/dashboard/appointments"
                  onClick={() => {handleTabClick('appointments'); handleTabClickk('appointments'); }
                  }
                >
                  <IonIcon className="h-[30px] w-[30px] mb-0 pb-0" src={selectedTab === 'appointments' ? CalendarPlusActive : CalendarPlus} />
                  <IonLabel className="text-center mt-0 pt-0 text-sm">Book Appointments</IonLabel>
                </IonTabButton>

                <IonTabButton
                  tab="notifications"
                  href="/dashboard/notifications"
                  onClick={() => {handleTabClick('notifications'); handleTabClickk('appointments')}}
                >
                  <IonIcon className="h-[30px] w-[30px] mb-0 pb-0" src={selectedTab === 'notifications' ? PushNotificationsActive : PushNotifications} />
                  <IonLabel className="text-center mt-0 pt-0 text-sm">Messages</IonLabel>
                </IonTabButton>

                {/* <IonTabButton
                  tab="video"
                  href="/dashboard/video"
                  onClick={() => handleTabClick('video')}
                >
                  <IonIcon className="h-[30px] w-[30px] mb-0 pb-0" src={selectedTab === 'video' ? CircledPlayActive : CircledPlay} />
                  <IonLabel className="text-center mt-0 pt-0 text-sm">Video</IonLabel>
                </IonTabButton> */}

              </IonTabBar>


        </IonTabs>
    </IonReactRouter>
  );
};

export default Dashboard;