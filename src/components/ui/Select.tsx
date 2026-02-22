import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Check, ChevronDown } from 'lucide-react';

interface Option {
  id: string;
  label: string;
  color: string;
  image?: string;
}

const NETWORK_OPTIONS: Option[] = [
  { id: 'MTN', label: 'MTN', color: '#FFD700', image: '/mtn.png' },
  { id: 'GLO', label: 'GLO', color: '#008000', image: '/glo.png' },
  { id: 'Airtel', label: 'Airtel', color: '#FF0000' },
  { id: '9mobile', label: '9mobile', color: '#008080' },
];

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export function Select({ value, onChange, placeholder = 'Select Network', error }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = NETWORK_OPTIONS.find((opt) => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-14 w-full items-center justify-between rounded-xl border border-[#e5e7eb] bg-white px-4 py-2 text-lg ring-offset-white transition-all duration-200 shadow-sm hover:bg-[#f9fafb] focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:ring-offset-2',
          error && 'border-red-500 focus:ring-red-500',
          isOpen && 'ring-2 ring-[#C9A84C] ring-offset-2'
        )}
      >
        <span className="flex items-center gap-3">
          {selectedOption ? (
            <>
              {selectedOption.image ? (
                <img
                  src={selectedOption.image}
                  alt={selectedOption.label}
                  className="h-6 w-6 rounded-full object-cover"
                  onError={(e) => {
                    // Fallback to color dot if image fails
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <span
                className={cn(
                  "h-3 w-3 rounded-full shadow-sm",
                  selectedOption.image ? "hidden" : ""
                )}
                style={{ backgroundColor: selectedOption.color }}
              />
              <span className="font-medium text-[#1c1917]">{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-[#a8a29e]">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={cn('h-5 w-5 text-[#78716c] transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-xl"
          >
            <div className="p-1">
              {NETWORK_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onChange(option.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-base transition-colors hover:bg-[#f5f5f4]',
                    value === option.id && 'bg-[#fdfaf4]'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {option.image ? (
                      <img
                        src={option.image}
                        alt={option.label}
                        className="h-6 w-6 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <span
                      className={cn(
                        "h-3 w-3 rounded-full shadow-sm",
                        option.image ? "hidden" : ""
                      )}
                      style={{ backgroundColor: option.color }}
                    />
                    <span className={cn('font-medium', value === option.id ? 'text-[#1c1917]' : 'text-[#78716c]')}>
                      {option.label}
                    </span>
                  </div>
                  {value === option.id && <Check className="h-4 w-4 text-[#C9A84C]" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
