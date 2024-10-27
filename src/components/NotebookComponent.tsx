import React, { ChangeEvent } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
// import { useToast } from "@/hooks/use-toast";
import { Github, Linkedin, Instagram, Sparkles, Code, BookOpen } from "lucide-react";

type Props = {
  handleReportSelection: (event: ChangeEvent<HTMLInputElement>) => void;
  extractDetails: () => void;
};

const NotebookComponent = (
  {handleReportSelection,extractDetails}:Props
) => {
  // const { toast } = useToast();
  // const [base64Data, setBase64Data] = useState("");
  // const [isLoading, setIsLoading] = useState(false);

  // function handleReportSelection(event: ChangeEvent<HTMLInputElement>): void {
  //   if (!event.target.files) return;
  //   const file = event.target.files[0];

  //   if (file) {
  //     let isValidDoc = false;
  //     const validDocs = ["application/json"];
  //     const validExtensions = [".ipynb"];

  //     if (
  //       validDocs.includes(file.type) ||
  //       validExtensions.includes(file.name.slice(-6))
  //     ) {
  //       isValidDoc = true;
  //     }

  //     if (!isValidDoc) {
  //       toast({
  //         variant: "destructive",
  //         description: "Unsupported file type! Please upload a .ipynb file.",
  //       });
  //       return;
  //     }

  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const jsonString = reader.result as string;
  //       const base64String = btoa(unescape(encodeURIComponent(jsonString)));
  //       setBase64Data(base64String);
  //     };

  //     reader.readAsText(file);
  //   }
  // }

  // async function extractDetails(): Promise<void> {
  //   if (!base64Data) {
  //     toast({
  //       variant: "destructive",
  //       description:
  //         "Upload a valid notebook! Please ensure the notebook is in .ipynb format.",
  //     });
  //     return;
  //   }
  //   setIsLoading(true);

  //   const response = await fetch("api/extractnotebookgemini", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       base64: base64Data,
  //     }),
  //   });

  //   if (response.ok) {
  //     toast({
  //       variant: "default",
  //       description: "Notebook Updated Successfully you can now Chat!!!",
  //     });
      
  //   } else {
  //     toast({
  //       variant: "destructive",
  //       description: "Failed to extract details from the notebook.",
  //     });
  //   }

  //   setIsLoading(false);
  // }

  return (
    <div className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
      <fieldset className="relative grid gap-6 rounded-lg border p-4">
        <legend className="text-sm font-medium">Notebook</legend>
        {/* {isLoading && (
          <div className="absolute z-10 h-full w-full rounded-lg bg-card/90 flex flex-row items-center justify-center">
            extracting...
          </div>
        )} */}

        {/* Instructions Section */}
        <div className="space-y-8 mb-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              Notebook AI Assistant
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Say goodbye to copy-pasting code into ChatGPT! Our platform lets
              you upload your Jupyter notebooks directly and get instant,
              contextual answers powered by RAG and Gemini AI. Get detailed
              explanations, debug help, and code insights - all while keeping
              your notebook&apos;s context intact.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Smart Context</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Our RAG system understands your entire notebook, including code,
                comments, and outputs
              </p>
            </div>

            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Code className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Code Aware</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Get precise answers about your specific implementation and
                coding patterns
              </p>
            </div>

            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Gemini Powered</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Leveraging Google&apos;s Gemini AI for accurate and helpful
                coding assistance
              </p>
            </div>
          </div>

          {/* How it Works Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span>How it works:</span>
              <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                Simple steps
              </span>
            </h3>
            <ol className="space-y-2 list-decimal pl-4">
              <li className="text-sm text-muted-foreground">
                Upload your Python notebook (.ipynb file)
              </li>
              <li className="text-sm text-muted-foreground">
                Wait for the magic to work ✨
              </li>
              <li className="text-sm text-muted-foreground">
                Ask questions related to your notebook and get instant answers!
              </li>
            </ol>
          </div>

          {/* Pro Tip */}
          <div className="bg-primary/5 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Pro Tip:</span> Add detailed
              markdown cells and code comments in your notebook for even more
              accurate and context-aware responses!
            </p>
          </div>
        </div>

        <Input type="file" onChange={handleReportSelection} />

        <Button className="bg-[#f37b2d]" onClick={extractDetails}>
          Upload Notebook
        </Button>

        {/* Social Links */}
        <div className="border-t pt-4 mt-4">
          <Label className="mb-4 block text-center">
            Connect And Contribute
          </Label>
          <div className="flex flex-row items-center justify-center gap-6">
            <a
              href="https://github.com/Keerthan04/IpyAsk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-6 w-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/keerthan-kumar-c-0478a1257"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a
              href="https://instagram.com/keerthan_kumar_c"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-6 w-6" />
            </a>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default NotebookComponent;
