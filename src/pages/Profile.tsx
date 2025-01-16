import { ErrorMessage } from "@hookform/error-message";
import {
  IonAvatar,
  IonButton,
  IonContent,
  IonImg,
  IonInput,

  IonLoading,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonText,
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { API_BASE_URL } from "../config";
import { Preferences } from "@capacitor/preferences";
import { jwtDecode } from "jwt-decode";
import { useQueryClient } from "react-query";
import { useQuery } from "react-query";
import { useHistory, withRouter } from "react-router";
import { getImageByName } from "../utils/imagesUtil";
import { createOrUpdateParent, handleGenerateRefreshToken, handleGetParentData, uploadFileForParent } from "../service/services";
import moment from "moment";

const Profile = () => {
  const history = useHistory();
  const [token, setToken] = useState<null | string>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryCache = useQueryClient();
  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      fullName: null ,
      mobileNumber: null,
      email: null,
      gender: null,
      age: null,
      city: null,
      pinCode: null,
    },
    mode: "onChange",
  });

  useEffect(() => {
    (async () => {
      const tokenValue = await Preferences.get({ key: "token" });
      setToken(tokenValue.value!);

    })();
  }, []);

  const handleGetParentInfo = async () => {
    try {
      const response = await handleGetParentData(token)
      const parsedResponse = response;
      return parsedResponse;
    } catch (error) {
      throw error;
    }
  };

  const { data: parentData, isLoading: isParentLoading } = useQuery(
    ["getParentInfo"],
    {
      queryFn: () => handleGetParentInfo(),
      enabled: !!token,
    }
  );

  useEffect(() => {
    if (parentData?.result) {
      setValue("fullName", parentData?.result?.full_name);
      setValue("mobileNumber", parentData?.result?.phoneNumber);
      setValue("email", parentData?.result?.email);
      setValue("gender", parentData?.result?.gender);
      const dob : any = moment(parentData?.result?.dob).utc().format('YYYY-MM-DD')
      setValue("age", dob);
      setValue("city", parentData?.result?.city);
      setValue("pinCode", parentData?.result?.pincode);
      setSelectedFile(parentData?.result?.image_base_url);
    }
  }, [parentData]); 

  useEffect(() => {
    handleMobileNumber()
  }, []); 

  async function handleMobileNumber(){
    const { value: userDetails }: any =  await Preferences.get({ key: "mobileNumber" })
    if (userDetails) {
      setValue("mobileNumber", userDetails);
      
    }
  }

  const handleUploadImage = () => {
    inputFileRef.current?.click();
  };

  const handleFileInputChange = () => {
    const file = inputFileRef.current?.files?.[0];
    if (file) {
      // Read the selected file and convert it to a data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          setSelectedFile(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const age : any = getValues("age");
      const date = new Date(age);
      // date.setHours(0, 0, 0, 0);
      const convertedAge = date.toISOString();

      const params: any = {
        full_name: getValues("fullName"),
        phoneNumber: getValues("mobileNumber"),
        email: getValues("email"),
        gender: getValues("gender"),
        dob: convertedAge,
        city: getValues("city"),
        pincode: getValues("pinCode"),
      };

      if (parentData?.result?._id) {
        params._id = parentData?.result?._id;
      }

      const response = await createOrUpdateParent(token, params) 
      if (response.status == 201) {
        if (response?.result) {
          uploadFile(
            inputFileRef.current?.files?.[0],
            response?.result?._id
          );
        }
        const parsedResponse = await handleGenerateRefreshToken()
        if (parsedResponse?.status == 200) {
          await Preferences.set({ key: "token", value: parsedResponse?.token });
          queryCache.setQueryData(["token"], () => ({
            token: parsedResponse?.token,
          }));
          return history.push("/pet/info");
        }
      } else {
        alert("Something is not right. Please try again.");
      }
      
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
      // history.push("/pet/info");
    }
  };

  const uploadFile = async (file: File | undefined, id: string) => {
    if (!file) {
      console.error("No file selected.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    const response = await uploadFileForParent(token, formData, id) 
    console.log("fileResponse", response);
    return response;
  };
    
  if (isParentLoading) {
    return <IonLoading isOpen={true} />;
  }

  return (
    <IonPage>
      <IonContent>
        <div className="w-full mt-[20%]">

          <div className="mt-2 ml-[20px] flex items-center justify-center">
            {selectedFile ? (
              <IonAvatar className="w-[150px] h-[150px] bg-[#D9D9D9]">
                <IonImg src={selectedFile} className="w-[100%] h-[100%]" />
              </IonAvatar>
            ) : (
              <div className="w-[150px] h-[150px] bg-[#D9D9D9] rounded-[100px]" />
            )}
           
          </div>

          <div className="bg-[#d1d5db] h-[50px] w-full mt-4 ">
              
              <div className="absolute h-[50px] flex justify-center items-center border-l-2 border-spacing-2 right-0 ">
              
                <IonText className="ml-4">Upload Image</IonText>
                <input
              type="file"
              accept="image/jpeg"
              ref={inputFileRef}
              className="hidden"
              onChange={handleFileInputChange}
            />
                <IonImg  onClick={handleUploadImage} src={getImageByName("add")} className="mr-6"></IonImg>
              </div>
          </div>

          <div className="mt-2 flex items-center justify-center">
            <form
              autoComplete="off"
              className="w-[100%] mx-8"
              onSubmit={handleSubmit(onSubmit)}
            >
              <IonLoading isOpen={isLoading} />
              <div className="flex justify-center">
                <div className="w-full">
                  <Controller
                    name="fullName"
                    control={control}
                    rules={{ required: "Required*" }}
                    render={() => {

                      return (

                        <IonInput placeholder="Full Name" className="custom-input mt-[10px]"
                          name="fullName"
                          style={{border: "1px solid #22A676", borderRadius: '8px'}}
                          onIonInput={(e: any) => {
                            clearErrors("fullName");
                            setValue("fullName", e.detail.value);
                          }}
                          value={getValues("fullName")}
                        />
                      );
                    }}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="fullName"
                    render={({ message }) => (
                      <div className="text-red text-xxs mt-[5px]">
                        {message}
                      </div>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-center ">
                <div className="w-full">
                  <Controller
                    name="mobileNumber"
                    control={control}
                    rules={{ required: "Required*" }}
                    render={() => {
                      return (
                        <IonInput
                        style={{border: "1px solid #22A676", borderRadius: '8px'}}
                          placeholder="Mobile Number"
                          className="custom-input  mt-[10px]"
                          name="mobileNumber"
                          readonly
                          maxlength={10}
                          onIonInput={(e: any) => {
                            clearErrors("mobileNumber");
                            setValue("mobileNumber", e.detail.value);
                          }}
                          value={getValues("mobileNumber")}
                        />
                      );
                    }}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="mobileNumber"
                    render={({ message }) => (
                      <div className="text-red text-xxs mt-[5px]">
                        {message}
                      </div>
                    )}
                  />
                </div>
              </div>
              <div className="flex justify-center ">
                <div className="w-full">
                  <Controller
                    name="email"
                    control={control}
                    rules={{ required: "Required*" }}
                    render={() => {
                      return (
                        <IonInput
                          style={{border: "1px solid #22A676", borderRadius: '8px'}}
                          type="email"
                          autocomplete="new-password"
                          placeholder="Email Address"
                          className="custom-input  mt-[10px]"
                          name="otp"
                          onIonInput={(e: any) => {
                            clearErrors("email");
                            setValue("email", e.detail.value);
                          }}
                          value={getValues("email")}
                        />
                      );
                    }}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="email"
                    render={({ message }) => (
                      <div className="text-red text-xxs mt-[5px]">
                        {message}
                      </div>
                    )}
                  />
                </div>
              </div>
              <div className=" mt-2 flex mx-auto w-full items-center justify-between">
                <div>
                  <Controller
                    name="gender"
                    control={control}
                    rules={{ required: "Required*" }}
                    render={() => {
                      return (
                        <IonSelect
                          aria-label="gender"
                          placeholder="Gender"
                          style={{border: "1px solid #22A676", borderRadius: '8px'}}
                          className="px-3"
                          onIonChange={(e) => {
                            clearErrors("gender");
                            setValue("gender", e.detail.value);
                          }}
                          value={getValues("gender")}
                        >
                          <IonSelectOption value="male">Male</IonSelectOption>
                          <IonSelectOption value="female">
                            Female
                          </IonSelectOption>
                        </IonSelect>
                      );
                    }}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="gender"
                    render={({ message }) => (
                      <div className="text-red text-xxs mt-[5px]">
                        {message}
                      </div>
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name="age"
                    control={control}
                    // rules={{ required: "Required*" }}
                    render={() => {
                      return (
                        <IonInput
                          fill="outline"
                          placeholder="Enter DOB"
                          type= {getValues("age") ? "date" : "text"}
                          onFocus={(e) => {
                            e.target.type = 'date';
                          }}
                          onBlur={(e) => {
                            const age = getValues("age");
                            if(age){
                              e.target.type = 'date';
                            }else{
                              e.target.type = 'text';
                            }
                          }}
                          className="custom-input w-[150px]"
                          name="age"
                          onIonInput={(e: any) => {
                            clearErrors("age");
                            setValue("age", e.detail.value);
                          }}
                          value={getValues("age")}
                        />
                      );
                    }}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="age"
                    render={({ message }) => (
                      <div className="text-red text-xxs mt-[5px]">
                        {message}
                      </div>
                    )}
                  />
                </div>
              </div>
              <div className="my-5 border border-[#22A676] bg-[fff]" />
              <div className="flex w-full items-center justify-between">
                <div className="">
                  <Controller
                    name="city"
                    control={control}
                    rules={{ required: "Required*" }}
                    render={() => {
                      return (
                        <IonInput
                          type="text"
                          placeholder="City"
                          style={{border: "1px solid #22A676", borderRadius: '8px'}}
                          className="custom-input w-[120px] "
                          name="city"
                          onIonChange={(e: any) => {
                            clearErrors("city");
                            setValue("city", e.detail.value);
                          }}
                          value={getValues("city")}
                        >
                        </IonInput>
                      );
                    }}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="city"
                    render={({ message }) => (
                      <div className="text-red text-xxs mt-[5px]">
                        {message}
                      </div>
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name="pinCode"
                    control={control}
                    rules={{ required: "Required*" }}
                    render={() => {
                      return (
                        <IonInput
                          style={{border: "1px solid #22A676", borderRadius: '8px'}}
                          type="number"
                          placeholder="Pin Code"
                          autocomplete="new-password"
                          className="custom-input w-[120px] "
                          name="pinCode"
                          onIonInput={(e: any) => {
                            clearErrors("pinCode");
                            setValue("pinCode", e.detail.value);
                          }}
                          value={getValues("pinCode")}
                        />
                      );
                    }}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="pinCode"
                    render={({ message }) => (
                      <div className="text-red text-xxs mt-[5px]">
                        {message}
                      </div>
                    )}
                  />
                </div>
              </div>
              <div className="w-[100%] flex flex-col items-center justify-center mt-5  ">
              <IonImg src={getImageByName("catbutton")} className="-mb-[2.8rem] z-10"/>
                <IonButton
                  type="submit"
                  shape="round"
                  className="w-[200px] h-[42px] mt-[30px] normal-case col rounded-full" style={{boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'}}
                >
                  Continue
                </IonButton>
                
              </div>
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
