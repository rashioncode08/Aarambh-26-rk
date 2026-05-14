'use client';

import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, setDoc, doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../../lib/firebase';
import { SkeletonTable } from '../../../components/admin/SkeletonLoader';
import { Modal } from '../../../components/admin/Modal';
import { logAdminAction } from '../../../lib/audit';
import { Plus, Trash2, Pin, Eye, EyeOff, ShieldAlert } from 'lucide-react';

// Basic Markdown parser for preview
function parseMarkdown(text: string) {
  let html = text
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-5 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-6 mb-4">$1</h1>')
    .replace(/\\*\\*(.*?)\\*\\*/gim, '<strong>$1</strong>')
    .replace(/\\*(.*?)\\*/gim, '<em>$1</em>')
    .replace(/\n/gim, '<br />');
  return html;
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);

  const [formData, setFormData] = useState({ title: '', body: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, 'announcements')), (snap) => {
      let anns: any[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
      anns.sort((a, b) => {
        const timeA = a.postedAt?.toMillis() || 0;
        const timeB = b.postedAt?.toMillis() || 0;
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return timeB - timeA; // Descending
      });
      setAnnouncements(anns);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const docRef = doc(collection(db, 'announcements'));
      await setDoc(docRef, {
        title: formData.title,
        body: formData.body,
        postedAt: serverTimestamp(),
        postedBy: auth.currentUser?.uid,
        isPinned: false,
        isVisible: true
      });
      await logAdminAction('CREATE_ANNOUNCEMENT', `announcements/${docRef.id}`, `Announcement: ${formData.title}`);
      
      setIsModalOpen(false);
      setFormData({ title: '', body: '' });
    } catch (err) {
      alert('Error saving announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id: string, field: 'isPinned' | 'isVisible', currentValue: boolean) => {
    await updateDoc(doc(db, 'announcements', id), { [field]: !currentValue });
    await logAdminAction(`TOGGLE_ANNOUNCEMENT_${field.toUpperCase()}`, `announcements/${id}`, `Changed to ${!currentValue}`);
  };

  const handleDelete = async () => {
    if (!selectedAnnouncement) return;
    try {
      await deleteDoc(doc(db, 'announcements', selectedAnnouncement.id));
      await logAdminAction('DELETE_ANNOUNCEMENT', `announcements/${selectedAnnouncement.id}`, `Deleted announcement: ${selectedAnnouncement.title}`);
      setIsDeleteOpen(false);
      setSelectedAnnouncement(null);
    } catch (err) {
      alert('Error deleting announcement');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-adminHeading text-3xl font-bold mb-2">Announcements</h1>
          <p className="text-admin-muted">Broadcast messages to attendees</p>
        </div>
        <button 
          onClick={() => { setFormData({ title: '', body: '' }); setIsModalOpen(true); }}
          className="bg-admin-accent hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Compose
        </button>
      </div>

      {loading ? (
        <SkeletonTable rows={5} />
      ) : (
        <div className="bg-admin-surface border border-admin-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-admin-bg/50 border-b border-admin-border text-admin-muted text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">Title</th>
                  <th className="p-4 font-medium">Posted At</th>
                  <th className="p-4 font-medium">Pinned</th>
                  <th className="p-4 font-medium">Visible</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {announcements.map((ann) => (
                  <tr key={ann.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4 font-medium">
                      {ann.isPinned && <Pin size={14} className="inline mr-2 text-admin-accent" />}
                      {ann.title}
                    </td>
                    <td className="p-4 text-sm text-admin-muted">
                      {ann.postedAt ? ann.postedAt.toDate().toLocaleString() : 'Just now'}
                    </td>
                    <td className="p-4">
                      <button onClick={() => handleToggle(ann.id, 'isPinned', ann.isPinned)} className={`px-2 py-1 rounded text-xs ${ann.isPinned ? 'bg-admin-accent/20 text-admin-accent' : 'bg-admin-bg text-admin-muted hover:text-white'}`}>
                        {ann.isPinned ? 'Yes' : 'No'}
                      </button>
                    </td>
                    <td className="p-4">
                      <button onClick={() => handleToggle(ann.id, 'isVisible', ann.isVisible)} className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${ann.isVisible ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {ann.isVisible ? <><Eye size={12} /> Yes</> : <><EyeOff size={12} /> No</>}
                      </button>
                    </td>
                    <td className="p-4 flex items-center justify-end gap-3">
                      <button 
                        onClick={() => { setSelectedAnnouncement(ann); setIsDeleteOpen(true); }}
                        className="text-red-500/70 hover:text-red-500 transition-colors"
                        title="Delete Announcement"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {announcements.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-admin-muted">
                      No announcements found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Compose Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Compose Announcement">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-admin-muted">Title</label>
            <input 
              type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full bg-admin-bg border border-admin-border rounded-lg py-2 px-4 focus:outline-none focus:border-admin-accent"
              placeholder="E.g., Welcome to Aarambh 2026!"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-admin-muted">Body (Markdown)</label>
              <textarea 
                rows={8} required value={formData.body} onChange={e => setFormData({...formData, body: e.target.value})}
                className="w-full bg-admin-bg border border-admin-border rounded-lg py-2 px-4 focus:outline-none focus:border-admin-accent resize-none font-mono text-sm"
                placeholder="Use Markdown:\\n# Heading\\n**bold**\\n*italic*"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-admin-muted">Preview</label>
              <div 
                className="w-full h-[214px] bg-admin-bg border border-admin-border rounded-lg p-4 overflow-y-auto prose prose-invert prose-sm"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(formData.body) || '<span class="text-gray-500">Preview will appear here...</span>' }}
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-admin-muted hover:text-white">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="bg-admin-accent text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500">
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Announcement">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-red-500 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
            <ShieldAlert size={24} />
            <p className="text-sm">Are you sure you want to delete <strong>{selectedAnnouncement?.title}</strong>? This cannot be undone.</p>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 rounded-lg text-admin-muted hover:text-white">Cancel</button>
            <button onClick={handleDelete} className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600">
              Delete Announcement
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
