
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ChevronDown, Plus, Edit } from "lucide-react";

const categoryIcons: Record<string, string> = {
  Onboarding: "👋",
  Financial: "💰",
  Engagement: "🎯",
  Support: "🛠️",
  Marketing: "📢",
  Retention: "💎",
};

export type MessageCategory = {
  name: string;
  icon: string;
  count: number;
  messages: { id: number; title: string; content: string }[];
};

type MessageCategoriesPanelProps = {
  categories: MessageCategory[];
  onAddCategory: () => void;
  onAddMessage: (category: string, title: string, content: string) => void;
  onEditMessage: (
    category: string,
    msgIdx: number,
    title: string,
    content: string
  ) => void;
};

export default function MessageCategoriesPanel({
  categories,
  onAddCategory,
  onAddMessage,
  onEditMessage,
}: MessageCategoriesPanelProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ category: string; msgIdx: number } | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  return (
    <section>
      <div className="flex items-center justify-between mb-4 flex-wrap">
        <h2 className="text-xl font-bold" style={{ color: "#FF6B6B" }}>
          Message Categories
        </h2>
        <Button size="sm" onClick={onAddCategory} className="bg-[#FF6B6B]">
          <Plus className="mr-1 w-4 h-4" /> New Category
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
        {categories.map((cat) => (
          <motion.button
            key={cat.name}
            onClick={() => setExpanded(expanded === cat.name ? null : cat.name)}
            className={`rounded-xl border-2 bg-white min-h-[60px] flex flex-col items-center justify-center text-center text-sm font-medium relative px-2 py-5 transition hover:shadow-lg ${
              expanded === cat.name
                ? "border-[#FF6B6B] scale-105"
                : "border-gray-200"
            }`}
            whileTap={{ scale: 0.98 }}
            aria-expanded={expanded === cat.name}
          >
            <span className="mb-1 text-lg">{categoryIcons[cat.name] || "📄"}</span>
            <span>{cat.name}</span>
            <Badge variant="secondary" className="absolute bottom-2 right-3 text-xs">
              {cat.messages.length}
            </Badge>
            <ChevronDown
              className={`absolute top-2 right-3 w-5 h-5 text-gray-400 transition-transform ${
                expanded === cat.name ? "rotate-180" : ""
              }`}
            />
          </motion.button>
        ))}
      </div>
      {/* Expand selected category */}
      <AnimatePresence initial={false}>
        {categories.map((cat) =>
          expanded === cat.name ? (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="rounded-xl shadow-inner bg-[#10B98113] mt-4 p-5">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-semibold mr-2 text-[#10B981]">
                    {cat.name} Messages
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto"
                    onClick={() => setExpanded(null)}
                  >
                    Close
                  </Button>
                </div>
                <div className="space-y-4">
                  {cat.messages.map((msg, idx) =>
                    editing && editing.category === cat.name && editing.msgIdx === idx ? (
                      <div key={msg.id} className="p-3 bg-white rounded-lg shadow flex flex-col gap-2">
                        <input
                          className="border p-2 rounded mb-1"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                        />
                        <textarea
                          rows={2}
                          className="border p-2 rounded mb-1 resize-none"
                          value={newContent}
                          onChange={(e) => setNewContent(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => {
                              onEditMessage(cat.name, idx, newTitle, newContent);
                              setEditing(null);
                            }}
                          >
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
                        className="p-3 bg-white rounded-lg shadow flex flex-col gap-2"
                      >
                        <div className="flex gap-2 items-center">
                          <span className="font-medium">{msg.title}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditing({ category: cat.name, msgIdx: idx });
                              setNewTitle(msg.title);
                              setNewContent(msg.content);
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
                <div className="mt-5">
                  {addingTo === cat.name ? (
                    <div className="flex flex-col gap-2">
                      <input
                        className="border p-2 rounded"
                        placeholder="Title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                      <textarea
                        className="border p-2 rounded"
                        placeholder="Message"
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        rows={2}
                      />
                      <div className="flex gap-2 mt-1">
                        <Button
                          size="sm"
                          className="bg-[#10B981]"
                          onClick={() => {
                            onAddMessage(cat.name, newTitle, newContent);
                            setNewTitle("");
                            setNewContent("");
                            setAddingTo(null);
                          }}
                        >
                          Add Message
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setAddingTo(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-[#10B981]"
                      onClick={() => {
                        setAddingTo(cat.name);
                        setNewTitle("");
                        setNewContent("");
                      }}
                    >
                      <Plus className="mr-1 w-4 h-4" /> Add Message
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ) : null
        )}
      </AnimatePresence>
    </section>
  );
}
