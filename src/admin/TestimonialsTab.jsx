import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { api } from './api.js';
import { useToast, useConfirm, Spinner, EmptyState, Modal, PhotoUploadField } from './ui.jsx';

function TestimonialForm({ initial, onCancel, onSave, saving }) {
  const [name, setName] = useState(initial?.name || '');
  const [context, setContext] = useState(initial?.context || '');
  const [quote, setQuote] = useState(initial?.quote || '');
  const [avatarUrl, setAvatarUrl] = useState(initial?.avatar_url || '');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return setError("The client's name is required.");
    if (!quote.trim()) return setError('The testimonial text is required.');
    setError('');
    onSave({ name: name.trim(), context: context.trim(), quote: quote.trim(), avatar_url: avatarUrl.trim() });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label className="text-caption text-black/60 block mb-1.5">Client name</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="field-input mb-4" placeholder="e.g. Ritika S." />

      <label className="text-caption text-black/60 block mb-1.5">Context (optional)</label>
      <input type="text" value={context} onChange={(e) => setContext(e.target.value)} className="field-input mb-4" placeholder="e.g. 6 weeks postpartum" />

      <label className="text-caption text-black/60 block mb-1.5">What they said</label>
      <textarea value={quote} onChange={(e) => setQuote(e.target.value)} rows={4} className="field-input mb-4 resize-none" placeholder="Their testimonial…" />

      <PhotoUploadField value={avatarUrl} onChange={setAvatarUrl} aspect="aspect-square rounded-full" label="Photo (optional)" />

      {error && <p className="text-[13px] mt-3" style={{ color: '#a13d2e' }}>{error}</p>}

      <div className="flex gap-3 justify-end mt-6">
        <button type="button" onClick={onCancel} className="btn-outline !py-2.5 !px-5 !text-[12px]">Cancel</button>
        <button type="submit" disabled={saving} className="btn-outline !py-2.5 !px-5 !text-[12px]" style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
          {saving ? 'Saving…' : 'Save Testimonial'}
        </button>
      </div>
    </form>
  );
}

export default function TestimonialsTab() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const showToast = useToast();
  const confirm = useConfirm();

  function load() {
    setError('');
    api.getTestimonials().then((d) => setItems(Array.isArray(d) ? d : [])).catch((err) => setError(err.message));
  }

  useEffect(load, []);

  async function handleSave(payload) {
    setSaving(true);
    try {
      if (modal === 'new') {
        const created = await api.addTestimonial(payload);
        setItems((it) => [...it, created]);
        showToast('Testimonial added.');
      } else {
        const updated = await api.updateTestimonial(modal.id, payload);
        setItems((it) => it.map((x) => (x.id === modal.id ? updated : x)));
        showToast('Testimonial updated.');
      }
      setModal(null);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    const ok = await confirm({
      title: `Remove ${item.name}'s testimonial?`,
      body: "It will disappear from the website right away. This can't be undone.",
      confirmLabel: 'Remove testimonial',
      danger: true,
    });
    if (!ok) return;

    setBusyId(item.id);
    try {
      await api.deleteTestimonial(item.id);
      setItems((it) => it.filter((x) => x.id !== item.id));
      showToast('Testimonial removed.');
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

  if (!items) {
    return (
      <div className="flex items-center gap-3 py-16 justify-center">
        <Spinner />
        <span className="text-body text-[14px]">Loading testimonials…</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <p className="text-body text-[14px] max-w-[480px]">
          These reviews scroll across the "What moms are actually saying" section on the website.
        </p>
        <button onClick={() => setModal('new')} className="btn-outline !py-2.5 !px-5 !text-[12px] shrink-0">
          + Add Testimonial
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyState title="No testimonials yet" body="Add your first client testimonial to get started." />
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-black/[0.1] rounded-lg p-5 flex gap-4">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-cream shrink-0 border border-black/[0.08]">
                {item.avatar_url && <img src={item.avatar_url} alt={item.name} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-inter font-semibold text-[14px] text-ink">{item.name}</p>
                {item.context && <p className="text-caption text-black/45 mb-1.5">{item.context}</p>}
                <p className="text-body text-[13.5px] mb-3">{item.quote}</p>
                <div className="flex gap-4">
                  <button onClick={() => setModal(item)} disabled={busyId === item.id} className="text-[11px] underline decoration-1 underline-offset-2 text-ink">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item)} disabled={busyId === item.id} className="text-[11px] underline decoration-1 underline-offset-2" style={{ color: '#a13d2e' }}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <Modal title={modal === 'new' ? 'Add a Testimonial' : 'Edit Testimonial'} onClose={() => setModal(null)}>
            <TestimonialForm
              initial={modal === 'new' ? null : modal}
              onCancel={() => setModal(null)}
              onSave={handleSave}
              saving={saving}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
