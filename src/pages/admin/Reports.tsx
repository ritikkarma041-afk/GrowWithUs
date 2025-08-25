import React from 'react';
import { Download, BarChart2, Users, IndianRupee } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import ReactECharts from 'echarts-for-react';

const AdminReports: React.FC = () => {
  const revenueOption = {
    title: { text: 'Monthly Revenue', textStyle: { fontSize: 16, fontWeight: 'bold' } },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
    yAxis: { type: 'value', axisLabel: { formatter: '₹{value}K' } },
    series: [{ data: [1200, 2000, 1500, 800, 700, 1100], type: 'bar', itemStyle: { color: '#059669' } }],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }
  };

  const userActivityOption = {
    title: { text: 'User Signups vs. Active Users', textStyle: { fontSize: 16, fontWeight: 'bold' } },
    tooltip: { trigger: 'axis' },
    legend: { data: ['Signups', 'Active Users'], bottom: 0 },
    xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
    yAxis: { type: 'value' },
    series: [
      { name: 'Signups', type: 'line', data: [80, 95, 110, 130, 155, 170], smooth: true, itemStyle: { color: '#0891b2' } },
      { name: 'Active Users', type: 'line', data: [60, 75, 80, 90, 110, 125], smooth: true, itemStyle: { color: '#0e7490' } }
    ],
    grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true }
  };

  const reports = [
    { title: 'Q1 2025 Financial Summary', icon: IndianRupee, date: 'April 5, 2025' },
    { title: 'March 2025 User Activity Report', icon: Users, date: 'April 2, 2025' },
    { title: '2024 Annual Investment Performance', icon: BarChart2, date: 'January 15, 2025' },
    { title: 'Q4 2024 Compliance Report', icon: IndianRupee, date: 'January 10, 2025' },
  ];

  return (
    <div>
      <PageHeader title="Reports & Analytics" subtitle="Generate and view detailed reports on platform activity." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-4 sm:p-6">
          <ReactECharts option={revenueOption} style={{ height: '300px' }} notMerge={true} lazyUpdate={true} />
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-4 sm:p-6">
          <ReactECharts option={userActivityOption} style={{ height: '300px' }} notMerge={true} lazyUpdate={true} />
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Generated Reports</h3>
        <div className="space-y-4">
          {reports.map((report, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-white/50 hover:bg-emerald-50/50 transition-colors border border-gray-200 gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg flex-shrink-0">
                  <report.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{report.title}</p>
                  <p className="text-sm text-gray-500">Generated on {report.date}</p>
                </div>
              </div>
              <button className="px-4 py-2 border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors flex items-center space-x-2 w-full sm:w-auto justify-center">
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
