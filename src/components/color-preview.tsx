'use client'

interface ColorPreviewProps {
  textColor: string
  backgroundColor: string
}

export function ColorPreview({ textColor, backgroundColor }: ColorPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="relative p-6 sm:p-8 border-2 border-border hover:border-primary/50 transition-colors" style={{ backgroundColor }}>
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/30 to-transparent" />
        <h3 className="text-lg font-semibold mb-4" style={{ color: textColor }}>
          Normal Text Example
        </h3>
        <p style={{ color: textColor }} className="text-base mb-3">
          This is normal text (18px) on your background color.
        </p>
        <p style={{ color: textColor }} className="text-sm">
          This is smaller text on your background color.
        </p>
      </div>
      <div className="relative p-6 sm:p-8 border-2 border-border hover:border-primary/50 transition-colors" style={{ backgroundColor }}>
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-chart-2/30 to-transparent" />
        <h3 className="text-lg font-semibold mb-4" style={{ color: textColor }}>
          Large Text Example
        </h3>
        <p style={{ color: textColor }} className="text-3xl font-semibold mb-3">
          Large Text (48px)
        </p>
        <p style={{ color: textColor }} className="text-2xl font-semibold">
          This is large bold text on your background color.
        </p>
      </div>
      <div className="relative p-6 sm:p-8 border-2 border-border hover:border-primary/50 transition-colors" style={{ backgroundColor: textColor }}>
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-chart-3/30 to-transparent" />
        <h3 className="text-lg font-semibold mb-4" style={{ color: backgroundColor }}>
          Inverted Colors
        </h3>
        <p style={{ color: backgroundColor }} className="text-base mb-3">
          This is sample text on your text color (inverted).
        </p>
        <p style={{ color: backgroundColor }} className="text-sm">
          This is smaller text on your text color (inverted).
        </p>
      </div>
    </div>
  )
}