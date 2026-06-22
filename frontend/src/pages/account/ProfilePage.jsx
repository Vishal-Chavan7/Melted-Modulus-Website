import { useEffect, useState } from 'react';
import { HiOutlineCheckCircle } from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../services/api';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry',
];

export const ProfilePage = () => {
  const { currentUser, updateCurrentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: 'Maharashtra',
    country: 'India',
    pincode: '',
  });

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      setLoading(true);
      try {
        const profile = await userApi.getProfile();
        if (!mounted) return;
        updateCurrentUser(profile);
        setForm({
          name: profile.name || '',
          phone: profile.phone || '',
          street: profile.address?.street || '',
          city: profile.address?.city || '',
          state: profile.address?.state || 'Maharashtra',
          country: profile.address?.country || 'India',
          pincode: profile.address?.pincode || '',
        });
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();
    return () => { mounted = false; };
  }, [updateCurrentUser]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const profile = await userApi.updateProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: {
          street: form.street.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          country: form.country.trim(),
          pincode: form.pincode.trim(),
        },
      });
      updateCurrentUser(profile);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="account-loading">Loading profile...</p>;
  }

  return (
    <div className="account-panel">
      <div className="account-panel__header">
        <h2>My Profile</h2>
        <p>Update your personal details and default delivery address.</p>
      </div>

      <div className="account-profile-meta">
        <div className="account-profile-meta__avatar">
          {(form.name || currentUser?.name || 'U').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
        </div>
        <div>
          <strong>{currentUser?.email}</strong>
          <p className="text-muted">Member since {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—'}</p>
        </div>
      </div>

      {error && <p className="account-error">{error}</p>}
      {success && (
        <p className="account-success">
          <HiOutlineCheckCircle className="ri-icon" aria-hidden="true" />
          Profile updated successfully.
        </p>
      )}

      <form className="account-form" onSubmit={handleSubmit}>
        <h3>Personal Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="profile-name">Full Name</label>
            <input id="profile-name" type="text" className="form-input" required minLength={3} value={form.name} onChange={handleChange('name')} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-phone">Phone</label>
            <input id="profile-phone" type="tel" className="form-input" required minLength={10} value={form.phone} onChange={handleChange('phone')} />
          </div>
        </div>

        <h3>Default Address</h3>
        <div className="form-group">
          <label className="form-label" htmlFor="profile-street">Street Address</label>
          <input id="profile-street" type="text" className="form-input" value={form.street} onChange={handleChange('street')} placeholder="House no., building, street" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="profile-city">City</label>
            <input id="profile-city" type="text" className="form-input" value={form.city} onChange={handleChange('city')} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-pincode">Pincode</label>
            <input id="profile-pincode" type="text" className="form-input" value={form.pincode} onChange={handleChange('pincode')} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="profile-state">State</label>
            <select id="profile-state" className="form-input" value={form.state} onChange={handleChange('state')}>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-country">Country</label>
            <input id="profile-country" type="text" className="form-input" value={form.country} onChange={handleChange('country')} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};
