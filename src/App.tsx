import React, { useState, useMemo } from 'react';
import { PDF_TOOLS } from './data/tools';
import { ToolDef, ToolCategory } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ToolGrid } from './components/ToolGrid';
import { ActiveToolWorkspace } from './components/ActiveToolWorkspace';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { BrandModal } from './components/BrandModal';

export default function App() {
  const [currentBrand, setCurrentBrand] = useState('DocuMorph');
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolDef | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');

  // Filter tools based on category and search query
  const filteredTools = useMemo(() => {
    return PDF_TOOLS.filter((tool) => {
      const matchCat =
        selectedCategory === 'all' || tool.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        tool.title.toLowerCase().includes(q) ||
        tool.shortDesc.toLowerCase().includes(q) ||
        tool.fullDesc.toLowerCase().includes(q) ||
        tool.id.toLowerCase().includes(q);

      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const scrollToSection = (id: string) => {
    if (activeTool) {
      setActiveTool(null);
    }
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleSelectToolById = (id: string) => {
    const found = PDF_TOOLS.find((t) => t.id === id);
    if (found) {
      setActiveTool(found);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectTool = (tool: ToolDef) => {
    setActiveTool(tool);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    setActiveTool(null);
  };

  return (
    <div className="min-h-screen bg-[#0c0f17] text-slate-100 flex flex-col font-sans selection:bg-rose-500/30 selection:text-rose-200">
      <Navbar
        currentBrand={currentBrand}
        onOpenBrandModal={() => setIsBrandModalOpen(true)}
        onScrollToTools={() => scrollToSection('tools-section')}
        onScrollToFeatures={() => scrollToSection('features-section')}
        onScrollToHowItWorks={() => scrollToSection('how-it-works-section')}
        onScrollToFaq={() => scrollToSection('faq-section')}
      />

      <main className="flex-1">
        {activeTool ? (
          <div className="pt-6 pb-20">
            <ActiveToolWorkspace
              tool={activeTool}
              onBack={handleBackToCatalog}
            />
          </div>
        ) : (
          <>
            <Hero
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onSelectPopularTool={handleSelectToolById}
            />

            <ToolGrid
              tools={filteredTools}
              onSelectTool={handleSelectTool}
              onResetFilter={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
            />

            <Features />
            <HowItWorks />
            <FAQ />
          </>
        )}
      </main>

      <Footer
        currentBrand={currentBrand}
        onOpenBrandModal={() => setIsBrandModalOpen(true)}
        onScrollToTools={() => scrollToSection('tools-section')}
        onSelectToolById={handleSelectToolById}
      />

      <BrandModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        currentBrand={currentBrand}
        onSelectBrand={(newName) => {
          setCurrentBrand(newName);
        }}
      />
    </div>
  );
}

