import React, { useEffect, useRef, useState } from "react";
import { IonModal, IonButton, IonList, IonItem, IonLabel, IonContent } from "@ionic/react";

const BrandSelector = ({setIsModalOpen, brands, handleBrandSelect, isModalOpen}: any) => {

    const popupRef = useRef<HTMLDivElement | null>(null);
    // Close popup if clicked outside
    useEffect(() => {
      const handleClickOutside = (event:any) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
          setIsModalOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isModalOpen]);
  
    return (
      <>
        {isModalOpen && (
          <div
            ref={popupRef}
            className="absolute bg-white z-40 w-[150px] border border-gray shadow-lg rounded-md p-2 h-[200px] max-h-[190px] overflow-y-auto"
            style={{ top: "30px", left: "-110px" }} // Adjust position as needed
          >
            {brands.map((brand: any, index: number) => (
              <div
                key={index}
                className="p-2 mb-2 cursor-pointer border-b border-[green] last:border-0"
                onClick={() => handleBrandSelect(brand)}
              >
                {brand.name}
              </div>
            ))}
          </div>
        )}
      </>
    );
};

export default BrandSelector;
