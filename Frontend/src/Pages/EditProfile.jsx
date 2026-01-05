import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        FName: "",
        LName: "",
        Level: "",
        Date: "",
    });

    const [message, setMessage] = useState(""); // For success/error message

    const isFormEmpty = !form.FName && !form.LName && !form.Level && !form.Date;

    function handleForm(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function edit() {
        try {
            const res = await fetch("http://localhost:3000/editProfile", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            console.log(data);

            if (data.user) {
                setMessage("Profile updated successfully");

                // Redirect after 1 second
                setTimeout(() => {
                    navigate("/profile");
                }, 1000);
            } else {
                setMessage(data.message || "Failed to update profile");
            }
        } catch (err) {
            console.error(err);
            setMessage("Server error while updating profile");
        }
    }

    return (
        <div>
            <nav className="h-20 md:h-40 w-full bg-[#43406e] flex items-center justify-center">
                <p className="text-2xl md:text-5xl font-light text-white">Edit Profile</p>
            </nav>

            <div className="flex flex-col md:flex-row mx-auto w-full h-140 md:h-140 md:w-175 rounded-2xl shadow-lg shadow-black/50 bg-white bg-opacity-90 mt-10 justify-center gap-10">

                <div className="mx-auto md:mx-0 flex flex-col gap-6 w-60 md:w-100">

                    <div className="flex flex-col ml-0 md:ml-5 relative -mt-4 md:mt-10">
                        <p>First Name</p>
                        <input
                            name="FName"
                            value={form.FName}
                            onChange={handleForm}
                            className="border rounded p-2"
                            placeholder="First name"
                        />
                    </div>

                    <div className="flex flex-col ml-0 md:ml-5">
                        <p>Last Name</p>
                        <input
                            name="LName"
                            value={form.LName}
                            onChange={handleForm}
                            className="border rounded p-2"
                            placeholder="Last name"
                        />
                    </div>

                    <div className="flex flex-col ml-0 md:ml-5">
                        <p>Level</p>
                        <select
                            name="Level"
                            value={form.Level}
                            onChange={handleForm}
                            className="border rounded p-2"
                        >
                            <option value="">Select level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>

                    <div className="flex flex-col ml-0 md:ml-5">
                        <p>Joined Date</p>
                        <input
                            name="Date"
                            type="date"
                            value={form.Date}
                            onChange={handleForm}
                            className="border rounded p-2"
                        />
                    </div>

                    {/* Success / Error Message */}
                    <div className="h-6 text-center mt-2">
                        {message && <p className="text-green-600">{message}</p>}
                    </div>

                    <button
                        onClick={edit}
                        disabled={isFormEmpty} // Disabled if all fields are empty
                        className={`mx-0 md:mx-auto h-10 w-60 md:w-70 mt-3 md:mt-10 rounded cursor-pointer
                            ${isFormEmpty
                                ? "bg-gray-400 text-gray-700"
                                : "bg-[#43406e] text-white hover:bg-[#353358]"
                            }`}
                    >
                        Save Changes
                    </button>

                </div>
            </div>
        </div>
    );
};

export default EditProfile;