import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ImageOff, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PhotoMetadata } from '../backend';
import { ExternalBlob } from '../backend';

interface PhotoGalleryProps {
  photos: PhotoMetadata[];
  imageData?: Uint8Array[];
}

export default function PhotoGallery({ photos, imageData }: PhotoGalleryProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // Create blob URLs for all photos from imageData
  const photoUrls = useMemo(() => {
    if (!imageData || imageData.length === 0) return [];
    
    return imageData.map((data) => {
      // Convert to proper Uint8Array with ArrayBuffer
      const bytes = new Uint8Array(data);
      const blob = new Blob([bytes], { type: 'image/jpeg' });
      return URL.createObjectURL(blob);
    });
  }, [imageData]);

  if (!photos || photos.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <ImageOff className="h-12 w-12 mb-2" />
            <p className="text-sm">No photos uploaded</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handlePrevious = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  const selectedPhoto = selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null;
  const selectedPhotoUrl = selectedPhotoIndex !== null ? photoUrls[selectedPhotoIndex] : '';

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {photos.map((photo, index) => {
          const imageUrl = photoUrls[index];
          const uploadDate = new Date(Number(photo.uploadTimestamp));

          return (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-lg transition-shadow group overflow-hidden"
              onClick={() => setSelectedPhotoIndex(index)}
            >
              <CardContent className="p-0">
                <div className="aspect-square relative bg-muted">
                  {imageUrl ? (
                    <>
                      <img
                        src={imageUrl}
                        alt={photo.filename}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageOff className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="p-2 space-y-1">
                  <p className="text-xs font-medium truncate" title={photo.filename}>
                    {photo.filename}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {uploadDate.toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={selectedPhotoIndex !== null} onOpenChange={() => setSelectedPhotoIndex(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPhoto && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPhoto.filename}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative bg-muted rounded-lg overflow-hidden">
                  {selectedPhotoUrl ? (
                    <img
                      src={selectedPhotoUrl}
                      alt={selectedPhoto.filename}
                      className="w-full h-auto max-h-[60vh] object-contain"
                    />
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center">
                      <ImageOff className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={selectedPhotoIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {selectedPhotoIndex !== null ? selectedPhotoIndex + 1 : 0} of {photos.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    disabled={selectedPhotoIndex === photos.length - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{selectedPhoto.contentType}</Badge>
                    <span className="text-xs text-muted-foreground">
                      Uploaded: {new Date(Number(selectedPhoto.uploadTimestamp)).toLocaleString()}
                    </span>
                  </div>
                  {selectedPhoto.description && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-foreground">{selectedPhoto.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
