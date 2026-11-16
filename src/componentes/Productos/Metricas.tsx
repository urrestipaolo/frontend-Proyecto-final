import React from 'react'

interface MetricaProps {
  title: string
  value: string | number
  icon: string
  bgColorClass: string
  iconColorClass: string
  footer: React.ReactNode
}

export const MetricaCard: React.FC<MetricaProps> = ({
  title,
  value,
  icon,
  bgColorClass,
  iconColorClass,
  footer,
}) => {
  return (
    <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-xs text-on-surface-variant">{title}</p>
          <h2 className="text-2xl text-on-surface mt-1 tabular-nums font-bold">{value}</h2>
        </div>
        <div className={`w-12 h-12 rounded-xl ${bgColorClass} flex items-center justify-center ${iconColorClass}`}>
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-xs">
        {footer}
      </div>
    </div>
  )
}