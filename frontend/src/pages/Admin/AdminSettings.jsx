import useAuth from '../../hooks/useAuth';

const AdminSettings = () => {
  const { user } = useAuth();

  return (
    <div className="border theme-border rounded-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
      <div className="px-6 py-4 border-b theme-border">
        <h3 className="font-mono text-[11px] tracking-[0.3em] theme-text-muted uppercase">Account Settings</h3>
      </div>
      <div className="px-6 py-5 space-y-4">
        {[
          { label: 'Full Name', value: user?.name },
          { label: 'Email', value: user?.email },
          { label: 'Role', value: user?.role },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between py-3 border-b theme-border last:border-0">
            <span className="font-mono text-[10px] tracking-[0.2em] theme-text-muted uppercase">{label}</span>
            <span className="font-body theme-text-secondary text-sm">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSettings;