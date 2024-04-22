import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { MessageCircle, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { CommunityHeader } from "./CommunityHeader";
import { CommunitySection } from "./CommunitySection";
import { CommunityChannel } from "./CommunityChannel";
import { CommunityMember } from "./CommunityMembers";

interface CommunitySidebarProps {
  communityId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <MessageCircle className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
};

export const CommunitySidebar = async ({ communityId }: CommunitySidebarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const community = await db.community.findUnique({
    where: {
      id: communityId,
    },
    include: {
      Channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      Members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const textChannels = community?.Channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = community?.Channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = community?.Channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );
  const members = community?.Members.filter(
    (Member) => Member.profileId !== profile.id
  );

  if (!community) {
    return redirect("/");
  }

  const role = community.Members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <CommunityHeader community={community} role={role} />
      <ScrollArea className="flex-1 px-3">
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <CommunitySection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels"
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => (
                <CommunityChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  community={community}
                />
              ))}
            </div>
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <CommunitySection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Voice Channels"
            />
            <div className="space-y-[2px]">
              {audioChannels.map((channel) => (
                <CommunityChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  community={community}
                />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <CommunitySection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video Channels"
            />
            <div className="space-y-[2px]">
              {videoChannels.map((channel) => (
                <CommunityChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  community={community}
                />
              ))}
            </div>
          </div>
        )}
        {!!members?.length && (
          <div className="mb-2">
            <CommunitySection
              sectionType="members"
              role={role}
              label="Members"
              community={community}
            />
            <div className="space-y-[2px]">
              {members.map((member) => (
                <CommunityMember key={member.id} member={member} community={community} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
