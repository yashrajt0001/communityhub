import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.inviteCode) {
    return redirect("/");
  }

  const existingCommunity = await db.community.findFirst({
    where: {
      inviteCode: params.inviteCode,
      Members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingCommunity) {
    return redirect(`/communities/${existingCommunity.id}`);
  }

  const community = await db.community.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      Members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (community) {
    return redirect(`/communities/${community.id}`);
  }

  return null;
};

export default InviteCodePage;
