import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Farmer, Language, ChatMessage } from "@/types";
import { useTranslation } from "@/lib/i18n";
import { AuthService } from "@/lib/auth";
import { MessageService } from "@/lib/storage";
import FloatingLanguageSelector from "@/components/FloatingLanguageSelector";
import ChatInterface from "@/components/ChatInterface";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Leaf,
  ArrowLeft,
  MessageCircle,
  Send,
  Users,
  Clock,
} from "lucide-react";

const Messages = () => {
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const { t } = useTranslation(selectedLanguage);

  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser || currentUser.type !== "farmer") {
      navigate("/");
      return;
    }

    const farmerUser = currentUser as Farmer;
    setFarmer(farmerUser);
    setSelectedLanguage(farmerUser.language);

    // Load conversations
    const userConversations = MessageService.getConversations(farmerUser.id);
    setConversations(userConversations);
  }, [navigate]);

  useEffect(() => {
    if (selectedConversation && farmer) {
      const conversationMessages = MessageService.getConversationMessages(
        farmer.id,
        selectedConversation,
      );
      setMessages(conversationMessages);

      // Mark messages as read
      MessageService.markMessagesAsRead(farmer.id, selectedConversation);
    }
  }, [selectedConversation, farmer]);

  const handleSendMessage = (
    message: string,
    messageType: "text" | "image" = "text",
    imageUrl?: string,
  ) => {
    if (!selectedConversation || !farmer) return;

    MessageService.createMessage({
      senderId: farmer.id,
      receiverId: selectedConversation,
      message,
      messageType,
      imageUrl,
    });

    // Refresh messages
    const conversationMessages = MessageService.getConversationMessages(
      farmer.id,
      selectedConversation,
    );
    setMessages(conversationMessages);
  };

  const formatTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString(
        selectedLanguage === "hi" ? "hi-IN" : "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
        },
      );
    } catch {
      return timestamp;
    }
  };

  if (!farmer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/farmer/dashboard")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("back")}
              </Button>
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-green-800">
                  {t("messages.title")}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Conversations
              </CardTitle>
              <CardDescription>Your recent chats with buyers</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                {conversations.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-2">
                      {t("messages.no.conversations")}
                    </p>
                    <p className="text-sm text-gray-500">
                      Buyers will reach out when interested in your crops
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.otherUserId}
                        className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 border-b ${
                          selectedConversation === conversation.otherUserId
                            ? "bg-green-50 border-l-4 border-l-green-500"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedConversation(conversation.otherUserId)
                        }
                      >
                        <Avatar>
                          <AvatarFallback className="bg-blue-100 text-blue-800">
                            {conversation.otherUserName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900 truncate">
                              {conversation.otherUserName}
                            </p>
                            <div className="flex items-center gap-2">
                              {conversation.unreadCount > 0 && (
                                <Badge className="bg-green-500">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                              <span className="text-xs text-gray-500">
                                {formatTime(conversation.lastMessage.timestamp)}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <ChatInterface
                messages={messages}
                currentUserId={farmer.id}
                otherUserName={
                  conversations.find(
                    (c) => c.otherUserId === selectedConversation,
                  )?.otherUserName || "User"
                }
                onSendMessage={handleSendMessage}
                language={selectedLanguage}
                className="h-[600px]"
              />
            ) : (
              <Card className="bg-white/90 backdrop-blur-sm h-[600px] flex items-center justify-center">
                <CardContent>
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-600">
                      Choose a conversation from the left to start chatting
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Floating Language Selector */}
      <FloatingLanguageSelector
        currentLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />
    </div>
  );
};

export default Messages;
