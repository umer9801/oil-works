'use client';
import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backLink?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, backLink = '/dashboard', actions }: PageHeaderProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-10 mb-6">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={backLink} className="group">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl hover:bg-white/30 transition-all">
                <img 
                  src="/logo.jpeg" 
                  alt="Logo" 
                  className="w-10 h-10 rounded-lg object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      parent.innerHTML = '<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>';
                    }
                  }}
                />
              </div>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {title}
              </h1>
              {subtitle && (
                <p className="text-blue-200 text-sm mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
