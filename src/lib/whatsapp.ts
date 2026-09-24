interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
}

// Format cart items for WhatsApp message
export function formatWhatsAppMessage(
  items: CartItem[],
  customer: CustomerInfo,
  orderNumber: string,
  total: number
): string {
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'AZip Store';

  let message = `🛒 *${storeName} - New Order*\n`;
  message += `━━━━━━━━━━━━━━━━━━\n\n`;
  message += `📋 *Order #${orderNumber}*\n\n`;

  message += `👤 *Customer Details:*\n`;
  message += `   Name: ${customer.name}\n`;
  message += `   Phone: ${customer.phone}\n`;
  message += `   Address: ${customer.address}\n`;
  message += `   City: ${customer.city}\n\n`;

  message += `📦 *Order Items:*\n`;
  items.forEach((item, index) => {
    message += `   ${index + 1}. ${item.name}\n`;
    message += `      Qty: ${item.quantity} × Rs. ${item.price.toLocaleString()}\n`;
    message += `      Subtotal: Rs. ${(item.price * item.quantity).toLocaleString()}\n`;
  });

  message += `\n━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 *Total: Rs. ${total.toLocaleString()}*\n`;
  message += `💳 Payment: Cash on Delivery\n`;
  message += `━━━━━━━━━━━━━━━━━━\n\n`;
  message += `📍 Delivery to: ${customer.city}\n`;
  message += `\nThank you for shopping with ${storeName}! 🙏`;

  return message;
}

// Generate WhatsApp click-to-chat URL
export function generateWhatsAppUrl(message: string): string {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '94XXXXXXXXX';
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}
