
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  return (
    <div className="overflow-x-auto max-h-[200px] overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Page</TableHead>
            <TableHead className="text-right">Views</TableHead>
            <TableHead className="text-right">Avg. Time</TableHead>
            <TableHead className="text-right">Exit Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((page, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium max-w-[200px] truncate" title={page.pageTitle}>
                {page.path}
              </TableCell>
              <TableCell className="text-right">{page.views}</TableCell>
              <TableCell className="text-right">{`${page.avgTimeOnPage}s`}</TableCell>
              <TableCell className="text-right">
                <span className={page.exitRate > 70 ? 'text-rose-500' : 'text-slate-700'}>
                  {`${page.exitRate}%`}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
