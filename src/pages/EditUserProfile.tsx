import { ErrorMessage } from "@hookform/error-message";
import {
  IonAvatar,
  IonButton,
  IonContent,
  IonImg,
  IonInput,
  IonLoading,
  IonModal,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonText,
  useIonViewDidEnter,
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { API_BASE_URL } from "../config";
import { Preferences } from "@capacitor/preferences";
import { jwtDecode } from "jwt-decode";
import { useQuery } from "react-query";
import { useHistory, withRouter } from "react-router";
import catButton from "../assets/cat-button.png";
import add from "../assets/Add.png";
import {
  createOrUpdateParent,
  handleGetParentData,
  uploadFileForParent,
} from "../service/services";
import moment from "moment";
import ModalForNumber from "./ModalForNumber";
import { getCroppedImg } from "../utils/crop";
import Cropper from "react-easy-crop";

const EditUserProfile = () => {
  const history = useHistory();
  const [token, setToken] = useState<null | string>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedFileUpload, setSelectedFileUpload] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isNumberModal, setIsNumberModal] =
    useState<boolean>(false);
  const [imageForCrop,setImageForCrop] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const flag = true;
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useIonViewDidEnter(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      fullName: null,
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
      const response = await handleGetParentData(token);
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

  const handleFileInputChange = async () => {
    // clearErrors("fileInput");
    const files = inputFileRef.current?.files;

    if (files && files.length > 0) {
      const newSelectedFile = await files[0];
      setImageForCrop(URL.createObjectURL(newSelectedFile))
      setIsModalOpen(true);
    }
  };

  const onCropComplete = (croppedArea : any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      const croppedImage: any = await getCroppedImg(imageForCrop, croppedAreaPixels);
      // setCroppedImage(croppedImage);
      setSelectedFileUpload([croppedImage])
      setSelectedFile(URL.createObjectURL(croppedImage));
      // await uploadFile([croppedImage], petData?.result?._id);
      // await handlePetById();
      setIsModalOpen(false);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (parentData?.result) {
      setValue("fullName", parentData?.result?.full_name);
      setValue("mobileNumber", parentData?.result?.phoneNumber);
      setValue("email", parentData?.result?.email);
      setValue("gender", parentData?.result?.gender);
      if(parentData?.result?.dob){
        const dob: any = moment(parentData?.result?.dob)
        .utc()
        .format("YYYY-MM-DD");
      setValue("age", dob);
      }
      setValue("city", parentData?.result?.city);
      setValue("pinCode", parentData?.result?.pincode);
      setSelectedFile(parentData?.result?.image_base_url);
    }
  }, [parentData]);
  console.log("getValue: ", getValues("age"));

  const handleUploadImage = () => {
    inputFileRef.current?.click();
  };

  // const handleFileInputChange = () => {
  //   const file = inputFileRef.current?.files?.[0];
  //   if (file) {
  //     // Read the selected file and convert it to a data URL
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       if (event.target && typeof event.target.result === "string") {
  //         setSelectedFile(event.target.result);
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const age: any = getValues("age"); 
      console.log("agefaya: ", age)
      let convertedAge;
      if (age && age.length > 0) {
        const date = new Date(age);
        convertedAge = date.toISOString();
      }
      

      const params: any = {
        full_name: getValues("fullName"),
        phoneNumber: getValues("mobileNumber"),
        email: getValues("email"),
        gender: getValues("gender"),
        city: getValues("city"),
        pincode: getValues("pinCode"),
      };

      if (convertedAge) {
        params.dob = convertedAge;
      }

      if (parentData?.result?._id) {
        params._id = parentData?.result?._id;
      }

      const response = await createOrUpdateParent(token, params);
      const parsedResponse = response;
      if (parsedResponse?.status == 201) {
        await uploadFile(
          selectedFileUpload,
          parentData?.result?._id
        );
      }
      history.push({ pathname: "/dashboard/my-pets/display", state: { flag } });
      window.location.reload();
      // handleGetParentInfo();
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFile = async (files: File[] | undefined, id: string) => {
    if (!files?.length) {
      console.error("No files selected.");
      return;
    }
    const formData = new FormData();

    const allFiles = files.map(async (file: any) => {
      if (file?.uploadImageUrl) {
        try {
          const response = await fetch(file?.uploadImageUrl);
          const blob = await response.blob();
          const imageUrlToFile = new File([blob], file?.fileName, {
            type: "image/jpeg",
          });
          return imageUrlToFile;
        } catch (err) {
          throw err;
        }
      } else {
        return file;
      }
    });
    const resolvedFiles = await Promise.all(allFiles);
    resolvedFiles.forEach((file) => formData.append("file", file));

    const response = await uploadFileForParent(token, formData, id);
    console.log("fileResponse", response);

    return response;
  };

  if (isParentLoading) {
    return <IonLoading isOpen={true} />;
  }

  return (
    <IonPage >
      <IonContent color="white" className="overflow-y-scroll bg-white">
      
        <div className="w-full mb-[110px]">
          {/* <IonText className="font-bold text-[20px] flex justify-center">
            Fill your profile information
          </IonText> */}

          <div className="mt-2 flex items-center justify-center">
            {selectedFile ? (
              <div className="w-full h-[150px] bg-[#D9D9D9]">
                <IonImg src={selectedFile} className="w-[100%] h-[100%]" />
              </div>
            ) : (
              <div className="w-[150px] h-[150px] bg-[#D9D9D9] rounded-[100px]" />
            )}
            {/* <input
              type="file"
              accept="image/*"
              ref={inputFileRef}
              className="hidden"
              onChange={handleFileInputChange}
            />
            <IonText onClick={handleUploadImage} className="ml-[20px]">
              Edit Icon
            </IonText>  */}
          </div>

          <div className="bg-[#d1d5db] h-[50px] w-full mt-0 ">
            <div className="absolute h-[50px] flex justify-center items-center border-l-2 border-spacing-2 right-0 ">
              <IonText className="ml-4">Upload Image</IonText>
              <input
                type="file"
                accept="image/jpeg"
                ref={inputFileRef}
                className="hidden"
                onChange={handleFileInputChange}
              />
              {isModalOpen && (
                  <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
                    <div className="crop-container">
                      <Cropper
                        image={imageForCrop}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                      />
                    </div>
                    <div className="flex items-center justify-center mb-10">
                      <div className="m-2 bg-customBreen px-7 py-2 text-white z-50 rounded" onClick={showCroppedImage}>Crop</div>
                      <div className="m-2 z-50 bg-red-500 px-7 py-2 text-white rounded" onClick={() => {setSelectedFileUpload([]),setIsModalOpen(false)}}>Cancel</div>
                    </div>
                    
                    
                  </IonModal>
                )}
              <IonImg
                onClick={handleUploadImage}
                src={add}
                className="mr-6 transition-transform duration-75 ease-in-out active:scale-95 touch-none"
              ></IonImg>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <form
              // autoComplete="off"
              className="w-[100%] mx-8 mb-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <IonLoading isOpen={isLoading} />
              <div className="flex justify-center">
                <div className="relative w-full">
                  <Controller
                    name="fullName"
                    control={control}
                    rules={{ required: "Required*" }}
                    render={() => {
                      return (
                        <IonInput
                          fill="outline"
                          placeholder="Full Name"
                          className="custom-input mt-[10px] text-black"
                          name="fullName"
                          // autocomplete="new-password"
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
                      <div color="danger" className="absolute top-11 left-0 text-red text-xxs mt-1 text-[red]">
                        {message}
                      </div>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-center ">
                <div className="w-[100%] flex">
                  <div className="relative w-[100%]">
                    <Controller
                      name="mobileNumber"
                      control={control}
                      rules={{ required: "Required*" }}
                      render={() => {
                        return (
                          <IonInput
                            fill="outline"
                            placeholder="Mobile Number"
                            className="custom-input  mt-[10px] text-black"
                            name="mobileNumber"
                            readonly
                            // autocomplete="new-password"
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
                        <div className="absolute top-12 left-0 text-red text-xxs text-[red]">
                          {message}
                        </div>
                      )}
                    />
                  </div>
                  {/* <div className="mt-[7px]">
                  <IonButton onClick={()=>setIsNumberModal(!isNumberModal)}>edit</IonButton>
                  </div> */}
                </div>
              </div>
              <div className="flex justify-center ">
                <div className="w-full">
                  <Controller
                    name="email"
                    control={control}
                    // rules={{ required: "Required*" }}
                    render={() => {
                      return (
                        <IonInput
                          fill="outline"
                          type="email"
                          // autocomplete="email"
                          placeholder="Email Address"
                          className="custom-input  mt-[10px] text-black"
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
                      <div className="text-red text-xxs mt-[5px] text-[red]">
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
                    // rules={{ required: "Required*" }}
                    render={() => {
                      return (
                        <IonSelect
                          className="text-black"
                          aria-label="gender"
                          placeholder="Gender"
                          fill="outline"
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
                <div className="w-[50%]">
                  <Controller
                    name="age"
                    control={control}
                    // rules={{ required: "Required*" }}
                    render={() => {
                      return (
                        <IonInput
                          fill="outline"
                          placeholder="Enter DOB"
                          type={getValues("age") ? "date" : "text"}
                          onFocus={(e) => {
                            e.target.type = "date";
                          }}
                          onBlur={(e) => {
                            const age = getValues("age");
                            if (age) {
                              e.target.type = "date";
                            } else {
                              e.target.type = "text";
                            }
                          }}
                          className="custom-input w-full text-black"
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
                    // rules={{ required: "Required*" }}
                    render={() => {
                      return (
                        <IonInput
                          type="text"
                          fill="outline"
                          placeholder="City"
                          style={{
                            // border: "1px solid #22A676",
                            borderRadius: "8px",
                          }}
                          className="custom-input w-[120px] text-black"
                          name="city"
                          onIonChange={(e: any) => {
                            clearErrors("city");
                            setValue("city", e.detail.value);
                          }}
                          value={getValues("city")}
                        ></IonInput>
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
                <div className="relative">
                  <Controller
                    name="pinCode"
                    control={control}
                    rules={{
                      required: "Required*",
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: "Pin code must be 6 digits",
                      },
                    }}
                    render={() => {
                      return (
                        <IonInput
                          fill="outline"
                          type="tel"
                          placeholder="Pin Code"
                          // autocomplete="new-password"
                          className="custom-input w-[120px] text-black"
                          name="pinCode"
                          // onIonInput={(e: any) => {
                          //   clearErrors("pinCode");
                          //   setValue("pinCode", e.detail.value);
                          // }}
                          
                          maxlength={6}
                          inputMode="numeric"
                          onIonInput={(e: any) => {
                            const inputValue = e.detail.value || '';
                            if (inputValue.length <= 6) { // Restrict input length to 6 digits
                              setValue("pinCode", e.detail.value);; // Update form value only if length is valid
                              clearErrors("pinCode");
                            }
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
                      <div className="absolute top-10 left-0 text-[red] text-red text-xxs mt-[1px]">
                        {message}
                      </div>
                    )}
                  />
                </div>
              </div>
              <div className="w-[100%]  relative">
                <div className="fixed bottom-2.5 w-full left-0 h-[100px] bg-[#fff] z-10 flex flex-col items-center justify-center mt-5">
                <IonImg src={catButton} className="ml-5 -mb-[2.8rem] z-10" />
                <IonButton
                  type="submit"
                  shape="round"
                  className="w-[200px] h-[42px] mt-[30px] normal-case col rounded-full"
                  style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
                >
                  Save
                </IonButton>
                </div>
              </div>
            </form>
          </div>
          <div ref={bottomRef}/>
        </div>
        {isNumberModal && <ModalForNumber
        isOpen={isNumberModal}
        onClose={() => {
          setIsNumberModal(!isNumberModal);
        }} />}
      </IonContent>
    </IonPage>
  );
};

export default EditUserProfile;
