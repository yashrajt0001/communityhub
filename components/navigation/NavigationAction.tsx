"use client";

import { Plus } from "lucide-react";
import { ActionTooltip } from "../ActionTooltip";
import { useModal } from "@/hooks/use-modal-store";

export const NavigationAction = () => {
  const { onOpen, isOpen } = useModal();
  const handleClick = () => {
    onOpen("createCommunity");
  };
  return (
    <div>
      <ActionTooltip side="right" align="center" label="Add a community">
        <button onClick={handleClick} className="group flex items-center">
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-orange-500">
            <Plus
              className="group-hover:text-white transition text-orange-500"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
