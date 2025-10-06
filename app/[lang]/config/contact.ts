// config/contact.ts
export const CONTACT = {
    whatsapp: "+6285183006681",
    email: "info@dmdshoeparts.com",
  };

  // Helper untuk format WA jadi lebih mudah dibaca
export const formatWhatsapp = (num: string) => {
  return num
    .replace(/^\+62/, "+62 ")    // kasih spasi setelah kode negara
    .replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3"); // jadi 851-5800-6681
};