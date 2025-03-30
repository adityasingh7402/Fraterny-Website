
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";

interface TopPageData {
  path: string;
  pageTitle: string;
  views: number;
  exitRate: number;
  avgTimeOnPage: number;
}

interface TopPagesTableProps {
  data: TopPageData[];
}

export function TopPagesTable({ data }: TopPagesTableProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="overflow-x-auto max-h-[200px] overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[100px]">Page</TableHead>
            <TableHead className="text-right">{isMobile ? "Views" : "Page Views"}</TableHead>
            <TableHead className="text-right">{isMobile ? "Time" : "Avg. Time"}</TableHead>
            {!isMobile && <TableHead className="text-right">Exit Rate</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((page, i) => (
            <TableRow key={i}>
              <TableCell 
                className="font-medium max-w-[100px] sm:max-w-[200px] truncate text-xs sm:text-sm" 
                title={page.pageTitle}
              >
                {isMobile 
                  ? page.path.replace(/^\//, '').substring(0, 15) + (page.path.length > 15 ? '...' : '') 
                  : page.path
                }
              </TableCell>
              <TableCell className="text-right text-xs sm:text-sm">{page.views}</TableCell>
              <TableCell className="text-right text-xs sm:text-sm">{`${page.avgTimeOnPage}s`}</TableCell>
              {!isMobile && (
                <TableCell className="text-right text-xs sm:text-sm">
                  <span className={page.exitRate > 70 ? 'text-rose-500' : 'text-slate-700'}>
                    {`${page.exitRate}%`}
                  </span>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
