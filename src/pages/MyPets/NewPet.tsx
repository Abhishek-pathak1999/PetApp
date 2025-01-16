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
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { API_BASE_URL } from "../../config";
import { Preferences } from "@capacitor/preferences";
import { useHistory } from "react-router";
import { useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { createOrUpdatePet, uploadFileForPet } from "../../service/services";
import manPic from "../../assets/man-take-pic-dog.png";
import add from "../../assets/Add.png";
import catButton from "../../assets/cat-button.png";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/crop";

// interface NewPetProps {
//     type?: string;
//     id?: string;
// }

const NewPet = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const queryCache = useQueryClient();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    undefined
  );
  const [token, setToken] = useState<null | string>(null);
  const [imageForCrop,setImageForCrop] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
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

  // useEffect(() => {
  //     if (petData) {
  //         setValue("petName", petData?.result?.pet_name);
  //         setValue("chipNumber", petData?.result?.chip_number);
  //         setValue("gender", petData?.result?.gender);
  //         setValue("age", petData?.result?.age);
  //         setValue("weight", petData?.result?.weight);
  //         setValue("breed", petData?.result?.breed);
  //         setSelectedFiles(petData?.result?.images);
  //         setPreviewImage(petData?.result?.images?.[0]?.uploadImageUrl);
  //     }
  // }, [petData]);

  // const handleFileInputChange = () => {
  //     clearErrors("fileInput");
  //     const files = inputFileRef.current?.files;

  //     if (files && files.length > 0) {
  //         const newSelectedFiles = Array.from(files);
  //         const uniqueNewFiles = newSelectedFiles.filter(
  //             (newFile) =>
  //                 !selectedFiles.some(
  //                     (existingFile: any) =>
  //                         existingFile.fileName === newFile.name ||
  //                         existingFile.name === newFile.name
  //                 )
  //         );
  //         setSelectedFiles((prevFiles) => [...prevFiles, ...uniqueNewFiles]);
  //         setPreviewImage(URL.createObjectURL(files[0]));
  //     }
  // };

  const handleFileInputChange = async () => {
    clearErrors("fileInput");
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
      setSelectedFiles([croppedImage])
      setPreviewImage(URL.createObjectURL(croppedImage));
      // await uploadFile([croppedImage], petData?.result?._id);
      // await handlePetById();
      setIsModalOpen(false);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  // const handleFileInputChange = () => {
  //   clearErrors("fileInput");
  //   const files = inputFileRef.current?.files;

  //   if (files && files.length > 0) {
  //     const selectedFile = files[0];
  //     setSelectedFiles([selectedFile]); // Set the selected file directly
  //     setPreviewImage(URL.createObjectURL(selectedFile));
  //   }
  // };

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);

      const params: any = {
        pet_name: data.petName || "",
        chip_number: data.chipNumber || "",
        gender: data.gender || "",
        age: data.age || 0,
        weight: data.weight || 0,
        breed: data.breed || "",
        animal_type: data.petType || "",
      };

      console.log("Submitting the following payload to API:", params);

      const response = await createOrUpdatePet(params);
      if (response.status == 201) {
        await uploadFile(selectedFiles, response.result._id);
        toast.success("Pet created successfully!");
        history.goBack();
      }

      setIsLoading(false);
      return true;
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      toast.error("Failed to create pet. Please try again.");
      throw err;
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
    const index = 1;
    const response = await uploadFileForPet(token, formData, id, index);
    history.goBack();
    return response;
  };

  if (isLoading) {
    return <IonLoading isOpen={isLoading} />;
  }

  return (
    <IonPage className="overflow-y-auto ">
      <IonContent className="">
        <div
          className=" relative mt-6 h-[264px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px]"
          style={{
            // border: "1px solid rgba(25, 35, 131, 0.29)",
            borderRadius: "5px",
            fontFamily: "Open Sans",
          }}
        >
          {previewImage ? (
            <div className="h-full w-full">
              <IonImg
                src={previewImage}
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
                <IonImg src={manPic} className="h-[170px] w-[200px]"></IonImg>
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
              height: "50px",
              background: "rgba(18, 32, 81, 0.25)",
              borderTop: "1px solid gray",
              display: "flex",
            }}
          >
            <div className="flex w-[250px] overflow-x-scroll">
              {selectedFiles?.length > 0 ? (
                selectedFiles.map((file: any, index:any) => (
                  <div className="w-[50px] ml-[10px]" key={index.toString()}>
                    <div className="w-[50px] m-[5px] h-[50px]">
                      <IonImg
                        key={file?.name ?? file?.fileName}
                        src={
                          file?.uploadImageUrl
                            ? file.uploadImageUrl
                            : file
                            ? URL.createObjectURL(file)
                            : ""
                        }
                        onClick={() =>
                          setPreviewImage(
                            file?.uploadImageUrl
                              ? file.uploadImageUrl
                              : file
                              ? URL.createObjectURL(file)
                              : ""
                          )
                        }
                        style={{
                          width: "100%",
                          height: "100%",
                          cursor: "pointer",
                          objectFit: "cover",
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
            </div>

            <div className="flex items-center justify-center  ">
              <input
                type="file"
                accept="image/jpeg"
                ref={inputFileRef}
                // multiple
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
                      <div className="m-2 z-50 bg-red-500 px-7 py-2 text-white rounded" onClick={() => {setSelectedFiles([]),setIsModalOpen(false)}}>Cancel</div>
                    </div>
                    
                  </IonModal>
                )}
              <div className=" mr-44 w-[1.5px] h-[49px] bg-black" />
              <div className="absolute flex justify-center items-center  right-0">
                <IonText
                  style={{
                    fontFamily: "Open Sans",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#fff",
                    marginBottom: "5px",
                  }}
                >
                  Upload Image
                </IonText>
                <IonImg
                  onClick={() => inputFileRef.current?.click()}
                  src={add}
                  className="mr-3 cursor-pointer transition-transform duration-75 ease-in-out active:scale-95 touch-none"
                />
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
          onSubmit={handleSubmit(onSubmit)}
          ref={formRef}
        >
          <div
            className=" p-4 my-6 mx-4 "
            style={{
              borderRadius: "15px",
              border: "1.5px solid rgba(0, 0, 0, 0.12)",
              background: "rgba(248, 247, 247, 0.00)",
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
                    className="custom-input mt-[10px] "
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
                <div className="text-red text-xxs mt-[5px]">{message}</div>
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
                    className="custom-input mt-[10px] ml-3 "
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
                <div className="text-red text-xxs mt-[5px]">{message}</div>
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
            
          </div>
          <div ref={bottomRef} />
          <div className="relative w-full h-[60px]">
            <div className="fixed bottom-0 h-[70px] z-10 bg-white left-0 w-[100%] flex items-center justify-center">
              <IonButton
                // onClick={() => handleClick("save")}
                type="submit"
                shape="round"
                className="w-[100px] col"
              >
                Save
              </IonButton>
              <div className="absolute -mr-52">
                <IonImg src={catButton} className="h-21 w-21" />
              </div>
            </div>
          </div>
        </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default NewPet;
