import React, { useState, useMemo } from 'react';
import { PlusCircle, Search, Edit2, Trash2, Save, XCircle, ChevronsRightLeft, Filter, AlertTriangle } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { faker } from '@faker-js/faker';
import Modal from '../../components/Modal';

interface InvestmentRecord {
  id: string; timeOpen: string; typeSegment: 'stock equity' | 'Crypto Currency' | 'Metal MCX'; tradeId: string; script: string; tradeOpenType: 'Buy' | 'Sell'; qty: number; usdRate: number; inrConvertRate: number; purchaseRate: number; purchaseValue: number; leverage: number; investedValue: number; tradeCloseType: 'Buy' | 'Sell' | null; sellRate: number | null; soldQty: number | null; soldValue: number | null; remainingQty: number; grossPnL: number; brokerage: number; remainProfit: number; incomeTax: number; profitAfterTax: number; dividend: number; growthAmountAfterTaxAndDividend: number; growthRatio: number; closeTime: string | null;
}

const generateMockData = (): InvestmentRecord[] => Array.from({ length: 30 }, () => {
  const qty = faker.number.int({ min: 10, max: 500 });
  const purchaseRate = faker.number.float({ min: 100, max: 5000, fractionDigits: 2 });
  const purchaseValue = qty * purchaseRate;
  const shouldClose = faker.datatype.boolean();
  const sellRate = shouldClose ? purchaseRate + faker.number.float({ min: -500, max: 1000, fractionDigits: 2 }) : null;
  const soldQty = shouldClose ? faker.number.int({ min: 0, max: qty }) : null;
  const soldValue = soldQty && sellRate ? soldQty * sellRate : null;
  const grossPnL = soldValue ? (sellRate! - purchaseRate) * soldQty! : 0;
  const brokerage = purchaseValue * 0.001 + (soldValue || 0) * 0.001;
  const remainProfit = grossPnL - brokerage;
  const incomeTax = remainProfit > 0 ? remainProfit * 0.15 : 0;
  const profitAfterTax = remainProfit - incomeTax;
  const dividend = faker.number.float({ min: 0, max: 50, fractionDigits: 2 }) * qty;
  const growthAmount = profitAfterTax + dividend;
  return { id: faker.string.uuid(), timeOpen: faker.date.recent({ days: 90 }).toISOString(), typeSegment: faker.helpers.arrayElement(['stock equity', 'Crypto Currency', 'Metal MCX']), tradeId: faker.string.alphanumeric(8).toUpperCase(), script: faker.company.name(), tradeOpenType: 'Buy', qty, usdRate: 1, inrConvertRate: 1, purchaseRate, purchaseValue, leverage: 1, investedValue: purchaseValue, tradeCloseType: soldQty ? 'Sell' : null, sellRate, soldQty, soldValue, remainingQty: qty - (soldQty || 0), grossPnL, brokerage, remainProfit, incomeTax, profitAfterTax, dividend, growthAmountAfterTaxAndDividend: growthAmount, growthRatio: purchaseValue > 0 ? (growthAmount / purchaseValue) * 100 : 0, closeTime: soldQty ? faker.date.recent({ days: 10 }).toISOString() : null, };
});

const columns: { key: keyof InvestmentRecord; header: string }[] = [ { key: 'timeOpen', header: 'Time Open' }, { key: 'typeSegment', header: 'Type/Segment' }, { key: 'script', header: 'Script' }, { key: 'tradeOpenType', header: 'Trade Type' }, { key: 'qty', header: 'Qty' }, { key: 'purchaseRate', header: 'Purchase Rate' }, { key: 'purchaseValue', header: 'Purchase Value' }, { key: 'sellRate', header: 'Sell Rate' }, { key: 'soldQty', header: 'Sold Qty' }, { key: 'soldValue', header: 'Sold Value' }, { key: 'remainingQty', header: 'Remaining Qty' }, { key: 'grossPnL', header: 'Gross P/L' }, { key: 'brokerage', header: 'Brokerage' }, { key: 'remainProfit', header: 'Net Profit' }, { key: 'incomeTax', header: 'Income Tax' }, { key: 'profitAfterTax', header: 'Profit After Tax' }, { key: 'dividend', header: 'Dividend' }, { key: 'growthAmountAfterTaxAndDividend', header: 'Total Growth' }, { key: 'growthRatio', header: 'Growth %' }, { key: 'closeTime', header: 'Close Time' }, { key: 'tradeId', header: 'Trade ID' }, ];

const AdminInvestments: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [investments, setInvestments] = useState<InvestmentRecord[]>(generateMockData());
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<Partial<InvestmentRecord>>({});
  const [newStock, setNewStock] = useState({ script: '', qty: 10, purchaseRate: 100 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSegment, setFilterSegment] = useState<'All' | InvestmentRecord['typeSegment']>('All');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredInvestments = useMemo(() => {
    return investments
      .filter(inv => inv.script.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(inv => filterSegment === 'All' || inv.typeSegment === filterSegment);
  }, [investments, searchTerm, filterSegment]);

  const handleEdit = (record: InvestmentRecord) => { setEditingRowId(record.id); setEditedData(record); };
  const handleCancel = () => { setEditingRowId(null); setEditedData({}); };
  const handleSave = (id: string) => { setInvestments(investments.map(inv => (inv.id === id ? { ...inv, ...editedData } : inv))); handleCancel(); };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { const { name, value, type } = e.target; setEditedData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value })); };
  const handleAddStock = (e: React.FormEvent) => { e.preventDefault(); const newRecord: InvestmentRecord = { id: faker.string.uuid(), timeOpen: new Date().toISOString(), typeSegment: 'stock equity', tradeId: faker.string.alphanumeric(8).toUpperCase(), script: newStock.script, tradeOpenType: 'Buy', qty: Number(newStock.qty), usdRate: 1, inrConvertRate: 1, purchaseRate: Number(newStock.purchaseRate), purchaseValue: newStock.qty * newStock.purchaseRate, leverage: 1, investedValue: newStock.qty * newStock.purchaseRate, tradeCloseType: null, sellRate: null, soldQty: null, soldValue: null, remainingQty: Number(newStock.qty), grossPnL: 0, brokerage: 0, remainProfit: 0, incomeTax: 0, profitAfterTax: 0, dividend: 0, growthAmountAfterTaxAndDividend: 0, growthRatio: 0, closeTime: null, }; setInvestments([newRecord, ...investments]); setNewStock({ script: '', qty: 10, purchaseRate: 100 }); setIsModalOpen(false); };
  
  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setInvestments(investments.filter(inv => inv.id !== deletingId));
    }
    setIsDeleteModalOpen(false);
    setDeletingId(null);
  };

  const renderCell = (value: any, name: keyof InvestmentRecord) => { if (value === null || value === undefined) { return <span className="text-gray-400">-</span>; } if (typeof value === 'number' && !['qty', 'leverage', 'soldQty', 'remainingQty'].includes(name) && !name.toLowerCase().includes('ratio')) { const isProfit = name.toLowerCase().includes('pnl') || name.toLowerCase().includes('profit') || name.toLowerCase().includes('growth'); const color = value >= 0 ? 'text-emerald-600' : 'text-red-600'; const prefix = value >= 0 && isProfit ? '+' : ''; const displayValue = `₹${prefix}${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; return <span className={isProfit ? color : ''}>{displayValue}</span>; } if (name.toLowerCase().includes('ratio')) { const isProfit = value >= 0; const color = isProfit ? 'text-emerald-600' : 'text-red-600'; const prefix = isProfit ? '+' : ''; return <span className={color}>{`${prefix}${value.toFixed(2)}%`}</span>; } if (typeof value === 'string' && (name.toLowerCase().includes('time') || name.toLowerCase().includes('date'))) { return new Date(value).toLocaleDateString(); } return value; };

  return (
    <div>
      <PageHeader title="Investment Management" subtitle="Monitor and manage all available stocks and assets." />
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-4 sm:p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search by script name..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="relative w-full sm:w-48">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select 
                value={filterSegment}
                onChange={(e) => setFilterSegment(e.target.value as 'All' | InvestmentRecord['typeSegment'])}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full appearance-none"
              >
                <option value="All">All Segments</option>
                <option value="stock equity">Stock Equity</option>
                <option value="Crypto Currency">Crypto Currency</option>
                <option value="Metal MCX">Metal MCX</option>
              </select>
            </div>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 flex items-center space-x-2"><PlusCircle className="w-4 h-4" /><span>Add Trade</span></button>
        </div>
        <div className="relative">
          <div className="overflow-x-auto border border-gray-200 rounded-lg custom-scrollbar">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-emerald-50/70"><tr className="divide-x divide-gray-200"><th className="sticky left-0 bg-emerald-50/70 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider z-10">Actions</th>{columns.map(col => (<th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{col.header}</th>))}</tr></thead>
              <tbody className="bg-white/50 divide-y divide-gray-200">
                {filteredInvestments.map((record) => { const isEditing = editingRowId === record.id; return (
                  <tr key={record.id} className="divide-x divide-gray-200 hover:bg-emerald-50/50 transition-colors">
                    <td className="sticky left-0 bg-white/50 hover:bg-emerald-50/50 px-4 py-2 whitespace-nowrap z-10">
                      <div className="flex items-center space-x-2">{isEditing ? (<><button onClick={() => handleSave(record.id)} className="text-emerald-600 hover:text-emerald-900 p-1 rounded"><Save className="w-4 h-4" /></button><button onClick={handleCancel} className="text-gray-600 hover:text-gray-900 p-1 rounded"><XCircle className="w-4 h-4" /></button></>) : (<><button onClick={() => handleEdit(record)} className="text-emerald-600 hover:text-emerald-900 p-1 rounded"><Edit2 className="w-4 h-4" /></button><button onClick={() => handleDeleteClick(record.id)} className="text-red-600 hover:text-red-900 p-1 rounded"><Trash2 className="w-4 h-4" /></button></>)}</div>
                    </td>
                    {columns.map(col => (<td key={col.key} className="px-4 py-2 whitespace-nowrap">{isEditing ? (<input type={typeof record[col.key] === 'number' ? 'number' : 'text'} name={col.key} value={editedData[col.key as keyof InvestmentRecord] as any ?? ''} onChange={handleInputChange} className="w-full bg-transparent border-b border-emerald-400 focus:outline-none p-1" />) : (renderCell(record[col.key], col.key))}</td>))}
                  </tr>);})}
              </tbody>
            </table>
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-20 bg-gradient-to-l from-white/80 to-transparent" />
        </div>
        <div className="flex justify-end items-center mt-2 text-xs text-gray-500"><ChevronsRightLeft className="w-4 h-4 mr-2" /><span>Scroll horizontally to see more</span></div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleAddStock} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Add New Trade Record</h2>
          <div><label htmlFor="stock-script" className="block text-sm font-medium text-gray-700 mb-2">Script/Company Name</label><input id="stock-script" type="text" value={newStock.script} onChange={(e) => setNewStock({ ...newStock, script: e.target.value })} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g., Reliance Industries" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label htmlFor="stock-qty" className="block text-sm font-medium text-gray-700 mb-2">Quantity</label><input id="stock-qty" type="number" value={newStock.qty} onChange={(e) => setNewStock({ ...newStock, qty: Number(e.target.value) })} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
            <div><label htmlFor="stock-rate" className="block text-sm font-medium text-gray-700 mb-2">Purchase Rate (INR)</label><input id="stock-rate" type="number" value={newStock.purchaseRate} onChange={(e) => setNewStock({ ...newStock, purchaseRate: Number(e.target.value) })} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
          </div>
          <p className="text-sm text-gray-500">Additional fields can be edited in the table after creation.</p>
          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">Add Trade Record</button>
        </form>
      </Modal>
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="text-center p-4">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800">Confirm Deletion</h3>
            <p className="text-gray-600 mt-2">
                Are you sure you want to permanently delete this investment record? This action cannot be undone.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
                <button 
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                    Cancel
                </button>
                <button 
                    onClick={confirmDelete}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                    Delete
                </button>
            </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminInvestments;
