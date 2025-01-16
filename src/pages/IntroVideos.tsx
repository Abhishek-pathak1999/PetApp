import { IonButton, IonPage, IonRippleEffect, IonText } from "@ionic/react";
import SampleVideo1 from "../assets/exampleVideo.mp4";
import SampleVideo2 from "../assets/SampleVideo2.mp4";
import SampleVideo3 from "../assets/SampleVideo3.mp4";
import { useState } from "react";
import { useHistory } from "react-router";

interface VideoItemProps {
  title: string;
  handleClick: () => void;
  ml?: string;
}

const VideoItem = ({ title, handleClick, ml }: VideoItemProps) => (
  <div className="w-[100px]" style={{ marginLeft: ml ?? 0 }}>
    <div
      onClick={handleClick}
      style={{ borderTopLeftRadius: "15px", borderTopRightRadius: "15px" }}
      className="bg-black overflow-hidden ion-activatable relative flex items-center justify-center h-[100px]"
    >
      <IonText className="text-[#fff]">Play Icon </IonText>
      <IonRippleEffect></IonRippleEffect>
    </div>
    <div className="bg-[#fff] flex  items-center">
      <IonText className="text-[15px] text-center">{title}</IonText>
    </div>
  </div>
);

const IntroVideos = () => {
  const history = useHistory();
  const [videoSrc, setVideoSrc] = useState(SampleVideo1);

  return (
    <IonPage style={{ backgroundColor: "lightGray", padding: "0 30px 0 30px" }}>
      <div className="overflow-x-scroll">
        <div className="mt-[20px]">
          <div className="flex flex-col items-center">
            <IonText className="text-[16px] font-bold">
              Welcome Note from
            </IonText>
            <IonText className="text-[16px] font-bold">Dr.Keith</IonText>
          </div>
          <div className="w-[300px] h-[300px] mx-auto mt-[20px]">
            <video
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              controls
              src={videoSrc}
            />
          </div>
          <div className="mt-[80px] flex justify-center overflow-x-scroll">
            <div className="w-[100px] ">
              <VideoItem
                title="How to book home vaccine"
                handleClick={() => setVideoSrc(SampleVideo1)}
              />
            </div>
            <div className="w-[100px]">
              <VideoItem
                title="How to book home vaccine"
                handleClick={() => setVideoSrc(SampleVideo2)}
                ml={"20px"}
              />
            </div>
            <div className="w-[100px] ">
              <VideoItem
                title="How to book home vaccine"
                handleClick={() => setVideoSrc(SampleVideo3)}
                ml={"40px"}
              />
            </div>
          </div>
          <div className="flex flex-col items-center mt-[30px]">
            <IonText className="font-bold">
              Next up - How to use the app
            </IonText>
            <IonButton
              color="dark"
              className="mt-[20px] self-center normal-case w-[200px]"
              onClick={() => history.push("/profile")}
            >
              Watch Later
            </IonButton>
          </div>
        </div>
      </div>
    </IonPage>
  );
};

export default IntroVideos;
