import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, AlertCircle, CheckCircle, Loader2, ImageOff, Image as ImageIcon } from 'lucide-react';
import { useGetAllReports } from '../hooks/useQueries';
import { useMemo } from 'react';

export default function ReportList() {
  const navigate = useNavigate();
  const { data: reports, isLoading, error } = useGetAllReports();

  // Create thumbnail URLs from imageData
  const thumbnailUrls = useMemo(() => {
    if (!reports) return new Map<string, string>();
    
    const urlMap = new Map<string, string>();
    reports.forEach(([id, report]) => {
      if (report.imageData && report.imageData.length > 0) {
        // Convert to proper Uint8Array with ArrayBuffer
        const bytes = new Uint8Array(report.imageData[0]);
        const blob = new Blob([bytes], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        urlMap.set(id.toString(), url);
      }
    });
    
    return urlMap;
  }, [reports]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p>Failed to load reports. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Reports Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first accident report to get started
            </p>
            <Button onClick={() => navigate({ to: '/' })}>Create New Report</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort by timestamp descending (most recent first)
  const sortedReports = [...reports].sort((a, b) => {
    const timeA = Number(a[1].timestamp);
    const timeB = Number(b[1].timestamp);
    return timeB - timeA;
  });

  return (
    <div className="space-y-4">
      {sortedReports.map(([id, report]) => {
        const date = new Date(Number(report.timestamp));
        const speedMph = Number(report.vehicleSpeed) / 100;
        const hasPhotos = report.photos && report.photos.length > 0;
        const thumbnailUrl = thumbnailUrls.get(id.toString());

        return (
          <Card
            key={id.toString()}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate({ to: '/reports/$reportId', params: { reportId: id.toString() } })}
          >
            <CardContent className="pt-6">
              <div className="flex gap-4">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  {thumbnailUrl ? (
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={thumbnailUrl}
                        alt="Accident scene"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                      <ImageOff className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Report Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Report #{id.toString()}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {date.toLocaleDateString()} at {date.toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {report.isAtFault ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                          <AlertCircle className="h-3 w-3" />
                          At Fault
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[oklch(0.7_0.15_145)]/10 text-[oklch(0.7_0.15_145)] text-xs font-medium">
                          <CheckCircle className="h-3 w-3" />
                          No Fault
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Speed: </span>
                      <span
                        className={`font-semibold ${
                          speedMph > 70
                            ? 'text-destructive'
                            : speedMph > 30
                            ? 'text-[oklch(0.7_0.15_60)]'
                            : 'text-[oklch(0.7_0.15_145)]'
                        }`}
                      >
                        {speedMph.toFixed(1)} mph
                      </span>
                    </div>

                    {hasPhotos && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <ImageIcon className="h-4 w-4" />
                        <span>{report.photos.length} photo{report.photos.length !== 1 ? 's' : ''}</span>
                      </div>
                    )}

                    {report.roadCondition && (
                      <div className="text-muted-foreground truncate">
                        {report.roadCondition}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
