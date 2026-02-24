import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { ExternalBlob } from '../backend';

interface PhotoUploadProps {
  onPhotosChange: (photos: Array<{ blob: ExternalBlob; filename: string; contentType: string }>) => void;
  maxPhotos?: number;
}

export default function PhotoUpload({ onPhotosChange, maxPhotos = 10 }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<Array<{ blob: ExternalBlob; filename: string; contentType: string; preview: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: Array<{ blob: ExternalBlob; filename: string; contentType: string; preview: string }> = [];

    for (let i = 0; i < files.length && photos.length + newPhotos.length < maxPhotos; i++) {
      const file = files[i];
      
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        continue;
      }

      // Read file as bytes
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      // Create ExternalBlob
      const externalBlob = ExternalBlob.fromBytes(bytes);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);

      newPhotos.push({
        blob: externalBlob,
        filename: file.name,
        contentType: file.type,
        preview: previewUrl,
      });
    }

    const updatedPhotos = [...photos, ...newPhotos];
    setPhotos(updatedPhotos);
    onPhotosChange(updatedPhotos.map(p => ({ blob: p.blob, filename: p.filename, contentType: p.contentType })));

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (index: number) => {
    // Revoke preview URL to free memory
    URL.revokeObjectURL(photos[index].preview);
    
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
    onPhotosChange(updatedPhotos.map(p => ({ blob: p.blob, filename: p.filename, contentType: p.contentType })));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Accident Scene Photos</Label>
        <span className="text-xs text-muted-foreground">
          {photos.length} / {maxPhotos} photos
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <Card key={index} className="relative group overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-square relative">
                <img
                  src={photo.preview}
                  alt={photo.filename}
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemovePhoto(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-2 bg-muted/50">
                <p className="text-xs truncate" title={photo.filename}>
                  {photo.filename}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        {photos.length < maxPhotos && (
          <Card
            className="border-dashed cursor-pointer hover:border-primary hover:bg-accent/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <CardContent className="p-0">
              <div className="aspect-square flex flex-col items-center justify-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-xs text-muted-foreground text-center px-2">
                  Add Photo
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      <p className="text-xs text-muted-foreground flex items-center gap-1">
        <ImageIcon className="h-3 w-3" />
        Accepted formats: JPG, PNG, WebP. AI will analyze photos for damage, road conditions, and vehicle positions.
      </p>
    </div>
  );
}
