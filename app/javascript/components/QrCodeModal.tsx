import React from 'react';

interface QrCodeModalProps {
  isOpen: boolean;
  qrCode: string;
}

const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, qrCode }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <div dangerouslySetInnerHTML={{ __html: qrCode }} />
      </div>
    </div>
  );
};

export default QrCodeModal; 