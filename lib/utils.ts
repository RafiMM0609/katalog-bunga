/**
 * Utility function to send WhatsApp message
 */
export function sendWhatsAppMessage(
  productName: string,
  paperColor: string,
  additionalNotes?: string
) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_ADMIN_NUMBER || '6281234567890';
  
  let message = `Halo Admin Kagitacraft, saya tertarik dengan produk *${productName}*.\n\n`;
  message += `Detail Pilihan:\n`;
  message += `- Warna Kertas: ${paperColor}\n`;
  
  if (additionalNotes) {
    message += `- Catatan: ${additionalNotes}\n`;
  }
  
  message += `\nBoleh tolong info harga dan ongkirnya? Terima kasih.`;
  
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  
  return whatsappUrl;
}

/**
 * Format currency to Indonesian Rupiah
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date to Indonesian format
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

/**
 * Parse tags string to array
 */
export function parseTags(tags?: string): string[] {
  if (!tags) return [];
  return tags.split(',').map(tag => tag.trim()).filter(Boolean);
}

/**
 * Generate canonical URL
 */
export function getCanonicalUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kagitacraft.com';
  return `${baseUrl}${path}`;
}
