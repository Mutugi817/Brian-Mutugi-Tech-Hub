import { WAClient } from "./whatsapp.service.js";

class AIWhatsAppService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
    }

    async generateAutomatedResponse(bookingData) {
        if (!this.apiKey) {
            console.warn("No Gemini API Key found. Returning default AI message.");
            return `Hi! We've received your ${bookingData.serviceType} request for your ${bookingData.device}. Brian will review and get back to you shortly!`;
        }

        try {
            const prompt = `Act as an assistant for Brian Mutugi, a tech repair and developer in Juja/Nakuru, Kenya. 
            A user just booked a ${bookingData.serviceType} service for ${bookingData.device}. The issue described is: "${bookingData.description}".
            Write a short, professional, and friendly WhatsApp confirmation message (max 3 sentences). Reassure them Brian will see it ASAP.`;
            
            // Actual Gemini API Call
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || "Booking confirmed. Brian will contact you soon.";
        } catch (error) {
            console.error("AI Generation Error:", error.message);
            return "Booking confirmed! Brian will check the details and reply soon.";
        }
    }

    async sendWhatsAppMessage(phone, message) {
        // Logic to send message
        const formatedPhoneNumber = "254" + phone.substring(1);

        WAClient.sendMessage(formatedPhoneNumber, message);
        console.log(`\n============================`);
        console.log(`[WHATSAPP MESSAGE SENT]`);
        console.log(`To: ${phone}`);
        console.log(`Message: ${message}`);
        console.log(`============================\n`);
    }
}


const aiService = new AIWhatsAppService();

export default aiService;