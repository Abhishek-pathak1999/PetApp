import { useEffect, useState } from "react";
import { IonApp, IonLoading, IonNav, setupIonicReact } from "@ionic/react";
import { Preferences } from "@capacitor/preferences";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import "@fontsource/open-sans"; // Defaults to weight 400
import "@fontsource/open-sans/400.css"; // Specify weight
import "@fontsource/open-sans/400-italic.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

import "@fontsource/inter"; // Defaults to weight 400
import "@fontsource/inter/400.css"; // Specify weight
// import "@fontsource/inter/400-italic.css";
import "@fontsource/rum-raisin"; // Defaults to weight 400
import "@fontsource/rum-raisin/400.css"; // Specify weight
// import "@fontsource/rum-raisin/400-italic.css";

/* Theme variables */
import "./theme/variables.css";
import "./theme/tailwind.css";
import { useQuery, useQueryClient } from "react-query";
import OnBoardingRoutes from "./routes/OnBoardingRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import { decodeJwt } from "./helpers";
import moment from "moment";
import DashboardRoutes from "./routes/DashboardRoutes";
import Appointments from "./pages/Appointments";
import { Route } from "react-router";
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { StatusBar, Style } from '@capacitor/status-bar';
// fonts 
import "@fontsource/open-sans"; // Defaults to weight 400
import "@fontsource/open-sans/400.css"; // Specify weight
import "@fontsource/open-sans/400-italic.css"; // Specify weight and style
import Dashboard from "./pages/Dashboard";
import { AndroidFullScreen, AndroidSystemUiFlags } from "@ionic-native/android-full-screen";
import { Capacitor } from "@capacitor/core";
import { apkVersion } from "./constants";
import { checkAppVersion, getGoogleMapKey } from "./service/services";
import UpdateModal from "./components/BlockAppModal";
import { LoadScript } from "@react-google-maps/api";

//rum-raisin fonts 
// import "@fontsource/rum-raisin"; // Defaults to weight 400
// import "@fontsource/rum-raisin/400.css"; // Specify weight
// import "@fontsource/rum-raisin/400-italic.css"; // Specify weight and style

setupIonicReact();

const App: React.FC = () => {
  const queryCache = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [parsedToken, setParsedToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUpdateRequired, setIsUpdateRequired] = useState(false);
  const [storeUrlAndMsg, setStoreUrlAndMsg] = useState<any>({storeUrll: "", msg:""});
  const [apiKey, setApiKey] = useState<any>("")
  useEffect(() => {
    checkForUpdate();

    // Set an interval to call the function every 30 minutes
    const interval = setInterval(() => {
      checkForUpdate();
    }, 30 * 60 * 1000); // 30 minutes in milliseconds

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(()=>{
    handleGoogleMapKey()
  },[])
  
  async function handleGoogleMapKey(){
    try{
      const data = await getGoogleMapKey()
      if(data.isSuccess){
        setApiKey(data?.result?.systemValue)
      }
    }catch(e){
      console.error(e)
    }
  }

  const checkForUpdate = async () => {
    const platform = Capacitor.getPlatform();
    const appStoreUrl =
      platform === 'ios'
        ? 'https://apps.apple.com/app/idYOUR_APP_ID'
        : 'https://play.google.com/store/apps/details?id=YOUR_PACKAGE_NAME';
        setStoreUrlAndMsg((prev:any)=> ({...prev, storeUrll:appStoreUrl}));
        


    // const appInfo = await App.getInfo();
    const currentVersion = apkVersion;
    const response = await checkAppVersion("ParentApp");
    const data = response?.result[0];
    setStoreUrlAndMsg((prev:any)=> ({...prev, msg:data.message}));
    if (data.systemValue && currentVersion !== data.systemValue) {
      setIsUpdateRequired(true);
    }else{
      setIsUpdateRequired(false);
    }
  };
  
  useEffect(() => {
    lockScreen();
  }, []);

  async function lockScreen(){
    await AndroidFullScreen.setSystemUiVisibility(AndroidSystemUiFlags.Fullscreen);
    await ScreenOrientation.lock(ScreenOrientation.ORIENTATIONS.PORTRAIT);
  }
  

  const { data: authStatus } = useQuery<any>(["isOnBoardingCompleted"], {
    queryFn: () => { },
    initialData: { isOnBoardingCompleted: false },
  });
  const { data }: any = useQuery(["token"], { queryFn: () => { } });
  
  
  const changeStatusBarColor = async () => {
    try {
      await StatusBar.setOverlaysWebView({ overlay: true });
      await StatusBar.show();

      await StatusBar.setBackgroundColor({ color: '#808080' }); // Replace with your app color
      await StatusBar.setStyle({ style: Style.Dark }); // Change the style as needed (Light or Dark)
    } catch (err) {
      console.error('Error setting status bar color', err);
    }
  };

  useEffect(() => {
    changeStatusBarColor();
  }, []);

  useEffect(() => {
   
  
    (async () => {
      const { value: isCompleted } = await Preferences.get({
        key: "isOnBoardingCompleted",
      });
      if (isCompleted) {
        queryCache.setQueryData(["isOnBoardingCompleted"], () => ({
          isOnBoardingCompleted: true,
        }));
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const tokenValue = await Preferences.get({ key: "token" });
      if (tokenValue.value) {
        const parsedToken : any = decodeJwt(tokenValue.value!);
        const todayDateInUnix = moment(new Date()).unix();
        console.log({ todayDateInUnix, parsedToken });
        if (todayDateInUnix < parsedToken?.exp!) {
          setToken(tokenValue.value);
          if(parsedToken?.result && parsedToken?.result?.parent && parsedToken?.result?.parent?.pets.length>0){
            setParsedToken(true)

          }else{
            setParsedToken(false)
          }
        }
      } else {
        setToken(null);
      }
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    })();
  }, [data]);

  console.log("isUpdateRequired: ", isUpdateRequired)

  if (loading) {
    return (
      <IonApp>
        <IonLoading isOpen={loading} />
      </IonApp>
    );
  }

  console.log("apiKey: ", apiKey)

  return (
    <IonApp>
      {apiKey != "" && <LoadScript googleMapsApiKey={apiKey}>
      {isUpdateRequired && <UpdateModal storeUrl={storeUrlAndMsg} />}
      {token && !isUpdateRequired ? (
        <DashboardRoutes />
      ) : (
        <AuthRoutes />
      )}
      {/* <IonNav root={() => <Appointments />}></IonNav>; */}
      {/* <Route exact path="/dashboard/treatment-success" component={TreatmentDone} /> */}
      </LoadScript>}
    </IonApp>
  );
};

export default App;
