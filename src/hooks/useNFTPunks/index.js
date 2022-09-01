import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import { nftPunksArtifact } from "../../config/artifacts/NftPunks";

const { address, abi } = nftPunksArtifact;

export const useNFTPunks = () => {
  const { active, library, chainId } = useWeb3React();

  const nftPunks = useMemo(() => {
    if (active) return new library.eth.Contract(abi, address[chainId]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, chainId, library?.eth?.Contract]);

  return nftPunks;
};
