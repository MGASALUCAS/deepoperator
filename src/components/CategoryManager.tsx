
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // animation
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Plus, Save, Edit, ChevronDown } from "lucide-react";

// Placeholder data. In production, fetch from backend or read Excel file.
const initialCategories = [
  {
    id: "alert",
    label: "Alert",
    messages: [
      { id: 1, title: "Website yako Binafsi", text: "Duka Mtandao ni kama website yako binafsi. Ni moja ya feature muhimu sana kwenye Kuza — tumia kuitangaza biashara yako." },
      { id: 2, title: "Boresha Duka Mtandao", text: "Duka Mtandao ni lango la kwanza kwa wateja. Picha bora hujenga imani na kuuza zaidi — hakikisha zinaonyesha bidhaa zako kwa ubora na unawashirikisha." }
    ]
  },
  {
    id: "duka",
    label: "Duka Mtandao",
    messages: [
      { id: 1, title: "Washirikishe Wateja", text: "Kila duka linahitaji wateja. Share link ya duka lako leo — fursa inaanza na hatua moja." },
      { id: 2, title: "Okoa Muda", text: "Badala ya kujibu maswali mengi kila siku, share duka lako. Mteja ataona kila kitu papo hapo." }
    ]
  },
  {
    id: "info",
    label: "Information",
    messages: [
      { id: 1, title: "Chapa Yako Mtandaoni", text: "Duka Mtandao si sehemu tu ya bidhaa — ni chapa yako. Litengeneze vizuri. Litumie kwa ufanisi." }
    ]
  },
  {
    id: "mauzo",
    label: "Mauzo",
    messages: []
  },
  {
    id: "weekly",
    label: "Weekly",
    messages: []
  }
];

export default function CategoryManager() {
  const [categories, setCategories] = useState(initialCategories);
  const [active, setActive] = useState<string | null>(null);
  const [editing, setEditing] = useState<{cat: string, msg: number} | null>(null);
  const [newMsgTitle, setNewMsgTitle] = useState("");
  const [newMsgText, setNewMsgText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ label: "", id: "" });

  // Handles editing state for messages
  const handleEdit = (catId: string, msgId: number) => {
    setEditing({cat: catId, msg: msgId});
  };

  const handleSave = (catId: string, msgIdx: number, title: string, text: string) => {
    setCategories(cats => cats.map(cat => 
      cat.id === catId 
      ? {...cat, messages: cat.messages.map((m, idx) => idx === msgIdx 
        ? {...m, title, text}
        : m)}
      : cat
    ));
    setEditing(null);
    // Placeholder: console log to simulate save to Excel
    console.log("Saved edited message", {catId, title, text});
  };

  const handleAddMsg = (catId: string) => {
    if (!newMsgTitle.trim() || !newMsgText.trim()) return;
    setCategories(cats => cats.map(cat => 
      cat.id === catId 
      ? {...cat, messages: [...cat.messages, { id: Date.now(), title: newMsgTitle, text: newMsgText}]}
      : cat
    ));
    setNewMsgTitle("");
    setNewMsgText("");
    // Placeholder: console log to simulate save to Excel
    console.log("Added new message", {catId, newMsgTitle, newMsgText});
  };

  const handleAddCategory = () => {
    if (!newCategory.label.trim() || !newCategory.id.trim()) return;
    setCategories([
      ...categories,
      { id: newCategory.id, label: newCategory.label, messages: [] }
    ]);
    setNewCategory({ label: "", id: "" });
    setModalOpen(false);
    // Placeholder: console log to simulate category add
    console.log("Added new category", newCategory);
  };

  return (
    <div className="w-full mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Predefined Categories</h2>
        <Button size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 w-4 h-4" /> New Category
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {categories.map(cat => (
          <motion.button
            key={cat.id}
            onClick={() => setActive(a => (a === cat.id ? null : cat.id))}
            className={`rounded-xl border-2 bg-white min-h-[60px] flex flex-col items-center justify-center text-sm font-medium relative px-2 py-5 transition-all shadow-sm hover:shadow-lg ${active === cat.id ? "border-coral scale-105" : "border-gray-200"} `}
            whileTap={{ scale: 0.98 }}
            animate={{ boxShadow: active === cat.id ? "0px 0px 0px 4px #FF6B6B22" : "0px 0px 0px 0px #fff" }}
            aria-expanded={active === cat.id}
          >
            <span className="mb-1">
              <ChevronDown className={`mx-auto text-gray-400 ${active === cat.id ? "rotate-180 transition-transform" : ""}`} />
            </span>
            <span>{cat.label}</span>
            <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">{cat.messages.length}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {categories.map((cat, idx) => active === cat.id && (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="rounded-xl shadow-inner bg-mint/10 mt-6 p-5">
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-semibold text-mint mr-3">{cat.label} Messages</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={() => setActive(null)}
                > Close </Button>
              </div>
              <div className="space-y-4">
                {cat.messages.map((msg, midx) => (
                  <div key={msg.id} className="p-4 bg-white rounded-md mb-2 shadow-sm flex flex-col gap-2">
                    {editing && editing.cat === cat.id && editing.msg === midx ? (
                      <>
                        <Input 
                          className="mb-2"
                          value={msg.title}
                          onChange={e => {
                            const val = e.target.value;
                            setCategories(cats => cats.map(c => 
                              c.id === cat.id ? {...c, messages: c.messages.map((m,i)=>i===midx?{...m, title: val}:m)} : c
                            ));
                          }}
                        />
                        <Input 
                          className="mb-2"
                          value={msg.text}
                          onChange={e => {
                            const val = e.target.value;
                            setCategories(cats => cats.map(c => 
                              c.id === cat.id ? {...c, messages: c.messages.map((m,i)=>i===midx?{...m, text: val}:m)} : c
                            ));
                          }}
                        />
                        <Button 
                          size="sm"
                          variant="default"
                          className="w-fit"
                          onClick={() => handleSave(cat.id, midx, msg.title, msg.text)}
                        ><Save className="w-4 h-4" /> Save</Button>
                      </>
                    ) : (
                      <>
                        <div className="flex gap-3">
                          <span className="font-medium">{msg.title}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(cat.id, midx)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="text-muted-foreground text-sm">{msg.text}</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Add new message</h4>
                <Input 
                  placeholder="Title" 
                  className="mb-2"
                  value={newMsgTitle}
                  onChange={e => setNewMsgTitle(e.target.value)}
                />
                <Input 
                  placeholder="Message"
                  className="mb-2"
                  value={newMsgText}
                  onChange={e => setNewMsgText(e.target.value)}
                />
                <Button
                  size="sm"
                  onClick={() => handleAddMsg(cat.id)}
                  variant="outline"
                >Add Message
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Modal for adding new category */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <Input 
            placeholder="Unique ID (e.g. weekly, alert)"
            className="mb-2"
            value={newCategory.id}
            onChange={e => setNewCategory({ ...newCategory, id: e.target.value })}
          />
          <Input 
            placeholder="Category Name"
            className="mb-2"
            value={newCategory.label}
            onChange={e => setNewCategory({ ...newCategory, label: e.target.value })}
          />
          <DialogFooter>
            <Button variant="default" onClick={handleAddCategory}>Save Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
