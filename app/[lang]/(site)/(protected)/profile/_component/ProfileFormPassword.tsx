"use client";
import React, { useState } from "react";
import { FaKey } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ProfileFormChangePassword() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  return (
    <>
      {/* Tombol Ubah Kata Sandi */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`flex items-center justify-center gap-2 
              border border-primary text-primary px-4 py-2 
              rounded hover:bg-primary hover:text-white transition 
              w-full lg:w-auto`}
      >
        <FaKey /> Ubah Kata Sandi
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50  flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)} // klik background tutup modal
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()} // cegah modal tertutup kalau klik di dalam
          >
            {/* Header */}
            <h2 className="text-xl font-semibold text-center text-primary mb-4">
              Ubah kata sandi
            </h2>

            {/* Form */}
            <form className="space-y-4">
              {/* Kata sandi terkini */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Kata sandi terkini
                </label>
                <div className="relative">
                  <input
                    type={showPassword.current ? "text" : "password"}
                    className="w-full border rounded px-3 py-2 focus:outline-primary"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        current: !showPassword.current,
                      })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Kata sandi baru */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Kata sandi baru
                </label>
                <div className="relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    className="w-full border rounded px-3 py-2 focus:outline-primary"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        new: !showPassword.new,
                      })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Konfirmasi kata sandi baru */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Konfirmasi kata sandi baru
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    className="w-full border rounded px-3 py-2 focus:outline-primary"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        confirm: !showPassword.confirm,
                      })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Tombol submit */}
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition"
              >
                Ubah kata sandi
              </button>
            </form>

            {/* Tombol close */}
           
          </div>
        </div>
      )}
    </>
  );
}

export default ProfileFormChangePassword;
