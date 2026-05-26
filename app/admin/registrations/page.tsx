'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { SkeletonTable } from '../../../components/admin/SkeletonLoader';
import { Modal } from '../../../components/admin/Modal';
import { logAdminAction } from '../../../lib/audit';

// ============================================================================
// BESPOKE CUSTOM GEOMETRIC SVG ICONS (Gradient-free, Sharp, Heavy-mitre)
// ============================================================================

const CustomUsersIcon = ({ className = '', size = 20 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <rect x="3" y="14" width="7" height="7" />
    <circle cx="6.5" cy="7.5" r="3.5" />
    <rect x="14" y="14" width="7" height="7" />
    <circle cx="17.5" cy="7.5" r="3.5" />
  </svg>
);

const CustomDownloadIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const CustomEyeIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CustomSearchIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <circle cx="10" cy="10" r="6" />
    <line x1="14.5" y1="14.5" x2="21" y2="21" />
  </svg>
);

const CustomFilterIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

// ============================================================================
// REGISTRATIONS VIEW Component
// ============================================================================

export default function Registrations() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReg, setSelectedReg] = useState<any>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'entered' | 'pending' | 'declined'>('all');
  
  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('registeredAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 50;

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

  // 1. Apply search and dropdown filters
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const matchesSearch = 
        (reg.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (reg.rollNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (reg.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (reg.phone || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'entered' && reg.hasEntered) ||
        (statusFilter === 'pending' && !reg.hasEntered && reg.status !== 'declined') ||
        (statusFilter === 'declined' && reg.status === 'declined');

      return matchesSearch && matchesStatus;
    });
  }, [registrations, searchQuery, statusFilter]);

  // Reset pagination on search query or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // 2. Apply sorting
  const sortedRegistrations = useMemo(() => {
    const sorted = [...filteredRegistrations].sort((a, b) => {
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
  }, [filteredRegistrations, sortField, sortOrder]);

  // 3. Paginate
  const paginatedRegistrations = sortedRegistrations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(sortedRegistrations.length / itemsPerPage);

  // CSV export fully synced with Aman's columns
  const exportCSV = async () => {
    const headers = [
      'Registration Number', 
      'Student Name', 
      'Gender', 
      'Application Number', 
      'Phone Number', 
      'Parent Name', 
      'Parent Phone', 
      'Student Email', 
      'Parent Email', 
      'Pincode', 
      'Course', 
      'Payment  Ammount ', 
      'Recived  Ammount ', 
      'Date Of Payment ', 
      'UTR No.', 
      'Bank Reference No.', 
      'Settlement ID', 
      'Transaction ID'
    ];

    const rows = sortedRegistrations.map((r, index) => {
      const pin = r.pincode || (r.address ? (r.address.match(/\b\d{6}\b/)?.[0] || 'N/A') : 'N/A');
      const formattedDate = r.dateOfPayment || (r.registeredAt ? r.registeredAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }).replace(/ /g, '-') : 'N/A');
      const payAmount = r.paymentAmount ? `₹ ${r.paymentAmount}` : '₹ 2500';
      const recAmount = r.receivedAmount ? `₹ ${r.receivedAmount}` : '₹ 2500';

      return [
        `"${index + 1}"`,
        `"${r.name || ''}"`,
        `"${r.gender || 'N/A'}"`,
        `"${r.rollNumber || ''}"`,
        `"${r.phone || ''}"`,
        `"${r.parentName || r.fatherName || ''}"`,
        `"${r.parentPhone || r.fatherMobile || ''}"`,
        `"${r.email || ''}"`,
        `"${r.parentEmail || r.fatherEmail || 'N/A'}"`,
        `"${pin}"`,
        `"${r.course || 'N/A'}"`,
        `"${payAmount}"`,
        `"${recAmount}"`,
        `"${formattedDate}"`,
        `"${r.paymentId || 'N/A'}"`,
        `"${r.paymentId || 'N/A'}"`,
        `"${r.settlementId || 'N/A'}"`,
        `"${r.orderId || 'N/A'}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
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
    <div className="space-y-8 select-none">
      {/* Live Counter Card */}
      <div className="bg-admin-surface border-4 border-brand-ink p-8 rounded-md shadow-[6px_6px_0px_0px_#030404] flex flex-col items-center justify-center text-center">
        <h2 className="text-xs font-black text-admin-muted uppercase tracking-widest mb-1.5">Total Registrations</h2>
        <p className="font-adminHeading text-6xl font-black text-brand-ink">
          {loading ? '-' : registrations.length}
        </p>
        {filteredRegistrations.length !== registrations.length && (
          <p className="text-[10px] uppercase font-black tracking-wide text-brand-orange mt-2 bg-brand-orange/15 px-3 py-1 border-2 border-brand-ink rounded-md">
            Filtered matches: {filteredRegistrations.length}
          </p>
        )}
      </div>

      {/* Main Title & Action header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-adminHeading text-3xl font-black uppercase tracking-tight text-brand-ink">Registration Data</h1>
          <p className="text-admin-muted font-bold text-xs uppercase tracking-wider mt-1">Student induction portal listings</p>
        </div>
        <button 
          onClick={exportCSV}
          disabled={loading || registrations.length === 0}
          className="bg-brand-orange hover:bg-[#E68A00] text-brand-ink font-black py-3 px-6 border-2 border-brand-ink shadow-[4px_4px_0px_0px_#030404] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#030404] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-100 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-xs uppercase tracking-wider"
        >
          <CustomDownloadIcon size={16} /> Export CSV
        </button>
      </div>

      {/* Structured Filters Option Bar */}
      <div className="bg-white border-4 border-brand-ink p-6 rounded-md shadow-[4px_4px_0px_0px_#030404] flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex-1 relative">
          <CustomSearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-ink/40" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-cloud/40 border-2 border-brand-ink rounded-md py-3 pl-11 pr-4 text-sm text-brand-ink font-bold placeholder:text-brand-ink/40 shadow-inner focus:outline-none focus:border-brand-pink focus:bg-white transition-all uppercase tracking-wider"
            placeholder="Search Name, Registration Number, or Email..."
          />
        </div>
        
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="p-2.5 border-2 border-brand-ink bg-brand-cloud text-brand-ink rounded-md hidden xs:block">
            <CustomFilterIcon size={16} />
          </div>
          <select
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="w-full bg-white border-2 border-brand-ink rounded-md py-3 px-4 text-xs text-brand-ink font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#030404] focus:outline-none cursor-pointer hover:bg-brand-cloud transition-colors"
          >
            <option value="all">Filter: All Status</option>
            <option value="entered">Checked-In</option>
            <option value="pending">Pending Check-In</option>
            <option value="declined">Declined / Blocked</option>
          </select>
        </div>
      </div>

      {/* Main Table Segment */}
      {loading ? (
        <SkeletonTable rows={10} />
      ) : (
        <div className="bg-white border-4 border-brand-ink rounded-md shadow-[6px_6px_0px_0px_#030404] overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-brand-cloud border-b-2 border-brand-ink text-brand-ink text-[10px] font-black uppercase tracking-widest">
                  <th className="p-4 cursor-pointer hover:text-brand-pink select-none" onClick={() => handleSort('name')}>
                    Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-4 cursor-pointer hover:text-brand-pink select-none" onClick={() => handleSort('rollNumber')}>
                    Registration Number {sortField === 'rollNumber' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-4 cursor-pointer hover:text-brand-pink select-none" onClick={() => handleSort('email')}>
                    Contact Details {sortField === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-4 cursor-pointer hover:text-brand-pink select-none" onClick={() => handleSort('registeredAt')}>
                    Registration Time {sortField === 'registeredAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-4">Entry Status</th>
                  <th className="p-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-ink/10">
                {paginatedRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-brand-cloud/45 transition-colors text-xs font-bold text-brand-ink">
                    <td className="p-4 font-black">{reg.name}</td>
                    <td className="p-4 text-brand-ink/90">{reg.rollNumber}</td>
                    <td className="p-4 text-brand-ink/90">
                      <div className="font-semibold text-xs lowercase">{reg.email}</div>
                      <div className="text-[10px] text-admin-muted font-bold mt-0.5">{reg.phone}</div>
                    </td>
                    <td className="p-4 text-admin-muted">
                      {reg.registeredAt ? reg.registeredAt.toDate().toLocaleString() : ''}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 border-2 border-brand-ink rounded-md text-[9px] font-black uppercase tracking-wider ${
                        reg.hasEntered 
                          ? 'bg-green-100 text-green-700 border-green-700' 
                          : (reg.status === 'declined' ? 'bg-red-100 text-red-700 border-red-700' : 'bg-yellow-100 text-yellow-700 border-yellow-700')
                      }`}>
                        {reg.hasEntered ? 'Entered' : (reg.status === 'declined' ? 'Declined' : 'Pending')}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setSelectedReg(reg)} 
                        className="p-2 border-2 border-transparent hover:border-brand-ink hover:bg-brand-cloud text-brand-ink rounded-md transition-all cursor-pointer focus:outline-none"
                      >
                        <CustomEyeIcon size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedRegistrations.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-admin-muted font-black text-xs uppercase tracking-wider">
                      No matching registration logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t-2 border-brand-ink flex justify-between items-center bg-brand-cloud">
              <span className="text-xs font-black uppercase text-admin-muted">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button 
                  disabled={currentPage === 1} 
                  onClick={() => {
                    setCurrentPage(p => p - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 border-2 border-brand-ink rounded-md bg-white text-xs font-black uppercase text-brand-ink hover:bg-brand-cloud disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Prev
                </button>
                <button 
                  disabled={currentPage === totalPages} 
                  onClick={() => {
                    setCurrentPage(p => p + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 border-2 border-brand-ink rounded-md bg-white text-xs font-black uppercase text-brand-ink hover:bg-brand-cloud disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Custom Overhauled Modal Details */}
      <Modal isOpen={!!selectedReg} onClose={() => setSelectedReg(null)} title="Registration Details">
        {selectedReg && (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 text-brand-ink">
            <div className="grid grid-cols-2 gap-4 text-xs font-bold uppercase tracking-wide">
              {/* Student Details */}
              <div className="col-span-2 border-b-2 border-brand-ink pb-2">
                <p className="text-xs font-black text-brand-orange uppercase tracking-widest">Student Credentials</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] font-black text-admin-muted mb-1">Full Name</p>
                <p className="font-black text-sm text-brand-ink bg-brand-cloud/45 p-2.5 border-2 border-brand-ink rounded-md">{selectedReg.name}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] font-black text-admin-muted mb-1">Application Number</p>
                <p className="font-black text-sm text-brand-ink bg-brand-cloud/45 p-2.5 border-2 border-brand-ink rounded-md">{selectedReg.rollNumber}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] font-black text-admin-muted mb-1">Email Address</p>
                <p className="font-black text-xs text-brand-ink bg-brand-cloud/45 p-2.5 border-2 border-brand-ink rounded-md break-all lowercase">{selectedReg.email}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] font-black text-admin-muted mb-1">Phone Number</p>
                <p className="font-black text-sm text-brand-ink bg-brand-cloud/45 p-2.5 border-2 border-brand-ink rounded-md">{selectedReg.phone}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] font-black text-admin-muted mb-1">Gender</p>
                <p className="font-black text-sm text-brand-ink bg-brand-cloud/45 p-2.5 border-2 border-brand-ink rounded-md">{selectedReg.gender || 'N/A'}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] font-black text-admin-muted mb-1">Course</p>
                <p className="font-black text-sm text-brand-ink bg-brand-cloud/45 p-2.5 border-2 border-brand-ink rounded-md">{selectedReg.course || 'N/A'}</p>
              </div>
              
              {/* Parent Details */}
              <div className="col-span-2 border-t-2 border-brand-ink pt-4 mt-2">
                <p className="text-xs font-black text-brand-orange uppercase tracking-widest">Parent Details</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] font-black text-admin-muted mb-1">Parent Name</p>
                <p className="font-black text-brand-ink bg-brand-cloud/45 p-2.5 border-2 border-brand-ink rounded-md">{selectedReg.parentName || selectedReg.fatherName || 'N/A'}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] font-black text-admin-muted mb-1">Parent Phone</p>
                <p className="font-black text-brand-ink bg-brand-cloud/45 p-2.5 border-2 border-brand-ink rounded-md">{selectedReg.parentPhone || selectedReg.fatherMobile || 'N/A'}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] font-black text-admin-muted mb-1">Parent Email</p>
                <p className="font-black text-brand-ink bg-brand-cloud/45 p-2.5 border-2 border-brand-ink rounded-md lowercase break-all">{selectedReg.parentEmail || selectedReg.fatherEmail || 'N/A'}</p>
              </div>

              {/* Residential Details */}
              <div className="col-span-2 border-t-2 border-brand-ink pt-4 mt-2">
                <p className="text-xs font-black text-brand-orange uppercase tracking-widest">Residential Details</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] font-black text-admin-muted mb-1">Pincode</p>
                <p className="font-black text-brand-ink bg-brand-cloud/45 p-2.5 border-2 border-brand-ink rounded-md">{selectedReg.pincode || (selectedReg.address ? (selectedReg.address.match(/\b\d{6}\b/)?.[0] || 'N/A') : 'N/A')}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-black text-admin-muted mb-1">Address</p>
                <p className="font-black text-brand-ink bg-brand-cloud/45 p-3 border-2 border-brand-ink rounded-md whitespace-pre-wrap leading-relaxed">{selectedReg.address || 'N/A'}</p>
              </div>

              {/* Transaction & Payment Details */}
              <div className="col-span-2 border-t-2 border-brand-ink pt-4 mt-2">
                <p className="text-xs font-black text-brand-orange uppercase tracking-widest">Payment & Transaction Details</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] font-black text-admin-muted mb-1">Payment Amount</p>
                <p className="font-black text-brand-ink bg-brand-cloud/45 p-2.5 border-2 border-brand-ink rounded-md">
                  {selectedReg.paymentAmount ? `₹ ${selectedReg.paymentAmount}` : '₹ 2,500'}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] font-black text-admin-muted mb-1">Received Amount</p>
                <p className="font-black text-brand-ink bg-brand-cloud/45 p-2.5 border-2 border-brand-ink rounded-md">
                  {selectedReg.receivedAmount ? `₹ ${selectedReg.receivedAmount}` : '₹ 2,500'}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] font-black text-admin-muted mb-1">Date Of Payment</p>
                <p className="font-black text-brand-ink bg-brand-cloud/45 p-2.5 border-2 border-brand-ink rounded-md">
                  {selectedReg.dateOfPayment || (selectedReg.registeredAt ? selectedReg.registeredAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }).replace(/ /g, '-') : 'N/A')}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] font-black text-admin-muted mb-1">UTR No.</p>
                <p className="font-black text-xs text-brand-ink bg-brand-cloud/45 p-2.5 border-2 border-brand-ink rounded-md break-all">{selectedReg.paymentId || 'N/A'}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] font-black text-admin-muted mb-1">Bank Reference No.</p>
                <p className="font-black text-xs text-brand-ink bg-brand-cloud/45 p-2.5 border-2 border-brand-ink rounded-md break-all">{selectedReg.paymentId || 'N/A'}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] font-black text-admin-muted mb-1">Settlement ID</p>
                <p className="font-black text-xs text-brand-ink bg-brand-cloud/45 p-2.5 border-2 border-brand-ink rounded-md break-all">{selectedReg.settlementId || 'Pending'}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] font-black text-admin-muted mb-1">Transaction ID</p>
                <p className="font-black text-xs text-brand-ink bg-brand-cloud/45 p-2.5 border-2 border-brand-ink rounded-md break-all">{selectedReg.orderId || 'N/A'}</p>
              </div>

              {/* Security Credentials */}
              <div className="col-span-2 border-t-2 border-brand-ink pt-4 mt-2">
                <p className="text-xs font-black text-brand-orange uppercase tracking-widest">Security Credentials</p>
              </div>
              <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-brand-cloud/45 p-4 border-2 border-brand-ink rounded-md">
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-black text-admin-muted mb-1">Registration ID</p>
                    <p className="font-mono font-black text-[11px] text-brand-ink bg-white p-2.5 border-2 border-brand-ink rounded-md break-all select-all shadow-inner">
                      {selectedReg.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-admin-muted mb-1.5 uppercase tracking-wider font-adminBody">Entry Status</p>
                    <select
                      value={selectedReg.hasEntered ? 'approved' : (selectedReg.status === 'declined' ? 'declined' : 'not entered')}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        const regRef = doc(db, 'registrations', selectedReg.id);
                        
                        try {
                          if (newStatus === 'approved') {
                            await updateDoc(regRef, {
                              hasEntered: true,
                              status: 'approved',
                              enteredAt: serverTimestamp(),
                              enteredBy: 'ADMIN_MANUAL'
                            });
                            await logAdminAction('MANUAL_ENTRY_APPROVE', `registrations/${selectedReg.id}`, `Manually approved check-in for ${selectedReg.name}`);
                          } else if (newStatus === 'declined') {
                            await updateDoc(regRef, {
                              hasEntered: false,
                              status: 'declined',
                              enteredAt: null,
                              enteredBy: null
                            });
                            await logAdminAction('MANUAL_ENTRY_DECLINE', `registrations/${selectedReg.id}`, `Manually declined check-in for ${selectedReg.name}`);
                          } else {
                            await updateDoc(regRef, {
                              hasEntered: false,
                              status: 'not entered',
                              enteredAt: null,
                              enteredBy: null
                            });
                            await logAdminAction('MANUAL_ENTRY_RESET', `registrations/${selectedReg.id}`, `Manually reset check-in state to pending for ${selectedReg.name}`);
                          }
                          
                          setSelectedReg((prev: any) => ({
                            ...prev,
                            hasEntered: newStatus === 'approved',
                            status: newStatus
                          }));
                          
                          alert(`Successfully updated entry status to ${newStatus.toUpperCase()}`);
                        } catch (err: any) {
                          console.error("Failed to update status:", err);
                          alert("Failed to update status: " + err.message);
                        }
                      }}
                      className="bg-white text-brand-ink border-2 border-brand-ink font-adminHeading uppercase tracking-wider text-[10px] rounded-md py-1.5 px-3 shadow-[2px_2px_0px_0px_#030404] transition-all active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-[1px_1px_0px_0px_#030404] cursor-pointer outline-none focus:ring-2 focus:ring-brand-ink/20 font-black"
                    >
                      <option value="not entered">Not Entered (Pending)</option>
                      <option value="approved">Approved (Checked-In)</option>
                      <option value="declined">Declined (Blocked)</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <p className="text-[10px] font-black text-admin-muted mb-2 uppercase tracking-wider">Verification QR Code</p>
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${selectedReg.id}`} 
                    alt="Registration QR Code" 
                    className="w-32 h-32 bg-white border-2 border-brand-ink p-1 rounded-md shadow-[3px_3px_0px_0px_#030404]"
                  />
                </div>
              </div>
              
              {/* Receipt Download Action */}
              <div className="col-span-2 border-t-2 border-brand-ink pt-6 mt-2 flex justify-end">
                <a 
                  href={`/api/receipt?id=${selectedReg.id}`}
                  download
                  className="w-full sm:w-auto bg-brand-orange hover:bg-[#E68A00] text-brand-ink text-center font-black py-3 px-6 border-2 border-brand-ink shadow-[4px_4px_0px_0px_#030404] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#030404] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-100 flex items-center justify-center gap-2 cursor-pointer rounded-md text-xs uppercase tracking-wider"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download Receipt PDF
                </a>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
