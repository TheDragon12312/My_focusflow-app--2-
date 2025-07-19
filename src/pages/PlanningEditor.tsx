import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { realGoogleIntegration } from "@/lib/real-google-integration";
import { aiService } from "@/lib/ai-service";
import { googleCalendarImport } from "@/lib/google-calendar-import";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft,
  Plus,
  Calendar,
  Clock,
  Target,
  Brain,
  Zap,
  CheckCircle,
  Edit,
  Trash2,
  Save,
  X,
  Play,
  AlertCircle,
  ExternalLink,
  Download,
} from "lucide-react";

interface TaskBlock {
  id: string;
  task: string;
  duration: number;
  description: string;
  completed: boolean;
}

const PlanningEditor = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [blocks, setBlocks] = useState<TaskBlock[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newDuration, setNewDuration] = useState(25);
  const [newDescription, setNewDescription] = useState("");
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState("");
  const [editedDuration, setEditedDuration] = useState(25);
  const [editedDescription, setEditedDescription] = useState("");
  const [suggestedTasks, setSuggestedTasks] = useState<string[]>([]);
  const [importingCalendar, setImportingCalendar] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    // Load task blocks from local storage
    const storedBlocks = localStorage.getItem(`task_blocks_${user.id}`);
    if (storedBlocks) {
      setBlocks(JSON.parse(storedBlocks));
    }

    // Load AI task suggestions - convert user.id to number
    const userId = parseInt(user.id) || 0;
    const suggestions = aiService.getTaskSuggestions(userId);
    setSuggestedTasks(suggestions);
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    // Save task blocks to local storage whenever blocks change
    localStorage.setItem(`task_blocks_${user.id}`, JSON.stringify(blocks));
  }, [blocks, user?.id]);

  const handleAddTask = () => {
    if (!newTask.trim()) {
      toast.error("Taak kan niet leeg zijn!");
      return;
    }

    const newBlock: TaskBlock = {
      id: Date.now().toString(),
      task: newTask,
      duration: newDuration,
      description: newDescription,
      completed: false,
    };

    setBlocks([...blocks, newBlock]);
    setNewTask("");
    setNewDuration(25);
    setNewDescription("");
    toast.success("Taak toegevoegd aan planning! ✅");
  };

  const handleStartTask = (block: TaskBlock) => {
    navigate("/focus", { state: { block } });
  };

  const handleEditBlock = (block: TaskBlock) => {
    setEditingBlockId(block.id);
    setEditedTask(block.task);
    setEditedDuration(block.duration);
    setEditedDescription(block.description);
  };

  const handleSaveEdit = () => {
    const updatedBlocks = blocks.map((block) =>
      block.id === editingBlockId
        ? {
            ...block,
            task: editedTask,
            duration: editedDuration,
            description: editedDescription,
          }
        : block,
    );
    setBlocks(updatedBlocks);
    setEditingBlockId(null);
    toast.success("Taak bewerkt! ✅");
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks(blocks.filter((block) => block.id !== blockId));
    setEditingBlockId(null);
    toast.success("Taak verwijderd! 🗑️");
  };

  const handleCancelEdit = () => {
    setEditingBlockId(null);
  };

  const handleCompleteTask = (blockId: string) => {
    const updatedBlocks = blocks.map((block) =>
      block.id === blockId ? { ...block, completed: !block.completed } : block,
    );
    setBlocks(updatedBlocks);
  };

  const calculateTotalTime = () => {
    return blocks.reduce((total, block) => total + block.duration, 0);
  };

  const handlePlanWithAI = async () => {
    if (!user?.id) {
      toast.error("Je moet ingelogd zijn om AI planning te gebruiken.");
      return;
    }

    try {
      // Convert user.id to number
      const userId = parseInt(user.id) || 0;
      const aiSuggestions = aiService.getTaskSuggestions(userId);
      // Convert suggestions to blocks
      const generatedBlocks = aiSuggestions.map((task, index) => ({
        id: (Date.now() + index).toString(),
        task: task,
        duration: 25,
        description: "AI gegenereerde taak",
        completed: false,
      }));
      setBlocks(generatedBlocks);
      toast.success("AI heeft je planning gemaakt! 🤖");
    } catch (error) {
      console.error("AI planning error:", error);
      toast.error("Er ging iets mis bij het genereren van de planning met AI");
    }
  };

  // Import Google Calendar events as tasks
  const handleImportFromCalendar = async () => {
    if (!user?.id) {
      toast.error("Je moet ingelogd zijn om te importeren");
      return;
    }

    setImportingCalendar(true);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        toast.error("Geen geldige sessie gevonden. Log opnieuw in.");
        return;
      }

      toast.info("Google Calendar evenementen importeren...");

      const { data, error } = await supabase.functions.invoke(
        "import-google-calendar",
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );

      if (error) {
        console.error("Import error:", error);
        
        // Try client-side fallback
        try {
          const result = await googleCalendarImport.importCalendarEvents();
          
          if (result.success && result.events) {
            // Convert calendar events to task blocks
            const newTaskBlocks = result.events.map((event: any, index: number) => ({
              id: (Date.now() + index).toString(),
              task: event.summary || "Nieuwe taak",
              duration: 25, // Default duration
              description: `Geïmporteerd van Google Calendar: ${event.start?.dateTime || event.start?.date || "Geen datum"}`,
              completed: false,
            }));

            // Add to existing blocks
            setBlocks(prevBlocks => [...prevBlocks, ...newTaskBlocks]);
            toast.success(`✅ ${newTaskBlocks.length} taken geïmporteerd van Google Calendar!`);
          } else {
            toast.error("Geen evenementen gevonden om te importeren");
          }
        } catch (clientError) {
          console.error("Client-side import error:", clientError);
          toast.error("Import mislukt. Controleer je Google Calendar verbinding.");
        }
        return;
      }

      if (data?.success && data.events) {
        // Convert calendar events to task blocks
        const newTaskBlocks = data.events.map((event: any, index: number) => ({
          id: (Date.now() + index).toString(),
          task: event.summary || "Nieuwe taak",
          duration: 25, // Default duration
          description: `Geïmporteerd van Google Calendar: ${event.start?.dateTime || event.start?.date || "Geen datum"}`,
          completed: false,
        }));

        // Add to existing blocks
        setBlocks(prevBlocks => [...prevBlocks, ...newTaskBlocks]);
        toast.success(`✅ ${newTaskBlocks.length} taken geïmporteerd van Google Calendar!`);
      } else {
        toast.error("Geen evenementen gevonden om te importeren");
      }
    } catch (err: any) {
      console.error("Google Calendar import error:", err);
      toast.error("Er ging iets mis bij het importeren van Google Calendar");
    } finally {
      setImportingCalendar(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Terug naar Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Planning Editor
              </h1>
              <p className="text-gray-600">Plan je focus sessies</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handlePlanWithAI}>
              <Brain className="h-4 w-4 mr-2" />
              Plan met AI
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Add Task Section */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              <Plus className="h-5 w-5 mr-2 text-blue-600 inline-block align-middle" />
              Voeg een taak toe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="newTask">Taak</Label>
              <Input
                type="text"
                id="newTask"
                placeholder="Bijv. E-mails beantwoorden"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="newDuration">Duur (minuten)</Label>
              <Input
                type="number"
                id="newDuration"
                placeholder="25"
                value={newDuration}
                onChange={(e) => setNewDuration(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="newDescription">Beschrijving (optioneel)</Label>
              <Textarea
                id="newDescription"
                placeholder="Details over de taak"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            <Button onClick={handleAddTask} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Taak toevoegen
            </Button>
          </CardContent>
        </Card>

        {/* Task List Section */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              <Target className="h-5 w-5 mr-2 text-purple-600 inline-block align-middle" />
              Takenlijst
              <Badge variant="secondary" className="ml-2">
                {blocks.length} taken
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {blocks.length === 0 ? (
              <div className="text-center py-6">
                <AlertCircle className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">
                  Geen taken gevonden. Voeg taken toe of importeer ze van Google Calendar om te starten!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {blocks.map((block) => (
                  <div key={block.id} className="py-4 flex items-center">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">{block.task}</h3>
                      <p className="text-sm text-gray-500">
                        {block.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{block.duration} minuten</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartTask(block)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                      {editingBlockId === block.id ? (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleSaveEdit}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Opslaan
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancelEdit}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Annuleren
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditBlock(block)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBlock(block.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCompleteTask(block.id)}
                      >
                        {block.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-gray-400"></div>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Task Modal */}
        {editingBlockId && (
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                <Edit className="h-5 w-5 mr-2 text-orange-600 inline-block align-middle" />
                Bewerk Taak
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="editTask">Taak</Label>
                <Input
                  type="text"
                  id="editTask"
                  value={editedTask}
                  onChange={(e) => setEditedTask(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="editDuration">Duur (minuten)</Label>
                <Input
                  type="number"
                  id="editDuration"
                  value={editedDuration}
                  onChange={(e) => setEditedDuration(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="editDescription">Beschrijving</Label>
                <Textarea
                  id="editDescription"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Task Suggestions */}
        {suggestedTasks.length > 0 && (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span>AI Taak Suggesties</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {suggestedTasks.map((task, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => {
                      setNewTask(task);
                      toast.info(
                        `Suggestie "${task}" toegevoegd aan nieuwe taak`,
                      );
                    }}
                    className="p-4 h-auto flex flex-col items-center space-y-2 hover:bg-blue-50"
                  >
                    <span className="text-2xl">💡</span>
                    <span className="font-medium">{task}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Google Calendar Integration */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-500" />
              <span>Google Calendar Integratie</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Importeer taken van je Google Calendar evenementen in je planning.
            </p>
            
            <Button
              onClick={handleImportFromCalendar}
              className="mt-4 w-full"
              disabled={importingCalendar}
            >
              <Download className="h-4 w-4 mr-2" />
              {importingCalendar ? "Importeren..." : "Importeer van Google Calendar"}
            </Button>
            
            {/* Google Calendar Connection Notice */}
            <div className="mt-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <ExternalLink className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-amber-800 font-medium text-sm">
                      🔗 Google Calendar nog niet verbonden
                    </h3>
                    <p className="text-amber-700 text-xs mt-1">
                      Ga naar de Calendar pagina om je Google Calendar te verbinden
                      voordat je kunt importeren.
                    </p>
                  </div>
                  <Button
                    onClick={() => (window.location.href = "/calendar")}
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Verbinden
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Time Display */}
        <div className="text-right">
          <p className="text-gray-700">
            Totaal geplande tijd:{" "}
            <span className="font-bold">{calculateTotalTime()} minuten</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanningEditor;
