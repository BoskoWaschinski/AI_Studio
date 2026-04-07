import React, { useState, useRef } from 'react';
import { Wand2, Settings2, Mic, Plus, Play, X } from 'lucide-react';
import { generateImage } from '../services/gemini';

const MAX_IMAGES = 10;

type RefImage = { data: string; mimeType: string };

interface MainContentProps {
  prompt: string;
  setPrompt: (val: string) => void;
  generatedImage: string | null;
  setGeneratedImage: (val: string | null) => void;
  onImageGenerated: (imgData: string) => void;
  isGenerating: boolean;
  setIsGenerating: (val: boolean) => void;
  aspectRatio: string;
  resolution: string;
  temperature: number;
  thinkingLevel: string;
  useGoogleSearch: boolean;
  setUseGoogleSearch: (val: boolean) => void;
  useImageSearch: boolean;
  referenceImages: RefImage[];
  setReferenceImages: (val: RefImage[]) => void;
  customApiKey: string;
}

export default function MainContent({
  prompt, setPrompt,
  generatedImage, setGeneratedImage, onImageGenerated,
  isGenerating, setIsGenerating,
  aspectRatio, resolution,
  useGoogleSearch, setUseGoogleSearch,
  useImageSearch,
  referenceImages, setReferenceImages,
  customApiKey
}: MainContentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const addImages = (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    const slots = MAX_IMAGES - referenceImages.length;
    if (slots <= 0) return;
    const toAdd = fileArray.slice(0, slots);
    const newImages: RefImage[] = [];
    let loaded = 0;
    toAdd.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newImages.push({ data: (e.target?.result as string).split(',')[1], mimeType: file.type });
        loaded++;
        if (loaded === toAdd.length) {
          setReferenceImages([...referenceImages, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const inlineData = e.dataTransfer.getData('application/x-reference-image');
    if (inlineData) {
      try {
        const img = JSON.parse(inlineData) as RefImage;
        if (referenceImages.length < MAX_IMAGES) {
          setReferenceImages([...referenceImages, img]);
        }
      } catch {}
      return;
    }
    addImages(e.dataTransfer.files);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addImages(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setReferenceImages(referenceImages.filter((_, i) => i !== index));
  };

  const handleRun = async () => {
    if (!prompt.trim() && referenceImages.length === 0) return;
    setIsGenerating(true);
    try {
      const imgData = await generateImage(
        prompt, aspectRatio, resolution,
        useGoogleSearch, useImageSearch,
        referenceImages, customApiKey
      );
      if (imgData) {
        onImageGenerated(imgData);
        const match = imgData.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          setReferenceImages([{ mimeType: match[1], data: match[2] }]);
        }
      }
    } catch (error) {
      alert("Failed to generate image. Check console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      handleRun();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full relative">
      {/* Top Bar */}
      <div className="h-14 border-b border-[#333537] flex items-center px-4" />

      {/* Main Area */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-8 min-h-0">
        {isGenerating ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#8ab4f8] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400">Generating image...</p>
          </div>
        ) : generatedImage ? (
          <div className="relative max-w-full max-h-full flex items-center justify-center">
            <img
              src={generatedImage}
              alt="Generated"
              draggable
              onDragStart={(e) => {
                const match = generatedImage.match(/^data:([^;]+);base64,(.+)$/);
                if (match) {
                  e.dataTransfer.setData('application/x-reference-image', JSON.stringify({ mimeType: match[1], data: match[2] }));
                }
              }}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl cursor-grab active:cursor-grabbing"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => { setGeneratedImage(null); setReferenceImages([]); }}
              className="absolute top-2 right-2 bg-black/60 hover:bg-black/90 rounded-full p-1.5 transition-colors"
              title="Bild löschen und neu starten"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-medium text-white mb-2">Link a paid API key to access Nano Banana 2</h1>
            <p className="text-gray-400">Enter your API key in the right sidebar, or use the default environment key.</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 w-full max-w-4xl mx-auto flex-shrink-0">
        <div
          className={`bg-[#1e1f20] border rounded-2xl p-3 flex flex-col gap-3 shadow-lg transition-colors ${isDragging ? 'border-[#8ab4f8]' : 'border-[#333537]'}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          {referenceImages.length > 0 && (
            <div className="flex items-center gap-2 px-2 flex-wrap">
              {referenceImages.map((img, i) => (
                <div key={i} className="relative w-16 h-16 rounded-md overflow-hidden border border-[#333537] flex-shrink-0">
                  <img src={`data:${img.mimeType};base64,${img.data}`} alt={`Reference ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-0.5 right-0.5 bg-black/50 rounded-full p-0.5 hover:bg-black/80 transition-colors"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              {referenceImages.length < MAX_IMAGES && (
                <span className="text-xs text-gray-500 ml-1">{referenceImages.length}/{MAX_IMAGES}</span>
              )}
            </div>
          )}

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Start typing a prompt, use option + enter to append"
            className="w-full bg-transparent text-white placeholder-gray-500 resize-none outline-none px-2 min-h-[40px] max-h-[200px]"
            rows={1}
          />

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-[#333537] rounded-full text-gray-400 transition-colors">
                <Wand2 className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#333537] rounded-lg text-gray-300 text-sm transition-colors border border-[#333537]">
                <Settings2 className="w-4 h-4" />
                Tools
              </button>
              {useGoogleSearch && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#333537] rounded-lg text-gray-200 text-sm border border-[#444648]">
                  <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-[#131314] font-bold text-[10px]">G</span>
                  Grounding with Google Search
                  <button onClick={() => setUseGoogleSearch(false)} className="ml-1 hover:text-white text-gray-400">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-[#333537] rounded-full text-gray-400 transition-colors">
                <Mic className="w-4 h-4" />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                multiple
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={referenceImages.length >= MAX_IMAGES}
                className="p-2 hover:bg-[#333537] rounded-full text-gray-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title={referenceImages.length >= MAX_IMAGES ? 'Maximum 10 Bilder erreicht' : 'Bild hinzufügen'}
              >
                <Plus className="w-4 h-4" />
              </button>

              <button
                onClick={handleRun}
                disabled={isGenerating || (!prompt.trim() && referenceImages.length === 0)}
                className="flex items-center gap-2 px-4 py-1.5 bg-[#333537] hover:bg-[#444648] disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-white text-sm transition-colors ml-2"
              >
                Run
                <Play className="w-3 h-3 fill-current" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
