import { IonCardContent, IonText } from "@ionic/react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import React from "react";

const containerStyle = {
  width: "100%",
  height: "120px",
};

interface MapComponentProps {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  item: {
    doctor?: {
      first_name?: string;
      last_name?: string;
    };
  };
}

const MapComponent: React.FC<MapComponentProps> = ({
  startLat,
  startLng,
  endLat,
  endLng,
  item,
}) => {
  const pos = { lat: endLat || 0, lng: endLng || 0 };
  const center = pos;
  console.log("pos:", pos)

  return (
    <IonCardContent className="p-0 m-0 h-[120px] relative">
      {(pos.lat != 0 && pos.lng != 0) ? <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12} options={{
        fullscreenControl: false, 
      }}>
        <Marker
          key={`marker-${Date.now()}`}
          position={pos}
          title={`Dr. ${item?.doctor?.first_name} ${item?.doctor?.last_name}`}
          aria-label="Doctor location"
        />
      </GoogleMap>: <div className="font-segoe font-bold text-black p-5">Doctor's Location is not available !</div>}
      <div className="absolute bottom-0 left-0 w-full bg-customBlueLite bg-opacity-50 text-white p-2 flex justify-between items-center">
        <IonText
          style={{ fontFamily: "Open Sans" }}
          className="text-[12px] font-bold"
        >
          Dr. {item?.doctor?.first_name} {item?.doctor?.last_name} -{" "}
          <span className="text-[12px] font-normal">
            Services to be provided at Clinic
          </span>
        </IonText>
      </div>
    </IonCardContent>
  );
};

export default MapComponent;
