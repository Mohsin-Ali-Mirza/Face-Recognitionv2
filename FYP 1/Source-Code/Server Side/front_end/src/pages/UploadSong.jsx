import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { SidebarContext } from "../Context/SibebarContext";
import { useNavigate } from "react-router-dom";
import { SongContext } from "../Context/SongContext";
import { getDecide } from '../constants/loggedin';


const UploadSong = () => {
  const navigate = useNavigate();
  const { showMenu, setShowMenu } = useContext(SidebarContext);
  const { __URL__ } = useContext(SongContext);

  useEffect(() => {
    if (showMenu) setShowMenu(false);
    const currentDecision = getDecide();
  console.log(currentDecision);
  setLoggedIn(currentDecision);
  }, []);

  const [file, setFile] = useState();
  const [namee, setName] = useState("");
  const [Department, setDepartment] = useState("");
  const [ID, setID] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [link, setlink] = useState("");
  // const handleFileChange = (e) => {
  //   setFile(e.target.files[0]);
  // };

  // function replaceLink(url) {
  //   // 1. Replace "/d" with "//uc?export=view&"
  //   url = url.replace("/d/", "//uc?export=view&");
  
  //   // 2. Remove "/view?usp=drive_link" from the end
  //   const regex = /\/view\?usp=drive_link$/;
  //   url = url.replace(regex, "");
  
  //   return url;
  // }


  function DisplayImageFromGoogleDrive(url) {
    const modifiedUrl = url.replace("/file/d/", "/uc?export=view&id=");
    const newUrl = modifiedUrl.replace("/view?usp=sharing", "");
    return newUrl;
  }
  


  const handleChange = (e) => {
    const newLink = DisplayImageFromGoogleDrive(e.target.value);
    setlink(newLink);
  };
  const handleSubmit = async (e) => {
    // console.log("submit");
    e.preventDefault();
    const formData = new FormData();
    // formData.append("file", file);
    console.log("----------");
    formData.append("id", ID);
    console.log(ID);
    
    formData.append("name", namee);
    console.log(namee);
    formData.append("dept", Department);
    formData.append("link", link);
   
    console.log(Department);
    console.log(link)
    // formData.append("link", link);
    // console.log(link);
    // console.log("----------");
    // formData.append("link", link);

    try {
      // Make an HTTP POST request to your Express route with formData
      const response = await axios.post('http://localhost:5000/api/auth', formData);

    } catch (error) {
      // Handle any errors that occur during the request
      console.error('Error:', error);
    }
  };

  const handleLoginPrompt = () => {
    
    navigate("/login"); // Navigate to the login page
  };
  

  return (
<div className="w-full h-screen flex justify-center items-center bg-blue-800 animate-pop">
{loggedIn ? (<form className="bg-white flex flex-col px-5 py-15 shadow-2xl rounded-xl  mb-8" style={{ paddingTop: '1rem', color:'#2596be' }} onSubmit={handleSubmit}> 
  <h1 className="text-center text-3xl text-blue-900 lg:text-1md mb-5 max-w-md  font-mono underline underline-offset-2">
      <strong>Registration</strong></h1>
        <div className="flex flex-col space-y-3 lg:px-5 mb-4 max-w-md">
          
          <input
            type="text"
            name="name"
            className="px-5 text-sm bg-slate-100 border-b-blue-200 border-b-2 rounded-md placeholder:text-gray-500 text-gray-500 h-10 outline-none"
            placeholder="Student Name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col space-y-2 lg:px-5 mb-4 max-w-md">
          
          <input
            type="text"
            name="ID"
            className="px-5 text-sm bg-slate-100 border-b-blue-200 border-b-2 rounded-md placeholder:text-gray-500 text-gray-500 h-10 outline-none"
            placeholder="University ID"
            onChange={(e) => setID(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col space-y-2 lg:px-5 mb-4 max-w-md">
         
          <input
            type="text"
            name="Department"
            className="px-5 text-sm bg-slate-100 border-b-blue-200 border-b-2 rounded-md placeholder:text-gray-500 text-gray-500 h-10 outline-none"
            placeholder="CS/AI/SE"
            onChange={(e) => setDepartment(e.target.value)}
            required
          />
        </div>

        {/* <div className="flex flex-col space-y-2 rounded-md lg:px-5 mb-10"> */}
   {/* <label htmlFor="pictureFile" className="rounded-md bg-blue-800 hover:bg-blue-900 text-white text-center py-2 cursor-pointer">
    <span>Upload File</span>
    <input
      onChange={handleFileChange}
      type="file"
      name="file"
      accept="image/*"
      className="hidden"
      required
    />  
  </label> */}
          

          
{/* </div> */}
  <div className="flex flex-col space-y-2 lg:px-5 mb-4 max-w-md">
    <input
      type="text"
      name="link"
      className="px-5 text-sm bg-slate-100 border-b-blue-200 border-b-2 rounded-md placeholder:text-gray-500 text-gray-500 h-10 outline-none"
      placeholder="Image Link"
      onChange={handleChange}
      required
      // Value is now set to the processed link
      value={link}
    />
  </div>


        <div className="flex justify-content-center">
  <button
    className="bg-green-500 hover:bg-green-900 text-white text-sm py-2 px-4 rounded-md w-32 lg:mx-4 mb-8"
    type="submit"
    
    style={{ marginLeft: "73px" }}>
    Submit
  </button>
</div>
      </form>): (
        <div className="text-white text-center">
          <p>You need to log in to access the registration form.</p>
          <button
            onClick={handleLoginPrompt}
            className="bg-green-500 hover:bg-green-900 text-white text-sm py-2 px-4 rounded-md w-32 lg:mx-4 mb-8"
            style={{ marginLeft: "73px" }}
          >
            Log In
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadSong;