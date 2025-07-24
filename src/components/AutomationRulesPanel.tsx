
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Edit, Plus } from "lucide-react";

export type AutomationRule = {
  id: number;
  name: string;
  trigger: string;
  action: string;
  status: "active" | "paused";
  category: string;
};

type AutomationRulesPanelProps = {
  rules: AutomationRule[];
  onToggle: (id: number, newStatus: "active" | "paused") => void;
  onEdit: (rule: AutomationRule) => void;
  onAdd: (rule: Omit<AutomationRule, "id">) => void;
};

const AutomationRulesPanel: React.FC<AutomationRulesPanelProps> = ({
  rules,
  onToggle,
  onEdit,
  onAdd,
}) => {
  // For edit dialog
  const [editRule, setEditRule] = useState<AutomationRule | null>(null);
  // For add dialog
  const [showAdd, setShowAdd] = useState(false);
  const [newRule, setNewRule] = useState<Omit<AutomationRule, "id">>({
    name: "",
    trigger: "",
    action: "",
    status: "active",
    category: "",
  });

  // Edit controlled state
  const [editFields, setEditFields] = useState<Omit<AutomationRule, "id">>({
    name: "",
    trigger: "",
    action: "",
    status: "active",
    category: "",
  });

  // Handle Edit click (populate fields)
  const handleEditClick = (rule: AutomationRule) => {
    setEditRule(rule);
    setEditFields({
      name: rule.name,
      trigger: rule.trigger,
      action: rule.action,
      status: rule.status,
      category: rule.category,
    });
  };

  // Responsive stack for rules
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <CardTitle>
            Automation Rules
          </CardTitle>
          <Dialog open={showAdd} onOpenChange={setShowAdd}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                aria-label="Add Rule"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Automation Rule</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3 mt-2">
                <Input
                  placeholder="Name"
                  value={newRule.name}
                  onChange={e => setNewRule(r => ({ ...r, name: e.target.value }))}
                />
                <Input
                  placeholder="Trigger"
                  value={newRule.trigger}
                  onChange={e => setNewRule(r => ({ ...r, trigger: e.target.value }))}
                />
                <Input
                  placeholder="Action"
                  value={newRule.action}
                  onChange={e => setNewRule(r => ({ ...r, action: e.target.value }))}
                />
                <Input
                  placeholder="Category"
                  value={newRule.category}
                  onChange={e => setNewRule(r => ({ ...r, category: e.target.value }))}
                />
              </div>
              <DialogFooter>
                <Button
                  onClick={() => {
                    if (newRule.name && newRule.trigger && newRule.action && newRule.category) {
                      onAdd(newRule);
                      setShowAdd(false);
                      setNewRule({
                        name: "",
                        trigger: "",
                        action: "",
                        status: "active",
                        category: "",
                      });
                    }
                  }}
                >
                  Save
                </Button>
                <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {rules.length === 0 && (
            <div className="text-muted-foreground text-sm text-center py-5">
              No automation rules available. Add one above.
            </div>
          )}
          {rules.map(rule => (
            <div
              key={rule.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between p-3 rounded-lg border hover:bg-muted/50 transition overflow-auto"
            >
              <div className="flex-1 mb-2 md:mb-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-medium">{rule.name}</span>
                  <Badge variant={rule.status === "active" ? "default" : "secondary"}>
                    {rule.status}
                  </Badge>
                  <Badge variant="outline">{rule.category}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  <strong>If:</strong> {rule.trigger} → <strong>Then:</strong> {rule.action}
                </p>
              </div>
              <div className="flex items-center gap-2 md:ml-4">
                <Switch
                  checked={rule.status === "active"}
                  onCheckedChange={checked =>
                    onToggle(rule.id, checked ? "active" : "paused")
                  }
                  aria-label={`Toggle ${rule.name}`}
                />
                <Dialog open={editRule?.id === rule.id} onOpenChange={open => open ? handleEditClick(rule) : setEditRule(null)}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      aria-label="Edit Rule"
                      onClick={() => handleEditClick(rule)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Rule</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 mt-2">
                      <Input
                        placeholder="Name"
                        value={editFields.name}
                        onChange={e => setEditFields(f => ({ ...f, name: e.target.value }))}
                      />
                      <Input
                        placeholder="Trigger"
                        value={editFields.trigger}
                        onChange={e => setEditFields(f => ({ ...f, trigger: e.target.value }))}
                      />
                      <Input
                        placeholder="Action"
                        value={editFields.action}
                        onChange={e => setEditFields(f => ({ ...f, action: e.target.value }))}
                      />
                      <Input
                        placeholder="Category"
                        value={editFields.category}
                        onChange={e => setEditFields(f => ({ ...f, category: e.target.value }))}
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() => {
                          onEdit({ ...rule, ...editFields });
                          setEditRule(null);
                        }}
                      >
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => setEditRule(null)}>
                        Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AutomationRulesPanel;
