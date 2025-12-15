import React, { useState, useEffect } from 'react';
import { FuturePersona } from '../types';
import { generatePersonaImage } from '../services/geminiService';
import { Tag, Palette, Image as ImageIcon, Loader2, ArrowUpRight } from 'lucide-react';

interface PersonaCardProps {
  persona: FuturePersona;
  index: number;
}

export const PersonaCard: React.FC<PersonaCardProps> = ({ persona, index }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      setLoading(true);
      try {
        const url = await generatePersonaImage(persona);
        if (isMounted) setImageUrl(url);
      } catch (err) {
        console.error("Failed to load image", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchImage();
    return () => { isMounted = false; };
  }, [persona]);

  return (
    <div className="group h-full flex flex-col bg-mono-900 border border-mono-800 hover:border-white transition-colors duration-300 relative overflow-hidden">
      
      {/* Number Badge */}
      <div className="absolute top-0 left-0 p-4 z-10">
         <span className="font-mono text-4xl font-bold text-white/10 group-hover:text-white transition-colors duration-300">
             0{index + 1}
         </span>
      </div>

      {/* Image Area - Half height or so */}
      <div className="h-64 w-full bg-mono-800 relative overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-mono-500">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <span className="text-[10px] font-mono uppercase">Rendering</span>
          </div>
        ) : imageUrl ? (
          <>
            <img 
                src={imageUrl} 
                alt={persona.name} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-mono-900"></div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-mono-800">
             <ImageIcon className="w-12 h-12 text-mono-700" />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-1 border-t border-mono-800">
        
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-2xl font-bold text-white leading-none mb-1 group-hover:text-accent-red transition-colors">
                    {persona.name}
                </h3>
                <p className="text-xs font-mono text-mono-500 uppercase tracking-widest">
                    {persona.tagline}
                </p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-mono-600 group-hover:text-white transition-colors" />
        </div>

        <p className="text-sm text-mono-100 leading-relaxed mb-6 font-light line-clamp-3">
            {persona.description}
        </p>

        <div className="mt-auto space-y-4">
            {/* Key Items Tags - Requested Change */}
            <div>
                <div className="text-[10px] uppercase font-mono text-mono-500 mb-2">Key Items</div>
                <div className="flex flex-wrap gap-2">
                    {persona.keyItems.map((item, idx) => (
                        <span 
                            key={idx} 
                            className="inline-flex items-center px-3 py-1.5 rounded-md border border-white/20 bg-white/5 text-xs text-mono-100 font-mono hover:bg-white/10 hover:border-white/40 transition-all cursor-default"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            {/* Color Palette */}
            <div className="flex items-center gap-3 pt-4 border-t border-mono-800">
                 <div className="text-[10px] uppercase font-mono text-mono-500">Palette</div>
                 <div className="flex gap-2">
                    {persona.colorPalette.map((color, idx) => (
                        <div 
                            key={idx} 
                            className="w-6 h-6 rounded-full border border-white/10" 
                            style={{ backgroundColor: color }} 
                            title={color}
                        />
                    ))}
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};