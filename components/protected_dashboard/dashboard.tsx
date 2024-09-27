"use client";

import React, { useEffect, useState } from "react";
import ActionsPane from "./ActionsPane";
import DashboardPane from "./DashboardPane";
import Action from "./Action";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

/**
 *
 * @param actions: a string state of type Action
 * @returns UI
 */

interface DashboardProps {
  actions: Actions[];
  title: string;
}

export default function Dashboard({ actions, title }: DashboardProps) {
  const [displayAction, setDisplayAction] = useState<string>("");

  useEffect(() => {
    if (displayAction === "") {
      setDisplayAction(actions[0].name);
    }
  }, [actions]);

  return (
    <div className="flex-1 h-full flex flex-col">
      <div className=" flex-1 flex flex-col md:flex-row w-full border-t-2">
        <div className="md:hidden">
        <Sheet>
          <SheetTrigger className="p-3 self-end">
            <Menu />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Actions</SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>
            <ActionsPane titleRemoved={true}>
              {actions.map((action) => (
                <Action
                  key={action.name}
                  name={action.name}
                  actionFunction={setDisplayAction}
                  displayAction={displayAction}
                />
              ))}
            </ActionsPane>
          </SheetContent>
        </Sheet>
        </div>

        <ActionsPane hidden={true}>
          {actions.map((action) => (
            <Action
              key={action.name}
              name={action.name}
              actionFunction={setDisplayAction}
              displayAction={displayAction}
            />
          ))}
        </ActionsPane>

        <DashboardPane title={title}>
          {actions.find((action) => action.name === displayAction)
            ?.component || <div></div>}
        </DashboardPane>
      </div>
    </div>
  );
}
