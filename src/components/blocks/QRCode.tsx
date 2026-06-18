import { QRCodeSVG } from 'qrcode.react'

export function QRCode({
  url,
  size = 132,
  label,
  className = '',
}: {
  url: string
  size?: number
  label?: string
  className?: string
}) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="rounded-2xl bg-white p-3 shadow-card">
        <QRCodeSVG
          value={url}
          size={size}
          level="M"
          bgColor="#ffffff"
          fgColor="#0a0e1a"
          marginSize={0}
        />
      </div>
      {label && <span className="text-xs font-medium text-muted">{label}</span>}
    </div>
  )
}
