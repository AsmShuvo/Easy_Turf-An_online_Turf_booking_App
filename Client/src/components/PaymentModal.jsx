import React, { useState } from "react";
import { X, CreditCard, Droplets, CheckCircle } from "lucide-react";

const PaymentModal = ({ isOpen, onClose, onSubmit, amount }) => {
  const [method, setMethod] = useState(null); // 'BKASH', 'NAGAD', 'ONSITE'
  const [trxId, setTrxId] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit({ method, transactionId: trxId });
  };

  const isSubmitDisabled = () => {
    if (!method) return true;
    if ((method === "BKASH" || method === "NAGAD") && !trxId.trim())
      return true;
    return false;
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">
            Select <span className="text-lime-400">Payment</span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4 mb-8">
          <p className="text-gray-400 text-sm">
            Total Amount:{" "}
            <span className="text-white font-bold">৳{amount}</span>
          </p>

          <div className="grid grid-cols-3 gap-3">
            {["BKASH", "NAGAD", "ONSITE"].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMethod(m);
                  setTrxId("");
                }}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  method === m
                    ? "bg-lime-400 text-black border-lime-400"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                }`}
              >
                <CreditCard size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {m}
                </span>
              </button>
            ))}
          </div>
        </div>

        {method && (
          <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
            {method === "BKASH" || method === "NAGAD" ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-lime-400 bg-lime-400/10 p-3 rounded-lg border border-lime-400/20">
                  <Droplets size={20} />
                  <span className="text-xs font-bold uppercase tracking-wide">
                    Bonus: 1L Water Free!
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    placeholder="e.g. 8JKS92KL"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-lime-400/50 transition-colors font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 text-sm py-4">
                <CheckCircle className="mx-auto mb-2 text-lime-400" size={32} />
                <p>Pay cash at the venue counter.</p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isSubmitDisabled()}
          className="w-full py-4 bg-lime-400 text-black font-black uppercase tracking-widest rounded-xl hover:bg-lime-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
