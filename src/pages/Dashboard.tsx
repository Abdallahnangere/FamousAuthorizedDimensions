import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { getEntries } from '@/lib/api';
import { Download, RefreshCw, Search, Users, Signal, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Entry {
  id: number;
  phone: string;
  network: string;
  submitted_at: string;
}

export default function Dashboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const data = await getEntries();
      setEntries(data);
    } catch (error) {
      toast.error('Failed to load entries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = entry.phone.includes(search) || entry.network.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || entry.network === filter;
    return matchesSearch && matchesFilter;
  });

  const totalEntries = entries.length;
  const topNetwork = entries.reduce((acc, curr) => {
    acc[curr.network] = (acc[curr.network] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topNetworkName = Object.keys(topNetwork).reduce((a, b) => topNetwork[a] > topNetwork[b] ? a : b, 'N/A');
  const topNetworkCount = topNetwork[topNetworkName] || 0;

  const latestEntry = entries.length > 0 ? new Date(entries[0].submitted_at) : null;

  const exportCSV = () => {
    const headers = ['ID,Phone,Network,Submitted At'];
    const rows = filteredEntries.map(e => `${e.id},${e.phone},${e.network},"${e.submitted_at}"`);
    const csvContent = headers.concat(rows).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `saukimart_giveaway_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#fdfaf4] p-8 font-sans text-[#1c1917]">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="font-serif text-3xl font-medium text-[#1c1917]">Submissions</h1>
            <p className="text-[#78716c]">Saukimart Ramadan Giveaway Dashboard</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchEntries} isLoading={isLoading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="primary" onClick={exportCSV} disabled={filteredEntries.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-[#C9A84C]/10 p-3 text-[#8B6914]">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#78716c]">Total Entries</p>
              <h3 className="text-2xl font-bold text-[#1c1917]">{totalEntries}</h3>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-green-50 p-3 text-green-600">
              <Signal className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#78716c]">Top Network</p>
              <h3 className="text-2xl font-bold text-[#1c1917]">
                {topNetworkName} <span className="text-sm font-normal text-[#78716c]">({topNetworkCount})</span>
              </h3>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-blue-50 p-3 text-blue-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#78716c]">Latest Entry</p>
              <h3 className="text-lg font-bold text-[#1c1917]">
                {latestEntry ? format(latestEntry, 'HH:mm, dd MMM') : 'No entries'}
              </h3>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a8a29e]" />
            <Input
              placeholder="Search phone or network..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 text-base"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['ALL', 'MTN', 'GLO', 'Airtel', '9mobile'].map((net) => (
              <button
                key={net}
                onClick={() => setFilter(net)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  filter === net
                    ? 'bg-[#1c1917] text-white'
                    : 'bg-white text-[#78716c] hover:bg-[#f5f5f4] border border-[#e5e7eb]'
                }`}
              >
                {net}
                {net !== 'ALL' && (
                  <span className="ml-2 rounded-full bg-white/20 px-1.5 py-0.5 text-xs">
                    {entries.filter((e) => e.network === net).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f9fafb] text-[#78716c]">
              <tr>
                <th className="px-6 py-4 font-medium">#</th>
                <th className="px-6 py-4 font-medium">Phone Number</th>
                <th className="px-6 py-4 font-medium">Network</th>
                <th className="px-6 py-4 font-medium">Submitted At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry, index) => (
                  <tr key={entry.id} className="hover:bg-[#fdfaf4] transition-colors">
                    <td className="px-6 py-4 text-[#78716c] font-mono">{filteredEntries.length - index}</td>
                    <td className="px-6 py-4 font-mono font-medium text-[#1c1917]">{entry.phone}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          entry.network === 'MTN'
                            ? 'bg-yellow-100 text-yellow-800'
                            : entry.network === 'GLO'
                            ? 'bg-green-100 text-green-800'
                            : entry.network === 'Airtel'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-teal-100 text-teal-800'
                        }`}
                      >
                        <span
                          className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                            entry.network === 'MTN'
                              ? 'bg-yellow-500'
                              : entry.network === 'GLO'
                              ? 'bg-green-500'
                              : entry.network === 'Airtel'
                              ? 'bg-red-500'
                              : 'bg-teal-500'
                          }`}
                        />
                        {entry.network}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#78716c]">
                      {format(new Date(entry.submitted_at), 'MMM dd, yyyy HH:mm')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#78716c]">
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircle className="mb-2 h-8 w-8 text-[#d6d3d1]" />
                      <p>No entries found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="text-center text-xs text-[#a8a29e]">
          Showing {filteredEntries.length} of {totalEntries} entries
        </div>
      </div>
    </div>
  );
}
