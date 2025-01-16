import { IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonIcon, IonLabel, IonImg, IonRouterLink } from '@ionic/react';

import { useHistory } from "react-router";
import { getImageByName } from '../utils/imagesUtil';
import { useEffect, useRef, useState } from 'react';

import MenuIcon from "../assets/Menu2.svg";
import SideMenu from './SideMenu';


interface HeadersProps {
  title?: string;
  user: any;
  reloadHome?:any;
  selectedTab?:any;
  setHeightUpdate?:any;
  setSelectedTab?:any;
}



const Headers = ({setHeightUpdate,selectedTab, title,user, reloadHome,setSelectedTab}: HeadersProps) => {
const history= useHistory()
const [menuState, setMenuState] = useState(false);

  

  
async function openFirstMenu() {
  setMenuState(!menuState);
}
useEffect(()=>{

  if(!menuState){
    setHeightUpdate(false)
  }else{
    setHeightUpdate(true)
  }
},[menuState])
console.log("Menusate: ", menuState)
  return (
    <>
    {
      menuState &&(
        <SideMenu setSelectedTab={setSelectedTab} menuState={menuState}  setMenuState={setMenuState} />
      )
    }
    
    {selectedTab !== "my-pets" ?<IonHeader>
      <IonToolbar>
        {selectedTab !== "my-pets" &&
        <><IonButtons onClick={() => {
          reloadHome()
           }}   slot='start'>
          <IonIcon src={getImageByName("homeLogo")} className="h-12 w-9 mt-[34px] ml-4 transition-transform duration-150 ease-in-out active:scale-95 touch-none" />
        </IonButtons>


        <div className="flex-grow flex justify-center">
          <IonImg src={getImageByName('logoPng')} className="h-12 w-32 mt-[34px]" />
        </div></>}

        <IonButtons id="main" onClick={() => {openFirstMenu()}}   slot='end'>
          <IonIcon  src={MenuIcon} className="h-6 w-6 pt-[50px] mr-4 transition-transform duration-150 ease-in-out active:scale-95 touch-none" />
        </IonButtons>

      </IonToolbar>
    </IonHeader>
      :
      <IonButtons id="main" onClick={() => {openFirstMenu()}} className='flex justify-end'>
          <IonIcon  src={MenuIcon} className="z-50 h-6 w-6 pt-[35px] mb-5 mr-5 transition-transform duration-150 ease-in-out active:scale-95 touch-none" />
      </IonButtons>}

    </>
  );
};

export default Headers;