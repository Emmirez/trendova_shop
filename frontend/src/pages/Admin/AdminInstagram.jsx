import { useState, useEffect } from 'react';
import { Save, Loader2, ShoppingBag, RefreshCw, Grid3X3, AlertCircle, Plus, X, Trash2, Edit2 } from 'lucide-react';
import { instagramService, productService } from '../../services/apiService';

const AdminInstagram = () => {
  const [feed, setFeed] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customCaption, setCustomCaption] = useState('');
  const [customLikes, setCustomLikes] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [feedRes, productsRes] = await Promise.all([
        instagramService.getFeedForAdmin(),
        productService.getAll(),
      ]);
      setFeed(feedRes.feed || []);
      setProducts(productsRes.products || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setErrorMessage(err.message || 'Failed to fetch data');
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddToFeed = async () => {
    if (!selectedProduct) {
      setErrorMessage('Please select a product');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    
    try {
      await instagramService.addToFeed({
        productId: selectedProduct._id,
        likes: customLikes || Math.floor(Math.random() * 5000 + 1000).toLocaleString() + '',
        caption: customCaption || selectedProduct.name,
      });
      setSuccessMessage('Added to Instagram feed');
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowAddModal(false);
      setSelectedProduct(null);
      setCustomCaption('');
      setCustomLikes('');
      await fetchData();
    } catch (err) {
      console.error('Failed to add to feed:', err);
      setErrorMessage(err.message || 'Failed to add to feed');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleUpdate = async (id, data) => {
    setSavingId(id);
    try {
      await instagramService.updateFeedItem(id, data);
      setSuccessMessage('Updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
      await fetchData();
    } catch (err) {
      console.error('Failed to update:', err);
      setErrorMessage(err.message || 'Failed to update');
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setSavingId(null);
      setEditingItem(null);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Remove this item from Instagram feed?')) return;
    
    try {
      await instagramService.removeFromFeed(id);
      setSuccessMessage('Removed from feed');
      setTimeout(() => setSuccessMessage(null), 3000);
      await fetchData();
    } catch (err) {
      console.error('Failed to remove:', err);
      setErrorMessage(err.message || 'Failed to remove');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 size={40} className="animate-spin text-gold" />
      </div>
    );
  }

  // Get products not already in feed
  const feedProductIds = feed.map(item => item.product?._id);
  const availableProducts = products.filter(p => !feedProductIds.includes(p._id));

  return (
    <div className="space-y-8">
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-500 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display font-black theme-text text-2xl">Manage Instagram Feed</h2>
          <p className="font-body theme-text-muted text-sm mt-1">
            Select products to feature on the Instagram feed section
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-obsidian font-mono text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-yellow-400 transition-colors rounded-lg"
        >
          <Plus size={13} />
          Add to Feed
        </button>
      </div>

      {feed.length === 0 && (
        <div className="border theme-border rounded-lg p-12" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="text-center">
            <Grid3X3 size={48} className="mx-auto theme-text-muted opacity-30 mb-4" />
            <h3 className="font-display font-bold theme-text text-xl mb-2">No Items in Feed</h3>
            <p className="font-body theme-text-muted mb-6">
              Click "Add to Feed" to start featuring products on your Instagram feed section.
            </p>
          </div>
        </div>
      )}

      {feed.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {feed.map((item) => (
            <div key={item._id} className="border theme-border rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg-card)' }}>
              <div className="aspect-square overflow-hidden">
                <img
                  src={item.product?.image}
                  alt={item.product?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 space-y-2">
                {editingItem === item._id ? (
                  <>
                    <input
                      type="text"
                      defaultValue={item.caption}
                      placeholder="Caption"
                      className="w-full text-xs border theme-border rounded px-2 py-1"
                      id={`caption-${item._id}`}
                    />
                    <input
                      type="text"
                      defaultValue={item.likes}
                      placeholder="Likes (e.g., 2.4k)"
                      className="w-full text-xs border theme-border rounded px-2 py-1"
                      id={`likes-${item._id}`}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const newCaption = document.getElementById(`caption-${item._id}`).value;
                          const newLikes = document.getElementById(`likes-${item._id}`).value;
                          handleUpdate(item._id, { caption: newCaption, likes: newLikes });
                        }}
                        disabled={savingId === item._id}
                        className="flex-1 py-1 bg-gold text-obsidian text-xs font-mono rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingItem(null)}
                        className="flex-1 py-1 border theme-border text-xs font-mono rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-body text-sm theme-text-secondary line-clamp-2">{item.caption}</p>
                    <p className="font-mono text-[10px] text-gold">♥ {item.likes}</p>
                    <p className="font-mono text-[9px] theme-text-muted">{item.product?.category}</p>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setEditingItem(item._id)}
                        className="flex-1 py-1 border theme-border text-xs font-mono rounded hover:border-gold/40 hover:text-gold transition-colors"
                      >
                        <Edit2 size={12} className="inline mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="flex-1 py-1 border border-red-500/30 text-red-400 text-xs font-mono rounded hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={12} className="inline mr-1" />
                        Remove
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add to Feed Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-obsidian/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="w-full max-w-2xl border theme-border rounded-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b theme-border">
              <h3 className="font-display font-bold theme-text text-lg">Add to Instagram Feed</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 flex items-center justify-center border theme-border theme-text-muted hover:border-gold/40 hover:text-gold transition-all rounded-lg"
              >
                <X size={14} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                  Select Product
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2">
                  {availableProducts.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => setSelectedProduct(product)}
                      className={`cursor-pointer rounded-lg border-2 p-2 transition-all ${
                        selectedProduct?._id === product._id
                          ? 'border-gold bg-gold/5'
                          : 'border-transparent hover:border-gold/30'
                      }`}
                    >
                      <div className="aspect-square overflow-hidden rounded-lg">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="font-display font-semibold theme-text text-xs mt-2 truncate">{product.name}</p>
                      <p className="font-mono text-[9px] text-gold/60">{product.category}</p>
                    </div>
                  ))}
                </div>
              </div>
              {selectedProduct && (
                <>
                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                      Custom Caption (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={customCaption}
                      onChange={(e) => setCustomCaption(e.target.value)}
                      placeholder={`e.g., ${selectedProduct.name} - Limited Edition`}
                      className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors rounded-lg"
                      style={{ backgroundColor: 'var(--input-bg)' }}
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                      Likes Count (Optional)
                    </label>
                    <input
                      type="text"
                      value={customLikes}
                      onChange={(e) => setCustomLikes(e.target.value)}
                      placeholder="e.g., 2.4k"
                      className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors rounded-lg"
                      style={{ backgroundColor: 'var(--input-bg)' }}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 border theme-border theme-text-secondary font-mono text-[11px] tracking-[0.2em] uppercase hover:border-gold/30 transition-colors rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToFeed}
                className="flex-1 py-3 bg-gold text-obsidian font-mono text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-yellow-400 transition-colors rounded-lg"
              >
                Add to Feed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInstagram;