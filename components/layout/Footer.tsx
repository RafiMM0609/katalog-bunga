import { siteConfig } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-pink-100 py-8 text-center text-sm text-gray-400">
      <div className="max-w-7xl mx-auto px-4">
        <p>&copy; 2026 Kagitacraft. Made with love.</p>
        <div className="mt-2 flex justify-center gap-4">
          <a
            href="https://www.instagram.com/kagitacraft.id?igsh=MWhvM3M2dXZ1eW9jbg%3D%3D&utm_source=qr"
            className="hover:text-pink-600 transition-colors flex items-center"
          >
            <img src="/sosmed-icon/instagram.webp" alt="Instagram" className="w-5 h-5 mr-2" />
            <span>Instagram</span>
          </a>
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}?text=hii kakak, mau nanya soal bucket`}
            className="hover:text-pink-600 transition-colors flex items-center"
          >
            <img src="/sosmed-icon/whatsapp.webp" alt="WhatsApp" className="w-5 h-5 mr-2" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
