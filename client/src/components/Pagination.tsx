import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import Button from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex justify-center items-center gap-1">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 p-0 rounded-lg"
      >
        <span className="sr-only">Previous</span>
        <ChevronLeft className="h-5 w-5" />
      </Button>

      {/* Basic representation (Simplifying logic to match design 1 2 3 ... 12) */}
      <Button 
        variant={currentPage === 1 ? 'primary' : 'ghost'} 
        size="sm" 
        onClick={() => onPageChange(1)}
        className="w-10 h-10 p-0 rounded-lg"
      >
        1
      </Button>

      {currentPage > 3 && (
         <div className="w-10 h-10 flex items-center justify-center text-gray-500">
           <MoreHorizontal className="h-5 w-5" />
         </div>
      )}

      {currentPage > 2 && currentPage < totalPages && (
         <Button 
           variant="primary" 
           size="sm" 
           className="w-10 h-10 p-0 rounded-lg"
         >
           {currentPage}
         </Button>
      )}

      {currentPage < totalPages - 2 && (
         <div className="w-10 h-10 flex items-center justify-center text-gray-500">
           <MoreHorizontal className="h-5 w-5" />
         </div>
      )}

      <Button 
        variant={currentPage === totalPages ? 'primary' : 'ghost'} 
        size="sm" 
        onClick={() => onPageChange(totalPages)}
        className="w-10 h-10 p-0 rounded-lg"
      >
        {totalPages}
      </Button>

      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 p-0 rounded-lg"
      >
        <span className="sr-only">Next</span>
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
