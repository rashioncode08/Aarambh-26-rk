'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { SkeletonTable } from '../../../components/admin/SkeletonLoader';
import { Modal } from '../../../components/admin/Modal';
import { logAdminAction } from '../../../lib/audit';
import { Download, Eye, Users } from 'lucide-react';

export default function Registrations() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReg, setSelectedReg] = useState<any>(null);
  
  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('registeredAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 25;

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, 'registrations'), orderBy('registeredAt', 'desc')), (snap) => {
      setRegistrations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedRegistrations = useMemo(() => {
    const sorted = [...registrations].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'registeredAt') {
        valA = valA?.toMillis() || 0;
        valB = valB?.toMillis() || 0;
      } else if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB || '').toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [registrations, sortField, sortOrder]);

  const paginatedRegistrations = sortedRegistrations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(registrations.length / itemsPerPage);

  const exportCSV = async () => {
    const headers = ['Name', 'Registration Number', 'Cohort', 'Year', 'Email', 'Phone', 'Registration Time', 'Entry Status', 'Father Name', 'Father Mobile', 'Mother Name', 'Mother Mobile', 'Address', 'Cohort Leader'];
    const rows = sortedRegistrations.map(r => [
      `"${r.name || ''}"`,
      `"${r.rollNumber || ''}"`,
      `"${r.branch || ''}"`,
      r.year || '',
      `"${r.email || ''}"`,
      `"${r.phone || ''}"`,
      `"${r.registeredAt ? r.registeredAt.toDate().toLocaleString() : ''}"`,
      r.hasEntered ? 'Entered' : 'Pending',
      `"${r.fatherName || ''}"`,
      `"${r.fatherMobile || ''}"`,
      `"${r.motherName || ''}"`,
      `"${r.motherMobile || ''}"`,
      `"${(r.address || '').replace(/"/g, '""')}"`,
      `"${r.cohortLeader || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    await logAdminAction('EXPORT_REGISTRATIONS', 'registrations', `Exported ${registrations.length} registrations to CSV`);
  };

  return (
    <div>
      {/* Live Counter */}
      <div className="bg-admin-surface border border-admin-border p-8 rounded-xl mb-8 flex flex-col items-center justify-center text-center">
        <Users size={32} className="text-admin-accent mb-4" />
        <h2 className="text-sm font-medium text-admin-muted uppercase tracking-widest mb-2">Total Registrations</h2>
        <p className="font-adminHeading text-6xl font-black text-white">{loading ? '-' : registrations.length}</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="font-adminHeading text-2xl font-bold">Registration Data</h1>
        <button 
          onClick={exportCSV}
          disabled={loading || registrations.length === 0}
          className="bg-admin-accent hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Download size={18} /> Export CSV
        </button>
      </div>

      {loading ? (
        <SkeletonTable rows={10} />
      ) : (
        <div className="bg-admin-surface border border-admin-border rounded-xl overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-admin-bg/50 border-b border-admin-border text-admin-muted text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium cursor-pointer hover:text-white" onClick={() => handleSort('name')}>Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                  <th className="p-4 font-medium cursor-pointer hover:text-white" onClick={() => handleSort('rollNumber')}>Roll No. {sortField === 'rollNumber' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                  <th className="p-4 font-medium cursor-pointer hover:text-white" onClick={() => handleSort('branch')}>Branch {sortField === 'branch' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                  <th className="p-4 font-medium cursor-pointer hover:text-white" onClick={() => handleSort('year')}>Year {sortField === 'year' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                  <th className="p-4 font-medium cursor-pointer hover:text-white" onClick={() => handleSort('registeredAt')}>Registration Time {sortField === 'registeredAt' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                  <th className="p-4 font-medium cursor-pointer hover:text-white" onClick={() => handleSort('hasEntered')}>Status {sortField === 'hasEntered' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {paginatedRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-white/5 transition-colors text-sm">
                    <td className="p-4 font-medium">{reg.name}</td>
                    <td className="p-4">{reg.rollNumber}</td>
                    <td className="p-4">{reg.branch}</td>
                    <td className="p-4">{reg.year}</td>
                    <td className="p-4 text-admin-muted">
                      {reg.registeredAt ? reg.registeredAt.toDate().toLocaleString() : ''}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        reg.hasEntered ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                      }`}>
                        {reg.hasEntered ? 'Entered' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => setSelectedReg(reg)} className="text-admin-muted hover:text-white">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-admin-border flex justify-between items-center bg-admin-bg/50">
              <span className="text-sm text-admin-muted">Page {currentPage} of {totalPages}</span>
              <div className="flex gap-2">
                <button 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="px-3 py-1 bg-admin-surface border border-admin-border rounded hover:bg-white/5 disabled:opacity-50"
                >Prev</button>
                <button 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="px-3 py-1 bg-admin-surface border border-admin-border rounded hover:bg-white/5 disabled:opacity-50"
                >Next</button>
              </div>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={!!selectedReg} onClose={() => setSelectedReg(null)} title="Registration Details">
        {selectedReg && (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-admin-muted mb-1">Full Name</p>
                <p className="font-medium">{selectedReg.name}</p>
              </div>
              <div>
                <p className="text-xs text-admin-muted mb-1">Registration Number</p>
                <p className="font-medium">{selectedReg.rollNumber}</p>
              </div>
              <div>
                <p className="text-xs text-admin-muted mb-1">Email</p>
                <p className="font-medium">{selectedReg.email}</p>
              </div>
              <div>
                <p className="text-xs text-admin-muted mb-1">Phone</p>
                <p className="font-medium">{selectedReg.phone}</p>
              </div>
              <div>
                <p className="text-xs text-admin-muted mb-1">Cohort Name & Number</p>
                <p className="font-medium">{selectedReg.branch}</p>
              </div>
              <div>
                <p className="text-xs text-admin-muted mb-1">Cohort Leader</p>
                <p className="font-medium">{selectedReg.cohortLeader || 'N/A'}</p>
              </div>
              
              <div className="col-span-2 border-t border-admin-border pt-4 mt-2">
                <p className="text-sm text-admin-accent font-semibold mb-3">Parents Details</p>
              </div>
              <div>
                <p className="text-xs text-admin-muted mb-1">Father's Name</p>
                <p className="font-medium">{selectedReg.fatherName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-admin-muted mb-1">Father's Mobile</p>
                <p className="font-medium">{selectedReg.fatherMobile || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-admin-muted mb-1">Mother's Name</p>
                <p className="font-medium">{selectedReg.motherName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-admin-muted mb-1">Mother's Mobile</p>
                <p className="font-medium">{selectedReg.motherMobile || 'N/A'}</p>
              </div>

              <div className="col-span-2 border-t border-admin-border pt-4 mt-2">
                <p className="text-sm text-admin-accent font-semibold mb-3">Additional Details</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-admin-muted mb-1">Address</p>
                <p className="font-medium whitespace-pre-wrap">{selectedReg.address || 'N/A'}</p>
              </div>

              <div>
                <p className="text-xs text-admin-muted mb-1">Entry Status</p>
                <p className={`font-semibold ${selectedReg.hasEntered ? 'text-green-500' : 'text-yellow-500'}`}>
                  {selectedReg.hasEntered ? 'Entered' : 'Pending'}
                </p>
              </div>
              <div>
                <p className="text-xs text-admin-muted mb-1">QR Code Link</p>
                {selectedReg.qrCodeURL ? (
                  <a href={selectedReg.qrCodeURL} target="_blank" rel="noreferrer" className="text-admin-accent hover:underline break-all text-xs">
                    View QR
                  </a>
                ) : (
                  <span className="text-xs text-admin-muted">Not Generated</span>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
