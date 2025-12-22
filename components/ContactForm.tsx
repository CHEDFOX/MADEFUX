import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { PageState } from "../App";

interface ContactFormProps {
  onClose: () => void;
  setGlobalState?: (s: PageState) => void;
}

const ACCESS_KEY = "6490b28e-a80b-4fa5-b806-6c72411cd244";

const ContactForm: React.FC<ContactFormProps> = ({
  onClose,
  setGlobalState,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Trigger short falling animation
    setGlobalState?.(PageState.SCROLL_FALL);

    setIsSubmitting(true);

    const data = {
      ...formData,
      access_key: ACCESS_KEY,
      from_name: "MADEFOX WEBSITE",
    };

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        setTimeout(() => {
          setIsSubmitted(true);
        }, 800); // allow fall to be felt
      } else {
        alert("Something went wrong. Try again.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-2xl px-6"
    >
      <motion.div
        initial={{ scale: 0.95, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 40, opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg rounded-[2rem] border border-white/10 bg-white/[0.03] p-10 md:p-14"
      >
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-8 right-8 text-white/30 hover:text-white transition disabled:opacity-20"
        >
          <X size={18} />
        </button>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* TITLE */}
            <div className="text-center mb-12">
              <h3 className="text-3xl font-extralight tracking-[0.4em] uppercase text-white/90">
                BE A FOX
              </h3>
              <div className="w-12 h-[1px] bg-white/20 mx-auto mt-6" />
            </div>

            {/* FIELDS */}
            <input
              required
              type="email"
              placeholder="YOUR SIGNAL"
              className="w-full bg-transparent border-b border-white/10 py-4 text-white text-xs tracking-widest placeholder:text-white/20 focus:outline-none focus:border-white"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={isSubmitting}
            />

            <input
              type="tel"
              placeholder="FREQUENCY (OPTIONAL)"
              className="w-full bg-transparent border-b border-white/10 py-4 text-white text-xs tracking-widest placeholder:text-white/20 focus:outline-none focus:border-white"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              disabled={isSubmitting}
            />

            <textarea
              required
              rows={3}
              placeholder="ANYTHING THAT MATTERS"
              className="w-full resize-none rounded-2xl bg-white/[0.02] border border-white/5 p-6 text-white text-xs tracking-[0.15em] placeholder:text-white/10 focus:outline-none focus:border-white/20"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              disabled={isSubmitting}
            />

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 border border-white bg-white text-black text-xs tracking-[0.3em] uppercase transition hover:bg-black hover:text-white disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  SENDING
                </span>
              ) : (
                "JOIN THE TRIBE"
              )}
            </button>
          </form>
        ) : (
          /* SUCCESS */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="py-24 text-center space-y-6"
          >
            <p className="uppercase tracking-[0.4em] text-white/80 text-sm">
              YOUR SIGNAL HAS BEEN RECEIVED
            </p>
            <p className="uppercase tracking-[0.35em] text-white/50 text-xs">
              SEE YOU SOON
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ContactForm;
