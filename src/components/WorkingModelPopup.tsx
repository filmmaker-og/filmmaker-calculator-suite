import { X } from "lucide-react";
import type { Product } from "@/lib/store-products";

interface WorkingModelPopupProps {
  baseProduct: Product;
  onAccept: () => void;
  onDecline: () => void;
  onClose: () => void;
}

const WorkingModelPopup = ({
  baseProduct,
  onAccept,
  onDecline,
  onClose,
}: WorkingModelPopupProps) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    />
    {/* Modal */}
    <div className="relative w-full max-w-md rounded-xl border border-gold/30 bg-bg-header p-6 space-y-5 animate-fade-in">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-text-dim hover:text-text-mid transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div>
        <h3 className="font-bebas text-2xl tracking-[0.06em] text-gold mb-1">
          ADD THE LIVE EXCEL MODEL
        </h3>
        <p className="text-text-mid text-sm">50% off when you bundle now</p>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="font-mono text-lg text-text-dim line-through">
          $99
        </span>
        <span className="font-mono text-3xl font-medium text-white">$49</span>
      </div>

      <p className="text-text-dim text-sm leading-relaxed">
        Get the formula-driven Excel engine behind your finance plan. Change any
        input — watch every investor's return recalculate instantly. Reuse on
        every project.
      </p>

      <div className="space-y-3">
        <button
          onClick={onAccept}
          className="w-full h-14 text-base btn-cta-primary"
        >
          Yes, Add for $49
        </button>
        <button
          onClick={onDecline}
          className="w-full text-center text-text-dim text-sm hover:text-text-mid transition-colors py-2"
        >
          No thanks, continue
        </button>
      </div>
    </div>
  </div>
);

export default WorkingModelPopup;
