import { InitialModal } from "@/components/modals/initial-modal";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

const page = async () => {
  const profile = await initialProfile();

  const community = await db.community.findFirst({
    where: {
      Members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (community) {
    redirect(`/communities/${community.id}`);
  }
  return (
    <div>
      <InitialModal/>
    </div>
  );
};

export default page;
