import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonImg,
  IonLoading,
  IonPage,
  IonText,
  IonRefresher, 
  IonRefresherContent, 
  RefresherEventDetail,
  useIonViewDidEnter,
  useIonViewDidLeave,
  useIonViewWillLeave
} from "@ionic/react";
import { Preferences } from "@capacitor/preferences";
import {
  getWidthInPercentage,
  getTopInPercentage,
  getHeightInPercentage,
} from "../utils/widthUtil";
import { API_BASE_URL } from "../config";
import { useHistory, useLocation } from "react-router";
import Pet1 from "../assets/pet1.png";
import Pet2 from "../assets/Rectangle 121.png"
import { getImageByName } from "../utils/imagesUtil";
import { handleGetAllPets, handleGetParentData } from "../service/services";
import moment from "moment";
import VideoSlider from "./home/VideoSlide";
import Headers from "../components/Headers";
import ParentpetData from "./home/ParentpetData";


const MyPets = ({setSelectedTab, setHeightUpdate, heightUpdate, user, selectedTab}:any) => {
  const history = useHistory();
  const location = useLocation();
  const prompt = location?.state;
  console.log("rec: ", prompt)
  const [token, setToken] = useState<null | string>(null);
  
  useEffect(() => {
    (async () => {
      const tokenValue = await Preferences.get({ key: "token" });
      setToken(tokenValue.value!);
    })();
  }, []);

  const { data: allPetsData, isLoading } = useQuery(
    ["allPets", token, prompt],
    {
      queryFn: () => handleGetAllPets(token),
      retry: 3,
      enabled: !!token,
      // refetchOnWindowFocus: "always"
    }
  );

  const { data: parentData } = useQuery([prompt], {
    queryFn: () => handleGetParentData(token),
    retry: 3,
    enabled: !!token,
    // refetchOnWindowFocus: "always"
  });

  console.log("Data Of Parent: ", parentData);

  if (isLoading) {
    return <IonLoading isOpen={isLoading} />;
  }

  console.log("data pet: ", allPetsData);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    handleGetAllPets(token).finally(() => {
      // Complete the refresh operation after fetching data
      event.detail.complete();
    });
  };

  // const parentDetails = allPetsData?.result?.[0]?.parent;

  return (
    <IonPage>
      <IonContent
      scrollY={false}
        className="bgcolor"  
        style={{
          width: getWidthInPercentage(360),
          height: "800px",
          fontFamily: "Open Sans",
        }}
      >
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent
          pullingIcon="arrow-down-circle-outline"
          pullingText="Pull to refresh"
          refreshingSpinner="circles"
          refreshingText="Refreshing..."
        />
      </IonRefresher>
        {/* <IonText className=" font-segoe flex text-center justify-center text-[#3720BE] font-bold text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl mt-[5%] mb-1 px-4">
          Please select your pet(s) and update some basic information
        </IonText>

        <div className="overflow-y-auto h-[38vh]">
          {allPetsData?.result?.map((pet: any) => (
            <IonCard
              className="shadow-3xl w-[78.33vw] max-w-md h-[10.5vh] mx-auto rounded-xl flex items-center transition-transform duration-150 ease-in-out active:scale-95 touch-none"
              key={pet?.pet?._id}
              onClick={() => {
                history.push("/dashboard/my-pets/details", {
                  id: pet?.pet?._id,
                  url: pet?.pet?.image_base_url,
                  allData: allPetsData,
                });
              }}
            >
             
                  {pet?.pet?.image_base_url ? (
                    <img
                      src={pet?.pet?.image_base_url}
                      alt=""
                      className="h-full overflow-hidden"
                      onError={(e) => {
                        if(pet?.animal_type == "Cat"){
                        e.currentTarget.src = Pet1;
                      }else{
                        e.currentTarget.src = Pet2;
                      }}}
                      style={{ width: getWidthInPercentage(100) }}
                    />
                  ) : (
                    <IonImg
                      src={Pet1}
                      className="h-full overflow-hidden"
                      style={{ width: getWidthInPercentage(100) }}
                    /> 
                  )}

                  <div className="flex flex-col ml-4 w-[62%]">
                    <IonText
                      className="font-bold mb-3 text-[#000] text-[0.875rem] capitalize"
                      style={{ fontFamily: "Open Sans" }}
                    >
                      {pet?.pet?.pet_name}
                    </IonText>
                    <div className="border border-[#BCC4DA] w-full"></div>
                    <IonText
                      className="text-[0.875rem] text-[#000] font-openSans"
                      style={{ fontFamily: "Open Sans" }}
                    >
                      <span className="font-semibold ">Last Vet Visit- </span>
                      <span className="font-normal text-[13px]">
                        {pet?.lastVisit ? moment(pet?.lastVisit).format("DD-MMM-YYYY") : "TND"}
                      </span>
                    </IonText>
                  </div>
               
              
            </IonCard>
          ))}
        </div>

        <div className="bg-white rounded-t-[60px]  h-[28vh] w-full items-center flex flex-col justify-center  bottom-0 fixed">
          <IonText
            className=" flex text-center justify-center text-[#3720BE] font-extrabold text-[15px] -mt-18"
            style={{ fontFamily: "Open Sans" }}
          >
            Please provide some basic information
            <br /> about yourself
          </IonText>

          <div className="relative flex justify-center items-center">
            <IonImg
              src={getImageByName("yellowCat")}
              className="h-24  z-10 -right-1 -mt-32 absolute "
            />
            <IonCard
              className="w-full max-w-lg "
              style={{
                borderRadius: "10px",
                border: "1px solid rgba(102, 176, 172, 0.40)",
                background: "#FFF",
                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
            >
              <IonCardContent
                onClick={() => history.push("/editUserProfile")}
                className="overflow-y-auto w-[78.33vw]"
              >
                <div className="flex justify-around items-center w-full transition-transform duration-150 ease-in-out active:scale-95 touch-none">
                  <img
                    src={parentData?.result?.image_base_url}
                    className="w-[65px] h-[65px] rounded-full cover"
                    onError={(e:any) => {
                        e.currentTarget.src = getImageByName("genricMenImage");
                    }}
                  />
                  <div
                    className="flex flex-col ml-2 w-full"
                    style={{ fontFamily: "Open Sans" }}
                  >
                    <IonText className="font-bold mb-3 text-[#000] text-[0.875rem] ml-2">
                      {parentData?.result?.full_name}
                    </IonText>
                    <div className="border border-[#BCC4DA] w-full"></div>
                    <IonText className=" text-[0.875rem] font-openSans text-[#000]">
                      <span className=" font-semibold">Last Vet Visit - </span>
                      <span className="font-normal text-[13px]">{parentData?.lastVisit ? moment(parentData?.lastVisit).format("DD-MMM-YYYY") : "TND"}</span>
                    </IonText>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        </div> */}
        <div className={`relative h-1/2 w-full bg-[#ECF2FF] mt-5`}>
          <div className={`absolute top-0 z-20 right-0 ${heightUpdate ? "h-full w-full" : 'h-auto'}`}>
            <Headers setSelectedTab={setSelectedTab} setHeightUpdate={setHeightUpdate} user={user} selectedTab={selectedTab}/>
          </div>
          {/* <VideoSlider /> */}
        </div>
        <div className="h-1/2 w-full mt-3">
          <ParentpetData  setSelectedTab={setSelectedTab} allPetsData={allPetsData} parentData={parentData}/>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MyPets;
