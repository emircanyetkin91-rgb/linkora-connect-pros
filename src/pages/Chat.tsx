import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from '@/components/MessageBubble';
import { EmptyState } from '@/components/EmptyState';
import { useAppStore } from '@/hooks/useAppStore';
import { getMatchedUser } from '@/lib/store';
import { Send, ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Chat() {
  const { state, updateState } = useAppStore();
  const [messageText, setMessageText] = useState('');
  const [showMatchList, setShowMatchList] = useState(true);
  const isMobile = useIsMobile();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !state.selectedMatchId) return;

    const message = {
      id: Date.now().toString(),
      senderId: state.me.id,
      text: messageText.trim(),
      createdAt: new Date().toISOString()
    };

    updateState(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [state.selectedMatchId!]: [
          ...(prev.messages[state.selectedMatchId!] || []),
          message
        ]
      }
    }));

    setMessageText('');
  };

  const selectedMatch = state.matches.find(m => m.id === state.selectedMatchId);
  const selectedUser = selectedMatch ? getMatchedUser(state, selectedMatch.id) : null;
  const messages = state.selectedMatchId ? state.messages[state.selectedMatchId] || [] : [];

  if (state.matches.length === 0) {
    return (
      <div className={`${isMobile ? 'h-full flex flex-col' : 'min-h-screen'} bg-background`}>
        <div className={`${isMobile ? 'flex-1 flex items-center justify-center' : ''} mx-auto max-w-md px-4 py-12`}>
          <EmptyState
            icon="💬"
            title="No matches yet"
            description="Like a few profiles to start conversations with your matches."
          />
        </div>
      </div>
    );
  }

  if (isMobile) {
    // Mobile: Single view with back button
    if (state.selectedMatchId && !showMatchList) {
      return (
        <div className="flex h-screen bg-background flex-col">
          {/* Header */}
          <div className="flex items-center border-b border-border bg-background p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMatchList(true)}
              className="mr-3 p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            {selectedUser && (
              <div className="flex items-center">
                <img
                  src={selectedUser.photos[0]}
                  alt={selectedUser.name}
                  className="h-10 w-10 rounded-full object-cover mr-3"
                />
                <div>
                  <h3 className="text-heading-small">{selectedUser.name}</h3>
                  <span className="text-xs bg-grey-100 text-grey-700 px-2 py-1 rounded-full">
                    {selectedMatch?.connectionType}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isMe={message.senderId === state.me.id}
                />
              ))}
            </div>
          </ScrollArea>

          {/* Message composer */}
          <form onSubmit={handleSendMessage} className="border-t border-border bg-background p-4">
            <div className="flex gap-2">
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button type="submit" disabled={!messageText.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      );
    }

    // Mobile: Match list
    return (
      <div className="h-full flex flex-col bg-background">
        <ScrollArea className="flex-1">
          <div className="p-4 pb-safe-area-inset-bottom">
            <h2 className="text-heading-medium mb-4">Your Matches</h2>
            <div className="space-y-3">
              {state.matches.map((match) => {
                const user = getMatchedUser(state, match.id);
                if (!user) return null;

                const lastMessage = (state.messages[match.id] || []).slice(-1)[0];

                return (
                  <div
                    key={match.id}
                    onClick={() => {
                      updateState(prev => ({ ...prev, selectedMatchId: match.id }));
                      setShowMatchList(false);
                    }}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 cursor-pointer hover:bg-muted transition-colors"
                  >
                    <img
                      src={user.photos[0]}
                      alt={user.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-heading-small truncate">{user.name}</h3>
                        <span className="text-xs bg-grey-100 text-grey-700 px-2 py-1 rounded-full">
                          {match.connectionType}
                        </span>
                      </div>
                      {lastMessage && (
                        <p className="text-body-small text-muted-foreground truncate">
                          {lastMessage.text}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Desktop: Split view
  return (
    <div className="h-screen bg-background">
      <div className="mx-auto max-w-4xl h-full flex">
        {/* Matches list */}
        <div className="w-80 border-r border-border bg-background">
          <div className="p-4 border-b border-border">
            <h2 className="text-heading-medium">Matches</h2>
          </div>
          <ScrollArea className="h-full pb-20">
            {state.matches.map((match) => {
              const user = getMatchedUser(state, match.id);
              if (!user) return null;

              const lastMessage = (state.messages[match.id] || []).slice(-1)[0];
              const isSelected = state.selectedMatchId === match.id;

              return (
                <div
                  key={match.id}
                  onClick={() => updateState(prev => ({ ...prev, selectedMatchId: match.id }))}
                  className={`flex items-center gap-3 p-4 cursor-pointer border-b border-border transition-colors ${
                    isSelected ? 'bg-muted' : 'hover:bg-muted/50'
                  }`}
                >
                  <img
                    src={user.photos[0]}
                    alt={user.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-heading-small truncate">{user.name}</h3>
                      <span className="text-xs bg-grey-100 text-grey-700 px-2 py-1 rounded-full">
                        {match.connectionType}
                      </span>
                    </div>
                    {lastMessage && (
                      <p className="text-body-small text-muted-foreground truncate">
                        {lastMessage.text}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat header */}
              <div className="flex items-center border-b border-border bg-background p-4">
                <img
                  src={selectedUser.photos[0]}
                  alt={selectedUser.name}
                  className="h-10 w-10 rounded-full object-cover mr-3"
                />
                <div>
                  <h3 className="text-heading-small">{selectedUser.name}</h3>
                  <span className="text-xs bg-grey-100 text-grey-700 px-2 py-1 rounded-full">
                    {selectedMatch?.connectionType}
                  </span>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-2">
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isMe={message.senderId === state.me.id}
                    />
                  ))}
                </div>
              </ScrollArea>

              {/* Message composer */}
              <form onSubmit={handleSendMessage} className="border-t border-border bg-background p-4">
                <div className="flex gap-2">
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!messageText.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon="💬"
                title="Select a match"
                description="Choose a match from the list to start chatting."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}