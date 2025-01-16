// // import React, { useState } from 'react';
// // import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonTextarea } from '@ionic/react';

// // const ContactSupport: React.FC = () => {
// //   const [formData, setFormData] = useState({ name: '', email: '', message: '' });

// //   const handleInputChange = (e:any) => {
// //     const { name, value } = e.target;
// //     setFormData((prevData) => ({
// //       ...prevData,
// //       [name]: value,
// //     }));
// //   };

// //   const handleSubmit = () => {
// //     // For now, just log the form data (you can implement your own API logic here)
// //     console.log('Form Data:', formData);
// //     setFormData({ name: '', email: '', message: '' })
// //   };

// //   return (
// //     <IonPage>
// //       <div>
// //         <IonToolbar>
// //           <IonTitle className="text-center text-lg font-bold">Contact Support</IonTitle>
// //         </IonToolbar>
// //       </div>

// //       <IonContent className="p-4 bg-gray-100">
// //         <div className="max-w-lg mx-auto bg-white p-6 rounded shadow-lg">
// //           <h2 className="text-2xl font-semibold mb-4 text-center">We'd love to hear from you!</h2>
// //           <form onSubmit={(e) => e.preventDefault()}>
// //             <div className="mb-4">
// //               <IonInput
// //                 name="name"
// //                 value={formData.name}
// //                 onIonInput={handleInputChange}
// //                 placeholder="Your Name"
// //                 className="w-full p-2 border border-gray-300 custom"
// //               />
// //             </div>
// //             <div className="mb-4">
// //               <IonInput
// //                 name="email"
// //                 value={formData.email}
// //                 onIonInput={handleInputChange}
// //                 placeholder="Your Email"
// //                 type="email"
// //                 className="w-full p-2 border border-gray-300 custom"
// //               />
// //             </div>
// //             <div className="mb-4">
// //               <IonTextarea
// //                 name="message"
// //                 value={formData.message}
// //                 onIonInput={handleInputChange}
// //                 placeholder="Your Message"
// //                 rows={6}
// //                 className="w-full p-2 border border-gray-300"
// //               />
// //             </div>
// //             <IonButton
// //               expand="full"
// //               onClick={handleSubmit}
// //               className="bg-blue-500 text-white hover:bg-blue-600"
// //             >
// //               Submit
// //             </IonButton>
// //           </form>
// //         </div>
// //       </IonContent>
// //     </IonPage>
// //   );
// // };

// // export default ContactSupport;


// import React, { useEffect, useState } from 'react';
// import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';
// import { getPrivacyData } from '../service/services';

// const ContactSupport: React.FC = () => {
  
//   const [contactSupport, setContactSupport] = useState<any>([])

//   useEffect(()=>{
//     handlePrivacyText()
//   },[])
  
//   async function handlePrivacyText(){
//     try{
//       const data = await getPrivacyData()
//       if(data.isSuccess){
//         setContactSupport(data.result.systemValue)
//       }
//     }catch(e){
//       console.log("e: ", e)
//     }
//   }

//   return (
//     <IonPage>
//       <IonContent className="p-4 bg-gray-100">
//         <div
//           className="prose prose-lg bg-white p-6 rounded shadow-lg text-gray-800"
//           dangerouslySetInnerHTML={{ __html: contactSupport }}
//         ></div>
//       </IonContent>
//     </IonPage>
//   );
// };

// export default ContactSupport;

import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, useIonViewDidEnter } from '@ionic/react';
import { getContactSupport } from '../service/services';

const ContactSupport: React.FC = () => {
    
  const [contactSupport, setContactSupport] = useState<any>([])

  useEffect(()=>{
    handleContactSupport()
  },[])

  
  async function handleContactSupport(){
    try{
      const data = await getContactSupport()
      if(data.isSuccess){
        setContactSupport(data.result.systemValue)
      }
    }catch(e){
      console.log("e: ", e)
    }
  }

  return (
    <IonPage>
      <IonContent className="p-4 bg-gray-100">
        <div
          className="prose prose-lg bg-white p-6 rounded shadow-lg text-gray-800"
          dangerouslySetInnerHTML={{ __html: contactSupport }}
        ></div>
      </IonContent>
    </IonPage>
  );
};

export default ContactSupport;
