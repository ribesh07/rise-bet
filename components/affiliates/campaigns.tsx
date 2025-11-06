
'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, ArrowDown, X } from 'lucide-react';

// Simple Select Component
const Select = ({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 rounded-lg bg-[#1e293b] text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

// Simple Input Component
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-lg border border-gray-600 bg-[#1e293b] px-3 py-2 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

interface Campaign {
  id: string;
  name: string;
  createdAt: string;
  hits: number;
  referredUsers: number;
  firstTimeDeposits: number;
  totalDeposits: number;
  commission: number;
}

// Table Component (Desktop)
const CampaignsTable: React.FC<{
  campaigns: Campaign[];
  onRowClick?: (c: Campaign) => void;
}> = ({ campaigns, onRowClick }) => {
  return (
    <div className="overflow-x-auto hidden md:block w-full mt-4 rounded-xl border border-gray-700">
      <table className="min-w-full text-gray-200 bg-[#1e293b] rounded-xl">
        <thead>
          <tr className="text-left border-b border-gray-700 bg-[#0f172a]">
            <th className="px-4 py-3">Campaign</th>
            <th className="px-4 py-3">Date Created</th>
            <th className="px-4 py-3">Hits</th>
            <th className="px-4 py-3">Referred Users</th>
            <th className="px-4 py-3">1st Time Deposits</th>
            <th className="px-4 py-3">Total Deposits</th>
            <th className="px-4 py-3">Commission</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr
              key={c.id}
              className="hover:bg-[#334155] cursor-pointer transition-colors border-b border-gray-700"
              onClick={() => onRowClick && onRowClick(c)}
            >
              <td className="px-4 py-3 font-medium">
                {c.name} ({c.id})
              </td>
              <td className="px-4 py-3">{c.createdAt}</td>
              <td className="px-4 py-3">{c.hits}</td>
              <td className="px-4 py-3">{c.referredUsers}</td>
              <td className="px-4 py-3">{c.firstTimeDeposits}</td>
              <td className="px-4 py-3">{c.totalDeposits}</td>
              <td className="px-4 py-3 text-green-400 font-semibold">
                ${c.commission.toFixed(2)} USD
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Mobile Card View
const CampaignsMobileList: React.FC<{
  campaigns: Campaign[];
  onRowClick?: (c: Campaign) => void;
}> = ({ campaigns, onRowClick }) => {
  return (
    <div className="space-y-3 md:hidden mt-4">
      {campaigns.map((c) => (
        <Card
          key={c.id}
          className="bg-[#1e293b] border border-gray-700 rounded-xl"
          onClick={() => onRowClick && onRowClick(c)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold text-white">
                {c.name} ({c.id})
              </p>
              <p className="text-sm text-gray-400">{c.createdAt}</p>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-300">
              <p>Hits: <span className="text-white">{c.hits}</span></p>
              <p>Referred: <span className="text-white">{c.referredUsers}</span></p>
              <p>FTD: <span className="text-white">{c.firstTimeDeposits}</span></p>
              <p>Total Dep: <span className="text-white">{c.totalDeposits}</span></p>
            </div>
            <p className="text-green-400 font-semibold mt-2 text-sm">
              Commission: ${c.commission.toFixed(2)} USD
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Modal Component (Stake-style)
const CreateCampaignModal: React.FC<{ onClose: () => void; onCreate: (name: string) => void }> = ({
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-[#1e293b] border border-gray-700 rounded-2xl w-[90%] max-w-md p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Create New Campaign</h3>
          <button onClick={onClose}>
            <X size={20} className="text-gray-400 hover:text-white" />
          </button>
        </div>
        <p className="text-gray-400 mb-4 text-sm">
          Enter a name for your new campaign to start tracking performance.
        </p>

        <Input
          placeholder="Enter campaign name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4"
        />

        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="bg-[#1e293b] hover:bg-[#334155] border border-gray-600"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (name.trim() !== '') {
                onCreate(name.trim());
                onClose();
              }
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};

const CampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 'yFnQzATc',
      name: 'shark491',
      createdAt: '10/5/2025',
      hits: 0,
      referredUsers: 0,
      firstTimeDeposits: 0,
      totalDeposits: 0,
      commission: 0,
    },
  ]);

  const [sort, setSort] = useState('newest');
  const [showModal, setShowModal] = useState(false);

  const handleCreateCampaign = (name: string) => {
    const newCampaign: Campaign = {
      id: Math.random().toString(36).substring(2, 8),
      name,
      createdAt: new Date().toLocaleDateString(),
      hits: 0,
      referredUsers: 0,
      firstTimeDeposits: 0,
      totalDeposits: 0,
      commission: 0,
    };
    setCampaigns([newCampaign, ...campaigns]);
  };

  const handleExport = () => {
    const data = JSON.stringify(campaigns, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campaigns.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 bg-[#1e293b] rounded-2xl p-6 space-y-6 shadow-lg shadow-black/40">
      <h2 className="text-2xl font-bold mb-2">Campaigns</h2>
      <p className="text-gray-400 mb-6 text-sm sm:text-base">
        See the performance of all your campaigns in one simple view below.
      </p>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Campaign Hits', value: 0 },
          { label: 'Referred Users', value: 0 },
          { label: 'First Time Deposits (FTD)', value: 0 },
          { label: 'Total Deposits', value: 0 },
          { label: 'Overall Commission', value: '$0.00 USD' },
        ].map((stat, index) => (
          <Card key={index} className="bg-[#1e293b] border border-gray-700">
            <CardContent className="text-center p-3 sm:p-4">
              <p className="text-gray-400 text-xs sm:text-sm">{stat.label}</p>
              <h3 className="text-base sm:text-xl font-semibold">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter size={18} />
          <Select
            value={sort}
            onChange={setSort}
            options={[
              { label: 'Date Created: New to Old', value: 'newest' },
              { label: 'Date Created: Old to New', value: 'oldest' },
            ]}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={handleExport}
            className="bg-[#1e293b] hover:bg-[#334155] w-full sm:w-auto"
          >
            <ArrowDown size={18} className="mr-2" /> Export
          </Button>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Campaigns Table (Desktop) + Cards (Mobile) */}
      <CampaignsTable campaigns={campaigns} onRowClick={(c) => console.log('Clicked:', c)} />
      <CampaignsMobileList campaigns={campaigns} onRowClick={(c) => console.log('Clicked:', c)} />

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <Button className="bg-[#1e293b] hover:bg-[#334155]">Previous</Button>
        <Button className="bg-[#1e293b] hover:bg-[#334155]">Next</Button>
      </div>

      {/* Modal */}
      {showModal && (
        <CreateCampaignModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateCampaign}
        />
      )}
    </div>
  );
};

export default CampaignsPage;
