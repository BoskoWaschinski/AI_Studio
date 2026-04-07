import { ChevronDown, Info } from 'lucide-react';

interface RightSidebarProps {
  aspectRatio: string;
  setAspectRatio: (val: string) => void;
  resolution: string;
  setResolution: (val: string) => void;
  temperature: number;
  setTemperature: (val: number) => void;
  thinkingLevel: string;
  setThinkingLevel: (val: string) => void;
  useGoogleSearch: boolean;
  setUseGoogleSearch: (val: boolean) => void;
  useImageSearch: boolean;
  setUseImageSearch: (val: boolean) => void;
  customApiKey: string;
  setCustomApiKey: (val: string) => void;
}

export default function RightSidebar({
  aspectRatio, setAspectRatio,
  resolution, setResolution,
  temperature, setTemperature,
  thinkingLevel, setThinkingLevel,
  useGoogleSearch, setUseGoogleSearch,
  useImageSearch, setUseImageSearch,
  customApiKey, setCustomApiKey
}: RightSidebarProps) {
  return (
    <div className="w-[320px] flex-shrink-0 bg-[#1e1f20] border-l border-[#333537] flex flex-col h-full overflow-y-auto">
      <div className="p-4 flex flex-col gap-4">
        
        {/* Model Info */}
        <div className="bg-[#282a2c] rounded-xl p-4">
          <h3 className="text-sm font-medium text-white mb-1">Nano Banana 2</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            gemini-3.1-flash-image-preview<br/>
            Pro-level visual intelligence with Flash-speed efficiency and reality-grounded generation capabilities.
          </p>
        </div>

        {/* API Key Info */}
        <div className="bg-[#282a2c] rounded-xl p-4">
          <h3 className="text-sm font-medium text-white mb-1">
            Custom API Key
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed mb-3">
            Enter your own Gemini API key to use your account's quota.
          </p>
          <input 
            type="password"
            value={customApiKey}
            onChange={(e) => setCustomApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full bg-[#131314] border border-[#333537] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8ab4f8] text-white"
          />
        </div>

      </div>

      <div className="px-4 py-2 flex flex-col gap-6 mt-4">
        
        {/* Temperature */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-300">Temperature</label>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="range" 
              min="0" max="2" step="0.1" 
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-[#333537] rounded-lg appearance-none cursor-pointer accent-[#8ab4f8]"
            />
            <div className="bg-[#131314] border border-[#333537] rounded px-2 py-1 text-xs w-10 text-center">
              {temperature}
            </div>
          </div>
        </div>

        {/* Aspect Ratio */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-300">Aspect ratio</label>
          <div className="relative">
            <select 
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full bg-[#131314] border border-[#333537] rounded-lg px-3 py-2.5 text-sm appearance-none focus:outline-none focus:border-[#8ab4f8] text-white"
            >
              <option value="1:1">1:1</option>
              <option value="3:4">3:4</option>
              <option value="4:3">4:3</option>
              <option value="9:16">9:16</option>
              <option value="16:9">16:9</option>
              <option value="1:4">1:4</option>
              <option value="1:8">1:8</option>
              <option value="4:1">4:1</option>
              <option value="8:1">8:1</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Resolution */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-300">Resolution</label>
          <div className="relative">
            <select 
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full bg-[#131314] border border-[#333537] rounded-lg px-3 py-2.5 text-sm appearance-none focus:outline-none focus:border-[#8ab4f8] text-white"
            >
              <option value="512px">512px</option>
              <option value="1K">1K</option>
              <option value="2K">2K</option>
              <option value="4K">4K</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Thinking Level */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-300">Thinking level</label>
          <div className="relative">
            <select 
              value={thinkingLevel}
              onChange={(e) => setThinkingLevel(e.target.value)}
              className="w-full bg-[#131314] border border-[#333537] rounded-lg px-3 py-2.5 text-sm appearance-none focus:outline-none focus:border-[#8ab4f8] text-white"
            >
              <option value="Minimal">Minimal</option>
              <option value="Low">Low</option>
              <option value="High">High</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Tools */}
        <div className="flex flex-col gap-3 border-t border-[#333537] pt-4">
          <div className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-gray-300">Tools</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col">
              <span className="text-sm text-white">Grounding with Google Search</span>
              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                Source: <span className="w-3 h-3 rounded-full bg-white flex items-center justify-center text-[#131314] font-bold text-[8px]">G</span> Google Search
              </span>
            </div>
            <Toggle checked={useGoogleSearch} onChange={setUseGoogleSearch} />
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-white">Image search</span>
            <Toggle checked={useImageSearch} onChange={setUseImageSearch} />
          </div>
        </div>

        {/* Advanced settings */}
        <div className="flex items-center justify-between cursor-pointer border-t border-[#333537] pt-4 pb-8">
          <span className="text-sm text-gray-300">Advanced settings</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>

      </div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean, onChange: (val: boolean) => void }) {
  return (
    <div 
      className={`w-9 h-5 rounded-full p-0.5 cursor-pointer transition-colors ${checked ? 'bg-[#8ab4f8]' : 'bg-[#5f6368]'}`}
      onClick={() => onChange(!checked)}
    >
      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </div>
  );
}
