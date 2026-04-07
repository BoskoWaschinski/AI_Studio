import React, { useState } from 'react';
import { ChevronDown, FileText, LayoutDashboard, SquareTerminal, Wrench, ExternalLink, Images, X } from 'lucide-react';

interface SidebarProps {
  generatedImages: string[];
}

export default function Sidebar({ generatedImages }: SidebarProps) {
  const [libraryOpen, setLibraryOpen] = useState(false);

  return (
    <div className="w-[260px] flex-shrink-0 bg-[#1e1f20] border-r border-[#333537] flex flex-col h-full relative">
      <div className="p-4 flex items-center gap-2 text-xl font-medium cursor-pointer hover:bg-[#282a2c] rounded-lg mx-2 mt-2 transition-colors">
        <span className="text-white font-semibold">Google</span>
        <span className="text-gray-300">AI Studio</span>
        <ChevronDown className="w-4 h-4 ml-auto text-gray-400" />
      </div>

      <div className="flex flex-col gap-1 px-3 mt-4">
        <NavItem icon={<SquareTerminal className="w-5 h-5" />} label="Playground" active hasSubmenu />
        <NavItem icon={<Wrench className="w-5 h-5" />} label="Build" hasSubmenu />
        <NavItem icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" hasSubmenu />
        <NavItem icon={<FileText className="w-5 h-5" />} label="Documentation" external />
      </div>

      <div className="mt-auto px-3 pb-4">
        <button
          onClick={() => setLibraryOpen(v => !v)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-full cursor-pointer transition-colors ${libraryOpen ? 'bg-[#333537] text-white' : 'text-gray-400 hover:bg-[#282a2c] hover:text-gray-200'}`}
        >
          <Images className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">Library</span>
          {generatedImages.length > 0 && (
            <span className="ml-auto text-xs bg-[#444648] text-gray-300 rounded-full px-2 py-0.5">
              {generatedImages.length}
            </span>
          )}
        </button>
      </div>

      {/* Library panel — slides up above the button */}
      {libraryOpen && (
        <div className="absolute bottom-[72px] left-0 w-full bg-[#1e1f20] border-t border-[#333537] flex flex-col max-h-[60vh]">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#333537]">
            <span className="text-sm font-medium text-gray-300">Library</span>
            <button onClick={() => setLibraryOpen(false)} className="text-gray-500 hover:text-gray-200 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-y-auto p-3">
            {generatedImages.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-6">Noch keine Bilder generiert</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {generatedImages.map((src, i) => {
                  const match = src.match(/^data:([^;]+);base64,(.+)$/);
                  return (
                    <div
                      key={i}
                      draggable
                      onDragStart={(e) => {
                        if (match) {
                          e.dataTransfer.setData('application/x-reference-image', JSON.stringify({ mimeType: match[1], data: match[2] }));
                        }
                      }}
                      className="aspect-square rounded-md overflow-hidden border border-[#333537] cursor-grab active:cursor-grabbing hover:border-[#8ab4f8] transition-colors"
                      title={`Bild ${i + 1} — in Prompt-Feld ziehen`}
                    >
                      <img src={src} alt={`Generated ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, active, hasSubmenu, external }: { icon: React.ReactNode, label: string, active?: boolean, hasSubmenu?: boolean, external?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-full cursor-pointer transition-colors ${active ? 'bg-[#333537] text-white' : 'text-gray-400 hover:bg-[#282a2c] hover:text-gray-200'}`}>
      {icon}
      <span className="text-sm font-medium">{label}</span>
      {hasSubmenu && <ChevronDown className="w-4 h-4 ml-auto opacity-50" />}
      {external && <ExternalLink className="w-4 h-4 ml-auto opacity-50" />}
    </div>
  );
}
