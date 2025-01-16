import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';
import { getPrivacyData } from '../service/services';

const PrivacyPolicy: React.FC = () => {
  const privacyPolicyTextt = `
    <h1>Privacy Policy</h1>
    <p>Your privacy is important to us. This privacy policy explains how we handle your personal information.</p>
    <h2>Information Collection</h2>
    <p>We collect information to provide better services to our users. This includes...</p>
    <h2>Use of Information</h2>
    <p>The information we collect is used for...</p>
    <h2>Contact Us</h2>
    <p>If you have any questions about this privacy policy, please contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>
  `;
  const [privacyPolicyText, setPrivacyPolicyText] = useState<any>([])

  useEffect(()=>{
    handlePrivacyText()
  },[])
  
  async function handlePrivacyText(){
    try{
      const data = await getPrivacyData()
      if(data.isSuccess){
        setPrivacyPolicyText(data.result.systemValue)
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
          dangerouslySetInnerHTML={{ __html: privacyPolicyText }}
        ></div>
      </IonContent>
    </IonPage>
  );
};

export default PrivacyPolicy;
