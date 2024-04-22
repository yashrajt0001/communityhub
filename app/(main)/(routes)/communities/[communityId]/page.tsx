import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface CommunityIdPageProps {
  params: {
    communityId: string;
  };
}

const CommunityIdPage = async ({ params }: CommunityIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const community = await db.community.findUnique({
    where: {
      id: params.communityId,
      Members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      Channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initialChannel = community?.Channels[0];

  if (initialChannel?.name !== "general") {
    return null;
  }

  return redirect(`/communities/${params.communityId}/channels/${initialChannel?.id}`);
};

export default CommunityIdPage;
