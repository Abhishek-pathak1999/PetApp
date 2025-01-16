import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonList,
  IonLoading,
  IonPage,
  IonRippleEffect,
  IonRow,
  IonText,
} from "@ionic/react";
import Logo from "../assets/login.png";
import Logo2 from "../assets/sign-logo-img.png";
import Logo3 from "../assets/login-bg.png";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { useQueryClient } from "react-query";
import { Preferences } from "@capacitor/preferences";
import { useHistory } from "react-router";
import { getImageByName } from "../utils/imagesUtil";
import { getWidthInPercentage, getTopInPercentage } from "../utils/widthUtil";
import { handleGenerateOtpForUser, handleVerifyOtpp } from "../service/services";
import { Geolocation, PermissionStatus } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";
import { setupIonicReact } from '@ionic/react';
import { App as CapacitorApp } from '@capacitor/app';
import { Keyboard } from '@capacitor/keyboard';
setupIonicReact();


interface LatLong {
  lat: number | null;
  long: number | null;
}

const Login = () => {
  const queryCache = useQueryClient();
  const history = useHistory();
  const [mobileNumber, setMobileNumber] = useState("");
  const [isResendActive, setIsResendActive] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);
  const [otp, setOtp] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [loading, setIsLoading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState<any>(false);
  const [latLong, setLatLong] = useState<LatLong>({lat: null, long: null});
  const [token, setToken] = useState<null | string>();
  const [lastBackPress, setLastBackPress] = useState<number>(0);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    const backButtonListener = CapacitorApp.addListener('backButton', (event) => {
      const currentTime = new Date().getTime();

      
        // If on the root page, handle double back press
        if (currentTime - lastBackPress < 1000) {
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
    // Listen for keyboard show event
    const onKeyboardShow = (event: any) => {
      setKeyboardOffset(event.keyboardHeight); // Set the keyboard height
    };

    // Listen for keyboard hide event
    const onKeyboardHide = () => {
      setKeyboardOffset(0); // Reset the offset
    };

    Keyboard.addListener('keyboardWillShow', onKeyboardShow);
    Keyboard.addListener('keyboardWillHide', onKeyboardHide);

    return () => {
      Keyboard.removeAllListeners();
    };
  }, []);


  useEffect(() => {
    checkPermissions();
  }, [token]);

  const getCurrentLocation = async () => {
    if (permissionGranted) {
      if (Capacitor.isNativePlatform()) {
        // For native platforms
        try {
          const position = await Geolocation.getCurrentPosition();
          const { latitude, longitude } = position.coords;
          console.log("Current Position (Native):", latitude, longitude);
          setLatLong({lat:latitude, long: longitude})
          // Use latitude and longitude as needed
        } catch (error) {
          console.error("Error getting location (Native):", error);
        }
      } else {
        // For web platform using the browser's Geolocation API
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              console.log("Current Position :", latitude, longitude);
              setLatLong({lat:latitude, long: longitude})
            },
            (error) => {
              console.error("Error getting location (Web):", error);
            }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      }
    } else {
      console.error("Permission not granted. Cannot fetch location.");
    }
  };

  
  const checkPermissions = async () => {
    if (Capacitor.isNativePlatform()) {
      const permissionStatus: PermissionStatus = await Geolocation.checkPermissions();

      if (permissionStatus.location === "granted") {
        setPermissionGranted(true);
        getCurrentLocation()
      } else {
        const requestPermissionStatus: PermissionStatus = await Geolocation.requestPermissions();
        if (requestPermissionStatus.location === "granted") {
          setPermissionGranted(true);
          getCurrentLocation()
        } else {
          console.error("Location permission not granted");
        }
      }
    } else {
      // For web, we assume permission will be granted via browser prompt
      setPermissionGranted(true);
      getCurrentLocation()
    }
  };

  useEffect(() => {
    (async () => {
      const tokenValue = await Preferences.get({ key: "token" });
      setToken(tokenValue.value!);
    })();
  }, []);

  useEffect(() => {
    let intervalId: any;

    if (seconds > 0) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [seconds]);

  const handleGenerateOtp = async () => {
    if (!mobileNumber) {
      return setErrors({ ...errors, mobileNumber: "Required*" });
    }
    try {
      setIsLoading(true);
      const response = await handleGenerateOtpForUser(mobileNumber);

      if (response.status == 200) {
        setSeconds(60);
        setIsResendActive(true);
      } else {
        alert("Something is not right. Please try again.");
      }
    } catch (err: any) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      return setErrors({ ...errors, otp: "Required*" });
    }

    try {
      setIsLoading(true); 
      const data: {
        phoneNumber: string;
        otp: string;
        lat?: number | null;
        long?: number | null;
      } = {
        phoneNumber: mobileNumber,
        otp: otp,
      };
      if (latLong.lat !== null && latLong.long !== null) {
        data.lat = latLong.lat;
        data.long = latLong.long;
      }
      const response = await handleVerifyOtpp(data);
      console.log("Otp response : ", response);
      const parsedResponse = await response;
      console.log("parsedResponse", parsedResponse);
      if (parsedResponse?.isSuccess) {
        await Preferences.set({ key: "token", value: parsedResponse?.token });
        await Preferences.set({
          key: "refreshToken",
          value: parsedResponse?.refreshToken,
        });
        await Preferences.set({ key: "mobileNumber", value: mobileNumber });
        queryCache.setQueryData(["token"], () => ({
          token: parsedResponse?.token,
        }));

        return;
      }
      // console.log("parsedResponse?.message: ", parsedResponse?.message)
      alert(parsedResponse?.message);
    } catch (err: any) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtpHandler = async () => {
    try {
      setIsLoading(true);
      await fetch(`${API_BASE_URL}/api/resendOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          phoneNumber: mobileNumber,
        }),
      });
      setSeconds(60);
      setIsResendActive(true);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="relative log-bg flex flex-col items-center justify-center p-0 m-0 h-full overflow-hidden">
        {/* <div className="bg-login-bg bg-no-repeat bg-cover bg-center w-full h-full -z-10 absolute "></div> */}
        {/* <video
          src={getImageByName("videoLogo")}
          style={{ height: "100vh" }}
          className="bg-login-bg bg-no-repeat bg-cover bg-center w-full -z-10 absolute object-cover overflow-hidden"
          autoPlay
          loop
          muted
        /> */}
        {/* <img src={getImageByName('loginDogGif')} className="bg-login-bg bg-no-repeat bg-cover bg-center w-full h-[300px] -z-10 absolute" /> */}
        <IonImg
          // src={getImageByName("logoingif")}
          src={getImageByName("logoPng")}
          className=" mx-auto pt-10 mt-10 items-center text-center sm:w-[60%] sm:h-[20%] md:w-[40%] md:h-[15%] lg:w-[30%] lg:h-[10%] xl:w-[20%] xl:h-[8%]"
          style={{
            width: "350px",
            // width: "250px",
            height: "143px",
            flexShrink: 0,
          }}
        />
        <div className="w-full h-[300px]" style=
          {{ 
            lineHeight: "normal",
            backgroundImage: `url(${getImageByName("loginDogGif")})`,
            backgroundPosition: "50% 80%", // Aligns the image to the left
            backgroundSize: "350px 350px", // Ensures the image maintains its aspect ratio
            backgroundRepeat: "no-repeat"
          }}>
        </div>
        {/* <img src={getImageByName('loginDogGif')} className="bg-login-bg bg-no-repeat bg-cover bg-center w-full h-[300px] -z-10 absolute" /> */}
        
        <IonGrid
          className="absolute top-[58.5vh] left-1/2 transform -translate-x-1/2 h-auto"
          style={{ width: getWidthInPercentage(320) }}
        >
          <div style={{
            transform: `translateY(-${keyboardOffset}px)`, // Adjust position dynamically
            transition: 'transform 0.3s ease', // Smooth transition
            // background: "#fff",
            zIndex:999
          }}>
          <IonText className="customise-text mb-10" style={{ WebkitTextStrokeWidth: '1px',WebkitTextStrokeColor: '#091606', color:"#B9DADF"}}>Sign in with OTP..</IonText>
          
          <IonRow className="mb-2">
            <div className="sign-in flex my-0 w-full">
              <div className="flex flex-col justify-center w-3/4" style={{border: "1px solid #653131"}}>
                <IonInput
                  color="none"
                  type="tel"
                  name="mobileNumber"
                  pattern="\d{10}"
                  maxlength={10}
                  inputMode="numeric"
                  placeholder="Enter Mobile No"
                  className="custom custom-input-login"
                  style={{
                    width: "100%",
                    height: "35px",
                    minHeight: "35px",
                    fontFamily: "Open Sans",
                    
                  }}
                  onIonInput={(e) => {
                    const value = e.detail.value!;
                    setMobileNumber(value);
                  
                    if (value.length !== 10) {
                      setErrors({ ...errors, mobileNumber: "Check mobile number" });
                    } else {
                      setErrors({ ...errors, mobileNumber: null });
                    }
                  }}
                />
              </div>
              {isResendActive ? (
                <div
                  className="flex flex-row items-center justify-center bg-[#2A2C33] text-white text-[12px] w-1/3"
                  style={{
                    fontFamily: "Open Sans",
                    opacity: seconds !== 0 ? 0.5 : 1,
                  }}
                  // onClick={resendOtpHandler}
                  onClick={() => (seconds === 0 ? resendOtpHandler() : null)}
                  // disabled={phoneNumber?.length !== 10}
                >
                  <IonText className="select-none mr-[2px] ml-4">
                    Resend
                  </IonText>
                  <IonText className="select-none ml-1 mr-4">OTP</IonText>
                </div>
              ) : (
                <div
                  onClick={mobileNumber && mobileNumber.length == 10 ? handleGenerateOtp : () => {}}
                  className="flex flex-row items-center justify-center bg-[#2A2C33] text-white text-[12px] w-1/3"
                  style={{fontFamily: "Open Sans", opacity: mobileNumber && mobileNumber.length == 10 ? 1 : 1}}
                >
                  <IonText className="select-none ml-2">
                    Generate
                  </IonText>
                  <IonText className="select-none ml-1 mr-4">OTP</IonText>
                </div>
              )}
            </div>
          </IonRow>

          { (
            <IonRow className="mt-5 relative">
              {isResendActive && seconds != 0 && (
                <IonText
                  className="font-segoe text-right text-xs absolute right-0 -top-5 mr-2"
                  style={{ color: "#000" }}
                >
                  Resend otp in {seconds} seconds
                </IonText>
              )}
              <div className="sign-in flex w-full">
                <div className="flex flex-col justify-center w-3/4" style={{border: "1px solid #653131"}}>
                  <IonInput
                    type="password"
                    color="none"
                    name="otp"
                    inputMode="numeric"
                    placeholder="Enter OTP"
                    className="custom"
                    style={{ width: "100%", fontFamily: "Open Sans" }}
                    onIonInput={(e) => {
                      setErrors({ ...errors, otp: null });
                      setOtp(e.detail.value!);
                    }}
                  />
                </div>
                <div
                  onClick={otp && otp.length > 0 ? handleVerifyOtp : () => {}}
                  className="flex flex-row items-center justify-center bg-[#2A2C33] text-white text-[12px] w-1/3"
                  style={{ fontFamily: "Open Sans", opacity: otp && otp.length > 0 ? 1 : 1
                }}
                >
                  <IonText className="select-none mr-[2px] ml-4">
                    Submit
                  </IonText>
                  <IonText className="select-none ml-1 mr-4">OTP</IonText>
                </div>
              </div>
            </IonRow>
          )}

          {errors?.mobileNumber && (
            <IonText className="mt-[-10px] mb-[10px] font-bold text-[10px]" style={{color:"red"}}>
             *{errors?.mobileNumber}
            </IonText>
          )}
          <br />
          {errors?.otp && (
            <IonText className="mt-[-10px] mb-[10px] font-bold text-[10px]" style={{color:"red"}}>
              OTP {errors?.otp}
            </IonText>
          )}
          </div>
        </IonGrid>
        <IonText
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        style={{
          color: "#000",
          textAlign: "center",
          fontFamily: "Segoe UI",
          fontSize: "10px",
          fontStyle: "normal",
          fontWeight: 600,
        }}
      >
        Powered by Eastern Rays
      </IonText>
      </IonContent>
      
    </IonPage>
  );
};

export default Login;
