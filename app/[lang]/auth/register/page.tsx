import FormLogin from "./_component/FormRegister";
import Image from "next/image";
// import Logo from "@/../../public/assets/logo-dmd.svg"; // import langsung SVG
import Logo from "@/assets/Logo"
export default function Login() {
  return (
    <div className="flex h-screen">
      {/* Kolom kiri - Gambar Full */}
      <div className="hidden lg:flex flex-1 relative">
        <Image
          src="/assets/images/auth/auth.webp"
          alt="Tygo School"
          fill
          className="object-cover" // bisa diganti 'object-contain' kalau mau seluruh gambar keliatan
          priority
        />
        
      </div>

      {/* Kolom kanan - Form Login */}
      <div className="flex flex-col flex-1 bg-[#F5F5F5] items-center justify-center p-8 space-y-[40px]">
        <div className=" flex text-primary space-x-[10px]">
      
        < Image
              src="/assets/logo-dmd-blue.svg"
              alt="DMD Logo"
              
              width={40}
              height={40}
         
            />
            <div className="font-bold text-[28px] leading-[120%]">
              DMD Shoeparts 
              <br></br>
              Manufacturing
            </div>
                 {/* <Logo className="w-10 h-10 text-primary" /> */}
        </div>
        <div className="w-full max-w-md bg-white mx-6 p-6">
          <h1 className="text-2xl font-bold mb-6 text-center text-primary">
            Masuk
          </h1>
          <FormLogin />
        </div>
      </div>
    </div>
  );
}
