import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { communityId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unathorized", { status: 401 });
    }

    const { name, imageUrl } = await req.json();

    const community = await db.community.update({
      where: {
        id: params.communityId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(community);
  } catch (error) {
    console.log("communityId patch:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { communityId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const community = await db.community.delete({
      where: {
        id: params.communityId,
        profileId: profile.id,
      },
    });

    return NextResponse.json(community);
  } catch (error) {
    console.log("community id delete", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
