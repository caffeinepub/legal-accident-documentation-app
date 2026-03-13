import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SignatureCanvasProps {
  onSave: (dataUrl: string | null) => void;
  width?: number;
  height?: number;
}

export default function SignatureCanvas({
  onSave,
  height = 150,
}: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size based on container width
    const rect = canvas.parentElement?.getBoundingClientRect();
    canvas.width = rect ? rect.width : 400;
    canvas.height = height;

    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    drawPlaceholder(ctx, canvas.width, canvas.height);
  }, [height]);

  function drawPlaceholder(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
  ) {
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.fillStyle = "#f8f7f4";
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    // Draw baseline
    ctx.save();
    ctx.strokeStyle = "#d4c9b8";
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(20, h * 0.72);
    ctx.lineTo(w - 20, h * 0.72);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Placeholder text
    ctx.save();
    ctx.fillStyle = "#a89f8e";
    ctx.font = "italic 14px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Sign here", w / 2, h / 2);
    ctx.restore();
  }

  function getPos(
    canvas: HTMLCanvasElement,
    e: { clientX: number; clientY: number },
  ) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function startDraw(x: number, y: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!hasDrawn) {
      // Clear placeholder on first draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.fillStyle = "#f8f7f4";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Draw baseline
      ctx.save();
      ctx.strokeStyle = "#d4c9b8";
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(20, canvas.height * 0.72);
      ctx.lineTo(canvas.width - 20, canvas.height * 0.72);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      setHasDrawn(true);
    }

    isDrawing.current = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function continueDraw(x: number, y: number) {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function endDraw() {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSave(canvas.toDataURL("image/png"));
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pos = getPos(canvas, e.nativeEvent);
    startDraw(pos.x, pos.y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pos = getPos(canvas, e.nativeEvent);
    continueDraw(pos.x, pos.y);
  };

  const handleMouseUp = () => endDraw();
  const handleMouseLeave = () => endDraw();

  // Touch events
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const touch = e.touches[0];
    const pos = getPos(canvas, touch);
    startDraw(pos.x, pos.y);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const touch = e.touches[0];
    const pos = getPos(canvas, touch);
    continueDraw(pos.x, pos.y);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    endDraw();
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setHasDrawn(false);
    drawPlaceholder(ctx, canvas.width, canvas.height);
    onSave(null);
  };

  return (
    <div className="space-y-2">
      <div
        className="relative rounded-lg border border-amber-200 overflow-hidden"
        style={{ height }}
        data-ocid="witness.canvas_target"
      >
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            touchAction: "none",
            cursor: "crosshair",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>
      {hasDrawn && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={handleClear}
          data-ocid="witness.delete_button"
        >
          <Eraser className="h-3.5 w-3.5" />
          Clear Signature
        </Button>
      )}
    </div>
  );
}
