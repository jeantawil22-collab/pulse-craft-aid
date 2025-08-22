import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff,
  Zap,
  Target,
  TrendingUp,
  Clock,
  Trophy,
  Heart,
  Brain
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AICoachProps {
  user: any;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'achievement' | 'warning';
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  }>;
}

interface CoachingInsight {
  id: string;
  type: 'performance' | 'nutrition' | 'recovery' | 'motivation';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  icon: React.ElementType;
}

export const AICoach: React.FC<AICoachProps> = ({ user }) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hey ${user.name.split(' ')[0]}! 👋 I'm your AI fitness coach. I've analyzed your progress and I'm here to help optimize your workouts, nutrition, and recovery. What would you like to work on today?`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [insights] = useState<CoachingInsight[]>([
    {
      id: '1',
      type: 'performance',
      title: 'Plateau Detection',
      description: 'Your bench press has plateaued. Consider deload week or form adjustment.',
      priority: 'high',
      icon: TrendingUp
    },
    {
      id: '2',
      type: 'nutrition',
      title: 'Protein Timing',
      description: 'Optimize post-workout protein within 30 minutes for better recovery.',
      priority: 'medium',
      icon: Target
    },
    {
      id: '3',
      type: 'recovery',
      title: 'Sleep Pattern',
      description: 'Your 6.2hr average sleep may be limiting recovery. Aim for 7-9 hours.',
      priority: 'high',
      icon: Clock
    },
    {
      id: '4',
      type: 'motivation',
      title: 'Streak Achievement',
      description: 'Amazing! 5-day workout streak. Keep the momentum going!',
      priority: 'medium',
      icon: Trophy
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): Message => {
    const responses = [
      {
        content: "Based on your recent workouts, I recommend focusing on progressive overload. Try increasing your squat weight by 5lbs next session while maintaining perfect form.",
        type: 'suggestion' as const,
        actions: [
          {
            label: "Update Workout Plan",
            action: () => toast({ title: "Workout plan updated with new recommendations!" }),
            variant: 'default' as const
          }
        ]
      },
      {
        content: "Your nutrition timing could be optimized! I notice you're not eating enough protein post-workout. Would you like me to create a post-workout meal plan?",
        type: 'suggestion' as const,
        actions: [
          {
            label: "Create Meal Plan",
            action: () => toast({ title: "Personalized meal plan created!" }),
            variant: 'default' as const
          },
          {
            label: "Set Reminders",
            action: () => toast({ title: "Nutrition reminders activated!" }),
            variant: 'outline' as const
          }
        ]
      },
      {
        content: "Congratulations! You've maintained a 5-day workout streak. Your consistency is paying off - I can see improvements in your form and endurance. 🏆",
        type: 'achievement' as const
      },
      {
        content: "I've analyzed your sleep patterns and noticed you're averaging only 6.2 hours per night. Poor sleep can reduce muscle protein synthesis by 18% and increase cortisol levels. Let's work on your sleep hygiene.",
        type: 'warning' as const,
        actions: [
          {
            label: "Sleep Optimization Tips",
            action: () => toast({ title: "Sleep improvement guide sent to your dashboard!" }),
            variant: 'default' as const
          }
        ]
      }
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];
    return {
      id: Date.now().toString(),
      sender: 'ai',
      timestamp: new Date(),
      ...response
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input implementation would go here
    toast({
      title: isListening ? "Voice input stopped" : "Voice input started",
      description: isListening ? "Processing your voice message..." : "Speak your question or concern"
    });
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'performance': return 'text-primary';
      case 'nutrition': return 'text-nutrition';
      case 'recovery': return 'text-progress';
      case 'motivation': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const getInsightBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const quickActions = [
    { label: "Analyze My Progress", icon: TrendingUp },
    { label: "Plan Next Workout", icon: Target },
    { label: "Nutrition Check", icon: Heart },
    { label: "Recovery Assessment", icon: Brain }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {/* AI Coaching Insights */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Smart Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight) => (
            <Card key={insight.id} className="p-3 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${getInsightColor(insight.type)}`}>
                  <insight.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <Badge variant={getInsightBadge(insight.priority)} className="text-xs">
                      {insight.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            </Card>
          ))}

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 h-auto p-2"
                  onClick={() => setInputMessage(action.label)}
                >
                  <action.icon className="h-3 w-3" />
                  <span className="text-xs">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Chat Interface */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-accent" />
            AI Fitness Coach
            <Badge variant="secondary" className="ml-auto">
              <Zap className="h-3 w-3 mr-1" />
              Smart Mode
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px] px-6">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'ai' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-primary text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-last' : ''}`}>
                    <div
                      className={`p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : message.type === 'achievement'
                          ? 'bg-success/10 border border-success/20'
                          : message.type === 'warning'
                          ? 'bg-warning/10 border border-warning/20'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      
                      {message.actions && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {message.actions.map((action, index) => (
                            <Button
                              key={index}
                              size="sm"
                              variant={action.variant || 'default'}
                              onClick={action.action}
                              className="text-xs"
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-1 px-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  {message.sender === 'user' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-secondary">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-primary text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
          
          {/* Chat Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask your AI coach anything..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleVoiceInput}
                className={isListening ? 'bg-destructive text-destructive-foreground' : ''}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {['How can I improve?', 'Plan my week', 'Nutrition advice', 'Form check'].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => setInputMessage(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};