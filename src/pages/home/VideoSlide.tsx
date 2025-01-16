import React, { useEffect, useRef, useState } from 'react';
import { IonContent, IonIcon, IonImg, IonLoading, IonSpinner } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { getImageByName } from '../../utils/imagesUtil';
import { pause, play } from 'ionicons/icons';
import { Pagination } from 'swiper/modules';
import { useQuery } from 'react-query';
import { getAllVideoForHome } from '../../service/services';
import vd from "../../assets/SampleVideo2.mp4"
const VideoSlider: React.FC = () => {
    const videoRefs = useRef<HTMLVideoElement[]>([]); // Array of video refs for all slides
    const [isPlaying, setIsPlaying] = useState<{ [key: number]: boolean }>({}); // Track play/pause state for each video
    const [isMute, setIsMute] = useState<{ [key: number]: boolean }>({});
    const [showVolumeSlider, setShowVolumeSlider] = useState(false); 
    const [volume, setVolume] = useState(0.5);
    const [isLoadingVideo, setIsLoadingVideo] = useState<boolean[]>([]);
    const [auto, setAuto] = useState<boolean>(true)
    
    const { data: allVideo, isLoading: isAllVideo } = useQuery(
        ["getAllVideo"],
        {
          queryFn: () =>{
            
            return getAllVideoForHome();
          }, 
        }
      );
console.log("AllVideo: ", allVideo)

    const setVideoLoading = (index: number, isLoading: boolean) => {
        setIsLoadingVideo((prev) => {
            const newLoadingState = [...prev];
            newLoadingState[index] = isLoading;
            return newLoadingState;
        });
    };
    useEffect(()=>{
        const timeout = setTimeout(() => {
            autoPlay(0);
        }, 100);
    
        return () => clearTimeout(timeout);
    
    },[])

    const autoPlay = (index: number) => {
        const video = videoRefs.current[index];
        console.log("here in auto play: ", video) 
        if (video) {
            if (isPlaying[index]) {
                video.pause();
                console.log("here in auto play111: ", isPlaying) 
            } else {
                video.play();
                console.log("here in auto play222: ", isPlaying) 
            }
            setIsPlaying((prev) => ({
                ...prev,
                [index]: !isPlaying[index], 
            }));
            video.muted = !isMute[index];
            setIsMute((prev) => ({
                ...prev,
                [index]: !isMute[index],
            }));
        }
    };

    const handlePlayPause = (index: number) => {
        const video = videoRefs.current[index];
        console.log("here in auto playyyyyyy: ", video) 
        if (video) {
            if (isPlaying[index]) {
                video.pause();
                console.log("here in auto play111: ", isPlaying) 
            } else {
                video.play();
                console.log("here in auto play222: ", isPlaying) 
            }
            setIsPlaying((prev) => ({
                ...prev,
                [index]: !isPlaying[index], 
            }));
        }
    };

    const handleMuteToggle = (index: number) => {
        const video = videoRefs.current[index];
        if (video) {
            video.muted = !isMute[index]; // Use isMute[index] to track each video's mute state
            setIsMute((prev) => ({
                ...prev,
                [index]: !isMute[index], // Toggle the mute state for the specific video
            }));
        }
    };
    

      const handleSlideChange = (swiper: any) => {
        setShowVolumeSlider(false)
        videoRefs.current.forEach((video, index) => {
            if (video) {
                video.pause(); 
                setIsPlaying((prev) => ({
                    ...prev,
                    [index]: false, 
                }));
            }
        });
    };

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(event.target.value);
        setVolume(newVolume); // Update the volume state
        // setIsLoadingVideo(true); 
    
        // Loop through all video references and apply the volume change
        videoRefs.current.forEach((video: HTMLVideoElement | null) => {
            if (video) {
                video.volume = newVolume; // Set the volume for each video element
            }
        });
    };
    

  return (
    <IonContent className='w-full h-full bgcolor'>

            <Swiper
                spaceBetween={20}
                slidesPerView={1}
                loop
                direction="horizontal"
                onSlideChange={handleSlideChange}
                modules={[Pagination]}
                pagination={{ 
                    clickable: true, 
                    // dynamicBullets: true
                }}
                className="custom-swiper"
            >
                <SwiperSlide>
                    <div className='relative'>
                        {isLoadingVideo[0] && (
                            <div
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: 10, // Ensures the loader appears on top of the video
                            }}
                            >
                            <IonSpinner name="crescent" className='h-14 w-14 text-white'/>
                            </div>
                        )}
                        <video
                            ref={(el) => (videoRefs.current[0] = el!)}
                            className="h-[44vh] w-full object-cover"
                            poster={getImageByName("posterVideo")}
                            loop
                            muted
                            onWaiting={() => setVideoLoading(0, true)}   // Set loading for video 0
                            onCanPlay={() => setVideoLoading(0, false)}  // Remove loader when ready
                            onLoadedData={() => setVideoLoading(0, false)}
                        >
                            <source src={getImageByName("homeVideo")} type="video/mp4" />
                            {/* <source src={vd} type="video/mp4" /> */}
                            Your browser does not support the video tag.
                        </video>
                        <div className="absolute bottom-9 right-4">
                            <div onClick={() => handlePlayPause(0)} className='h-[30px] w-[30px] mb-2 flex justify-center items-center transition-transform duration-150 ease-in-out active:bg-gray active:scale-95 ' style={{ cursor: "pointer", background: "rgba(78, 83, 156, 0.30)", borderRadius:"40px" }}>
                                <IonIcon
                                    
                                    className={`h-[20px] ${isPlaying[0] ? "" : "pl-[1px]"} font-extrabold text-white`}
                                    src={isPlaying[0] ? pause : play} // Dynamic play/pause icon
                                />
                            </div> 
                            <div onClick={() => handleMuteToggle(0)} className='h-[30px] w-[30px] mb-2 flex justify-center items-center transition-transform duration-150 ease-in-out active:bg-gray active:scale-95' style={{ cursor: "pointer", background: !isMute[0] ? "rgba(78, 83, 156, 0.30)" : "rgba(10, 138, 49, 0.30)", borderRadius:"40px" }}>
                                <img
                                
                                    className="h-[20px] font-extrabold text-white"
                                    src={getImageByName("mute")}
                                />
                            </div>
                            <div 
                                className='h-[30px] w-[30px] mb-2 flex justify-center items-center transition-transform duration-150 ease-in-out active:bg-gray active:scale-95 ' 
                                style={{ cursor: "pointer", background: !showVolumeSlider ? "rgba(78, 83, 156, 0.30)" : "rgba(10, 138, 49, 0.30)", borderRadius: "40px" }} 
                                onClick={() => setShowVolumeSlider(!showVolumeSlider)} // Toggle volume slider visibility
                            >
                                <img
                                    className="h-[20px] font-extrabold text-white"
                                    src={getImageByName("changeVoice")} 
                                />
                            </div>
                            {showVolumeSlider && (
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="absolute -top-20 -left-9 mt-2 w-[100px]" // Style as desired, e.g., set width
                                    style={{transform:"rotate(270deg)"}}
                                />
                            )}
                        </div>
                        <IonImg
                            src={getImageByName("yellowCat")}
                            className="h-[87px]  z-50 bottom-1 right-12 mb-1 absolute "
                        />
                        <div className='absolute bottom-0 left-0 z-30 w-full h-[36px] bg-[#37396C] flex flex-col justify-center items-center'>
                            <p className='text-white font-semibold text-[12px] font-segoe'>Welcome note from</p>
                            <p className='text-white text-[12px] font-segoe font-bold'>Doctor</p>
                        </div>
                    </div>
                </SwiperSlide>
              { allVideo && allVideo?.result?.length > 0 && allVideo?.result.slice(0, 3).map((item:any, index:number)=>(
                <SwiperSlide>
                    <div className='relative'>
                        {isLoadingVideo[index + 1] && (
                            <div
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: 10, // Ensures the loader appears on top of the video
                            }}
                            >
                            <IonSpinner name="crescent" className='h-14 w-14 text-white'/>
                            </div>
                        )}
                        <video
                            ref={(el) => (videoRefs.current[index+1] = el!)}
                            className="h-[44vh] w-full object-cover"
                            poster={item?.poster_base_url || getImageByName("posterVideo")}
                            loop
                            onWaiting={() => setVideoLoading(index+1, true)}   
                            onCanPlay={() => setVideoLoading(index+1, false)} 
                            onLoadedData={() => setVideoLoading(index+1, false)}
                        >
                            <source src={item?.video_base_url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <div className="absolute bottom-9 right-4">
                            <div onClick={() => handlePlayPause(index +1)} className='h-[30px] w-[30px] mb-2 flex justify-center items-center transition-transform duration-150 ease-in-out active:bg-gray active:scale-95' style={{ cursor: "pointer", background: "rgba(78, 83, 156, 0.30)", borderRadius:"40px" }}>
                                <IonIcon
                                     
                                    className={`h-[20px] ${isPlaying[index +1] ? "" : "pl-[1px]"} font-extrabold text-white`}
                                    src={isPlaying[index +1] ? pause : play} // Dynamic play/pause icon
                                />
                            </div> 
                            <div onClick={() => handleMuteToggle(index +1)} className='h-[30px] w-[30px] mb-2 flex justify-center items-center transition-transform duration-150 ease-in-out active:bg-gray active:scale-95' style={{ cursor: "pointer", background: !isMute[index+1] ? "rgba(78, 83, 156, 0.30)" : "rgba(10, 138, 49, 0.30)", borderRadius:"40px" }}>
                                <img
                                    
                                    className="h-[20px] font-extrabold text-white"
                                    src={getImageByName("mute")}
                                />
                            </div>
                            <div 
                                className='h-[30px] w-[30px] mb-2 flex justify-center items-center transition-transform duration-150 ease-in-out active:bg-gray active:scale-95' 
                                style={{ cursor: "pointer", background: !showVolumeSlider ? "rgba(78, 83, 156, 0.30)" : "rgba(10, 138, 49, 0.30)", borderRadius: "40px" }} 
                                onClick={() => setShowVolumeSlider(!showVolumeSlider)} // Toggle volume slider visibility
                            >
                                <img
                                    className="h-[20px] font-extrabold text-white"
                                    src={getImageByName("changeVoice")} 
                                />
                            </div>
                            {showVolumeSlider && (
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="absolute -top-20 -left-9 mt-2 w-[100px]" // Style as desired, e.g., set width
                                    style={{transform:"rotate(270deg)"}}
                                />
                            )}
                        </div>
                        <IonImg
                            src={getImageByName("yellowCat")}
                            className="h-[87px]  z-50 bottom-1 right-12 mb-1 absolute "
                        />
                        <div className='absolute bottom-0 left-0 z-30 w-full h-[36px] bg-[#37396C] flex flex-col justify-center items-center'>
                            <p className='text-white font-semibold text-[12px] font-segoe'><div dangerouslySetInnerHTML={{ __html: item?.title }}></div></p>
                        </div>
                    </div>
                </SwiperSlide>
            ))}
                {/* <SwiperSlide>
                    <div className='relative'>
                        <video
                            ref={(el) => (videoRefs.current[1] = el!)}
                            className="h-[44vh] w-full object-cover"
                            poster="src/assets/store-dog1.png"
                        >
                            <source src={SampleVideo1} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <div className="absolute bottom-9 right-4">
                            <div className='h-[30px] w-[30px] mb-2 flex justify-center items-center' style={{ cursor: "pointer", background: "rgba(78, 83, 156, 0.30)", borderRadius:"40px" }}>
                                <IonIcon
                                    onClick={() => handlePlayPause(1)} // Play/pause for the first video
                                    className={`h-[20px] ${isPlaying[1] ? "" : "pl-[1px]"} font-extrabold text-white`}
                                    src={isPlaying[1] ? pause : play} // Dynamic play/pause icon
                                />
                            </div> 
                            <div className='h-[30px] w-[30px] mb-2 flex justify-center items-center' style={{ cursor: "pointer", background: isMute ? "rgba(78, 83, 156, 0.30)" : "rgba(10, 138, 49, 0.30)", borderRadius:"40px" }}>
                                <img
                                    onClick={() => handleMuteToggle(1)} // Play/pause for the first video
                                    className="h-[20px] font-extrabold text-white"
                                    src={getImageByName("mute")}
                                />
                            </div>
                            <div className='h-[30px] w-[30px] mb-2 flex justify-center items-center' style={{ cursor: "pointer", background: "rgba(78, 83, 156, 0.30)", borderRadius:"40px" }}>
                                <img
                                    // onClick={() => handleMuteToggle(1)} // Play/pause for the first video
                                    className="h-[20px] font-extrabold text-white"
                                    src={getImageByName("changeVoice")}// Dynamic play/pause icon
                                />
                            </div>
                            
                        </div>
                        <IonImg
                            src={getImageByName("yellowCat")}
                            className="h-[87px]  z-50 bottom-1 right-12 mb-1 absolute "
                        />
                        <div className='absolute bottom-0 left-0 z-30 w-full h-[36px] bg-[#37396C] flex flex-col justify-center items-center'>
                            <p className='text-white font-semibold text-[12px] font-segoe'>Welcome note from</p>
                            <p className='text-white text-[12px] font-segoe font-bold'>Dr. Ambika</p>
                        </div>
                    </div>
                </SwiperSlide>
                

                <SwiperSlide>
                    <div className='relative'>
                        <video
                            ref={(el) => (videoRefs.current[2] = el!)}
                            className="h-[44vh] w-full object-cover"
                            poster="src/assets/store-dog1.png"
                        >
                            <source src={SampleVideo2} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <div className="absolute bottom-9 right-4">
                            <div className='h-[30px] w-[30px] mb-2 flex justify-center items-center' style={{ cursor: "pointer", background: "rgba(78, 83, 156, 0.30)", borderRadius:"40px" }}>
                                <IonIcon
                                    onClick={() => handlePlayPause(2)} 
                                    className={`h-[20px] ${isPlaying[2] ? "" : "pl-[1px]"} font-extrabold text-white`}
                                    src={isPlaying[2] ? pause : play}
                                />
                            </div> 
                            <div className='h-[30px] w-[30px] mb-2 flex justify-center items-center' style={{ cursor: "pointer", background: isMute ? "rgba(78, 83, 156, 0.30)" : "rgba(10, 138, 49, 0.30)", borderRadius:"40px" }}>
                                <img
                                    onClick={() => handleMuteToggle(2)} 
                                    className="h-[20px] font-extrabold text-white"
                                    src={getImageByName("mute")}
                                />
                            </div>
                            <div className='h-[30px] w-[30px] mb-2 flex justify-center items-center' style={{ cursor: "pointer", background: "rgba(78, 83, 156, 0.30)", borderRadius:"40px" }}>
                                <img
                                    // onClick={() => handleMuteToggle(2)} // Play/pause for the first video
                                    className="h-[20px] font-extrabold text-white"
                                    src={getImageByName("changeVoice")}// Dynamic play/pause icon
                                />
                            </div>
                            
                        </div>
                        <IonImg
                            src={getImageByName("yellowCat")}
                            className="h-[87px]  z-50 bottom-1 right-12 mb-1 absolute "
                        />
                        <div className='absolute bottom-0 left-0 z-30 w-full h-[36px] bg-[#37396C] flex flex-col justify-center items-center'>
                            <p className='text-white font-semibold text-[12px] font-segoe'>Welcome note from</p>
                            <p className='text-white text-[12px] font-segoe font-bold'>Dr. Ambika</p>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className='relative'>
                        <video
                            ref={(el) => (videoRefs.current[3] = el!)}
                            className="h-[44vh] w-full object-cover"
                            poster="src/assets/store-dog1.png"
                        >
                            <source src={SampleVideo1} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <div className="absolute bottom-9 right-4">
                            <div className='h-[30px] w-[30px] mb-2 flex justify-center items-center' style={{ cursor: "pointer", background: "rgba(78, 83, 156, 0.30)", borderRadius:"40px" }}>
                                <IonIcon
                                    onClick={() => handlePlayPause(3)} // Play/pause for the first video
                                    className={`h-[20px] ${isPlaying[3] ? "" : "pl-[1px]"} font-extrabold text-white`}
                                    src={isPlaying[3] ? pause : play} // Dynamic play/pause icon
                                />
                            </div> 
                            <div className='h-[30px] w-[30px] mb-2 flex justify-center items-center' style={{ cursor: "pointer", background: isMute ? "rgba(78, 83, 156, 0.30)" : "rgba(10, 138, 49, 0.30)", borderRadius:"40px" }}>
                                <img
                                    onClick={() => handleMuteToggle(3)} // Play/pause for the first video
                                    className="h-[20px] font-extrabold text-white"
                                    src={getImageByName("mute")}
                                />
                            </div>
                            <div className='h-[30px] w-[30px] mb-2 flex justify-center items-center' style={{ cursor: "pointer", background: "rgba(78, 83, 156, 0.30)", borderRadius:"40px" }}>
                                <img
                                    // onClick={() => handleMuteToggle(3)} // Play/pause for the first video
                                    className="h-[20px] font-extrabold text-white"
                                    src={getImageByName("changeVoice")}// Dynamic play/pause icon
                                />
                            </div>
                            
                        </div>
                        <IonImg
                            src={getImageByName("yellowCat")}
                            className="h-[87px]  z-50 bottom-1 right-12 mb-1 absolute "
                        />
                        <div className='absolute bottom-0 left-0 z-30 w-full h-[36px] bg-[#37396C] flex flex-col justify-center items-center'>
                            <p className='text-white font-semibold text-[12px] font-segoe'>Welcome note from</p>
                            <p className='text-white text-[12px] font-segoe font-bold'>Dr. Ambika</p>
                        </div>
                    </div>
                </SwiperSlide> */}

        
      </Swiper>
    </IonContent>
  );
};

export default VideoSlider;
