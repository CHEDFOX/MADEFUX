
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, CheckCircle2, Loader2 } from 'lucide-react';

interface ContactFormProps {
  onClose: () => void;
}

const ACCESS_KEY = "6490b28e-a80b-4fa5-b806-6c72411cd244";

const ContactForm: React.FC<ContactFormProps> = ({ onClose }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ email: '', phone: '', message: '' });

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const object = Object.fromEntries(data);
    
    // Add access key to the object
    object.access_key = ACCESS_KEY;
    object.from_name = "MADEFOX Website Contact";

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(object)
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          onClose();
        }, 4000);
      } else {
        console.error("Submission failed", result);
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl"
    >
      <motion.div
        initial={{ y: 50, scale: 0.95, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 50, scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 120 }}
        className="relative w-full max-w-lg bg-white/[0.03] border border-white/10 p-10 md:p-14 rounded-[2rem] shadow-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-8 right-8 text-white/30 hover:text-white transition-colors disabled:opacity-20"
        >
          <X size={20} />
        </button>

        {!isSubmitted ? (
          <form onSubmit={handleContactSubmit} className="space-y-10">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-extralight tracking-[0.4em] uppercase text-white/90">
                Connect
              </h3>
              <div className="w-12 h-[1px] bg-white/20 mx-auto mt-6" />
            </div>

            <div className="space-y-10">
              <div className="relative group">
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  className="w-full bg-transparent border-b border-white/10 py-4 text-white placeholder:text-white/20 text-xs tracking-widest focus:outline-none focus:border-white transition-all disabled:opacity-50"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              <div className="relative group">
                <input
                  name="phone"
                  type="tel"
                  placeholder="CONTACT NUMBER"
                  className="w-full bg-transparent border-b border-white/10 py-4 text-white placeholder:text-white/20 text-xs tracking-widest focus:outline-none focus:border-white transition-all disabled:opacity-50"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              <div className="relative pt-4">
                <textarea
                  required
                  name="message"
                  rows={3}
                  placeholder="WHAT'S YOUR DREAM CODE?"
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-white text-xs tracking-[0.15em] placeholder:text-white/10 focus:outline-none focus:border-white/20 transition-all resize-none disabled:opacity-50"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full py-5 bg-white text-black font-semibold text-xs tracking-[0.3em] uppercase flex items-center justify-center gap-3 hover:bg-black hover:text-white border border-white transition-all active:scale-[0.98] disabled:bg-white/50 disabled:text-black/50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  SENDING...
                </>
              ) : (
                <>
                  JOIN THE TRIBE
                  <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="w-24 h-24 border border-white/10 rounded-full flex items-center justify-center mb-10 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            >
              <CheckCircle2 className="text-white/80" size={40} />
            </motion.div>
            <h3 className="text-2xl font-light tracking-[0.4em] mb-6 uppercase text-white/90">Integrated</h3>
            <p className="text-white/30 text-xs tracking-widest leading-loose max-w-[250px]">
              YOUR REQUEST HAS BEEN SEQUENCED INTO OUR CORE OPERATIONS.
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ContactForm;
