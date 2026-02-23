import { useParams } from '@tanstack/react-router';
import ReportDetail from '../components/ReportDetail';

export default function ReportDetailPage() {
  const { reportId } = useParams({ from: '/reports/$reportId' });
  
  return (
    <div className="max-w-5xl mx-auto">
      <ReportDetail reportId={BigInt(reportId)} />
    </div>
  );
}
