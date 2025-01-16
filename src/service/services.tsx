import { useEffect } from "react";
import { API_BASE_URL } from "../config";
import { Preferences } from "@capacitor/preferences";

export async function getHeaders() {
  const { value: token } = await Preferences.get({ key: "token" });
  const now = new Date();
  const frontendDateTime = now.toUTCString();
  const options: any = {
    hour: '2-digit',
    minute: '2-digit',
    second: undefined,
  };
  const frontendLocalTime = now.toLocaleTimeString(undefined, options);

  now.setHours(0, 0, 0, 0);
  const frontendDate = now.toUTCString();

  let headers: any = {
    "Content-Type": "application/json",
    Accept: "application/json",
    frontenddate: frontendDate,
    frontenddatetime: frontendDateTime,
    frontendtime: frontendLocalTime,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

export async function getHeaderForRefreshToken() {
  const { value: refreshToken } = await Preferences.get({ key: "refreshToken" });
  const now = new Date();
  const frontendDateTime = now.toUTCString();
  const options: any = {
    hour: '2-digit',
    minute: '2-digit',
    second: undefined,
  };
  const frontendLocalTime = now.toLocaleTimeString(undefined, options);

  now.setHours(0, 0, 0, 0);
  const frontendDate = now.toUTCString();

  let headers: any = {
    "Content-Type": "application/json",
    Accept: "application/json",
    frontenddate: frontendDate,
    frontenddatetime: frontendDateTime,
    frontendtime: frontendLocalTime,
  };

  if (refreshToken) {
    headers["refreshToken"] = `${refreshToken}`;
  }

  return headers;
}

export async function getHeadersForFileUpload() {
  const { value: token } = await Preferences.get({ key: "token" });
  const now = new Date();
  const frontendDateTime = now.toUTCString();
  const options: any = {
    hour: '2-digit',
    minute: '2-digit',
    second: undefined,
  };
  const frontendLocalTime = now.toLocaleTimeString(undefined, options);

  now.setHours(0, 0, 0, 0);
  const frontendDate = now.toUTCString();

  let headers: any = {
    frontenddate: frontendDate,
    frontenddatetime: frontendDateTime,
    frontendtime: frontendLocalTime,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

export const handlePetsInfo = async (id: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/getPet`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify({ _id: id }),
    });
    const parsedResponse = await response.json();

    return parsedResponse;
  } catch (err: any) {
    console.error("Request timed out");
  }
};

export const handleGenerateOtpForUser = async (mobileNumber: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sendotp`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify({ phoneNumber: mobileNumber }),
    });
    const parsedResponse = await response.json();

    return { ...parsedResponse, status: response.status };
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export const handleVerifyOtpp = async (data: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/verifyOtp`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify({
        ...data
      }),
    });
    const parsedResponse = await response.json();

    return { ...parsedResponse, status: response.status };
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};


// /api/verifyOtp
export const handleGenerateRefreshToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/refreshtoken`, {
      method: "POST",
      headers: await getHeaderForRefreshToken(),
    });
    const parsedResponse = await response.json();

    return { ...parsedResponse, status: response.status };
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export const handleGetAllPets = async (token: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pet`, {
      headers: await getHeaders(),
    });
    const parsedResponse = await response.json();
    return parsedResponse;
  } catch (err: any) {
    console.error("Request timed out");
  }
};
// /api/parent
export const handleGetParentData = async (token: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/parent`, {
      headers: await getHeaders(),
    });
    const parsedResponse = await response.json();
    return { ...parsedResponse, status: response.status };
    // return parsedResponse;
  } catch (err: any) {
    console.error("Request timed out");
    return { status: 500 };
  }
};

// petApi.ts
export const handleGetDoctors = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/parent/doctor`, {
      method: "GET",
      headers: await getHeaders(),
    });
    const parsedJson = await response.json();
    return parsedJson?.result;
  } catch (error) {
    throw error;
  }
};

export const createOrUpdatePet = async (petData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/createPet`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify({ ...petData }),
    });
    const parsedResponse = await response.json();
    return { ...parsedResponse, status: response.status };
    // return 
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export const uploadFileForPet = async (
  token: string | null,
  formData: any,
  id: any,
  index: any
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/upload/pet/${id}`,
      {
        method: "POST",
        body: formData,
        headers: await getHeadersForFileUpload(),
      }
    );

    return response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export const createOrUpdateParent = async (
  token: string | null,
  parentData: any
) => {
  try {
    const header = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/api/createParent`, {
      method: "POST",
      headers: header,
      body: JSON.stringify({ ...parentData }),
    });
    const parsedResponse = await response.json();
    return { ...parsedResponse, status: response.status };
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export const uploadFileForParent = async (
  token: string | null,
  formData: any,
  id: any
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/upload/owner/${id}`, {
      method: "POST",
      body: formData,
      headers: await getHeadersForFileUpload(),
    });

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export const treatementHistoryofPet = async (token: string | null, id: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/treatment/history/item`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: id,
    });

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export const getSlotsdata = async (id: any, slotType: any, slotDate: any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/time/slot/doctor/${id}?slotType=${slotType}&slotDate=${slotDate}`,
      {
        method: "GET",
        headers: await getHeaders(),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export const createAppointmentByPetOwner = async (data: any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/createAppointmentByPetOwner`,
      {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify({ ...data }),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export const getTreatmentDatelist = async (petId: any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/treatment/done/date/list?petId=${petId}`,
      {
        method: "GET",
        headers: await getHeaders(),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};
// 
export const getTreatmentHistory = async (petId: any, date:any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/treatment/history?petId=${petId}&date=${date}`,
      {
        method: "GET",
        headers: await getHeaders(),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};


export const postMedicalCard = async (id : any, petId : any, data: any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/medicalcard/upload/treatment/${id}/pet/${petId}`,
      {
        method: "POST",
        headers: await getHeadersForFileUpload(),
        body: data,
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export const postPrescription = async (id : any, petId : any, data: any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/prescription/upload/treatment/${id}/pet/${petId}`,
      {
        method: "POST",
        headers: await getHeadersForFileUpload(),
        body: data,
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export const postReportCard = async (id : any, petId : any, data: any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/report/upload/treatment/${id}/pet/${petId}`,
      {
        method: "POST",
        headers: await getHeadersForFileUpload(),
        body: data,
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export const getMedicalCard = async (data: any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/medicalcard/uploadlist`,
      {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify({ ...data }),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export const getPrescription = async (data: any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/prescription/uploadlist`,
      {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify({ ...data }),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export const getReportCard = async (data: any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/report/uploadlist`,
      {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify({ ...data }),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};


export const getTreatmentDateWithTime = async (petId: any, date:any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/treatment/list?petId=${petId}&date=${date}`,
      {
        method: "GET",
        headers: await getHeaders(),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export const deletePetPic = async (picId: any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/removePetImage/${picId}`,
      {
        method: "DELETE",
        headers: await getHeaders(),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};


export const deletePrescriptionPic = async (picId: any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/prescription/delete/${picId}`,
      {
        method: "DELETE",
        headers: await getHeaders(),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export const deleteLabPic = async (picId: any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/report/delete/${picId}`,
      {
        method: "DELETE",
        headers: await getHeaders(),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export const deleteMedicalPic = async (picId: any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/medicalcard/delete/${picId}`,
      {
        method: "DELETE",
        headers: await getHeaders(),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export const makeProfilePetPic = async (petId:any, picId: any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/uploadPetProfile/image/pet/${petId}/profile/${picId}`,
      {
        method: "POST",
        headers: await getHeaders(),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};


export const getAllProducts = async (petType: any, brandId: any) => {
  try {
    // Construct the query string dynamically
    const queryParams = new URLSearchParams({ petType });
    if (brandId) {
      queryParams.append("brandId", brandId);
    }
  
    const response = await fetch(
      `${API_BASE_URL}/api/store/product?${queryParams.toString()}`,
      {
        method: "GET",
        headers: await getHeaders(),
      }
    );
  
    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
  
};

export async function getPrivacyData(){
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/app/document?systemKey=policy`,
      {
        method: "GET",
        headers: await getHeaders(),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
} 

export const checkAppVersion = async (systemKeyy:any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/getSystemSetting`,
      {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify({ systemKey : systemKeyy }) 
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export async function getContactSupport(){
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/app/document?systemKey=contact`,
      {
        method: "GET",
        headers: await getHeaders(),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
} 

export const selectProduct = async (productId:any, petId:any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/store/product/${productId}/pet/${petId}`,
      {
        method: "PUT",
        headers: await getHeaders(),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export const getSelectedProducts = async (petId: any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/store/product/pet/${petId}`,
      {
        method: "GET",
        headers: await getHeaders(),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};


export const deleteSelectedProducts = async (productId: any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/store/product/map/${productId}`,
      {
        method: "DELETE",
        headers: await getHeaders(),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export const deleteAppointment = async (appointmentId: any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/cancel/appointment/${appointmentId}`,
      {
        method: "DELETE",
        headers: await getHeaders(),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};


export const getUpComingAppointment = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/upcoming/appointment`,
      {
        method: "GET",
        headers: await getHeaders(),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};


export const getTreatmentDone = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/treatment/done/and/cancel`,
      {
        method: "GET",
        headers: await getHeaders(),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};


export const getNotifications = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/notification/list`,
      {
        method: "GET",
        headers: await getHeaders(),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};


export const getVideos = async (videoType: any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/recording/video?VideoType=${videoType}`,
      {
        method: "GET",
        headers: await getHeadersForFileUpload(),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};


export const getVideoComment = async (videoId: any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/video/${videoId}/comment`,
      {
        method: "GET",
        headers: await getHeaders(),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export const postVideoComment = async (videoId: any, msg:any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/video/${videoId}/comment`,
      {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify({ comment : msg }) 
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};


export const postVideoLike = async (videoId: any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/video/${videoId}/Like?type=thumbs_up`,
      {
        method: "POST",
        headers: await getHeaders()
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export const getVideoLike = async (videoId: any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/video/${videoId}/likecount`,
      {
        method: "GET",
        headers: await getHeaders(),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export const getPicOfNotification = async (id: any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/notification/upload/list/${id}`,
      {
        method: "GET",
        headers: await getHeaders(),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export const getBrand = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/store/product/brands`,
      {
        method: "GET",
        headers: await getHeaders(),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export const postProduct = async (data:any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/store/product`,
      {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify(data) 
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export const getProductForRemainder = async (petId:any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/treatment/upcoming?petId=${petId}`,
      {
        method: "GET",
        headers: await getHeaders(),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export const getAllVideoForHome = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/video`,
      {
        method: "GET",
        headers: await getHeaders(),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};


export const requestHome = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/appointment/home`,
      {
        method: "POST",
        headers: await getHeaders(),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
};

export async function getGoogleMapKey(){
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/app/document?systemKey=GMKey`,
      {
        method: "GET",
        headers: await getHeaders(),
      }
    );

    return await response.json();
  } catch (err: any) {
    console.error("Request timed out", err);
    return { status: 500 };
  }
}