import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { IslamicStar, Pattern } from '@/components/ui/Icons';
import { submitEntry } from '@/lib/api';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';

export default function Giveaway() {
  const [phone, setPhone] = useState('');
  const [network, setNetwork] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; network?: string }>({});

  const validate = () => {
    const newErrors: { phone?: string; network?: string } = {};
    if (!phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^0\d{10}$/.test(phone)) {
      newErrors.phone = 'Must be 11 digits starting with 0';
    }
    if (!network) {
      newErrors.network = 'Please select a network';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await submitEntry(phone, network);
      setIsSuccess(true);
      toast.success('Entry submitted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit entry');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#fdfaf4] text-[#1c1917] font-sans selection:bg-[#C9A84C]/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <Pattern />
      </div>

      {/* Decorative Stars */}
      <div className="absolute top-8 left-8 text-[#C9A84C]/20 animate-pulse hidden md:block">
        <IslamicStar width={48} height={48} />
      </div>
      <div className="absolute bottom-8 right-8 text-[#C9A84C]/20 animate-pulse hidden md:block">
        <IslamicStar width={64} height={64} />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <Card className="relative overflow-hidden border-t-4 border-t-[#C9A84C]">
            {/* Top Gradient Line */}
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent opacity-50" />

            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-4 flex items-center justify-center rounded-full bg-[#C9A84C]/10 p-4 ring-1 ring-[#C9A84C]/20">
                <img 
                  src="https://saukimart.online/logo.png" 
                  alt="Saukimart Logo" 
                  className="h-12 w-12 object-contain"
                />
              </div>
              
              <div className="mb-2 flex items-center gap-2">
                <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#C9A84C]" />
                <span className="text-xs font-bold tracking-[0.2em] text-[#8B6914] uppercase">
                  Ramadan Kareem
                </span>
                <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#C9A84C]" />
              </div>

              <h1 className="font-serif text-4xl font-medium tracking-tight text-[#1c1917] sm:text-5xl">
                Saukimart
                <span className="mt-1 block bg-gradient-to-r from-[#C9A84C] to-[#8B6914] bg-clip-text text-transparent italic">
                  Giveaway
                </span>
              </h1>
              
              <p className="mt-4 text-base text-[#78716c]">
                Enter your phone number for a chance to win this blessed season.
              </p>
            </div>

            <div className="mb-8 flex items-center justify-center opacity-30">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
              <IslamicStar className="mx-2 h-4 w-4 text-[#C9A84C]" />
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
            </div>

            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="phone" className="sr-only">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="08012345678"
                        value={phone}
                        onChange={(e) => {
                          // Only allow numbers
                          const val = e.target.value.replace(/\D/g, '');
                          if (val.length <= 11) setPhone(val);
                        }}
                        error={errors.phone}
                        className="text-center tracking-widest font-mono"
                      />
                    </div>

                    <div>
                      <label htmlFor="network" className="sr-only">
                        Network
                      </label>
                      <Select
                        value={network}
                        onChange={setNetwork}
                        error={errors.network}
                        placeholder="Select Network"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    isLoading={isLoading}
                  >
                    Enter Giveaway
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', duration: 0.6 }}
                  className="flex flex-col items-center text-center py-8"
                >
                  <div className="mb-6 rounded-full bg-green-50 p-4 ring-1 ring-green-100">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                  </div>
                  <h3 className="mb-2 font-serif text-2xl font-medium text-[#1c1917]">
                    Alhamdulillah!
                  </h3>
                  <p className="text-[#78716c]">
                    Your entry for <span className="font-mono font-medium text-[#1c1917]">{phone}</span> has been received.
                  </p>
                  <div className="mt-8 p-4 bg-[#fdfaf4] rounded-xl border border-[#C9A84C]/20 w-full">
                    <p className="text-sm text-[#8B6914] italic">
                      May this Ramadan bring you peace and prosperity.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          <footer className="mt-8 text-center text-xs font-medium uppercase tracking-wider text-[#78716c]/60">
            <p>Saukimart · One entry per number · Ramadan 2025</p>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
