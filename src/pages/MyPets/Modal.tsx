import { IonIcon, IonItem, IonPopover } from "@ionic/react";
import {
  arrowBackCircleOutline,
  arrowForwardOutline,
  caretDownOutline,
  colorFill,
  document,
} from "ionicons/icons";
import { getImageByName } from "../../utils/imagesUtil";
// import { useEffect, useState } from "react";
import {
  deleteLabPic,
  deleteMedicalPic,
  deletePrescriptionPic,
  getMedicalCard,
  getPrescription,
  getReportCard,
  getTreatmentDateWithTime,
  postMedicalCard,
  postPrescription,
  postReportCard,
  treatementHistoryofPet,
} from "../../service/services";
import moment from "moment";

import { ErrorMessage } from "@hookform/error-message";
import {
  IonContent,
  IonImg,
  IonLabel,
  IonLoading,
  IonModal,
  IonText,
} from "@ionic/react";
import Cropper from "react-easy-crop";
import { useEffect, useRef, useState } from "react";
import FilePreview from "../../components/PdfViewPage";
import { useIonToast } from '@ionic/react';

export default function ModalForReport({
  setShowAdditionalModal,
  setShowDropdown,
  showAdditionalModal,
  showDropdown,
  petId,
  date,
  handleGetTreatmentDate
}: any) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<any>({});
  const [allListOfTreatment, setAllListOfTreament] = useState<any>([]);
  const [petHistoryData, setPetHistoryData] = useState<any>([]);
  const [treatementIdFromSelectedDate, setTreatementIdFromSelectedDate] =
    useState<any | null>("");
  const [previewImageDisplay, setPreviewImageDisplay] = useState<any | null>(
    null
  );
  const [flagForSelectBox, setFlagForSelectBox] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [presentToast] = useIonToast();

  useEffect(() => {
    if (showAdditionalModal.show == true) {
      getTreatmentDate();
    }
  }, [showAdditionalModal]);

  useEffect(() => {
    if (allListOfTreatment && allListOfTreatment.length == 1) {
      setFlagForSelectBox(false);
      handleClickPetHistory(allListOfTreatment[0]._id);
    } else {
      setFlagForSelectBox(true);
    }
  }, [allListOfTreatment]);

  async function getTreatmentDate() {
    const response = await getTreatmentDateWithTime(petId, date);
    const data= response?.data?.[0]?.treatmentList
    if (!Array.isArray(data)) {
      return;
    }
    const sorted = [...data].sort((a, b) => {
      return new Date(a.treatmentDone).getTime() - new Date(b.treatmentDone).getTime();
    });
    // setAllListOfTreament(sorted);
    setTreatementIdFromSelectedDate(sorted[0]._id)
    console.log("data reverser: ", sorted[0]._id)
  }

  useEffect(() => {
    if (
      treatementIdFromSelectedDate &&
      treatementIdFromSelectedDate.length > 0
    ) {
      getAlltreatmentImage();
    }
  }, [treatementIdFromSelectedDate]);

  async function uploadPetHistroyImage(data: any) {
    setIsLoading(true);
    const formData = new FormData();

    // Ensure that data is an array, even if it's a single file
    const filesArray = Array.isArray(data) ? data : [data];
    if (!filesArray?.length) {
      console.error("No files selected.");
      return;
    }

    const allFiles = filesArray && filesArray.map(async (file: any) => {
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

    let response;
    if (
      showAdditionalModal?.type === "Medical Card" &&
      treatementIdFromSelectedDate
    ) {
      response = await postMedicalCard(
        treatementIdFromSelectedDate,
        petId,
        formData
      );
    } else if (showAdditionalModal?.type === "Lab Report") {
      response = await postReportCard(
        treatementIdFromSelectedDate,
        petId,
        formData
      );
    } else {
      response = await postPrescription(
        treatementIdFromSelectedDate,
        petId,
        formData
      );
    }
    setPetHistoryData(response);
    handleGetTreatmentDate()
    await getAlltreatmentImage();
    setIsLoading(false);
    presentToast({
      message: "File Uploaded Successfully",
      duration: 2000,
      color: 'success',
    });
  }

  async function getAlltreatmentImage() {
    const data = {
      pet: petId,
      treatment: treatementIdFromSelectedDate,
    };
    let response;
    if (showAdditionalModal?.type === "Medical Card") {
      response = await getMedicalCard(data);
    } else if (showAdditionalModal?.type === "Lab Report") {
      response = await getReportCard(data);
    } else {
      response = await getPrescription(data);
    }
    setPreviewImage(response?.result);
    setPreviewImageDisplay({
      url: response?.result[0]?.image_base_url,
      id: response?.result[0]?.id,
      contentType: response?.result[0]?.contentType,
    });
  }

  function handleClickPetHistory(id: any) {
    setTreatementIdFromSelectedDate(id);
  }

  const handleFileInputChange = async () => {
    // clearErrors("fileInput");
    const files = inputFileRef.current?.files;

    if (files && files.length > 0) {
      const newSelectedFile = files[0];

      setPreviewImage(URL.createObjectURL(newSelectedFile));
      await uploadPetHistroyImage(newSelectedFile);
    }
  };

  console.log("check list trear: ", allListOfTreatment);

  async function deletePic(id: any) {
    try {
      setIsLoading(true);
      let response;
      if (showAdditionalModal?.type === "Medical Card") {
        response = await deleteMedicalPic(id);
      } else if (showAdditionalModal?.type === "Lab Report") {
        response = await deleteLabPic(id);
      } else {
        response = await deletePrescriptionPic(id);
      }
      // const response = await deleteLabPic(id);
      console.log("Picture deleted successfully:", response);
      await getAlltreatmentImage();
      presentToast({
        message: "File Deleted Successfully",
        duration: 2000,
        color: 'success',
      });
      setIsLoading(false);

    } catch (error) {
      setIsLoading(false);
      console.error("Error deleting picture:", error);
    }
  }

  return (
    <>
    
      {isLoading && <IonLoading
        isOpen={isLoading}
        message={"Please wait..."}
        style={{ background: "white" }}
      />}
      <IonModal
        isOpen={showAdditionalModal?.show}
        onDidDismiss={() => setShowAdditionalModal({ show: false, type: "" })}
      >
         <div className="relative w-full mt-2">
            <IonIcon
              onClick={() => {
                setShowAdditionalModal({ show: false, type: "" });
                setTreatementIdFromSelectedDate("");
                setPreviewImageDisplay(null);
                setPreviewImage({});
                setAllListOfTreament([]);
              }}
              className="absolute top-8 left-3 h-7 w-7  text-[#3128da] cursor-pointer"
              icon={arrowBackCircleOutline}
            />
          <div className="flex my-[35px] justify-center w-[70%] mx-auto relative">
            
            {/* <img
                src={getImageByName("logo")}
                className="w-[50px] h-[20px]"
              /> */}
            <IonText className="text-lg font-segoe font-semibold pr-3">
              {showAdditionalModal?.type}
            </IonText>
          
          </div>
          {treatementIdFromSelectedDate.length>0 ? <div
            className=" relative mt-6 h-[550px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px]"
            style={{
              //  border: "1px solid rgba(25, 35, 131, 0.29)",
              borderRadius: "5px",
              fontFamily: "Open Sans",
            }}
          >
            <div className="h-full w-full relative">
              
              <div className="flex absolute left-[298px] bottom-[75px] items-center w-full">
                  
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
              {Array.isArray(previewImage) && previewImage.length > 0 ? (
                previewImageDisplay?.contentType === "image/jpeg" ? (
                  <img
                    src={previewImageDisplay?.url}
                    alt="url is not valid"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  // <embed
                  //   src={previewImageDisplay.url}
                  //   type="application/pdf"
                  //   className="w-full"
                  //   height="100%"
                  //   width="100%"
                  // />
                  <FilePreview previewImage={previewImageDisplay}/>
                  // <div className="h-full w-full">
                  //   <iframe
                  //     src={previewImageDisplay?.url}
                  //     className="w-full"
                  //     height="90%"
                  //     width="100%"
                  //     title="PDF Preview"
                  //   />
                  // </div>
                )
              ) : (
                <div>
                  <div className="flex justify-center items-center">
                    <IonImg
                      src={getImageByName("samplePicforUpload")}
                      className="h-[400px] w-[200px]"
                    />
                  </div>
                  <div className="flex justify-center items-center">
                    {!flagForSelectBox || previewImage.length === 0 ? (
                      <IonText
                        style={{
                          color: "#B53598",
                          fontFamily: "Open Sans",
                          fontSize: "16px",
                          fontWeight: "700",
                        }}
                        className="uppercase"
                      >
                        UPLOAD {showAdditionalModal?.type}
                      </IonText>
                    ) : (
                      <IonText
                        style={{
                          color: "#B53598",
                          fontFamily: "Open Sans",
                          fontSize: "16px",
                          fontWeight: "700",
                        }}
                        className="uppercase"
                      >
                        Select a date first
                      </IonText>
                    )}
                  </div>
                </div>
              )}
            </div>

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
                {Array.isArray(previewImage) && previewImage.length > 0 ? (
                  Array.isArray(previewImage) &&
                  previewImage.map((file: any, index: number) => (
                    <div className="w-[50px] ml-[10px]" key={file.id}>
                      <div
                        className="w-[45px] h-[45px] flex items-center justify-center mt-0.5 "
                        style={
                          previewImageDisplay?.id == file._id
                            ? {
                                border: "2px solid #FAFF00",
                                borderRadius: "5px",
                              }
                            : {}
                        }
                      >
                        {/* <IonImg
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
                      /> */}
                      {file?.contentType == "image/jpeg" ?
                      <IonIcon
                        onClick={() =>
                          setPreviewImageDisplay({
                            url: file.image_base_url,
                            id: file._id,
                            contentType: file?.contentType,
                          })
                        }
                        src={document}
                        className="h-[45px] w-[45px] overflow-hidden"
                        style={{
                          width: "100%",
                          height: "100%",
                          cursor: "pointer",
                          objectFit: "cover",
                          borderRadius: "5px",
                          color: "white",
                          // border: "1.5px solid #FAFF00",
                        }}
                      />:
                      (<div className={`w-[30px] h-[38px] relative`}>
                      <img
                      onClick={() =>
                        setPreviewImageDisplay({
                          url: file.image_base_url,
                          id: file._id,
                          contentType: file?.contentType,
                        })
                      }
                        style={{
                          borderTopLeftRadius: "5px",
                          borderTopRightRadius: "5px",
                          objectFit: "fill",
                        }}
                        src={getImageByName("pdfImageIcon")}
                        alt="Preview Image"
                        className="w-[100%] h-[100%]"
                      />
                    </div>)
                    }
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full h-full flex justify-center items-center">
                    <p>No document available</p>
                  </div>
                )}
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
                  onChange={() =>
                    treatementIdFromSelectedDate.length > 0
                      ? handleFileInputChange()
                      : {}
                  }
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
                onClick={() =>
                  treatementIdFromSelectedDate.length > 0
                    ? inputFileRef.current?.click()
                    : {}
                }
                >
                <IonText
                  className="flex ml-2 w-[110px] justify-start items-center"
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  Add New Doc
                </IonText>
                <IonImg
                  src={getImageByName("whiteAdd")}
                  className="absolute mr-3 h-[30px] w-[30px] top-0.5 -right-2.5"
                />
                </div>
              </div>
            </div>
            </div>
          </div> : 
          <div className="font-bold font-segoe p-5">Treatment History not Available !</div>}
        </div>
        
      </IonModal>
    </>
  );
}
