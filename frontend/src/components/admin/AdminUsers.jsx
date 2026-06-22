import { useEffect, useState } from 'react';
import { HiOutlineNoSymbol, HiOutlineTrash, HiOutlineCheckCircle } from 'react-icons/hi2';
import { adminApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const AdminUsers = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getUsers();
      setUsers(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleConfirm = async () => {
    if (!confirmAction) return;

    setActionId(confirmAction.user.id);
    try {
      if (confirmAction.type === 'block') {
        await adminApi.blockUser(confirmAction.user.id);
      } else if (confirmAction.type === 'unblock') {
        await adminApi.unblockUser(confirmAction.user.id);
      } else {
        await adminApi.deleteUser(confirmAction.user.id);
      }
      setConfirmAction(null);
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId(null);
    }
  };

  const confirmCopy = confirmAction?.type === 'block'
    ? {
        title: 'Block this user?',
        message: `${confirmAction.user.name} will not be able to sign in after being blocked.`,
        confirmLabel: 'Block User',
        variant: 'default',
      }
    : confirmAction?.type === 'unblock'
      ? {
          title: 'Unblock this user?',
          message: `${confirmAction.user.name} will be able to sign in and use the store again.`,
          confirmLabel: 'Unblock User',
          variant: 'default',
        }
      : confirmAction?.type === 'delete'
      ? {
          title: 'Delete this user?',
          message: `${confirmAction.user.name} will be permanently removed. This action cannot be undone.`,
          confirmLabel: 'Delete User',
          variant: 'danger',
        }
      : null;

  return (
    <>
      <div className="admin-content__header">
        <div>
          <h1>Users</h1>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: 'var(--fs-small)' }}>
            {users.length} registered users
          </p>
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <p className="admin-loading">Loading users...</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isSelf = user.id === currentUser?.id;
                const isBusy = actionId === user.id;

                return (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || '—'}</td>
                    <td>{user.role}</td>
                    <td>{user.isBlocked ? 'Blocked' : 'Active'}</td>
                    <td>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-IN')
                        : '—'}
                    </td>
                    <td>
                      <div className="admin-table__actions">
                        {!isSelf && user.isBlocked && user.role !== 'admin' && (
                          <button
                            type="button"
                            title="Unblock user"
                            aria-label={`Unblock ${user.name}`}
                            disabled={isBusy}
                            onClick={() => setConfirmAction({ type: 'unblock', user })}
                          >
                            <HiOutlineCheckCircle aria-hidden="true" />
                          </button>
                        )}
                        {!isSelf && !user.isBlocked && user.role !== 'admin' && (
                          <button
                            type="button"
                            title="Block user"
                            aria-label={`Block ${user.name}`}
                            disabled={isBusy}
                            onClick={() => setConfirmAction({ type: 'block', user })}
                          >
                            <HiOutlineNoSymbol aria-hidden="true" />
                          </button>
                        )}
                        {!isSelf && user.role !== 'admin' && (
                          <button
                            type="button"
                            className="delete"
                            title="Delete user"
                            aria-label={`Delete ${user.name}`}
                            disabled={isBusy}
                            onClick={() => setConfirmAction({ type: 'delete', user })}
                          >
                            <HiOutlineTrash aria-hidden="true" />
                          </button>
                        )}
                        {isSelf && <span className="text-muted">You</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(confirmAction && confirmCopy)}
        title={confirmCopy?.title}
        message={confirmCopy?.message}
        confirmLabel={confirmCopy?.confirmLabel}
        variant={confirmCopy?.variant}
        isLoading={Boolean(actionId)}
        onConfirm={handleConfirm}
        onClose={() => {
          if (!actionId) setConfirmAction(null);
        }}
      />
    </>
  );
};
