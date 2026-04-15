import { ImagePlus, Bold, Italic, Heading1, Heading2, List, Code } from 'lucide-react';
import Button from '../../components/Button';
import Textarea from '../../components/Textarea';

export default function CreatePost() {
  return (
    <div className="w-full max-w-4xl mx-auto pb-24">
      
      {/* Cover Image Upload Area */}
      <div className="w-full h-80 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mb-12 relative overflow-hidden group">
         <ImagePlus className="w-8 h-8 mb-3 text-gray-400 group-hover:scale-110 transition-transform" />
         <p className="text-sm font-medium text-gray-500">Add a cover image</p>
      </div>

      {/* Title & Metadata inputs (Mocked visually) */}
      <div className="mb-8">
        <input 
          type="text" 
          placeholder="Article Title" 
          className="w-full text-5xl font-bold bg-transparent border-none placeholder:text-gray-300 dark:placeholder:text-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-0 p-0 mb-4 tracking-tight"
        />
        <div className="flex gap-4 text-sm font-medium text-gray-400">
           <span>⏱ 4 min read</span>
           <span>🏷 Technology</span>
        </div>
      </div>

      {/* WYSIWYG Floating Toolbar */}
      <div className="sticky top-20 z-40 bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-2 flex items-center justify-between mb-8">
         <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-300"><Bold className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-300"><Italic className="w-4 h-4" /></button>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-2" />
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-300"><Heading1 className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-300"><Heading2 className="w-4 h-4" /></button>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-2" />
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-300"><List className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-300"><Code className="w-4 h-4" /></button>
         </div>

         <div className="flex gap-3">
            <Button variant="ghost" size="sm" className="rounded-full">Save Draft</Button>
            <Button size="sm" className="rounded-full px-6 shadow-md shadow-primary-500/20 text-xs">Publish</Button>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full">
         <Textarea 
            placeholder="Tell your story..." 
            className="w-full text-lg leading-relaxed bg-transparent border-none focus:ring-0 min-h-[400px] resize-none p-0 placeholder:text-gray-300 dark:placeholder:text-gray-700" 
         />
      </div>
      
    </div>
  );
}
