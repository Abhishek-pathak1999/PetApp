import {
  IonModal,
  IonButton,
  IonText,
  IonIcon,
  IonCardContent,
  IonCard,
  IonCardHeader,
  IonImg,
  IonContent,
} from "@ionic/react";
import { chevronBackOutline, closeOutline, arrowBackCircleOutline } from "ionicons/icons";
import { getImageByName } from "../utils/imagesUtil";
import { useEffect, useState } from "react";
import moment from "moment";

interface TreatmentsCompleteModelProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any;
}

const TreatmentsCompleteModel: React.FC<TreatmentsCompleteModelProps> = ({
  isOpen,
  onClose,
  data,
}) => {
    const [clickedRowIndex, setClickedRowIndex] = useState(null);
    const [filteredData, setFilteredData] = useState<any>([]);
    const [dataOnlyForShow, setDataOnlyForShow] = useState<any>([]);

    useEffect(()=>{
      if(filteredData.length>0){
        getUnmatchedPetDataPayload(filteredData, data);
        
      }
      
    },[filteredData])

    console.log("dataOnlyForShow: ", dataOnlyForShow)

    useEffect(()=>{
      const treatmentItems = data.treatmentItem;
      const groupedProductsByPetId = treatmentItems.reduce((acc: any, currentItem: any) => {
        const petId = currentItem.pet._id;

        if (!acc[petId]) {
          acc[petId] = {
            pet: currentItem.pet,
            products: [],
            total_amount: 0
          };
        }

        // Add the current product to the products array
        acc[petId].products.push({
          ...currentItem.product,
          quantity: currentItem.quantity ,
          itemCost: currentItem.cost
        });

        

        // acc[petId].products.push(currentItem.product);

        // Add the unit_cost of the current product to total_amount
        acc[petId].total_amount += (currentItem.cost);

        return acc;
      }, {});

      // Convert the object into an array of objects, where each object contains pet data, the corresponding products, and the total amount
      const result = Object.keys(groupedProductsByPetId).map(petId => ({
        pet: groupedProductsByPetId[petId].pet,
        products: groupedProductsByPetId[petId].products,
        total_amount: groupedProductsByPetId[petId].total_amount
      }));

      setFilteredData(result)

    },[data])

  console.log("data Modal filteredData: ", filteredData);
  console.log("data Modal data: ", data);


  const truncateText = (text: any, maxLength: any) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const handleRowClick = (index: any) => {
    setClickedRowIndex(clickedRowIndex === index ? null : index);
  };

  const totalSum = filteredData && filteredData.reduce((acc: any, item: any) => acc + item.total_amount, 0);

  const getUnmatchedPetDataPayload = (filterData:any, data:any) => {
    const matchedIds = filterData.map((item:any) => item.pet._id);
      const unmatched = data.appointment.pets.filter(
        (pet:any) => !matchedIds.includes(pet._id)
      );
      setDataOnlyForShow(unmatched)
    
  };




  return (
    <IonModal
      className="treatmentComp overflow-y-scroll"
      isOpen={isOpen}
      onDidDismiss={onClose}
    >
      <div>
        <IonIcon
          onClick={onClose}
          className=" h-7 w-7 mt-10 ml-3  text-[#fff] transition-transform duration-150 ease-in-out active:text-gray active:scale-95 touch-none"
          icon={arrowBackCircleOutline}
        />

        <div className="flex flex-col  items-center border-b text-[#fff] top-16 w-full">
          <IonText className="text-[14px] font-bold custom-text">
            Treatments Done at Dr. {data?.appointment?.doctor?.first_name}{" "}
            {data?.appointment?.doctor?.last_name}'s Clinic
          </IonText>

          <div className=" w-full font-bold flex justify-around items-center py-2 ">
            <IonText className="text-[12px] custom-text">
              Date: {moment(data?.treatmentDone).format("DD MMM YYYY")}
            </IonText>
            <IonText className="text-[14px] custom-text">
              Amount Paid: ₹ {totalSum}
            </IonText>
          </div>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
            {filteredData?.map((item:any, index:any)=>(
            <IonCard
            className="mx-7  "
            style={{
                borderRadius: "10px",
                border: "1px solid #2C60AF",
                background: "#F7FAFA",
                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
            >
            <IonCardHeader style={{ margin: 0, padding: 0 }}>
                <div className="flex justify-between items-center mx-4 mt-2 mb-1 ">
                <div className="flex justify-between items-center">
                        <img
                        src={
                          item?.pet?.image_base_url 
                            ? item?.pet?.image_base_url
                            : item?.pet?.animal_type === "Cat"
                            ? getImageByName("catfree")
                            : item?.pet?.animal_type === "Dog"
                            ? getImageByName("dogfree")
                            : getImageByName("otherfree")
                        }
                        style={{ borderRadius: "100%" }}
                        onError={(e: any) => {
                            if (item?.pet?.animal_type === "Cat") {
                            e.currentTarget.src = getImageByName("catfree");
                            } else if (item?.pet?.animal_type === "Dog") {
                            e.currentTarget.src = getImageByName("dogfree");
                            } else {
                            e.currentTarget.src = getImageByName("otherfree");
                            }
                        }}
                        className="w-[40px] h-[40px] object-cover"
                        />
                    <IonText className="font-bold font-openSans text-[13px] text-[#000] ml-2 tracking-wideCustom">
                    {item?.pet?.pet_name}
                    </IonText>
                </div>
                <IonText
                    style={{
                    color: "#000",
                    fontFamily: "Open Sans",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: "600",
                    lineHeight: "110%",
                    letterSpacing: "2.24px",
                    textTransform: "uppercase",
                    }}
                >
                    PAID : ₹ {item?.total_amount}
                </IonText>
                </div>
                <div className="border-[1px] border-[#C8ABAB] w-full mb-2"></div>
            </IonCardHeader>

            <IonCardContent>
                <table className="min-w-full mx-1 font-openSans" style={{ tableLayout: 'fixed', width: '100%' }}>
                    <thead className="bg-gray-50">
                    <tr>
                        <th
                        className="text-black text-left text-xs font-bold uppercase tracking-wideCustom"
                        style={{ width: '33%' }}
                        >
                        Item Name
                        </th>
                        <th
                        className="text-black text-left text-xs font-bold uppercase tracking-wideCustom"
                        style={{ width: '33%' }}
                        >
                        Item Type
                        </th>
                        <th
                        className="text-black text-left text-xs font-bold uppercase tracking-wideCustom"
                        style={{ width: '33%' }}
                        >
                        Item Cost
                        </th>
                    </tr>
                    </thead>

                    <tbody className=" custom-table2 tracking-wideCustom">
                    {item?.products.map((item:any, index:any)=>(
                      <tr onClick={() => handleRowClick(index)}>
                        <td className="pt-2">
                            {clickedRowIndex === index
                          ? item?.name
                          : truncateText(item?.name, 8)}
                        </td>
                        <td className="pt-2">
                        {clickedRowIndex === index
                          ? item?.category
                          : truncateText(item?.category, 8)}</td>
                        <td className="pt-2">{clickedRowIndex === index
                          ? (item?.itemCost)
                          : truncateText(item?.itemCost, 8)}</td>
                    </tr>))}
                    </tbody>
                </table>
                </IonCardContent>

            </IonCard>))}
            {dataOnlyForShow.length >0 && dataOnlyForShow?.map((item:any, index:any)=>
            <IonCard
            className="mx-7  "
            style={{
                borderRadius: "10px",
                border: "1px solid #2C60AF",
                background: "#F7FAFA",
                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
            >
            <IonCardHeader style={{ margin: 0, padding: 0 }}>
                <div className="flex justify-between items-center mx-4 mt-2 mb-1 ">
                <div className="flex justify-between items-center">
                        <img
                        src={
                          item?.image_base_url 
                            ? item?.image_base_url
                            : item?.animal_type === "Cat"
                            ? getImageByName("catfree")
                            : item?.pet?.animal_type === "Dog"
                            ? getImageByName("dogfree")
                            : getImageByName("otherfree")
                        }
                        style={{ borderRadius: "100%" }}
                        onError={(e: any) => {
                            if (item?.animal_type === "Cat") {
                            e.currentTarget.src = getImageByName("catfree");
                            } else if (item?.pet?.animal_type === "Dog") {
                            e.currentTarget.src = getImageByName("dogfree");
                            } else {
                            e.currentTarget.src = getImageByName("otherfree");
                            }
                        }}
                        className="w-[40px] h-[40px] object-cover"
                        />
                    <IonText className="font-bold font-openSans text-[13px] text-[#000] ml-2 tracking-wideCustom">
                    {item?.pet_name}
                    </IonText>
                </div>
                
                </div>
                <div className="border-[1px] border-[#C8ABAB] w-full mb-2"></div>
            </IonCardHeader>

            <IonCardContent>
                <div className="text-black">No data Available</div>
                </IonCardContent>

            </IonCard>
            )}
        </div>
      </div>
    </IonModal>
  );
};

export default TreatmentsCompleteModel;
