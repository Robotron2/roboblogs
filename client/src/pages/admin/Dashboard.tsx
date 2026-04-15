import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/Card';
import Pagination from '../../components/Pagination';

export default function Dashboard() {
  return (
    <div className="w-full">
      <div className="mb-8 flex justify-between items-end">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Welcome back, Alex</h1>
           <p className="text-gray-500 dark:text-gray-400">Here's what's happening with RoboBlogs today.</p>
        </div>
        <Link to="/admin/posts/new" className="hidden sm:block">
           <button className="bg-primary-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
             Write an article
           </button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
           <CardContent>
             <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Views</p>
             <p className="text-3xl font-bold text-gray-900 dark:text-white">124.5K</p>
             <span className="text-xs font-semibold text-green-500 mt-2 block">+12% from last month</span>
           </CardContent>
        </Card>
        <Card>
           <CardContent>
             <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Published Articles</p>
             <p className="text-3xl font-bold text-gray-900 dark:text-white">42</p>
             <span className="text-xs font-semibold text-gray-400 mt-2 block">3 drafts pending</span>
           </CardContent>
        </Card>
        <Card>
           <CardContent>
             <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Subscribers</p>
             <p className="text-3xl font-bold text-gray-900 dark:text-white">8,204</p>
             <span className="text-xs font-semibold text-green-500 mt-2 block">+43 new this week</span>
           </CardContent>
        </Card>
      </div>

      {/* Library Listings (Mock) */}
      <div>
         <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Recent Articles</h2>
         
         <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
               <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-500 uppercase">
                  <tr>
                     <th className="px-6 py-4">Title</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4">Date</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {/* Mock Rows */}
                  {[1,2,3,4].map((i) => (
                    <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                       <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                         Article Title Placeholder {i}
                       </td>
                       <td className="px-6 py-4">
                         <span className="px-2 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 text-xs font-semibold rounded-full">
                            Published
                         </span>
                       </td>
                       <td className="px-6 py-4 text-gray-500">
                         Nov 24, 2024
                       </td>
                       <td className="px-6 py-4 text-right">
                         <button className="text-primary-600 hover:text-primary-700 font-medium">Edit</button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
      
      <Pagination currentPage={1} totalPages={4} onPageChange={() => {}} />

    </div>
  );
}
