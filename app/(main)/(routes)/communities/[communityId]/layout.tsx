import { CommunitySidebar } from "@/components/community/CommunitySidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const CommunityIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { communityId: string };
}) => {
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
  });

  if (!community) {
    redirect("/");
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
              <CommunitySidebar communityId={params.communityId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default CommunityIdLayout;
