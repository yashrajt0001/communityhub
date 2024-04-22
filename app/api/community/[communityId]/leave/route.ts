import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { communityId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.communityId) {
      return new NextResponse("Community ID missing", { status: 400 });
    }

    const community = await db.community.update({
      where: {
        id: params.communityId,
        profileId: {
          not: profile.id,
        },
        Members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        Members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(community);
  } catch (error) {
    console.log("server id leave:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
