
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Edit, Plus, ChevronDown, Save, Loader2 } from "lucide-react";
import { useReminders, type PredefinedCategory } from "@/hooks/useReminders";

export type { PredefinedCategory };

export default function PredefinedCategoriesPanel() {
  const { 
    categories, 
    loading, 
    addReminder, 
    updateReminder, 
    addCategory 
  } = useReminders();

  const [activeCatId, setActiveCatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<{ title: string; content: string }>({
    title: "",
    content: "",
  });
  const [editing, setEditing] = useState<{ catId: string; msgId: number; reminderId?: string } | null>(null);
  const [editValues, setEditValues] = useState<{ title: string; content: string }>({ title: "", content: "" });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [submitting, setSubmitting] = useState(false);

  // Set initial active category when categories load
  useEffect(() => {
    if (categories.length > 0 && !activeCatId) {
      setActiveCatId(categories[0].id);
    }
  }, [categories, activeCatId]);

  // Add message with Excel sync
  const handleAddMessage = async (catId: string) => {
    if (!newMessage.title.trim() || !newMessage.content.trim()) return;
    
    setSubmitting(true);
    try {
      const category = categories.find(c => c.id === catId);
      if (category) {
        await addReminder(category.name, newMessage.title, newMessage.content);
        setNewMessage({ title: "", content: "" });
      }
    } catch (error) {
      console.error('Failed to add message:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Edit message with Excel sync
  const handleEditMessage = async (catId: string, msgId: number) => {
    if (!editing?.reminderId) return;
    
    setSubmitting(true);
    try {
      await updateReminder(editing.reminderId, editValues.title, editValues.content);
      setEditing(null);
    } catch (error) {
      console.error('Failed to update message:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Add new category with Excel sync
  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) return;
    
    setSubmitting(true);
    try {
      await addCategory(newCategory.name);
      setShowAddCategory(false);
      setNewCategory({ name: "" });
    } catch (error) {
      console.error('Failed to add category:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="mb-6">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-coral" />
          <span className="ml-2 text-muted-foreground">Loading Excel data...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3 flex-wrap">
        <h2 className="text-xl font-bold text-coral">Excel-Synced Categories</h2>
        <Button
          variant="outline"
          size="sm"
          className="border-coral text-coral"
          onClick={() => setShowAddCategory(true)}
          disabled={submitting}
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-1" />
          )}
          New Category
        </Button>
      </div>
      {/* Category buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCatId(cat.id)}
            className={`rounded-xl border-2 min-h-[60px] bg-white flex flex-col items-center justify-center text-center text-sm font-medium px-2 py-6 relative transition-all hover:shadow-lg ${
              activeCatId === cat.id
                ? "border-coral scale-105 ring-2 ring-coral"
                : "border-gray-200"
            }`}
            aria-expanded={activeCatId === cat.id}
          >
            <span className="mb-1">
              <ChevronDown
                className={`mx-auto text-gray-400 transition-transform ${
                  activeCatId === cat.id ? "rotate-180" : ""
                }`}
              />
            </span>
            <span>{cat.name}</span>
            <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
              {cat.messages.length}
            </span>
          </button>
        ))}
      </div>
      {/* Expanded category content */}
      <AnimatePresence>
        {categories.map(
          (cat) =>
            activeCatId === cat.id && (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="rounded-xl shadow-inner bg-mint/10 mt-2 p-3 md:p-6">
                  {/* Messages List */}
                  <div className="space-y-2 mb-5">
                    {cat.messages.length === 0 && (
                      <div className="text-center text-muted-foreground">No messages yet.</div>
                    )}
                    {cat.messages.map((msg) =>
                      editing &&
                      editing.catId === cat.id &&
                      editing.msgId === msg.id ? (
                        <div
                          key={msg.id}
                          className="rounded-lg bg-lavender/40 px-3 py-3 mb-2 flex flex-col gap-2"
                        >
                          <input
                            className="border p-2 rounded"
                            value={editValues.title}
                            onChange={(e) =>
                              setEditValues((v) => ({
                                ...v,
                                title: e.target.value,
                              }))
                            }
                            disabled={submitting}
                          />
                          <textarea
                            className="border p-2 rounded"
                            value={editValues.content}
                            onChange={(e) =>
                              setEditValues((v) => ({
                                ...v,
                                content: e.target.value,
                              }))
                            }
                            disabled={submitting}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-mint"
                              onClick={() => handleEditMessage(cat.id, msg.id)}
                              disabled={submitting}
                            >
                              {submitting ? (
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              ) : (
                                <Save className="w-4 h-4 mr-1" />
                              )}
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditing(null)}
                              disabled={submitting}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          key={msg.id}
                          className="rounded-lg bg-lavender/30 px-3 py-3 flex flex-col gap-1 mb-2"
                        >
                          <div className="flex gap-2 items-center">
                            <span className="font-semibold">{msg.title}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditing({
                                  catId: cat.id,
                                  msgId: msg.id,
                                  reminderId: `${cat.name.toLowerCase().replace(/\s+/g, '_')}_${msg.id}`
                                });
                                setEditValues({
                                  title: msg.title,
                                  content: msg.content,
                                });
                              }}
                              disabled={submitting}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {msg.content}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  {/* Add message */}
                  <div className="flex flex-col gap-2 md:flex-row md:items-end">
                    <input
                      className="border rounded px-3 py-2 mb-1 md:mb-0 flex-1"
                      placeholder="Title"
                      value={newMessage.title}
                      onChange={(e) =>
                        setNewMessage((msg) => ({ ...msg, title: e.target.value }))
                      }
                    />
                    <textarea
                      className="border rounded px-3 py-2 mb-1 md:mb-0 flex-1"
                      placeholder="Message"
                      value={newMessage.content}
                      onChange={(e) =>
                        setNewMessage((msg) => ({ ...msg, content: e.target.value }))
                      }
                      rows={2}
                    />
                    <Button
                      size="sm"
                      className="bg-coral text-white"
                      onClick={() => handleAddMessage(cat.id)}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <Loader2 className="mr-1 w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="mr-1 w-4 h-4" />
                      )}
                      Add Message
                    </Button>
                  </div>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>
      {/* Add category modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-xs shadow-2xl space-y-4">
            <h3 className="font-bold text-lg mb-2 text-coral">Add New Category</h3>
            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="Category Name"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory((cat) => ({ ...cat, name: e.target.value }))
              }
              disabled={submitting}
            />
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                className="bg-mint text-white"
                onClick={handleAddCategory}
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="mr-1 w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="mr-1 w-4 h-4" />
                )}
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddCategory(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
