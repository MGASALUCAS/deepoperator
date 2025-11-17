
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Edit, Plus, ChevronDown, Save } from "lucide-react";

// Hardcoded sample in Kiswahili as reference (Excel-backed in real app)
const initialCategories = [
  {
    id: "alert",
    name: "Alert",
    icon: "message-circle",
    messages: [
      {
        id: 1,
        title: "Website yako Binafsi",
        content:
          "Duka Mtandao ni kama website yako binafsi. Ni moja ya feature muhimu sana kwenye Kuza — tumia kuitangaza biashara yako.",
      },
      {
        id: 2,
        title: "Boresha Duka Mtandao",
        content:
          "Duka Mtandao ni lango la kwanza kwa wateja. Picha bora hujenga imani na kuuza zaidi — hakikisha zinaonyesha bidhaa zako kwa ubora na unawashirikisha.",
      },
    ],
  },
  {
    id: "duka",
    name: "Duka Mtandao",
    icon: "message-circle",
    messages: [
      {
        id: 1,
        title: "Washirikishe Wateja",
        content:
          "Kila duka linahitaji wateja. Share link ya duka lako leo — fursa inaanza na hatua moja.",
      },
      {
        id: 2,
        title: "Okoa Muda",
        content:
          "Badala ya kujibu maswali mengi kila siku, share duka lako. Mteja ataona kila kitu papo hapo.",
      },
    ],
  },
  {
    id: "info",
    name: "Information",
    icon: "message-circle",
    messages: [
      {
        id: 1,
        title: "Chapa Yako Mtandaoni",
        content:
          "Duka Mtandao si sehemu tu ya bidhaa — ni chapa yako. Litengeneze vizuri. Litumie kwa ufanisi.",
      },
    ],
  },
  {
    id: "mauzo",
    name: "Mauzo",
    icon: "message-circle",
    messages: [],
  },
  {
    id: "weekly",
    name: "Weekly",
    icon: "message-circle",
    messages: [],
  },
];

export interface PredefinedCategory {
  id: string;
  name: string;
  icon: string;
  messages: { id: number; title: string; content: string }[];
}

export default function PredefinedCategoriesPanel() {
  const [categories, setCategories] = useState<PredefinedCategory[]>(initialCategories);
  const [activeCatId, setActiveCatId] = useState<string | null>(
    categories.length > 0 ? categories[0].id : null
  );
  const [newMessage, setNewMessage] = useState<{ title: string; content: string }>({
    title: "",
    content: "",
  });
  const [editing, setEditing] = useState<{ catId: string; msgId: number } | null>(null);
  const [editValues, setEditValues] = useState<{ title: string; content: string }>({ title: "", content: "" });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", id: "" });

  // Add message
  const handleAddMessage = (catId: string) => {
    if (!newMessage.title.trim() || !newMessage.content.trim()) return;
    setCategories((c) =>
      c.map((cat) =>
        cat.id === catId
          ? {
              ...cat,
              messages: [
                ...cat.messages,
                { id: Date.now(), title: newMessage.title, content: newMessage.content },
              ],
            }
          : cat
      )
    );
    setNewMessage({ title: "", content: "" });
  };

  // Edit message
  const handleEditMessage = (catId: string, msgId: number) => {
    setCategories((c) =>
      c.map((cat) =>
        cat.id === catId
          ? {
              ...cat,
              messages: cat.messages.map((msg) =>
                msg.id === msgId
                  ? { ...msg, title: editValues.title, content: editValues.content }
                  : msg
              ),
            }
          : cat
      )
    );
    setEditing(null);
  };

  // Add new category
  const handleAddCategory = () => {
    if (!newCategory.name.trim() || !newCategory.id.trim()) return;
    setCategories([
      ...categories,
      { id: newCategory.id, name: newCategory.name, icon: "message-circle", messages: [] },
    ]);
    setShowAddCategory(false);
    setNewCategory({ name: "", id: "" });
  };

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3 flex-wrap">
        <h2 className="text-lg sm:text-xl lg:text-lg font-bold text-coral">Predefined Categories</h2>
        <Button
          variant="outline"
          size="sm"
          className="border-coral text-coral"
          onClick={() => setShowAddCategory(true)}
        >
          <Plus className="w-4 h-4 mr-1" />
          New Category
        </Button>
      </div>
      {/* Category buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCatId(cat.id)}
            className={`rounded-xl border-2 min-h-[60px] lg:min-h-[52px] bg-white flex flex-col items-center justify-center text-center text-sm lg:text-xs font-medium px-2 py-6 lg:py-4 relative transition-all hover:shadow-lg ${
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
            <span className="absolute bottom-2 right-3 text-xs lg:text-[11px] text-muted-foreground">
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
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-mint"
                              onClick={() => handleEditMessage(cat.id, msg.id)}
                            >
                              <Save className="w-4 h-4 mr-1" />
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditing(null)}
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
                                });
                                setEditValues({
                                  title: msg.title,
                                  content: msg.content,
                                });
                              }}
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
                    >
                      <Plus className="mr-1 w-4 h-4" /> Add Message
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
              className="border rounded px-3 py-2 w-full mb-2"
              placeholder="Category id (unique, e.g., weekly)"
              value={newCategory.id}
              onChange={(e) =>
                setNewCategory((cat) => ({ ...cat, id: e.target.value }))
              }
            />
            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="Category Name"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory((cat) => ({ ...cat, name: e.target.value }))
              }
            />
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                className="bg-mint text-white"
                onClick={handleAddCategory}
              >
                <Plus className="mr-1 w-4 h-4" /> Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddCategory(false)}
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
