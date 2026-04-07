/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import MainContent from './components/MainContent';

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [resolution, setResolution] = useState('1K');
  const [temperature, setTemperature] = useState(1);
  const [thinkingLevel, setThinkingLevel] = useState('Minimal');
  const [useGoogleSearch, setUseGoogleSearch] = useState(false);
  const [useImageSearch, setUseImageSearch] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [referenceImages, setReferenceImages] = useState<{ data: string, mimeType: string }[]>([]);
  const [customApiKey, setCustomApiKey] = useState('');

  const handleImageGenerated = (imgData: string) => {
    setGeneratedImage(imgData);
    setGeneratedImages(prev => [...prev, imgData]);
  };

  return (
    <div className="flex h-screen w-full bg-[#131314] text-[#e3e3e3] font-sans overflow-hidden">
      <Sidebar generatedImages={generatedImages} />
      <MainContent
        prompt={prompt}
        setPrompt={setPrompt}
        generatedImage={generatedImage}
        setGeneratedImage={setGeneratedImage}
        onImageGenerated={handleImageGenerated}
        isGenerating={isGenerating}
        setIsGenerating={setIsGenerating}
        aspectRatio={aspectRatio}
        resolution={resolution}
        temperature={temperature}
        thinkingLevel={thinkingLevel}
        useGoogleSearch={useGoogleSearch}
        setUseGoogleSearch={setUseGoogleSearch}
        useImageSearch={useImageSearch}
        referenceImages={referenceImages}
        setReferenceImages={setReferenceImages}
        customApiKey={customApiKey}
      />
      <RightSidebar
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        resolution={resolution}
        setResolution={setResolution}
        temperature={temperature}
        setTemperature={setTemperature}
        thinkingLevel={thinkingLevel}
        setThinkingLevel={setThinkingLevel}
        useGoogleSearch={useGoogleSearch}
        setUseGoogleSearch={setUseGoogleSearch}
        useImageSearch={useImageSearch}
        setUseImageSearch={setUseImageSearch}
        customApiKey={customApiKey}
        setCustomApiKey={setCustomApiKey}
      />
    </div>
  );
}
