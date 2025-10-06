"use client";

import { useForm, Controller } from "react-hook-form";
import { FaEnvelope, FaKey } from "react-icons/fa";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import ProfileFormEmail from "./ProfileFormEmail";
import ProfileFormChangePassword from "./ProfileFormPassword";

type ProfileFormValues = {
  name: string;
  email: string;
  phone: string;
};

export default function ProfileForm() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      name: "Anakin Skywalker",
      email: "skywalker@gmail.com",
      phone: "",
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    console.log("Form Data:", data);
  };

  return (
    <form className="space-y-6 w-full" onSubmit={handleSubmit(onSubmit)}>
      {/* Grid untuk Nama & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nama Lengkap */}
        <div className="flex flex-col">
          <label className="text-primary font-medium mb-2">Nama Lengkap</label>
          <input
            {...register("name", { required: "Nama tidak boleh kosong" })}
            className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-primary w-full"
          />
          {errors.name && (
            <span className="text-red-500 text-sm mt-1">
              {errors.name.message}
            </span>
          )}
        </div>

        {/* Alamat Email */}
        <div className="flex flex-col">
          <label className="text-primary font-medium mb-2">Alamat Email</label>
          <input
            {...register("email")}
            readOnly
            className="border border-gray-300 rounded p-3 bg-gray-100 text-gray-700 w-full"
          />
        </div>
      </div>

      {/* Grid untuk Nomor WhatsApp */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="text-primary font-medium mb-2">Nomor WhatsApp</label>
          <Controller
            name="phone"
            control={control}
            rules={{
              required: "Nomor WhatsApp wajib diisi",
            }}
            render={({ field }) => (
              <PhoneInput
                {...field}
                placeholder="Nomor WhatsApp"
                defaultCountry="ID"
                international
                countryCallingCodeEditable={false}
                className="profile-phone w-full"
              />
            )}
          />
          {errors.phone && (
            <span className="text-red-500 text-sm mt-1">{errors.phone.message}</span>
          )}
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="flex flex-col lg:flex-row items-center justify-between w-full mt-6 gap-4">
        {/* Tombol kiri */}
        <div className="flex flex-col lg:flex-row flex-wrap gap-4 w-full lg:w-auto">
          <ProfileFormEmail />
          <ProfileFormChangePassword />
        </div>

        {/* Tombol kanan */}
        <div className="w-full lg:w-auto">
          <button
            type="submit"
            className="bg-primary text-white px-6 py-3 rounded hover:bg-primary/90 transition w-full lg:w-auto"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>


      {/* Style khusus PhoneInput hanya di form ini */}
      <style jsx global>{`
        .profile-phone {
          display: flex;
          align-items: center;
          width: 100%;
        }
        .profile-phone input {
          flex: 1;
          min-width: 0;
          border: 1px solid #d1d5db; /* gray-300 */
          border-radius: 0.5rem; /* rounded */
          padding: 0.75rem; /* p-3 */
          outline: none;
          transition: 0.2s;
        }
        .profile-phone input:focus {
          border-color: #2563eb; /* primary */
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.4); /* focus:ring-2 */
        }
        .profile-phone .PhoneInputCountry {
          margin-right: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 0.75rem;
          background: white;
          display: flex;
          align-items: center;
          flex-shrink: 0; /* flag tidak mengecil */
        }
        .profile-phone .PhoneInputCountrySelect {
          outline: none;
        }
      `}</style>
    </form>
  );
}
