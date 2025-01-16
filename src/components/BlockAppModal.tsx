import React from 'react';
import { IonModal, IonButton, IonContent } from '@ionic/react';

interface UpdateModalProps {
  storeUrl: any;
}

const UpdateModal = ({ storeUrl }:UpdateModalProps) => {

  return (
    <>
        <IonModal isOpen={true} backdropDismiss={false}>
            <IonContent>
                <div className='flex justify-center items-center h-full w-full' style={{background:"rgba(33, 19, 88, 0.90)"}}>
                <div className='flex flex-col justify-center items-center p-5 gap-y-5 mt-10 bg-gray w-[90%] h-[400px] rounded'>
                    <h2 className='font-openSans font-bold'>Update Required</h2>
                    <p className='font-openSans' >{storeUrl.msg}</p>
                    <IonButton expand="block" 
                    // onClick={() => window.open(storeUrl?.storeUrll, '_system')}
                    >
                     Update Now
                    </IonButton>
                </div>
                </div>
            </IonContent>
        </IonModal>
    </>
  );
};

export default UpdateModal;
