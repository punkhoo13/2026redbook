import React, { useState, useEffect } from 'react';
import { FuturePersona } from '../types';
import { generatePersonaImage } from '../services/geminiService';
import { Image as ImageIcon, Loader2, ArrowUpRight } from 'lucide-react';

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
      
      {/* Number Badge (Large background) */}
      <div className="absolute top-0 right-0 p-4 z-10 opacity-20 pointer-events-none">
         <span className="font-mono text-6xl font-bold text-white/10">
             0{index + 1}
         </span>
      </div>

      {/* Image Area */}
      <div className="h-64 w-full bg-mono-800 relative overflow-hidden border-b border-mono-800">
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
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-mono-900 via-transparent to-transparent"></div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-mono-800">
             <ImageIcon className="w-12 h-12 text-mono-700" />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-1">
        
        <div className="flex justify-between items-end mb-6 border-b border-mono-800 pb-4">
            <div>
                <p className="text-[10px] font-mono text-accent-red uppercase tracking-widest mb-1">
                    {persona.tagline}
                </p>
                <h3 className="text-3xl font-bold text-white leading-none">
                    {persona.name}
                </h3>
            </div>
            <ArrowUpRight className="w-6 h-6 text-mono-600 group-hover:text-white transition-colors" />
        </div>

        <p className="text-sm text-gray-400 leading-relaxed mb-8 font-mono line-clamp-3">
            {persona.description}
        </p>

        <div className="mt-auto">
            {/* Key Items - Grid Layout mimicking Hyper Science blocks */}
            <div className="mb-6">
                <div className="text-[10px] uppercase font-mono text-gray-600 mb-2">Inventory / Key Items</div>
                <div className="grid grid-cols-2 gap-2">
                    {persona.keyItems.slice(0, 4).map((item, idx) => (
                        <div 
                            key={idx} 
                            className="border border-mono-700 bg-mono-950 p-2 h-20 flex flex-col justify-between hover:border-white/50 transition-colors"
                        >
                            <span className="text-[10px] text-gray-600 font-mono">
                                {idx + 1}/
                            </span>
                            <span className="text-xs text-white font-mono font-bold leading-tight">
                                {item}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Color Palette */}
            <div className="flex items-center justify-between pt-2 border-t border-mono-800">
                 <div className="text-[10px] uppercase font-mono text-gray-600">Color Hex</div>
                 <div className="flex -space-x-2">
                    {persona.colorPalette.map((color, idx) => (
                        <div 
                            key={idx} 
                            className="w-8 h-8 rounded-full border-2 border-mono-900 z-10" 
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
