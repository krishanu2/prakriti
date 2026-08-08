import { useEffect, useState } from 'react';
import { api } from './api.js';
import { useToast, useConfirm, Spinner, EmptyState } from './ui.jsx';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
}

export default function LeadsTab() {
  const [leads, setLeads] = useState(null);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const showToast = useToast();
  const confirm = useConfirm();

  function load() {
    setError('');
    api.getLeads().then((d) => setLeads(Array.isArray(d) ? d : [])).catch((err) => setError(err.message));
  }

  useEffect(load, []);

  async function toggleStatus(lead) {
    const nextStatus = lead.status === 'new' ? 'contacted' : 'new';
    setBusyId(lead.id);
    try {
      await api.updateLeadStatus(lead.id, nextStatus);
      setLeads((ls) => ls.map((l) => (l.id === lead.id ? { ...l, status: nextStatus } : l)));
      showToast(nextStatus === 'contacted' ? 'Marked as contacted.' : 'Marked as new.');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setBusyId(null);
    }
  }

  async function removeLead(lead) {
    const ok = await confirm({
      title: `Remove ${lead.name}?`,
      body: 'This deletes their enquiry completely. They will then be able to submit a brand new enquiry from the website — use this once you\'ve finished helping them.',
      confirmLabel: 'Remove enquiry',
      danger: true,
    });
    if (!ok) return;

    setBusyId(lead.id);
    try {
      await api.deleteLead(lead.id);
      setLeads((ls) => ls.filter((l) => l.id !== lead.id));
      showToast(`${lead.name} removed. They can submit a new enquiry now.`);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setBusyId(null);
    }
  }

  if (error) {
    return (
      <div>
        <p className="text-body text-[14px] mb-4" style={{ color: '#a13d2e' }}>{error}</p>
        <button onClick={load} className="btn-outline !py-2.5 !px-5 !text-[12px]">Try again</button>
      </div>
    );
  }

  if (!leads) {
    return (
      <div className="flex items-center gap-3 py-16 justify-center">
        <Spinner />
        <span className="text-body text-[14px]">Loading enquiries…</span>
      </div>
    );
  }

  const newCount = leads.filter((l) => l.status === 'new').length;

  return (
    <div>
      <p className="text-body text-[14px] mb-6 max-w-[560px]">
        Everyone who submits the enquiry form on the website shows up here. Each
        person can only submit once — if you want to let someone fill it out
        again (say, they made a mistake, or you're starting a fresh
        conversation), click <span className="font-semibold text-ink">Remove</span> on their card.
      </p>

      {leads.length > 0 && (
        <p className="text-caption text-black/50 mb-4">
          {newCount} new · {leads.length - newCount} contacted · {leads.length} total
        </p>
      )}

      {leads.length === 0 ? (
        <EmptyState
          title="No enquiries yet"
          body="When someone fills out the form on the website, their details will appear here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {leads.map((lead) => (
            <div key={lead.id} className="bg-white border border-black/[0.1] rounded-lg p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <p className="font-inter font-semibold text-[15px] text-ink">{lead.name}</p>
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
                      style={{
                        background: lead.status === 'new' ? 'var(--blush)' : 'rgba(26,25,23,0.08)',
                        color: 'var(--ink)',
                      }}
                    >
                      {lead.status === 'new' ? 'New' : 'Contacted'}
                    </span>
                  </div>
                  <p className="text-caption text-black/40 mt-1">{formatDate(lead.created_at)}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-5 mb-3 text-[13.5px]">
                <a href={`mailto:${lead.email}`} className="text-ink underline decoration-1 underline-offset-2">
                  {lead.email}
                </a>
                <a href={`tel:${lead.phone}`} className="text-ink underline decoration-1 underline-offset-2">
                  {lead.phone}
                </a>
              </div>

              {lead.message && (
                <p className="text-body text-[13.5px] bg-cream rounded-md px-3.5 py-3 mb-4">
                  {lead.message}
                </p>
              )}

              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => toggleStatus(lead)}
                  disabled={busyId === lead.id}
                  className="btn-outline !py-2 !px-4 !text-[11px]"
                >
                  Mark as {lead.status === 'new' ? 'Contacted' : 'New'}
                </button>
                <button
                  onClick={() => removeLead(lead)}
                  disabled={busyId === lead.id}
                  className="!py-2 !px-4 text-[11px] font-semibold uppercase tracking-wide rounded-[2px] border border-black/[0.18]"
                  style={{ color: '#a13d2e' }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
