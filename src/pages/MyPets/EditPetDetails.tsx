import { ErrorMessage } from "@hookform/error-message";
import {
  IonAvatar,
  IonButton,
  IonContent,
  IonImg,
  IonInput,
  IonLabel,
  IonLoading,
  IonModal,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonText,
  useIonViewDidEnter,
} from "@ionic/react";
import { Keyboard } from '@capacitor/keyboard';
import Cropper from 'react-easy-crop'
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { API_BASE_URL } from "../../config";
import { Preferences } from "@capacitor/preferences";
import { useHistory, useLocation } from "react-router";
import { useQuery, useQueryClient } from "react-query";
import {
  createOrUpdatePet,
  deletePetPic,
  handlePetsInfo,
  makeProfilePetPic,
  uploadFileForPet,
} from "../../service/services";
import catButton from "../../assets/cat-button.png";
import { getImageByName } from "../../utils/imagesUtil";
import { getCroppedImg } from "../../utils/crop";

interface NewPetProps {
  type?: string;
  id?: string;
  setDefaultImage?: any
  details: any;
  currentImageIndex?: number;
  setEditPageEnable?: any
}

interface LocationState {
  details: any;
  currentImageIndex: number;
}

const EditPetDetails = ({ type, id, setDefaultImage, details, currentImageIndex, setEditPageEnable }: NewPetProps) => {
  const location = useLocation<LocationState>();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const queryCache = useQueryClient();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<any | null>(null);
  const [previewImage, setPreviewImage] = useState<any | null>(null);
  const [previewImageDisplay, setPreviewImageDisplay] = useState<any | null>(
    null
  );
  const [petData, setPetData] = useState<any>();
  const [index, setIndex] = useState<any>(null);
  const [token, setToken] = useState<null | string>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const flag = true;

  console.log("petDetails: ", petData);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useIonViewDidEnter(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  });

  const [keyboardOffset, setKeyboardOffset] = useState(0);

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


  const handleGetPets = async () => {
    try {
      const response = await handlePetsInfo(id);
      const parsedResponse = await response.json();
      return parsedResponse;
    } catch (err) {
      throw err;
    }
  };

  // const { data: petData, isLoading: isPetLoading } = useQuery(["getPets"], {
  //     queryFn: () => handleGetPets(),
  //     enabled: !!id && !!token,
  // });

  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    setError,
    getValues,
    reset,
    trigger,
  } = useForm({
    defaultValues: {
      petName: null,
      chipNumber: null,
      gender: null,
      age: null,
      weight: null,
      breed: null,
      fileInput: null,
      petType: null,
    },
    mode: "onChange",
  });

  useEffect(() => {
    (async () => {
      const tokenValue = await Preferences.get({ key: "token" });
      setToken(tokenValue.value!);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const index = await Preferences.get({ key: "imageIndex" });
      setIndex(index.value);
    })();
  }, [details]);

  useEffect(() => {
    handlePetById();
  }, [details]);

  async function handlePetById() {
    if (details) {
      const data = await handlePetsInfo(details?.result?._id);
      setPetData(data);
    }
  }

  useEffect(() => {
    if (petData) {
      setValue("petName", petData?.result?.pet_name);
      setValue("chipNumber", petData?.result?.chip_number);
      setValue("gender", petData?.result?.gender);
      setValue("age", petData?.result?.age);
      setValue("weight", petData?.result?.weight);
      setValue("breed", petData?.result?.breed);
      setValue("petType", petData?.result?.animal_type);
      setPreviewImage(petData?.result?.images);
      if(petData?.result?.images.length >0){
        setPreviewImageDisplay({
          url: petData?.result?.images[0]?.uploadImageUrl,
          id: petData?.result?.images[0]?.id,
        });
      }else{
        setPreviewImageDisplay(null);
      }
      
    }
  }, [petData]);

  console.log("selecetdFile: ", selectedFiles);
  console.log("setPreviewImage: ", previewImage);

  const handleFileInputChange = async () => {
    clearErrors("fileInput");
    const files = inputFileRef.current?.files;

    if (files && files.length > 0) {
      const newSelectedFile = await files[0];
      // const imageUrl = URL.createObjectURL(file);
      // setSelectedImage(imageUrl);
      // setIsModalOpen(true);
      setSelectedFiles(URL.createObjectURL(newSelectedFile));
      // setPreviewImageDisplay(URL.createObjectURL(newSelectedFile));
      // await uploadFile([newSelectedFile], petData?.result?._id);
      // await handlePetById();
      // await setSelectedFiles([])
      setIsModalOpen(true);
    }
  };

  const onCropComplete = (croppedArea : any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      const croppedImage: any = await getCroppedImg(selectedFiles, croppedAreaPixels);
      // setCroppedImage(croppedImage);
      await uploadFile([croppedImage], petData?.result?._id);
      await handlePetById();
      setIsModalOpen(false);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  console.log("HJJH :", selectedFiles);

  const onSubmit = async () => {
    try {
      setIsLoading(true);

      const params: any = {
        pet_name: getValues("petName"),
        chip_number: getValues("chipNumber"),
        gender: getValues("gender"),
        age: getValues("age"),
        weight: getValues("weight"),
        breed: getValues("breed"),
        animal_type: getValues("petType"),
      };

      if (petData?.result?._id) {
        params._id = petData?.result?._id;
      }

      const response = await createOrUpdatePet(params);
      // if (response.status == 201) {
      //   await uploadFile(selectedFiles, response?.result?._id);
      // }

      setIsLoading(false);
      return true;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const onBeforeSubmit = async () => {
    try {
      // setIsLoading(true);

      const params: any = {
        pet_name: getValues("petName"),
        chip_number: getValues("chipNumber"),
        gender: getValues("gender"),
        age: getValues("age"),
        weight: getValues("weight"),
        breed: getValues("breed"),
        animal_type: getValues("petType"),
      };

      if (petData?.result?._id) {
        params._id = petData?.result?._id;
      }

      const response = await createOrUpdatePet(params);
      // if (response.status == 201) {
      //   await uploadFile(selectedFiles, response?.result?._id);
      // }

      setIsLoading(false);
      return true;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const uploadFile = async (files: File[] | undefined, id: string) => {
    if (!files?.length) {
      console.error("No files selected.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
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

    const response = await uploadFileForPet(token, formData, id, index);
    return response;
  };

  const handleClick = async (name: string) => {
    await trigger();
    await onSubmit().then(async () => {
      // if (name !== "save") {
      //   reset();
      //   setPreviewImage(null);
      //   setSelectedFiles(null);
      // } else if (type !== "editable") {
      //   await Preferences.set({
      //     key: "isOnBoardingCompleted",
      //     value: JSON.stringify(true),
      //   });
      //   queryCache.setQueryData(["isOnBoardingCompleted"], () => ({
      //     isOnBoardingCompleted: true,
      //   }));
      //   // return history.push("/dashboard");
      // }
      if (name === "save") {
        return setEditPageEnable(false);
        // return history.push({ pathname: "/dashboard/my-pets/profile" });
      }
    });
  };

  async function deletePic(id: any) {
    try {
      setIsLoading(true);
      const response = await deletePetPic(id);
      console.log("Picture deleted successfully:", response);
      if (response.isSuccess == true) {
        await handlePetById();
        setIsLoading(false);
      } else {
        console.log("Picture not deleted successfully:", response);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error deleting picture:", error);
    }
  }

  async function makeProfilePic(id: any) {
    try {
      setIsLoading(true);
      const response = await makeProfilePetPic(petData?.result?._id, id);
      console.log("Make profile successfully:", response);
      if (response.isSuccess == true) {
        await handlePetById();
        setDefaultImage(previewImageDisplay?.url)
        setIsLoading(false);
      } else {
        setIsLoading(false);
        console.log("Make profile not successfully:", response);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error deleting picture:", error);
    }
  }

  useEffect(() => {
    if (petData && petData?.result?.image1) {
      setDefaultImage(petData?.result?.image1?.uploadImageUrl);
    } else {
      setDefaultImage("");
    }
  }, [petData]);


  if (isLoading) {
    return (
      <IonLoading
        isOpen={isLoading}
        message={"Please wait..."}
        style={{ background: "white" }}
      />
    );
  }

  return (
    <IonPage className="overflow-y-auto ">
      <IonContent 
      scrollEvents={false}
      >
        <div>
        <div
          className=" relative mt-6 h-[264px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px]"
          style={{
            //  border: "1px solid rgba(25, 35, 131, 0.29)",
            borderRadius: "5px",
            fontFamily: "Open Sans",
          }}
        >
          {previewImage ? (
            <div className="h-full w-full relative">
              {previewImageDisplay && petData?.result?.image1?._id == previewImageDisplay?.id ? (
                <div
                  className="flex absolute left-[20px] bottom-[50px] items-center w-full"
                  style={{}}
                >
                  <IonText
                    className="flex mb-[20px] p-1"
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#FAFF00",
                      background: "#3C418B",
                      borderRadius: "3px",
                    }}
                  >
                    Profile Pic
                  </IonText>
                </div>):
                (<div
                className="flex absolute left-[20px] bottom-[50px] items-center w-full transition-transform duration-75 ease-in-out active:scale-95"
                style={{}}
                onClick={() =>
                  previewImageDisplay?.id &&
                  makeProfilePic(previewImageDisplay?.id)
                }
              >
                <IonText
                  className="flex mb-[20px] p-1"
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#FAFF00",
                    background: "#3C418B",
                    borderRadius: "3px",
                  }}
                >
                  Make Profile Pic
                </IonText>
              </div>
              )}

              {/* <div className="flex absolute left-[230px] -top-[22px] items-center w-full">
                
              </div> */}
              {/* <div className="flex absolute left-[298px] top-[100px] items-center w-full">
                <div
                  onClick={() =>
                    previewImageDisplay?.id &&
                    makeProfilePic(previewImageDisplay?.id)
                  }
                  className="cursor-pointer transition-transform duration-75 ease-in-out active:scale-95"
                >
                  <IonImg src={getImageByName("chnageDeleteCircle")} className="relative"/>
                  <div className="absolute top-1.5 left-[13px] w-[20px] text-[7px] font-bold font-openSans flex justify-end items-center text-white">Make </div>
                  <div className="absolute top-4 left-[15px] w-[20px] text-[7px] font-bold font-openSans flex justify-end items-center text-white"> Profile </div>
                  <div className="absolute top-[26px] left-[9px] w-[20px] text-[7px] font-bold font-openSans flex justify-end items-center text-white ">Pic </div>

                </div>
              </div> */}
              <div className="flex absolute left-[298px] top-[155px] items-center w-full">
                  
                <div className="cursor-pointer transition-transform duration-75 ease-in-out active:scale-95">
                  <IonImg src={getImageByName("chnageDeleteCircle")} className="relative"/>
                  <IonImg
                  onClick={() =>
                    previewImageDisplay?.id && deletePic(previewImageDisplay.id)
                  }
                  src={getImageByName("chnageDelete")}
                  className="mr-3 cursor-pointer absolute top-2 left-3"
                  style={{filter:"drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))"}}
                />
                </div>
              </div>

              <IonImg
                src={previewImageDisplay?.url}

                style={{
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />
            </div>
          ) : (
            <div>
              <div className="flex justify-center items-center">
                <IonImg
                  src="src/assets/man-take-pic-dog.png"
                  className="h-[170px] w-[200px]"
                ></IonImg>
              </div>
              <div className="flex justify-center items-center">
                <IonText
                  style={{
                    color: "#B53598",
                    fontFamily: "Open Sans",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: "700",
                    lineHeight: "normal",
                  }}
                >
                  UPLOAD ZORO'S PICTURE
                </IonText>
              </div>
            </div>
          )}
          <ErrorMessage
            errors={errors}
            name="fileInput"
            render={({ message }) => (
              <div className="text-red text-md mt-[5px]">{message}</div>
            )}
          />

          <div
            className="absolute bottom-0"
            style={{
              width: "100%",
              background: "rgba(18, 32, 81, 0.25)",
              borderTop: "1px solid gray",
              display: "flex",
              height: "50px",
            }}
          >
            <div className="flex w-[250px] overflow-x-scroll">
              {previewImage && previewImage.length > 0 ? (
                previewImage &&
                previewImage.map((file: any, index: number) => (
                  <div className="w-[50px] ml-[10px]" key={file.id}>
                    <div
                      className="w-[45px] h-[45px] flex items-center justify-center mt-0.5 "
                      style={
                        previewImageDisplay?.id == file._id
                          ? { border: "2px solid #FAFF00", borderRadius: "5px" }
                          : {}
                      }
                    >
                      <IonImg
                        src={file.uploadImageUrl}
                        onClick={() =>
                          setPreviewImageDisplay({
                            url: file.uploadImageUrl,
                            id: file._id,
                          })
                        }
                        className="overflow-hidden"
                        style={{
                          width: "100%",
                          height: "100%",
                          cursor: "pointer",
                          objectFit: "cover",
                          borderRadius: "5px",
                          // border: "1.5px solid #FAFF00",
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full h-full flex justify-center items-center">
                  <p>No images selected</p>
                </div>
              )}
              {/* {selectedImage && (
        <div className="image-preview">
          <IonImg src={selectedImage} />
        </div>
      )} */}
            </div>

            <div className="flex items-center justify-center  ">
              <div className=" mr-[120px] w-[1.5px] h-[49px] bg-black" />
              <div className="absolute flex justify-center items-center ">
              <input
                  type="file"
                  accept="image/jpeg"
                  ref={inputFileRef}
                  // multiple
                  className="hidden"
                  onChange={handleFileInputChange}
                />
                <div
                className="relative flex items-center justify-center h-[29px] w-[108px] cursor-pointer transition-transform duration-75 ease-in-out active:scale-95"
                style={{
                  borderRadius: "5px",
                  border: "1px solid #BCBABA",
                  color: "#fff",
                  fontWeight: 700,
                  background: "#3C418B",
                  fontSize: "11px",
                  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
                onClick={() => {inputFileRef.current?.click(), onBeforeSubmit()}}
                >
                <IonText
                  className="flex ml-2 w-[110px] justify-start items-center"
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  Add New Pic
                </IonText>
                <IonImg
                  src={getImageByName("whiteAdd")}
                  className="absolute mr-3 h-[30px] w-[30px] top-0.5 -right-2.5"
                />
                </div>
                {isModalOpen && (
                  <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
                    <div className="crop-container">
                      <Cropper
                        image={selectedFiles}
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
                      <div className="m-2 z-50 bg-red-500 px-7 py-2 text-white rounded" onClick={() => {setSelectedFiles(null),setIsModalOpen(false)}}>Cancel</div>
                    </div>
                    
                  </IonModal>
                )}
                {/* <div
                  style={{
                    borderRadius: "5px",
                    border: "1px solid #BCBABA",
                    color: "#fff",
                    fontWeight: 700,
                    background: "#3C418B",
                    fontSize: "11px",
                    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                  }}
                  className="p-1.5"
                  onClick={() =>
                    previewImageDisplay?.id &&
                    makeProfilePic(previewImageDisplay?.id)
                  }
                >
                  Make Profile Pic
                </div> */}
                {/* <IonImg
                  onClick={() => inputFileRef.current?.click()}
                  src="src/assets/Add.png"
                  className="mr-3 cursor-pointer"
                /> */}
              </div>
            </div>
          </div>
        </div>
        <div style={{
            transform: `translateY(-${keyboardOffset}px)`, // Adjust position dynamically
            transition: 'transform 0.3s ease', // Smooth transition
            background: "#fff",
          }}>
        <form
          autoComplete="off"
          // onSubmit={handleSubmit(onSubmit)}
          // ref={formRef}
          className=" p-3 my-4  mx-auto"
          style={{
            borderRadius: "15px",
            border: "1px solid rgba(0, 0, 0, 0.12)",

            background: "#fff",
            width: "332px",
            height: "179px",
            flexShrink: 0,
          }}
        >
          <div className="flex justify-between">
            <Controller
              name="petName"
              control={control}
              rules={{ required: "Required*" }}
              render={() => {
                return (
                  <IonInput
                    fill="outline"
                    placeholder="Full Name"
                    className="custom-input "
                    autocomplete="new-password"
                    value={getValues("petName")}
                    onIonInput={(e: any) => {
                      setValue("petName", e.detail.value);
                    }}
                    onIonBlur={() => clearErrors("petName")}
                  />
                );
              }}
            />
            <ErrorMessage
              errors={errors}
              name="petName"
              render={({ message }) => (
                <div className="text-red text-xxs">{message}</div>
              )}
            />
            <Controller
              name="petType"
              control={control}
              rules={{ required: "Required*" }}
              render={() => {
                return (
                  <IonSelect
                    aria-label="PetType"
                    className="custom-input ml-3 "
                    placeholder="Pet Type"
                    fill="outline"
                    value={getValues("petType")}
                    onIonChange={(e) => {
                      setValue("petType", e.detail.value);
                    }}
                    onIonBlur={() => clearErrors("petType")}
                  >
                    <IonSelectOption value="Dog">Dog</IonSelectOption>
                    <IonSelectOption value="Cat">Cat</IonSelectOption>
                    <IonSelectOption value="Other">Other</IonSelectOption>
                  </IonSelect>
                );
              }}
            />
            <ErrorMessage
              errors={errors}
              name="petType"
              render={({ message }) => (
                <div className="text-red text-xxs">{message}</div>
              )}
            />
          </div>

          <div className="flex justify-between items-center my-3 w-full">
            <div className="w-1/2">
              <Controller
                name="gender"
                control={control}
                rules={{ required: "Required*" }}
                render={() => {
                  return (
                    <div className="w-[96%]">
                      <IonSelect
                        aria-label="gender"
                        placeholder="Gender"
                        fill="outline"
                        value={getValues("gender")}
                        onIonChange={(e) => {
                          setValue("gender", e.detail.value);
                        }}
                        onIonBlur={() => clearErrors("gender")}
                      >
                        <IonSelectOption value="male">Male</IonSelectOption>
                        <IonSelectOption value="female">Female</IonSelectOption>
                      </IonSelect>
                    </div>
                  );
                }}
              />
              <ErrorMessage
                errors={errors}
                name="gender"
                render={({ message }) => (
                  <div className="text-red text-xxs mt-[5px]">{message}</div>
                )}
              />
            </div>
            <div className="flex justify-between items-center w-1/2 ">
              <div className="ml-1.5">
                <Controller
                  name="age"
                  aria-label="age"
                  control={control}
                  rules={{ required: "Required*" }}
                  render={() => {
                    return (
                      <div className="flex items-center w-[75px]">
                        <IonInput
                          fill="outline"
                          type="text"
                          inputMode="numeric"
                          autocomplete="new-password"
                          className="custom-age_input w-[42px]"
                          value={getValues("age")}
                          onIonInput={(e: any) => {
                            setValue("age", e.detail.value);
                          }}
                          onIonBlur={() => clearErrors("age")}
                        />

                        <IonLabel className=" font-bold pl-1">
                          Yrs
                        </IonLabel>
                      </div>
                    );
                  }}
                />
                <ErrorMessage
                  errors={errors}
                  name="age"
                  render={({ message }) => (
                    <div className="text-red text-xxs mt-[5px]">{message}</div>
                  )}
                />
              </div>
              <div>
                <Controller
                  name="weight"
                  control={control}
                  rules={{ required: "Required*" }}
                  render={() => {
                    return (
                      <div className="flex items-center w-[67px]">
                        <IonInput
                          fill="outline"
                          type="text"
                          inputMode="numeric"
                          className="custom-age_input"
                          value={getValues("weight")}
                          onIonInput={(e: any) => {
                            setValue("weight", e.detail.value);
                          }}
                          onIonBlur={() => clearErrors("weight")}
                        />
                        <IonLabel className="font-bold pl-1">Kg</IonLabel>
                      </div>
                    );
                  }}
                />
                <ErrorMessage
                  errors={errors}
                  name="weight"
                  render={({ message }) => (
                    <div className="text-red text-xxs mt-[5px]">{message}</div>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <Controller
              name="chipNumber"
              control={control}
              render={() => {
                return (
                  <IonInput
                    fill="outline"
                    placeholder="Chip Number"
                    className="custom-input mr-3 px-3"
                    value={getValues("chipNumber")}
                    onIonInput={(e: any) => {
                      setValue("chipNumber", e.detail.value);
                    }}
                    onIonBlur={() => clearErrors("chipNumber")}
                  />
                );
              }}
            />
            <ErrorMessage
              errors={errors}
              name="chipNumber"
              render={({ message }) => (
                <div className="text-red text-xxs mt-[5px]">{message}</div>
              )}
            />

            <Controller
              name="breed"
              control={control}
              render={() => {
                return (
                  <IonInput
                    fill="outline"
                    placeholder="Breed"
                    className="custom-input"
                    value={getValues("breed")}
                    onIonInput={(e: any) => {
                      setValue("breed", e.detail.value);
                    }}
                    onIonBlur={() => clearErrors("breed")}
                  />
                );
              }}
            />
            <ErrorMessage
              errors={errors}
              name="breed"
              render={({ message }) => (
                <div className="text-red text-xxs mt-[5px]">{message}</div>
              )}
            />
          </div>
        </form>
        </div>
        <div ref={bottomRef} />
        </div>
        <div className="relative w-full h-[60px]">
            <div className="fixed bottom-0 h-[70px] z-10 bg-white left-0 w-[100%] flex items-center justify-around">
              <IonButton
                // color={"dark"}
                shape="round"
                className="normal-case background-col w-[70px] ml-5 font-openSans"
                onClick={() =>
                  setEditPageEnable(false)
                }
                style={{ color: "#BA3636", fontWeight: 600 }}
              >
                Cancel
              </IonButton>
              <IonButton
                onClick={() => handleClick("save")}
                shape="round"
                className="w-[130px] mr-28 col capitalize font-openSans"
                style={{ fontWeight: 600 }}
              >
                Save
              </IonButton>
              <div className="absolute right-2">
                <IonImg src={catButton} className="h-21 w-21" />
              </div>
            </div>
          </div>
        {/* <div className="relative w-full h-[50px] mb-0 pb-0">
            <div className="w-[100%] fixed -bottom-1 left-0 flex items-center justify-between h-[50px] bg-[#fff] z-10">
              <IonButton
                // color={"dark"}
                shape="round"
                className="normal-case background-col w-[70px] ml-5 font-openSans"
                onClick={() =>
                  setEditPageEnable(false)
                }
                style={{ color: "#BA3636", fontWeight: 600 }}
              >
                Cancel
              </IonButton>

              <IonButton
                onClick={() => handleClick("save")}
                shape="round"
                className="w-[130px] col capitalize font-openSans"
                style={{ fontWeight: 600 }}
              >
                Save
              </IonButton>
              <div className="h-full mr-3 mt-2">
                <IonImg src={catButton} className="h-[50px] w-[50px]" />
              </div>
            </div>
        </div>   */}
      </IonContent>
    </IonPage>
  );
};

export default EditPetDetails;
