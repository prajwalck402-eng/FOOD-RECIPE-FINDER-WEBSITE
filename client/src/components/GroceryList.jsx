import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Printer, 
  Copy, 
  Check, 
  Sparkles,
  ShoppingBag,
  Carrot,
  Egg,
  Package,
  Fish,
  Flame
} from 'lucide-react';
import { culinaryAudio } from '../utils/audio';
import { t } from '../utils/i18n';

const CATEGORIES = [
  { id: 'Produce', label: 'Produce & Fresh Herbs', icon: Carrot, color: 'text-sage-700 bg-sage-50 border-sage-200' },
  { id: 'Dairy & Eggs', label: 'Dairy & Eggs', icon: Egg, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { id: 'Pantry & Grains', label: 'Pantry & Grains', icon: Package, color: 'text-warmgray-700 bg-cream-100 border-cream-300' },
  { id: 'Meat & Seafood', label: 'Meat & Seafood', icon: Fish, color: 'text-terracotta-700 bg-terracotta-50 border-terracotta-200' },
  { id: 'Spices & Oils', label: 'Spices, Seasonings & Oils', icon: Flame, color: 'text-amber-800 bg-amber-50/80 border-amber-300' },
  { id: 'Other', label: 'General & Others', icon: ShoppingBag, color: 'text-warmgray-600 bg-cream-50 border-cream-200' },
];

export default function GroceryList({
  groceryItems = [],
  onToggleItem,
  onAddItem,
  onDeleteItem,
  onClearCompleted,
  currentLanguage = 'en',
}) {
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Produce');
  const [copied, setCopied] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    culinaryAudio.playTick();
    onAddItem({
      name: newItemName.trim(),
      amount: newItemAmount.trim(),
      category: newItemCategory,
    });
    setNewItemName('');
    setNewItemAmount('');
  };

  const handleCopyList = () => {
    culinaryAudio.playTick();
    const text = groceryItems
      .map(i => `${i.isCompleted ? '✓' : '□'} ${i.amount ? i.amount + ' ' : ''}${i.name} [${i.category}]`)
      .join('\n');
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    culinaryAudio.playTick();
    window.print();
  };

  const completedCount = groceryItems.filter(i => i.isCompleted).length;
  const totalCount = groceryItems.length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold shadow-xs">
            <ShoppingCart className="w-3.5 h-3.5 text-amber-700" />
            <span>{t('groceryTitle', currentLanguage)}</span>
          </div>
          <h2 className="font-serif font-bold text-3xl text-warmgray-900">
            {t('navGroceries', currentLanguage)}
          </h2>
          <p className="text-xs sm:text-sm text-warmgray-600 font-medium">
            {completedCount} of {totalCount} items gathered • {t('grocerySubtitle', currentLanguage)}
          </p>
        </div>

        {/* Global Grocery Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleCopyList}
            disabled={totalCount === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-cream-300 hover:border-terracotta-300 text-warmgray-700 hover:text-terracotta-700 text-xs font-bold shadow-xs transition-all btn-push disabled:opacity-50"
          >
            {copied ? <Check className="w-4 h-4 text-sage-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy List'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            disabled={totalCount === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-cream-300 hover:border-terracotta-300 text-warmgray-700 hover:text-terracotta-700 text-xs font-bold shadow-xs transition-all btn-push disabled:opacity-50"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>

          {completedCount > 0 && (
            <button
              type="button"
              onClick={() => {
                culinaryAudio.playTick();
                onClearCompleted();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold shadow-xs transition-all btn-push"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t('groceryClearCompleted', currentLanguage)} ({completedCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Add New Grocery Item Form */}
      <form
        onSubmit={handleAdd}
        className="glass-panel p-4 sm:p-5 rounded-2xl border border-cream-300 shadow-warm-sm grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
      >
        <div className="sm:col-span-5">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Add item (e.g. San Marzano Tomatoes, Basil, Saffron)..."
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-cream-300 text-xs sm:text-sm font-medium text-warmgray-900 placeholder:text-warmgray-400 focus:outline-none focus:border-terracotta-500 shadow-inner"
          />
        </div>

        <div className="sm:col-span-3">
          <input
            type="text"
            value={newItemAmount}
            onChange={(e) => setNewItemAmount(e.target.value)}
            placeholder="Qty (e.g. 500g, 2 bunches)"
            className="w-full px-3 py-2.5 rounded-xl bg-white border border-cream-300 text-xs sm:text-sm font-medium text-warmgray-900 placeholder:text-warmgray-400 focus:outline-none focus:border-terracotta-500 shadow-inner"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-white border border-cream-300 text-xs sm:text-sm font-semibold text-warmgray-900 focus:outline-none focus:border-terracotta-500 shadow-xs"
          >
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
          </select>
        </div>

        <div className="sm:col-span-1">
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm shadow-warm-sm flex items-center justify-center transition-all btn-push"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Categorized Grocery Aisle Sections */}
      {totalCount === 0 ? (
        /* Empty State */
        <div className="glass-panel p-12 rounded-3xl border border-cream-300 text-center space-y-4 shadow-warm-sm">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-xl text-warmgray-900">
              Your Grocery List is Clean & Empty
            </h3>
            <p className="text-xs sm:text-sm text-warmgray-500 max-w-sm mx-auto">
              Add ingredients manually above or click "Add to Groceries" on any recipe page to auto-populate your shopping basket.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORIES.map((cat) => {
            const categoryItems = groceryItems.filter(i => (i.category || 'Produce') === cat.id);
            if (categoryItems.length === 0) return null;

            const Icon = cat.icon;

            return (
              <div
                key={cat.id}
                className="bg-white rounded-3xl border border-cream-200 shadow-warm-sm p-5 space-y-3"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between pb-2 border-b border-cream-100">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-xl border ${cat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="font-serif font-bold text-sm text-warmgray-900">
                      {cat.label}
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-cream-100 text-warmgray-600">
                    {categoryItems.length}
                  </span>
                </div>

                {/* Items in this category */}
                <div className="space-y-2">
                  {categoryItems.map((item) => (
                    <div
                      key={item._id}
                      className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                        item.isCompleted
                          ? 'bg-cream-100/50 border-cream-200 text-warmgray-400'
                          : 'bg-cream-50/70 hover:bg-white border-cream-200/90 text-warmgray-800 shadow-xs'
                      }`}
                    >
                      <div
                        onClick={() => {
                          culinaryAudio.playTick();
                          onToggleItem(item._id);
                        }}
                        className="flex items-center gap-3 cursor-pointer select-none flex-1 pr-2"
                      >
                        <button
                          type="button"
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                            item.isCompleted
                              ? 'bg-terracotta-600 border-terracotta-600 text-white'
                              : 'border-warmgray-300 bg-white'
                          }`}
                        >
                          {item.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        <div className="space-y-0.5">
                          <span className={`text-xs font-bold block ${item.isCompleted ? 'line-through' : ''}`}>
                            {item.name}
                          </span>
                          {item.recipeSource && (
                            <span className="text-[10px] text-warmgray-400 font-medium block">
                              For: {item.recipeSource}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.amount && (
                          <span className="text-[11px] font-extrabold text-terracotta-700 bg-terracotta-50 px-2 py-0.5 rounded-md border border-terracotta-100">
                            {item.amount}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            culinaryAudio.playTick();
                            onDeleteItem(item._id);
                          }}
                          className="p-1.5 rounded-lg text-warmgray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
