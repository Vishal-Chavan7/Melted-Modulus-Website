import { HiOutlineXMark } from 'react-icons/hi2';

export const AdminModal = ({ title, onClose, children }) => (
  <div
    className="auth-overlay open"
    onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
  >
    <div className="auth-modal admin-modal">
      <div className="admin-modal__header">
        <h3>{title}</h3>
        <button type="button" className="auth-modal__close" onClick={onClose} aria-label="Close">
          <HiOutlineXMark className="ri-icon" size={18} aria-hidden="true" />
        </button>
      </div>
      <div className="admin-modal__body">{children}</div>
    </div>
  </div>
);
