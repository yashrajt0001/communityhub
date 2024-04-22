import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { error } from "console";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { content, fileUrl } = req.body;
    const { communityId, channelId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "unauthorized" });
    }
    if (!communityId) {
      return res.status(400).json({ error: "community Id missing" });
    }
    if (!channelId) {
      return res.status(400).json({ error: "channel Id missing" });
    }
    if (!content) {
      return res.status(400).json({ error: "content Id missing" });
    }

    const community = await db.community.findFirst({
      where: {
        id: communityId as string,
        Members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        Members: true,
      },
    });

    if (!community) {
      return res.status(404).json({ error: "community not found" });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        communityId: communityId as string,
      },
    });

    if (!channel) {
      return res.status(404).json({ error: "channel not found" });
    }

    const member = community.Members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) {
      return res.status(404).json({ error: "member not found" });
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
        memberId: member.id,
      },
      include: {
        Member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelId}:messages`;
    res.socket.server.io.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log(error);
  }
}