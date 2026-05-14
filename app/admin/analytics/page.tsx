'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { SkeletonCard, SkeletonTable } from '../../../components/admin/SkeletonLoader';
import { MessageSquare, Star } from 'lucide-react';



export default function FeedbackAnalytics() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartsLoaded, setChartsLoaded] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  
  const chartRef = useRef<HTMLDivElement>(null);
  const googleChartInstance = useRef<any>(null);

  // Load Google Charts
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/charts/loader.js';
    script.onload = () => {
      if ((window as any).google) {
        (window as any).google.charts.load('current', { packages: ['corechart'] });
        (window as any).google.charts.setOnLoadCallback(() => {
          setChartsLoaded(true);
        });
      }
    };
    document.head.appendChild(script);
  }, []);

  // Fetch Data
  useEffect(() => {
    const unsubFeedbacks = onSnapshot(query(collection(db, 'feedback'), orderBy('submittedAt', 'desc')), (snap) => {
      setFeedbacks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    const unsubEvents = onSnapshot(query(collection(db, 'events')), (snap) => {
      setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubFeedbacks();
      unsubEvents();
    };
  }, []);

  const filteredFeedbacks = useMemo(() => {
    if (selectedEventId === 'all') return feedbacks;
    return feedbacks.filter(f => f.eventId === selectedEventId);
  }, [feedbacks, selectedEventId]);

  // Derived metrics
  const totalResponses = filteredFeedbacks.length;
  const avgRating = totalResponses ? (filteredFeedbacks.reduce((acc, f) => acc + (f.rating || 0), 0) / totalResponses).toFixed(1) : '0.0';

  // Draw chart
  useEffect(() => {
    if (chartsLoaded && chartRef.current && !loading) {
      const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      filteredFeedbacks.forEach(f => {
        if (f.rating >= 1 && f.rating <= 5) {
          counts[f.rating as keyof typeof counts]++;
        }
      });

      const data = new (window as any).google.visualization.DataTable();
      data.addColumn('string', 'Rating');
      data.addColumn('number', 'Responses');
      data.addRows([
        ['1 Star', counts[1]],
        ['2 Stars', counts[2]],
        ['3 Stars', counts[3]],
        ['4 Stars', counts[4]],
        ['5 Stars', counts[5]],
      ]);

      const options = {
        backgroundColor: 'transparent',
        colors: ['#f59e0b'],
        legend: { position: 'none' },
        hAxis: { textStyle: { color: '#f8fafc' }, gridlines: { color: 'transparent' } },
        vAxis: { textStyle: { color: '#f8fafc' }, gridlines: { color: '#334155' } },
        animation: { startup: true, duration: 500, easing: 'out' }
      };

      if (!googleChartInstance.current) {
        googleChartInstance.current = new (window as any).google.visualization.ColumnChart(chartRef.current);
      }
      googleChartInstance.current.draw(data, options);
    }
  }, [filteredFeedbacks, chartsLoaded, loading]);

  // Event comparison data
  const eventComparison = useMemo(() => {
    return events.map(evt => {
      const evFeedbacks = feedbacks.filter(f => f.eventId === evt.id);
      const total = evFeedbacks.length;
      const avg = total ? (evFeedbacks.reduce((a, c) => a + c.rating, 0) / total).toFixed(1) : '0.0';
      const fiveStars = total ? Math.round((evFeedbacks.filter(f => f.rating === 5).length / total) * 100) : 0;
      const oneStars = total ? Math.round((evFeedbacks.filter(f => f.rating === 1).length / total) * 100) : 0;
      return { ...evt, total, avg, fiveStars, oneStars };
    }).sort((a, b) => b.total - a.total);
  }, [events, feedbacks]);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-adminHeading text-3xl font-bold mb-2">Feedback Analytics</h1>
          <p className="text-admin-muted">Real-time attendee sentiment</p>
        </div>
        <select 
          value={selectedEventId} 
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="bg-admin-surface border border-admin-border text-admin-text rounded-lg py-2 px-4 focus:outline-none focus:border-admin-accent"
        >
          <option value="all">All Events</option>
          {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-admin-surface border border-admin-border p-6 rounded-xl">
          <h2 className="font-bold mb-4">Rating Distribution</h2>
          {loading || !chartsLoaded ? (
            <SkeletonCard />
          ) : (
            <div ref={chartRef} className="w-full h-64"></div>
          )}
          <div className="mt-4 pt-4 border-t border-admin-border flex justify-between items-center text-sm">
            <span className="font-medium text-admin-muted">Total Responses: <strong className="text-white">{totalResponses}</strong></span>
            <span className="font-medium text-admin-muted">Average Rating: <strong className="text-admin-accent">{avgRating} / 5</strong></span>
          </div>
        </div>

        <div className="bg-admin-surface border border-admin-border p-6 rounded-xl overflow-y-auto max-h-[380px]">
          <h2 className="font-bold mb-4 flex items-center gap-2"><MessageSquare size={18} className="text-admin-accent"/> Comments Feed</h2>
          {loading ? (
            <div className="space-y-4"><SkeletonCard /><SkeletonCard /></div>
          ) : (
            <div className="space-y-4">
              {filteredFeedbacks.filter(f => f.comment).map(f => (
                <div key={f.id} className="border-b border-admin-border last:border-0 pb-4 last:pb-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-admin-muted">
                      {events.find(e => e.id === f.eventId)?.title || 'Unknown Event'}
                    </span>
                    <span className="text-xs text-admin-muted">{f.submittedAt?.toDate().toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={12} className={i <= f.rating ? "text-admin-accent fill-admin-accent" : "text-admin-border"} />
                    ))}
                  </div>
                  <p className="text-sm">"{f.comment}"</p>
                </div>
              ))}
              {filteredFeedbacks.filter(f => f.comment).length === 0 && (
                <p className="text-sm text-admin-muted text-center py-8">No comments available.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-admin-surface border border-admin-border rounded-xl p-6">
        <h2 className="font-bold mb-4">Event Comparison</h2>
        {loading ? (
          <SkeletonTable rows={3} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-admin-border text-admin-muted text-sm tracking-wider">
                  <th className="pb-3 font-medium">Event Name</th>
                  <th className="pb-3 font-medium text-center">Total Responses</th>
                  <th className="pb-3 font-medium text-center">Average Rating</th>
                  <th className="pb-3 font-medium text-center">% 5-Star</th>
                  <th className="pb-3 font-medium text-center">% 1-Star</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {eventComparison.map(evt => (
                  <tr key={evt.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 font-medium">{evt.title}</td>
                    <td className="py-4 text-center">{evt.total}</td>
                    <td className="py-4 text-center font-bold text-admin-accent">{evt.avg}</td>
                    <td className="py-4 text-center text-green-500">{evt.fiveStars}%</td>
                    <td className="py-4 text-center text-red-500">{evt.oneStars}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
