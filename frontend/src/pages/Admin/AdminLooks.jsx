import { useState, useEffect } from 'react';
import { Save, Loader2, ShoppingBag, RefreshCw, Grid3X3, AlertCircle, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { lookService, productService } from '../../services/apiService';

const AdminLooks = () => {
  const [looks, setLooks] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newLookTitle, setNewLookTitle] = useState('');
  const [newLookDescription, setNewLookDescription] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const [looksRes, productsRes] = await Promise.all([
        lookService.getLooksForAdmin(),
        productService.getAll(),
      ]);
      
      setLooks(looksRes.looks || []);
      setProducts(productsRes.products || []);
      
      const initialSelected = {};
      (looksRes.looks || []).forEach(look => {
        initialSelected[look._id] = look.products?.map(p => p._id) || [];
      });
      setSelectedProducts(initialSelected);
      
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setErrorMessage(err.message || 'Failed to fetch data');
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const initializeLooks = async () => {
    setInitializing(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const existingRes = await lookService.getLooksForAdmin();
      const existingLooks = existingRes.looks || [];
      
      const requiredLooks = [
        { title: "The Night Out", description: "Head to toe luxury for when the occasion demands it.", order: 0 },
        { title: "The Street Edit", description: "Casual luxury. Effortless from morning to night.", order: 1 }
      ];
      
      const missingLooks = requiredLooks.filter(
        required => !existingLooks.some(existing => existing.title === required.title)
      );
      
      if (missingLooks.length > 0) {
        for (const look of missingLooks) {
          await lookService.createLook(look);
        }
        setSuccessMessage(`Created ${missingLooks.length} look(s)`);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setSuccessMessage('Both looks already exist');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
      
      await fetchData();
    } catch (err) {
      console.error('Failed to initialize looks:', err);
      setErrorMessage(err.message || 'Failed to initialize looks');
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setInitializing(false);
    }
  };

  const createLook = async () => {
    if (!newLookTitle.trim() || !newLookDescription.trim()) {
      setErrorMessage('Please enter both title and description');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    
    try {
      await lookService.createLook({ 
        title: newLookTitle, 
        description: newLookDescription, 
        order: looks.length 
      });
      setSuccessMessage('Look created successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowCreateModal(false);
      setNewLookTitle('');
      setNewLookDescription('');
      await fetchData();
    } catch (err) {
      console.error('Failed to create look:', err);
      setErrorMessage(err.message || 'Failed to create look');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProductToggle = (lookId, productId) => {
    setSelectedProducts(prev => {
      const current = prev[lookId] || [];
      if (current.includes(productId)) {
        return { ...prev, [lookId]: current.filter(id => id !== productId) };
      } else {
        return { ...prev, [lookId]: [...current, productId] };
      }
    });
  };

  const handleSaveLook = async (lookId) => {
    const look = looks.find(l => l._id === lookId);
    const productIds = selectedProducts[lookId] || [];
    
    setSavingId(lookId);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await lookService.updateLook(lookId, {
        title: look.title,
        description: look.description,
        products: productIds,
        order: look.order,
      });
      setSuccessMessage(`${look.title} updated successfully`);
      setTimeout(() => setSuccessMessage(null), 3000);
      await fetchData();
    } catch (err) {
      console.error('Failed to update look:', err);
      setErrorMessage(err.message || 'Failed to update look');
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 size={40} className="animate-spin text-gold" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-black theme-text text-2xl">Manage Looks</h2>
            <p className="font-body theme-text-muted text-sm mt-1">
              Select which products appear in each "Complete the Look" section
            </p>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 border theme-border theme-text-muted font-mono text-[10px] tracking-[0.2em] uppercase hover:border-gold/40 hover:text-gold transition-colors rounded-lg"
          >
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>
        
        <div className="border theme-border rounded-lg p-12" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto theme-text-muted opacity-30 mb-4" />
            <h3 className="font-display font-bold theme-text text-xl mb-2">No Products Found</h3>
            <p className="font-body theme-text-muted mb-6">
              You need to add products before you can manage looks.
            </p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('adminTabChange', { detail: 'products' }))}
              className="px-6 py-3 bg-gold text-obsidian font-mono text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-yellow-400 transition-colors rounded-lg"
            >
              Go to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentLook = looks[activeLookIndex];

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-500 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}
      
      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
          {errorMessage}
        </div>
      )}
      
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display font-black theme-text text-2xl">Manage Looks</h2>
          <p className="font-body theme-text-muted text-sm mt-1">
            Select which products appear in each "Complete the Look" section
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-obsidian font-mono text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-yellow-400 transition-colors rounded-lg"
          >
            <Plus size={13} />
            Add Look
          </button>
          <button
            onClick={initializeLooks}
            disabled={initializing}
            className="flex items-center gap-2 px-4 py-2 border theme-border theme-text-muted font-mono text-[10px] tracking-[0.2em] uppercase hover:border-gold/40 hover:text-gold transition-colors rounded-lg disabled:opacity-50"
          >
            {initializing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
            Re-initialize
          </button>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 border theme-border theme-text-muted font-mono text-[10px] tracking-[0.2em] uppercase hover:border-gold/40 hover:text-gold transition-colors rounded-lg"
          >
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>
      </div>

      {looks.length === 0 && (
        <div className="border theme-border rounded-lg p-12" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="text-center">
            <Grid3X3 size={48} className="mx-auto theme-text-muted opacity-30 mb-4" />
            <h3 className="font-display font-bold theme-text text-xl mb-2">No Looks Found</h3>
            <p className="font-body theme-text-muted mb-6">
              Click "Add Look" to create your first look, or "Re-initialize" to create the default looks.
            </p>
          </div>
        </div>
      )}

      {looks.length > 0 && currentLook && (
        <>
          {/* Look Navigation Tabs */}
          <div className="flex items-center gap-2 border-b theme-border pb-2">
            {looks.map((look, index) => (
              <button
                key={look._id}
                onClick={() => setActiveLookIndex(index)}
                className={`px-4 py-2 font-mono text-[11px] tracking-[0.2em] uppercase transition-all rounded-lg ${
                  activeLookIndex === index
                    ? 'bg-gold text-obsidian'
                    : 'theme-text-muted hover:text-gold'
                }`}
              >
                {look.title}
              </button>
            ))}
          </div>

          {/* Current Look Editor */}
          <div className="border theme-border rounded-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
            <div className="px-6 py-4 border-b theme-border">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="font-display font-semibold theme-text text-lg">{currentLook.title}</h3>
                  <p className="font-body theme-text-muted text-sm">{currentLook.description}</p>
                </div>
                <button
                  onClick={() => handleSaveLook(currentLook._id)}
                  disabled={savingId === currentLook._id}
                  className="flex items-center gap-2 px-4 py-2 bg-gold text-obsidian font-mono text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50 rounded-lg"
                >
                  {savingId === currentLook._id ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Save size={13} />
                  )}
                  Save Changes
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((product) => {
                  const isSelected = selectedProducts[currentLook._id]?.includes(product._id);
                  return (
                    <div
                      key={product._id}
                      onClick={() => handleProductToggle(currentLook._id, product._id)}
                      className={`relative cursor-pointer rounded-lg border-2 transition-all overflow-hidden ${
                        isSelected
                          ? 'border-gold bg-gold/5'
                          : 'border-transparent hover:border-gold/30'
                      }`}
                    >
                      <div className="aspect-square overflow-hidden bg-obsidian/10">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/400x400?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="p-3">
                        <p className="font-mono text-[9px] tracking-[0.2em] text-gold/60 uppercase truncate">
                          {product.category}
                        </p>
                        <p className="font-display font-semibold theme-text text-sm truncate">
                          {product.name}
                        </p>
                        <p className="font-body text-gold text-sm font-semibold">
                          ₦{product.price.toLocaleString()}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-gold rounded-full flex items-center justify-center shadow-lg">
                          <ShoppingBag size={12} className="text-obsidian" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Create Look Modal - No alert/prompt */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-obsidian/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="w-full max-w-md border theme-border rounded-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b theme-border">
              <h3 className="font-display font-bold theme-text text-lg">Create New Look</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 flex items-center justify-center border theme-border theme-text-muted hover:border-gold/40 hover:text-gold transition-all rounded-lg"
              >
                <X size={14} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                  Look Title
                </label>
                <input
                  type="text"
                  value={newLookTitle}
                  onChange={(e) => setNewLookTitle(e.target.value)}
                  placeholder="e.g., The Night Out"
                  className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors rounded-lg"
                  style={{ backgroundColor: 'var(--input-bg)' }}
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newLookDescription}
                  onChange={(e) => setNewLookDescription(e.target.value)}
                  placeholder="Describe this look..."
                  className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors resize-none rounded-lg"
                  style={{ backgroundColor: 'var(--input-bg)' }}
                />
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 border theme-border theme-text-secondary font-mono text-[11px] tracking-[0.2em] uppercase hover:border-gold/30 transition-colors rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={createLook}
                className="flex-1 py-3 bg-gold text-obsidian font-mono text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-yellow-400 transition-colors rounded-lg"
              >
                Create Look
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLooks;