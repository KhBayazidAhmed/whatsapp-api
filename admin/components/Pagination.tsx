import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const previousPageDisabled = currentPage === 1;
  const nextPageDisabled = currentPage === totalPages;

  return (
    <div className="flex items-center justify-center space-x-2 my-4">
      {previousPageDisabled ? (
        <Button variant="outline" size="sm" disabled>
          <span className="flex items-center space-x-1">
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </span>
        </Button>
      ) : (
        <Link href={`/?page=${currentPage - 1}`} passHref>
          <Button asChild variant="outline" size="sm">
            <span className="flex items-center space-x-1">
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </span>
          </Button>
        </Link>
      )}
      <span className="text-sm font-medium">
        Page {currentPage} of {totalPages}
      </span>
      {nextPageDisabled ? (
        <Button variant="outline" size="sm" disabled>
          <span className="flex items-center space-x-1">
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </span>
        </Button>
      ) : (
        <Link href={`/?page=${currentPage + 1}`} passHref>
          <Button asChild variant="outline" size="sm">
            <span className="flex items-center space-x-1">
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </span>
          </Button>
        </Link>
      )}
    </div>
  );
}
