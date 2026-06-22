import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  isLoading = false,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && !isLoading) {
      onClose();
    }
  };

  return (
    <div className="auth-overlay open" onClick={handleOverlayClick}>
      <div className="auth-modal confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
        <div className="confirm-dialog__icon" data-variant={variant}>
          <HiOutlineExclamationTriangle aria-hidden="true" />
        </div>
        <h3 id="confirm-dialog-title">{title}</h3>
        {message && <p className="confirm-dialog__message">{message}</p>}
        <div className="confirm-dialog__actions">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn ${variant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
