"use client";

import { useEffect, useState } from "react";
import { CreateCommunityModal } from "../modals/create-community-modal";
import { InviteModal } from "../modals/invite-modal";
import { EditCommunityModal } from "../modals/edit-community-modal";
import { MembersModal } from "../modals/members-modal";
import { CreateChannelModal } from "../modals/create-channel-modal";
import { LeaveCommunityModal } from "../modals/leave-community-modal";
import { DeleteCommunityModal } from "../modals/delete-community-modal";
import { DeleteChannelModal } from "../modals/delete-channel-modal";
import { EditChannelModal } from "../modals/edit-channel-modal";
import { MessageFileModal } from "../modals/message-file-modal";
import { DeleteMessageModal } from "../modals/delete-message-modal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateCommunityModal />
      <InviteModal />
      <EditCommunityModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveCommunityModal />
      <DeleteCommunityModal />
      <DeleteChannelModal />
      <EditChannelModal />
      <MessageFileModal />
      <DeleteMessageModal/>
    </>
  );
};

export default ModalProvider;
