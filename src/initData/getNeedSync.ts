import { PackageManifest } from "@/hooks/useManifest";
import { isEqual } from "lodash";

export async function getNeedSync(pkg: PackageManifest) {
  // versions 强制不缓存，确保实时性
  const sourceRegistryInfo = await fetch(
    `https://registry.npmjs.org/${pkg.name}`,
    {
      next: {
        revalidate: 0,
      },
    }
  ).then((res) => res.json());

  // dist-tag 一致，版本也一致，就认为不需要同步
  const alreadySync =
    isEqual(pkg?.['dist-tags'], sourceRegistryInfo?.['dist-tags']) &&
    isEqual(
      Object.keys(pkg?.versions || {}),
      Object.keys(sourceRegistryInfo?.versions || {})
    );


  return !alreadySync;
};
