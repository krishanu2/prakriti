import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { api } from './api.js';
import { useToast, useConfirm, Spinner, EmptyState, Modal } from './ui.jsx';

function GalleryForm({ initial, onCancel, onSave, saving }) {
  const [imageUrl, setImageUrl] = useState(initial?.image_url || '');
  const [altText, setAltText] = useState(initial?.alt_text || '');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!imageUrl.trim()) {
      setError('Paste an image link first.');
      return;
    }
    setError('');
    onSave({ image_url: imageUrl.trim(), alt_text: altText.trim() });
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="text-body text-[13px] mb-4">
        Paste a link to any image — from Unsplash, Google Photos, Instagram, or
        anywhere else online. It'll appear in the scrolling gallery on the site.
      </p>

      <label className="text-caption text-black/60 block mb-1.5">Image link</label>
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="field-input mb-4"
        placeholder="https://..."
      />

      {imageUrl.trim() && (
        <div className="w-24 aspect-[4/5] rounded overflow-hidden bg-cream mb-4 border border-black/[0.08]">
          <img src={imageUrl.trim()} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.opacity = 0.15)} />
        </div>
      )}

      <label className="text-caption text-black/60 block mb-1.5">Description (optional)</label>
      <input
        type="text"
        value={altText}
        onChange={(e) => setAltText(e.target.value)}
        className="field-input mb-2"
        placeholder="e.g. Client core exercise"
      />

      {error && <p className="text-[13px] mt-3" style={{ color: '#a13d2e' }}>{error}</p>}

      <div className="flex gap-3 justify-end mt-6">
        <button type="button" onClick={onCancel} className="btn-outline !py-2.5 !px-5 !text-[12px]">Cancel</button>
        <button type="submit" disabled={saving} className="btn-outline !py-2.5 !px-5 !text-[12px]" style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
          {saving ? 'Saving…' : 'Save Photo'}
        </button>
      </div>
    </form>
  );
}

export default function GalleryTab() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // 'new' | item | null
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const showToast = useToast();
  const confirm = useConfirm();

  function load() {
    setError('');
    api.getGallery().then(setItems).catch((err) => setError(err.message));
  }

  useEffect(load, []);

  async function handleSave(payload) {
    setSaving(true);
    try {
      if (modal === 'new') {
        const created = await api.addGalleryImage(payload);
        setItems((it) => [...it, created]);
        showToast('Photo added to the gallery.');
      } else {
        const updated = await api.updateGalleryImage(modal.id, payload);
        setItems((it) => it.map((x) => (x.id === modal.id ? updated : x)));
        showToast('Photo updated.');
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
      title: 'Remove this photo?',
      body: "It will disappear from the gallery on the website right away. This can't be undone.",
      confirmLabel: 'Remove photo',
      danger: true,
    });
    if (!ok) return;

    setBusyId(item.id);
    try {
      await api.deleteGalleryImage(item.id);
      setItems((it) => it.filter((x) => x.id !== item.id));
      showToast('Photo removed.');
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
        <span className="text-body text-[14px]">Loading gallery…</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <p className="text-body text-[14px] max-w-[480px]">
          These photos scroll across the "Real moms. Real strength." section on the website.
        </p>
        <button onClick={() => setModal('new')} className="btn-outline !py-2.5 !px-5 !text-[12px] shrink-0">
          + Add Photo
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyState title="No photos yet" body="Add your first photo to start the gallery." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="group relative">
              <div className="aspect-[4/5] rounded-md overflow-hidden bg-cream border border-black/[0.08]">
                <img src={item.image_url} alt={item.alt_text} className="w-full h-full object-cover" />
              </div>
              <p className="text-[11.5px] text-black/50 mt-1.5 truncate">{item.alt_text || 'No description'}</p>
              <div className="flex gap-2 mt-1.5">
                <button onClick={() => setModal(item)} disabled={busyId === item.id} className="text-[11px] underline decoration-1 underline-offset-2 text-ink">
                  Edit
                </button>
                <button onClick={() => handleDelete(item)} disabled={busyId === item.id} className="text-[11px] underline decoration-1 underline-offset-2" style={{ color: '#a13d2e' }}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <Modal title={modal === 'new' ? 'Add a Photo' : 'Edit Photo'} onClose={() => setModal(null)}>
            <GalleryForm
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
