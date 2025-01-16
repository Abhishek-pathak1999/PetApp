import { getImageByName } from "./imagesUtil";


export function PetImage({url, type}: any) {
console.log("pet_url: ", type, url)
  return (
    <>
      <img
        src={
          url 
        }
        alt="image-text"
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
        }}
        onError={(e:any) => {
          if (type == "Cat") {
            e.currentTarget.src = getImageByName("catfree");
          } else if (type == "Dog") {
            e.currentTarget.src = getImageByName("dogfree");
          } else {
            e.currentTarget.src = getImageByName("otherfree");
          }
        }}
      />
    </>
  );
}

// export function OwnerImage({ owner, token }: { owner: any; token: any }) {
//   const [url, setUrl] = useState<string>();
//   useEffect(() => {
//     getImageUrl();
//   }, []);
//   async function getImageUrl() {
//     const result = await handleGetOwnerImage(owner, token);
//     setUrl(result);
//   }

//   return (
//     <>
//       <img
//         src={url ?? defualtUser}
//         alt="image-text"
//         style={{
//           objectFit: "cover",
//           width: "100%",
//           height: "100%",
//         }}
//         onError={(e) => {
//             e.currentTarget.src = defualtUser;
//         }}
//       />
//     </>
//   );
// }

// export function DoctorImage({ doctor, token }: { doctor: any; token: any }) {
//   const [url, setUrl] = useState<string>();
//   useEffect(() => {
//     getImageUrl();
//   }, []);
//   async function getImageUrl() {
//     const result = await handleGetDoctorImage(doctor, token);
//     setUrl(result);
//   }

//   return (
//     <>
//       <img
//         src={url ?? defualtUser}
//         alt="image-text"
//         style={{
//           objectFit: "cover",
//           width: "100%",
//           height: "100%",
//         }}
//         onError={(e) => {
//           e.currentTarget.src = defualtUser;
//       }}
//       />
//     </>
//   );
// }
