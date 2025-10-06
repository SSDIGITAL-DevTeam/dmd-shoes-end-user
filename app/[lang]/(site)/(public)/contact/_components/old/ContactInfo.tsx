import Container from "@/components/ui-custom/Container";
import React from "react";
import getDictionaryContact from '../../../../../../../dictionaries/contact/get-dictionary-contact';

export default function ContactInfo({ dictionaryContact, lang }: { dictionaryContact: Awaited<ReturnType<typeof getDictionaryContact>>, lang: string }) {
  return (
    <div
      className="bg-no-repeat bg-center bg-cover"
      style={{
        backgroundImage: "url('/assets/svg/contact/contact-info-bg.svg')",
      }}
    >
      <Container className="py-20">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Kolom 1 */}
          <div className="flex flex-col space-y-[24px]">
            <h2 className="font-inter font-normal text-[24px] leading-[36px] text-[#000000] mb-2">
              {dictionaryContact.contact_info_title||"Info Kontak"}
              
            </h2>
            <p className="font-inter font-bold text-[40px] leading-[130%] text-[#000000]">
            {dictionaryContact.contact_info_description||"Kami selalu senang membantu anda"}
              
            </p>
          </div>

          {/* Kolom 2 */}
          <div className="flex flex-col space-y-[25px]">
            <h2 className="font-inter font-semibold text-[22px] leading-normal text-[#000000]">
             
              {dictionaryContact.contact_email_label||" Alamat Email"}
            </h2>
              <div className="bg-black h-1 w-[27px]"></div>
              <p className="font-inter font-semibold text-[22px] leading-normal text-[#000000] ">
              {dictionaryContact.contact_email_value||" dmdheelscraft@gmail.com"} 
                </p>

                <div>
                  <h2 className="font-inter font-semibold text-[20px] leading-[32px] text-[#000000]">
                  {dictionaryContact.contact_hours_label||"Jam Operasional"} 
                   
                  </h2>
                  <p className="font-inter font-normal text-[20px] leading-[32px] text-[#000000]">
                  {dictionaryContact.contact_hours_value||"Setiap Hari (08:00 - 18:00)"} 
                    
                  </p>
                </div>
           
          </div>

          {/* Kolom 3 */}
          <div className="flex flex-col space-y-[25px]">
          {/* Nomor Whatsapp */}
            <h2 className="text-[20px] font-normal text-black leading-[auto]">
              {dictionaryContact.contact_whatsapp_label||"Nomor Whatsapp"} 
          
            </h2>
            <div className="bg-black h-1 w-[27px] "></div>
            <p className="text-[22px] font-semibold text-black leading-[auto] ">
              +62 851-8300-6681
            </p>

            {/* Lokasi */}
            <div>
              <h2 className="text-[20px] font-semibold text-black leading-[32px]">
              {dictionaryContact.contact_location_label||"Lokasi Kami:"} 
              </h2>
              <p className="font-inter font-normal text-[20px] leading-[32px] text-[#000000]  ">
                Pergudangan Mutiara Kosambi 2 Blok A6 No.22, <br />
                Dadap - Tangerang
              </p>
            </div>
           
          </div>
        </div>
      </Container>
    </div>
  );
}
