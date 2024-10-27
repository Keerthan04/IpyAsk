import React from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import Markdown from "./markdown";

type Props = {
  role: string;
  content: string;
};

const MessageBox = ({ role, content }: Props) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 text-sm">
        {/* {content} */}
        <Markdown text={content} />
      </CardContent>
      {role !== "user" && (
        <CardFooter className="border-t bg-muted/50 px-6 py-3 text-xs text-muted-foreground">
          Disclaimer: This AI assistant analyzes Python notebooks and provides
          coding suggestions. While we strive for accuracy, please review all
          code suggestions thoroughly before implementation. This tool is meant
          for educational purposes and should be used alongside good programming
          practices and proper code review.
        </CardFooter>
      )}
    </Card>
  );
};

export default MessageBox;
