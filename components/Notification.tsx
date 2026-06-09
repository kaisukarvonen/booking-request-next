'use client';

interface Props {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Notification({ message, type, onClose }: Props) {
  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 shadow-lg border text-sm flex items-center gap-3 ${
        type === 'success'
          ? 'bg-brand-subtle border-brand text-brand'
          : 'bg-red-50 border-red-400 text-red-700'
      }`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 font-bold text-lg leading-none">
        ×
      </button>
    </div>
  );
}
