import { ErrorMessage } from "@hookform/error-message";
import {
    IonAvatar,
    IonButton,
    IonContent,
    IonImg,
    IonInput,
    IonLabel,
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
import { useHistory, useLocation } from 'react-router';
import { useQuery, useQueryClient } from "react-query";
import { createOrUpdatePet, handleGenerateRefreshToken, handlePetsInfo, uploadFileForPet } from "../service/services";;
import catButton from "../assets/cat-button.png";
import { getImageByName } from "../utils/imagesUtil";

interface NewPetProps {
    type?: string;
    id?: string;
}

interface LocationState {
    details: any;
    currentImageIndex: number;
}


const PetInfo = ({ type, id }: NewPetProps) => {

    const location = useLocation<LocationState>();
    const inputFileRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement | null>(null);
    const queryCache = useQueryClient();
    const history = useHistory();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewImage, setPreviewImage] = useState<string | undefined>(
        undefined
    );
    // const [petData, setPetData] = useState<any>(location?.state?.details)
    const [index, setIndex] = useState<any>(location?.state?.currentImageIndex)
    const [token, setToken] = useState<null | string>(null);
    const flag = true;
    console.log("petDetails: ", index)

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


    console.log("selecetdFile: ", selectedFiles)
    console.log("setPreviewImage: ", previewImage)

    const handleFileInputChange = () => {
        clearErrors("fileInput");
        const files = inputFileRef.current?.files;

        if (files && files.length > 0) {
            const newSelectedFile = files[0];
            setSelectedFiles([newSelectedFile]);
            setPreviewImage(URL.createObjectURL(newSelectedFile));
        }
    };

console.log("HJJH :", selectedFiles)

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

            // if (id) {
            //     params._id = petData._id;
            // }

            const response = await createOrUpdatePet(params)
     
            if (response.result) {
                await uploadFile(selectedFiles, response?.result?._id);
            }
            const parsedResponse = await handleGenerateRefreshToken()
            if (parsedResponse?.status == 200) {
          await Preferences.set({ key: "token", value: parsedResponse?.token });
          queryCache.setQueryData(["token"], () => ({
            token: parsedResponse?.token,
          }));
          return history.push("/pet/info");
        }

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
        const indexs = 1;
        const response = await uploadFileForPet(token, formData, id, indexs)
        return response;
    };

    const handleClick = async (name: string) => {
        await trigger();
        await onSubmit().then(async () => {
            if (name !== "save") {
                reset();
                setPreviewImage(undefined);
                setSelectedFiles([]);
            } else if (type !== "editable") {
                await Preferences.set({
                    key: "isOnBoardingCompleted",
                    value: JSON.stringify(true),
                });
                queryCache.setQueryData(["isOnBoardingCompleted"], () => ({
                    isOnBoardingCompleted: true,
                }));
                return history.push("/dashboard");
            }
            
        });
    };

    // if (isLoading || isPetLoading) {
    //     return <IonLoading isOpen={isLoading} />;
    // }

    return (

        <IonPage >
            <IonContent>

             <div className=' relative mt-6 h-[264px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px]' style={{
                //  border: "1px solid rgba(25, 35, 131, 0.29)", 
                 borderRadius: "5px", fontFamily: "Open Sans" }}>
                {previewImage ? (
                    <div className="h-full w-full">
                        <IonImg src={previewImage} style={{ height: '100%', objectFit: 'cover', borderRadius: '5px' }} />
                    </div>
                ) : (
                    <div>
                        <div className='flex justify-center items-center'>
                            <IonImg src="src/assets/man-take-pic-dog.png" className='h-[170px] w-[200px]'></IonImg>
                        </div>
                        <div className='flex justify-center items-center'>
                            <IonText style={{
                                color: '#B53598',
                                fontFamily: "Open Sans",
                                fontSize: '16px',
                                fontStyle: 'normal',
                                fontWeight: '700',
                                lineHeight: 'normal'
                            }}>UPLOAD PETS'S PICTURE</IonText>
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

                <div className="absolute bottom-0"
                    style={{
                        width: "100%",
                        background: 'rgba(18, 32, 81, 0.25)',
                        borderTop: "1px solid gray",
                        display: "flex",
                        height:"50px"
                    }}
                >
                    <div className="flex w-[250px] overflow-x-scroll">
                        {selectedFiles?.length > 0 ? (
                            selectedFiles.map((file: any, index) => (
                                <div className="w-[50px] ml-[10px]" key={index.toString()}>
                                    <div className="w-[50px] m-[5px] h-[50px]">
                                        <IonImg
                                            key={file?.name ?? file?.fileName}
                                            src={
                                                file?.uploadImageUrl
                                                    ? file.uploadImageUrl
                                                    : file ? URL.createObjectURL(file) : ""
                                            }
                                            onClick={() =>
                                                setPreviewImage(
                                                    file?.uploadImageUrl
                                                        ? file.uploadImageUrl
                                                        : file ? URL.createObjectURL(file) : ""
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
                            multiple
                            className="hidden"
                            onChange={handleFileInputChange}
                        />
                        <div className=" mr-44 w-[1.5px] h-[49px] bg-black" />
                        <div className="absolute flex justify-center items-center  right-0">
                            <IonText style={{ fontFamily: "Open Sans", fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom:"5px" }}>Upload Image</IonText>
                            <IonImg onClick={() => inputFileRef.current?.click()} src={getImageByName("add")} className="mr-3 cursor-pointer" />
                        </div>
                    </div>
                </div>

            </div>

 

            <form autoComplete="off"
                // onSubmit={handleSubmit(onSubmit)}
                ref={formRef} className=" p-3 my-6 mx-4 " style={{
                    borderRadius: '15px',
                    border: '1px solid rgba(0, 0, 0, 0.12)',

                    background: 'rgba(248, 247, 247, 0.00)',
                    width: '332px',
                    height: '259px',
                    flexShrink: 0,
                }}>

                   

                    <div>
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

                    </div>

                    <div className="flex justify-between items-center my-3 w-full">
                        <div>
                            <Controller
                                name="gender"
                                control={control}
                                rules={{ required: "Required*" }}
                                render={() => {
                                    return (
                                        <div className='w-[120%]'>
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
                        <div>
                            <Controller
                                name="age"
                                aria-label="age"
                                control={control}
                                rules={{ required: "Required*" }}
                                render={() => {
                                    return (
                                        <div className='flex items-center  w-full'>
                                            <IonInput
                                                fill="outline"
                                                type="number"

                                                autocomplete="new-password"
                                                className="custom-input  w-[115px]"
                                                value={getValues("age")}
                                                onIonInput={(e: any) => {
                                                    setValue("age", e.detail.value);
                                                }}
                                                onIonBlur={() => clearErrors("age")}
                                            />

                                            <IonLabel className=' font-bold pl-2'>Yrs</IonLabel>
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
                        
                    </div>
                    <div className="flex justify-between items-center my-3 w-full">
                        <div className=" w-[48%]">
                            <Controller
                                    name="petType"
                                    control={control}
                                    rules={{ required: "Required*" }}
                                    render={() => {
                                        return (
                                            <IonSelect
                                                aria-label="PetType"
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

                                <div>


                            <Controller
                                name="weight"
                                control={control}
                                rules={{ required: "Required*" }}
                                render={() => {
                                    return (
                                        <div className='flex items-center w-full'>
                                            <IonInput
                                                fill="outline"
                                                type="number"

                                                className="custom-input  custom w-[115px]"
                                                value={getValues("weight")}
                                                onIonInput={(e: any) => {
                                                    setValue("weight", e.detail.value);
                                                }}
                                                onIonBlur={() => clearErrors("weight")}

                                            />
                                            <IonLabel className='pl-2 font-bold pr-1'>Kg</IonLabel>

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

                    <div className='flex justify-center items-center'>


                        <Controller
                            name="chipNumber"
                            control={control}
                            rules={{ required: "Required*" }}
                            render={() => {
                                return (

                                    <IonInput
                                        fill="outline"
                                        placeholder="Chip Number"
                                        className="custom-input mt-[10px] mr-3 px-3"
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
                            rules={{ required: "Required*" }}
                            render={() => {
                                return (
                                    <IonInput
                                        fill="outline"
                                        placeholder="Breed"
                                        className="custom-input  mt-[10px]"
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
                    
               






                {type !== "editable" ? (
                    <div className="w-[100%] flex items-center justify-center   relative mt-5 ">

                        <IonButton
                            onClick={() => handleClick("save")}
                            shape="round"
                            className="w-[100px] col"
                        >
                            Save
                        </IonButton>
                        <div className='absolute -mr-40 mb-3 ml-7' >
                            <IonImg src={catButton} className="h-22 w-22" />
                        </div>
                    </div>

                    // <div className="flex flex-col items-center mt-[20px]">
                    //     <IonButton
                    //         color={"dark"}
                    //         shape="round"
                    //         className="normal-case w-[200px]"
                    //         onClick={() => handleClick("save")}
                    //     >
                    //         Save 
                    //     </IonButton>

                    /* 
                        <IonButton
                        color={"dark"}
                        shape="round"
                        className="normal-case mt-[5px] w-[200px]"
                        onClick={() => handleClick("addAnother")}
                    >
                        Save & Add Another
                    </IonButton> 
                    
                    */

                    // </div>
                ) : (
                    <div className="w-[90%] mx-auto mt-[10px] flex items-center justify-center">
                        {/* <IonButton
              color={"dark"}
              shape="round"
              className="normal-case w-[100px]"
            >
              Edit
            </IonButton> */}
                        <IonButton
                            color={"dark"}
                            shape="round"
                            className="normal-case mt-[5px] w-[100px] "
                            onClick={() => handleClick("save")}
                        >
                            Save
                        </IonButton>
                    </div>
                )}
            </form>
            </IonContent>
        </IonPage>
    );
};

export default PetInfo;
