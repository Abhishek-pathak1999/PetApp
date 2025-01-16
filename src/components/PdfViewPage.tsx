import React from 'react';
import { InAppBrowser } from '@ionic-native/in-app-browser';

interface PreviewImagePayload {
  url: string;
}

const FilePreview = ({ previewImage }: { previewImage: PreviewImagePayload }) => {
  const openFile = () => {
    if (!previewImage?.url) {
      console.error('No file URL provided.');
      return;
    }

    try {
      const browser = InAppBrowser.create(previewImage.url, '_system', 'location=yes');
      browser.show();
    } catch (err) {
      console.error('Error opening file with InAppBrowser:', err);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <button
        onClick={openFile}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Open PDF
      </button>
    </div>
  );
};

export default FilePreview;
