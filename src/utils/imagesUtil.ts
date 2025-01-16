import homeLogo from '../assets/home-logo.svg';
import logo from '../assets/logo.png';
import newLoginBg from '../assets/new-login-bg.png';
import newLoginLogo from '../assets/new-login-logo.png';
import signLogo from '../assets/Sign-logo2.png';
import homeUpcomingAppoi from '../assets/HomeUpcomingAppoi.png';
import manLogo from '../assets/man-logo.png';
import phpay from '../assets/Phone Pe.png';
import gpay from '../assets/Google Pay.png';
import paytm from '../assets/Paytm.png';
import bhim from '../assets/Bhim.png';
import catbutton from '../assets/cat-button.png';
import add from '../assets/Add.png';
import manpicdog from '../assets/man-take-pic-dog.png';
import yellowCat from '../assets/yellow-cat.png';
import rectangle from '../assets/Rectangle 122.png';
import logoingif from '../assets/GifTime.gif';
import backArrow from '../assets/Back Arrow (1).png'
import croplogoingif from '../assets/cropgiflogo.gif';
import addnewbutton from '../assets/newAddButton.png';
import deleteTrash from '../assets/Delete Trash.png'
import logoPng from '../assets/MyPetBook Logo PNG.svg'
import catfree from '../assets/pet1.png';
import dogfree from '../assets/Rectangle 121.png';
import otherfree from '../assets/otherpam.png'
import genricMenImage from '../assets/genricImage.jpg';
import samplePicforUpload from "../assets/man-take-pic-dog.png"
import dogImage from "../assets/store-dog1.png";
import catImage from "../assets/store-dog2.png";
import otherImage from "../assets/store-dog3.png";
import defaultDogNotif from "../assets/dog-news-img.png"
import stopCircle from "../assets/Stop Circled.png"
import voice from "../assets/Voice.png"
import mute from "../assets/Mute.png"
import insta from "../assets/Instagram Reels.png"
import goodQuality from "../assets/Good Quality.png"
import comment from "../assets/Comments.png"
import circlePlay from "../assets/Circled Play.png"
import mapImage from "../assets/map-img.png"
import mapLogo from "../assets/navigation-img.svg"
import phoneLogo from "../assets/Call male.png"
import sampleThumb from "../assets/sampleThumbnail.jpeg"
import recordingIcon from "../assets/Add Record.svg"
import dropDown from "../assets/Down Button.png"
import amazon from "../assets/Amazon.png"
import amazonCart from "../assets/Add Shopping Cart.png"
import changeVoice from '../assets/changesVoice.png'
import posterVideo from '../assets/posterdoc.webp'
import dogGif from '../assets/FavrouiteUIdog.gif'
import loginDogGif from '../assets/homeDogs.gif'
import whiteAdd from '../assets/whiteAdd.png'
import chnageDelete from '../assets/changeDelete.png'
import chnageDeleteCircle from '../assets/DeleteButtonCircle.svg'
import vetranDoctor from '../assets/treatmentpagedoc.png'
import pdfImageIcon from '../assets/pdf2.jpg'
import uptoggle from '../assets/uptogglebutton.png'

const homeVideo = "https://mypetbookimages.blob.core.windows.net/app-comman/introvideo.mp4"

const images: { [key: string]: string } = {
  mapLogo,pdfImageIcon, uptoggle,  vetranDoctor, chnageDelete, chnageDeleteCircle, whiteAdd, loginDogGif, dogGif, posterVideo, changeVoice,homeVideo ,amazonCart ,amazon, dropDown, sampleThumb, recordingIcon, phoneLogo, mapImage, circlePlay,comment,goodQuality,insta,mute,voice,stopCircle,dogImage,defaultDogNotif,catImage,otherImage,homeLogo,logo,catfree,dogfree,genricMenImage,otherfree,newLoginBg,newLoginLogo,samplePicforUpload,signLogo,homeUpcomingAppoi,manLogo,phpay,paytm,bhim,gpay,catbutton,add,manpicdog,yellowCat,rectangle,logoingif,backArrow,croplogoingif,addnewbutton,deleteTrash,logoPng
  };
  
  export const getImageByName = (name: string): string | undefined => {
    return images[name];
  };