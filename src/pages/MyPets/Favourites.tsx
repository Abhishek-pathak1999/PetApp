import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonImg,
  IonLabel,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonToast,
  RefresherEventDetail,
} from "@ionic/react";
import cancel from "../../assets/Cancel.svg";
import amazonCart from "../../assets/Amazon Cart.png";
import { useEffect, useState } from "react";
import {
  deleteSelectedProducts,
  getAllProducts,
  getBrand,
  getSelectedProducts,
  postProduct,
  selectProduct,
} from "../../service/services";
import { getImageByName } from "../../utils/imagesUtil";
import DragButton from "./SlideButton";
import BrandSelector from "./BrandModal";
import FavrouiteLink from "./FavrouiteLinkModal";
import { Icon } from "ionicons/dist/types/components/icon/icon";
import { refreshCircleOutline } from 'ionicons/icons';
import videoText from '../../assets/AffiliatePromo.mp4'

let baseUrl = "http://www.amazon.com/gp/aws/cart/add.html?AssociateTag=abhi1234kk";
let baseUrll = "http://www.amazon.com/gp/aws/cart/add.html?AssociateTag=abhi1234kk";

const Favourites = ({ details }: any) => {
  const [animalType, setAnimalType] = useState<any>({
    petType: "Dog",
    index: 0,
  });
  const [allPetProduct, setAllPetProduct] = useState<any>([]);
  const [selectedProducts, setSelectedProducts] = useState<any>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("success");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [brands, setBrands] = useState<any>([])
  const [isLinkModal, setIsLinkModal] = useState(false); 

  // const brands = ["Brand A", "Brand B", "Brand C", "Brand D"];

  const handleBrandSelect = (brand: any) => {
    setSelectedBrand(brand._id);
    setIsModalOpen(false); // Close the modal after selecting a brand
  };

  useEffect(() => {  
      handleGetAllBrands()
  }, []);

  useEffect(()=>{
    if(animalType){
      handleGetAllProducts(animalType.petType, selectedBrand)
    }
  },[selectedBrand, animalType])

  async function handleGetAllBrands() {
    try {
      const response = await getBrand();
      if (response?.isSuccess) {
        setBrands(response?.result);
      } else {
        console.error("Failed to fetch products:", response);
      }
    } catch (error) {
      console.error("An error occurred while fetching products:", error);
    }
  }

  async function handleGetAllProducts(type: any, id: any) {
    try {
      const response = await getAllProducts(type, id);
      if (response?.isSuccess) {
        setAllPetProduct(response?.result);
      } else {
        console.error("Failed to fetch products:", response);
      }
    } catch (error) {
      console.error("An error occurred while fetching products:", error);
    }
  }

  function handleSelectProduct(item: any) {
    setSelectedProducts((prevSelectedProducts: any[]) => {

      const isAlreadySelected = prevSelectedProducts.some(
        (selectedItem) => selectedItem._id === item._id
      );
  
      if (isAlreadySelected) {
        return prevSelectedProducts.filter(
          (selectedItem) => selectedItem._id !== item._id
        );
      }
  
      return [...prevSelectedProducts, item];
    });
  }
  

  console.log("selectedProducts:  ", selectedProducts)

  async function saveSelectProduct(item: any) {
    try {
      setIsLinkModal(!isLinkModal)
      selectedProducts.forEach((product:any, index:number) => {
        baseUrl += `&ASIN.${index + 1}=${product.name}&Quantity.${index + 1}=1`;
    });
    console.log(baseUrl);
    setIsLinkModal(!isLinkModal)
      // setSelectedProducts([])
      // let response;
      // if (selectedProducts) {
      //   response = await postProduct(selectedProducts);
      // }
      // if (response?.isSuccess) {
      //   setToastMessage(`${response?.message}`);
      //   setToastColor("success");
      //   setShowToast(true);
      //   setSelectedProducts([])
      // } else {
      //   console.error("Failed to fetch products:", response);
      //   setToastMessage(`${response?.message}`);
      //   setToastColor("danger");
      //   setShowToast(true);
      // }
    } catch (error) {
      console.error("An error occurred while fetching products:", error);
    }
  }

  async function handleDelete(product: any) {
    try {
      console.log("deleted Id: ", product)
      const response = await deleteSelectedProducts(product?._id);

      console.log("deleted products: ", response);
    } catch (error) {
      console.error("An error occurred while fetching products:", error);
    }
  }

  const selectedProductIds = selectedProducts && selectedProducts?.map(
    (item: any) => item._id
  );

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    if (animalType && selectedBrand) {
      handleGetAllProducts(animalType.petType, selectedBrand).finally(() => {
        event.detail.complete();
      });
    }else{
      event.detail.complete();
    }
  };

  function handleRefreshBrand(){
    setSelectedBrand("")
  }
  

  return (
    <>
      {showToast && (
        <IonToast
          isOpen={showToast}
          message={toastMessage}
          color={toastColor}
          duration={2000}
          onDidDismiss={() => setShowToast(false)}
        />
      )}
      <IonPage>
        <IonContent>
        {/* <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent
          pullingIcon="arrow-down-circle-outline"
          pullingText="Pull to refresh"
          refreshingSpinner="circles"
          refreshingText="Refreshing..."
          className="bg-white h-[150px]"
        />
      </IonRefresher> */}
          <IonText
            className="block text-center m-0 font-bold text-xs uppercase"
            style={{
              fontFamily: "Open Sans",
              letterSpacing: "1.76px",
            }}
          >
            CHOOSE {details?.result?.pet_name}'S FAVORITE PRODUCTS
          </IonText>
          <div className="relative">
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex justify-center gap-[10px]">
              {["dogImage", "catImage", "otherImage"].map((src, index) => (
                <IonCard
                  key={index}
                  onClick={() => {
                    const selectedValue = ["Dog", "Cat", "Other"][index];
                    setAnimalType({ petType: selectedValue, index: index });
                  }}
                  style={{
                    boxShadow:
                      animalType.index === index
                        ? "rgba(0, 0, 0, 0.25) inset 0px 6px 4px 0px"
                        : "0px 6px 4px 0px rgba(0, 0, 0, 0.12)",
                  }}
                  className="h-[65px] w-[73px] m-0 p-0"
                >
                  <IonCardContent className="flex flex-col items-center justify-center p-1">
                    <IonImg
                      src={getImageByName(`${src}`)}
                      className="w-[4.6875rem] h-[4.3vh] pt-1"
                    />
                    <IonLabel
                      className="text-center text-[0.5rem] text-[#000] font-bold "
                      style={{ fontFamily: "Open Sans", letterSpacing: "1.28px" }}
                    >
                      {
                        [
                          "DOG FOOD & TREATS",
                          "CAT FOOD & TREATS",
                          "CAT LITTER SAND",
                        ][index]
                      }
                    </IonLabel>
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
            <div onClick={handleRefreshBrand} className="absolute -top-11 right-4">
              <IonIcon icon={refreshCircleOutline} size="large" className="text-[#1A488E]"></IonIcon>
            </div>
            <div className="absolute -top-3 right-3">
              <div className="flex flex-col items-center justify-center">
                <div className="text-[8px] text-[#050505] font-bold" style={{letterSpacing:"1px"}}>
                  BRANDS
                </div>
                <div className="relative" onClick={() => setIsModalOpen(!isModalOpen)}>
                  <img src={getImageByName(isModalOpen ? "uptoggle" : "dropDown")} className="h-7 w-7 ml-1 mt-1 transition-transform duration-1500 ease-in-out active:scale-95" />
                  {isModalOpen && <BrandSelector setIsModalOpen={setIsModalOpen} brands={brands} handleBrandSelect={handleBrandSelect} isModalOpen={isModalOpen}/>}
                </div>
                
  
              </div>
            </div>
            <div
              className="flex space-x-4 h-[242px] p-3 bg-[#1A488E] w-full mt-12 max-w-full overflow-x-auto"
              style={{
                borderTop: "0.5px solid #729AE7",
                borderRight: "0.5px solid #729AE7",
                borderBottom: "1px solid #729AE7",
                borderLeft: "0.5px solid #729AE7",
              }}
            > 
              <div className="flex space-x-4 items-center justify-center">
                  {allPetProduct && allPetProduct.map((item: any, index: number) => {
                    const isSelected = selectedProductIds && selectedProductIds?.includes(item._id);
                    return (
                      <div className="relative h-[168px] w-[100px] bg-[#fff] mt-5 flex flex-col items-center justify-center">
                        {isSelected &&<div style={{letterSpacing:"1px"}} className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 font-bold font-segoe text-xxs text-[#fff]">SELECTED</div>}
                        <div className="h-20 w-20 pt-2">
                          <IonImg
                          onClick={() => handleSelectProduct(item)}
                          key={index}
                          src={item.image}
                          alt="img"
                          className={`h-full w-full object-cover ${
                            isSelected ? 'border-2 border-[#5ECB76]' : ''
                          }`}
                          />
                        </div>
                        
                        <div className="h-[100px] w-[85px] mt-2" >
                          <p 
                          style={{
                            letterSpacing: "1px", 
                            color:"#000", 
                            fontWeight:400, 
                            fontStyle: "normal",
                            lineHeight: 1.2,
                            textTransform: "uppercase",
                            
                          }} 
                          className="font-segoe text-[9px] "
                          >
                            {item.name}
                            {/* Sheba Rich Premium Adult (+1 Year) Fine Wet Cat Food, Tuna Pumpkin & Carrot In Gravy */}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
              
            </div>
          </div>
          <div className=" flex flex-col items-center justify-center mt-0.5 gap-y-2">
            <div className="relative mt-2 h-[35px] w-[319px]">
              <div className="absolute -top-2.5 left-1 text-[#2132C3F7] font-semibold text-[8px] font-segoe z-10">
                Selected Items
              </div>
              <div
                className={`h-full bg-[#DCE4F1] overflow-hidden rounded-full flex justify-center items-center shadow-md cursor-pointer`}
              >
                <div className="w-full flex justify-start gap-1 max-w-[315px] items-center overflow-x-auto flex-nowrap pl-1">
                  {selectedProducts &&
                    selectedProducts.map((item: any, index: number) => (
                      <IonAvatar key={index} className="h-[30px] w-[30px] flex-shrink-0">
                        <img src={item.image} className="h-full w-full" />
                      </IonAvatar>
                    ))}
                </div>
                <div className=" w-[1px] h-[30px]" style={{background:"rgba(68, 96, 169, 0.60)"}} />
                <div
                  onClick={saveSelectProduct}
                  className="relative h-[28px] mx-3 w-[90px] bg-white flex justify-center items-center cursor-pointer transition-transform duration-150 ease-in-out active:scale-95 active:bg-gray touch-none"
                  style={{
                    borderRadius: "25px",
                    borderTop: "0.5px solid rgba(47, 70, 153, 0.38)",
                    borderRight: "0.5px solid rgba(47, 70, 153, 0.38)",
                    borderBottom: "1px solid rgba(47, 70, 153, 0.38)",
                    borderLeft: "0.5px solid rgba(47, 70, 153, 0.38)",
                    boxShadow: "0px 4px 2px 0px rgba(0, 0, 0, 0.25)"
                  }}>
                    <img src={getImageByName("amazon")} className="absolute h-[21px] top-1 left-1.5 m-0 p-0"/>
                    <img src={getImageByName("amazonCart")} className="absolute h-[28px] -top-0.5 right-3.5 m-0 p-0"/>
                </div>
                <div className="absolute -bottom-[30px] left-4 text-xxs text-[#2B369D] font-semibold w-full font-segoe flex items-end justify-end">
                <div className="flex justify-center items-center mr-8" style={{textAlign:"center", lineHeight:"10px"}}>Click here to <br/> go to your <br/>
                Amazon Cart!</div></div>
              </div>
            </div>
            </div>
          
        <div className="relative w-full">
          <div className="fixed h-[228px] w-full left-0 -bottom-[82px] flex flex-col justify-center items-center mt-0 text-center">
            
              <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                src={videoText}
                autoPlay
                loop
                muted
                playsInline
              />
          </div>
          </div>
          {isLinkModal && (
          <FavrouiteLink
            data= {baseUrl}
            isOpen={isLinkModal}
            onClose={() => {
              setIsLinkModal(!isLinkModal);
              setSelectedProducts([])
              baseUrl=baseUrll
            }}
          />
        )}

          
        </IonContent>
      </IonPage>
    </>
  );
};

export default Favourites;
