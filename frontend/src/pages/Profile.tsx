import { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/Buttons';
import { ChangePasswordModal } from '../components/ChangePasswordModal';
import { useProfile } from '../hooks/useProfile';
import { useNavigate } from 'react-router-dom';

function ProfileField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-1">
      <div className="text-sm font-medium text-gray-700">{label}</div>
      <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
        {value || '-'}
      </div>
    </div>
  );
}

export function Profile() {
  const { data, loading, error } = useProfile();
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center text-purple-600">
          Loading…
        </div>
        <Footer />
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center text-red-600">
          {error || 'Error loading profile'}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField label="Username" value={data.username} />
            <ProfileField label="Email" value={data.email} />
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Security</h2>
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Password</div>
                <div className="text-sm text-gray-600">
                  Change your account password
                </div>
              </div>  
            </div>
            <Button
                variant="outline"
                text="Change Password"
                onClick={() => setModalOpen(true)}
              />
          </div>

          <div className="border-t border-gray-200 pt-6 flex justify-between">
            <Button
              variant="secondary"
              text="Back to Dashboard"
              onClick={() => navigate('/dashboard')}
            />
            <Button
              variant="primary"
              text="Sign Out"
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/signin');
              }}
            />
          </div>
        </div>
      </main>

      <Footer />

      <ChangePasswordModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
