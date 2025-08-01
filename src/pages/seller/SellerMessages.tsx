import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Language, ChatMessage } from "@/types";
import { useTranslation } from "@/lib/i18n";
import { AuthService } from "@/lib/auth";
import { MessageService } from "@/lib/storage";
import FloatingLanguageSelector from "@/components/FloatingLanguageSelector";
import { ChatInterface } from "@/components/ChatInterface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageCircle, Search, Send, User } from "lucide-react";

const SellerMessages = () => {
  const navigate = useNavigate();
  const [seller, setSeller] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const { t } = useTranslation(selectedLanguage);

  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser || currentUser.type !== "seller") {
      navigate("/");
      return;
    }

    setSeller(currentUser);
    setSelectedLanguage(currentUser.language);

    // Load conversations for seller
    const userConversations = MessageService.getConversations(currentUser.id);

    // Get farmer names from the auth service for each conversation
    const allUsers = JSON.parse(
      localStorage.getItem("sabziverse_users") || "[]",
    );
    const enhancedConversations = userConversations.map((conv) => {
      const farmerUser = allUsers.find(
        (user: any) => user.id === conv.otherUserId,
      );
      return {
        farmerId: conv.otherUserId,
        farmerName: farmerUser ? farmerUser.name : "Unknown Farmer",
        lastMessage: conv.lastMessage?.message || "No messages yet",
        lastMessageTime:
          conv.lastMessage?.timestamp || new Date().toISOString(),
        unreadCount: conv.unreadCount,
      };
    });

    setConversations(enhancedConversations);
  }, [navigate]);

  useEffect(() => {
    if (selectedConversation && seller) {
      const conversationMessages = MessageService.getConversationMessages(
        seller.id,
        selectedConversation,
      );
      setMessages(conversationMessages);

      // Mark messages as read
      MessageService.markMessagesAsRead(seller.id, selectedConversation);
    }
  }, [selectedConversation, seller]);

  const filteredConversations = conversations.filter((conv) =>
    conv.farmerName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!seller) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/seller/dashboard")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-800">
                  {t("messages.title")}
                </h1>
                <p className="text-sm text-blue-600">
                  Chat with farmers about their crops
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 h-[calc(100vh-160px)] sm:h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Conversations
              </CardTitle>
              <CardDescription>
                Your chats with farmers ({conversations.length})
              </CardDescription>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search farmers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-2">
                    {searchQuery
                      ? "No conversations found"
                      : "No conversations yet"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {searchQuery
                      ? "Try a different search term"
                      : "Start chatting with farmers through crop listings"}
                  </p>
                </div>
              ) : (
                <div className="max-h-64 sm:max-h-96 overflow-y-auto">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.farmerId}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation === conversation.farmerId
                          ? "bg-blue-50 border-r-4 border-r-blue-500"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedConversation(conversation.farmerId)
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-green-100 text-green-800">
                            {conversation.farmerName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {conversation.farmerName}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(
                              conversation.lastMessageTime,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-blue-600">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-lg border shadow-sm h-full">
                <ChatInterface
                  messages={messages}
                  currentUserId={seller.id}
                  otherUserName={
                    conversations.find(
                      (c) => c.farmerId === selectedConversation,
                    )?.farmerName || "Farmer"
                  }
                  onSendMessage={(message: string) => {
                    if (!selectedConversation || !seller) return;

                    MessageService.createMessage({
                      senderId: seller.id,
                      receiverId: selectedConversation,
                      cropId: "",
                      message: message.trim(),
                    });

                    // Refresh messages
                    const conversationMessages =
                      MessageService.getConversationMessages(
                        seller.id,
                        selectedConversation,
                      );
                    setMessages(conversationMessages);
                  }}
                  language={selectedLanguage}
                />
              </div>
            ) : (
              <Card className="bg-white/90 backdrop-blur-sm h-full">
                <CardContent className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Choose a farmer from the left to start chatting
                    </p>
                    <div className="text-sm text-gray-500">
                      <p>💡 Tip: Start conversations by contacting farmers</p>
                      <p>through their crop listings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Floating Language Selector */}
      <FloatingLanguageSelector
        currentLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />
    </div>
  );
};

export default SellerMessages;
