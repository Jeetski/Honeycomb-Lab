import { useEffect, useState } from 'react';
import './VipDealModal.css';

export default function VipDealModal() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const close = () => setOpen(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText('VIP50');
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // no-op
    }
  };

  const handleRedeem = () => {
    // Close before navigating to section anchor
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="vip-backdrop" onClick={close}>
      <div
        className="vip-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vip-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="vip-close" onClick={close} aria-label="Close">
          &times;
        </button>
        <div className="vip-body">
          <h2 id="vip-title" className="vip-headline">Hive VIP Deal: 50% OFF Diamond & Custom Beats</h2>
          <div className="vip-code-row" aria-live="polite">
            <div className="vip-code" title="Discount code">VIP50</div>
            <button type="button" className="vip-copy" onClick={copyCode}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <a href="#player" className="vip-redeem" onClick={handleRedeem}>Redeem Now</a>
          <div className="vip-expire">
            <svg className="vip-hourglass" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 2h12v2c0 2.8-2 5.2-5 6 3 .8 5 3.2 5 6v2H6v-2c0-2.8 2-5.2 5-6-3-.8-5-3.2-5-6V2zM8 20h8v-1c0-2.2-1.8-4-4-4s-4 1.8-4 4v1zM16 4H8v1c0 2.2 1.8 4 4 4s4-1.8 4-4V4z"/>
            </svg>
            <span>Valid for the next 24 hours only</span>
          </div>
        </div>
      </div>
    </div>
  );
}
