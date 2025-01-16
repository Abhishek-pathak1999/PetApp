import { useEffect, useRef, useState } from "react";
import { IonPage, IonImg, IonText, IonButton, IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonTextarea, IonFooter, IonInput, IonSpinner, IonAvatar } from "@ionic/react";
import { IonIcon } from '@ionic/react';
import { chatbubbleOutline, thumbsUpOutline, sendSharp, expand, resizeOutline, thumbsUp } from 'ionicons/icons';
import SampleVideo1 from "../assets/exampleVideo.mp4";
import SampleVideo2 from "../assets/SampleVideo2.mp4";
import SampleVideo3 from "../assets/SampleVideo3.mp4";
import SampleVideo4 from "../assets/SampleVideo3.mp4";
import { getImageByName } from "../utils/imagesUtil";
import { getVideoComment, getVideoLike, getVideos, postVideoComment, postVideoLike } from "../service/services";
import moment from "moment";

const Videos = () => {
  const [videoSrc, setVideoSrc] = useState<any>({url: "", id:""});
  const [currentVideo, setCurrentVideo] = useState(0);
  const [likeMethod, setLikeMethod] = useState<any>({method: false , id:""})
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMute, setIsMute] = useState(true);
  const [allVideo, setAllVideo] = useState<any>({education: [], petCare:[]})
  const [isExpand, setIsExpand] = useState(false);
  const [likeComment, setLikeComment] = useState<any>({"like": 0, "comment":0, likeData: [], commentData: [], userLike:0});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState<any>(false)
  const videos = [SampleVideo2, SampleVideo1, SampleVideo2,SampleVideo1, SampleVideo3, SampleVideo4, SampleVideo1];

  useEffect(()=>{
    petCareVideo();
    educationVideo();
  },[])

  const handleVideoClick = (videoData: any) => {
    setVideoSrc({url: videoData?.video_base_url, id: videoData?._id}); 
    // setCurrentVideo(index);
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying); // Toggle play/pause state
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMute; // Mute or unmute the video
      setIsMute(!isMute); // Toggle mute/unmute state
    }
  };

  const handleExpandToggle = () => {
    if (!document.fullscreenElement) {
      // Enter full screen
      if (videoRef.current?.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
      setIsExpand(true);
    } else {
      // Exit full screen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsExpand(false);
    }
  };

  // const handleExpandToggle = () => {
  //   if (!document.fullscreenElement && containerRef.current) {
  //     containerRef.current.requestFullscreen();
  //   } else if (document.fullscreenElement) {
  //     document.exitFullscreen();
  //   }
  // };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(()=>{
    if(videoSrc.id && videoSrc.id !== ""){
      videoComment(videoSrc.id)
      videoLike(videoSrc.id)
    }
  },[videoSrc.id])

  async function videoComment(id:any){
    try{
      const response = await getVideoComment(id)
      if(response?.isSuccess){
        setLikeComment((prevState : any) => ({
          ...prevState,
          comment: response?.result?.length || 0,
          commentData: response?.result || []
        }));
      }
    }catch(e){
      console.log(e)
    }
  }
  console.log("DataIn comment: ", likeComment)

  async function videoLike(id:any){
    try{
      const response = await getVideoLike(id)
      if(response?.isSuccess){
        setLikeComment((prevState : any) => ({
          ...prevState,
          like: response?.result || 0,
          userLike: response?.userLike
        }));
      }
    }catch(e){
      console.log(e)
    }
  }

  async function educationVideo(){
    try{
      const response = await getVideos("Education")
      if(response?.isSuccess){
        setAllVideo((prev : any) => ({ ...prev, education: response.result }));
        setVideoSrc({url: response.result[0].video_base_url, id: response.result[0]._id})
        setIsLoadingVideo(true)
      }
    }catch(e){
      console.log(e)
    }
  }

  async function petCareVideo(){
    try{
      const response = await getVideos("PetCare")
      if(response?.isSuccess){
        setAllVideo((prev : any) => ({ ...prev, petCare: response.result }));
      }
    }catch(e){
      console.log(e)
    }
  }
  
  async function handleSendComment(){
    if (comment.trim()) {
      console.log("Sending comment:", comment);
      try{
        const response = await postVideoComment(videoSrc.id, comment)
        if(response?.isSuccess){
          videoComment(videoSrc.id)
          setComment("");
        }
      }catch(e){
        console.log(e)
      }
    } else {
      console.log("Comment is empty");
    }
  }

  async function handleLikeButton(){
    setLikeMethod((prevState : any) => ({
      ...prevState,
      method: !likeMethod.method,
    }));
  }

  useEffect(()=>{
    if(likeMethod && likeMethod.method !== ""){
      async function handleSendLike(){
        try{
  
          const response : any = await postVideoLike(videoSrc.id)
          if(response?.isSuccess){
            videoLike(videoSrc.id)
          }
        }catch(e){
          console.log(e)
        }
    }
    handleSendLike();
    }
  },[likeMethod])
  
  

  console.log("petcaer: ", allVideo.petCare)
  console.log("education: ", videoSrc)

  return (
    <IonPage className="bg-[#fff] h-[715px]">
      {videoSrc?.url ? <div className="flex flex-col justify-around h-full items-center overflow-y-auto">
        {/* <div className="fixed top-0  w-full flex flex-col items-center bg-white">
          <video
            ref={videoRef}
            style={{
              width: "100%",
              height: "290px",
              maxHeight: "400px",
              objectFit: "cover",
            }}
            controls={false}
            src={videoSrc}
            // autoPlay
          />
          <div className="absolute top-3 right-2">
            {<IonIcon className="text-[22px]" src={expand} onClick={()=>handleExpandToggle()} style={{ cursor: "pointer", color:"#fff" }}/>
            // : <IonIcon src={resizeOutline} className="text-[22px]" onClick={()=>handleExpandToggle()} style={{ cursor: "pointer", color:"#fff" }}/>
            }
          </div>
          <div className="absolute bottom-12 right-2">
            {isMute ? <img src={getImageByName("voice")} onClick={()=>handleMuteToggle()} style={{ cursor: "pointer" }}/>
            : <img src={getImageByName("mute")} onClick={()=>handleMuteToggle()} style={{ cursor: "pointer" }}/>
            }
          </div>
          <div className="absolute bottom-0 left-0 w-full flex justify-around items-center" style={{backgroundColor:"rgba(69, 69, 69, 0.70)"}}>
            <div className="flex justify-around items-center">
              <p className="text-white">{likeComment?.like}</p>
              <img src={getImageByName("goodQuality")} style={{ cursor: "pointer" }}/>
            </div>
            <div className="flex justify-around items-center">
              <p className="text-white">{likeComment?.comment}</p>
              <img onClick={() => setIsModalOpen(!isModalOpen)} src={getImageByName("comment")} style={{ cursor: "pointer" }}/>
            </div>
            {isPlaying ? <img onClick={handlePlayPause} className="pr-3" src={getImageByName("circlePlay")} style={{ cursor: "pointer" }} />
             :<img onClick={handlePlayPause} className="pr-3 text-[55px]" src={getImageByName("stopCircle")} style={{ cursor: "pointer" }}/>
            }
            <div className="flex">
              <p className="text-[#fff] text-[13px] font-openSans">Watch on <br/>Instagram</p>
              <img src={getImageByName("insta")} />
            </div>
          </div>
        </div> */}
        <div ref={containerRef} className="fixed top-0 w-full flex flex-col items-center bg-white">
        {isLoadingVideo && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10, // Ensures the loader appears on top of the video
          }}
        >
          <IonSpinner name="crescent" />
        </div>
      )}
      {videoSrc?.url ? <video
        ref={videoRef}
        style={{
          width: "100%",
          height: isFullscreen? "100vh" : "290px",
          // maxHeight: "400px",
          objectFit: "cover",
        }}
        controls={false}
        src={videoSrc?.url}
        onWaiting={() => setIsLoadingVideo(true)}
        onCanPlay={() => setIsLoadingVideo(false)}
        onLoadedData={() => setIsLoadingVideo(false)}
        onPlay={() => setIsPlaying(true)} // Optional: Handles when video starts playing
        onPause={() => setIsPlaying(false)}
      />:
      <div> No Video Available !</div>}

      {/* Full-screen toggle icon */}
      {!isFullscreen ? <><div className="absolute top-3 right-2">
        <IonIcon
          icon={!isFullscreen ? resizeOutline : expand}
          onClick={handleExpandToggle}
          style={{ cursor: "pointer", color: "#fff" }}
          className="text-[22px]"
        />
      </div>

      {/* Mute/Unmute control */}
      <div className="absolute bottom-12 right-2">
        <img
          src={getImageByName(isMute ? "voice" : "mute")}
          onClick={handleMuteToggle}
          style={{ cursor: "pointer" }}
        />
      </div>

      {/* Custom video controls */}
      <div className="absolute bottom-0 left-0 w-full flex justify-around items-center" style={{ backgroundColor: "rgba(69, 69, 69, 0.70)" }}>
        <div className="flex justify-around items-center">
          <p className="text-white">{likeComment?.like}</p>
          {/* <img onClick={()=> handleLikeButton()} src={getImageByName("goodQuality")} style={{ cursor: "pointer" }} /> */}
          <IonIcon className="h-6 w-6 pl-1" onClick={()=> handleLikeButton()} style={{color: likeComment.userLike == 0 ? "#fff" : "#24a0ed"}} src={thumbsUp}/>
        </div>
        <div className="flex justify-around items-center">
          <p className="text-white">{likeComment?.comment}</p>
          <img onClick={() => setIsModalOpen(!isModalOpen)} src={getImageByName("comment")} style={{ cursor: "pointer" }} />
        </div>
        {/* Play/Pause Control */}
        <img
          onClick={handlePlayPause}
          className="pr-3"
          src={getImageByName(isPlaying ? "stopCircle" : "circlePlay")}
          style={{ cursor: "pointer" }}
        />
        <div className="flex">
          <p className="text-[#fff] text-[13px] font-openSans">Watch on <br />Instagram</p>
          <img src={getImageByName("insta")} />
        </div>
      </div></> : 
      <><div className="absolute top-3 right-2">
      <IonIcon
        icon={!isFullscreen ? resizeOutline : expand}
        onClick={handleExpandToggle}
        style={{ cursor: "pointer", color: "#fff" }}
        className="text-[22px]"
      />
    </div>

    {/* Mute/Unmute control */}
    <div className="absolute bottom-12 right-2">
      <img
        src={getImageByName(isMute ? "voice" : "mute")}
        onClick={handleMuteToggle}
        style={{ cursor: "pointer" }}
      />
    </div>

    {/* Custom video controls */}
    <div className="absolute bottom-0 left-0 w-full flex justify-around items-center" style={{ backgroundColor: "rgba(69, 69, 69, 0.70)" }}>
      {/* <div className="flex justify-around items-center">
        <p className="text-white">{likeComment?.like}</p>
        <img src={getImageByName("goodQuality")} style={{ cursor: "pointer" }} />
      </div>
      <div className="flex justify-around items-center">
        <p className="text-white">{likeComment?.comment}</p>
        <img onClick={() => setIsModalOpen(!isModalOpen)} src={getImageByName("comment")} style={{ cursor: "pointer" }} />
      </div> */}
      {/* Play/Pause Control */}
      <img
        onClick={handlePlayPause}
        className="pr-3"
        src={getImageByName(!isPlaying ? "stopCircle" : "circlePlay")}
        style={{ cursor: "pointer" }}
      />
      {/* <div className="flex">
        <p className="text-[#fff] text-[13px] font-openSans">Watch on <br />Instagram</p>
        <img src={getImageByName("insta")} />
      </div> */}
    </div>
     </> }
    </div>
        <div className="flex-grow w-full pt-[290px]">
          <div className="mt-4 w-full h-[full] flex flex-col items-center">
            <div className="flex flex-row w-full items-center">
              <h2 className="text-lg font-bold mb-0 ml-2 flex-grow-0">App Uses Videos →</h2>
              <div className="flex-grow ml-2 mb-0.5" style={{ borderTop: "0.25px solid #1340B2", height: 0 }}></div>
            </div>

            <div className="w-full overflow-x-auto">
              <div className="flex flex-nowrap gap-3 p-2">
                {allVideo?.education && allVideo?.education.map((video:any, index:number) => (
                  <button
                    key={index}
                    className={`cursor-pointer flex-none w-[22%] max-w-[200px] rounded-lg relative`} // Added relative positioning here
                    onClick={() => handleVideoClick(video)}
                  >
                    <img
                      className="pr-3 absolute top-1 -right-2 h-[20px]"
                      src={getImageByName(videoSrc?.id== video?._id ? "stopCircle" : "circlePlay")}
                      style={{ cursor: "pointer" }}
                    />
                    <img
                      className="w-full h-[90px] rounded-lg"
                      src={getImageByName("sampleThumb")} 
                      style={{ objectFit: "cover" }}
                      
                    />
                    <IonText style={{fontFamily:"Open Sans", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px",}} className="pt-0 absolute bottom-0 left-0 w-full h-[30px] text-center bg-black bg-opacity-50 text-white text-xxs py-1">
                      {video?.title ? video?.title : "Dr. Keith’s welcome note"}
                    </IonText>
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="mt-4 w-full h-[full] flex flex-col items-center">
            <div className="flex flex-row w-full items-center">
              <h2 className="text-lg font-bold mb-0 ml-2 flex-grow-0">Pet Care Videos →</h2>
              <div className="flex-grow ml-2" style={{ borderTop: "0.25px solid #1340B2", height: 0 }}></div>
            </div>
            <div className="w-full overflow-x-auto">
              <div className="flex flex-nowrap gap-3 p-2">
                {allVideo?.petCare && allVideo?.petCare.map((video:any, index:number) => (
                  <button
                    key={index}
                    className={`cursor-pointer flex-none w-[22%] max-w-[200px] rounded-lg relative`} // Added relative positioning here
                    onClick={() => handleVideoClick(index)}
                  >
                    <img
                      className="pr-3 absolute top-1 -right-2 h-[20px]"
                      src={getImageByName(videoSrc?.id== video?._id ? "stopCircle" : "circlePlay")}
                      style={{ cursor: "pointer" }}
                    />
                    <img
                      className="w-full h-[90px] rounded-lg"
                      src={getImageByName("sampleThumb")} 
                      style={{ objectFit: "cover" }}
                      
                    />
                    <IonText style={{fontFamily:"Open Sans", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px",}} className="pt-0 absolute bottom-0 left-0 w-full h-[30px] text-center bg-black bg-opacity-50 text-white text-xxs py-1">
                      {video?.title ? video?.title : "Title is not available"}
                    </IonText>
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* <div className="mt-4 w-full h-[full] flex flex-col items-center">
            <div className="flex flex-row w-full items-center">
              <h2 className="text-lg font-bold mb-0 ml-2 flex-grow-0">Playtime Videos →</h2>
              <div className="flex-grow ml-2 mb-0.5" style={{ borderTop: "0.25px solid #1340B2", height: 0 }}></div>
            </div>

            <div className="w-full overflow-x-auto">
              <div className="flex flex-nowrap gap-3 p-2">
                {videos.map((video, index) => (
                  <button
                    key={index}
                    className={`cursor-pointer flex-none w-[22%] max-w-[200px] rounded-lg relative`} // Added relative positioning here
                    onClick={() => handleVideoClick(index)}
                  >
                    <img
                      className="pr-3 absolute top-1 -right-2 h-[20px]"
                      src={getImageByName(isPlaying ? "stopCircle" : "circlePlay")}
                      style={{ cursor: "pointer" }}
                    />
                    <video
                      className="w-full h-[90px] rounded-lg"
                      src={""}
                      muted
                      style={{ objectFit: "cover" }}
                      
                    />
                    <IonText style={{fontFamily:"Open Sans", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px",}} className="pt-0 absolute bottom-0 left-0 w-full h-[30px] text-center bg-black bg-opacity-50 text-white text-xxs py-1">
                      Raw Feeding Benefits
                    </IonText>
                  </button>
                ))}
              </div>
            </div>
          </div> */}
        </div>
        
      </div>: <div className="m-7 text-black font-semibold font-openSans">No video Available!</div>}
      {isModalOpen && <IonModal
        isOpen={isModalOpen}
        onDidDismiss={() => setIsModalOpen(false)}
        className="modal-custom"
      >
        <div >
          <div className="w-full bg-[#F7FAFA]">
            <div className="p-3" style={{ fontFamily: "Open Sans", color: "#000", fontWeight: 900 }}>
              Comments
            </div>
            {/* <IonButton slot="end" className="mr-3" onClick={() => setIsModalOpen(false)}>
              Close
            </IonButton> */}
            <div className="w-full" style={{borderTop:"1px solid rgba(0, 0, 0, 0.35)"}}>

            </div>
          </div>
        </div>
        <IonContent className="ion-padding">
          <div className="h-[260px] bg-[#F7FAFA] max-h-[260px] overflow-y-auto">
          {likeComment?.commentData && likeComment?.commentData.map((item: any, index: number) => (
            <div key={index} className="w-full">
              <div className="flex flex-row justify-between items-center mx-5 h-[75px]">
                <IonAvatar>
                  <IonImg src={item?.user?.parent?.image_base_url ||getImageByName("genricMenImage")} className="h-[45px] w-[45px] rounded-full" />
                </IonAvatar>
                <div className="relative items-center pl-3 w-[85%]">
                  <div
                    style={{ fontFamily: "Open Sans" }}
                    className="text-[11px] pl-0 flex-grow h-auto"
                  >
                    {item?.comment}
                  </div>
                  <div className="absolute w-full -top-5 left-0 flex justify-between mx-2">
                    <div className="text-[12px] font-semibold">{item?.user?.parent?.full_name}</div>
                    <div className="text-[10px]">{moment(item?.date).format("DD-MM-YYYY")}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
          <div className="w-full mt-0.5" style={{border:"0.5px solid rgba(0, 0, 0, 0.29)"}}>
            <div className="flex flex-row justify-between items-center mx-5 h-[75px]" >
              <IonAvatar className="mt-5">
                <IonImg src={getImageByName("genricMenImage")} className="h-[45px] w-[45px] rounded-full" />
              </IonAvatar>
              <div className="relative items-center pl-3 w-full">
                <IonTextarea
                  style={{ fontFamily: "Open Sans" }}
                  className="pl-4 pr-6 flex-grow h-[40px] bg-[#D9D9D980]"
                  placeholder="Add a comment..."
                  value={comment} // Bind the state to the textarea
                  onIonInput={(e) => setComment(e.detail.value!)}
                >
                </IonTextarea>
                <IonIcon onClick={handleSendComment} className="absolute bottom-3 right-2 text-[20px] z-40" src={sendSharp} />
              </div>
            </div>
          </div>
        </IonContent>
      </IonModal>}


      <style>{`
        .modal-custom {
          --height: calc(100vh - 440px);
          --margin-top: 440px;
          position: absolute;
          top: var(--margin-top);
          height: var(--height);
          width: 100%;
        }
        @media (max-width: 768px) {
          .modal-custom {
            --height: calc(100vh - 340px);
            --margin-top: 340px;
          }
        }
        @media (max-width: 480px) {
          .modal-custom {
            --height: calc(100vh - 290px);
            --margin-top: 290px;
          }
        }
      `}</style>
      {/* <style>{`
        .modal-custom {
          --height: calc(100vh - 400px);
          --margin-top: 400px;
          position: absolute;
          top: var(--margin-top);
          height: var(--height);
          width: 100%;
        }
        @media (max-width: 768px) {
          .modal-custom {
            --height: calc(100vh - 300px);
            --margin-top: 300px;
          }
        }
        @media (max-width: 480px) {
          .modal-custom {
            --height: calc(100vh - 250px);
            --margin-top: 250px;
          }
        }
      `}</style> */}
    </IonPage>
  );
};

export default Videos;
