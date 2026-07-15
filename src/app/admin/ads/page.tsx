import { getAdminAdBanners } from "@/actions/admin/adminAdBanners";
import AdsClient from "./AdsClient";

export const dynamic = "force-dynamic";

export default async function AdminAdsPage() {
  const result = await getAdminAdBanners();
  const adBanners = result.success ? result.data : [];

  return <AdsClient initialBanners={adBanners} />;
}
