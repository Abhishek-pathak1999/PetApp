import React from 'react'
import { IonCard, IonCardContent, IonCol, IonGrid, IonImg, IonLabel, IonRow, IonText } from '@ionic/react'
import { getWidthInPercentage } from '../../utils/widthUtil'
import { getImageByName } from '../../utils/imagesUtil'

const AppoiDetails = () => {
  return (
    <div className=' mx-5 h-[235px]' style={{ border: "1px solid rgba(25, 35, 131, 0.29)", borderRadius: "5px", fontFamily: "Open Sans", width: getWidthInPercentage(319) }} >
      <IonCard className="relative p-0 m-0 mb-2 ">
        <IonCardContent className="p-0 m-0 h-[127px]">
          <div className="relative overflow-x-auto h-24">
            <table className="min-w-full min-h-[10px] overflow-y-auto">
              <thead className="sticky top-0 h-[23px] bg-customBlueLite text-white">
                <tr className=''>
                  <th className="text-[10px] font-medium uppercase">
                    Service Name
                  </th>
                  <th className="text-[10px] font-medium uppercase">
                    Pet Name
                  </th>
                  <th className="text-[10px] font-medium uppercase">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className='text-center'>
                  <td className="text-[10px] whitespace-nowrap text-[#000] font-[400]">1. Service Name</td>
                  <td className="text-[10px] whitespace-nowrap text-[#000] font-[400]">Pet Name</td>
                  <td className="text-[10px] whitespace-nowrap text-[#000] font-[400]">₹ 1234</td>
                </tr>
                <tr className='text-center'>
                  <td className="text-[10px] whitespace-nowrap text-[#000] font-[400]">2. Service Name</td>
                  <td className="text-[10px] whitespace-nowrap text-[#000] font-[400]">Pet Name</td>
                  <td className="text-[10px] whitespace-nowrap text-[#000] font-[400]">₹ 1234</td>
                </tr>
                <tr className='text-center'>
                  <td className="text-[10px] whitespace-nowrap text-[#000] font-[400]">3. Service Name</td>
                  <td className="text-[10px] whitespace-nowrap text-[#000] font-[400]">Pet Name</td>
                  <td className="text-[10px] whitespace-nowrap text-[#000] font-[400]">₹ 1234</td>
                </tr>
                <tr className='text-center'>
                  <td className="text-[10px] whitespace-nowrap text-[#000] font-[400]">4. Service Name</td>
                  <td className="text-[10px] whitespace-nowrap text-[#000] font-[400]">Pet Name</td>
                  <td className="text-[10px] whitespace-nowrap text-[#000] font-[400]">₹ 1234</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="absolute bottom-0 h-[30px]  w-full bg-customBlueLite bg-opacity-50 p-2 flex justify-between items-center">
            <IonText className=' mx-auto text-[10px]' style={{ fontFamily: "Open Sans", color: '#fff' }} >Services to be Provided at your home </IonText>
          </div>
        </IonCardContent>
      </IonCard>

      <div className='flex  items-center justify-between mx-2   h-[95px] '>

        <div className='flex flex-col items-center  mb-4 mt-2 ' >
          <IonText className='text-[10px] text-[#2B369D] ' style={{ fontFamily: "Open Sans", fontWeight: '700' }}>22 Apr 2024</IonText>
          <IonText className='text-[9px] text-[#2B369D]' style={{ fontFamily: "Open Sans", fontWeight: '500' }}>11:30AM</IonText>

          <div className='flex flex-col items-center mt-1  ' style={{ fontFamily: "Open Sans" }}>
            <div className='h-[45px] w-[45px] rounded-full border border-[#2B369D]' style={{ boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)' }}>
              <IonImg src={getImageByName('manLogo')} alt='img' className='h-full w-full object-cover rounded-full' />
            </div>
            <IonLabel style={{ color: 'rgba(30, 57, 97, 0.65)' }} className='text-[10px] font-medium'>Visiting Vet</IonLabel>
          </div>

        </div>


        <div className='flex flex-col  justify-between items-center   '>

          <div className='flex justify-between my-2 overflow-x-auto ' style={{ fontFamily: "Open Sans", width: '220px' }}>

            <div className='flex flex-col items-center mx-1'>
              <IonLabel className='text-[13px]'>Zoro</IonLabel>
              <IonImg src='src/assets/cat-img.png' alt='Zoro' className='h-[35px] w-[35px] rounded-full' />
            </div>

            <div className='flex flex-col items-center mx-1'>
              <IonLabel className='text-[13px]'>Fluff</IonLabel>
              <IonImg src='src/assets/cat-img.png' alt='Fluff' className='h-[35px] w-[35px] rounded-full' />
            </div>

            <div className='flex flex-col items-center mx-1'>
              <IonLabel className='text-[13px]'>Piddi</IonLabel>
              <IonImg src='src/assets/cat-img.png' alt='Piddi' className='h-[35px] w-[35px] rounded-full' />
            </div>

            <div className='flex flex-col items-center '>
              <IonLabel className='text-[13px]'>Simba</IonLabel>
              <IonImg src='src/assets/cat-img.png' alt='Simba' className='h-[35px] w-[35px] rounded-full' />
            </div>
          </div>

          <div className='mb-4' style={{
            background: 'rgba(250, 255, 0, 0.16)',
            width: '100%', // Adjust width for responsiveness
            height: '30px',
            flexShrink: 0,
            strokeWidth: '0.5px',
            stroke: '#D9DAE8',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'

          }}>
            <div className='flex items-center justify-around mx-2'>
              <IonText style={{ color: '#000', textAlign: 'right', fontFamily: "Segoe UI", fontSize: '8px', fontStyle: 'normal', fontWeight: '600', lineHeight: 'normal', }}>
                Pay with Upi
              </IonText>
              <IonImg src={getImageByName("gpay")} className='' />
              <IonImg src={getImageByName("paytm")} />
              <IonImg src={getImageByName("phpay")} />
              <IonImg src={getImageByName("bhim")} />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AppoiDetails
