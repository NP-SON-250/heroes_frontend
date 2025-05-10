import React, { useState } from "react";
import { FaPaperclip } from "react-icons/fa";

const ImageInput = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleClick = () => {
    document.getElementById("file-upload").click();
  };
  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 lg:text-sm text-xl font-bold mb-1"
        htmlFor="profile"
      >
        Profile
      </label>
      <div
        className="flex cursor-pointer lg:w-28 w-28 border-desired"
        onClick={handleClick}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <FaPaperclip className="lg:w-6 lg:h-6 w-6 h-6 text-tblue mr-2" />
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Profile"
            className="lg:w-6 lg:h-6 w-12 h-12 rounded-full object-cover ml-2"
          />
        ) : (
          <span className="text-pcolor lg:text-sm lg:mt-3 mt-1 text-xl font-bold">
            Choose..
          </span>
        )}
      </div>
    </div>
  );
};

export default ImageInput;
