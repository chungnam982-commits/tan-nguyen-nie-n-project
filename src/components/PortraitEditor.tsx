import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { Slider } from "@/components/ui/slider";
import { cropToDataUrl, type PixelArea } from "@/lib/crop-image";

type Props = {
  src: string;
  onCancel: () => void;
  onSave: (dataUrl: string) => Promise<void>;
};

export function PortraitEditor({ src, onCancel, onSave }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<PixelArea | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const onComplete = useCallback(
    async (_: unknown, px: PixelArea) => {
      setArea(px);
      setPreview(await cropToDataUrl(src, px, 300, 400));
    },
    [src],
  );

  async function save() {
    if (!area) return;
    setSaving(true);
    try {
      await onSave(await cropToDataUrl(src, area));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-6 grid gap-6 md:grid-cols-[1fr_180px]">
      <div>
        <div className="relative h-80 w-full border border-border bg-card">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={3 / 4}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onComplete}
          />
        </div>
        <div className="mt-4 flex items-center gap-4">
          <span className="label-mono">ZOOM</span>
          <Slider min={1} max={4} step={0.05} value={[zoom]} onValueChange={(v) => setZoom(v[0])} />
          <button
            onClick={() => {
              setCrop({ x: 0, y: 0 });
              setZoom(1);
            }}
            className="label-mono hairline shrink-0 px-3 py-2 hover:text-ice"
          >
            CĂN GIỮA
          </button>
        </div>
      </div>
      <div>
        <p className="label-mono">XEM TRƯỚC</p>
        <div className="corner-frame hairline mt-2 overflow-hidden">
          {preview ? (
            <img src={preview} alt="Xem trước" className="aspect-[3/4] w-full object-cover" />
          ) : (
            <div className="aspect-[3/4] w-full bg-card" />
          )}
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={save}
            disabled={saving || !area}
            className="label-mono hairline px-3 py-2 text-ice hover:text-foreground disabled:opacity-50"
          >
            {saving ? "ĐANG LƯU…" : "LƯU ẢNH"}
          </button>
          <button onClick={onCancel} className="label-mono hairline px-3 py-2 hover:text-ice">
            HỦY
          </button>
        </div>
      </div>
    </div>
  );
}
