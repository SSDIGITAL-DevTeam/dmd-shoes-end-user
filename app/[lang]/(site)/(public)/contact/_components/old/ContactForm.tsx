import Container from '@/components/ui-custom/Container'
import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import getDictionaryContact from '../../../../../../../dictionaries/contact/get-dictionary-contact';
// import  getDictionaryContact from '../../../../dictionaries/about/get-dictionary-about';

export default function ContactForm({ lang,dictionaryContact }: { lang: string,dictionaryContact:Awaited<ReturnType<typeof getDictionaryContact>> }) {

  return (
    <Container className="py-20">
      <h1 className="text-[60px] font-bold leading-[100%] text-primary text-left mb-4">
        {
          dictionaryContact.title || "Kontak Kami"
        }
      </h1>
      <p className="font-normal text-[24px] leading-[36px] text-gray-700 text-left mb-8 font-inter">
      {
          dictionaryContact.description || ` Punya pertanyaan soal ukuran, stok, atau ingin custom order? Tim kami siap
        membantu. Kami percaya setiap langkah dimulai dari sepatu yang tepat,
        jadi jangan ragu untuk ngobrol langsung dengan kami!`
         
        }
       
      </p>

      {/* Form Contact Us */}
      <form className="space-y-6">
        <div className="space-y-6">
          {/* Baris Pertama */}
          <div className="grid grid-cols-1 md:grid-cols-3 space-x-[32px]">
            <div>
              <input
                type="text"
                placeholder={dictionaryContact.full_name||"Nama Lengkap"}
                className="w-full border-b border-black p-[10px] pb-[32px] text-[24px] leading-[32px] font-normal placeholder:text-black/50 focus:outline-none"
                required
              />
            </div>

            <div>
              <input
                type="email"
                placeholder={dictionaryContact.email||"Alamat Email"}

                //placeholder="Alamat Email"
                className="w-full border-b border-black p-[10px] pb-[32px] text-[24px] leading-[32px] font-normal placeholder:text-black/50 focus:outline-none"
                required
              />
            </div>

            <div>
              <input
                type="text"
                placeholder={dictionaryContact.whatsapp||"Nomor WhatsApp (Opsional)"}
                //placeholder="Nomor WhatsApp (Opsional)"
                className="w-full border-b border-black p-[10px] pb-[32px] text-[24px] leading-[32px] font-normal placeholder:text-black/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Baris Kedua */}
          <div>
            <textarea
              rows={3}
              placeholder={dictionaryContact.message||"Tulis pesan Anda..."}
              //placeholder="Tulis pesan Anda..."
              className="w-full border-b border-black p-[10px] pb-[32px] text-[24px] leading-[32px] font-normal placeholder:text-black/50 focus:outline-none"
              required
            ></textarea>
          </div>

          {/* Tombol Submit */}
          <div className="text-left">
            <button
              type="submit"
              className="flex items-center gap-2 bg-primary text-white py-4 px-8 hover:bg-[#00284d] transition font-inter font-semibold text-[22px]"
            >
              {dictionaryContact.submit+" "||"Kirim Pesan "}
              <FaArrowRight className="text-[22px]" />
            </button>
          </div>
        </div>
      </form>
    </Container>
  )
}


