import { IonAvatar, IonImg } from "@ionic/react";
import { useEffect, useState } from "react";
import { getImageByName } from "../../utils/imagesUtil";
import { classNames } from "react-easy-crop/helpers";
import Pet1 from "../../assets/pet1.png";
import { useHistory } from "react-router";
import moment from "moment";
import { getWidthInPercentage } from "../../utils/widthUtil";
import Pet2 from "../../assets/Rectangle 121.png"

const ParentpetData = ({setSelectedTab, allPetsData, parentData}:any) => {
  const history = useHistory();
  const handleProfileClick = () => {
    
    history.push("/editUserProfile");
    setTimeout(()=>{
      setSelectedTab("inPetDetails")
    },400)
  };
  return (
    <div className="bg-white h-[270px] w-full mt-3" style={{borderBottom:"1px solid rgba(68, 96, 169, 0.60)"}}>
        <div className="flex flex-row justify-between items-center h-[60px] w-full px-2">
            <div>
                <img src={getImageByName('logoPng')} className="h-full w-[130px]"/>
            </div>
            <div className="flex flex-row justify-center items-center">
                <p className="text-[#2B369D] font-segoe text-xxs font-semibold ">{parentData?.result?.full_name}</p>
                <IonAvatar onClick={() => handleProfileClick()} className="flex justify-center items-center transition-transform duration-150 ease-in-out active:scale-95">
                    {/* <img src={getImageByName('genricMenImage')} className="h-[45px] w-[45px]" /> */}
                    <img
                    src={parentData?.result?.image_base_url}
                    className="h-[45px] w-[45px]"
                    onError={(e:any) => {
                        e.currentTarget.src = getImageByName("genricMenImage");
                    }}
                  />
                </IonAvatar>
            </div>
        </div>
        <div className="max-w-full h-[160px] overflow-x-auto flex flex-row space-x-[7px] mx-2 mt-3">
        {allPetsData?.result?.map((pet:any) => (
            <div
            key={pet?.pet?._id}
              onClick={() => {
                history.push("/dashboard/my-pets/details", {
                  id: pet?.pet?._id,
                  url: pet?.pet?.image_base_url,
                  allData: allPetsData,
                });
                setSelectedTab("inPetDetails")
              }}
            className="h-[155px] w-[100px] flex flex-col justify-center items-center shrink-0 transition-transform duration-150 ease-in-out active:scale-95"
            style={{
                border: "1px solid rgba(102, 176, 172, 0.40)",
                borderRadius: "10px",
                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
            >
            <div className="w-full flex justify-center items-center">
                <p className="font-openSans text-[11px] font-semibold">{pet?.pet?.pet_name}</p>
            </div>
            <div
                className="w-full h-[97px] flex justify-center items-center"
                style={{ border: "1px solid rgba(102, 176, 172, 0.40)" }}
            >
                {/* <img src={pet.imageSrc} className="h-full w-full" alt={pet?.pet?.pet_name} /> */}

                <img
                  src={pet?.pet?.image_base_url || getImageByName(pet?.pet?.animal_type === "Cat" ? "catfree" : pet?.pet?.animal_type === "Dog" ? "dogfree" : "otherfree")}
                  
                  onError={(e: any) => {
                    // Check animal type for default image if the image fails to load
                    if (pet?.pet?.animal_type === "Cat") {
                      e.currentTarget.src = getImageByName("catfree");
                    } else if (pet?.pet?.animal_type === "Dog") {
                      e.currentTarget.src = getImageByName("dogfree");
                    } else {
                      e.currentTarget.src = getImageByName("otherfree");
                    }
                  }}
                  className="h-full w-full"
                />
                    
                    {/* <img
                      src={pet?.pet?.image_base_url}
                      alt=""
                      onError={(e:any) => {
                        if(pet?.animal_type == "Cat"){
                        e.currentTarget.src = Pet1;
                      }else if(pet?.animal_type == "Dog"){
                        e.currentTarget.src = Pet2;
                      }else{
                        e.currentTarget.src = getImageByName("otherPam")
                      }}}
                      className="h-full w-full"
                    /> */}
                  
            </div>
            <div className="w-full flex flex-col justify-center items-center">
                <p className="font-openSans text-[10px] font-semibold">Last Vet Visit</p>
                <p className="font-openSans text-[10px] font-bold">{pet?.lastVisit ? moment(pet?.lastVisit).format("DD-MMM-YYYY") : "TND"}</p>
            </div>
            </div>
        ))}
        </div>
        <div className="w-full flex flex-col justify-center items-center">
            <p className="font-segoe text-[10px] font-bold text-[#2B369D] p-2">Please select your pet(s) and update some basic information</p>
        </div>
    </div>
  );
};

export default ParentpetData;
