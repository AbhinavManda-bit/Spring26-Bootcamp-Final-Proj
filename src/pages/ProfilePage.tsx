/*
Page Description:
- Shows:
--> User info
--> Order history
--> Edit profile
*/
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase"; 
import { useAuth } from "../context/AuthContext"; 
import OrderCard from "../Components/OrderCard"; 

function ProfilePage() {
  const navigate = useNavigate();
  const { currentUser, currentUserData, logout } = useAuth();

  // Fields that can be edited by user 
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editFavStyle, setEditFavStyle] = useState("");
  const [editProfilePicture, setEditProfilePicture] = useState("");

  // Displayed fields on the profile page
  const [displayName, setDisplayName] = useState("");
  const [displayBio, setDisplayBio] = useState("");
  const [displayFavStyle, setDisplayFavStyle] = useState("");
  const [displayProfilePicture, setDisplayProfilePicture] = useState("");

  const [showOrders, setShowOrders] = useState(false);
  const [saving, setSaving] = useState(false);

  // When the auth context loads the user data, fill everything
  useEffect(() => {
    if (currentUserData) {
      const name = currentUserData.name ?? "";
      const bio = (currentUserData as any).bio ?? "";
      const favStyle = (currentUserData as any).favStyle ?? "";
      const profilePicture = (currentUserData as any).profilePicture ?? "";

      setDisplayName(name);
      setDisplayBio(bio);
      setDisplayFavStyle(favStyle);
      setDisplayProfilePicture(profilePicture);

      setEditName(name);
      setEditBio(bio);
      setEditFavStyle(favStyle);
      setEditProfilePicture(profilePicture);
    }
  }, [currentUserData]);

  const handleSave = async () => {
    if (!currentUser) return;
    setSaving(true);
    try {
      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          name: editName,
          bio: editBio,
          favStyle: editFavStyle,
          profilePicture: editProfilePicture,
        },
        { merge: true }
      );
      // Update the display card 
      setDisplayName(editName);
      setDisplayBio(editBio);
      setDisplayFavStyle(editFavStyle);
      setDisplayProfilePicture(editProfilePicture);
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    // Reset inputs back to last saved display values
    setEditName(displayName);
    setEditBio(displayBio);
    setEditFavStyle(displayFavStyle);
    setEditProfilePicture(displayProfilePicture);
  };

  const handleSignOut = async () => {
    await logout();
    navigate("/signup");
  };

  const inputClass =
    "w-full border border-dashed border-gray-400 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 bg-transparent";

  const role = currentUserData?.role ?? "";
  const email = currentUserData?.email ?? currentUser?.email ?? "";

  return (
    <div className="min-h-screen" style={{ background: "#fdf5f0" }}>
      {/* Navbar is rendered by router layout */}

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Continue Shopping */}
        <button
          onClick={() => navigate("/productCatalog")}
          className="flex items-center gap-1 text-sm font-semibold text-gray-700 mb-6 hover:text-gray-900 transition-colors"
        >
          &larr; Continue Shopping
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Side */}
          <div className="flex flex-col gap-4 w-full md:w-64 flex-shrink-0">

            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center text-center">
              {displayProfilePicture !== "" && (
                <img
                  src={displayProfilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
              )}

              <h2
                className="text-lg font-bold tracking-wide"
                style={{ color: "#e05c5c" }}
              >
                {displayName !== "" ? displayName.toUpperCase() : "YOUR NAME"}
              </h2>
              <p className="text-sm font-medium mb-2" style={{ color: "#e05c5c" }}>
                {email}
              </p>
              {displayBio !== "" && (
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  {displayBio}
                </p>
              )}
              {displayFavStyle !== "" && (
                <p className="text-sm text-gray-600">
                  Fav Style: {displayFavStyle}
                </p>
              )}
            </div>

            {/* My Orders (buyer only) */}
            {role === "buyer" && (
              <button
                onClick={() => setShowOrders(true)}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors w-full"
              >
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: "#111" }}
                >
                  O
                </span>
                My Orders
              </button>
            )}

            {/* My Products (seller only)*/}
            {role === "seller" && (
              <button
                onClick={() => navigate("/productCatalog")}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors w-full"
              >
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: "#111" }}
                >
                  P
                </span>
                My Products
              </button>
            )}

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors w-full"
            >
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ border: "2px solid #e05c5c", color: "#e05c5c" }}
              >
                &rarr;
              </span>
              Sign Out
            </button>
          </div>

          {/* Right Side */}
          <div className="flex-1">
            {showOrders ? (
              <OrderCard />
            ) : (
              <div className="flex flex-col gap-5 w-full">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Edit Profile Picture (imageURL only):
                  </label>
                  <input
                    className={inputClass}
                    value={editProfilePicture}
                    onChange={(e) => setEditProfilePicture(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Edit Name:
                  </label>
                  <input
                    className={inputClass}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Edit Bio:
                  </label>
                  <input
                    className={inputClass}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Edit Fav Style:
                  </label>
                  <input
                    className={inputClass}
                    value={editFavStyle}
                    onChange={(e) => setEditFavStyle(e.target.value)}
                  />
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={handleDiscard}
                    className="px-6 py-3 rounded-xl font-bold text-sm text-white tracking-widest"
                    style={{ background: "#e05c5c" }}
                  >
                    DISCARD
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-3 rounded-xl font-bold text-sm text-white tracking-widest"
                    style={{ background: "#2d7a2d" }}
                  >
                    {saving ? "SAVING..." : "SAVE"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
