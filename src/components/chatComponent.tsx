import React, { useRef, useEffect } from "react";
import { Textarea } from "./ui/textarea";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { CornerDownLeft, Loader2, TextSearch } from "lucide-react";
import { Badge } from "./ui/badge";
import Messages from "./messages";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import Markdown from "./markdown";

type Props = {
  confirm: string;
  namespace: string;
};

const ChatComponent = ({ confirm, namespace }: Props) => {
  const { messages, input, handleInputChange, handleSubmit, isLoading, data } =
    useChat({
      api: "api/notebookchat",
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-full bg-muted/50 relative flex flex-col min-h-[50vh] rounded-xl p-4">
      <Badge
        variant={"outline"}
        className={`absolute right-3 top-1.5 ${
          confirm ? "bg-[#00B612]" : "bg-red-700"
        }`}
      >
        {confirm ? "✓ Notebook has been Added" : "Add Notebook!"}
      </Badge>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto scrollbar-hide mb-4 space-y-4">
        <Messages messages={messages} isLoading={isLoading} />
        <div ref={messagesEndRef} /> {/* Scroll anchor */}
        
        {data?.length !== undefined && data.length > 0 && (
          <Accordion type="single" className="text-sm" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <span className="flex flex-row items-center gap-2">
                  <TextSearch /> Relevant Info
                </span>
              </AccordionTrigger>
              <AccordionContent className="whitespace-pre-wrap">
                <Markdown
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  text={(data[data.length - 1] as any).retrievals as string}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>

      {/* Input Form - Fixed at bottom */}
      <form
        className="relative overflow-hidden rounded-lg border bg-background mt-auto"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit(event, {
            data: {
              namespace: namespace as string,
            },
          });
        }}
      >
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Type your Question here..."
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center p-3 pt-0">
          <Button
            disabled={confirm ? false :true }
            type="submit"
            size="sm"
            className="ml-auto bg-[#f37b2d] "
            style={{
              cursor: confirm ? "pointer" : "not-allowed"
            }}
          >
            {isLoading ? "Analysing..." : "Ask"}
            {isLoading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <CornerDownLeft className="size-3.5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
