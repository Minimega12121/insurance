import React from "react";
import CommonContent from "@/components/CommonContent";
import { ShieldCheck, HeartPulse, Info, Send } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const BasePage: React.FC<{ 
  title: string; 
  icon: React.ReactNode; 
  description: string 
}> = ({ title, icon, description }) => (
  <div className="min-h-screen bg-blue-500 flex items-center justify-center">
    <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-4xl">
      <div className="flex items-center mb-8">
        {icon}
        <h1 className="text-5xl font-extrabold ml-4 text-gray-800">{title}</h1>
      </div>
      <p className="text-xl text-gray-600 mb-8">{description}</p>
      <CommonContent />
    </div>

    <Dialog>
      <DialogTrigger asChild>
        <button 
          className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <Info className="w-6 h-6" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white rounded-2xl shadow-2xl p-6 max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-800 flex items-center">
            <Info className="w-8 h-8 mr-3 text-blue-600" />
            Additional Information
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <p className="text-gray-700">
            Submit Your Own OPENAI API Key to keep your info secret
          </p>
          <div className="flex items-center space-x-2">
            <input 
              type="number"
              placeholder="Type your information here..."
              className="flex-grow p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
);

const InsurancePage: React.FC = () => (
  <BasePage 
    title="Insurance" 
    icon={<ShieldCheck className="w-16 h-16 text-blue-600" />}
    description="Protect what matters most with our comprehensive insurance solutions. We're here to provide you with peace of mind and financial security."
  />
);

const HealthInsurancePage: React.FC = () => (
  <BasePage 
    title="Health Insurance" 
    icon={<HeartPulse className="w-16 h-16 text-green-600" />}
    description="Your health is your wealth. Our tailored health insurance plans ensure you receive the best medical care without financial stress."
  />
);

export { InsurancePage, HealthInsurancePage };