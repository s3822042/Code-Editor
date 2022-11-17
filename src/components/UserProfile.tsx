import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where } from "firebase/firestore";

import { auth, logout, db } from "../utils/firebase";

const UserProfile = () => {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);

      console.log(user, "user");
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user, loading]);

  return (
    <div className="p-16">
      <div className="flex flex-col items-center justify-center p-8 mt-24 bg-white shadow-2xl">
        <div className="inset-x-0 top-0 -mt-24 text-indigo-500 bg-indigo-100 rounded-full shadow-2xl h-60 w-60">
          <img
            src={user?.photoURL || undefined}
            alt=""
            className="object-cover w-full h-full rounded-full"
          />
        </div>
        <div className="pb-12 mt-20 text-center border-b">
          <h1 className="text-4xl font-medium text-gray-700">{name}</h1>
          <p className="mt-3 font-light text-gray-600">{user?.email}</p>
        </div>
        <div className="flex flex-col justify-center mt-12">
          <button
            onClick={logout}
            className="px-4 py-2 mt-4 text-xl font-medium text-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
