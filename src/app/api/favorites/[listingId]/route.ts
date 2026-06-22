import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import getCurrentUser from "@/actions/getCurrentUser";

interface IParams {
  listingId?: string;
}

export async function POST(
  request: Request, 
  { params }: { params: Promise<IParams> }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const p = await params;
  const { listingId } = p;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID');
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])];

  favoriteIds.push(listingId);

  await connectToDatabase();

  const user = await User.findByIdAndUpdate(
    currentUser._id,
    { favoriteIds },
    { new: true }
  ).lean() as any;

  return NextResponse.json({ ...user, id: user._id.toString() });
}

export async function DELETE(
  request: Request, 
  { params }: { params: Promise<IParams> }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const p = await params;
  const { listingId } = p;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID');
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])];

  favoriteIds = favoriteIds.filter((id) => id !== listingId);

  await connectToDatabase();

  const user = await User.findByIdAndUpdate(
    currentUser._id,
    { favoriteIds },
    { new: true }
  ).lean() as any;

  return NextResponse.json({ ...user, id: user._id.toString() });
}
