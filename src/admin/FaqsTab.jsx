import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { api } from './api.js';
import { useToast, useConfirm, Spinner, EmptyState, Modal } from './ui.jsx';

function FaqForm({ initial, onCancel, onSave, saving }) {
  const [question, setQuestion] = useState(initial?.question || '');
  const [answer, setAnswer] = useState(initial?.answer || '');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!question.trim()) return setError('The question is required.');
    if (!answer.trim()) return setError('The answer is required.');
    setError('');
    onSave({ question: question.trim(), answer: answer.trim() });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label className="text-caption text-black/60 block mb-1.5">Question</label>
      <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} className="field-input mb-4" placeholder="e.g. Is this safe postpartum?" />

      <label className="text-caption text-black/60 block mb-1.5">Answer</label>
      <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={4} className="field-input mb-2 resize-none" placeholder="Your answer…" />

      {error && <p className="text-[13px] mt-3" style={{ color: '#a13d2e' }}>{error}</p>}

      <div className="flex gap-3 justify-end mt-6">
        <button type="button" onClick={onCancel} className="btn-outline !py-2.5 !px-5 !text-[12px]">Cancel</button>
        <button type="submit" disabled={saving} className="btn-outline !py-2.5 !px-5 !text-[12px]" style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
          {saving ? 'Saving…' : 'Save Question'}
        </button>
      </div>
    </form>
  );
}

export default function FaqsTab() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const showToast = useToast();
  const confirm = useConfirm();

  function load() {
    setError('');
    api.getFaqs().then((d) => setItems(Array.isArray(d) ? d : [])).catch((err) => setError(err.message));
  }

  useEffect(load, []);

  async function handleSave(payload) {
    setSaving(true);
    try {
      if (modal === 'new') {
        const created = await api.addFaq(payload);
        setItems((it) => [...it, created]);
        showToast('Question added.');
      } else {
        const updated = await api.updateFaq(modal.id, payload);
        setItems((it) => it.map((x) => (x.id === modal.id ? updated : x)));
        showToast('Question updated.');
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
      title: 'Remove this question?',
      body: "It will disappear from the FAQ section on the website right away. This can't be undone.",
      confirmLabel: 'Remove question',
      danger: true,
    });
    if (!ok) return;

    setBusyId(item.id);
    try {
      await api.deleteFaq(item.id);
      setItems((it) => it.filter((x) => x.id !== item.id));
      showToast('Question removed.');
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
        <span className="text-body text-[14px]">Loading FAQs…</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <p className="text-body text-[14px] max-w-[480px]">
          These are the questions in the "Questions, answered honestly" section on the website.
        </p>
        <button onClick={() => setModal('new')} className="btn-outline !py-2.5 !px-5 !text-[12px] shrink-0">
          + Add Question
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyState title="No questions yet" body="Add your first FAQ to get started." />
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-black/[0.1] rounded-lg p-5">
              <p className="font-inter font-semibold text-[14px] text-ink mb-1.5">{item.question}</p>
              <p className="text-body text-[13.5px] mb-3">{item.answer}</p>
              <div className="flex gap-4">
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
          <Modal title={modal === 'new' ? 'Add a Question' : 'Edit Question'} onClose={() => setModal(null)}>
            <FaqForm
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
