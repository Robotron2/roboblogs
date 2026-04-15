import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50 dark:bg-[#111111]">
      
      {/* Left Content Form Panel */}
      <div className="flex flex-col justify-between p-8 bg-white dark:bg-[#1A1A1A] rounded-r-3xl md:rounded-r-[40px] shadow-2xl relative z-10 my-4 md:my-0">
        <div className="hidden md:block" /> {/* Spacer */}
        
        <main className="w-full max-w-md mx-auto space-y-8">
          <Outlet />
        </main>

        <footer className="w-full flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-12 md:mt-0">
           <div>
            <p className="font-bold text-gray-900 dark:text-white mb-1">RoboBlogs</p>
            <p>&copy; {new Date().getFullYear()} RoboBlogs. All rights reserved.</p>
           </div>
           <div className="flex gap-4">
             <a href="#" className="hover:text-primary-600">Privacy Policy</a>
             <a href="#" className="hover:text-primary-600">Terms of Service</a>
             <a href="#" className="hover:text-primary-600">Contact</a>
           </div>
        </footer>
      </div>

      {/* Right Graphic Panel */}
      <div className="hidden md:flex relative items-center justify-center bg-[url('https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg')] bg-cover bg-center">
         <div className="absolute inset-0 bg-gray-900/60 dark:bg-gray-900/80" />
         <div className="relative z-10 p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">The pulse of innovation.</h2>
            <p className="text-lg text-gray-200 max-w-md mx-auto leading-relaxed">Join the world's most focused community tracking the evolution of AI and robotics.</p>
         </div>
      </div>

    </div>
  );
}
