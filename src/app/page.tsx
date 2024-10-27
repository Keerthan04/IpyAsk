"use client";

import ChatComponent from "@/components/chatComponent";
import { ModeToggle } from "@/components/ModeToggle";
import NotebookComponent from "@/components/NotebookComponent";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { toast } from "@/hooks/use-toast";
// import { useToast } from "@/hooks/use-toast";
import { LogIn, Settings } from "lucide-react";
import React, { ChangeEvent, useState } from "react";


const Home = () => {
  const [base64Data, setBase64Data] = useState("");
  const [namespace,setnamespace] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const [confirm,setconfirm] = useState("");
  function handleReportSelection(event: ChangeEvent<HTMLInputElement>): void {
    if (!event.target.files) return;
    const file = event.target.files[0];

    if (file) {
      let isValidDoc = false;
      const validDocs = ["application/json"];
      const validExtensions = [".ipynb"];

      if (
        validDocs.includes(file.type) ||
        validExtensions.includes(file.name.slice(-6))
      ) {
        isValidDoc = true;
      }

      if (!isValidDoc) {
        toast({
          variant: "destructive",
          description: "Unsupported file type! Please upload a .ipynb file.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const jsonString = reader.result as string;
        const base64String = btoa(unescape(encodeURIComponent(jsonString)));
        setBase64Data(base64String);
      };

      reader.readAsText(file);
    }
  }
  async function extractDetails(): Promise<void> {
    if (!base64Data) {
      toast({
        variant: "destructive",
        description:
          "Upload a valid notebook! Please ensure the notebook is in .ipynb format.",
      });
      return;
    }
    setIsLoading(true);

    const response = await fetch("api/extractnotebookgemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        base64: base64Data,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("data is \n",data);
      setnamespace(data.namespace);
      setconfirm("Notebook has been Added")
      toast({
        variant: "default",
        description: "Notebook Updated Successfully you can now Chat!!!",
      });
    } else {
      toast({
        variant: "destructive",
        description: "Failed to extract details from the notebook.",
      });
    }

    setIsLoading(false);
  }

  return (
    <div className="grid h-screen w-full">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-[57px] bg-background items-center gap-1 border-b px-4">
          <h1 className="text-xl font-semibold flex text-[#F37B2D]">
            <LogIn />
            <span className="flex flex-row">ipyAsk</span>
          </h1>
          <div className="w-full flex flex-row justify-end gap-2">
            <ModeToggle />
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Settings className="h-[1.2rem] w-[1.2rem]" />
                  <span className="sr-only">Settings</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[80vh]">
                <NotebookComponent
                  handleReportSelection={handleReportSelection}
                  extractDetails={extractDetails}
                />
              </DrawerContent>
            </Drawer>
          </div>
        </header>
        <main
          className="grid flex-1 gap-4 overflow-auto p-4
        md:grid-cols-2
        lg:grid-cols-3"
        >
          <div className="hidden md:flex flex-col">
            {/* <SideComponent onReportConfirmation={onReportConfirmation} /> */}
            <NotebookComponent
              handleReportSelection={handleReportSelection}
              extractDetails={extractDetails}
            />
          </div>
          <div className="lg:col-span-2">
            <ChatComponent
              confirm={confirm}
              namespace={namespace}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
